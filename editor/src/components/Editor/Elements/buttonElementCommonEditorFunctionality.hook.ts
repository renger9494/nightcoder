import { computed, ComputedRef } from '@vue/composition-api';
import useBorderEditor from '@/hooks/editor/visual/border.editor.hook';
import useColorEditor from '@/hooks/editor/visual/color.editor.hook';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import useBoxShadowEditor from '@/hooks/editor/visual/boxShadow.editor.hook';
import { LinkType } from '@/constants/link';

/**
 *
 * @param element - part of user config
 * @param store
 * @param previewMode
 * @returns
 */
export function useButtonElementCommonEditorFunctionality(
  element: ComputedRef<any>,
  store: any,
  previewMode: ComputedRef<string>
) {
  const hrefValue = computed(() => {
    return element.value.payload.link.url ? element.value.payload.link.url : null;
  });
  const openType = computed(() => element.value.payload.link.openType ?? null);
  const isDownload = computed(() => element.value.payload.link.type === LinkType.Download);

  const iconSrc = computed(() => element.value.payload.image?.fullPath ?? '');
  const isIconHidden = computed(() => element.value.payload?.isIconHidden ?? true);
  const isIconLeft = computed(() => {
    if (!element.value.payload.iconPosition) return 'left';
    return element.value.payload.iconPosition === 'left';
  });

  const styles = computed(() => {
    return element.value.styles[previewMode.value];
  });

  const visualHooksParams = {
    element: element,
    style: styles,
    store
  };

  const { compiledCssObject: borderCompiledObject } = useBorderEditor(visualHooksParams);
  const { compiledCssObject: backgroundColorCompiledObject } = useColorEditor({
    ...visualHooksParams,
    cssProperty: 'background'
  });
  const { compiledCssObject: borderRadiusCompiledObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'borderRadius'
  });
  const { compiledCssObject: fontCompiledObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'font'
  });
  const { compiledCssObject: letterSpacingCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'letterSpacing'
  });
  const { compiledCssObject: textAlignCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'textAlign'
  });
  const { compiledCssObject: textTransformCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'textTransform'
  });
  const { compiledCssObject: textDecorationCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'textDecoration'
  });
  const { compiledCssObject: textColorCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'color'
  });
  const { compiledCssObject: displayCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'display'
  });
  const { compiledCssObject: justifyContentCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'justifyContent'
  });
  const { compiledCssObject: alignItemsCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'alignItems'
  });
  const { compiledCssObject: gridGapCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'gridGap'
  });
  const { compiledCssObject: iconSizeCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'width'
  });
  const { compiledCssObject: boxShadowCSSObject } = useBoxShadowEditor({
    ...visualHooksParams
  });

  const computedStyle = computed(() => {
    return {
      ...borderCompiledObject.value,
      ...backgroundColorCompiledObject.value,
      ...borderRadiusCompiledObject.value,
      ...boxShadowCSSObject.value,
      ...displayCSSObject.value,
      ...justifyContentCSSObject.value,
      ...alignItemsCSSObject.value,
      ...gridGapCSSObject.value
    };
  });

  const textStyle = computed(() => {
    return {
      ...fontCompiledObject.value,
      ...letterSpacingCSSObject.value,
      ...textAlignCSSObject.value,
      ...textTransformCSSObject.value,
      ...textDecorationCSSObject.value,
      ...textColorCSSObject.value
    };
  });

  const iconSize = computed(() => ({ ...iconSizeCSSObject.value }));

  return {
    computedStyle,
    isIconHidden,
    isIconLeft,
    isDownload,
    textStyle,
    hrefValue,
    openType,
    iconSize,
    iconSrc
  };
}

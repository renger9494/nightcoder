import { computed, ComputedRef } from '@vue/composition-api';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import useTextStrokeEditor from '@/hooks/editor/visual/textStroke.editor.hook';
import useTextShadowEditor from '@/hooks/editor/visual/textShadow.editor.hook';
import useTextColorEditor from '@/hooks/editor/visual/textColor.editor.hook';
import { LinkType } from '@/constants/link';

export function useTextElementCommonEditorFunctionality(
  element: ComputedRef<any>,
  store: any,
  previewMode: ComputedRef<any>
) {
  const isHref = computed(() => {
    return element.value.payload?.link?.url?.length;
  });

  const hrefValue = computed(() => {
    const { url } = element.value.payload.link;
    return url ? url : null;
  });
  const openType = computed(() => element.value.payload.link.openType ?? null);
  const isDownload = computed(() => element.value.payload.link.type === LinkType.Download);

  const targetValue = computed(() => {
    return element.value.payload.link.openType;
  });

  const tag = computed(() => {
    if (isHref.value) return 'a';
    else if (element.value.payload.type === 'heading') return 'h1';

    return element.value.payload.type;
  });

  const elementStyles = computed(() => {
    return element.value.styles[previewMode.value];
  });

  const visualHooksParams = {
    element: element,
    style: elementStyles,
    store
  };

  const { compiledCssObject: fontCSSObject } = useCssStyleEditor({ ...visualHooksParams, cssProperty: 'font' });
  // const { compiledObject: alignItemsCSSObject } = useCssStyleEditor({
  //   ...visualHooksParams,
  //   cssProperty: 'alignItems'
  // });
  const { compiledCssObject: textAlignCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'textAlign'
  });
  const { compiledCssObject: letterSpacingCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'letterSpacing'
  });
  const { compiledCssObject: textDecorationCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'textDecoration'
  });
  const { compiledCssObject: textTransformCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'textTransform'
  });
  const { compiledCssObject: displayCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'display'
  });
  const { compiledCssObject: textColorCSSObject } = useTextColorEditor({ ...visualHooksParams });

  const { compiledCssObject: textStrokeCSSObject } = useTextStrokeEditor({ ...visualHooksParams });
  const { compiledCssObject: textShadowCSSObject } = useTextShadowEditor({ ...visualHooksParams });
  const textStyle = computed(() => {
    return {
      ...textAlignCSSObject.value,
      ...textDecorationCSSObject.value,
      ...textTransformCSSObject.value,
      ...letterSpacingCSSObject.value,
      ...fontCSSObject.value,
      ...textColorCSSObject.value,
      ...textStrokeCSSObject.value,
      ...textShadowCSSObject.value,
      ...displayCSSObject.value
      // ...textStrokeCSSObject.value,
    };
  });

  const computedStyle = computed(() => {
    const styles = {
      minHeight: '100%',
      height: '100%'
    };
    return {
      ...styles
      // ...alignItemsCSSObject.value
    };
  });

  return {
    tag,
    isHref,
    hrefValue,
    targetValue,
    computedStyle,
    openType,
    isDownload,
    textStyle
  };
}

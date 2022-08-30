import { computed, ComputedRef } from '@vue/composition-api';
import useBorderEditor from '@/hooks/editor/visual/border.editor.hook';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import useIconShadowEditor from '@/hooks/editor/visual/iconShadow.editor.hook';
import useOverlayEditor from '@/hooks/editor/visual/overlay.editor.hook';
import { LinkType } from '@/constants/link';

export function useIconElementCommonEditorFunctionality(
  element: ComputedRef<any>,
  store: any,
  previewMode: ComputedRef<string>
) {
  const hrefValue = computed(() => {
    return element.value.payload.link.url ? element.value.payload.link.url : null;
  });
  const openType = computed(() => element.value.payload.link.openType ?? null);
  const isDownload = computed(() => element.value.payload.link.type === LinkType.Download);

  const styles = computed(() => {
    return element.value.styles[previewMode.value];
  });

  const visualHooksParams = {
    element: element,
    style: styles,
    store
  };

  const { compiledCssObject: borderCompiledObject } = useBorderEditor(visualHooksParams);
  const { compiledCssObject: borderRadiusCompiledObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'borderRadius'
  });
  const { compiledCssObject: objectFitCompiledObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'objectFit'
  });
  const { compiledCssObject: opacityCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'opacity'
  });
  const { compiledCssObject: displayCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'display'
  });
  const { compiledCssObject: displayOverlayCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'displayOverlay'
  });
  const { compiledCssObject: boxShadowCSSObject } = useIconShadowEditor({
    ...visualHooksParams
  });

  const { compiledCssObject: overlayCSSObject, isCssPropertyActive: isOverlayActive } = useOverlayEditor({
    ...visualHooksParams
  });

  const outlineStyle = computed(() => {
    return {
      ...borderCompiledObject.value,
      ...borderRadiusCompiledObject.value,
      ...boxShadowCSSObject.value,
      display: 'block',
      height: '100%',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
      ...displayCSSObject.value
    };
  });

  const imgStyle = computed(() => {
    return {
      ...objectFitCompiledObject.value,
      ...opacityCSSObject.value,
      ...displayCSSObject.value
    };
  });

  const overlayStyle = computed(() => {
    return {
      ...borderRadiusCompiledObject.value,
      display: displayOverlayCSSObject.value.displayOverlay,
      backgroundColor: overlayCSSObject.value.overlay
    };
  });

  return {
    imgStyle,
    overlayStyle,
    outlineStyle,
    hrefValue,
    isOverlayActive,
    openType,
    isDownload
  };
}

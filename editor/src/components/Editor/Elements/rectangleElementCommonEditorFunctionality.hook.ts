import { computed, ComputedRef } from '@vue/composition-api';
import useBorderEditor from '@/hooks/editor/visual/border.editor.hook';
import useBoxShadowEditor from '@/hooks/editor/visual/boxShadow.editor.hook';
import useColorEditor from '@/hooks/editor/visual/color.editor.hook';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import { LinkType } from '@/constants/link';

export function useRectangleElementCommonEditorFunctionality(
  element: ComputedRef<any>,
  store: any,
  previewMode: ComputedRef<string>
) {
  const hrefValue = computed(() => {
    return element.value.payload.link.url ? element.value.payload.link.url : null;
  });
  const openType = computed(() => element.value.payload.link.openType ?? null);
  const isDownload = computed(() => element.value.payload.link.type === LinkType.Download);
  const styles = computed(() => element.value.styles[previewMode.value]);

  const { compiledCssObject: borderCompiledCssObject } = useBorderEditor({
    element: element,
    style: styles,
    store
  });

  const { compiledCssObject: boxShadowCompiledCssObject } = useBoxShadowEditor({
    element: element,
    style: styles,
    store
  });

  const { compiledCssObject: backgroundColorCompiledCssObject } = useColorEditor({
    element: element,
    style: styles,
    store,
    cssProperty: 'background'
  });

  const { compiledCssObject: borderRadiusCompiledCssObject } = useCssStyleEditor({
    element: element,
    style: styles,
    store,
    cssProperty: 'borderRadius'
  });

  const { compiledCssObject: displayCSSObject } = useCssStyleEditor({
    element: element,
    style: styles,
    store,
    cssProperty: 'display'
  });

  const computedStyle = computed(() => {
    return {
      ...borderCompiledCssObject.value,
      ...backgroundColorCompiledCssObject.value,
      ...boxShadowCompiledCssObject.value,
      ...borderRadiusCompiledCssObject.value,
      ...displayCSSObject.value,
      height: '100%',
      width: '100%',
      'box-sizing': 'border-box'
    };
  });

  return {
    computedStyle,
    isDownload,
    hrefValue,
    openType
  };
}

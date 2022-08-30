import { computed, ComputedRef, Ref } from '@vue/composition-api';
import { getRgba, rgbaToHexOpacity } from '@/helpers/hexToRgb';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';

export default function useOverlayEditor({ element, style, store, cssObjectOnly }: {
  element: ComputedRef<any>,
  style: Ref<any>,
  store: any,
  cssObjectOnly?: boolean
}) {
  const cssProperty = 'overlay';

  const {
    compiledCssObject,
    compiledCSS,
    cssPropertyCSS,
    cssPropertyStyle,
    displayConditions,
    isCssPropertyActive,
    setHideCssProperty,
    isCssPropertyHidden,
    deleteCssProperty
  } = useCssStyleEditor({
    element,
    style,
    store,
    cssObjectOnly,
    cssProperty
  });

  const setCssProperty = (val: { color: string, opacity: number }) => {
    const rgba = getRgba(val.color, val.opacity);
    store.commit('editor/changeComponentStyle', {
      component: element.value,
      data: {
        [cssProperty]: `${rgba}`
      }
    });
  };

  const cssPropertyProps = computed(() => {
    // ожидается overlay вида rgba(1, 2, 3, 0.2)
    if (!cssPropertyStyle.value || !cssPropertyStyle.value[cssProperty] || cssPropertyStyle.value[cssProperty] === '')
      return {};

    const { hex: color, opacity: opacity } = rgbaToHexOpacity(cssPropertyStyle.value[cssProperty]);
    return { color, opacity };
  });

  return {
    compiledCssObject,
    compiledCSS,
    cssPropertyCSS,
    cssPropertyStyle,
    displayConditions,
    isCssPropertyActive,
    cssPropertyProps,
    isCssPropertyHidden,
    setHideCssProperty,
    deleteCssProperty,
    setCssProperty
  };
}

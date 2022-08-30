import { computed, ComputedRef, Ref } from '@vue/composition-api';
import { getRgba, rgbaToHexOpacity } from '@/helpers/hexToRgb';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import useCssMultipleStylesEditor from '@/hooks/editor/visual/multiple/cssMultipleStyle.editor.hook';

/**
 * Используется для свойств вида [cssProperty]:rgba(1, 2, 3, 0.2)
 * @param {object} params - info of element, style, store, cssObjectOnly, cssProperty
 */
export default function useColorMultipleEditor({
  elements,
  style,
  store,
  cssObjectOnly,
  cssProperty = 'color'
}: {
  elements: ComputedRef<Array<any>>;
  style: Ref<any>;
  store: any;
  cssObjectOnly?: boolean;
  cssProperty?: string;
}) {
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
  } = useCssMultipleStylesEditor({
    elements,
    style,
    store,
    cssObjectOnly,
    cssProperty
  });

  const setCssProperty = (val: { color: string; opacity: number }) => {
    const rgba = getRgba(val.color, val.opacity);
    store.commit('editor/changeMultipleComponentStyle', {
      elements: elements.value,
      data: {
        [cssProperty]: rgba
      }
    });
  };

  const cssPropertyProps = computed(() => {
    // ожидается color вида rgba(1, 2, 3, 0.2)
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

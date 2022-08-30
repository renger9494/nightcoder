import { computed, ComputedRef, Ref } from '@vue/composition-api';
import { getRgba, rgbaToHexOpacity } from '@/helpers/hexToRgb';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';

export default function useTextStrokeEditor({ element, style, store, cssObjectOnly = true }: {
  element: ComputedRef<any>,
  style: Ref<any>,
  store: any,
  cssObjectOnly?: boolean
}) {
  const cssProperty = '-webkit-text-stroke';

  const {
    compiledCssObject,
    compiledCSS,
    cssPropertyCSS,
    cssPropertyStyle,
    displayConditions,
    isCssPropertyActive,
    isCssPropertyHidden,
    setHideCssProperty,
    deleteCssProperty
  } = useCssStyleEditor({
    element,
    style,
    store,
    cssObjectOnly,
    cssProperty
  });

  //TODO: move to common methods
  function getOnlyNumbersFromString(str: string) {
    if (!str)
      throw new Error('[boxShadow.editor.hook]: cant getOnlyNumbersFromString')

    const regex = /[0-9]*/g;
    const matches = str.match(regex);

    if (!matches || matches.length == 0)
      throw new Error('[boxShadow.editor.hook]: cant getOnlyNumbersFromString')

    return +matches[0];
  }

  const cssPropertyProps = computed(() => {
    // ожидается webkitTextStrokeCSS вида 1px rgba(1, 2, 3, 0.2)

    if (!cssPropertyStyle.value || !cssPropertyStyle.value[cssProperty] || cssPropertyStyle.value[cssProperty] === '')
      return {};
    const params = cssPropertyStyle.value[cssProperty].split(' ');
    const textStrokeWidth = getOnlyNumbersFromString(params[0]);
    const endOfType = params[0].length + 1;
    const { hex: textStrokeColor, opacity: textStrokeOpacity } = rgbaToHexOpacity(
      cssPropertyStyle.value[cssProperty].substr(endOfType)
    );
    return { textStrokeWidth, textStrokeColor, textStrokeOpacity };
  });

  const setCssProperty = (val: { textStrokeWidth?: number, textStrokeColor?: string, textStrokeOpacity?: number }) => {
    if (!val || !val.textStrokeColor || !val.textStrokeOpacity || !val.textStrokeWidth)
      return;

    const rgba = getRgba(val.textStrokeColor, val.textStrokeOpacity);
    store.commit('editor/changeSelectedElementsStyle', {
      [cssProperty]: `${val.textStrokeWidth}px ${rgba}`
    });
  };

  return {
    compiledCssObject,
    compiledCSS,
    cssPropertyCSS,
    cssPropertyStyle,
    cssPropertyProps,
    displayConditions,
    isCssPropertyActive,
    isCssPropertyHidden,
    setHideCssProperty,
    setCssProperty,
    deleteCssProperty
  };
}

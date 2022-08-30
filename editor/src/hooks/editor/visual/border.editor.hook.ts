import { computed, ComputedRef, Ref } from '@vue/composition-api';
import useCssStyles from '@/hooks/common/visual/cssStyles.hook';
import { getRgba, rgbaToHexOpacity } from '@/helpers/hexToRgb';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';

export default function useBorderEditor({
  element,
  style,
  store,
  cssObjectOnly = true
}: {
  element: ComputedRef<any>;
  style: Ref<any>;
  store: any;
  cssObjectOnly?: boolean;
}) {
  const cssProperty = 'border';

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

  const { css: borderRadiusCSS, styleObject: borderRadiusStyle } = useCssStyles(style, {
    applyStyles: ['borderRadius'],
    cssObjectOnly
  });

  //TODO: move to common methods
  function getOnlyNumbersFromString(str: string) {
    if (!str) throw new Error('[border.editor.hook]: cant getOnlyNumbersFromString');

    const regex = /[0-9]*/g;
    const matches = str.match(regex);

    if (!matches || matches.length == 0) throw new Error('[border.editor.hook]: cant getOnlyNumbersFromString');

    return +matches[0];
  }

  const cssPropertyProps = computed(() => {
    // ожидается borderCSS вида 1px solid rgba(1, 2, 3, 0.2)

    if (!cssPropertyStyle.value || !cssPropertyStyle.value[cssProperty] || cssPropertyStyle.value[cssProperty] === '')
      return {};
    const params = cssPropertyStyle.value[cssProperty].split(' ');
    const borderWidth = getOnlyNumbersFromString(params[0]);
    const borderType = params[1];
    const endOfType = params[0].length + params[1].length + 1;
    const { hex: borderColor, opacity: borderOpacity } = rgbaToHexOpacity(
      cssPropertyStyle.value[cssProperty].substr(endOfType)
    );
    return { borderType, borderWidth, borderColor, borderOpacity };
  });

  const setCssProperty = (val: {
    borderWidth?: number;
    borderColor?: string;
    borderType?: string;
    borderOpacity?: number;
  }) => {
    if (!val || !val.borderWidth || !val.borderColor || !val.borderOpacity || !val.borderType) return;
    const rgba = getRgba(val.borderColor, val.borderOpacity);
    store.commit('editor/changeComponentStyle', {
      component: element.value,
      data: {
        [cssProperty]: `${val.borderWidth}px ${val.borderType} ${rgba}`
      }
    });
  };

  return {
    compiledCssObject,
    compiledCSS,
    borderRadiusCSS,
    borderRadiusStyle,
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

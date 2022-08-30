import { computed, Ref, ComputedRef } from '@vue/composition-api';
import { getRgba, rgbaToHexOpacity } from '@/helpers/hexToRgb';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';

export default function useTextShadowEditor({
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
  const cssProperty = 'textShadow';

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
    if (!str) throw new Error('[boxShadow.editor.hook]: cant getOnlyNumbersFromString');

    const regex = /[0-9]*/g;
    const matches = str.match(regex);

    if (!matches || matches.length == 0) throw new Error('[boxShadow.editor.hook]: cant getOnlyNumbersFromString');

    return +matches[0];
  }

  const cssPropertyProps = computed(() => {
    // ожидается textShadowCSS вида 34px 23px 6px 6px rgb(0, 0, 0, 0.2)

    if (!cssPropertyStyle.value || !cssPropertyStyle.value[cssProperty] || cssPropertyStyle.value[cssProperty] === '')
      return {
        textShadowX: 0,
        textShadowY: 10,
        textShadowBlurRadius: 10,
        textShadowColor: '#001950',
        textShadowOpacity: 0.3
      };
    const params = cssPropertyStyle.value[cssProperty].split(' ');
    const textShadowX = getOnlyNumbersFromString(params[0]);
    const textShadowY = getOnlyNumbersFromString(params[1]);
    const textShadowBlurRadius = getOnlyNumbersFromString(params[2]);
    const { hex: textShadowColor, opacity: textShadowOpacity } = rgbaToHexOpacity(
      cssPropertyStyle.value[cssProperty].substr(cssPropertyStyle.value[cssProperty].indexOf('rgb'))
    );

    return { textShadowX, textShadowY, textShadowBlurRadius, textShadowColor, textShadowOpacity };
  });

  /* offset-x | offset-y | blur-radius | spread-radius | color */
  const setCssProperty = (val: {
    textShadowX: number;
    textShadowY: number;
    textShadowBlurRadius: number;
    textShadowColor: string;
    textShadowOpacity: number;
  }) => {
    const rgba = getRgba(val.textShadowColor, val.textShadowOpacity);
    const value = `${val.textShadowX}px ${val.textShadowY}px ${val.textShadowBlurRadius}px ${rgba}`;
    store.commit('editor/changeComponentStyle', {
      component: element.value,
      data: {
        [cssProperty]: value
      }
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
    setCssProperty,
    deleteCssProperty,
    setHideCssProperty
  };
}

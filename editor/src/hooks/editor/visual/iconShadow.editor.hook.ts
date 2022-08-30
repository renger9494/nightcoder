import { computed, Ref, ComputedRef } from '@vue/composition-api';
import { getRgba, rgbaToHexOpacity } from '@/helpers/hexToRgb';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import { isNil } from 'lodash';

export default function useIconShadowEditor({
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
  const cssProperty = 'filter';

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
    // ожидается filter drop-shadow вида 34px 23px 6px rgb(0, 0, 0, 0.2)
    if (!cssPropertyStyle.value || !cssPropertyStyle.value[cssProperty] || cssPropertyStyle.value[cssProperty] === '')
      return {};
    const params = cssPropertyStyle.value[cssProperty].split(' ');

    const boxShadowX = getOnlyNumbersFromString(params[0]);
    const boxShadowY = getOnlyNumbersFromString(params[1]);
    const boxShadowBlurRadius = getOnlyNumbersFromString(params[2]);
    const { hex: boxShadowColor, opacity: boxShadowOpacity } = rgbaToHexOpacity(
      cssPropertyStyle.value[cssProperty].substr(cssPropertyStyle.value[cssProperty].indexOf('rgba')).slice(0, -1)
    );

    return { boxShadowX, boxShadowY, boxShadowBlurRadius, boxShadowColor, boxShadowOpacity };
  });

  /* offset-x | offset-y | blur-radius | spread-radius | color */
  const setCssProperty = (val: {
    boxShadowX?: number;
    boxShadowY?: number;
    boxShadowBlurRadius?: number;
    boxShadowColor?: string;
    boxShadowOpacity?: number;
  }) => {
    if (
      isNil(val) ||
      isNil(val.boxShadowX) ||
      isNil(val.boxShadowY) ||
      isNil(val.boxShadowBlurRadius) ||
      isNil(val.boxShadowColor) ||
      isNil(val.boxShadowOpacity)
    )
      return;
    const rgba = getRgba(val.boxShadowColor, val.boxShadowOpacity);
    console.log(rgba);
    store.commit('editor/changeComponentStyle', {
      component: element.value,
      data: {
        [cssProperty]: `drop-shadow(${val.boxShadowX}px ${val.boxShadowY}px ${val.boxShadowBlurRadius}px ${rgba})`
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

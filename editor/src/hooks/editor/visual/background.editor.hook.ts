import { computed, ComputedRef, Ref } from '@vue/composition-api';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import { getRgba, rgbaToHexOpacity } from '@/helpers/hexToRgb';
import { convertGradientToObject, checkGradientByCssValue } from '@/helpers/gradient';

/**
 * Используется для свойств вида background: rgba(1, 2, 3, 0.2) или градиент linear-gradient(), radial-gradient()
 * @param param0 element - user config
 * @returns
 */
export default function useBackgroundEditor({
  element,
  style,
  store,
  cssObjectOnly = true,
  cssProperty = 'background'
}: {
  element: ComputedRef<any>;
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
  } = useCssStyleEditor({
    element,
    style,
    store,
    cssObjectOnly,
    cssProperty
  });

  const setCssProperty = (val: { color: string; opacity: number; background?: string }) => {
    const value = val.background ? val.background : getRgba(val.color, val.opacity);

    store.commit('editor/changeComponentStyle', {
      component: element.value,
      data: {
        [cssProperty]: `${value}`
      }
    });
  };

  const isBackgroundPropertyGradient = computed(() => {
    return checkGradientByCssValue(cssPropertyStyle.value[cssProperty]);
  });

  const cssPropertyProps = computed(() => {
    // ожидается [cssProperty] вида rgba(1, 2, 3, 0.4) или градиент
    // linear-gradient(217deg, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)
    // radial-gradient(rgba(0,0,255,0.5),rgba(0,0,255,1) 70.71%)
    if (!cssPropertyStyle.value || !cssPropertyStyle.value[cssProperty] || cssPropertyStyle.value[cssProperty] === '')
      return {};

    if (checkGradientByCssValue(cssPropertyStyle.value[cssProperty])) {
      return convertGradientToObject(cssPropertyStyle.value[cssProperty]);
    }

    const { hex: color, opacity } = rgbaToHexOpacity(cssPropertyStyle.value[cssProperty]);
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
    isBackgroundPropertyGradient,
    setCssProperty
  };
}

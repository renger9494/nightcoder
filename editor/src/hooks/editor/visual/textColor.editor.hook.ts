import { computed, ComputedRef, Ref } from '@vue/composition-api';
import { convertGradientToObject, checkGradientByCssValue } from '@/helpers/gradient';
import { getRgba, rgbaToHexOpacity } from '@/helpers/hexToRgb';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';

export default function useTextColorEditor({
  element,
  style,
  store,
  cssObjectOnly = false,
  cssProperty = 'color'
}: {
  element: ComputedRef<any>;
  style: Ref<any>;
  store: any;
  cssObjectOnly?: boolean;
  cssProperty?: string;
}) {
  const {
    isCssPropertyHidden,
    cssPropertyStyle,
    setHideCssProperty: setHideColor,
    compiledCssObject: compiledColorObject
  } = useCssStyleEditor({
    element,
    style,
    store,
    cssObjectOnly,
    cssProperty
  });

  const { setHideCssProperty: setHideBackground, compiledCssObject: compiledBackgroundObject } = useCssStyleEditor({
    element,
    style,
    store,
    cssObjectOnly,
    cssProperty: 'background'
  });

  const {
    setHideCssProperty: setHideTextFillColor,
    compiledCssObject: compiledTextFillColorObject
  } = useCssStyleEditor({
    element,
    style,
    store,
    cssObjectOnly,
    cssProperty: '-webkit-text-fill-color'
  });

  const {
    setHideCssProperty: setHideBackgroundClip,
    compiledCssObject: compiledBackgroundClipObject
  } = useCssStyleEditor({
    element,
    style,
    store,
    cssObjectOnly,
    cssProperty: '-webkit-background-clip'
  });

  const setCssProperty = (val: { color: string; opacity: number; background?: string }) => {
    if (val.background) {
      console.log(val.background);
      store.commit('editor/changeComponentStyle', {
        component: element.value,
        data: {
          background: `${val.background}`,
          color: `${val.background}`,
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-box-decoration-break': 'clone'
        }
      });
    } else {
      const value = getRgba(val.color, val.opacity);

      store.commit('editor/changeComponentStyle', {
        component: element.value,
        data: {
          background: 'transparent',
          color: value,
          '-webkit-text-fill-color': '',
          'background-clip': '',
          '-webkit-background-clip': '',
          '-webkit-box-decoration-break': 'clone'
        }
      });
    }
  };

  const compiledCssObject = computed(() => {
    return {
      ...compiledColorObject.value,
      ...compiledBackgroundObject.value,
      ...compiledTextFillColorObject.value,
      ...compiledBackgroundClipObject.value
    };
  });

  const isTextColorPropertyGradient = computed(() => {
    return checkGradientByCssValue(cssPropertyStyle.value[cssProperty]);
  });

  const cssPropertyProps = computed(() => {
    // ожидается [cssProperty] вида rgba(1, 2, 3, 0.4) или градиент
    // linear-gradient(217deg, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)
    // radial-gradient(rgba(0,0,255,0.5),rgba(0,0,255,1) 70.71%)
    if (!cssPropertyStyle.value || !cssPropertyStyle.value[cssProperty] || cssPropertyStyle.value[cssProperty] === '') {
      return {};
    }

    if (checkGradientByCssValue(cssPropertyStyle.value[cssProperty])) {
      return convertGradientToObject(cssPropertyStyle.value[cssProperty]);
    } else {
      const { hex: color, opacity: opacity } = rgbaToHexOpacity(cssPropertyStyle.value[cssProperty]);
      return { color, opacity };
    }
  });

  const hideTextColorProps = (val: boolean) => {
    setHideColor(val);
    setHideBackground(val);
    setHideTextFillColor(val);
    setHideBackgroundClip(val);
  };

  return {
    isCssPropertyHidden,
    cssPropertyStyle,
    isTextColorPropertyGradient,
    cssPropertyProps,
    compiledCssObject,
    setCssProperty,
    hideTextColorProps
  };
}

import { computed, ComputedRef, Ref } from '@vue/composition-api';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import { breakpointsWidths } from '@/constants/breakpoints';
import { isNil } from 'lodash';

export default function useFontEditor({
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
  const cssProperty = 'font';

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
    if (!str) throw new Error('[font.editor.hook]: cant getOnlyNumbersFromString');

    const regex = /[0-9]*/g;
    const matches = str.match(regex);

    if (!matches || matches.length == 0) throw new Error('[font.editor.hook]: cant getOnlyNumbersFromString');

    return matches[0];
  }

  const cssPropertyProps = computed(() => {
    // ожидается fontCSS вида italic bold 12px/12px "Fira Sans", serif

    if (!cssPropertyStyle.value || !cssPropertyStyle.value[cssProperty] || cssPropertyStyle.value[cssProperty] === '')
      return {};

    const params = cssPropertyStyle.value[cssProperty].split(' ');
    const fontStyle = params[0];
    const fontWeight = params[1];
    const [fontSizeRaw, fontLineHeightRaw] = params[2].split('/');
    const fontSize = getOnlyNumbersFromString(fontSizeRaw);
    const fontLineHeight = /[0-9]/.test(fontLineHeightRaw)
      ? getOnlyNumbersFromString(fontLineHeightRaw)
      : fontLineHeightRaw;

    function getFontFamilyIndex() {
      return params[0].length + params[1].length + params[2].length + 3;
    }

    const fontFamily = cssPropertyStyle.value[cssProperty].substr(getFontFamilyIndex());
    return { fontStyle, fontWeight, fontSize, fontLineHeight, fontFamily };
  });

  const setCssProperty = (val: {
    fontStyle?: string;
    fontWeight?: string;
    fontSize?: string;
    fontLineHeight?: string;
    fontFamily?: string;
    googleFontFamily?: string;
  }) => {
    if (
      isNil(val) ||
      isNil(val.fontStyle) ||
      isNil(val.fontWeight) ||
      isNil(val.fontSize) ||
      isNil(val.fontLineHeight) ||
      isNil(val.fontFamily)
    )
      return;

    const lineHeight = /[0-9]/.test(val.fontLineHeight) ? `${val.fontLineHeight}px` : val.fontLineHeight;
    const previewMode = store.state.editor.previewMode;

    store.commit('editor/changeComponentStyle', {
      component: element.value,
      data: { [cssProperty]: `${val.fontStyle} ${val.fontWeight} ${val.fontSize}px/${lineHeight} ${val.fontFamily}` }
    });

    store.commit('editor/changeElementResponsiveFontStyle', {
      component: element.value,
      data: val.fontSize,
      isSaveHistory: false
    });

    if (val.googleFontFamily) {
      store.commit('editor/setGoogleFontFamilyToElement', {
        element: element.value,
        path: previewMode,
        value: val.googleFontFamily
      });
      store.commit('editor/actualiseFontList');
    }

    store.commit('editor/changeElementLocation', {
      element: element.value,
      data: { resizeImmediately: true },
      isSaveHistory: false
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

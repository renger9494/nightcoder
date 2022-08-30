import { computed, ComputedRef, Ref } from '@vue/composition-api';
import useCssMultipleStylesEditor from '@/hooks/editor/visual/multiple/cssMultipleStyle.editor.hook';

export default function useFontMultipleEditor({
  elements,
  style,
  store,
  cssObjectOnly = true
}: {
  elements: ComputedRef<Array<any>>;
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
  } = useCssMultipleStylesEditor({
    elements,
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

  const formFontStyleObject = (font: string) => {
    const params = font.split(' ');
    const fontStyle = params[0];
    const fontWeight = params[1];
    const [fontSize, fontLineHeight] = params[2].split('/');

    function getFontFamilyIndex() {
      return params[0].length + params[1].length + params[2].length + 3;
    }

    const fontFamily = font.substr(getFontFamilyIndex());
    return { fontStyle, fontWeight, fontSize, fontLineHeight, fontFamily };
  };

  const setCssProperty = (
    {
      fontStyleNew,
      fontWeightNew,
      fontLineHeightNew,
      fontFamilyNew,
      fontSizeNew,
      googleFontFamily
    }: {
      fontStyleNew?: string;
      fontWeightNew?: string;
      fontLineHeightNew?: string;
      fontFamilyNew?: string;
      fontSizeNew?: string;
      googleFontFamily?: string;
    },
    type: string
  ) => {
    if (!type) return;
    const previewMode = store.state.editor.previewMode;
    const elementsCollection = [];
    for (const element of elements.value) {
      const { fontStyle, fontWeight, fontLineHeight, fontFamily, fontSize } = formFontStyleObject(
        element.styles[previewMode][cssProperty]
      );

      let fontValue = `${fontStyle} ${fontWeight} ${fontSize}/${fontLineHeight} ${fontFamily}`;

      if ((type === 'fontStyle' || type === 'fontWeight') && fontWeightNew && fontStyleNew) {
        fontValue = `${fontStyleNew} ${fontWeightNew} ${fontSize}/${fontLineHeight} ${fontFamily}`;
      }

      if (type === 'fontSize' && fontSizeNew) {
        fontValue = `${fontStyle} ${fontWeight} ${fontSizeNew}px/${fontLineHeight} ${fontFamily}`;
      }

      if (type === 'fontLineHeight' && fontLineHeightNew) {
        const lineHeight = /[0-9]/.test(fontLineHeightNew) ? `${fontLineHeightNew}px` : fontLineHeightNew;
        fontValue = `${fontStyle} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
      }

      if (type === 'fontFamily' && fontStyleNew && fontWeightNew && fontFamilyNew) {
        fontValue = `${fontStyleNew} ${fontWeightNew} ${fontSize}/${fontLineHeight} ${fontFamilyNew}`;
      }

      elementsCollection.push({
        element,
        resizeImmediately: true,
        data: {
          [cssProperty]: fontValue,
          ...(type === 'fontSize' && fontSizeNew ? { [`${cssProperty}Size`]: fontSizeNew } : {})
        }
      });
    }

    store.commit('editor/changeMultipleElementsByUniqueStyles', {
      elementsCollection
    });

    if (googleFontFamily) {
      for (const element of elements.value) {
        store.commit('editor/setGoogleFontFamilyToElement', {
          element: element,
          path: previewMode,
          value: googleFontFamily
        });
      }
      store.commit('editor/actualiseFontList');
    }
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

import { computed, ComputedRef, Ref } from '@vue/composition-api';
import useCssStyles from '@/hooks/common/visual/cssStyles.hook';
import { startCase as _startCase } from 'lodash';

export default function useCssMultipleStylesEditor({
  elements,
  style,
  store,
  cssObjectOnly = true,
  cssProperty
}: {
  elements: ComputedRef<Array<any>>;
  style: Ref<any>;
  store: any;
  cssObjectOnly?: boolean;
  cssProperty: string;
}) {
  const hideCssPropertyConditionName = `hide${_startCase(cssProperty)}`;

  const { css: cssPropertyCSS, styleObject: cssPropertyStyle } = useCssStyles(style, {
    applyStyles: [cssProperty],
    cssObjectOnly
  });

  const displayConditions = computed(() => {
    const displayConditionsArr: Array<any> = [];
    for (const item of elements.value) {
      const elemConditions = store.state.editor.displayConditions[(item as any).id];
      if (elemConditions) {
        displayConditionsArr.push(elemConditions);
      }
    }
    return displayConditionsArr;
  });

  const isCssPropertyHidden = computed(() =>
    displayConditions.value.some((item: any) => item[hideCssPropertyConditionName])
  );

  const compiledCSS = computed(() => {
    if (isCssPropertyHidden.value) {
      //because browser always sets default value rgb(1,1,1), if element doesn't have color
      if (cssProperty == 'color') {
        return 'rgba(0,0,0,0)';
      }

      return '';
    }

    return cssPropertyCSS?.value;
  });

  const compiledCssObject = computed(() => {
    if (isCssPropertyHidden.value) {
      //because browser always sets default value rgb(1,1,1), if element doesn't have color
      if (cssProperty == 'color') {
        return { color: 'rgba(0,0,0,0)' };
      }
      return {};
    }
    return cssPropertyStyle.value;
  });

  const setHideCssProperty = (hide: boolean) => {
    for (const element of elements.value) {
      store.commit('editor/setDisplayCondition', {
        id: element.id,
        condition: hideCssPropertyConditionName,
        value: hide
      });
    }
  };

  const isCssPropertyActive = computed(() => {
    return !!cssPropertyStyle.value[cssProperty];
  });

  const setCssProperty = (val: string | number | null) => {
    store.commit('editor/changeMultipleComponentStyle', {
      elements: elements.value,
      data: {
        [cssProperty]: val
      }
    });
  };

  const numberValue = computed(() => {
    if (!cssPropertyStyle.value[cssProperty].match) return cssPropertyStyle.value[cssProperty];
    const regex = /-?[\d.]*/g;
    const matches = cssPropertyStyle.value[cssProperty].match(regex);
    return matches && matches.length > 0 ? matches[0] : '';
  });

  const deleteCssProperty = () => {
    setCssProperty(null);
  };

  return {
    compiledCssObject,
    compiledCSS,
    cssPropertyCSS,
    cssPropertyStyle,
    displayConditions,
    isCssPropertyActive,
    isCssPropertyHidden,
    numberValue,
    setHideCssProperty,
    setCssProperty,
    deleteCssProperty
  };
}

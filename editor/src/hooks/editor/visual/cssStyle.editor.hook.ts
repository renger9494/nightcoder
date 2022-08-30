import { computed, ComputedRef, Ref } from '@vue/composition-api';
import useCssStyles from '@/hooks/common/visual/cssStyles.hook';
import { startCase as _startCase } from 'lodash';

export default function useCssStyleEditor({
  element,
  style,
  store,
  cssObjectOnly = true,
  cssProperty
}: {
  element: ComputedRef<any>;
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
    return store.state.editor.displayConditions[element.value.id];
  });

  const isCssPropertyHidden = computed(() => {
    return !displayConditions.value || displayConditions.value[hideCssPropertyConditionName];
  });

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
    store.commit('editor/setDisplayCondition', {
      id: element.value.id,
      condition: hideCssPropertyConditionName,
      value: hide
    });
  };

  const isCssPropertyActive = computed(() => {
    return !!cssPropertyStyle.value[cssProperty];
  });

  const setCssProperty = (val: string | number | null) => {
    store.commit('editor/changeComponentStyle', {
      component: element.value,
      data: {
        [cssProperty]: val
      }
    });
  };

  const numberValue = computed(() => {
    if (!cssPropertyStyle.value[cssProperty]?.match) return cssPropertyStyle.value[cssProperty] ?? 0;
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

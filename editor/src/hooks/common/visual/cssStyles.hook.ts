import ObjectKeys from '../../../utils/types/ObjectKeys';
import { computed, ComputedRef, Ref } from '@vue/composition-api';
import { isNil, kebabCase, keyBy } from 'lodash';
/**
 *  Хук для генерации строки и объекта css по объекту со стилями из userConfig
 */
export default function useCssStyles(
  style: Ref<any>,
  {
    applyStyles = null,
    excludeStyles = null,
    cssObjectOnly = true
  }: {
    applyStyles?: null | string[];
    excludeStyles?: null | string[];
    cssObjectOnly: boolean;
  }
) {
  let css = null as ComputedRef<string> | null;

  let styleObject = computed(() => {
    return generateObject(style, applyStyles, excludeStyles);
  });
  if (!cssObjectOnly)
    css = computed(() => {
      return generateCss(style, applyStyles, excludeStyles);
    });

  return {
    css,
    styleObject
  };
}

export function useCssStylesPublish(style: any, applyStyles: string[] | null) {
  return generateCss(style, applyStyles);
}

/**
 * We have experimental css properties, for instance -webkit-text-stroke
 * @param {string} cssProperty
 */
function getCssPropertyName(cssProperty: string) {
  return cssProperty[0] == '-' ? cssProperty : kebabCase(cssProperty);
}

function generateCss(style: Ref<any> | any, applyStyles: string[] | null, excludeStyles: string[] | null = null) {
  const styleValue = !style.value ? style : style.value;
  let cssString = '';
  if (applyStyles) {
    applyStyles.forEach((cssProperty: string) => {
      if (!isNil(styleValue[cssProperty]))
        cssString += `${getCssPropertyName(cssProperty)}: ${styleValue[cssProperty]};`;
    });
  } else {
    const stylesToExcludeObject = keyBy(excludeStyles, val => val);
    for (let cssProperty of styleValue) {
      if (!isNil(stylesToExcludeObject[cssProperty]))
        cssString += `${getCssPropertyName(cssProperty)}: ${styleValue[cssProperty]};`;
    }
  }
  return cssString;
}

function generateObject(style: Ref<any> | any, applyStyles: string[] | null, excludeStyles: string[] | null = null) {
  const styleValue = !style.value ? style : style.value;
  let cssObject: ObjectKeys<string> = {};
  if (applyStyles) {
    applyStyles.forEach((cssProperty: string) => {
      if (!isNil(styleValue[cssProperty])) cssObject[cssProperty] = styleValue[cssProperty];
    });
  } else {
    const stylesToExcludeObject = keyBy(excludeStyles, val => val);
    for (let cssProperty of styleValue) {
      if (!isNil(!stylesToExcludeObject[cssProperty])) cssObject[cssProperty] = styleValue[cssProperty];
    }
  }
  return cssObject;
}

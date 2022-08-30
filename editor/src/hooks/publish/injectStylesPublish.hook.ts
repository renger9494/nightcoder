//use relative paths for publish//use relative paths for publish
import ObjectKeys from '../../utils/types/ObjectKeys';
import { ComputedRef } from '@vue/composition-api';
import publishCssBrakePoints, { publishCssBrakePoints as breakpointsObj } from '../../constants/breakpoints';
import { useCssStylesPublish } from '../common/visual/cssStyles.hook';

/**
 * Хук создания стилей элемента для head страницы
 * @param element
 * @param hooksToApply - хуки которые надо применить(border, backgroundColor...)
 * @returns
 */
export default function useInjectStylesPublish(element: any, hooksToApply: any) {
  const cssStyles = [
    'border',
    'shadow',
    'borderRadius',
    'background',
    'backgroundSize',
    'backgroundImage',
    'backgroundPosition',
    'backgroundRepeat',
    'boxShadow',
    'textShadow',
    'height',
    'font',
    'letterSpacing',
    'textTransform',
    'textDecoration',
    'textAlign',
    'color',
    'objectFit',
    'opacity',
    '-webkit-text-stroke',
    '-webkit-text-fill-color',
    '-webkit-background-clip',
    'display',
    'justifyContent',
    'alignItems',
    'filter',
    'display',
    'gridAutoFlow',
    'gridGap',
    'padding'
  ];

  const stylesObject: ObjectKeys<ObjectKeys<string | ComputedRef<string>>> = {};

  publishCssBrakePoints.forEach(breakpoint => {
    const breakpointStyles = element.styles[breakpoint];
    if (breakpointStyles) {
      cssStyles.forEach(cssStyle => {
        if (hooksToApply && !hooksToApply.includes(cssStyle)) return;
        const styleCSS = useCssStylesPublish(breakpointStyles, [cssStyle]);
        if (styleCSS !== '') {
          stylesObject[breakpoint] || (stylesObject[breakpoint] = {});
          stylesObject[breakpoint][cssStyle] = styleCSS;
        }
      });
    }
  });

  function getBreakpointCssString(breakpoint: string) {
    let result = '';
    Object.keys(stylesObject[breakpoint]).forEach(style => {
      result += `${stylesObject[breakpoint][style] ? stylesObject[breakpoint][style] : ''}`;
    });
    return result;
  }

  let result = '';

  publishCssBrakePoints.forEach((breakpoint, index) => {
    if (index === 0) {
      result += `
        #${element.id} {
        ${getBreakpointCssString(breakpoint)}
        }`;
    } else {
      result += `
        @media only screen and (max-width: ${breakpointsObj[index].width}px) {
          #${element.id} {
            ${getBreakpointCssString(breakpoint)}
          }
        }`;
    }
  });

  return result;
}

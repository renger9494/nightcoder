//use relative paths for publish
import { useCssStylesPublish } from '../common/visual/cssStyles.hook';
import publishCssBrakePoints, { publishCssBrakePoints as breakpointsObj } from '../../constants/breakpoints';
import ObjectKeys from '../../utils/types/ObjectKeys';

interface DynamicBlockStyle {
  idName: string;
  stylesToSplit: string[];
  stylesIncluded?: object;
}

export default function useInjectSeparateBlocksStyles(element: any, dynamicBlockStyleCollection: DynamicBlockStyle[]) {
  let stylesToHead = '';
  const nonStandartCssKeyUsageTranslator: ObjectKeys<string> = {
    overlay: 'background',
    displayBackgroundImage: 'display',
    displayOverlay: 'display'
  };
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
    'fontSize',
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

  const formSeparatedStylesFromArray = (elementStyles: ObjectKeys<string>, stylesToSplit: string[]) => {
    const styleObj: ObjectKeys<string> = {};
    for (const key of stylesToSplit) {
      if (nonStandartCssKeyUsageTranslator[key]) {
        styleObj[nonStandartCssKeyUsageTranslator[key]] = elementStyles[key];
      } else {
        styleObj[key] = elementStyles[key];
      }
    }
    return styleObj;
  };

  const createClassAndBreakPointFromString = (idName: string, index: number, styleString: string) => {
    return index === 0
      ? `${idName}{${styleString}}`
      : `
        @media only screen and (max-width: ${breakpointsObj[index].width}px) {
          ${idName} {
            ${styleString}
          }
        }
      `;
  };

  const createCssStyleFromElemConfig = (stylesToSplit: string[], stylesIncluded: object, idName: string) => {
    let stylesOfBlock = '';
    publishCssBrakePoints.forEach((breakpoint, index) => {
      let styleOfBreakpoint = '';
      const breakpointStyles = {
        ...formSeparatedStylesFromArray(element.styles[breakpoint], stylesToSplit),
        ...stylesIncluded
      };

      if (breakpointStyles) {
        cssStyles.forEach(cssStyle => {
          const styleCSS = useCssStylesPublish(breakpointStyles, [cssStyle]);
          if (styleCSS !== '') {
            styleOfBreakpoint += styleCSS;
          }
        });
      }

      stylesOfBlock += createClassAndBreakPointFromString(idName, index, styleOfBreakpoint);
    });
    return stylesOfBlock;
  };

  dynamicBlockStyleCollection.forEach(item => {
    stylesToHead += createCssStyleFromElemConfig(
      item.stylesToSplit,
      item.stylesIncluded ? item.stylesIncluded : {},
      item.idName
    );
  });

  return stylesToHead;
}

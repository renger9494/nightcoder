//use relative paths for publish
import { useCssStylesPublish } from '../common/visual/cssStyles.hook';

export default function useInjectCustomBrakePointForStyleEntity(styleEntity: string, customBrakePoints: { name: string, maxWidth: string, minWidth: string }[], element: any) {
  let styles = '';
  for (const { minWidth, maxWidth, name } of customBrakePoints) {
    const minQuery = minWidth ? `(min-width: ${minWidth}px)` : '';
    const maxQuery = maxWidth ? ` and (max-width: ${maxWidth}px)` : '';
    const styleCSS = useCssStylesPublish({ [styleEntity]: element.styles[name][styleEntity] }, [styleEntity]);
    styles += `@media only screen and ${minQuery}${maxQuery} {
      #${element.id} {
        ${styleCSS}
      }
    }`;
  }

  return styles;
}

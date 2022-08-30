import textContent from '@/helpers/elementsContent/text';
import { textboxStyleTypes } from '@/constants/textBoxStyle';
import { breakpointsWidths } from '@/constants/breakpoints';

const textStyles = () => {
  const styles = (type: string) => ({
    alignItems: 'flex-start',
    letterSpacing: '0em',
    font: 'normal normal 28px/normal "Inter", sans-serif',
    fontSize: `${((28 / breakpointsWidths[type]) * 100).toFixed(4)}vw`,
    color: 'rgba(0, 0, 0, 1)'
  });

  return {
    laptop: { ...styles('laptop') },
    tablet: { ...styles('tablet') },
    mobile: { ...styles('mobile') }
  };
};

const textLocation = (coords?: { x: number; y: number } | null) => {
  const location = (type: string) => ({
    ...(coords ? { y: coords.y - 52 } : { y: 0 }),
    ...(coords ? { x: coords.x - 155 } : { x: 0 }),
    ...(coords ? { xInPercent: (((coords.x - 155) / breakpointsWidths[type]) * 100).toFixed(4) } : { xInPercent: 0 }),
    //remember if you change (w) you need also recalculate (wInPercent) here is formula (width / breakpointsWidths.laptop) * 100
    w: 310,
    wInPercent: ((310 / breakpointsWidths[type]) * 100).toFixed(4),
    h: 104,
    a: 0,
    textBoxStyle: textboxStyleTypes.AUTO_HEIGHT
  });

  return {
    laptop: { ...location('laptop') },
    tablet: { ...location('tablet') },
    mobile: { ...location('mobile') }
  };
};

const textPayload = () => {
  return {
    type: 'p',
    content: textContent,
    isContentChanged: false,
    font: {
      laptop: 'Inter:100,200,300,400,500,600,700,800,900'
    }
  };
};

export { textStyles, textLocation, textPayload };

import { textboxStyleTypes } from '@/constants/textBoxStyle';
import { breakpointsWidths } from '@/constants/breakpoints';

const buttonStyles = () => {
  const styles = {
    textAlign: 'center',
    letterSpacing: '0px',
    font: 'normal normal 14px/normal "Inter", sans-serif',
    color: 'rgba(255, 255, 255, 1)',
    borderRadius: '6px',
    background: 'rgba(0,64,255,1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gridGap: '10px',
    width: '14px'
  };

  return {
    laptop: { ...styles },
    tablet: { ...styles },
    mobile: { ...styles }
  };
};

const buttonLocation = (coords?: { x: number; y: number } | null) => {
  const location = (type: string) => ({
    ...(coords ? { y: coords.y - 23 } : { y: 0 }),
    ...(coords ? { x: coords.x - 69 } : { x: 0 }),
    ...(coords ? { xInPercent: (((coords.x - 69) / breakpointsWidths[type]) * 100).toFixed(4) } : { xInPercent: 0 }),
    //remember if you change (w) you need also recalculate (wInPercent) here is formula (width / breakpointsWidths.laptop) * 100
    w: 138,
    wInPercent: ((138 / breakpointsWidths[type]) * 100).toFixed(4),
    h: 46,
    a: 0,
    textBoxStyle: textboxStyleTypes.FIXED
  });

  return {
    laptop: { ...location('laptop') },
    tablet: { ...location('tablet') },
    mobile: { ...location('mobile') }
  };
};

const buttonPayload = () => {
  return {
    content: 'Get Started',
    image: {
      fullPath: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/btn_icon.svg`
    },
    isIconHidden: true,
    iconPosition: 'left'
  };
};

export { buttonStyles, buttonLocation, buttonPayload };

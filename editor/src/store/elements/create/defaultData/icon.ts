import { breakpointsWidths } from '@/constants/breakpoints';

const iconStyles = () => {
  const styles = {
    borderRadius: '0px',
    objectFit: 'contain',
    opacity: 1
  };

  return {
    laptop: { ...styles },
    tablet: { ...styles },
    mobile: { ...styles }
  };
};

const iconLocation = (coords?: { x: number; y: number } | null) => {
  const location = (type: string) => ({
    ...(coords ? { y: coords.y - 40 } : { y: 0 }),
    ...(coords ? { x: coords.x - 40 } : { x: 0 }),
    ...(coords ? { xInPercent: (((coords.x - 40) / breakpointsWidths[type]) * 100).toFixed(4) } : { xInPercent: 0 }),
    //remember if you change (w) you need also recalculate (wInPercent) here is formula (width / breakpointsWidths.laptop) * 100
    w: 80,
    wInPercent: ((80 / breakpointsWidths[type]) * 100).toFixed(4),
    h: 80,
    a: 0
  });

  return {
    laptop: { ...location('laptop') },
    tablet: { ...location('tablet') },
    mobile: { ...location('mobile') }
  };
};

const iconPayload = () => {
  const iconImagePath = `${process.env.VUE_APP_BUCKET_NAME}/Defaults/iconlement.svg`;
  return {
    src: `${iconImagePath}, ${iconImagePath} 2x`
  };
};

export { iconStyles, iconLocation, iconPayload };

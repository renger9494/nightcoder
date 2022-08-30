import { breakpointsWidths } from '@/constants/breakpoints';

const imageStyles = () => {
  const styles = {
    borderRadius: '0px',
    objectFit: 'cover',
    opacity: 1
  };

  return {
    laptop: { ...styles },
    tablet: { ...styles },
    mobile: { ...styles }
  };
};

const imageLocation = (coords?: { x: number; y: number } | null) => {
  const location = (type: string) => ({
    ...(coords ? { y: coords.y - 220 } : { y: 0 }),
    ...(coords ? { x: coords.x - 328 } : { x: 0 }),
    ...(coords ? { xInPercent: (((coords.x - 328) / breakpointsWidths[type]) * 100).toFixed(4) } : { xInPercent: 0 }),
    //remember if you change (w) you need also recalculate (wInPercent) here is formula (width / breakpointsWidths.laptop) * 100
    w: 660,
    wInPercent: ((660 / breakpointsWidths[type]) * 100).toFixed(4),
    h: 440,
    a: 0
  });

  return {
    laptop: { ...location('laptop') },
    tablet: { ...location('tablet') },
    mobile: { ...location('mobile') }
  };
};

const imagePayload = () => {
  const imagePath = `${process.env.VUE_APP_BUCKET_NAME}/Defaults/imgelement.jpg`;
  return {
    image: {
      fullPath: imagePath,
      fullPathJp2: imagePath,
      fullPathWebP: imagePath
    }
  };
};

export { imageStyles, imageLocation, imagePayload };

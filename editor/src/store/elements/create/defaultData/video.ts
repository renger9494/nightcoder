import { breakpointsWidths } from '@/constants/breakpoints';

const videoStyles = () => {
  const styles = {
    borderRadius: '0px'
  };

  return {
    laptop: { ...styles },
    tablet: { ...styles },
    mobile: { ...styles }
  };
};

const videoLocation = (coords?: { x: number; y: number } | null) => {
  const location = (type: string) => ({
    ...(coords ? { y: coords.y - 150 } : { y: 0 }),
    ...(coords ? { x: coords.x - 250 } : { x: 0 }),
    ...(coords ? { xInPercent: (((coords.x - 250) / breakpointsWidths[type]) * 100).toFixed(4) } : { xInPercent: 0 }),
    //remember if you change (w) you need also recalculate (wInPercent) here is formula (width / breakpointsWidths.laptop) * 100
    w: 500,
    wInPercent: ((500 / breakpointsWidths[type]) * 100).toFixed(4),
    h: 300,
    a: 0
  });

  return {
    laptop: { ...location('laptop') },
    tablet: { ...location('tablet') },
    mobile: { ...location('mobile') }
  };
};

const videoPayload = () => {
  return {
    url: 'https://www.youtube.com/embed/n3Dru5y3ROc',
    isAutoplay: 0,
    isLoop: 0,
    isMute: 0
  };
};

export { videoStyles, videoLocation, videoPayload };

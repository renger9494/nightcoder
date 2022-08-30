import { breakpointsWidths } from '@/constants/breakpoints';

const circleStyles = () => {
  const styles = {
    borderRadius: '50%',
    background: 'rgba(49, 139, 245, 1)'
  };

  return {
    laptop: { ...styles },
    tablet: { ...styles },
    mobile: { ...styles }
  };
};

const circleLocation = (coords?: { x: number, y: number } | null) => {
  const location = (type: string) => ({
    ...(coords ? { y: coords.y - 50 } : { y: 0 }),
    ...(coords ? { x: coords.x - 50 } : { x: 0 }),
    ...(coords ? { xInPercent: (((coords.x - 50) / breakpointsWidths[type]) * 100).toFixed(4) } : { xInPercent: 0 }),
    //remember if you change (w) you need also recalculate (wInPercent) here is formula (width / breakpointsWidths.laptop) * 100
    w: 100,
    wInPercent: ((100 / breakpointsWidths[type]) * 100).toFixed(4),
    h: 100,
    a: 0
  });

  return {
    laptop: { ...location('laptop') },
    tablet: { ...location('tablet') },
    mobile: { ...location('mobile') }
  };
};

const circlePayload = () => {
  return {};
};

export { circleStyles, circleLocation, circlePayload };

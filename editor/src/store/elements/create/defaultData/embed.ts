import { breakpointsWidths } from '@/constants/breakpoints';

const embedStyles = () => {
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

const embedLocation = (coords?: { x: number; y: number } | null) => {
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

const embedPayload = () => {
  return {
    code:
      '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/ncT1R2hMpaQ?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    type: 'Youtube'
  };
};

export { embedStyles, embedLocation, embedPayload };

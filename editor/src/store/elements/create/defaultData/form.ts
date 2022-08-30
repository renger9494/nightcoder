import { breakpointsWidths } from '@/constants/breakpoints';
import { getId } from '@/helpers/randomString';

const formStyles = () => {
  const styles = {
    display: 'grid',
    gridAutoFlow: 'row',
    gridGap: '20px'
  };

  return {
    laptop: { ...styles },
    tablet: { ...styles },
    mobile: { ...styles }
  };
};

export const buttonElement = () => {
  const style = (brakepoint: string) => ({
    textAlign: 'center',
    letterSpacing: '0px',
    font: 'normal normal 14px/normal "Inter", sans-serif',
    fontSize: `${((14 / breakpointsWidths[brakepoint]) * 100).toFixed(4)}vw`,
    color: 'rgba(255, 255, 255, 1)',
    borderRadius: '6px',
    background: 'rgba(0,64,255,1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 10px',
    height: '46px'
  });

  const styles = {
    laptop: { ...style('laptop') },
    tablet: { ...style('tablet') },
    mobile: { ...style('mobile') }
  };

  return {
    id: `button_${getId()}`,
    type: 'button',
    payload: {
      text: 'Send',
      font: {
        laptop: 'Inter:100,200,300,400,500,600,700,800,900'
      }
    },
    styles
  };
};

const inputStyles = () => {
  const style = (brakepoint: string) => ({
    textAlign: 'center',
    letterSpacing: '0px',
    background: 'rgba(255,255,255,1)',
    font: 'normal normal 14px/normal "Inter", sans-serif',
    fontSize: `${((14 / breakpointsWidths[brakepoint]) * 100).toFixed(4)}vw`,
    borderRadius: '6px',
    border: '1px solid rgba(0,0,0,1)',
    color: 'rgba(0,0,0,1)',
    padding: '0 10px',
    height: '46px'
  });

  return {
    laptop: { ...style('laptop') },
    tablet: { ...style('tablet') },
    mobile: { ...style('mobile') }
  };
};

export const inputElement = (placeholderName: string, styles: any = inputStyles()) => {
  return {
    id: `input_${getId()}`,
    type: 'input',
    payload: {
      text: placeholderName,
      type: 'text',
      font: {
        laptop: 'Inter:100,200,300,400,500,600,700,800,900'
      }
    },
    styles
  };
};

const formElements = () => {
  return [inputElement('Your Email'), buttonElement()];
};

const formLocation = (coords?: { x: number; y: number } | null) => {
  const location = (type: string) => ({
    ...(coords ? { y: coords.y - 56 } : { y: 0 }),
    ...(coords ? { x: coords.x - 150 } : { x: 0 }),
    ...(coords ? { xInPercent: (((coords.x - 150) / breakpointsWidths[type]) * 100).toFixed(4) } : { xInPercent: 0 }),
    //remember if you change (w) you need also recalculate (wInPercent) here is formula (width / breakpointsWidths.laptop) * 100
    w: 300,
    wInPercent: ((300 / breakpointsWidths[type]) * 100).toFixed(4),
    h: 112,
    a: 0
  });

  return {
    laptop: { ...location('laptop') },
    tablet: { ...location('tablet') },
    mobile: { ...location('mobile') }
  };
};

const formPayload = () => {
  return {
    integration: 'mailchimp',
    list: '',
    url: ''
  };
};

export { formStyles, formLocation, formPayload, formElements };

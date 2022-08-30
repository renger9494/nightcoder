// @deprecated??
import { getId } from '../helpers/randomString';

const firstComponentId = `block_${getId()}`;
const components = [
  {
    parentId: null,
    parentComp: null,
    id: firstComponentId,
    dbId: -1,
    sortId: 0,
    name: 'Empty Block',
    type: 'block',
    elements: [],
    payload: {
      zIndex: 0,
      src: ''
    },
    styles: {
      lg: {
        heightType: 'fixed',
        height: '1000px',
        background: 'rgba(255, 255, 255, 1)',
        objectFit: 'cover',
        opacity: 1,
        overlayColor: null,
        overlayOpacity: null
      },
      laptop: {
        heightType: 'fixed',
        height: '800px',
        background: 'rgba(255, 255, 255, 1)',
        objectFit: 'cover',
        opacity: 1,
        overlayColor: null,
        overlayOpacity: null
      },
      tablet: {
        heightType: 'fixed',
        height: '1024px',
        background: 'rgba(255, 255, 255, 1)',
        objectFit: 'cover',
        opacity: 1,
        overlayColor: null,
        overlayOpacity: null
      },
      mobile: {
        heightType: 'fixed',
        height: '1500px',
        background: 'rgba(255, 255, 255, 1)',
        objectFit: 'cover',
        opacity: 1,
        overlayColor: null,
        overlayOpacity: null
      }
    }
  }
];

export default {
  template: 'custom',
  root: {
    wrapper: {
      image: {
        src: null,
        active: false
      },
      bgColor: '#FBFBFB'
    },
    containerWidtheight: 1280,
    containerPosition: 'unset'
  },
  googleFonts: {
    fonts: ['Inter:100,200,300,400,500,600,700,800,900']
  },
  branding: {
    theme: 'black',
    position: 'br'
  },
  allComponents: {
    // [firstComponentId]: components[0]
  },
  components: []
};

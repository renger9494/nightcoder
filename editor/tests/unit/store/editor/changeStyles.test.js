import { changeSelectedElementsStyle, changeComponentStyle } from '@/store/elements/changeStyle/index.js';
import breakpoints from '@/constants/breakpoints';
// jest.mock('@/store/editor.js', () => {
//   return jest.fn().mockImplementation(() => {
//     return { mutations: { changeEditorHistory: (state, { newConfigString, oldConfigString }) => '' } };
//   });
// });
jest.mock('@/store/editor.js');

describe('ChangeSelectedElementsStyleTests', () => {
  let userConfig;
  let state;
  let elementId;

  beforeEach(() => {
    elementId = 'something_1';
    userConfig = {
      allComponents: {
        [elementId]: {
          styles: {
            laptop: {
              font: '63px Chivo, serif',
              border: '1px solid'
            },
            tablet: {
              font: '63px Chivo, serif',
              border: '1px solid'
            },
            mobile: {
              font: '63px Chivo, serif',
              border: '1px solid'
            }
          }
        }
      }
    };

    state = {
      breakpoints,
      userConfig,
      selectedElements: [{ element: { id: elementId } }]
    };
  });

  test('TestChangeSelectedElementsStyleOnAnotherBreakpoints_WhenUserChangeFontOnLaptop', () => {
    let data = {
      font: '62px Chivo, serif'
    };

    state.previewMode = 'laptop';

    changeSelectedElementsStyle(state, data);

    const componentStyles = userConfig.allComponents[elementId].styles;

    Object.keys(componentStyles).forEach(breakpoint => {
      expect(componentStyles[breakpoint].font).toBe(data.font);
    });
  });

  test('TestChangeSelectedElementsStyleOnAllBreakpoints_WhenUserChangeAnotherStylesOnLaptop', () => {
    let cssKey = 'border';
    let data = {
      [cssKey]: '2px solid'
    };

    state.previewMode = 'laptop';

    changeSelectedElementsStyle(state, data);

    const componentStyles = userConfig.allComponents[elementId].styles;

    Object.keys(componentStyles).forEach(breakpoint => {
      expect(componentStyles[breakpoint][cssKey]).toBe(data[cssKey]);
    });
  });

  test('TestChangeSelectedElementsStyleOnOnlyMobileAndTablet_WhenUserChangeFontOnTablet', () => {
    let data = {
      font: '62px Chivo, serif'
    };

    state.previewMode = 'tablet';

    changeSelectedElementsStyle(state, data);

    const componentStyles = userConfig.allComponents[elementId].styles;

    Object.keys(componentStyles).forEach(breakpoint => {
      if (breakpoint == 'laptop') {
        expect(componentStyles[breakpoint].font).not.toBe(data.font);
      } else {
        expect(componentStyles[breakpoint].font).toBe(data.font);
      }
    });
  });

  test('TestChangeSelectedElementsStyleOnOnlyMobile_WhenUserChangeFontOnMobile', () => {
    let data = {
      font: '62px Chivo, serif'
    };

    state.previewMode = 'mobile';

    changeSelectedElementsStyle(state, data);

    const componentStyles = userConfig.allComponents[elementId].styles;

    Object.keys(componentStyles).forEach(breakpoint => {
      if (breakpoint == 'mobile') {
        expect(componentStyles[breakpoint].font).toBe(data.font);
      } else {
        expect(componentStyles[breakpoint].font).not.toBe(data.font);
      }
    });
  });

  test('TestChangeComponentStyleOnAnotherBreakpoints_WhenUserChangeFontOnLaptop', () => {
    let data = {
      font: '62px Chivo, serif'
    };

    state.previewMode = 'laptop';

    changeComponentStyle(state, { component: { id: elementId }, data });

    const componentStyles = userConfig.allComponents[elementId].styles;

    Object.keys(componentStyles).forEach(breakpoint => {
      expect(componentStyles[breakpoint].font).toBe(data.font);
    });
  });

  test('TestChangeComponentStyleOnOnlyMobileAndTablet_WhenUserChangeFontOnTablet', () => {
    let data = {
      font: '62px Chivo, serif'
    };

    state.previewMode = 'tablet';

    changeComponentStyle(state, { component: { id: elementId }, data });

    const componentStyles = userConfig.allComponents[elementId].styles;

    Object.keys(componentStyles).forEach(breakpoint => {
      if (breakpoint == 'laptop') {
        expect(componentStyles[breakpoint].font).not.toBe(data.font);
      } else {
        expect(componentStyles[breakpoint].font).toBe(data.font);
      }
    });
  });

  test('TestChangeComponentStyleOnOnlyMobile_WhenUserChangeFontOnMobile', () => {
    let data = {
      font: '62px Chivo, serif'
    };

    state.previewMode = 'mobile';

    changeComponentStyle(state, { component: { id: elementId }, data });

    const componentStyles = userConfig.allComponents[elementId].styles;

    Object.keys(componentStyles).forEach(breakpoint => {
      if (breakpoint == 'mobile') {
        expect(componentStyles[breakpoint].font).toBe(data.font);
      } else {
        expect(componentStyles[breakpoint].font).not.toBe(data.font);
      }
    });
  });

  test('TestChangeComponentStyleOnAllBreakpoints_WhenUserChangeAnotherStylesOnLaptop', () => {
    let cssKey = 'border';
    let data = {
      [cssKey]: '2px solid'
    };

    state.previewMode = 'laptop';

    changeComponentStyle(state, { component: { id: elementId }, data });

    const componentStyles = userConfig.allComponents[elementId].styles;

    Object.keys(componentStyles).forEach(breakpoint => {
      expect(componentStyles[breakpoint][cssKey]).toBe(data[cssKey]);
    });
  });
});

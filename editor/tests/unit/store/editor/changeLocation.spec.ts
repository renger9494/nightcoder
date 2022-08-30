import { changeElementLocation } from '@/store/elements/changeLocation/index.js';
import breakpoints from '@/constants/breakpoints';
// jest.mock('@/store/editor.js', () => {
//   return jest.fn().mockImplementation(() => {
//     return { mutations: { changeEditorHistory: (state, { newConfigString, oldConfigString }) => '' } };
//   });
// });
jest.mock('@/store/editor.js');

interface StringObjectKeys<T> {
  [key: string]: T;
}

enum PreviewMode {
  Laptop = 'laptop',
  Tablet = 'tablet',
  Mobile = 'mobile'
}

type ElementLocationsBreakpointChanged = {
  [PreviewMode.Laptop]: boolean
  [PreviewMode.Tablet]: boolean
  [PreviewMode.Mobile]: boolean
}

interface UserConfig {
  elementLocationsBreakpointChanged?: ElementLocationsBreakpointChanged;
  allComponents: StringObjectKeys<Element>,
  components?: Element[]
}

interface TestState {
  breakpoints: string[];
  userConfig: UserConfig;
  selectedElements: any[];
  previewMode?: PreviewMode;
}

interface ElementLocation extends StringObjectKeys<BreakpointLocation> {
  laptop: BreakpointLocation;
  tablet: BreakpointLocation;
  mobile: BreakpointLocation;
}

interface Element {
  id: string;
  location: ElementLocation
}

interface BreakpointLocation extends StringObjectKeys<number | boolean> {
  x: number;
  y: number;
  w: number;
  h: number;
  a: number;
}

interface Location extends StringObjectKeys<number> {
  x: number;
  y: number;
}

interface Size extends StringObjectKeys<number> {
  w: number;
  h: number;
}

describe('ChangeElementLocationTests', () => {
  let userConfig;
  let state: TestState;
  let elementId;
  let element: Element;

  beforeEach(() => {
    elementId = 'something_1';
    element = {
      id: elementId,
      location: {
        laptop: {
          x: 25,
          y: 35,
          w: 150,
          h: 550,
          a: 0
        },
        tablet: {
          x: 25,
          y: 35,
          w: 150,
          h: 550,
          a: 0
        },
        mobile: {
          x: 25,
          y: 35,
          w: 150,
          h: 550,
          a: 0
        }
      }
    };

    userConfig = {
      elementLocationsBreakpointChanged: {
        [PreviewMode.Laptop]: false,
        [PreviewMode.Mobile]: false,
        [PreviewMode.Tablet]: false
      },
      allComponents: {
        [elementId]: element
      }
    };

    state = {
      breakpoints,
      userConfig,
      selectedElements: [{ element: { id: elementId } }]
    };
  });

  test('TestChangeElementLocationSetLocationAllBreakpoints_WhenUserChangeLocationOnLaptop', () => {
    const data: Location = { x: 100, y: 100 };

    state.previewMode = PreviewMode.Laptop;

    changeElementLocation(state, { element, data });

    Object.keys(element.location).forEach(breakpoint => {
      Object.keys(data).forEach(dataKey => {
        expect(element.location[breakpoint][dataKey]).toBe(data[dataKey]);
      });
    });
  });

  test('TestChangeElementLocationOnlyLaptop_WhenUserChangeLocationOnTabletAndMobile', () => {
    const data: Location = { x: 100, y: 100 };

    state.previewMode = PreviewMode.Laptop;
    const elementLocationsBreakpointChanged = state.userConfig.elementLocationsBreakpointChanged;
    if (elementLocationsBreakpointChanged) {
      elementLocationsBreakpointChanged[PreviewMode.Tablet] = true;
      elementLocationsBreakpointChanged[PreviewMode.Mobile] = true;
    }

    changeElementLocation(state, { element, data });

    Object.keys(element.location).forEach(breakpoint => {
      Object.keys(data).forEach(dataKey => {
        if (breakpoint != PreviewMode.Laptop) {
          expect(element.location[breakpoint][dataKey]).not.toBe(data[dataKey]);
        } else {
          expect(element.location[breakpoint][dataKey]).toBe(data[dataKey]);
        }
      });
    });

    expect(elementLocationsBreakpointChanged).not.toBe(null);
    if (elementLocationsBreakpointChanged) {
      expect(elementLocationsBreakpointChanged[PreviewMode.Laptop]).toBe(true);
    }
  });

  test('TestChangeElementLocationOnlyLaptopAndTablet_WhenUserChangeLocationOnMobile', () => {
    const data: Location = { x: 100, y: 100 };

    state.previewMode = PreviewMode.Laptop;
    const elementLocationsBreakpointChanged = state.userConfig.elementLocationsBreakpointChanged;
    if (elementLocationsBreakpointChanged) {
      elementLocationsBreakpointChanged[PreviewMode.Mobile] = true;
    }

    changeElementLocation(state, { element, data });

    Object.keys(element.location).forEach(breakpoint => {
      Object.keys(data).forEach(dataKey => {
        if (breakpoint == PreviewMode.Mobile) {
          expect(element.location[breakpoint][dataKey]).not.toBe(data[dataKey]);
        } else {
          expect(element.location[breakpoint][dataKey]).toBe(data[dataKey]);
        }
      });
    });

    expect(elementLocationsBreakpointChanged).not.toBe(null);
    if (elementLocationsBreakpointChanged) {
      expect(elementLocationsBreakpointChanged[PreviewMode.Laptop]).toBe(true);
    }
  });

  test('TestChangeElementLocationOnlyLaptopAndTablet_WhenUserChangeLocationOnMobile', () => {
    const data: Location = { x: 100, y: 100 };

    state.previewMode = PreviewMode.Tablet;
    let elementLocationsBreakpointChanged = state.userConfig.elementLocationsBreakpointChanged;

    changeElementLocation(state, { element, data });

    Object.keys(element.location).forEach(breakpoint => {
      Object.keys(data).forEach(dataKey => {
        if (breakpoint == PreviewMode.Laptop) {
          expect(element.location[breakpoint][dataKey]).not.toBe(data[dataKey]);
        } else {
          expect(element.location[breakpoint][dataKey]).toBe(data[dataKey]);
        }
      });
    });

    expect(elementLocationsBreakpointChanged).not.toBe(null);
    if (elementLocationsBreakpointChanged) {
      expect(elementLocationsBreakpointChanged[state.previewMode]).toBe(true);
    }
  });

  test('TestChangeElementLocationSetLocationOnlyTabletAndMobile_WhenUserChangeLocationOnTablet', () => {
    const data: Location = { x: 100, y: 100 };

    state.previewMode = PreviewMode.Tablet;

    changeElementLocation(state, { element, data });

    Object.keys(element.location).forEach(breakpoint => {
      Object.keys(data).forEach(dataKey => {
        if (breakpoint != PreviewMode.Laptop) {
          expect(element.location[breakpoint][dataKey]).toBe(data[dataKey]);
        } else {
          expect(element.location[breakpoint][dataKey]).not.toBe(data[dataKey]);
        }
      });
    });
  });

  test('TestChangeElementLocationSetLocationOnlyMobile_WhenUserChangeLocationOnMobile', () => {
    const data: Location = { x: 100, y: 100 };

    state.previewMode = PreviewMode.Mobile;

    changeElementLocation(state, { element, data });

    Object.keys(element.location).forEach(breakpoint => {
      Object.keys(data).forEach(dataKey => {
        if (breakpoint == state.previewMode) {
          expect(element.location[breakpoint][dataKey]).toBe(data[dataKey]);
        } else {
          expect(element.location[breakpoint][dataKey]).not.toBe(data[dataKey]);
        }
      });
    });
  });

  test('TestChangeElementLocationSetSizeOnAllBreakpoints_WhenUserChangeSizeOnLaptop', () => {
    const data: Size = { w: 100, h: 100 };

    state.previewMode = PreviewMode.Laptop;

    changeElementLocation(state, { element, data });

    Object.keys(element.location).forEach(breakpoint => {
      Object.keys(data).forEach(dataKey => {
        expect(element.location[breakpoint][dataKey]).toBe(data[dataKey]);
      });
    });
  });

  test('TestChangeElementLocationSetSizeOnlyTabletAndMobile_WhenUserChangeSizeOnTablet', () => {
    const data: Size = { w: 100, h: 100 };

    state.previewMode = PreviewMode.Tablet;

    changeElementLocation(state, { element, data });

    Object.keys(element.location).forEach(breakpoint => {
      Object.keys(data).forEach(dataKey => {
        if (breakpoint == PreviewMode.Laptop) {
          expect(element.location[breakpoint][dataKey]).not.toBe(data[dataKey]);
        } else {
          expect(element.location[breakpoint][dataKey]).toBe(data[dataKey]);
        }
      });
    });
  });

  test('TestChangeElementLocationSetSizeOnlyMobile_WhenUserChangeSizeOnMobile', () => {
    const data: Size = { w: 100, h: 100 };

    state.previewMode = PreviewMode.Mobile;

    changeElementLocation(state, { element, data });

    Object.keys(element.location).forEach(breakpoint => {
      Object.keys(data).forEach(dataKey => {
        if (breakpoint == state.previewMode) {
          expect(element.location[breakpoint][dataKey]).toBe(data[dataKey]);
        } else {
          expect(element.location[breakpoint][dataKey]).not.toBe(data[dataKey]);
        }
      });
    });
  });
});

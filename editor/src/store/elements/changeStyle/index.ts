import Vue from 'vue';
import { mutations as editorMutations } from '../../editor';
import { getElementsBreakpointChanges } from '@/store/elements/changeLocation';
import { breakpointsWidths } from '@/constants/breakpoints';

/**
 * Change elements styles
 * @param {object} state - vuex state
 * @param {object} data - includes information of element's styles which we need to change
 * @param {array} elements - array of elements which we need to change styles
 */
function changeElementsStyles(state: any, data: any, elements: any[]) {
  const dataKeys = Object.keys(data);
  const currentBreakpointIndex = state.breakpoints.indexOf(state.previewMode);

  const excludeStyles = ['display'];

  for (const el of elements) {
    const elementStyles = el.element.styles;
    const elementBreakpointChanges = getElementsBreakpointChanges(state, el.element);

    for (const style of dataKeys) {
      if (excludeStyles.includes(style)) {
        Vue.set(elementStyles[state.previewMode], style, data[style]);
        return;
      }

      state.breakpoints.map((breakpoint: string, index: number) => {
        if (index <= currentBreakpointIndex || elementBreakpointChanges[breakpoint][el.element.id]?.style) return;
        data[style]
          ? Vue.set(elementStyles[breakpoint], style, data[style])
          : Vue.delete(elementStyles[breakpoint], style);
      });

      Vue.set(elementBreakpointChanges[state.previewMode][el.element.id], 'style', true);
      data[style]
        ? Vue.set(elementStyles[state.previewMode], style, data[style])
        : Vue.delete(elementStyles[state.previewMode], style);
    }
  }
}

/**
 * Change elements fontSize style
 * @param {object} state - vuex state
 * @param {string} size - includes information of element's styles which we need to change
 * @param {any} element - element which we need to change styles
 */
function setElementsResponsiveFontStyle(state: any, size: string, element: any) {
  const currentBreakpointIndex = state.breakpoints.indexOf(state.previewMode);

  const elementStyles = element.styles;
  const elementBreakpointChanges = getElementsBreakpointChanges(state, element);

  state.breakpoints.map((breakpoint: string, index: number) => {
    if (index <= currentBreakpointIndex || elementBreakpointChanges[breakpoint][element.id]?.style) return;
    Vue.set(
      elementStyles[breakpoint],
      'fontSize',
      `${((parseFloat(size) / breakpointsWidths[breakpoint]) * 100).toFixed(4)}vw`
    );
  });

  Vue.set(elementBreakpointChanges[state.previewMode][element.id], 'style', true);
  Vue.set(
    elementStyles[state.previewMode],
    'fontSize',
    `${((parseFloat(size) / breakpointsWidths[state.previewMode]) * 100).toFixed(4)}vw`
  );
}

/**
 * Change multiple elements styles
 * @param {object} state - vuex state
 * @param {object} data - includes information of element's styles which we need to change
 * @param {array} elements - array of elements which we need to change styles
 */
function changeMultipleElementsStyles(state: any, data: any, elements: any[]) {
  const dataKeys = Object.keys(data);

  for (const el of elements) {
    const elementStyles = el.styles;

    for (const style of dataKeys) {
      Vue.set(elementStyles[state.previewMode], style, data[style]);
    }
  }
}

/**
 * Change collection of elements where style entity is one but in that entity there are multiple values
 * @param {object} state - vuex state
 * @param {array} elementsCollection - includes information of element's styles which we need to change
 */
function changeMultipleElementsUniqueStyles(state: any, elementsCollection: any) {
  const currentBreakpointIndex = state.breakpoints.indexOf(state.previewMode);
  for (const item of elementsCollection) {
    const dataKeys = Object.keys(item.data);
    const elementBreakpointChanges = getElementsBreakpointChanges(state, item.element);
    const elementStyles = item.element.styles;

    for (const style of dataKeys) {
      if (style === 'fontSize') {
        setElementsResponsiveFontStyle(state, item.data[style], item.element);
      } else {
        state.breakpoints.map((breakpoint: string, index: number) => {
          if (index <= currentBreakpointIndex || elementBreakpointChanges[breakpoint][item.element.id]?.style) return;
          Vue.set(elementStyles[breakpoint], style, item.data[style]);
        });

        Vue.set(elementBreakpointChanges[state.previewMode][item.element.id], 'style', true);
        Vue.set(elementStyles[state.previewMode], style, item.data[style]);
      }
    }

    if (item.resizeImmediately && item.element.location) {
      editorMutations.changeElementLocation(state, {
        element: item.element,
        data: { resizeImmediately: true },
        isSaveHistory: false
      });
    }
  }
}

const changeSelectedElementsStyle = (state: any, data: any) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  changeElementsStyles(state, data, state.selectedElements);
};

const changeComponentStyle = (
  state: any,
  { component, data, isSaveHistory = true }: { component: any; data: any; isSaveHistory: boolean }
) => {
  if (isSaveHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }

  changeElementsStyles(state, data, [{ element: component }]);
};

const changeElementResponsiveFontStyle = (
  state: any,
  { component, data, isSaveHistory = true }: { component: any; data: any; isSaveHistory: boolean }
) => {
  if (isSaveHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }

  setElementsResponsiveFontStyle(state, data, component);
};

const changeMultipleComponentStyle = (
  state: any,
  { elements, data, isSaveHistory = true }: { elements: any; data: any; isSaveHistory: boolean }
) => {
  if (isSaveHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }

  changeMultipleElementsStyles(state, data, elements);
};

const changeMultipleElementsByUniqueStyles = (
  state: any,
  { elementsCollection, isSaveHistory = true }: { elementsCollection: any; isSaveHistory: boolean }
) => {
  if (isSaveHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }

  changeMultipleElementsUniqueStyles(state, elementsCollection);
};

export {
  changeSelectedElementsStyle,
  changeComponentStyle,
  changeMultipleComponentStyle,
  changeMultipleElementsByUniqueStyles,
  changeElementResponsiveFontStyle
};

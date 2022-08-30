import Vue from 'vue';
import { mutations as editorMutations } from '../../editor';
import ALIGN from '@/constants/align';
import { breakpointsWidths } from '@/constants/breakpoints';
import { ElementLocation, getElementsBreakpointChanges } from './index';

function getDigitFromString(str: string) {
  const regex = /[0-9]*/g;
  const matches = regex.exec(str);
  if (!matches || matches.length == 0) throw new Error('[getDigitFromString]: no matches');

  return parseInt(matches[0]);
}

/**
 * align one selected elements by parent element
 * @param {object} state - vuex state
 * @param {object} params - params with align type
 */
const alignElementToParent = (state: any, { type }: { type: number }) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  const el = state.selectedElements[0];
  const elementConfig = state.userConfig.allComponents[el.element.id];
  const parentElementLocation = elementConfig.location[state.previewMode];
  const block = state.userConfig.allComponents[elementConfig.parentId];

  const parentHeight = parentElementLocation.h;
  const parentWidth = parentElementLocation.w;

  const currentBreakpointIndex = state.breakpoints.indexOf(state.previewMode);
  const elementsBreakpointChanges = getElementsBreakpointChanges(state, el.element);

  switch (type) {
    case ALIGN.LEFT:
      state.breakpoints.forEach((key: string, index: number) => {
        if (index <= currentBreakpointIndex || elementsBreakpointChanges[key][el.element.id]?.location) return;

        Vue.set(elementConfig.location[key], 'x', 0);
        Vue.set(elementConfig.location[key], 'xInPercent', 0);

        if (elementConfig.location[key].xaxisAlign) {
          Vue.set(elementConfig.location[key], 'xaxisAlign', null);
        }
      });

      Vue.set(parentElementLocation, 'x', 0);
      Vue.set(parentElementLocation, 'xInPercent', 0);
      if (parentElementLocation.xaxisAlign) {
        Vue.set(parentElementLocation, 'xaxisAlign', null);
      }
      break;
    case ALIGN.RIGHT:
      const createXaxisAlign = (key: string) => ({
        right: '0px',
        left: `${breakpointsWidths[key] - parentWidth}px`
      });

      state.breakpoints.forEach((key: string, index: number) => {
        if (index <= currentBreakpointIndex || elementsBreakpointChanges[key][el.element.id]?.location) return;

        Vue.set(elementConfig.location[key], 'x', breakpointsWidths[key] - parentWidth);
        Vue.set(
          elementConfig.location[key],
          'xInPercent',
          (((breakpointsWidths[key] - parentWidth) / breakpointsWidths[key]) * 100).toFixed(4)
        );
        Vue.set(elementConfig.location[key], 'xaxisAlign', createXaxisAlign(key));
      });

      Vue.set(parentElementLocation, 'x', breakpointsWidths[state.previewMode] - parentWidth);
      Vue.set(
        parentElementLocation,
        'xInPercent',
        (((breakpointsWidths[state.previewMode] - parentWidth) / breakpointsWidths[state.previewMode]) * 100).toFixed(4)
      );
      Vue.set(parentElementLocation, 'xaxisAlign', createXaxisAlign(state.previewMode));
      break;
    case ALIGN.TOP:
      state.breakpoints.forEach((key: string, index: number) => {
        if (index <= currentBreakpointIndex || elementsBreakpointChanges[key][el.element.id]?.location) return;

        Vue.set(elementConfig.location[key], 'y', 0);
        if (elementConfig.location[key].yaxisAlign) {
          Vue.set(elementConfig.location[key], 'yaxisAlign', null);
        }
      });

      Vue.set(parentElementLocation, 'y', 0);
      if (parentElementLocation.yaxisAlign) {
        Vue.set(parentElementLocation, 'yaxisAlign', null);
      }
      break;
    case ALIGN.BOTTOM:
      function getBlockHeight(key: string) {
        const blockHeight = getDigitFromString(block.styles[key].height);
        return blockHeight - parentHeight;
      }

      const createYaxisAlign = (key: string) => ({
        bottom: '0px',
        top: `${getBlockHeight(key)}px`
      });

      state.breakpoints.forEach((key: string, index: number) => {
        if (index <= currentBreakpointIndex || elementsBreakpointChanges[key][el.element.id]?.location) return;

        Vue.set(elementConfig.location[key], 'y', getBlockHeight(key));
        Vue.set(elementConfig.location[key], 'yaxisAlign', createYaxisAlign(key));
      });

      Vue.set(parentElementLocation, 'y', getBlockHeight(state.previewMode));
      Vue.set(parentElementLocation, 'yaxisAlign', createYaxisAlign(state.previewMode));
      break;
    case ALIGN.HORIZONTAL_CENTERS:
      const createXaxisAlignCenter = (key: string) => ({
        left: `${breakpointsWidths[key] / 2 - parentWidth / 2}px`
      });

      state.breakpoints.forEach((key: string, index: number) => {
        if (index <= currentBreakpointIndex || elementsBreakpointChanges[key][el.element.id]?.location) return;

        Vue.set(elementConfig.location[key], 'x', breakpointsWidths[key] / 2 - parentWidth / 2);
        Vue.set(
          elementConfig.location[key],
          'xInPercent',
          (((breakpointsWidths[key] / 2 - parentWidth / 2) / breakpointsWidths[key]) * 100).toFixed(4)
        );
        Vue.set(elementConfig.location[key], 'xaxisAlign', createXaxisAlignCenter(key));
      });

      Vue.set(parentElementLocation, 'x', Math.round(breakpointsWidths[state.previewMode] / 2 - parentWidth / 2));
      Vue.set(
        parentElementLocation,
        'xInPercent',
        (
          ((breakpointsWidths[state.previewMode] / 2 - parentWidth / 2) / breakpointsWidths[state.previewMode]) *
          100
        ).toFixed(4)
      );
      Vue.set(parentElementLocation, 'xaxisAlign', createXaxisAlignCenter(state.previewMode));
      break;
    case ALIGN.VERTICAL_CENTERS:
      const currentKey = state.previewMode;
      const getBlockYaxisHeight = (blockStyles: { height: string }) => getDigitFromString(blockStyles.height);
      const formYaxisData = (blockHeight: number) => Math.round(blockHeight / 2 - parentHeight / 2);
      const newYaxisAlign = (key: string) => ({ top: `${formYaxisData(getBlockYaxisHeight(block.styles[key]))}px` });

      state.breakpoints.forEach((key: string, index: number) => {
        if (index <= currentBreakpointIndex || elementsBreakpointChanges[key][el.element.id]?.location) return;

        Vue.set(elementConfig.location[key], 'y', formYaxisData(getBlockYaxisHeight(block.styles[key])));
        Vue.set(elementConfig.location[key], 'yaxisAlign', newYaxisAlign(key));
      });

      Vue.set(parentElementLocation, 'y', formYaxisData(getBlockYaxisHeight(block.styles[currentKey])));
      Vue.set(parentElementLocation, 'yaxisAlign', newYaxisAlign(currentKey));
      break;
  }

  Vue.set(elementsBreakpointChanges[state.previewMode][el.element.id], 'location', true);
};

function getElementLocation(state: any, index: number): ElementLocation {
  const elementId = state.selectedElements[index].element.id;
  const component = state.userConfig.allComponents[elementId];
  return component.location[state.previewMode];
}

/**
 * align several selected elements
 * need to refactoring and debugging
 * @param {object} state - vuex state
 * @param {object} params - params with align type
 */
const alignElements = (state: any, { type }: { type: number }) => {
  if (state.selectedElements.length == 0) {
    console.warn('not selected elements for align');
    return;
  }

  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });
  const firstElementLocation = getElementLocation(state, 0);

  if (type == ALIGN.LEFT) {
    let x = firstElementLocation.x;
    for (let i = 1; i < state.selectedElements.length; i++) {
      const elementLocation = getElementLocation(state, i);
      if (elementLocation.x < x) x = elementLocation.x;
    }
    for (const { element } of state.selectedElements) {
      const elementLocation = state.userConfig.allComponents[element.id].location[state.previewMode];
      Vue.set(elementLocation, 'x', x);
      Vue.set(elementLocation, 'xInPercent', ((x / breakpointsWidths[state.previewMode]) * 100).toFixed(4));
    }
  } else if (type == ALIGN.HORIZONTAL_CENTERS) {
    let xMin = firstElementLocation.x;
    let xMax = firstElementLocation.x;
    let isAligned = true;
    let elementCenter = firstElementLocation.x + Math.round(firstElementLocation.w / 2);

    let widthOfRightElement = firstElementLocation.w;
    for (let i = 1; i < state.selectedElements.length; i++) {
      const elementLocation = getElementLocation(state, i);
      const location = Object.assign({}, elementLocation);
      const locationCenter = location.x + Math.round(location.w / 2);

      if (elementCenter != locationCenter) {
        isAligned = false;
      }

      if (elementLocation.x < xMin) xMin = elementLocation.x;

      if (elementLocation.x > xMax) {
        xMax = elementLocation.x;
        widthOfRightElement = elementLocation.w;
      }
    }

    const squareHalfWidth = (xMax + widthOfRightElement - xMin) / 2 + xMin;
    if (!isAligned) {
      for (const { element } of state.selectedElements) {
        const elementLocation = state.userConfig.allComponents[element.id].location[state.previewMode];
        const totalX = Math.round(squareHalfWidth - elementLocation.w / 2);
        Vue.set(elementLocation, 'x', totalX);
        Vue.set(elementLocation, 'xInPercent', ((totalX / breakpointsWidths[state.previewMode]) * 100).toFixed(4));
      }
    }
  } else if (type == ALIGN.RIGHT) {
    let elementWidthPlusX = firstElementLocation.x + firstElementLocation.w;
    for (let i = 1; i < state.selectedElements.length; i++) {
      const elementLocation = getElementLocation(state, i);
      const elementWidth = elementLocation.x + elementLocation.w;
      if (elementWidth > elementWidthPlusX) elementWidthPlusX = elementWidth;
    }
    for (const { element } of state.selectedElements) {
      const elementLocation = state.userConfig.allComponents[element.id].location[state.previewMode];
      const w = elementLocation.w;
      Vue.set(elementLocation, 'x', elementWidthPlusX - w);
      Vue.set(
        elementLocation,
        'xInPercent',
        (((elementWidthPlusX - w) / breakpointsWidths[state.previewMode]) * 100).toFixed(4)
      );
    }
  } else if (type == ALIGN.TOP) {
    let y = firstElementLocation.y;
    for (let i = 1; i < state.selectedElements.length; i++) {
      const elementLocation = getElementLocation(state, i);
      if (elementLocation.y < y) y = elementLocation.y;
    }
    for (const { element } of state.selectedElements) {
      const elementLocation = state.userConfig.allComponents[element.id].location[state.previewMode];
      Vue.set(elementLocation, 'y', y);
    }
  } else if (type == ALIGN.VERTICAL_CENTERS) {
    let yMin = firstElementLocation.y;
    let yMax = firstElementLocation.y;
    let heightOfBottomElement = firstElementLocation.h;
    let isAligned = true;
    let elementCenter = Math.round(firstElementLocation.y + firstElementLocation.h / 2);

    for (let i = 1; i < state.selectedElements.length; i++) {
      const elementLocation = getElementLocation(state, i);
      const location = Object.assign({}, elementLocation);
      const locationCenter = Math.round(location.y + location.h / 2);

      if (elementCenter != locationCenter) {
        isAligned = false;
      }

      if (elementLocation.y < yMin) yMin = elementLocation.y;

      if (elementLocation.y > yMax) {
        yMax = elementLocation.y;
        heightOfBottomElement = elementLocation.h;
      }
    }

    const squareHalfHeight = (yMax + heightOfBottomElement - yMin) / 2 + yMin;
    if (!isAligned) {
      for (const { element } of state.selectedElements) {
        const elementLocation = state.userConfig.allComponents[element.id].location[state.previewMode];
        const totalY = Math.round(squareHalfHeight - elementLocation.h / 2);
        Vue.set(elementLocation, 'y', totalY);
      }
    }
  } else if (type == ALIGN.BOTTOM) {
    let elementHeightPlusY = firstElementLocation.y + firstElementLocation.h;
    for (let i = 1; i < state.selectedElements.length; i++) {
      const elementLocation = getElementLocation(state, i);
      const elementHeight = elementLocation.y + elementLocation.h;
      if (elementHeight > elementHeightPlusY) elementHeightPlusY = elementHeight;
    }

    for (const { element } of state.selectedElements) {
      const elementLocation = state.userConfig.allComponents[element.id].location[state.previewMode];
      const h = elementLocation.h;
      Vue.set(elementLocation, 'y', elementHeightPlusY - h);
    }
  }
};

export { alignElementToParent, alignElements };

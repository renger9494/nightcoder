import Vue from 'vue';
import { cloneDeep as _cloneDeep } from 'lodash';
import { mutations as editorMutations } from '../../editor';
import { breakpointsWidths } from '@/constants/breakpoints';
import ObjectKeys from '@/utils/types/ObjectKeys';

export type ElementLocation = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * Change location(x, y), size(w, h) and textBoxStyle of element with saving history of user's config
 * @param {object} state - state
 * @param {object} params - must include an information of element and data that we need to change(x, y, w, h, textBoxStyle)
 */
const changeElementLocation = (
  state: any,
  { element, data, isSaveHistory = true }: { element: any; data: any; isSaveHistory?: boolean }
) => {
  if (isSaveHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }
  const dataKeys = Object.keys(data);

  const elementsBreakpointChanges = getElementsBreakpointChanges(state, element);
  const similarLocationKeys = ['w', 'h', 'x', 'y'];
  const currentBreakpointIndex = state.breakpoints.indexOf(state.previewMode);

  dataKeys.forEach(dataKey => {
    const isXOrW = ['w', 'x'].includes(dataKey);
    state.breakpoints.forEach((breakpoint: string, index: number) => {
      if (
        similarLocationKeys.includes(dataKey) &&
        currentBreakpointIndex <= index &&
        element.location[breakpoint][dataKey] !== data[dataKey] &&
        !elementsBreakpointChanges[breakpoint][element.id]?.location
      ) {
        Vue.set(element.location[breakpoint], dataKey, data[dataKey]);

        if (isXOrW) {
          Vue.set(
            element.location[breakpoint],
            `${dataKey}InPercent`,
            ((data[dataKey] / breakpointsWidths[breakpoint]) * 100).toFixed(4)
          );
        }
        return;
      }

      if (currentBreakpointIndex === index && element.location[breakpoint][dataKey] !== data[dataKey]) {
        Vue.set(element.location[breakpoint], dataKey, data[dataKey]);

        if (isXOrW) {
          Vue.set(
            element.location[breakpoint],
            `${dataKey}InPercent`,
            ((data[dataKey] / breakpointsWidths[breakpoint]) * 100).toFixed(4)
          );
        }
      }
    });
  });

  elementsBreakpointChanges[state.previewMode][element.id].location = true;
};

/**
 * Разблокировать элемент от выравнивний по x и y
 * @param {*} state
 * @param {*} object - { element, xaxisAlign, yaxisAlign }
 * */
const unlockAxisAlign = (
  state: any,
  { element, xaxisAlign, yaxisAlign }: { element: any; xaxisAlign: any; yaxisAlign: any }
) => {
  function unlockAxis(axis: any, value: any) {
    const previewElementLocation = element.location[state.previewMode];
    const elementLocation = state.userConfig.allComponents[element.id].location;

    state.breakpoints.forEach((key: string, index: number) => {
      if (index == 0 || key !== state.previewMode) return;
      if (element.location[key][axis] === previewElementLocation[axis]) {
        value ? Vue.set(elementLocation[key], axis, value) : Vue.delete(elementLocation[key], axis);
      } else {
        // console.warn('проверка брейкпоинтов не прошла');
      }
    });
    value ? (elementLocation[state.previewMode][axis] = value) : Vue.delete(elementLocation[state.previewMode], axis);
  }

  unlockAxis('xaxisAlign', xaxisAlign);
  unlockAxis('yaxisAlign', yaxisAlign);
};

const changeLocation = (
  state: any,
  { xDiff, yDiff, elements, saveHistory = false }: { xDiff: any; yDiff: any; elements: any[]; saveHistory?: boolean }
) => {
  if (saveHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }

  for (const el of elements) {
    applyDiffsToElement(el, state, xDiff, yDiff);
  }
};

/**
 * Удаляет сущность из elementsBreakpointChanges
 *
 * @param state - Стор
 * @param elementId - Id удаляемого элемента или блока
 **/
const removeElementBrakepointChanges = (state: any, elementId: string) => {
  if (!state.userConfig.elementsBreakpointChanges) return;
  const elementsBreakpointChangesArr: Array<any> = Object.values(state.userConfig.elementsBreakpointChanges);
  for (const breakPoint of elementsBreakpointChangesArr) {
    if (breakPoint[elementId]) {
      delete breakPoint[elementId];
    }
  }
};

const getElementsBreakpointChanges = (state: any, element: any) => {
  let elementsBreakpointChanges = state.userConfig.elementsBreakpointChanges;
  if (!elementsBreakpointChanges) {
    elementsBreakpointChanges = state.breakpoints.reduce((result: ObjectKeys<{}>, breakpoint: string) => {
      result[breakpoint] = {};
      return result;
    }, {});
    Vue.set(state.userConfig, 'elementsBreakpointChanges', elementsBreakpointChanges);
  }

  if (state.userConfig.elementsBreakpointChanges[state.previewMode][element.id] === undefined)
    Vue.set(state.userConfig.elementsBreakpointChanges[state.previewMode], element.id, {});

  if (state.userConfig.elementsBreakpointChanges[state.previewMode][element.id].location === undefined)
    Vue.set(state.userConfig.elementsBreakpointChanges[state.previewMode][element.id], 'location', true);
  return elementsBreakpointChanges;
};

function applyDiffsToElement(element: any, state: any, xDiff: any, yDiff: any) {
  const elementLocation = element.location;
  const elementLocationPrevMode = elementLocation[state.previewMode];
  const elementsBreakpointChanges = getElementsBreakpointChanges(state, element);

  const currentBreakpointIndex = state.breakpoints.indexOf(state.previewMode);
  state.breakpoints.forEach((breakpoint: string, index: number) => {
    if (index <= currentBreakpointIndex || elementsBreakpointChanges[breakpoint][element.id]?.location) return;

    const elemLocationBreakpoint = elementLocation[breakpoint];
    const newX = elemLocationBreakpoint.x + xDiff;
    const newY = elemLocationBreakpoint.y + yDiff;
    elementLocation[breakpoint].x = newX;
    elementLocation[breakpoint].xInPercent = ((newX / breakpointsWidths[breakpoint]) * 100).toFixed(4);
    elementLocation[breakpoint].y = newY;
  });

  const newX = elementLocationPrevMode.x + xDiff;
  const newY = elementLocationPrevMode.y + yDiff;

  elementLocation[state.previewMode].x = newX;
  elementLocation[state.previewMode].xInPercent = ((newX / breakpointsWidths[state.previewMode]) * 100).toFixed(4);
  elementLocation[state.previewMode].y = newY;
}

/*
 * Мутация для изменения позиции элемента выбранного по id а не из selectedElements
 * */
const changeElementPosition = (
  state: any,
  { id, xDiff, yDiff, saveHistory = true }: { id: string; xDiff: any; yDiff: any; saveHistory: boolean }
) => {
  const element = state.userConfig.allComponents[id];
  if (!element) return;

  if (saveHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }

  applyDiffsToElement(element, state, xDiff, yDiff);
};

/**
 * @deprecated
 */
const changeGroupLocation = (
  state: any,
  { xArea, yArea, elements, saveHistory = false }: { xArea: any; yArea: any; elements: any[]; saveHistory: boolean }
) => {
  if (saveHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }

  for (const el of elements) {
    const elementLocation = state.userConfig.allComponents[el.element.id].location[state.previewMode];
    elementLocation.x = xArea + el.xDiff;
    elementLocation.y = yArea + el.yDiff;
  }
};

function getDirection(shortcut: string) {
  if (shortcut.indexOf('up') !== -1) return 'up';
  if (shortcut.indexOf('right') !== -1) return 'right';
  if (shortcut.indexOf('down') !== -1) return 'down';
  if (shortcut.indexOf('left') !== -1) return 'left';

  throw new Error('Unknown direction');
}

/**
 * Move element
 * we should refactor a shortcut to an array of keyCodes(numbers).
 * @param {object} state - state
 * @param {object} params - shortcut and event
 */
const moveElement = (state: any, { shortcut, event }: { shortcut: string; event: string }) => {
  if (event === 'keyup') {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }

  // Шаг смещения. По шифту - 10, без - 1
  const step = shortcut.indexOf('shift') !== -1 ? 10 : 1;

  // Напрвление смещения
  const dir = getDirection(shortcut);

  // Множитель смещения. Если кордината X и направление left, то stepFactor = -1
  const stepFactor = dir === 'left' || dir === 'up' ? -1 : 1;

  // Координата смещения
  const coord = dir === 'left' || dir === 'right' ? 'x' : 'y';

  for (const el of state.selectedElements) {
    // const elementLocation = state.userConfig.allComponents[el.element.id].location[state.previewMode];
    applyDiffsToElement(
      el.element,
      state,
      coord === 'x' ? step * stepFactor : 0,
      coord === 'y' ? step * stepFactor : 0
    );
    // elementLocation[coord] = elementLocation[coord] + step * stepFactor;
  }
};

export {
  changeElementLocation,
  getElementsBreakpointChanges,
  removeElementBrakepointChanges,
  changeGroupLocation,
  moveElement,
  changeLocation,
  changeElementPosition,
  unlockAxisAlign
};

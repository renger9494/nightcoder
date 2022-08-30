import Vue from 'vue';
import { cloneDeep as _cloneDeep, set as _set, has as _has } from 'lodash';
import { getId } from '../../helpers/randomString';
import { move } from '../../helpers/array';
import { getters as editorGetters, mutations as editorMutations } from '../editor';
import { changeElementLocationRelativeToNewBlock } from '@/helpers/editorUtilities';
import { inputElement } from '@/store/elements/create/defaultData/form';
import { removeElementBrakepointChanges } from '@/store/elements/changeLocation';

export interface ElementConfig {
  allComponents: any[];
  components: any[];
}

/**
 * Геттер блокирующий выделение элементов от разных родителей
 * @param blockId -Id блока, в котором происходит выделение
 */
const isSelectionAble = (state: any) => (blockId: string) => {
  // let a = null;
  // state.selectedElements.forEach(item => {
  //   if (a === null) a = item.element.parentId;
  //   else if (a != item.element.parentId) a = true;
  // });
  // return a === blockId;
  return true;
};

const isGlobalSelection = (state: any) => {
  if (state.selectedElements.length <= 1) return false;

  const firstParentId = state.selectedElements[0].element.parentId;
  for (const item of state.selectedElements) {
    if (firstParentId != item.element.parentId) return true;
  }
  return false;
};

/**
 * Стандартная реакция на клик по элементу элемент добавляется в selectedElements(selectedElements
 * предварительно очищается) или selectedElements очищается eсли элемент уже там был.
 * @param element - элемент по которому нужно отработать клик
 * @param component - компонент который инициирует реакцию(sidebar, editorArea и т.д.)
 */
const proceedElementClick = (
  { state, rootState, commit }: { state: any; rootState: any; commit: Function },
  { element, component }: { element: any; component: any }
) => {
  const activeShortcut = rootState.shortcut.activeShortcut;
  if (activeShortcut && activeShortcut.shortcut) {
    if (activeShortcut.shortcut.desc === 'shift' && activeShortcut.shortcut.event === 'keydown') {
      if (state.selectedElements.length === 0 || isSelectionAble(state)(element.parentId)) {
        if (component === 'sidebar') {
          commit('proceedElementClickShiftShct', { element });
        } else {
          commit('proceedElementClickCtrlShiftShct', { element });
        }
        return;
      }
    }
  }

  if (activeShortcut && activeShortcut.shortcut && Array.isArray(activeShortcut.shortcut.desc)) {
    const shortcutIdx = activeShortcut.shortcut.desc.findIndex(
      (value: string) =>
        value === 'ctrl+shift' || value === 'command+shift' || value === 'shift+ctrl' || value === 'shift+command'
    );

    if (shortcutIdx !== -1 && activeShortcut.shortcut.event === 'keydown' && isSelectionAble(state)(element.parentId)) {
      commit('proceedElementClickCtrlShiftShct', { element });
      return;
    }
  }

  if (elementSelected(state)(element) && state.selectedElements.length === 1) {
    //commit('cleanSelectedElements');
  } else {
    commit('cleanSelectedElements');
    commit('cleanSelectedBlocks');
    commit('addSelectedElements', { element });
  }
};

/**
 *  Реакция на клик по элементу при зажатом shift.
 *  Элемент добавляется в selectedElements по принципу межэлементного
 *  пространства между уже выделенным элементом и тем на который кликнули.
 *  Мутация использует списки блоков отсортированных по sortId
 *  с элементами внутри отсортированными по zIndex.
 *  @param element - элемент по которому кликнули
 */
const proceedElementClickShiftShct = (state: any, { element }: { element: any }) => {
  const lastSelElem = state.selectedElements[state.selectedElements.length - 1];
  if (lastSelElem !== undefined) {
    if (element.parentId === lastSelElem.element.parentId) {
      const block = state.userConfig.allComponents[element.parentId];
      const sortedElements = editorGetters.elementsSortedByZindex(state)(block);
      const elementIdx = sortedElements.findIndex(el => el.id === element.id);
      const lastSelElementIdx = sortedElements.findIndex(el => el.id === lastSelElem.element.id);
      const direction = lastSelElementIdx - elementIdx;
      for (let i = elementIdx; i !== lastSelElementIdx; i = i + Math.sign(direction)) {
        editorMutations.addSelectedElements(state, { element: sortedElements[i] });
      }
    } else {
      // Данные по кликнутому элементу
      const blk = state.userConfig.allComponents[element.parentId];
      const srtedElements = editorGetters.elementsSortedByZindex(state)(blk);
      const elemIdx = srtedElements.findIndex(el => el.id === element.id);

      // Данные по последнему выбранному элементу
      const lastSelBlock = state.userConfig.allComponents[lastSelElem.element.parentId];
      const sortedLastSelBlockElements = editorGetters.elementsSortedByZindex(state)(lastSelBlock);
      const lastSelElemIdx = sortedLastSelBlockElements.findIndex(el => el.id === lastSelElem.element.id);

      // Данные по задействованым блокам
      const sortedBlocks = editorGetters.blocksSortedBySortId(state);
      const elementBlockIdx = sortedBlocks.findIndex(blk => blk.id === element.parentId);
      const lastSelElementBlockIdx = sortedBlocks.findIndex(blk => blk.id === lastSelElem.element.parentId);

      // Направление движения выделения элементов
      const directn = lastSelElementBlockIdx - elementBlockIdx;
      // Выделение эелементов в блоке кликнутого элемента
      const jLimit = Math.sign(directn) === 1 ? srtedElements.length : -1;
      for (let j = elemIdx; j !== jLimit; j = j + Math.sign(directn)) {
        editorMutations.addSelectedElements(state, { element: srtedElements[j] });
      }
      // Выделение эелементов в блоке последнего кликнутого элемента
      const kLimit = Math.sign(directn) === 1 ? -1 : sortedLastSelBlockElements.length;
      for (let k = lastSelElemIdx; k !== kLimit; k = k + Math.sign(directn) * -1) {
        editorMutations.addSelectedElements(state, { element: sortedLastSelBlockElements[k] });
      }
      // Если между блоками есть другие блоки
      if (Math.abs(directn) > 1) {
        // Выделение элементов в блоках между задействоваными
        for (let i = elementBlockIdx + Math.sign(directn); i !== lastSelElementBlockIdx; i = i + Math.sign(directn)) {
          sortedBlocks[i].elements.forEach((el: any) => {
            editorMutations.addSelectedElements(state, { element: el });
          });
        }
      }
    }
  } else {
    editorMutations.addSelectedElements(state, { element });
  }
};

/**
 * Стандартная реакция на клик по элементу при зажатом shift+ctrl
 * элемент добавляется в selectedElements или удаляется оттуда если он там уже был.
 * @param element - элемент по которому кликнули
 */
const proceedElementClickCtrlShiftShct = (state: any, { element }: { element: any }) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });
  if (elementSelected(state)(element)) {
    editorMutations.removeSelectedElements(state, { elementId: element.id });
  } else {
    editorMutations.cleanSelectedBlocks(state);
    editorMutations.addSelectedElements(state, { element });
  }
};

const changeElementPayload = (
  state: any,
  { id, path, value, isSaveHistory = true }: { id: string; path: string; value: string; isSaveHistory: boolean }
) => {
  if (isSaveHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }
  value
    ? Vue.set(state.userConfig.allComponents[id].payload, path, value)
    : Vue.delete(state.userConfig.allComponents[id].payload, path);
};

const changeElementsLinkParams = (
  state: any,
  { id, path, value, isSaveHistory = true }: { id: string; path: string; value: string; isSaveHistory?: boolean }
) => {
  if (isSaveHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }
  value
    ? Vue.set(state.userConfig.allComponents[id].payload.link, path, value)
    : Vue.delete(state.userConfig.allComponents[id].payload.link, path);
};

/**
 * Смена типа элемента напр. из <h2> на <h3>
 * @param state - Стор
 * @param id - Id элемента
 * @param type - Тип элемента
 */
const changeElementsType = (state: any, { id, type }: { id: string; type: string }) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  Vue.set(state.userConfig.allComponents[id].payload, 'type', type);
};

/**
 * Возвращвет true если элемент найден в selectedElements
 *
 * @param element - блок
 **/
const elementSelected = (state: any) => (element: any) => {
  const res = state.selectedElements.findIndex((el: any) => {
    if (el.element) {
      return el.element.id === element.id;
    }
  });
  return res !== -1;
};

const elementEditing = (state: any) => (element: any) => {
  return state.uxCriticalData.editingElement && state.uxCriticalData.editingElement.id === element.id;
};

const addSelectedElements = (
  state: any,
  { element, parentWidth = null, parentHeight = null }: { element: any; parentWidth?: any; parentHeight?: any }
) => {
  const resId = state.selectedElements.findIndex((el: any) => el.element.id === element.id);

  if (!(resId === -1 && (state.selectedElements.length === 0 || isSelectionAble(state)(element.parentId)))) {
    console.warn('[addSelectedElements]: inserting error');
    return;
  }

  state.selectedElements.push({
    element,
    parentWidth,
    parentHeight
  });
};

function removeElementFromConfig(state: any, element: any) {
  const blockComp = state.userConfig.components.find((blk: any) => blk.id === element.parentId);
  const elIdx = blockComp.elements.findIndex((el: any) => el.id === element.id);
  if (elIdx !== -1) blockComp.elements.splice(elIdx, 1);
  removeElementBrakepointChanges(state, element.id);
  editorMutations.deleteAPs(state, { id: element.id });
  delete state.userConfig.allComponents[element.id];
  delete state.uxCriticalData.aps[element.id];
}

const removeElement = (state: any, element: any) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });
  removeElementFromConfig(state, element);
  editorMutations.actualiseFontList(state);
};

const removeElements = (state: any, elements: any[]) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });
  for (const element of elements) {
    removeElementFromConfig(state, element);
  }
  editorMutations.actualiseFontList(state);
};
/**
 * Перемещение элемента по zIndex внутри блока
 *
 * @param oldIndex - старый индекс в сортированном по zindex массиве
 * @param newIndex - новый индекс в сортированном по zindex массиве
 * @param element - элемент который переносится
 **/
const moveElementByZindex = (
  state: any,
  { oldIndex, newIndex, element }: { oldIndex: number; newIndex: number; element: any }
) => {
  const block = state.userConfig.allComponents[element.parentId];
  if (!block) return;
  if (!Array.isArray(block.elements)) return;

  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  const sortedElementsByZindex = [...block.elements].sort((a, b) => {
    return b.payload.zIndex - a.payload.zIndex;
  });

  const draggedArray = move(sortedElementsByZindex, oldIndex, newIndex);

  let zIndex = draggedArray.length;
  for (const el of draggedArray) {
    changeElementParam(state, {
      element: el,
      path: `payload.zIndex`,
      value: zIndex--
    });
  }
};

/**
 * Возвращает сортированный по zindex массив элементов в блоке
 *
 * @param block - блок сортированный массив элементов которого будет возвращён
 **/
const elementsSortedByZindex = (state: any) => (block: any) => {
  if (!block) return [];
  if (!Array.isArray(block.elements)) return [];
  return [...block.elements].sort((a, b) => {
    return b.payload.zIndex - a.payload.zIndex;
  });
};

const duplicateElements = (state: any, { type, elements }: { type: string; elements: any[] }) => {
  if (type == 'duplicate') {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });

    const newSelectedElements: any[] = [];
    elements.forEach(element => {
      const newElement = _cloneDeep(element);
      newElement.id = `${newElement.type}_${getId()}`;
      newElement.name = `copy ${newElement.name}`;
      //TODO: maybe bug: if user select several elements then zIndex could be similar for duplicate elements
      newElement.payload.zIndex = element.payload.zIndex + 1;

      const elementsInElBlock = state.userConfig.allComponents[newElement.parentId].elements;
      const elementsSortedByZIndex = [...elementsInElBlock].sort((a, b) => {
        return b.payload.zIndex - a.payload.zIndex;
      });
      const elementIdxThatWasCopied = elementsSortedByZIndex.findIndex(value => value.id === element.id);

      for (let i = elementIdxThatWasCopied - 1; i >= 0; i--) {
        state.userConfig.allComponents[elementsSortedByZIndex[i].id].payload.zIndex++;
      }

      state.userConfig.allComponents[newElement.parentId].elements.push(newElement);
      Vue.set(state.userConfig.allComponents, newElement.id, newElement);

      newSelectedElements.push(state.userConfig.allComponents[newElement.id]);
    });
    state.selectedElements.splice(0, state.selectedElements.length);
    newSelectedElements.forEach(newElement =>
      state.selectedElements.push({ element: state.userConfig.allComponents[newElement.id] })
    );
  } else if (type == 'paste')
    state.clipboardElements.map((el: any) => {
      const duplicate = JSON.stringify(state.userConfig.components[el.block].elements[el.elementIndex]);
      state.userConfig.components[el.block].elements.push(JSON.parse(duplicate));
    });
};

/*
 * Вставить элементы в блок
 * */
const pasteElements = ({ state }: { state: any }, { block, elements }: { block: any; elements: any[] }) => {
  if (!block) return;

  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  const pastedElements: any[] = [];
  for (const element of elements) {
    const newElement = _cloneDeep(element);
    newElement.id = `${newElement.type}_${getId()}`;
    newElement.parentId = block.id;
    const numberOfElementsInBlock = block.elements.length;
    newElement.payload.zIndex = numberOfElementsInBlock + 1;

    block.elements.push(newElement);
    Vue.set(state.userConfig.allComponents, newElement.id, newElement);
    pastedElements.push(newElement);
  }

  return pastedElements;
};

/**
 * Функция устанавливает параметр(задаётся через path) элемента в значение value
 * block, path, value - обязательные параметры
 * elementIndex | elementId - обязательно
 *
 **/
const changeElementParam = (state: any, { element, path, value }: { element: any; path: string; value: number }) => {
  if (!_has(element, path)) {
    return;
  }

  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });
  _set(element, path, value);
};

/**
 *
 * Функция переносить элемент из одного блока в другой
 * Нет необязательных параметров
 * @param state - Стейт
 * @param newBockId - Айди нового блока
 * @param element - Элемент который нужно перенести
 * @param blockBounds - Пропорции нового блока
 * @param elemBounds - Пропорции элемента
 * @param zoom - Размер зума эдитора
 *
 **/
const moveElementFromOneBlockToAnother = (
  state: any,
  {
    newBockId,
    element,
    blockBounds,
    elemBounds,
    zoom
  }: { newBockId: string; element: any; blockBounds: DOMRect; elemBounds: DOMRect; zoom: number }
) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  const newElement = _cloneDeep(element);
  const blockToAdd = state.userConfig.allComponents[newBockId];
  //create new values
  newElement.parentId = newBockId;
  newElement.id = `${newElement.type}_${getId()}`;
  newElement.payload.zIndex = blockToAdd.elements.length + 1;
  //define position relative to new block
  changeElementLocationRelativeToNewBlock(newElement, blockBounds, elemBounds, zoom);
  //remove element from old block
  const blockComp = state.userConfig.components.find((blk: any) => blk.id === element.parentId);
  const elIdx = blockComp.elements.findIndex((el: any) => el.id === element.id);
  if (elIdx !== -1) blockComp.elements.splice(elIdx, 1);
  delete state.userConfig.allComponents[element.id];
  //move element to new block
  blockToAdd.elements.push(newElement);
  Vue.set(state.userConfig.allComponents, newElement.id, newElement);
  editorMutations.addSelectedElements(state, { element: newElement });
};

/**
 * Добавление нового инпута в элемент формы
 *
 * @param state - Стейт
 * @param formElement - Элемент формы
 **/
const addNewElementToForm = (state: any, { formElement }: { formElement: any }) => {
  const formInputStyles = formElement.elements.find((item: any) => item.type === 'input')?.styles ?? null;
  if (!formInputStyles) return;

  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  formElement.elements.unshift(inputElement('Your Email', formInputStyles));
};

/**
 * Удаление элемента из формы
 *
 * @param state - Стейт
 * @param formElement - Элемент формы
 * @param atIndex - Индекс элемента который нужно удалить
 * @param countToRemove - Количество удаляемых элементом
 * @param saveInHistory - Сохранение в истории
 **/
const removeElementsFromFormAtIndex = (
  state: any,
  {
    formElement,
    atIndex,
    countToRemove,
    saveInHistory = true
  }: { formElement: any; atIndex: number; countToRemove: number; saveInHistory: boolean }
) => {
  if (saveInHistory) {
    editorMutations.changeEditorHistory(state, {
      oldConfig: state.userConfig
    });
  }

  formElement.elements.splice(atIndex, countToRemove);
};

/**
 * Редактирование сущности Payload элемента передовая нужный элемент в мутацию
 *
 * @param state - Стейт
 * @param element - Элемент
 * @param path - Путь
 * @param value - Новое значение
 **/
const changeElementPayloadDirectly = (
  state: any,
  { element, path, value }: { element: any; path: string; value: string | number }
) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });
  value ? Vue.set(element.payload, path, value) : Vue.delete(element.payload, path);
};

/**
 * Сохраняет актуальные шрифты текстового элемента
 *
 * @param state - Стейт
 * @param element - Элемент
 * @param path - Путь
 * @param value - Новое значение
 **/
const setGoogleFontFamilyToElement = (
  state: any,
  { element, path, value }: { element: any; path: string; value: string }
) => {
  _set(element.payload, `font.${path}`, value);
};

const actualiseFontList = (state: any) => {
  const allFontElements = editorGetters.getAllFontElements(state);
  const allFonts = [];
  for (const fontElement of allFontElements) {
    if (fontElement.type === 'form') {
      for (const formElement of fontElement.elements) {
        if (formElement.payload.font) {
          const fontFamilies = Object.values(formElement.payload.font);
          allFonts.push(...fontFamilies);
        }
      }
    } else {
      if (fontElement.payload.font) {
        const fontFamilies = Object.values(fontElement.payload.font);
        allFonts.push(...fontFamilies);
      }
    }
  }
  Vue.set(state.userConfig.googleFonts, 'fonts', [...new Set(allFonts)]);
};

export {
  changeElementPayload,
  changeElementsLinkParams,
  duplicateElements,
  changeElementParam,
  elementSelected,
  elementEditing,
  removeElement,
  removeElements,
  moveElementByZindex,
  elementsSortedByZindex,
  addSelectedElements,
  proceedElementClick,
  proceedElementClickShiftShct,
  proceedElementClickCtrlShiftShct,
  isSelectionAble,
  isGlobalSelection,
  pasteElements,
  moveElementFromOneBlockToAnother,
  changeElementsType,
  addNewElementToForm,
  removeElementsFromFormAtIndex,
  changeElementPayloadDirectly,
  setGoogleFontFamilyToElement,
  actualiseFontList
};

import Vue from 'vue';
import { cloneDeep as _cloneDeep, has as _has, set as _set } from 'lodash';
import { getId } from '@/helpers/randomString';
import { getters as editorGetters, mutations as editorMutations } from '../editor';
import blockDefaultStyles from '../../template-data/block';
import { removeElementBrakepointChanges } from '@/store/elements/changeLocation';

/**
 * Стандартная реакция на клик по блоку блок добавляется в selectedBlocks(selectedBlocks
 * предварительно очищается) или selectedBlocks очищается eсли блок уже там был.
 * @param block - блок по которому нужно отработать клик
 * @param component - компонент который инициирует реакцию(sidebar, editorArea и т.д.)
 */
const proceedBlockClick = (
  { state, rootState, commit }: { state: any; rootState: any; commit: Function },
  { block, component }: { block: any; component: any }
) => {
  const activeShortcut = rootState.shortcut.activeShortcut;
  if (activeShortcut && activeShortcut.shortcut) {
    if (activeShortcut.shortcut.desc === 'shift' && activeShortcut.shortcut.event === 'keydown') {
      if (component === 'sidebar') {
        commit('proceedBlockClickShiftShct', { block });
      } else {
        commit('proceedBlockClickCtrlShiftShct', { block });
      }
      return;
    }
  }

  if (activeShortcut && activeShortcut.shortcut && Array.isArray(activeShortcut.shortcut.desc)) {
    const shortcutIdx = activeShortcut.shortcut.desc.findIndex(
      (value: string) =>
        value === 'ctrl+shift' || value === 'command+shift' || value === 'shift+ctrl' || value === 'shift+command'
    );

    if (shortcutIdx !== -1 && activeShortcut.shortcut.event === 'keydown') {
      commit('proceedBlockClickCtrlShiftShct', { block });
      return;
    }
  }

  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  if (blockSelected(state)(block) && state.selectedBlocks.length === 1) {
    commit('removeBlockFromSelected', block);
  } else {
    [...state.selectedBlocks].forEach(blk => {
      commit('removeBlockFromSelected', blk);
    });
    commit('cleanSelectedElements');
    commit('addBlockIntoSelected', block);
  }
};

const moveBlock = ({ state, commit }: { state: any; commit: Function }, to: 'up' | 'down') => {
  const block = state.selectedBlocks[0];
  const sortId = block.sortId;

  if (to === 'up') {
    if (block.sortId === 1) return;

    const neighbourBlock = state.userConfig.components.find((el: any) => el.sortId === sortId - 1);

    commit('changeBlockParam', {
      block: block,
      patheight: `sortId`,
      value: sortId - 1
    });
    commit('changeBlockParam', {
      block: neighbourBlock,
      patheight: `sortId`,
      value: neighbourBlock.sortId + 1
    });
  } else if (to === 'down') {
    if (block.sortId === state.userConfig.components.length) return;

    const neighbourBlock = state.userConfig.components.find((el: any) => el.sortId === sortId + 1);

    commit('changeBlockParam', {
      block: block,
      patheight: `sortId`,
      value: sortId + 1
    });
    commit('changeBlockParam', {
      block: neighbourBlock,
      patheight: `sortId`,
      value: neighbourBlock.sortId - 1
    });
  }
};

/**
 *  Реакция на клик по блоку при зажатом shift.
 *  Блок добавляется в selectedBlocks по принципу межблочного
 *  пространства между уже выделенным блоком и тем на который кликнули.
 *  Мутация использует списки блоков отсортированных по sortId
 *  с элементами внутри отсортированными по zIndex.
 *  @param block - блок по которому кликнули
 */
const proceedBlockClickShiftShct = (state: any, { block }: { block: any }) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  const lastSelBlock = state.selectedBlocks[state.selectedBlocks.length - 1];
  if (lastSelBlock !== undefined) {
    const sortedBlocks = editorGetters.blocksSortedBySortId(state);
    const blockIdx = sortedBlocks.findIndex(blk => blk.id === block.id);
    const lastSelBlockIdx = sortedBlocks.findIndex(blk => blk.id === lastSelBlock.id);
    const direction = lastSelBlockIdx - blockIdx;
    for (let i = blockIdx; i !== lastSelBlockIdx; i = i + Math.sign(direction)) {
      editorMutations.addBlockIntoSelected(state, sortedBlocks[i]);
    }
  } else {
    editorMutations.addBlockIntoSelected(state, block);
  }
};

/**
 * Стандартная реакция на клик по блоку при зажатом shift+ctrl
 * блок добавляется в selectedBlocks или удаляется оттуда если он там уже был.
 * @param block - блок по которому кликнули
 */
const proceedBlockClickCtrlShiftShct = (state: any, { block }: { block: any }) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  if (blockSelected(state)(block)) {
    editorMutations.removeBlockFromSelected(state, block);
  } else {
    editorMutations.addBlockIntoSelected(state, block);
  }
};

const addBlockIntoSelected = (state: any, block?: any) => {
  if (block === undefined) return;
  const idxInSelected = state.selectedBlocks.findIndex((el: any) => el === block);
  if (idxInSelected === -1) {
    state.selectedBlocks.push(block);
  }
};
const removeBlockFromSelected = (state: any, block: any) => {
  const idxInSelected = state.selectedBlocks.findIndex((el: any) => el === block);
  if (idxInSelected !== -1) {
    state.selectedBlocks.splice(idxInSelected, 1);
    block.elements.forEach((el: any) => editorMutations.removeSelectedElements(state, { elementId: el.id }));
  }
};

const removeBlock = (state: any, { block }: { block?: any }) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });
  if (!block) {
    block = state.selectedBlocks[0];
  }

  block.sortId = -1;

  const blocksSortedBySortId = state.userConfig.components.sort((a: any, b: any) => {
    return a.sortId - b.sortId;
  });
  let i = 0;
  blocksSortedBySortId.forEach((blk: any) => {
    if (blk.sortId !== -1) blk.sortId = i++;
  });
  removeElementBrakepointChanges(state, block.id);
  editorMutations.actualiseFontList(state);
  block.elements.forEach((el: any) => {
    Vue.delete(state.userConfig.allComponents, el.id);
  });

  Vue.delete(state.userConfig.allComponents, block.id);
  const blockIdx = state.userConfig.components.find((blk: any) => blk.id === block.id);
  state.userConfig.components.splice(blockIdx, 1);
};

const removeBlocks = (state: any, { blocks = [] }: { blocks: any[] }) => {
  blocks.forEach(block => removeBlock(state, { block }));
};

const cleanSelectedBlocks = (state: any) => {
  state.selectedBlocks = [];
};

/**
 * Возвращвет true если блок найден в selectedBlocks
 *
 * @param block - блок
 **/
const blockSelected = (state: any) => (block: any) => {
  return state.selectedBlocks.findIndex((blk: any) => blk.id === block.id) !== -1;
};

/**
 * Возвращвет блок если блок найден в components
 *
 * @param block - блок
 **/
const getBlockById = (state: any) => (id: any) => {
  return state.userConfig.components.find((blk: any) => blk.id === id);
};

/**
 * Геттер для получения конфига нового блока.
 *
 * @param {insertAfter, name, dbId}
 **/
const createNewBlockConfig = (state: any) => ({
  insertAfter,
  name,
  dbId
}: {
  insertAfter?: number;
  name: string;
  dbId?: number;
}) => {
  let sortId = 0;

  if (insertAfter !== undefined && typeof insertAfter === 'number') {
    sortId = insertAfter + 1;
  } else {
    const sortedBySortId = state.userConfig.components.sort((a: any, b: any) => {
      return a.sortId - b.sortId;
    });
    sortId = sortedBySortId[sortedBySortId.length - 1].sortId + 1 || 0;
  }

  return {
    type: 'block',
    id: `block_${getId()}`,
    dbId: dbId || -1,
    sortId,
    name: name || 'Custom Block',
    parentComp: undefined,
    parentId: undefined,
    payload: {},
    styles: { ...blockDefaultStyles },
    elements: []
  };
};

function prepareBlockBeforeDuplicate(block: any, namePrefix = 'copy ') {
  const newBlockConfig = _cloneDeep(block);
  newBlockConfig.name = `${namePrefix}${block.name}`;
  newBlockConfig.id = `block_${getId()}`;
  newBlockConfig.sortId++;
  newBlockConfig.elements.forEach((el: any) => {
    el.id = `${el.type}_${getId()}`;
    el.parentId = newBlockConfig.id;
  });
  return newBlockConfig;
}

/**
 *
 * Мутация для вставки конфига нового блока в userConfig.components.
 *
 * @param {key, blockConfig}
 **/
const insertBlockToConfig = (state: any, { blockConfig }: { blockConfig: any }) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });
  if (state.userConfig) {
    state.userConfig.components.forEach((blk: any) => {
      if (blk.sortId >= blockConfig.sortId) {
        blk.sortId++;
      }
    });
  }
  state.userConfig.components.push(blockConfig);
  editorMutations.fillAllComponents(state);
};

/**
 * Дублирование блока вместе со всеми элементами и настройками
 *
 *
 * */
const duplicateBlock = (state: any, block: any) => {
  const newBlock = prepareBlockBeforeDuplicate(block);
  insertBlockToConfig(state, { blockConfig: newBlock });
  editorMutations.changeBlockToViewId(state, `${newBlock.id}`);
};

/**
 * Добавление блока из блока коллекций
 *
 *
 * */
const addCollectionBlock = (state: any, block: any) => {
  const newBlock = prepareBlockBeforeDuplicate(block);
  insertBlockToConfig(state, { blockConfig: newBlock });
  editorMutations.changeBlockToViewId(state, `${newBlock.id}`);
  editorMutations.actualiseFontList(state);
};

// /**
//  * Вставка блока вместе со всеми элементами и настройками
//  *
//  *
//  * */
// const pasteBlocks = ({ state }, blocks) => {
//   const pastedBlocks = [];
//   blocks.forEach(block => {
//     const newBlock = prepareBlockBeforeDuplicate(block, '');
//     insertBlockToConfig(state, { blockConfig: newBlock });
//     pastedBlocks.push(state.userConfig.allComponents[newBlock.id]);
//   });
//   return pastedBlocks;
// };

/**
 *
 * Мутация для замены конфига блока в userConfig новым с сохранением sortId.
 *
 * @param {blockConfig, id}
 **/
const replaceBlockConfig = (state: any, { blockConfig, id }: { blockConfig: any; id: string }) => {
  const blockIndex = state.userConfig.components.findIndex((val: any) => val.id === id);
  if (blockIndex === -1) return;

  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });

  const blockToReplace = state.userConfig.components[blockIndex];

  blockConfig.id = id;
  blockConfig.elements.forEach((element: any) => {
    element.parentId = blockConfig.id;
    element.id = `${element.type}-${getId()}`;
  });
  blockConfig.sortId = blockToReplace.sortId;

  state.userConfig.components.splice(blockIndex, 1);
  state.userConfig.components.push(blockConfig);
  editorMutations.fillAllComponents(state);
};

/**
 * Блоки отсортированные по sortId
 * */
const blocksSortedBySortId = (state: any) => {
  return [...state.userConfig.components].sort((a, b) => {
    return a.sortId - b.sortId;
  });
};

const changeBlockMetaData = (state: any, { block, path, data }: { block: any; path: string; data: any }) => {
  Vue.set(state.userConfig.components[block].meta, path, data);
};

const changeBlockStyleData = (state: any, { block, path, data }: { block: any; path: string; data: any }) => {
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });
  let inherit = false;
  state.breakpoints.map((key: string) => {
    if (inherit) {
      if (
        state.userConfig.allComponents[block.id].styles[key][path] ==
        state.userConfig.allComponents[block.id].styles[state.previewMode][path]
      ) {
        Vue.set(state.userConfig.allComponents[block.id].styles[key], path, data);
      }
    }
    if (key === state.previewMode) inherit = true;
  });
  Vue.set(state.userConfig.allComponents[block.id].styles[state.previewMode], path, data);
};

const changeBlockParam = (state: any, { block, path, value }: { block: any; path: string; value: any }) => {
  if (!_has(block, path)) {
    return;
  }
  editorMutations.changeEditorHistory(state, {
    oldConfig: state.userConfig
  });
  _set(block, path, value);
};

/*
 * Добавление блока в userConfig по положению в списке и конфигу
 *
 * @param insertAfter - после какого блока вставить. config - конфиг блока
 * */
const insertBlockWithConfig = (
  state: any,
  { insertAfter, dbId, config }: { insertAfter: number; dbId: string; config: any }
) => {
  const newConfig = _cloneDeep(config);
  newConfig.id = `block-${getId()}`;
  newConfig.sortId = insertAfter + 1;
  newConfig.dbId = dbId;
  newConfig.elements.forEach((element: any) => {
    element.id = `${element.type}-${getId()}`;
    element.parentId = newConfig.id;
  });
  insertBlockToConfig(state, { blockConfig: newConfig });
};

/**
 *
 * Проверяет если элемент блока активны для редактирования
 *
 * @param state - стейт
 * @param block - блока
 **/
const isChildOfBlockSelected = (state: any) => (block: any) => {
  if (state.selectedElements.length === 0) return false;
  return state.selectedElements.some((item: any) => item.element.parentId === block.id);
};

export {
  changeBlockMetaData,
  changeBlockStyleData,
  createNewBlockConfig,
  insertBlockToConfig,
  changeBlockParam,
  blockSelected,
  getBlockById,
  duplicateBlock,
  addCollectionBlock,
  blocksSortedBySortId,
  proceedBlockClick,
  proceedBlockClickCtrlShiftShct,
  proceedBlockClickShiftShct,
  removeBlockFromSelected,
  removeBlock,
  removeBlocks,
  moveBlock,
  cleanSelectedBlocks,
  addBlockIntoSelected,
  insertBlockWithConfig,
  replaceBlockConfig,
  isChildOfBlockSelected
};

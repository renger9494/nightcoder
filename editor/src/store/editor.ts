import Vue from 'vue';
import http from '@/utils/http';
import fontImporter from '../helpers/font/fontImporter';
import { addCreatedElementToBlock, createElement, ElementType } from './elements/create';
import { cloneDeep as _cloneDeep, debounce as _debounce, set as _set, has as _has } from 'lodash';
import {
  fillAllComponents,
  getBlockToPasteDataFromClipboard,
  getElementCenterByLocation,
  getFirstVisibleElement,
  getPlacesFitToPasteFromClipboard,
  ElementCenter,
  ImageFile
} from '@/helpers/editorUtilities';
import AnchorPoints, { Point } from '@/helpers/AnchorPoints';
import breakpoints from '@/constants/breakpoints';

// < test
import {
  changeElementLocation,
  changeElementPosition,
  changeGroupLocation,
  changeLocation,
  moveElement,
  unlockAxisAlign
} from './elements/changeLocation';

import { changePosition } from './elements/changePosition';

import { alignElements, alignElementToParent } from './elements/changeLocation/align';

import {
  addSelectedElements,
  changeElementParam,
  changeElementPayload,
  changeElementsLinkParams,
  changeElementsType,
  duplicateElements,
  elementEditing,
  elementSelected,
  elementsSortedByZindex,
  isGlobalSelection,
  isSelectionAble,
  moveElementByZindex,
  pasteElements,
  proceedElementClick,
  proceedElementClickCtrlShiftShct,
  proceedElementClickShiftShct,
  removeElement,
  removeElements,
  moveElementFromOneBlockToAnother,
  ElementConfig,
  addNewElementToForm,
  removeElementsFromFormAtIndex,
  changeElementPayloadDirectly,
  setGoogleFontFamilyToElement,
  actualiseFontList
} from './elements';

import {
  changeComponentStyle,
  changeSelectedElementsStyle,
  changeMultipleComponentStyle,
  changeMultipleElementsByUniqueStyles,
  changeElementResponsiveFontStyle
} from './elements/changeStyle';

import {
  addBlockIntoSelected,
  blockSelected,
  blocksSortedBySortId,
  changeBlockMetaData,
  changeBlockParam,
  changeBlockStyleData,
  cleanSelectedBlocks,
  createNewBlockConfig,
  duplicateBlock,
  addCollectionBlock,
  insertBlockToConfig,
  insertBlockWithConfig,
  isChildOfBlockSelected,
  moveBlock,
  proceedBlockClick,
  proceedBlockClickCtrlShiftShct,
  proceedBlockClickShiftShct,
  removeBlock,
  removeBlockFromSelected,
  removeBlocks,
  replaceBlockConfig
} from './blocks/blocks';
import ObjectKeys from '../utils/types/ObjectKeys';
import apiClient from '../utils/apiClient';
import { IBlocksData } from '@/components/Editor/Sidebar/Modal/components/AddNewBlockOrElementPopup/types';

let apsContainers: ObjectKeys<AnchorPoints> = {};

// test />

const getDefaultState = () => {
  return {
    /**
     * Использование этих данных должно строго ограничиваться UX критическими
     * манипуляциями: drag, resize и т.д. Потребителей этих данных должно быть как
     * можно меньше. Подписываться только на нужное свойство внутри uxCriticalData.
     *
     */
    uxCriticalData: {
      /**
       * Изменяемые данные элемента
       * @values {x, y, w, h}
       */
      changingElementData: undefined,
      editingElement: undefined,
      /**
       * @example { block_nh93buhrn: [{x:number, y:number}] }
       */
      aps: {} as ObjectKeys<Point[]>,
      containerSnapLines: { x: [] },
      msaReg: {}
    },
    hoveredElement: undefined,
    hoveredBlock: undefined,
    lastSaveRequest: undefined,
    templates: [],
    templateCategories: [],
    /**
     * Element config
     */
    userConfig: null as null | ElementConfig,
    iframeHeight: null,
    editorFieldWidth: 0,
    zoom: 1,
    currentId: null,
    currentPageId: null,
    tempData: null,
    previewMode: 'laptop',
    breakpoints,
    openedSidebarItem: '',
    openedSidebarItemsChild: '',
    elementToMove: null,
    editorHistoryUn: [],
    /**
     * in millisecconds
     */
    historySaveTimeout: 500,
    historySaveCount: 15,
    historyChangeTime: new Date().getTime(),
    editorHistoryRe: [],
    selectedElements: [],
    selectedBlocks: [],
    clipboardElements: [],
    /**
     * Элементы доступные для добавления на editor-area
     * TODO: move to elements like config
     */
    availableElements: [
      {
        name: 'Text',
        style: 'Style-01',
        shortcut: 'T',
        type: 'Basic Element',
        image: [
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/textPopup-x1.png`,
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/textPopup-x2.png`
        ]
      },
      // {
      //   name: 'Shape',
      //   style: 'Style-01'
      // },
      {
        name: 'Image',
        style: 'Style-01',
        shortcut: 'I',
        type: 'Basic Element',
        image: [
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/imagePopup-x1.jpg`,
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/imagePopup-x2.jpg`
        ]
      },
      {
        name: 'Icon',
        style: 'Style-01',
        shortcut: 'cmd+I',
        type: 'Basic Element',
        image: [
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/Icons.jpg`,
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/Icons%402x.jpg`
        ]
      },
      {
        name: 'Button',
        style: 'Style-01',
        shortcut: 'B',
        type: 'Basic Element',
        image: [
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/buttonPopup-x1.png`,
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/buttonPopup-x2.png`
        ]
      },
      // {
      //   name: 'Rectangle',
      //   style: 'Style-01',
      //   shortcut: 'R',
      //   type: 'Shape',
      //   image: [
      //     'https://s3.amazonaws.com/beta.airtap.co/icons/rectanglePopup-x1.png',
      //     'https://s3.amazonaws.com/beta.airtap.co/icons/rectanglePopup-x2.png'
      //   ]
      // },
      // {
      //   name: 'Circle',
      //   style: 'Style-01',
      //   shortcut: 'O',
      //   type: 'Shape',
      //   image: [
      //     'https://s3.amazonaws.com/beta.airtap.co/icons/Circle.jpg',
      //     'https://s3.amazonaws.com/beta.airtap.co/icons/Circle%402x.jpg'
      //   ]
      // },
      // {
      //   name: 'Embed',
      //   style: 'Style-01',
      //   shortcut: 'E',
      //   type: 'Embed',
      //   image: [
      //     'https://s3.amazonaws.com/beta.airtap.co/icons/embed.jpg',
      //     'https://s3.amazonaws.com/beta.airtap.co/icons/embed%402x.jpg'
      //   ]
      // },
      {
        name: 'Form',
        style: 'Style-01',
        shortcut: 'F',
        type: 'Basic Element',
        image: [
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/buttonPopup-x1.png`,
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/buttonPopup-x2.png`
        ]
      },
      {
        name: 'Video',
        style: 'Style-01',
        shortcut: 'v',
        type: 'Basic Element',
        image: [
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/buttonPopup-x1.png`,
          `${process.env.VUE_APP_BUCKET_NAME}/Defaults/buttonPopup-x2.png`
        ]
      }
      // {
      //   name: 'Form',
      //   style: 'Style-01'
      // },
      // {
      //   name: 'Icon',
      //   style: 'Style-01'
      // },
      // {
      //   name: 'Frame'
      // }
    ],
    editorFonts: fontImporter,
    loadedFonts: [],

    insertElementTo: {
      block: null,
      element: null
    },
    isInserting: false,
    popupSettings: {
      active: false,
      header: '',
      closeButton: false,
      content: '',
      data: {},
      position: {}
    },
    /**
     * use for editing a template
     */
    templateId: null,
    /**
     * use for editing a template
     */
    template: null,
    /**
     * interface element for template
     * remove after merge templates and interface elements in db
     * use for getting config history
     */
    templateElement: null,
    /*
     * Объект для регистрации условий отображения компонентов, например скрыть заливку,
     * полностью скрыть компонент и т.д.
     * */
    displayConditions: {},
    /*
     * Объект для хранения даннх буфера обмена
     * */
    clipboard: {
      image: null,
      content: null
    },
    /*
     * Block that needs to be placed in viewPort
     * */
    blockToViewId: null,
    /*
     * Block which is in viewPort
     * */
    blockInViewPortId: null,
    /**
     * This property used to watch vdr and its triggered when font is loaded
     */
    isFontRendered: false,
    /**
     * Library Blocks
     */
    blockCategories: [] as Array<IBlocksData>
  };
};

const state = getDefaultState();

export const getters = {
  createNewBlockConfig,
  isSelectionAble,
  isGlobalSelection,
  blockSelected,
  elementSelected,
  elementsSortedByZindex,
  blocksSortedBySortId,
  elementEditing,
  /**
   * @deprecated
   */
  templateElement(state: any, getters: any, rootState: any, rootGetters: any) {
    return rootGetters['elementTypes/getElementsByCondition']({
      elementType: 'Templates',
      condition: function (element: any) {
        return element.config.templateId == state.templateId;
      }
    })[0];
  },
  selectedBlock(state: any) {
    if (state.selectedBlocks.length === 1) return state.selectedBlocks[0];
    return null;
  },
  selectedElement(state: any) {
    if (state.selectedElements.length === 1) return state.selectedElements[0].element;
    return null;
  },

  findAPs: (state: any) => ({ id, parentId, aps }: { id: string; parentId: string; aps: Point[] }) => {
    if (!parentId) {
      parentId = state.userConfig.allComponents[id].parentId;
    }
    const apsContainer = apsContainers[parentId];
    if (!apsContainer) {
      console.error('[findAPs]: not found aps container for ' + parentId);
      return;
    }

    const similar = apsContainer.getSimilar(aps);
    // if (similar.yApsArray.length > 0)
    //   console.log(
    //     'apsContainer',
    //     parentId,
    //     apsContainer.yAP.get(0),
    //     aps.filter(p => p.y == 0 || p.y == -5 || p.y == 5).map(p => p.x),
    //     // apsContainer,
    //     // aps,
    //     similar.yApsArray
    //   );
    return similar;
  },
  isChildOfBlockSelected,
  blockToViewId: (state: any) => state.blockToViewId,
  blockInViewPortId: (state: any) => state.blockInViewPortId,
  getAllElementsByType: (state: any) => (type: string): Array<any> => {
    const allComponentsArr = Object.values(state.userConfig.allComponents);
    return allComponentsArr.filter((element: any) => element.type === type);
  },
  getAllFontElements: (state: any): Array<any> => {
    const allComponentsArr = Object.values(state.userConfig.allComponents);
    return allComponentsArr.filter((element: any) => ['form', 'text', 'button'].includes(element.type));
  }
};

export const mutations = {
  addMsaToReg(state: any, { id, blockId }: { id: string; blockId: string }) {
    state.uxCriticalData.msaReg[blockId] = { id };
  },
  removeMsaFromReg(state: any, { blockId }: { blockId: string }) {
    delete state.uxCriticalData.msaReg[blockId];
  },
  setAPs(state: any, { id, aps }: { id: string; aps: Point[] }) {
    if (!aps) return;

    let apsContainer: AnchorPoints;

    if (state.userConfig.allComponents[id]?.parentId) {
      const element = state.userConfig.allComponents[id];
      if (!apsContainers[element.parentId]) apsContainers[element.parentId] = new AnchorPoints();
      apsContainer = apsContainers[element.parentId];
    } else {
      if (!apsContainers[id]) apsContainers[id] = new AnchorPoints();
      apsContainer = apsContainers[id];
    }

    for (const ap of aps) {
      apsContainer.addAP(ap.x, ap.y);
    }
    state.uxCriticalData.aps[id] = aps;
  },
  deleteAPs(state: any, { id, parentId }: { id: string; parentId?: string }) {
    const aps: Point[] = state.uxCriticalData.aps[id];
    if (!aps || !state?.userConfig?.allComponents) return;
    const element = state.userConfig.allComponents[id];

    let apsContainer: AnchorPoints | null = null;
    if (element) apsContainer = apsContainers[element.parentId];
    if (parentId) apsContainer = apsContainers[parentId];

    if (!apsContainer) return;
    for (const ap of aps) {
      apsContainer.deleteAP(ap.x, ap.y);
    }
  },
  dropAllAPs(state: any) {
    state.uxCriticalData.aps = {};
    apsContainers = {};
  },
  setChangingElementData(state: any, data: any) {
    state.uxCriticalData.changingElementData = data;
  },
  setEditingElement(state: any, data: any) {
    state.uxCriticalData.editingElement = data;
  },
  changeLocation,
  moveElementByZindex,
  zoomTemplate(state: any, scale: number) {
    state.zoom = scale;
  },
  changeTemplateZoom(state: any, { delta }: { delta: number | 'default' | 'fit' }) {
    let value = null;

    if (typeof delta === 'number') {
      /**
       * Разделил зум на три типа
       * а) минимальный - при скролле на тачбаре или сенсорной мышке
       * б) дефолтный - скролл колесиком мыши с шагом (-)125 delta
       * в) произвольный - любое другое значение delta
       */

      if ((delta < 25 && delta > 0) || (delta > -25 && delta < 0)) {
        // минимальный зум в 1%
        const deltaFactor = delta > 0 ? -1 : 1;
        value = Number((state.zoom + 0.01).toFixed(2)) * deltaFactor;
      } else if (delta === 125 || delta === -125) {
        // Зум в один шаг колесика мыши = 5%
        const step = delta > 0 ? -0.05 : 0.05;
        value = Number((state.zoom + step).toFixed(2));
      } else {
        // Расчет зума с учетом 1% = 25 delta
        const step = (delta * -1) / 25 / 100;

        value = Number((state.zoom + step).toFixed(2));
      }

      /**
       * Лимиты зума
       * Мин: 10%
       * Макс: 400%
       */
      if (value >= 0.1 && value <= 4) Vue.set(state, 'zoom', value);
    } else if (delta === 'default') {
      Vue.set(state, 'zoom', 1);
    } else if (delta === 'fit') {
      Vue.set(state, 'zoom', 1);
    }
  },
  changeEditorParam(state: any, { path, value }: { path: string; value: string }) {
    Vue.set(state, path, value);
  },
  changeEditorParamByPath(state: any, { path, value }: { path: string; value: string }) {
    if (!_has(state, path)) {
    } else {
      _set(state, path, value);
    }
  },
  /**
   * Устанавливает displayCondition в требуемое значение
   * id - id элементаю, condition - условие, value - значение
   * @example { id:'rectangle-54fgd4', condition:'hideFill', value:true, previewMode: 'laptop' }
   */
  setDisplayCondition(
    state: any,
    { id, condition, value, previewMode }: { id: string; condition: any; value: any; previewMode?: string }
  ) {
    if (!state.displayConditions[id]) {
      Vue.set(state.displayConditions, id, {});
    }

    if (!previewMode) {
      Vue.set(state.displayConditions[id], condition, value);
      return;
    }

    if (!state.displayConditions[id][previewMode]) {
      Vue.set(state.displayConditions[id], previewMode, {});
    }
    Vue.set(state.displayConditions[id][previewMode], condition, value);
  },
  changeElementsLinkParams,
  changeElementsType,
  changeRootParam(state: any, { path, data }: { path: string; data: any }) {
    Vue.set(state.userConfig.root, path, data);
  },
  changeElementLocation,
  changeElementPosition,
  changePosition,
  unlockAxisAlign,
  changeGroupLocation,
  changeBlockMetaData,
  changeBlockStyleData,
  duplicateElements,
  elementToClipboard(state: any) {
    state.clipboardElements = Array.from(state.selectedElements);
  },
  alignElementToParent,
  alignElements,
  cleanSelectedElements(state: any) {
    state.selectedElements = [];
  },
  addSelectedElements,
  proceedElementClickShiftShct,
  proceedElementClickCtrlShiftShct,
  proceedBlockClickShiftShct,
  proceedBlockClickCtrlShiftShct,
  removeBlockFromSelected,
  removeBlock,
  removeBlocks,
  cleanSelectedBlocks,
  addBlockIntoSelected,
  replaceBlockConfig,
  /**
   * Удаляет элемент из selectedElements
   *
   * @param element - элeмент
   * */
  removeSelectedElements(state: any, { elementId }: { elementId: string }) {
    const index = state.selectedElements.findIndex((el: any) => el.element.id === elementId);
    state.selectedElements.splice(index, 1);
  },
  emptyState(state: any) {
    Object.assign(state, getDefaultState());
  },
  /**
   * История конфига и выделений ведется параллельно,
   * поэтому в конфиге может не быть изменений, когда изменения будут в селектед массиве
   */
  changeEditorHistory(
    state: {
      selectedElements: any[];
      historySaveCount: number;
      editorHistoryUn: string[];
      editorHistoryRe: string[];
      historyChangeTime: number;
      historySaveTimeout: number;
    },
    { oldConfig }: { oldConfig: ElementConfig }
  ) {
    const isHistoryTimeoutBigEnough = new Date().getTime() - state.historyChangeTime > state.historySaveTimeout;
    if (!isHistoryTimeoutBigEnough) return;

    const oldConfigString = JSON.stringify(oldConfig);
    if (
      oldConfigString !== state.editorHistoryUn[state.editorHistoryUn.length - 1] &&
      oldConfigString !== state.editorHistoryRe[state.editorHistoryRe.length - 1]
    ) {
      state.editorHistoryUn.push(oldConfigString);
      if (state.editorHistoryUn.length > state.historySaveCount) {
        state.editorHistoryUn.shift();
      }
      state.historyChangeTime = new Date().getTime();
    }
  },
  /**
   * Меняет userConfig. Восстанавливает его из истории.
   *
   * @param redo - направление в истории
   * @values true - делает redo, false - undo
   * */
  changeConfigFromHistory(state: any, redo?: boolean) {
    if (redo) {
      const step = state.editorHistoryRe.pop();

      if (!step) return;
      state.editorHistoryUn.push(JSON.stringify(state.userConfig));
      state.userConfig = Object.assign({}, JSON.parse(step));
      fillAllComponents(state);
    } else {
      const step = state.editorHistoryUn.pop();

      if (!step) return;
      state.editorHistoryRe.push(JSON.stringify(state.userConfig));
      state.userConfig = Object.assign({}, JSON.parse(step));
      fillAllComponents(state);
    }
  },
  setUserConfig(state: any, config: any) {
    state.userConfig = Object.assign({}, config);
    fillAllComponents(state);
  },
  moveElement,
  setElementToMove(
    state: any,
    { block, rowIndex, colIndex, elIndex }: { block: any; rowIndex: number; colIndex: number; elIndex: number }
  ) {
    state.elementToMove = {
      block,
      rowIndex,
      colIndex,
      elIndex
    };
  },
  insertBlockToConfig,
  insertBlockWithConfig,
  duplicateBlock,
  addCollectionBlock,
  addCreatedElementToBlock,
  changeInsertElementTo(state: any, { block, element }: { block: any; element: ElementType }) {
    state.insertElementTo.block = block;
    state.insertElementTo.element = element;
  },
  changeConfigFonts(state: any, font: string) {
    if (state.userConfig.googleFonts.fonts.includes(font)) return;

    state.userConfig.googleFonts.fonts.push(font);
  },
  setLoadedFont(state: any, font: string) {
    state.loadedFonts.push(font);
  },
  changeSelectedElementsStyle,
  changeMultipleComponentStyle,
  changeMultipleElementsByUniqueStyles,
  changeElementResponsiveFontStyle,
  changeComponentStyle,
  changeProjectSettings(state: any, data: any) {
    state.userConfig.settings = data;
  },
  changeFaviconImage(state: any, data: any) {
    state.userConfig.faviconImage = data;
    state.userConfig.settings.faviconImage = data;
  },
  changeOpenedSidebarItem(state: any, data: any) {
    // changeEditorParam
    state.openedSidebarItem = data;
  },
  changeOpenedSidebarItemsChild(state: any, data: any) {
    // changeEditorParam
    state.openedSidebarItemsChild = data;
  },
  changeTempData(state: any, data: any) {
    // changeEditorParam
    state.tempData = data;
  },
  changeCurrentId(state: any, id: any) {
    // changeEditorParam
    state.currentId = id;
  },
  changeCurrentPageId(state: any, id: any) {
    // changeEditorParam
    state.currentPageId = id;
  },

  SET_USER_CONFIG_FROM_LOCAL(state: any, local: any) {
    Vue.set(state, 'userConfig', local);
  },
  /**
   * Мутация создаёт реактивные связи между components и elements
   * и allComponents
   */
  fillAllComponents(state: any) {
    if (!state.userConfig) return;

    state.userConfig.allComponents = {};
    for (const block of state.userConfig.components) {
      state.userConfig.allComponents[block.id] = block;
      for (const el of block.elements) {
        state.userConfig.allComponents[el.id] = el;
      }
    }
  },
  cleanEditorHistory(state: any) {
    state.editorHistoryRe = [];
    state.editorHistoryUn = [];
  },
  SET_BRANDING_SETTINGS(state: any, { path, data }: { path: string; data: any }) {
    state.userConfig.branding[path] = data;
  },
  SET_PREVIEW_MODE(state: any, value: any) {
    // changeEditorParam
    state.previewMode = value;
  },
  changeElementPayload,
  SET_POPUP_SETTINGS(state: any, data: any) {
    state.popupSettings.active = data.active;
    state.popupSettings = {
      ...data
    };
  },
  CHANGE_POPUP_HEADER(state: any, header: string) {
    state.popupSettings.header = header

  },
  CHANGE_POPUP_DESCRIPTION(state: any, description: string) {
    state.popupSettings.description = description;
  },
  CHANGE_POPUP_BACKGROUND(state: any, background: string) {
    state.popupSettings.background = background;
  },
  changeElementParam,
  changeBlockParam,
  removeElement,
  removeElements,
  setLastSaveRequest: (state: any, status: any) => {
    state.lastSaveRequest = { time: new Date(), status };
  },
  changeBlockToViewId(state: any, id: any) {
    state.blockToViewId = id;
  },
  changeBlockInViewPortId(state: any, id: any) {
    state.blockInViewPortId = id;
  },
  setIsFontRendered(state: any, condition: boolean) {
    state.isFontRendered = condition;
  },
  moveElementFromOneBlockToAnother,
  addNewElementToForm,
  removeElementsFromFormAtIndex,
  changeElementPayloadDirectly,
  setGoogleFontFamilyToElement,
  actualiseFontList,
  setBlockCategories(state: any, blockCategories: Array<IBlocksData>) {
    state.blockCategories = blockCategories;
  }
};

/**
 * create page preview image
 * @param {object} state - vuex state
 */
const debounceSavePagePreview = _debounce(function (projectId: number, pageId: number) {
  http.post(`/api/files/projects/${projectId}/pages/${pageId}/preview`);
}, 5000);

const actions = {
  pasteElements,
  proceedBlockClick,
  moveBlock,
  proceedElementClick,
  /**
   * Save userConfig current page to server
   */
  savePageSettings: ({ commit, state }: { commit: Function; state: any }) => {
    const { userConfig, currentId: projectId, currentPageId: pageId } = state;
    if (!userConfig || !pageId || !projectId) return undefined;

    const cloneUserConfig = _cloneDeep(userConfig);
    delete cloneUserConfig.allComponents;

    const userConfigString = JSON.stringify(cloneUserConfig).replace(/\\n/g, '');
    const request = apiClient.projectPages
      .projectPagesSaveSettings(projectId, pageId, {
        settings: userConfigString
      })
      .then(() => {
        commit('setLastSaveRequest', 'saved');
        debounceSavePagePreview(projectId, pageId);
      })
      .catch(() => {
        commit('setLastSaveRequest', 'error');
      });
    return request;
  },
  containerSnapLines: (
    { commit }: { commit: Function },
    { containerXSnapLines }: { containerXSnapLines: Set<number> }
  ) => {
    commit('changeEditorParamByPath', { path: 'uxCriticalData.containerSnapLines.x', value: [...containerXSnapLines] });
  },
  createElement,
  imagePasted: ({ commit }: { commit: Function }, { image }: { image: ImageFile }) => {
    commit('changeEditorParamByPath', { path: 'clipboard.image', value: image });
  },
  contentPasted: ({ commit }: { commit: Function }, { content }: { content: any }) => {
    commit('changeEditorParamByPath', { path: 'clipboard.content', value: content });
  },
  pasteImage: async (
    { dispatch, commit, getters, state }: { dispatch: Function; commit: Function; getters: any; state: any },
    { imageFile, url, block }: { imageFile: ImageFile; url: string; block: any }
  ) => {
    let blockToPasteImage = block;
    let elementCenter: ElementCenter | null = null;

    if (!blockToPasteImage) {
      blockToPasteImage = getBlockToPasteDataFromClipboard(state.userConfig.components, state.selectedBlocks);
      if (!blockToPasteImage) return { error: 'No block to paste image.' };

      // Если блок не выбран, то ищем выбранный элемент чтобы к его центру привязывать координаты картинки
      if (!getters['blockSelected'](blockToPasteImage) && state.selectedElements.length !== 0) {
        const elementToPasteImage = getFirstVisibleElement(
          state.selectedElements.map((selElement: any) => selElement.element)
        );
        if (elementToPasteImage) {
          blockToPasteImage = state.userConfig.allComponents[elementToPasteImage.parentId];
          elementCenter = getElementCenterByLocation(elementToPasteImage.location[state.previewMode]);
        }
      }
    }

    const image = await imageFile.upload(url);
    const imageElement = await dispatch('createElement', {
      element: imageFile.type,
      block: blockToPasteImage,
      payload: { image }
    });
    const imageLocation = imageFile.createLocation(
      blockToPasteImage,
      state.previewMode,
      elementCenter,
      imageElement.id
    );

    commit('changeElementLocation', {
      element: imageElement,
      data: imageLocation
    });
    return { imageElement };
  },
  pasteUserConfig: async (
    { state, dispatch, commit, getters }: { dispatch: Function; commit: Function; getters: any; state: any },
    { userConfig }: { userConfig: any }
  ) => {
    const pastedElements = [];
    for (const element of userConfig.selectedElements) {
      if (getters['selectedBlock']) {
        const [pastedElement] = await dispatch('pasteElements', {
          block: getters['selectedBlock'],
          elements: [element]
        });
        pastedElements.push(pastedElement);
        continue;
      }

      if (getters['selectedElement']) {
        const elementLocation = element.location[state.previewMode];
        const elementCenter = getElementCenterByLocation(getters['selectedElement'].location[state.previewMode]);
        elementLocation.x = elementCenter.x - elementLocation.w / 2;
        elementLocation.y = elementCenter.y - elementLocation.h / 2;
        const [pastedElement] = await dispatch('pasteElements', {
          block: state.userConfig.allComponents[getters['selectedElement'].parentId],
          elements: [element]
        });
        pastedElements.push(pastedElement);
        continue;
      }

      const placeFitToPaste = getPlacesFitToPasteFromClipboard(state);
      if (placeFitToPaste.pasted?.element) {
        const elementLocation = element.location[state.previewMode];
        elementLocation.x = placeFitToPaste.pasted.center.x - elementLocation.w / 2;
        elementLocation.y = placeFitToPaste.pasted.center.y - elementLocation.h / 2;
        const [pastedElement] = await dispatch('pasteElements', {
          block: state.userConfig.allComponents[placeFitToPaste.pasted.element.parentId],
          elements: [element]
        });
        pastedElements.push(pastedElement);
        continue;
      }

      if (placeFitToPaste.block) {
        const elementLocation = element.location[state.previewMode];
        elementLocation.x = placeFitToPaste.blockCenter.x - elementLocation.w / 2;
        elementLocation.y = placeFitToPaste.blockCenter.y - elementLocation.h / 2;
        const [pastedElement] = await dispatch('pasteElements', {
          block: placeFitToPaste.block,
          elements: [element]
        });
        pastedElements.push(pastedElement);
      }
    }
    // const pastedBlocks = [];
    // for (const block of userConfig.selectedBlocks) {
    //   const placeFitToPaste = getPlacesFitToPasteFromClipboard(state);
    //   if (getters['selectedBlock']) {
    //     block.sortId = getters['selectedBlock'].sortId + 1;
    //     const [pastedBlock] = await dispatch('pasteBlocks', [block]);
    //     pastedBlocks.push(pastedBlock);
    //   } else if (placeFitToPaste.block) {
    //     placeFitToPaste.block.sortId = getters['selectedBlock'].sortId + 1;
    //     const [pastedBlock] = await dispatch('pasteBlocks', {
    //       blocks: [block]
    //     });
    //     pastedBlocks.push(pastedBlock);
    //   }
    // }
    commit('cleanSelectedElements');
    commit('cleanSelectedBlocks');
    pastedElements.forEach(pastedElement => commit('addSelectedElements', { element: pastedElement }));
    return pastedElements;
    // pastedBlocks.forEach(pastedBlock => commit('addBlockIntoSelected', { block: pastedBlock }));
  },
  setUserConfig({ state, commit }: any, config: ElementConfig) {
    commit('editor/changeEditorHistory', {
      oldConfig: state.userConfig
    });

    commit('editor/setUserConfig', config);
  },
  fetchBlocksByCategories: ({ commit }: { commit: Function }) => {
    apiClient.interfaceElements.interfaceElementsGetBlocksByCategories().then(({ data }) => {
      const blocksCategories = data
        .filter(x => x.items)
        .map(
          x =>
          ({
            id: x.id,
            title: x.name,
            blocks: x.items?.map(i => ({ id: i.id, title: `${i.id}`, name: i.name, files: i.files }))
          } as IBlocksData)
        );
      commit('setBlockCategories', blocksCategories);
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

<template>
  <section
    class="templates-block-wrap"
    :id="value.id"
    @mousedown="selectBlock"
    @mouseenter="mouseHandler(true)"
    @mouseleave="mouseHandler(false)"
  >
    <transition name="fade-block">
      <div
        v-if="isBlockCollectionDragging"
        class="templates-block__dragdrop templates-block__dragdrop--top"
        :class="{ 'templates-block__dragdrop--enter': data.isNewBlockTopHover }"
        @dragenter.prevent="onDragEnterLeave($event, true, true)"
        @dragleave="onDragEnterLeave($event, false, true)"
        @dragover.prevent
      />
    </transition>
    <div
      class="templates-block"
      ref="blockRef"
      :data-id="value.id"
      :class="[{ active: isBlockSelected, hovered: data.hover, dragging: data.isDraggingBlockHandle }, value.id]"
      :style="{ ...blockStyle, ...templatesBlockActiveStyles }"
    >
      <div
        v-if="isBlockSelected"
        class="templates-block__handle templates-block__handle--bottom"
        :class="{ dragging: data.isDraggingBlockHandle }"
        :style="interfaceElementSize"
        @mousedown="throttledBlockDragging"
      >
        <div />
        <span>{{ data.blockDifference }}px</span>
      </div>
      <multi-layer-background
        :background-color="backgroundColor"
        :background-image="backgroundImage"
        :background-overlay="backgroundOverlay"
        :image-path="value.payload.image"
        :is-background-image-hidden="isBackgroundImageHidden"
        :value="value"
      />
      <div v-for="x in snapLines.x" :key="`${x}_x`" :style="calcSnapLineStyle(x)" class="snap" />
      <div v-for="y in snapLines.y" :key="`${y}_y`" :style="calcSnapLineStyle(undefined, y)" class="snap" />

      <div v-if="isInserting" class="insert-area" />
      <block-action-menu
        v-if="isBlockSelected && !isInserting"
        :block="value"
        :sort-id="block"
        :style="interfaceElementSize"
      />
      <drop-provider
        v-if="data.showFileLoader && !isBlockCollectionDragging"
        :style="fileLoaderStyle()"
        @dragleave="data.showFileLoader = false"
        @dropped="proceedDrop($event)"
      />
      <div :style="{ ...containerStyle, ...blockOverflowStyle }" class="container" @dragover="dragOverBlock">
        <multiselection-area
          v-if="blockSelectedElements.length > 1"
          :id="data.msaId"
          :elements="blockSelectedElements"
          :height="data.msaLocation.h"
          :hidden="data.isAreaDragging"
          :left="data.msaLocation.x"
          :top="data.msaLocation.y"
          :width="data.msaLocation.w"
          :zoom="zoom"
          :is-shift-pressed="isShiftPressed"
          @areaDragging="throttledAreaDragging"
          @areaDragstop="areaDragstop"
          @mouseenter="handleAreaEnter"
          @mouseleave="handleAreaLeave"
          @msaLocation="setMsaLocation"
          @selectBlock="selectBlockFromArea"
        />
        <div v-for="(el, index) in value.elements" :key="`${el.id}_${previewMode}`">
          <draggable-resizable-editor
            :id="`vdr_${el.id}`"
            :class="`vdr_${el.id}`"
            :data-id="el.id"
            :data="{
              a: el.location[previewMode].a,
              h: el.splitpanes ? 400 : el.location[previewMode].h,
              hAuto: autoHeightEnabled(el.type),
              hideElement: displayConditions[el.id].hideElement,
              hideSelection: isSelectionActive,
              isAreaDragging: data.isAreaDragging,
              isEnableProportionDuringResize: isEnableProportionDuringResize(el),
              isInteractionsBlocked: !!isElementEditing(el) ? isElementEditing(el) : false,
              isSelected: elementSelected(el),
              isShiftPressed: isShiftPressed,
              priorityLocation: data.priorityLocations[el.id]
                ? data.priorityLocations[el.id]
                : { x: null, y: null, w: null, h: null },
              resizeImmediately: el.location[previewMode].resizeImmediately,
              w: el.splitpanes ? 600 : el.location[previewMode].w,
              x: el.location[previewMode].x,
              xaxisAlign: el.location[previewMode].xaxisAlign,
              y: el.location[previewMode].y,
              yaxisAlign: el.location[previewMode].yaxisAlign,
              z: el.payload.zIndex,
              zoom: zoom,
              isEditor: isEditor,
              handles: autoHeightEnabled(el.type)
                ? ['rbr', 'lbr']
                : ['tl', 'tr', 'tbr', 'br', 'bl', 'bbr', 'rbr', 'lbr'],
              isOnlyXHandles: autoHeightEnabled(el.type),
              elementType: el.type,
              isElementLocked: el.payload.isLocked,
              isFontRendered: isFontRendered,
              isTextEditing: isTextEditing
            }"
            @changesize="resizestopHandler($event, el)"
            @click="elementClickHandler(el)"
            @dragging="throttledDragging($event, el)"
            @dragstart="dragstartHandler(el)"
            @dragstop="dragstopHandler($event, el)"
            @mouseenter="drMouseEnterHandler(el)"
            @mouseleave="drMouseLeaveHandler()"
            @resizing="resizingHandler($event, el)"
            @fontchangeend="fontChangeComplete"
          >
            <component
              :is="`${_startCase(el.type)}ElementEditor`"
              v-model="value.elements[index]"
              :preview-mode="previewMode"
            />
          </draggable-resizable-editor>
        </div>
      </div>
    </div>
    <transition name="fade-block">
      <div
        v-if="isBlockCollectionDragging"
        class="templates-block__dragdrop templates-block__dragdrop--bottom"
        :class="{ 'templates-block__dragdrop--enter': data.isNewBlockBottomHover }"
        @dragenter.prevent="onDragEnterLeave($event, true, false)"
        @dragleave="onDragEnterLeave($event, false, false)"
        @dragover.prevent
      />
    </transition>
  </section>
</template>

<script lang="ts">
/**
 * 1. по areaDragStop вызывать changeElementLocation в vdr
 */
import Vue from 'vue';
import { startCase as _startCase, throttle as _throttle } from 'lodash';
import { computed, reactive, ref, watch, defineComponent, PropType } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers';

import ImageElementEditor from '@/components/Editor/Elements/ImageElementEditor.vue';
import IconElementEditor from '@/components/Editor/Elements/IconElementEditor.vue';
import TextElementEditor from '@/components/Editor/Elements/TextElementEditor.vue';
import ButtonElementEditor from '@/components/Editor/Elements/ButtonElementEditor.vue';
import RectangleElementEditor from '@/components/Editor/Elements/RectangleElementEditor.vue';
import EmbedElementEditor from '@/components/Editor/Elements/EmbedElementEditor.vue';
import CircleElementEditor from '@/components/Editor/Elements/CircleElementEditor.vue';
import FormElementEditor from '@/components/Editor/Elements/FormElementEditor.vue';
import VideoElementEditor from '@/components/Editor/Elements/VideoElementEditor.vue';

import DraggableResizableEditor from '@/components/Editor/Elements/DraggableResizable/DraggableResizableEditor.vue';
import BlockActionMenu from './BlockActionMenu.vue';
import MultiLayerBackground from '@/components/Shared/MultiLayerBackground.vue';
import MultiselectionArea from '@/components/Editor/MultiselectionArea.vue';
import DropProvider from '@/components/Editor/Elements/DropProvider.vue';

import { useAnchorPoints } from '@/hooks/editor/anchorPoints.hook';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { useDynamicBlockCommonEditorFunctionality } from '@/components/Editor/Elements/dynamicBlockCommonEditorFunctionality.hook';
import useKeyPressed from '@/hooks/editor/utils/keyPress.hook';
import { textboxStyleTypes } from '@/constants/textBoxStyle';
import { ImageFile, proceedDataTransferItems } from '@/helpers/editorUtilities';
import { getUploadUrlByRoute } from '@/helpers/upload';
import { getId } from '@/helpers/randomString';
import { elementsFromPoint } from '@/helpers/elementsFromPoints';

import ObjectKeys from '@/utils/types/ObjectKeys';
import AnchorPoints, { XAps, YAps, Point } from '@/helpers/AnchorPoints';
import { ElementType } from '@/store/elements/create';
import { VisibleMessageNameType } from '@/store/ui';

type ResizeDirection = { right: boolean; left: boolean; top: boolean; bottom: boolean };
type MSALocation = { x: null | number; y: null | number; w?: null | number; h?: null | number };
type Value = { elements: any[]; styles: any[]; id: string; payload: any };

export default defineComponent({
  name: 'DynamicBlockEditor',
  components: {
    ButtonElementEditor,
    ImageElementEditor,
    IconElementEditor,
    RectangleElementEditor,
    CircleElementEditor,
    BlockActionMenu,
    MultiLayerBackground,
    DraggableResizableEditor,
    MultiselectionArea,
    TextElementEditor,
    EmbedElementEditor,
    FormElementEditor,
    VideoElementEditor,
    DropProvider
  },
  props: {
    value: {
      type: Object as PropType<Value>,
      default: (): Value => ({ elements: [], styles: [], id: '', payload: {} })
    },
    root: {
      type: Object,
      default: () => ({})
    },
    block: {
      type: Number,
      required: true
    }
  },
  setup(props, { root }) {
    // Editor functionality

    const blockRef = ref(null as null | HTMLDivElement);

    const data = reactive({
      msaId: `msa-${getId()}`,
      priorityLocations: {} as ObjectKeys<{ x: number; y: number }>,
      draggingThrottle: null,
      ddr: null as null | 'left' | 'top' | 'right' | 'bottom',
      resizingThrottle: null,
      fitParent: false,
      hover: false,
      isAreaDragging: false,
      isAreaDraggingAwait: false,
      isDraggingBlockHandle: false,
      msaBeforeDragLocation: undefined as undefined | MSALocation,
      msaLocation: {
        x: null,
        y: null,
        w: null,
        h: null
      } as MSALocation,
      showFileLoader: false,
      filePondFiles: [],
      xAPs: [] as XAps[],
      yAPs: [] as YAps[],
      blockHeight: 0 as number,
      blockMouseY: 0 as number,
      blockDifference: 0 as number,
      isNewBlockTopHover: false,
      isNewBlockBottomHover: false
    });

    /*
     * Computed
     * */
    const isEditor = computed((): boolean => root.$route.name === 'editor');
    const { useState, useGetters, useMutations, useActions } = createNamespacedHelpers(root.$store, 'editor');
    const { useState: useStateUi, useMutations: useMutationsUi } = createNamespacedHelpers(root.$store, 'ui');
    const containerStyle = {
      maxWidth: `${props.root.containerWidth}px`,
      borderLeft: isEditor.value ? '1px dashed transparent' : '',
      borderRight: isEditor.value ? '1px dashed transparent' : ''
    };
    const { selectedElements, zoom, previewMode, isFontRendered } = useState([
      'selectedElements',
      'zoom',
      'previewMode',
      'isFontRendered'
    ]);

    const apsReg = computed(
      (): ObjectKeys<Point[]> => {
        return root.$store.state.editor.uxCriticalData.aps;
      }
    );

    const editingElement = computed(() => {
      return root.$store.state.editor.uxCriticalData.editingElement;
    });

    const { isSelecting, isBlockCollectionDragging } = useStateUi(['isSelecting', 'isBlockCollectionDragging']);

    const {
      blockSelected: { value: blockSelected },
      isGlobalSelection: { value: isGlobalSelection },
      elementEditing: { value: elementEditing },
      findAPs: { value: findAPs },
      elementSelected: { value: elementSelected }
    } = useGetters(['blockSelected', 'isGlobalSelection', 'findAPs', 'elementSelected', 'elementEditing']);

    const isBlockSelected = computed(() => {
      return blockSelected(props.value);
    });

    const anchorPoints = computed(() => {
      const el = blockRef.value;
      if (!el) return [];
      const { offsetWidth, offsetHeight } = el;
      const { containerWidth } = props.root;
      return [
        { x: 0, y: 0 },
        { x: offsetWidth, y: 0 },
        { x: offsetWidth, y: offsetHeight },
        { x: 0, y: offsetHeight },
        { x: offsetWidth / 2, y: offsetHeight / 2 },
        { x: offsetWidth / 2 + containerWidth / 2, y: 0 },
        { x: offsetWidth / 2 + containerWidth / 2, y: offsetHeight },
        { x: offsetWidth / 2 - containerWidth / 2, y: 0 },
        { x: offsetWidth / 2 - containerWidth / 2, y: offsetHeight }
      ];
    });

    useAnchorPoints({
      element: props.value,
      store: root.$store,
      anchorPoints: anchorPoints
    });

    //TODO: not working now, because we dropped using containerWidth in editor header
    const containerAPs = computed(() => {
      const el = blockRef.value;
      if (!el) return null;
      const aps = {
        x: {
          [el.offsetWidth / 2 + props.root.containerWidth / 2]: {},
          [el.offsetWidth / 2 - props.root.containerWidth / 2]: {}
        }
      };
      if (props.root.containerWidth === undefined) {
        console.warn(
          'container snaplines is not working, because containerWidth is undefined, maybe we need to use editorFieldWidth instead'
        );
      }

      return aps;
    });

    const snapLines = computed(() => {
      const xSet: Set<number> = new Set();
      const ySet: Set<number> = new Set();
      for (const xap of data.xAPs) {
        if (containerAPs.value?.x[xap.coordinates.coordinate] === undefined) xSet.add(xap.coordinates.coordinate);
      }
      for (const yap of data.yAPs) {
        ySet.add(yap.coordinates.coordinate);
      }
      return { x: [...xSet], y: [...ySet] };
    });

    const isInserting = computed(() => {
      return root.$store.state.editor.isInserting;
    });

    const isSelectionActive = computed(() => {
      return (
        !isGlobalSelection &&
        selectedElements.value.length > 1 &&
        selectedElements.value[0].element.parentId === props.value.id
      );
    });

    const templatesBlockActiveStyles = computed(
      (): ObjectKeys<string> => {
        const outlineWidth = data.hover ? 1.5 : 1;
        const outlineColor = data.hover ? 'rgba(148, 156, 173,.5)' : '#949CAD';

        return isEditor.value && (isBlockSelected.value || data.hover)
          ? {
              outline: `${outlineWidth / zoom.value}px solid ${outlineColor}`
            }
          : {};
      }
    );

    const interfaceElementSize = computed(() => `transform: scale(${1 / zoom.value});`);

    const isTextEditing = computed(() => root.$store.state.ui.isTextEditing);

    watch(
      () => data.xAPs,
      () => {
        const containerXSnapLines: Set<number> = new Set();
        for (const xCoordinate of data.xAPs) {
          if (containerAPs.value?.x[xCoordinate.coordinates.coordinate] !== undefined)
            containerXSnapLines.add(xCoordinate.coordinates.coordinate);
        }

        root.$store.dispatch('editor/containerSnapLines', {
          containerXSnapLines
        });
      }
    );

    watch(
      () => data.isAreaDragging,
      val => {
        setTimeout(
          () => {
            data.isAreaDraggingAwait = val;
          },
          val ? 0 : 20
        );
      }
    );

    watch(
      props.value,
      val => {
        if (val.styles[previewMode.value].heightType === 'vh') {
          setTimeout(() => {
            if (!blockRef.value) return;
            root.$store.commit('editor/changeBlockStyleData', {
              block: props.block,
              path: 'h',
              data: blockRef.value.clientHeight
            });
          }, 100);
        }
      },
      { deep: true }
    );

    const throttledDragging = _throttle(draggingHandler, 10);
    const throttledElementResizing = _throttle(resizeElement, 10);
    const throttledAreaDragging = _throttle(areaDragging, 1);
    const throttledBlockDragging = _throttle(blockDragStart, 1);

    const {
      addBlockIntoSelected,
      cleanSelectedElements,
      cleanSelectedBlocks,
      changeLocation,
      changeElementLocation,
      setChangingElementData,
      setEditingElement,
      createElement,
      addSelectedElements,
      changeEditorParam,
      addMsaToReg,
      removeMsaFromReg,
      moveElementFromOneBlockToAnother,
      setIsFontRendered
    } = useMutations([
      'addBlockIntoSelected',
      'cleanSelectedElements',
      'cleanSelectedBlocks',
      'changeLocation',
      'changeElementLocation',
      'setChangingElementData',
      'setEditingElement',
      'createElement',
      'addSelectedElements',
      'changeEditorParam',
      'addMsaToReg',
      'removeMsaFromReg',
      'moveElementFromOneBlockToAnother',
      'setIsFontRendered'
    ]);

    const { changeNewBlockSortId, changeVisibleMessageName } = useMutationsUi([
      'changeNewBlockSortId',
      'changeVisibleMessageName'
    ]);

    const { proceedElementClick, pasteImage } = useActions(['proceedElementClick', 'pasteImage']);

    function drMouseEnterHandler(element: any) {
      changeEditorParam({ path: 'hoveredElement', value: element });
    }

    function drMouseLeaveHandler() {
      changeEditorParam({ path: 'hoveredElement', value: undefined });
    }

    function handleAreaEnter() {
      changeEditorParam({ path: 'hoveredElement', value: { type: 'msa', id: data.msaId, parentId: props.value.id } });
    }

    function handleAreaLeave() {
      changeEditorParam({ path: 'hoveredElement', value: undefined });
    }

    function calcAPStyle(ap: Point) {
      return `top:${ap.y - 2}px;
            left:${ap.x - 2}px;`;
    }

    function proceedDrop(dataTransfer: DataTransfer) {
      data.showFileLoader = false;
      proceedDataTransferItems(dataTransfer, (image: ImageFile) => {
        const payload = {
          url: getUploadUrlByRoute(root.$route),
          imageFile: image,
          block: props.value
        };
        pasteImage(payload);
      });
    }

    function proceedLoadedFile(event: any) {
      data.showFileLoader = false;
      createElement({
        element: ElementType.Image,
        block: props.value,
        payload: { src: event.fullPath }
      });
    }

    function isElementEditing(element: any) {
      return elementEditing(element);
    }

    function fileLoaderStyle() {
      const blockElement = document.getElementById(props.value.id);

      if (!blockElement) return '';
      return `
        display:${data.showFileLoader === true ? 'block' : 'none'};
        position:absolute;
        z-index: 100;
        width:${blockElement.offsetWidth}px;
        height:${blockElement.offsetHeight}px;
        top:0px;
        left:0px;
      `;
    }

    function setMsaLocation({ x, y, w, h }: any) {
      data.msaLocation = { x, y, w, h };
    }

    function getAreaCorrectedDiffs(id: string, xDiff: number, yDiff: number) {
      const msaAps = getDraggedElementAps(id, xDiff, yDiff);
      const aps = findAPs({
        id,
        aps: msaAps,
        parentId: props.value.id
      });
      setAPs(aps);
      const { newXDiff, newYDiff } = getAPsCorrectedCoordinates(id, xDiff, yDiff);
      return { newXDiff, newYDiff };
    }

    function moveElementFromOneBlockToAnotherOnDrag(clientX: number, clientY: number) {
      const { value } = selectedElements;
      for (const item of elementsFromPoint(clientX, clientY)) {
        if (item.classList.contains('templates-block-wrap')) {
          for (const [index, elem] of value.entries()) {
            if (item.id !== elem.element.parentId) {
              if (index === 0) {
                root.$nextTick(() => {
                  cleanSelectedElements();
                });
              }
              root.$nextTick(() => {
                const block: HTMLDivElement | null = document.querySelector(`#${item.id}`);
                const element: HTMLDivElement | null = document.querySelector(`#${elem.element.id}`);
                const blockBounds = block?.getBoundingClientRect();
                const elemBounds = element?.getBoundingClientRect();
                moveElementFromOneBlockToAnother({
                  newBockId: item.id,
                  element: elem.element,
                  blockBounds,
                  elemBounds,
                  zoom: zoom.value
                });
                changeVisibleMessageName(VisibleMessageNameType.MoveElement);
              });
            }
          }
          break;
        }
      }
    }

    function areaDragstop({
      id,
      elements,
      left,
      top,
      xAreaDiff,
      yAreaDiff,
      w,
      h,
      clientX,
      clientY
    }: {
      id: string;
      elements: any[];
      left: number;
      top: number;
      xAreaDiff: any;
      yAreaDiff: any;
      w: number;
      h: number;
      clientX: number;
      clientY: number;
    }) {
      root.$store.commit('ui/changeDraggingState', false);
      moveElementFromOneBlockToAnotherOnDrag(clientX, clientY);
      /** обнуляем параметры msa */
      data.msaLocation = { x: left, y: top, w, h };
      data.msaBeforeDragLocation = undefined;
      data.isAreaDragging = false;
      const { newXDiff, newYDiff } = getAreaCorrectedDiffs(id, xAreaDiff, yAreaDiff);
      setChangingElementData(undefined);
      data.priorityLocations = {};

      changeLocation({ xDiff: newXDiff || xAreaDiff, yDiff: newYDiff || yAreaDiff, elements, saveHistory: true });
      data.ddr = null;
      data.xAPs = [];
      data.yAPs = [];
    }

    function getDraggedElementAps(selElementId: string, xDiff: number, yDiff: number): Point[] {
      return apsReg.value[selElementId].map(ap => {
        return { x: ap.x + xDiff, y: ap.y + yDiff };
      });
    }

    function areaDragging({
      left,
      top,
      elements,
      id,
      w,
      h
    }: {
      left: number;
      top: number;
      elements: any[];
      id: string;
      w: number;
      h: number;
    }) {
      elements.forEach(el => root.$store.commit('editor/deleteAPs', { id: el.id }));

      data.msaLocation = { x: left, y: top, w, h };
      setChangingElementData(data.msaLocation);

      if (data.isAreaDragging === false) {
        data.isAreaDragging = true;
        root.$store.commit('ui/changeDraggingState', true);
      }
      if (!data.msaBeforeDragLocation) data.msaBeforeDragLocation = { ...data.msaLocation };
      const xDiff = data.msaLocation.x ?? 0 - (data.msaBeforeDragLocation?.x ?? 0);
      const yDiff = data.msaLocation.y ?? 0 - (data.msaBeforeDragLocation?.y ?? 0);

      const { newXDiff, newYDiff } = getAreaCorrectedDiffs(id, xDiff, yDiff);

      for (const el of elements) {
        const selElementId = el.id;
        const selElementLocation = el.location[previewMode.value];
        Vue.set(data.priorityLocations, selElementId, {
          x: selElementLocation.x + (newXDiff ?? xDiff),
          y: selElementLocation.y + (newYDiff ?? yDiff)
        });
      }

      const draggedElementAps = getDraggedElementAps(id, xDiff, yDiff);

      const aps = findAPs({
        id: id,
        aps: draggedElementAps,
        parentId: props.value.id
      });
      // Добавляем текущие aps area чтобы снапы рисовались и по его aps тоже
      addElementApsIntoReg(aps, draggedElementAps);
      setAPs(aps);
    }

    function dragstartHandler(element: any) {
      root.$store.commit('ui/changeDraggingState', true);
      root.$store.commit('editor/unlockAxisAlign', {
        element: element,
        xaxisAlign: null,
        yaxisAlign: null
      });
      if (selectedElements.value.length <= 1 || !elementSelected(element)) {
        cleanSelectedElements();
        addSelectedElements({ element });
      }
      root.$store.commit('editor/deleteAPs', { id: element.id });
    }

    function dragstopHandler(
      { xDiff, yDiff, clientX, clientY }: { xDiff: number; yDiff: number; clientX: number; clientY: number },
      element: any
    ) {
      moveElementFromOneBlockToAnotherOnDrag(clientX, clientY);

      data.msaBeforeDragLocation = undefined;
      data.priorityLocations = {};
      if (blockSelectedElements.value.length > 1 && elementSelected(element)) {
        const { newXDiff, newYDiff } = getAreaCorrectedDiffs(data.msaId, xDiff, yDiff);
        blockSelectedElements.value.forEach(el => {
          root.$store.commit('editor/changeElementPosition', {
            id: el.id,
            xDiff: newXDiff || xDiff,
            yDiff: newYDiff || yDiff,
            saveHistory: false
          });
        });
      } else {
        const { newXDiff, newYDiff } = getAPsCorrectedCoordinates(element.id, xDiff, yDiff);
        root.$store.commit('editor/changeElementPosition', {
          id: element.id,
          xDiff: newXDiff ?? xDiff,
          yDiff: newYDiff ?? yDiff,
          saveHistory: true
        });
        cleanSelectedElements();
        addSelectedElements({ element });
      }
      setChangingElementData(undefined);
      data.isAreaDragging = false;
      root.$store.commit('ui/changeDraggingState', false);
      data.ddr = null;
      data.xAPs = [];
      data.yAPs = [];
    }

    function getAPsCorrectedCoordinates(elementId: string, xDiff: number, yDiff: number) {
      const currentElementAps = apsReg.value[elementId].map((aps: Point) => {
        return { x: aps.x + xDiff, y: aps.y + yDiff };
      });
      let newXDiff, newYDiff;
      for (const elAP of currentElementAps) {
        for (const xAP of data.xAPs) {
          const apsDiff = elAP.x - xAP.coordinates.coordinate;
          if (Math.abs(apsDiff) <= AnchorPoints.DELTA) {
            if (xDiff !== 0) {
              newXDiff = apsDiff * -1 + xDiff;
            } else {
              newXDiff = apsDiff;
            }
          }
        }
      }
      for (const elAP of currentElementAps) {
        for (const yAP of data.yAPs) {
          const apsDiff = elAP.y - yAP.coordinates.coordinate;
          if (Math.abs(apsDiff) <= AnchorPoints.DELTA) {
            newYDiff = apsDiff * -1 + yDiff;
          }
        }
      }
      return { newXDiff, newYDiff };
    }

    function isEnableProportionDuringResize(element: any) {
      const elementTypes = ['button', 'rectangle', 'circle', 'image'];
      return elementTypes.includes(element.type);
    }

    function resizeElement(
      left: number,
      top: number,
      width: number,
      height: number,
      resizeDirection: ResizeDirection,
      element: any
    ) {
      const data = { w: width, h: height, x: left, y: top };
      setChangingElementData(data);
      changeElementTextBoxStyle(element, resizeDirection);
    }

    /**
     * logic to switch textBoxStyle in font section of element
     */
    function changeElementTextBoxStyle(element: any, resizeDirection: ResizeDirection) {
      const currentElementTextBoxStyle = element.location[previewMode.value].textBoxStyle;
      let textBoxStyle = null;

      if (
        currentElementTextBoxStyle == textboxStyleTypes.AUTO_WIDTH &&
        (resizeDirection.left || resizeDirection.right)
      ) {
        textBoxStyle = textboxStyleTypes.AUTO_HEIGHT;
      }

      if (
        (currentElementTextBoxStyle == textboxStyleTypes.AUTO_HEIGHT ||
          currentElementTextBoxStyle == textboxStyleTypes.AUTO_WIDTH) &&
        (resizeDirection.top || resizeDirection.bottom)
      ) {
        textBoxStyle = textboxStyleTypes.FIXED;
      }

      if (textBoxStyle) {
        changeElementLocation({
          element,
          data: { textBoxStyle }
        });
      }
    }

    /**
     * for enable mode: h-auto, w-auto in vdr
     * @param {string} type - type of auto in vdr (h-auto, w-auto) TODO: to Enum
     * @returns {boolean}
     */
    function autoHeightEnabled(type: string) {
      return ['text', 'form'].includes(type);
    }

    function resizestopHandler(data: any, element: any) {
      setChangingElementData(undefined);
      changeElementLocation({
        element,
        data
      });
    }

    function resizingHandler(
      {
        left,
        top,
        width,
        height,
        resizeDirection
      }: { left: number; top: number; width: number; height: number; resizeDirection: ResizeDirection },
      element: any
    ) {
      throttledElementResizing(left, top, width, height, resizeDirection, element);
    }

    function fontChangeComplete() {
      setIsFontRendered(false);
    }

    /**
     * Добавляем текущие aps элемента который перемещают чтобы снапы рисовались и по его aps тоже
     */
    function addElementApsIntoReg(aps: { xApsArray: XAps[]; yApsArray: YAps[] }, draggedElementAps: Point[]) {
      for (const xAP of aps.xApsArray) {
        for (const elementAP of draggedElementAps) {
          if (Math.abs(elementAP.x - xAP.coordinates.coordinate) < AnchorPoints.DELTA) {
            xAP.coordinates.ortCoordinates.push(elementAP.y);
          }
        }
      }
      for (const yAP of aps.yApsArray) {
        for (const elementAP of draggedElementAps) {
          if (Math.abs(elementAP.y - yAP.coordinates.coordinate) < AnchorPoints.DELTA) {
            yAP.coordinates.ortCoordinates.push(elementAP.x);
          }
        }
      }
    }

    function draggingHandler(
      { xDiff, yDiff, x, y }: { xDiff: number; yDiff: number; x: number; y: number },
      element: any
    ) {
      if (selectedElements.value.length > 1 && elementSelected(element)) {
        if (!data.msaBeforeDragLocation) data.msaBeforeDragLocation = { ...data.msaLocation };
        data.isAreaDragging = true;
        root.$store.commit('ui/changeDraggingState', true);

        const { newXDiff, newYDiff } = getAreaCorrectedDiffs(data.msaId, xDiff, yDiff);

        data.msaLocation = {
          x: data.msaBeforeDragLocation?.x ?? 0 + (newXDiff ? newXDiff : xDiff),
          y: data.msaBeforeDragLocation?.y ?? 0 + (newYDiff ? newYDiff : yDiff)
        };

        setChangingElementData(data.msaLocation);

        blockSelectedElements.value.forEach(el => {
          const selElementId = el.id;
          root.$store.commit('editor/deleteAPs', { id: selElementId });
          const selElementLocation = el.location[previewMode.value];
          Vue.set(data.priorityLocations, selElementId, {
            x: selElementLocation.x + (newXDiff ? newXDiff : xDiff),
            y: selElementLocation.y + (newYDiff ? newYDiff : yDiff)
          });
        });

        const draggedElementAps = getDraggedElementAps(data.msaId, xDiff, yDiff);

        const aps = findAPs({
          id: data.msaId,
          aps: draggedElementAps,
          parentId: props.value.id
        });
        // Добавляем текущие aps area чтобы снапы рисовались и по его aps тоже
        addElementApsIntoReg(aps, draggedElementAps);
        setAPs(aps);
      } else {
        let changingElementData = undefined;

        const draggedElementAps = getDraggedElementAps(element.id, xDiff, yDiff);

        if (isAltPressed.value) {
          if (data.ddr === null && xDiff !== yDiff) {
            if (xDiff >= 0 && yDiff >= 0) {
              data.ddr = xDiff > yDiff ? 'left' : 'top';
            } else if (xDiff <= 0 && yDiff <= 0) {
              data.ddr = xDiff < yDiff ? 'left' : 'top';
            }
          }

          if (data.ddr === 'top') {
            changingElementData = { y: y + yDiff, x };
          } else if (data.ddr === 'left') {
            changingElementData = { x: x + xDiff, y };
          }
        } else {
          const { newXDiff, newYDiff } = getAPsCorrectedCoordinates(element.id, xDiff, yDiff);
          changingElementData = {
            x: x + (newXDiff ?? xDiff),
            y: y + (newYDiff ?? yDiff)
          };
          data.priorityLocations = { [element.id]: { ...changingElementData } };
        }
        const aps = findAPs({
          id: element.id,
          aps: draggedElementAps
        });

        addElementApsIntoReg(aps, draggedElementAps);
        setAPs(aps);
        setChangingElementData(changingElementData);
      }
    }

    const isAltPressed = useKeyPressed({
      store: root.$store,
      desc: 'alt',
      event: 'keydown'
    });
    const isShiftPressed = useKeyPressed({
      store: root.$store,
      desc: 'shift',
      event: 'keydown'
    });

    function elementClickHandler(element: any) {
      proceedElementClick({ element });
    }

    function mouseHandler(value: boolean) {
      data.hover = value;
      if (value) changeEditorParam({ path: 'hoveredBlock', value: props.value });
      else changeEditorParam({ path: 'hoveredBlock', value: undefined });
    }

    function selectBlock(e: any) {
      if (!e.target.closest('.vdr') && !e.target.closest('.multiselection-drag-area') && !isSelecting.value) {
        // Вынести логику обработки клика по блоку в стор
        if (editingElement.value === undefined) {
          if (!blockSelected(props.value)) {
            cleanSelectedBlocks();
            addBlockIntoSelected(props.value);
          }
          cleanSelectedElements();
        } else {
          setEditingElement(undefined);
        }
      }
    }

    function dragOverBlock() {
      if (data.isDraggingBlockHandle) return;

      data.showFileLoader = true;
    }

    function resizeBlock(e: MouseEvent) {
      const dy = e.clientY - data?.blockMouseY ?? 0;

      if (blockRef.value) {
        blockRef.value.style.height = `${Math.round((data.blockHeight + dy) / zoom.value)}px`;
        data.blockDifference = Math.round(blockRef.value.clientHeight);
      }
    }

    function blockDragEnd() {
      data.isDraggingBlockHandle = false;
      data.isAreaDragging = false;
      root.$store.commit('ui/changeDraggingState', false);

      if (blockRef.value) {
        root.$store.commit('editor/changeBlockStyleData', {
          block: props.value,
          path: 'height',
          data: blockRef.value.style.height
        });
      }

      document.removeEventListener('mousemove', resizeBlock);
      document.removeEventListener('mouseup', blockDragEnd);
    }

    function blockDragStart(e: MouseEvent) {
      data.isDraggingBlockHandle = true;
      data.isAreaDragging = true;
      root.$store.commit('ui/changeDraggingState', true);

      data.blockMouseY = e.clientY;

      data.blockHeight = blockRef.value?.getBoundingClientRect().height ?? 0;

      document.addEventListener('mousemove', resizeBlock);
      document.addEventListener('mouseup', blockDragEnd);
    }

    function setAPs(aps: { xApsArray: XAps[]; yApsArray: YAps[] }) {
      data.xAPs = aps.xApsArray;
      data.yAPs = aps.yApsArray;
    }

    function selectBlockFromArea(e: Event, isDragging: boolean) {
      console.log('block  FromArea props.value', props.value);
      if (!isDragging) {
        if (!blockSelected(props.value)) {
          cleanSelectedBlocks();
          addBlockIntoSelected(props.value);
        }
        cleanSelectedElements();
      }
    }

    /**
     * get style for snap line
     */
    function calcSnapLineStyle(x?: number | undefined, y?: number | undefined) {
      if (x !== undefined) {
        // Old logic of snap lines
        // const xAP = data.xAPs.find(xAP => xAP.coordinates.coordinate === x);
        // if (!xAP) return '';
        // const yCoordinates = xAP.coordinates.ortCoordinates;
        // const minY = Math.min(...yCoordinates);
        // const maxY = Math.max(...yCoordinates);
        return {
          top: `0px`,
          left: `${x}px`,
          width: `${1 / zoom.value}px`,
          height: `${blockRef?.value?.offsetHeight ?? 0}px`
        };
      }
      if (y !== undefined) {
        // Old logic of snap lines
        // const yAP = data.yAPs.find(yAP => yAP.coordinates.coordinate === y);
        // if (!yAP) return '';
        // const xCoordinates = yAP.coordinates.ortCoordinates;
        // const minX = Math.min(...xCoordinates);
        // const maxX = Math.max(...xCoordinates);
        // const styles = {
        //   top: `${y - 1}px`,
        //   left: `0px`,
        //   width: `${maxX - minX}px`,
        //   height: `${1 / zoom.value}px`
        // };

        return {
          top: `${y}px`,
          left: `0px`,
          width: `${blockRef?.value?.offsetWidth ?? 0}px`,
          height: `${1 / zoom.value}px`
        };
      }
    }

    function initiateDisplayConditions() {
      useDisplayConditions({
        element: { value: props.value },
        conditions: [{ condition: 'hideBackgroundColor', value: false }],
        store: root.$store
      });

      for (const element of props.value.elements) {
        useDisplayConditions({
          element: { value: element },
          conditions: [{ condition: 'hideElement', value: false }],
          store: root.$store
        });
      }
    }

    function onDragEnterLeave(ev: any, isEnter: boolean, isTop: boolean) {
      const element = document.querySelector('#image-drag') as HTMLElement;
      const image = element?.querySelector('img');
      if (element && image) image.style.transform = `scale(${isEnter ? 1.5 : 1})`;
      isTop ? (data.isNewBlockTopHover = isEnter) : (data.isNewBlockBottomHover = isEnter);
      if (isEnter) {
        changeNewBlockSortId(isTop ? props.block - 1 : props.block);
      } else {
        changeNewBlockSortId(null);
      }
    }

    initiateDisplayConditions();

    watch(
      () => props.value,
      () => initiateDisplayConditions()
    );

    const displayConditions = computed(() => {
      const conditions: ObjectKeys<any> = {};
      for (const element of props.value.elements) {
        const { displayConditions: elementDisplayConditions } = useDisplayConditions({
          element: { value: element },
          conditions: [{ condition: 'hideElement' }],
          store: root.$store
        });
        conditions[element.id] = elementDisplayConditions.value;
      }
      return conditions;
    });

    // Common editor functionality
    const {
      blockStyle,
      blockOverflowStyle,
      backgroundColor,
      backgroundImage,
      backgroundOverlay
    } = useDynamicBlockCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      previewMode
    );

    const isBackgroundImageHidden = computed(() => {
      return props.value.styles[previewMode.value].displayBackgroundImage === 'none';
    });

    const blockSelectedElements = computed((): any[] => {
      return selectedElements.value
        .filter((el: any) => el.element.parentId === props.value.id)
        .map((el: any) => el.element);
    });

    watch(
      () => blockSelectedElements.value,
      () => {
        if (blockSelectedElements.value.length > 1) addMsaToReg({ id: data.msaId, blockId: props.value.id });
        else removeMsaFromReg({ blockId: props.value.id });
      }
    );

    watch(
      () => isBlockCollectionDragging.value,
      () => {
        data.showFileLoader = false;
      }
    );

    return {
      containerStyle,
      data,
      blockRef,
      blockStyle,
      blockOverflowStyle,
      backgroundColor,
      backgroundImage,
      backgroundOverlay,
      isBackgroundImageHidden,
      isInserting,
      zoom,
      isEditor,
      previewMode,
      isSelectionActive,
      elementSelected,
      selectBlock,
      dragOverBlock,
      _startCase,
      snapLines,
      throttledAreaDragging,
      throttledDragging,
      throttledElementResizing,
      throttledBlockDragging,
      isBlockSelected,
      isShiftPressed,
      displayConditions,
      blockSelectedElements,
      templatesBlockActiveStyles,
      isFontRendered,
      isTextEditing,
      interfaceElementSize,
      isBlockCollectionDragging,
      fileLoaderStyle,
      mouseHandler,
      autoHeightEnabled,
      isEnableProportionDuringResize,
      resizingHandler,
      dragstartHandler,
      dragstopHandler,
      drMouseEnterHandler,
      drMouseLeaveHandler,
      calcSnapLineStyle,
      calcAPStyle,
      resizestopHandler,
      elementClickHandler,
      areaDragstop,
      selectBlockFromArea,
      setMsaLocation,
      proceedLoadedFile,
      proceedDrop,
      isElementEditing,
      handleAreaEnter,
      handleAreaLeave,
      fontChangeComplete,
      onDragEnterLeave
    };
  }
});
</script>

<style lang="scss">
.snap {
  position: absolute;
  z-index: 10000;
  background-color: #fa4141;
}

.ap {
  position: absolute;
  z-index: 100;
}

.insert-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: url('./../../../../assets/img/editor/cursor/add.png'), auto;
  z-index: 999999;
  transition: 0.3s;
  &:hover {
    background: rgba(#318bf5, 0.1);
  }
}

.templates-block-wrap {
  position: relative;

  &:not(:first-child) {
    .templates-block__dragdrop--top {
      display: none;
    }
  }
}

.templates-block {
  outline: 1px solid transparent;
  outline-offset: -1px;
  //position: relative;

  &__handle {
    width: 62px;
    height: 9px;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: #949cad;
    opacity: 0;
    visibility: hidden;
    z-index: 1000;
    text-align: center;

    &:hover {
      background: $blue200;
    }
    &--bottom {
      &:after,
      &:before {
        content: '';
        position: absolute;
        width: 32px;
        height: 1px;
        background: $white;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        pointer-events: none;
      }

      &:after {
        top: -4px;
      }
      &:before {
        bottom: -3px;
      }
    }

    span {
      position: absolute;
      left: 50%;
      opacity: 0;
      visibility: hidden;
      display: inline;
      white-space: nowrap;
      font-style: normal;
      font-weight: normal;
      font-size: 10px;
      line-height: 12px;
      color: $white;
      background: $blue200;
      border-radius: 4px;
      padding: 2px 6px;
      pointer-events: none;
    }

    &--bottom {
      transform-origin: 50% 100%;
      bottom: 0;
      border-radius: 3px 3px 0 0;
      cursor: -webkit-image-set(
            url("data:image/svg+xml,%3Csvg width='15' height='29' viewBox='0 0 15 29' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2412_19552)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.125 19.625V7.125H10L7.5 4L5 7.125H6.875L6.875 19.625H5L7.5 22.75L10 19.625H8.125Z' fill='black'/%3E%3Cpath d='M5 7.525H6.475L6.475 19.225H5H4.16775L4.68765 19.8749L7.18765 22.9999L7.5 23.3903L7.81235 22.9999L10.3123 19.8749L10.8323 19.225H10H8.525V7.525H10H10.8323L10.3123 6.87512L7.81235 3.75012L7.5 3.35969L7.18765 3.75012L4.68765 6.87512L4.16775 7.525H5Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2412_19552' x='0.335449' y='0.71936' width='14.3291' height='27.3113' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2412_19552'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2412_19552' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
          )
          0 0,
        ns-resize;
      cursor: url("data:image/svg+xml,%3Csvg width='15' height='29' viewBox='0 0 15 29' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2412_19552)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.125 19.625V7.125H10L7.5 4L5 7.125H6.875L6.875 19.625H5L7.5 22.75L10 19.625H8.125Z' fill='black'/%3E%3Cpath d='M5 7.525H6.475L6.475 19.225H5H4.16775L4.68765 19.8749L7.18765 22.9999L7.5 23.3903L7.81235 22.9999L10.3123 19.8749L10.8323 19.225H10H8.525V7.525H10H10.8323L10.3123 6.87512L7.81235 3.75012L7.5 3.35969L7.18765 3.75012L4.68765 6.87512L4.16775 7.525H5Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2412_19552' x='0.335449' y='0.71936' width='14.3291' height='27.3113' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2412_19552'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2412_19552' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
          0 0,
        ns-resize;

      span {
        bottom: 6px;
        transform: translate(-50%, -100%);
      }
    }

    &.dragging {
      background: $blue200;

      span {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  &__dragdrop {
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 1000;
    background: rgba($blue200, 0.3);
    border: 1px dashed $blue200;

    &--enter {
      border-color: $success;
      background: rgba($success, 0.3);
      transition: border 0.3s, background 0.3s;
    }

    &--top {
      top: -30px;
    }

    &--bottom {
      bottom: -30px;
    }
  }
}

.templates-block.active {
  outline-color: #949cad !important;

  .templates-block__handle {
    opacity: 1;
    visibility: visible;
  }
}

.templates-block.dragging {
  outline-color: $blue200 !important;
}

.templates-block.active .block-action-menu {
  display: inline-flex;
}

.templates-block {
  &.active .container {
    border-color: $blue200;
  }

  .container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
}

.fade-block-enter-active,
.fade-block-leave-active {
  transition: all 0.3s ease;
}
.fade-block-enter,
.fade-block-leave-to {
  height: 0;
  opacity: 0;
}
</style>

<template>
  <div :class="layerHeadClass">
    <div class="layer-block__head-top" @click="proceedBlockClk">
      <div @click.stop="collapseBody" class="layer-block__toggle-icon">
        <svg-icon name="chevron-right" width="5" height="7" color="#BFC4CE" />
      </div>
      <div class="layer-block__head">
        <div @focus="onInputFocus" tabindex="0" />
        <svg-icon v-show="!activeNameInput" name="block" :width="18" :height="18" />
        <div v-show="!activeNameInput" @dblclick="openNameInput" class="layer-block__title" v-tooltip="block.name">
          {{ block.name }}
        </div>
        <input
          ref="nameInput"
          v-model="blockName"
          @keypress.enter="rename"
          @keydown.esc="activeNameInput = false"
          @focusout="activeNameInput = false"
          @blur="onInputBlur"
          v-click-outside="rename"
          v-show="activeNameInput"
          class="layer-block__input"
          type="text"
        />
        <div class="layer-block__btns" ref="contextPopupBtn" v-show="!activeNameInput">
          <!--      может быть пригодится, логика добавления элемента в блок через слой      -->
          <!--      <button @click="openAddElementPopup" ref="addElemBtn" class="layer-block__btn">-->
          <!--        <icon icon="Add-btn" />-->
          <!--      </button>-->
          <!--          <button @click.stop="toggleHideElement" ref="contextPopupBtn" class="layer-block__btn">-->
          <!--            <svg-icon v-if="!isElementHidden" name="hide" width="12" height="8" color="#000" />-->
          <!--            <svg-icon v-else name="unhide" width="12" height="10" color="#000" />-->
          <!--          </button>-->
          <square-icon-btn
            class="layer-block__btn"
            @click="toggleHideElement"
            :icon-settings="{ name: !isElementHidden ? 'hide' : 'unhide', ...iconSize }"
            v-tooltip="!isElementHidden ? 'Hide' : 'Unhide'"
          />
          <square-icon-btn
            class="layer-block__btn"
            :class="{ active: isPopupOpen }"
            @click.stop.native="openContextPopup"
            :icon-settings="{ name: 'dots', ...iconSize }"
            v-tooltip="'Drag / Settings'"
          />
        </div>
      </div>
    </div>
    <div class="layers-type__body" :style="`height: ${isBlockOpened ? layerBodyHeight : 0}px`">
      <div class="layers-type" v-show="isBlockOpened">
        <draggable
          class="layer-block__elements"
          :animation="100"
          :value="block.elements"
          :options="{ disabled: isDisableDraggable }"
          @change="layerListChanged"
        >
          <block-element
            v-for="(element, index) in sortedElementsByZindex"
            :key="element.id"
            :element="element"
            :index="index"
            :block="block"
            :isDisableDraggable="isDisableDraggable"
            @elementClick="proceedElementClk"
            @changeDraggableState="changeDraggableState"
            @changeOrder="changeLayerOrderFromPopup"
          />
        </draggable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useGetters, useActions, useMutations } from 'vuex-composition-helpers';
import { computed, ref, watch, defineComponent } from '@vue/composition-api';
import draggable from 'vuedraggable';
import BlockElement from './BlockElement.vue';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { AddElementPopupData, ContextPopupData, PopupContainerType, PopupSettings, PopupType } from '../Modal/types';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
import { dynamicIconSizes } from '@/constants/dynamicIconSizes';

export default defineComponent({
  name: 'LayerBlock',
  components: {
    BlockElement,
    SquareIconBtn,
    draggable
  },
  props: {
    block: {
      type: Object,
      required: true,
      default: () => {}
    },
    isDisableDraggable: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const layerElementHeight = ref(34);
    const activeNameInput = ref(false);
    const nameInputValue = ref(undefined as undefined | HTMLInputElement);
    const nameInput = ref(null as null | HTMLInputElement);
    const addElemBtn = ref(null as null | HTMLButtonElement);
    const contextPopupBtn = ref(null as null | any);
    const blockName = ref(props.block.name as string | null);
    const { displayConditions, setDisplayCondition } = useDisplayConditions({
      element: computed(() => props.block),
      conditions: [{ condition: 'layerOpened', value: false }],
      store: root.$store
    });

    const isBlockOpened = computed(() => {
      return displayConditions.value.layerOpened;
    });

    const previewMode = computed(() => {
      return root.$store.state.editor.previewMode;
    });

    const isElementHidden = computed(() => {
      return props.block.styles[previewMode.value].display === 'none';
    });

    const popupSettingsData = computed(() => root.$store.state.editor.popupSettings);

    const { blockSelected, activeShortcut, isChildOfBlockSelected } = useGetters({
      blockSelected: 'editor/blockSelected',
      activeShortcut: 'shortcut/activeShortcut',
      isChildOfBlockSelected: 'editor/isChildOfBlockSelected'
    } as any);

    const { proceedElementClick, proceedBlockClick } = useActions({
      proceedElementClick: 'editor/proceedElementClick',
      proceedBlockClick: 'editor/proceedBlockClick'
    } as any);

    const {
      popupSettings,
      changeBlockParam,
      cleanSelectedBlocks,
      cleanSelectedElements,
      moveElementByZindex
    } = useMutations({
      popupSettings: 'editor/SET_POPUP_SETTINGS',
      changeBlockParam: 'editor/changeBlockParam',
      cleanSelectedBlocks: 'editor/cleanSelectedBlocks',
      cleanSelectedElements: 'editor/cleanSelectedElements',
      moveElementByZindex: 'editor/moveElementByZindex'
    } as any);

    const layerHeadClass = computed(() => {
      return {
        'layers-type': true,
        'layers-type--selected': activeNameInput.value === true || blockSelected.value(props.block),
        'layers-type--opened': isBlockOpened.value,
        'layers-type--hidden': isElementHidden.value
      };
    });

    const availableElements = computed(() => {
      return root.$store.state.editor.availableElements;
    });

    const selectedBlocks = computed(() => {
      return root.$store.state.editor.selectedBlocks;
    });

    const selectedElements = computed(() => {
      return root.$store.state.editor.selectedElements;
    });

    const isBlockSelected = computed(() => {
      if (selectedBlocks.value === undefined) return false;
      return selectedBlocks.value.some((item: any) => item.id === props.block.id);
    });

    const layerBodyHeight = computed(() => {
      return props.block.elements.length * layerElementHeight.value;
    });

    const componentLength = computed(() => {
      return root.$store.state.editor.userConfig.components.length;
    });

    const isPopupOpen = computed(() => {
      return popupSettingsData.value.active && popupSettingsData.value.data.elementId === props.block.id;
    });

    const contextMenu = computed(() => [
      {
        icon: 'delete',
        name: 'Delete',
        isDisabled: false,
        width: 12,
        height: 13
      },
      {
        icon: 'hide',
        name: 'Hide block',
        isDisabled: false,
        width: 24,
        height: 24
      },
      {
        icon: 'moveup',
        name: 'Move Up',
        isDisabled: props.block.sortId === 0,
        width: 13,
        height: 7
      },
      {
        icon: 'movedown',
        name: 'Move Down',
        isDisabled: props.block.sortId === componentLength.value - 1,
        width: 13,
        height: 7
      },
      {
        icon: 'duplicate',
        name: 'Duplicate',
        isDisabled: false,
        width: 12,
        height: 12
      },
      {
        icon: 'rename',
        name: 'Rename',
        isDisabled: false,
        width: 12,
        height: 12
      }
    ]);

    watch(activeShortcut, () => {
      if (Array.isArray(activeShortcut.value.shortcut.desc)) {
        const shortcutIdx = activeShortcut.value.shortcut.desc.findIndex(
          (value: string) => value === 'command+r' || value === 'ctrl+r'
        );
        if (shortcutIdx !== -1) {
          if (blockSelected.value(props.block)) {
            openNameInput();
          }
        }
      }
    });

    watch(activeNameInput, () => {
      setTimeout(() => emit('changeDraggableState', activeNameInput.value));
    });

    const sortedElementsByZindex = computed(() => {
      if (Array.isArray(props.block.elements)) {
        return [...props.block.elements].sort((a, b) => {
          return b.payload.zIndex - a.payload.zIndex;
        });
      } else {
        return [];
      }
    });

    watch(selectedBlocks, () => {
      if (isBlockSelected.value && props.block.elements.length > 0)
        setDisplayCondition({
          id: props.block.id,
          condition: 'layerOpened',
          value: true
        });
    });

    watch(selectedElements, () => {
      if (isChildOfBlockSelected.value(props.block))
        setDisplayCondition({
          id: props.block.id,
          condition: 'layerOpened',
          value: true
        });
    });

    function changeDraggableState(val: boolean) {
      setTimeout(() => emit('changeDraggableState', val));
    }

    function proceedElementClk(e: any) {
      cleanSelectedBlocks();
      proceedElementClick({ element: e, component: 'sidebar' });
    }

    function proceedBlockClk() {
      cleanSelectedElements();
      proceedBlockClick({ block: props.block, component: 'sidebar' });
    }

    function rename() {
      changeBlockParam({
        block: props.block,
        path: `name`,
        value: nameInput.value?.value
      });
      activeNameInput.value = false;
    }

    function openNameInput() {
      activeNameInput.value = true;
      root.$nextTick(() => {
        nameInput.value?.focus();
        nameInput.value?.setSelectionRange(0, nameInput.value?.value.length);
      });
    }

    // может быть пригодится, логика добавления элемента в блок через слой
    function openAddElementPopup() {
      popupSettings({
        active: true,
        header: 'Add Element',
        content: PopupType.AddElement,
        container: PopupContainerType.Small,
        data: {
          list: availableElements.value,
          isNextToSidebar: true
        },
        location: addElemBtn.value?.getBoundingClientRect()
      } as PopupSettings<AddElementPopupData>);
    }

    function openContextPopup() {
      if (!blockSelected.value(props.block)) {
        proceedBlockClick({ block: props.block, component: 'sidebar' });
      }
      popupSettings({
        active: true,
        content: PopupType.Context,
        container: PopupContainerType.SmallContext,
        data: {
          list: contextMenu.value,
          // isNextToSidebar: true,
          // clickedItem: {},
          renameItem: renameItem,
          moveElemDown: moveElemDown,
          moveElemUp: moveElemUp,
          toggleHideElement: toggleHideElement,
          elementId: props.block.id,
          isOnLeftSide: true
        },
        location: contextPopupBtn.value?.getBoundingClientRect()
      } as PopupSettings<ContextPopupData>);
    }

    function renameItem() {
      openNameInput();
    }

    function collapseBody() {
      setDisplayCondition({
        id: props.block.id,
        condition: 'layerOpened',
        value: !isBlockOpened.value
      });
    }

    function layerListChanged(e: any) {
      moveElementByZindex({
        oldIndex: e.moved.oldIndex,
        newIndex: e.moved.newIndex,
        element: sortedElementsByZindex.value[e.moved.oldIndex]
      });
    }

    function changeLayerOrderFromPopup(e: any) {
      layerListChanged(e);
    }

    function toggleHideElement() {
      root.$store.commit('editor/changeBlockStyleData', {
        block: props.block,
        path: 'display',
        data: !isElementHidden.value ? 'none' : ''
      });
    }

    function moveElemDown() {
      const { sortId } = props.block;
      const newIndex = sortId + 1;
      emit('changeOrder', { moved: { oldIndex: sortId, newIndex: newIndex } });
    }

    function moveElemUp() {
      const { sortId } = props.block;
      const newIndex = sortId - 1;
      emit('changeOrder', { moved: { oldIndex: sortId, newIndex: newIndex } });
    }

    function onInputFocus() {
      if (props.isDisableDraggable) openNameInput();
    }

    function onInputBlur() {
      activeNameInput.value = false;
      if (blockName.value !== props.block.name) rename();
    }

    if (isBlockSelected.value || isChildOfBlockSelected.value(props.block) || isBlockOpened.value) {
      setDisplayCondition({
        id: props.block.id,
        condition: 'layerOpened',
        value: true
      });
    }

    return {
      layerHeadClass,
      activeNameInput,
      isBlockOpened,
      layerBodyHeight,
      nameInput,
      addElemBtn,
      nameInputValue,
      contextPopupBtn,
      contextMenu,
      sortedElementsByZindex,
      isElementHidden,
      isPopupOpen,
      blockName,
      iconSize: { width: 24, height: 24 },
      dynamicIconSizes,
      changeLayerOrderFromPopup,
      changeDraggableState,
      proceedElementClk,
      proceedBlockClk,
      rename,
      openNameInput,
      openContextPopup,
      renameItem,
      collapseBody,
      layerListChanged,
      toggleHideElement,
      onInputFocus,
      onInputBlur
    };
  }
});
</script>

<style lang="scss">
.layer-block {
  &__input {
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    color: #000000;
    width: 100%;
    padding: 2px 5px;
    border: 1px solid #318bf5;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    background-color: #ffffff;
    height: 100%;
  }

  &__elements {
    padding: 0 0 0 33px;
  }

  &__head-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  &__head {
    display: flex;
    justify-content: space-between;
    position: relative;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 21px;
    color: #000000;
    width: 100%;
    border-radius: 4px;
    transition: 0.3s ease-in-out;

    .focus_box {
      flex: 0;
      width: 0;
    }

    &:hover {
      background-color: $gray100;
      .layer-block__btns {
        opacity: 1;
      }
    }

    &--selected {
      background-color: rgba(#318bf5, 0.2);
      border-radius: $shape_border_radius;
    }

    & > svg {
      width: 18px;
      height: 18px;
      flex: 0 0 18px;
      margin: 0 5px 0 0;
    }
  }

  &__title {
    font-size: 12px;
    line-height: 16px;
    max-width: 132px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0 auto 0 0;
  }

  &__head-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__btns {
    display: flex;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &__btn {
    transition: background-color 0.2s ease;

    &.active {
      pointer-events: none;
    }

    svg {
      color: $gray600 !important;
      transition: fill 0.2s ease;
    }

    &:hover {
      background-color: $white !important;

      svg {
        color: $black !important;
      }
    }
  }

  &__toggle-icon {
    display: flex;
    position: absolute;
    left: 3px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    z-index: 10;
    transition: 0.3s;

    svg {
      transition: 0.3s ease-in-out;
    }

    &:hover {
      background-color: $gray100;
    }
  }
}
</style>

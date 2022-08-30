<template>
  <div :class="createLayerElementClass(element)" ref="blockElem">
    <div @focus="onInputFocus" tabindex="0"></div>
    <div
      @click.stop.prevent="$emit('elementClick', element)"
      class="layer-element__title"
      :class="{ isShort: isElementHidden || isElementLocked }"
    >
      <svg-icon
        @dblclick.stop.prevent.native="openElementNameInput"
        :name="element.type"
        :width="18"
        :height="18"
        :color="dynamicIconSizes[element.type].color"
      />
      <span @dblclick.stop.prevent="openElementNameInput" v-show="!nameInputActive" v-tooltip="elemName">
        {{ elemName }}
      </span>
      <input
        v-show="nameInputActive"
        ref="inputRef"
        :value="elemName"
        @keypress.enter="renameElement(element)"
        @keydown.esc="cancelEdit"
        @input="inputChange"
        @blur="renameElement(element)"
        class="layer-element__input"
        type="text"
      />
      <div v-show="!nameInputActive" class="layer-element__btns">
        <square-icon-btn
          class="layer-element__btn"
          :class="{ 'layer-element__btn--visible': isElementHidden }"
          @click="toggleHideElement"
          :icon-settings="{ name: !isElementHidden ? 'hide' : 'unhide', ...iconSize }"
          v-tooltip="!isElementHidden ? 'Hide' : 'Unhide'"
        />
        <div ref="btnRef">
          <square-icon-btn
            class="layer-element__btn layer-element__btn--lock"
            :class="{ 'layer-element__btn--visible': isElementLocked }"
            @click="setLockCondition"
            :icon-settings="{ name: !isElementLocked ? 'unlock' : 'lock', ...iconSize }"
            v-tooltip="'Lock'"
          />
          <square-icon-btn
            @click="openContextPopup"
            class="layer-element__btn"
            :class="{ active: isPopupOpen }"
            :icon-settings="{ name: 'dots', ...iconSize }"
            v-tooltip="'Drag / Settings'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useGetters, useMutations } from 'vuex-composition-helpers';
import { computed, ref, watch, defineComponent } from '@vue/composition-api';
import { startCase } from 'lodash';
import Icon from '../../Sidebar/Modal/utils/Icon.vue';
import { ContextPopupData, PopupContainerType, PopupSettings, PopupType } from '../Modal/types';
import { dynamicIconSizes } from '@/constants/dynamicIconSizes';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
import { ElementsTypes } from '@/utils/types/EditorElements';

function cleanString(string: string) {
  return string.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, '');
}

export default defineComponent({
  name: 'AtapBlockElements',
  components: {
    SquareIconBtn,
    Icon
  },
  props: {
    element: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true,
      default: 0
    },
    block: {
      type: Object,
      required: true
    },
    isDisableDraggable: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const nameInputActive = ref(false);
    const inputRef = ref(null as null | HTMLInputElement);
    const btnRef = ref(null as null | any);
    const blockElem = ref(null as null | any);
    const contextMenu = ref([
      {
        icon: 'delete',
        name: 'Delete',
        isDisabled: false,
        width: 12,
        height: 13
      },
      {
        icon: 'hide',
        name: 'Hide element',
        isDisabled: false,
        width: 24,
        height: 24
      },
      {
        icon: 'moveup',
        name: 'Move Up',
        isDisabled: false,
        width: 13,
        height: 7
      },
      {
        icon: 'movedown',
        name: 'Move Down',
        isDisabled: false,
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
    const previewMode = computed(() => root.$store.state.editor.previewMode);
    const isTextElement = computed(() => props.element.type === ElementsTypes.TEXT);
    const textElementContent = computed(() => {
      const { name } = props.element;
      if (!isTextElement) return name;
      const { isContentChanged, content } = props.element.payload;
      if (typeof isContentChanged === 'undefined') return name;
      return isContentChanged ? name : cleanString(content);
    });
    const elemName = computed({
      get() {
        return isTextElement ? textElementContent.value : props.element.name;
      },
      set() {}
    });
    const isElementHidden = computed(() => {
      return props.element.styles[previewMode.value].display == 'none';
    });
    const isElementLocked = computed(() => props.element.payload?.isLocked);

    const { activeShortcut, elementSelected } = useGetters({
      activeShortcut: 'shortcut/activeShortcut',
      elementSelected: 'editor/elementSelected'
    } as any);

    const { changeElementParam, popupSettings, changeElementPayload } = useMutations({
      changeElementParam: 'editor/changeElementParam',
      changeElementPayload: 'editor/changeElementPayload',
      popupSettings: 'editor/SET_POPUP_SETTINGS'
    } as any);

    const popupSettingsData = computed(() => root.$store.state.editor.popupSettings);

    const isPopupOpen = computed(() => {
      return popupSettingsData.value.active && popupSettingsData.value.data.elementId === props.element.id;
    });

    function inputChange(val: any) {
      elemName.value = val.target.value;
    }

    function cancelEdit() {
      nameInputActive.value = false;
      elemName.value = props.element.name;
    }

    function openElementNameInput() {
      nameInputActive.value = true;
      root.$nextTick(() => {
        inputRef.value?.focus();
        inputRef.value?.setSelectionRange(0, inputRef.value?.value.length);
      });
    }

    function initiateBlockElementEdit() {
      if (elementSelected.value(props.element)) {
        openElementNameInput();
      }
    }

    function renameElement(el: any) {
      if (!inputRef.value) return;
      if (inputRef.value.value !== elemName.value) {
        if (el.type === ElementsTypes.TEXT && !el.payload.isContentChanged) {
          changeElementPayload({
            id: el.id,
            path: 'isContentChanged',
            value: true,
            isSaveHistory: false
          });
        }
        changeElementParam({
          element: el,
          path: 'name',
          value: inputRef.value.value
        });
      }
      nameInputActive.value = false;
    }

    function createLayerElementClass(el: any) {
      return {
        'layer-element': true,
        'layer-element--selected': elementSelected.value(el) || nameInputActive.value,
        'layer-element--hidden': isElementHidden.value
      };
    }

    function moveElemDown() {
      const newIndex = props.index + 1;
      emit('changeOrder', { moved: { oldIndex: props.index, newIndex } });
    }

    function moveElemUp() {
      const newIndex = props.index - 1;
      emit('changeOrder', { moved: { oldIndex: props.index, newIndex } });
    }

    function toggleHideElement() {
      let displayType = 'block';
      switch (props.element.type) {
        case 'button':
          displayType = 'flex';
          break;
        case 'form':
          displayType = 'grid';
          break;
      }
      root.$store.commit('editor/changeComponentStyle', {
        component: props.element,
        data: { display: !isElementHidden.value ? 'none' : displayType }
      });
    }

    function setLockCondition() {
      root.$store.commit('editor/changeElementPayload', {
        id: props.element.id,
        path: 'isLocked',
        value: !props.element.payload?.isLocked
      });
    }

    function onInputFocus() {
      if (props.isDisableDraggable) openElementNameInput();
    }

    function openContextPopup() {
      popupSettings({
        active: true,
        content: PopupType.Context,
        container: PopupContainerType.SmallContext,
        location: btnRef.value?.getBoundingClientRect(),
        data: {
          list: contextMenu.value,
          isOnLeftSide: true,
          renameItem: openElementNameInput,
          toggleHideElement: toggleHideElement,
          moveElemDown: moveElemDown,
          moveElemUp: moveElemUp,
          elementId: props.element.id
        }
      } as PopupSettings<ContextPopupData>);
    }

    watch(activeShortcut, () => {
      if (activeShortcut.value) {
        if (Array.isArray(activeShortcut.value.shortcut.desc)) {
          const shortcutIdx = activeShortcut.value.shortcut.desc.findIndex(
            (value: any) => value === 'command+r' || value === 'ctrl+r'
          );
          if (shortcutIdx !== -1) {
            initiateBlockElementEdit();
          }
        }
      }
    });

    watch(nameInputActive, () => {
      setTimeout(() => emit('changeDraggableState', nameInputActive.value));
    });

    return {
      nameInputActive,
      inputRef,
      btnRef,
      blockElem,
      startCase,
      isElementHidden,
      elemName,
      isPopupOpen,
      isElementLocked,
      dynamicIconSizes,
      iconSize: { width: 24, height: 24 },
      renameElement,
      inputChange,
      cancelEdit,
      createLayerElementClass,
      openContextPopup,
      toggleHideElement,
      openElementNameInput,
      setLockCondition,
      onInputFocus
    };
  }
});
</script>

<style lang="scss">
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.layers-type {
  .block_separator__line {
    position: absolute;
    bottom: 0;
  }
}

.layer-element {
  padding: 4px;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  color: #000000;
  border-radius: 4px;
  transition: 0.3s;
  margin: 2px 0 0;
  height: 32px;

  &.sortable-chosen {
    transition: 0s;
  }

  &--hidden {
    opacity: 0.4;
  }

  &__input {
    height: 24px;
    font-size: 12px;
    line-height: 14px;
    color: #000000;
    margin: 0;
    padding: 2px 5px;
    border: 1px solid #318bf5;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    background-color: #ffffff;
    width: calc(100% - 29px);
    flex: 0 0 calc(100% - 29px);
  }

  &__title {
    display: flex;
    align-items: center;
    border-radius: $shape_border_radius;
    position: relative;
    font-size: 12px;
    line-height: 14px;
    color: #000000;
    height: 100%;

    span {
      width: 202px;
      display: block;
      font-size: 12px;
      line-height: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      transition: 0.3s;
    }

    & > svg {
      width: 18px;
      height: 18px;
      flex: 0 0 18px;
      margin: 0 5px 0 0;
    }

    &.isShort span {
      width: 93px;
    }
  }

  &__btns {
    position: absolute;
    right: 1px;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 72px;
    height: 24px;
    transition: 0.3s ease;
    display: flex;

    div {
      display: flex;
    }
  }

  &__btn {
    transition: 0.2s ease;
    opacity: 0;

    svg {
      transition: 0.3s;
      color: $gray600 !important;
    }

    &.active {
      pointer-events: none;
    }

    &--visible {
      opacity: 1;
    }

    &:hover {
      background: $white !important;

      svg {
        color: $black !important;
      }
    }
  }

  &__btn--lock {
    &.layer-element__btn--visible {
      svg {
        color: $black !important;
      }
    }
  }

  &:hover {
    background-color: $gray100;
    opacity: 1;

    .layer-element__btn {
      opacity: 1;
    }

    .layer-element__title span {
      width: 93px;
    }
  }

  &--selected {
    background-color: $gray100 !important;
  }

  &.sortable-ghost {
    position: relative;
    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #e8e8e8;
      z-index: 100;
      border-radius: $shape_border_radius;
    }
  }
}
</style>

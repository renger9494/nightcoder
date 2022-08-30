<template>
  <div class="layers-type">
    <draggable
      :animation="100"
      :value="blocksSortedBySortId"
      :options="{ disabled: isDisableDraggable }"
      @change="layerListChanged"
    >
      <div v-for="(block, i) in blocksSortedBySortId" :key="i" class="layer-block">
        <layer-block
          :block="block"
          :isDisableDraggable="isDisableDraggable"
          @changeDraggableState="changeDraggableState"
          @changeOrder="changeLayerOrderFromPopup"
        />
      </div>
    </draggable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations, mapState } from 'vuex';
import Draggable from 'vuedraggable';
import { move } from '../../../../helpers/array';
import LayerBlock from './LayerBlock.vue';
import { InsertBlockPopupData, PopupContainerType, PopupSettings, PopupType } from '../Modal/types';

export default Vue.extend({
  components: { Draggable, LayerBlock },
  data: () => ({
    addBlockInputActive: false,
    newBlockName: 'Empty block',
    activeInsertAfterButtonClass: undefined,
    isDisableDraggable: false
  }),
  computed: {
    ...mapGetters({
      createNewBlockConfig: 'editor/createNewBlockConfig',
      activeShortcut: 'shortcut/activeShortcut',
      blockSelected: 'editor/blockSelected',
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    }),
    ...mapState({
      userConfig: (state: any) => state.editor.userConfig,
      editorHistory: (state: any) => state,
      availableElements: (state: any) => state.editor.availableElements,
      selectedBlocks: (state: any) => state.editor.selectedBlocks,
      selectedElements: (state: any) => state.editor.selectedElements,
      registeredShortcuts: (state: any) => state.shortcut.registeredShortcuts,
      isAdmin: (state: any) => state.auth.user.isAdmin
    })
  },
  methods: {
    ...mapMutations({
      insertBlockToConfig: 'editor/insertBlockToConfig',
      changeBlockParam: 'editor/changeBlockParam',
      setMarkOnActiveShct: 'shortcut/setMarkOnActiveShct',
      addBlockIntoSelected: 'editor/addBlockIntoSelected',
      cleanSelectedBlocks: 'editor/cleanSelectedBlocks',
      removeBlockFromConfig: 'editor/removeBlock',
      removeElement: 'editor/removeElement',
      changeEditorParam: 'editor/changeEditorParam'
    }),
    layerListChanged(e: any) {
      const draggedArray = move(this.blocksSortedBySortId, e.moved.oldIndex, e.moved.newIndex);
      let id = 0;
      draggedArray.forEach(block => {
        this.changeBlockParam({
          block: block,
          path: `sortId`,
          value: id++
        });
      });
    },
    changeLayerOrderFromPopup(e: any) {
      this.layerListChanged(e);
    },
    openPopup(insertAfter: number) {
      const popupSettings: PopupSettings<InsertBlockPopupData> = {
        active: true,
        closeButton: true,
        header: ' ',
        content: PopupType.InsertBlock,
        container: PopupContainerType.Flex,
        data: {
          insertAfter
        }
      };
      this.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings);
    },
    changeDraggableState(val: any) {
      setTimeout(() => this.isDisableDraggable = val);
    }
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
.block-separator {
  height: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__add-button {
    margin-top: -9px;
    margin-bottom: -9px;
  }

  &__line {
    width: 90%;
    border: 0.5px dashed #bdbdbd;
  }
}

.layers-type {
  overflow: hidden;
  transition: 0.3s;
  &--hidden {
    opacity: 0.4;
    &:hover {
      opacity: 1;
    }
    .layer-block__btns {
      opacity: 1;
    }
  }

  &--selected {
    background-color: rgba($gray100, 0.5);
    border-radius: 4px;
    .layer-block__head {
      background-color: $gray100;
    }
    .layer-element {
      &:hover {
        background-color: $gray100;
      }
    }
  }

  &--opened {
    .layer-block__toggle-icon svg {
      transform: rotate(90deg);
    }
  }

  &--opened,
  &--selected {
    .layer-block__toggle-icon {
      &:hover {
        background: $white !important;
      }
    }
  }

  &__body {
    transition: 0.3s ease-in-out;
    overflow: hidden;
    padding: 0 0 0 8px;
  }

  &__input {
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 21px;
    color: #000000;
    padding: 8px 5px;
    border: 1px solid #318bf5;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
  }

  &__button {
    cursor: pointer;
    color: grey;
    font-size: 18px;
    line-height: 39px;
  }
}

.layer-block {
  &:not(:last-child) {
    margin: 0 0 2px;
  }
  &__head {
    display: flex;
    align-items: center;
    position: relative;
    padding: 4px 6px 4px 30px;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 21px;
    color: $black;
    height: 32px;
    border: 1px solid transparent;

    &:hover {
      .layer-block__btns {
        opacity: 1;
      }
    }
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
    width: 24px;
    height: 24px;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    svg path {
      fill: #949cad;
      transition: fill 0.2s ease;
    }

    &:hover {
      background-color: $white;

      svg path {
        fill: #000;
      }
    }
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

  &.sortable-chosen {
    .layer-block__head {
      transition: 0s;
      transition-delay: 0.1s;
      background: $white;
      border: 1px solid $gray100;
    }
  }
}
</style>

<template>
  <div class="block-action-menu" :style="`transform: scale(${1 / zoom});`" v-if="isEditorMode">
    <div
      @click="openBlockPopup"
      class="block-action-menu__btn"
      v-tooltip="'Add new block after'"
    >
      <svg-icon name="add" width="24" height="24" color="#BDBDBD" />
    </div>
    <div
      @click="openPopup"
      ref="popupButton"
      class="block-action-menu__btn"
      v-tooltip="'Block settings'"
    >
      <svg-icon name="dots" width="24" height="24" color="#BDBDBD" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  BlockPopupData,
  ContextPopupData,
  PopupContainerType,
  PopupSettings,
  PopupType
} from '../../Sidebar/Modal/types';
import { move } from "@/helpers/array";
import { mapGetters, mapMutations, mapState } from "vuex";
import { IBlocksData } from '@/components/Editor/Sidebar/Modal/components/AddNewBlockOrElementPopup/types';

export default Vue.extend({
  name: 'BlockActionMenu',
  props: {
    block: {
      type: Object,
      required: true
    },
    sortId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      scrollElement: null as null | Element
    }
  },
  computed: {
    ...mapState({
      userConfig: (state: any) => state.editor.userConfig,
      previewMode: (state: any) => state.editor.previewMode,
      blockCategories: (state: any) => <Array<IBlocksData>>state.editor.blockCategories
    }),
    ...mapGetters({
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    }),
    contextMenu(): Array<any> {
      return [
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
          width: 12,
          height: 8
        },
        {
          icon: 'moveup',
          name: 'Move Up',
          isDisabled: this.block.sortId === 0,
          width: 13,
          height: 7
        },
        {
          icon: 'movedown',
          name: 'Move Down',
          isDisabled: this.block.sortId === this.blocksSortedBySortId.length - 1,
          width: 13,
          height: 7
        },
        {
          icon: 'duplicate',
          name: 'Duplicate',
          isDisabled: false,
          width: 12,
          height: 12
        }
        // {
        //   icon: 'rename',
        //   name: 'Rename',
        //   isDisabled: true,
        //   width: 12,
        //   height: 12
        // }
      ]
    },
    zoom(): number {
      if (process.env.VUE_APP_IS_TEMP_EDITOR) {
        return this.$store.state.editor.zoom;
      }
      return 1;
    },
    isEditorMode(): boolean {
      return process.env.VUE_APP_IS_TEMP_EDITOR && this.$route.name !== 'preview';
    },
    availableElements(): any[] {
      if (process.env.VUE_APP_IS_TEMP_EDITOR) {
        return this.$store.state.editor.availableElements;
      }
      return [];
    },
  },
  mounted() {
    this.scrollElement = document.querySelector('.template_wrapper');
    this.scrollElement?.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    this.scrollElement?.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    ...mapMutations({
      changeBlockParam: 'editor/changeBlockParam',
      setPopupSettings: 'editor/SET_POPUP_SETTINGS',
      changeNewBlockSortId: 'ui/changeNewBlockSortId'
    }),
    openPopup() {
      const popupSettings = {
        active: true,
        content: PopupType.Context,
        container: PopupContainerType.SmallContext,
        location: (<any>this.$refs.popupButton)?.getBoundingClientRect(),
        data: {
          list: this.contextMenu,
          // isNextToSidebar: true,
          // clickedItem: {},
          renameItem: this.onScroll,
          moveElemDown: this.moveElemDown,
          moveElemUp: this.moveElemUp,
          toggleHideElement: this.toggleHideElement,
          elementId: this.block.id,
          isOnLeftSide: true
        }
      };
      this.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings as PopupSettings<ContextPopupData>);
    },
    onScroll() {
      this.$store.commit('editor/SET_POPUP_SETTINGS', {active: false});
    },
    moveElemDown() {
      const { sortId } = this.block;
      const newIndex = sortId + 1;
      this.layerListChanged({ moved: { oldIndex: sortId, newIndex: newIndex } })
    },
    moveElemUp() {
      const { sortId } = this.block;
      const newIndex = sortId - 1;
      this.layerListChanged({ moved: { oldIndex: sortId, newIndex: newIndex } })
    },
    layerListChanged(e: any) {
      const draggedArray = move(this.blocksSortedBySortId, e.moved.oldIndex, e.moved.newIndex);
      let x = 0, l = draggedArray.length;
      while (x < l) {
        this.changeBlockParam({
          block: draggedArray[x],
          path: `sortId`,
          value: x++
        });
      }
    },
    toggleHideElement() {
      const isElementHidden = this.block.styles[this.previewMode].display === 'none';
      this.$store.commit('editor/changeBlockStyleData', {
        block: this.block,
        path: 'display',
        data: !isElementHidden ? 'none' : ''
      });
    },
    openBlockPopup() {
      const blockPopup = document.querySelector('#block-collection-btn');
      if(!blockPopup) return
      this.changeNewBlockSortId(this.sortId);
      const popupSettings: PopupSettings<BlockPopupData> = {
        active: true,
        content: PopupType.BlockCollection,
        container: PopupContainerType.LargePaddings,
        header: 'Choose your awesome block',
        closeButton: true,
        location: blockPopup.getBoundingClientRect(),
        data: {
          isNextToSidebar: false,
          isOnLeftSide: true,
          blockCategories: this.blockCategories
        }
      };
      this.setPopupSettings(popupSettings);
    },
  }
});
</script>

<style lang="scss">
.block-action-menu {
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  position: absolute;
  left: -55px;
  top: 0;
  background: $white;
  transform-origin: calc(100% + 1px) 0;
  display: flex;
  gap: 1px;

  &:after {
    content: '';
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    margin: auto;
    height: 100%;
    width: 1px;
    background: $gray100;
  }

  &__btn {
    width: 26px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    svg {
      transition: 0.3s;
    }

    &:hover svg {
      color: $black!important;
    }
  }
}
</style>

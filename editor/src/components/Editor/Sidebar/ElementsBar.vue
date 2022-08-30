<template>
  <aside class="elements-bar">
    <ul class="elements-bar__list">
      <li class="elements-bar__list elements-bar__list--block" @click="openBlockPopup" v-tooltip="'Library of blocks'">
        <square-icon-btn
          id="block-collection-btn"
          ref="blockPopup"
          :icon-settings="{
            name: 'block',
            width: dynamicIconSizes.block.width,
            height: dynamicIconSizes.block.height
          }"
          :size="btnSize"
          :is-active="isActiveBlockPopup"
        />
      </li>
      <li
        v-for="(element, index) in availableElements"
        :key="index"
        class="elements-bar__list elements-bar-item"
        @click="addElement(element)"
        v-tooltip="tooltip[element.name.toLowerCase()]"
      >
        <square-icon-btn
          :icon-settings="{
            name: element.name.toLowerCase(),
            width: dynamicIconSizes[element.name.toLowerCase()].width,
            height: dynamicIconSizes[element.name.toLowerCase()].height
          }"
          :size="btnSize"
        />
      </li>
      <li class="elements-bar__list" @click="openEmbedPopup" v-tooltip="{ text: 'Embed code', highlite: 'E' }">
        <square-icon-btn
          ref="embedPopup"
          :icon-settings="{
            name: 'embed',
            width: dynamicIconSizes.embed.width,
            height: dynamicIconSizes.embed.height
          }"
          :size="btnSize"
          :is-active="isActiveIframePopup"
        />
      </li>
      <li class="elements-bar__list" @click="openShapePopup" v-tooltip="'Shape'">
        <square-icon-btn
          ref="popupButton"
          :icon-settings="{
            name: 'shape',
            width: dynamicIconSizes.shape.width,
            height: dynamicIconSizes.shape.height
          }"
          :size="btnSize"
        />
      </li>
    </ul>
    <square-icon-btn
      class="layers-btn"
      v-tooltip="'Layers'"
      @click="toggleLayersPopup"
      :icon-settings="{ name: 'layer-icon', width: 24, height: 24 }"
      :size="btnSize"
      :is-active="isPopupOpen"
    />
    <transition name="popup-layer" mode="out-in">
      <layers-popup v-if="isPopupOpen" class="elements-bar__popup" @close="toggleLayersPopup" />
    </transition>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { dynamicIconSizes } from '@/constants/dynamicIconSizes';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
import {
  BasePopupData,
  BlockPopupData,
  EmbedPopupData,
  PopupContainerType,
  PopupSettings,
  PopupType,
  ShapePopupData
} from '@/components/Editor/Sidebar/Modal/types';
import apiClient from '@/utils/apiClient';
import { IBlocksData } from '@/components/Editor/Sidebar/Modal/components/AddNewBlockOrElementPopup/types';
import LayersPopup from '@/components/Editor/Sidebar/LayersPopup.vue';

export default Vue.extend({
  name: 'ElementsBar',
  components: { LayersPopup, SquareIconBtn },
  data() {
    return {
      dynamicIconSizes,
      btnSize: {
        width: 36,
        height: 36
      },
      isPopupOpen: false
    };
  },
  computed: {
    ...mapState({
      availableElements: (state: any) => state.editor.availableElements,
      userConfig: (state: any) => state.editor.userConfig,
      popupSettings: (state: any) => <PopupSettings<BasePopupData>>state.editor.popupSettings,
      blockCategories: (state: any) => <Array<IBlocksData>>state.editor.blockCategories
    }),
    ...mapGetters({
      blockInViewPortId: 'editor/blockInViewPortId',
      createNewBlockConfig: 'editor/createNewBlockConfig',
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    }),
    isActiveBlockPopup(): boolean {
      return this.popupSettings.active && this.popupSettings.content === PopupType.BlockCollection;
    },
    isActiveIframePopup(): boolean {
      return this.popupSettings.active && this.popupSettings.content === PopupType.Embed;
    },
    isIOS(): boolean {
      return navigator.appVersion.indexOf('Mac') !== -1;
    },
    tooltip(): any {
      return {
        text: { text: 'Text', highlite: 'T' },
        image: { text: 'Image', highlite: 'I' },
        icon: { text: 'Icon', highlite: this.isIOS ? 'Cmd+I' : 'Ctrl+I' },
        button: { text: 'Button', highlite: 'B' },
        form: { text: 'Form', highlite: 'F' },
        video: { text: 'Video', highlite: 'V' }
      };
    }
  },
  mounted() {
    this.fetchBlocksByCategories()
  },
  methods: {
    ...mapActions({
      proceedElementClick: 'editor/proceedElementClick',
      createElement: 'editor/createElement',
      fetchBlocksByCategories: 'editor/fetchBlocksByCategories'
    }),
    ...mapMutations({
      insertBlockToConfig: 'editor/insertBlockToConfig',
      changeBlockToViewId: 'editor/changeBlockToViewId',
      setPopupSettings: 'editor/SET_POPUP_SETTINGS'
    }),
    addBlock() {
      const newBlockConfig = this.createNewBlockConfig({
        insertAfter: this.blocksSortedBySortId[this.blocksSortedBySortId.length - 1]?.sortId ?? 0,
        name: 'Empty Block'
      });

      this.insertBlockToConfig({ blockConfig: newBlockConfig });
      this.changeBlockToViewId(newBlockConfig.id);
    },
    addElement(element: any, payload: any = {}) {
      const blockInViewPort = document.querySelector(`#${this.blockInViewPortId}`);
      const coords = {
        x: blockInViewPort ? (blockInViewPort as HTMLElement).offsetWidth / 2 : 0,
        y: blockInViewPort ? (blockInViewPort as HTMLElement).offsetHeight / 2 : 0
      };
      this.createElement({
        element: element.name.toLowerCase(),
        block: this.userConfig.allComponents[this.blockInViewPortId],
        coords,
        payload
      }).then(element => {
        this.proceedElementClick({ element });
      });
    },
    openShapePopup() {
      const popupSettings = {
        active: true,
        content: PopupType.Shape,
        container: PopupContainerType.LargePaddings,
        header: 'Choose a shape',
        closeButton: true,
        location: ((this.$refs.popupButton as Vue).$el as HTMLElement)?.getBoundingClientRect(),
        data: {
          isUnderHeader: false,
          isNextToSidebar: false,
          isOnLeftSide: true,
          shapeList: [
            {
              title: 'Rectangle',
              shortCut: 'R'
            },
            {
              title: 'Circle',
              shortCut: 'O'
            }
          ]
        }
      };
      this.setPopupSettings(popupSettings as PopupSettings<ShapePopupData>);
    },
    openBlockPopup() {
      const popupSettings = {
        active: true,
        content: PopupType.BlockCollection,
        container: PopupContainerType.LargePaddings,
        header: 'Choose your awesome block',
        closeButton: true,
        location: ((this.$refs.blockPopup as Vue).$el as HTMLElement)?.getBoundingClientRect(),
        data: {
          isNextToSidebar: false,
          isOnLeftSide: true,
          blockCategories: this.blockCategories
        }
      };
      this.setPopupSettings(popupSettings as PopupSettings<BlockPopupData>);
    },
    openEmbedPopup() {
      const popupSettings = {
        active: true,
        content: PopupType.Embed,
        container: PopupContainerType.LargePaddings,
        header: 'Embed Code',
        closeButton: true,
        location: ((this.$refs.embedPopup as Vue).$el as HTMLElement)?.getBoundingClientRect(),
        data: {
          isUnderHeader: false,
          isNextToSidebar: false,
          isOnLeftSide: true,
          setEmbedType: this.addEmbedElement
        }
      };
      this.setPopupSettings(popupSettings as PopupSettings<EmbedPopupData>);
    },
    addEmbedElement({ type, code }: any) {
      this.addElement({ name: 'Embed' }, { type, code });
      this.setPopupSettings({ active: false });
    },
    toggleLayersPopup() {
      this.isPopupOpen = !this.isPopupOpen;
    }
  }
});
</script>

<style lang="scss" scoped>
.elements-bar {
  max-height: calc(100vh - 61px);
  height: 100%;
  position: relative;
  z-index: 100;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  max-width: 52px;
  width: 100%;
  background: $white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: $padding_l 0;
  &__list {
    list-style: none;
    margin: 0 0 $margin_l;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__popup {
    position: absolute;
    top: 15px;
    right: -15px;
    transform: translateX(100%);
    background: $white;
    width: 260px;
    height: 100%;
    max-height: calc(100vh - 90px);
    box-sizing: content-box;
  }

  .sidebar-popup-container-large-paddings {
    max-height: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px 20px;
  }

  .sidebar-popup-header {
    position: relative;
    padding: 0 0 14px;

    &::after {
      content: '';
      position: absolute;
      left: -20px;
      bottom: 0;
      width: calc(100% + 40px);
      height: 1px;
      background: $gray100;
    }
  }
}
</style>

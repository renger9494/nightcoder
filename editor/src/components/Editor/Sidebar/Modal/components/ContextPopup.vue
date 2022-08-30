<template>
  <ul class="sidebar-popup-list">
    <li
      v-for="(el, i) in popupSettings.data.list"
      :class="[
        'sidebar-popup-list-item sidebar-popup-contextmenu-item',
        {
          'sidebar-popup-list-item_not-important': el.isNotImportantSection,
          'sidebar-popup-list-item_disabled': el.isDisabled
        }
      ]"
      :key="`contextPopup_item_${i}`"
      @click="onClick(el)"
    >
      <div class="sidebar-popup-list-icon">
        <svg-icon
          v-if="i !== 1"
          :name="el.icon"
          :width="el.width"
          :height="el.height"
          color="#333"
        />

        <svg-icon
          v-if="i === 1 && !isElementHidden"
          name="hide"
          width="24"
          height="24"
          color="#333"
        />

        <svg-icon
          v-if="i === 1 && isElementHidden"
          name="unhide"
          width="24"
          height="24"
          color="#333"
        />
      </div>

      <h4 v-if="i !== 1">
        {{ el.name }}
      </h4>
      <h4 v-if="i === 1">
        {{ !isElementHidden ? el.name : 'Unhide' }}
      </h4>
    </li>
    <li
      v-if="element.name"
      class="sidebar-popup-list-item sidebar-popup-contextmenu-item sidebar-popup-list-item_not-important"
      v-tooltip="element.name"
    >
      <h4>{{ element.name }}</h4>
    </li>
    <li
      class="
        sidebar-popup-list-item
        sidebar-popup-list-item_id
        sidebar-popup-contextmenu-item
      "
    >
      <h4>ID</h4>
      <h4>{{ id }}</h4>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { ContextPopupData, PopupSettings } from '../types';

export default Vue.extend({
  name: 'ContextPopup',
  data: () => ({}),
  mounted() {},
  computed: {
    ...mapGetters({
      createNewBlockConfig: 'editor/createNewBlockConfig'
    }),
    ...mapState({
      selectedBlocks: (state: any) => state.editor.selectedBlocks,
      selectedElements: (state: any) => state.editor.selectedElements,
      popupSettings: (state: any) => <PopupSettings<ContextPopupData>>state.editor.popupSettings,
      previewMode: (state: any) => state.editor.previewMode,
      allComponents: (state: any) => state.editor.userConfig.allComponents,
      userConfig: (state: any) => state.editor.userConfig
    }),
    element(): any {
      return this.allComponents[this.popupSettings.data.elementId];
    },
    isElementHidden(): boolean {
      return this.element?.styles[this.previewMode].display === 'none';
    },
    id(): string {
      return this.popupSettings.data.elementId;
    }
  },
  methods: {
    ...mapMutations({
      removeBlockFromConfig: 'editor/removeBlock',
      removeElement: 'editor/removeElement',
      setPopupSettings: 'editor/SET_POPUP_SETTINGS',
      duplicateElements: 'editor/duplicateElements',
      duplicateBlock: 'editor/duplicateBlock',
      insertBlockToConfig: 'editor/insertBlockToConfig',
      changeBlockToViewId: 'editor/changeBlockToViewId'
    }),
    onClick(el: any) {
      if (el.name === 'Delete') {
        if (this.selectedElements.length > 0) {
          this.removeElement(this.selectedElements[0].element);
          return;
        }
        if (this.selectedBlocks.length >= this.userConfig.components.length) {
          this.removeBlockFromConfig({});
          this.createEmptyBlock();
          return;
        }
        this.removeBlockFromConfig({});
        this.setPopupSettings({ active: false });
      } else if (el.name === 'Move Up') {
        this.popupSettings.data.moveElemUp();
      } else if (el.name === 'Move Down') {
        this.popupSettings.data.moveElemDown();
      } else if (el.name === 'Rename') {
        this.popupSettings.data.renameItem();
      } else if (el.name === 'Duplicate') {
        this.duplicateElementOrBlock();
      } else if (el.name === 'Hide block' || el.name === 'Hide element') {
        this.popupSettings.data.toggleHideElement();
      }
      this.setPopupSettings({ active: false });
    },
    duplicateElementOrBlock() {
      if (this.selectedBlocks.length === 0) {
        this.duplicateElements({
          type: 'duplicate',
          elements: this.selectedElements.map((element: any) => element.element)
        });
      } else this.selectedBlocks.forEach((blk: any) => this.duplicateBlock(blk));
    },
    createEmptyBlock() {
      const newBlockConfig = this.createNewBlockConfig({
        insertAfter: -1,
        name: 'Empty Block'
      });

      this.insertBlockToConfig({
        blockConfig: newBlockConfig
      });
      this.changeBlockToViewId(newBlockConfig.id);
    }
  }
});
</script>

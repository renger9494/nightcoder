<template>
  <div class="block-sidebar">
    <head-section :value="block" :is-link="false" />

    <div v-if="isAdmin" class="sidebar-block blocks-lib">
      <button @click="openPopup" ref="popupButton" class="blocks-lib__btn" :class="{ active: isPopupOpen }">
        <svg-icon name="folder-icon" width="24" height="24" color="#000" />
        <span>{{ isBlockSaved ? 'Edit block' : 'Save block' }}</span>
      </button>
    </div>

    <div v-if="isAdmin" class="sidebar-block blocks-lib">
      <button @click="openFigmaToBlock" ref="figmaBtn" class="blocks-lib__btn" :class="{ active: isPopupOpen }">
        <svg-icon name="folder-icon" width="24" height="24" color="#000" />
        <span>Add block from Figma</span>
      </button>
    </div>

    <div class="sidebar-block">
      <div class="sidebar-block__head">
        <p class="sidebar-block__title">Block height</p>
      </div>

      <div class="sidebar-block__row sidebar-block__row--gutter-l">
        <div class="sidebar-block__item sidebar-block__item--s params-switch">
          <span :class="isFixed ? 'active' : ''" class="params-switch__item" v-tooltip="'Block height'">
            <svg-icon name="fixed-height-icon" width="6" height="13" color="#000" />
          </span>
        </div>

        <div class="sidebar-block__item block-sidebar__field">
          <input
            ref="heightInput"
            v-model="inputValue"
            :disabled="isViewHeight"
            @focus="heightInput.select()"
            class="block-sidebar__field-input"
            max="9999"
            min="0"
            type="number"
            @keydown.shift.38.exact="onKeydown($event, 10)"
            @keydown.shift.40.exact="onKeydown($event, 10)"
            @keydown.exact="onKeydown($event, 1)"
            @keydown.esc.exact="cancelValueChange"
            @keydown.enter.exact="setHeightInputVal"
            @blur="setHeightInputVal"
          />
          <span class="block-sidebar__field-prefix">{{ isViewHeight ? '%' : 'px' }}</span>
        </div>
      </div>

      <div class="sidebar-block__row">
        <checkbox
          class="sidebar-block__item"
          :input-value="clipOverflow"
          @change="changeClipOverflow"
          text="Clip content"
        />
      </div>
    </div>

    <image-section :value="block" :elementType="'block'" :block="blockName" />

    <background-color-section :value="block" header="Background color" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import {PopupSettings, AddBlockPopupData, PopupType, PopupContainerType, BasePopupData} from '../Modal/types';
import HTMLElementEvent from '@/utils/types/HTMLElementEvent';
import { dynamicIconSizes } from '@/constants/dynamicIconSizes';
import BackgroundColorSection from '@/components/Editor/Sidebar/DesignType/Sections/Color/BackgroundColor.vue';
import ImageSection from '@/components/Editor/Sidebar/DesignType/Sections/Image/Image.vue';
import Checkbox from '@/components/Shared/ui/Сheckbox.vue';
import HeadSection from '@/components/Editor/Sidebar/DesignType/Sections/Head.vue';

export default Vue.extend({
  name: 'Block',
  components: {
    Checkbox,
    HeadSection,
    BackgroundColorSection,
    ImageSection
  },
  props: {
    blockName: {
      type: [Number, String],
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isChecked: false,
      dynamicIconSizes
    };
  },
  computed: {
    ...mapState({
      userConfig: (state: any) => state.editor.userConfig,
      previewMode: (state: any) => state.editor.previewMode,
      selectedBlocks: (state: any) => state.editor.selectedBlocks,
      availableElements: (state: any) => state.editor.availableElements,
      elementTypes: (state: any) => state.elementTypes.elementTypes,
      isAdmin: (state: any) => state.auth.user?.isAdmin,
      popupSettings: (state: any) => state.editor.popupSettings
    }),
    isBlockSaved(): boolean {
      return this.blockId != -1;
    },
    block(): any {
      return this.selectedBlocks[0];
    },
    isViewHeight(): boolean {
      return this.block.styles[this.previewMode].heightType === 'vh';
    },
    inputValue(): string {
      return this.formatHeightValue(this.block.styles[this.previewMode].height);
    },
    clipOverflow(): boolean {
      return this.block.styles[this.previewMode]?.overflow === 'hidden';
    },
    isPopupOpen(): boolean {
      return this.popupSettings.active && this.popupSettings.content === PopupType.AddBlock;
    },
    heightInput(): HTMLInputElement {
      return <HTMLInputElement>this.$refs.heightInput;
    },
    isFixed(): boolean {
      return this.block.styles[this.previewMode].heightType === 'fixed';
    },
    blockId(): number {
      return this.block.dbId;
    }
  },
  methods: {
    openPopup() {
      //for editing separatly in editor
      const { googleFonts } = this.userConfig;
      const popupSettings: PopupSettings<AddBlockPopupData> = {
        active: true,
        closeButton: true,
        header: this.isBlockSaved ? `Update block #${this.blockId}` : 'Add block',
        content: PopupType.AddBlock,
        container: PopupContainerType.Large,
        location: (<HTMLDivElement>this.$refs.popupButton).getBoundingClientRect(),
        data: {
          isUnderHeader: false,
          isNextToSidebar: true,
          isOnLeftSide: false,
          googleFonts,
          blockConfig: this.block
        }
      };
      this.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings);
    },
    openFigmaToBlock() {
      const popupSettings: PopupSettings<BasePopupData> = {
        active: true,
        closeButton: true,
        header: 'Import Figma design to block collection',
        content: PopupType.FigmaToBlock,
        container: PopupContainerType.Large,
        location: (<HTMLDivElement>this.$refs.figmaBtn).getBoundingClientRect(),
        data: {
          isUnderHeader: false,
          isNextToSidebar: true,
          isOnLeftSide: false,
        }
      };
      this.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings);
    },
    //it's not used
    async changeTextColorFromPresets(data: any) {
      this.$store.commit('editor/changeBlockStyleData', {
        block: this.block,
        path: 'backgroundColor',
        data
      });
    },
    changeBlockHeight(path: string, data: string, value: number) {
      if (value == +this.inputValue) return;
      this.$store.commit('editor/changeBlockStyleData', {
        block: this.block,
        path,
        ...(data == 'heightInput' ? { data: `${value}px` } : { data })
      });
    },
    changeClipOverflow(val: boolean) {
      this.$store.commit('editor/changeBlockStyleData', {
        block: this.block,
        path: 'overflow',
        data: val ? 'hidden' : 'visible'
      });
    },
    //it's not used
    async openColorPicker() {
      (<HTMLInputElement>this.$refs.colorPickerInput).focus();
      (<HTMLInputElement>this.$refs.colorPickerInput).click();
    },
    //it's not used
    async changeBlockBgColor(e: HTMLElementEvent<HTMLInputElement>) {
      this.$store.commit('editor/changeBlockStyleData', {
        block: this.block,
        path: 'backgroundColor',
        data: e.target.value
      });
    },
    //it's not used
    async changeBlockBgOpacity() {
      let opacity = +(<HTMLInputElement>this.$refs.opacityInput).value;
      if (opacity > 100) {
        opacity = 100;
      } else if (opacity < 0) {
        opacity = 0;
      }

      this.$store.commit('editor/changeBlockStyleData', {
        block: this.block,
        path: 'backgroundOpacity',
        data: opacity / 100
      });
    },
    formatHeightValue(height: string): string {
      return height.replace('px', '');
    },
    onKeydown(event: KeyboardEvent, incrementCount: number) {
      if (event && (event.key == 'ArrowUp' || event.key == 'ArrowDown')) {
        event.preventDefault();
        const increment = event.key == 'ArrowUp' ? incrementCount : -incrementCount;
        const { value } = <HTMLInputElement>this.$refs.heightInput;
        this.changeBlockHeight('height', 'heightInput', parseInt(value) + increment);
      }
    },
    setHeightInputVal() {
      const heightInput = <HTMLInputElement>this.$refs.heightInput;
      heightInput.blur();
      this.changeBlockHeight('height', 'heightInput', +heightInput.value);
    },
    cancelValueChange() {
      const heightInput = <HTMLInputElement>this.$refs.heightInput;
      heightInput.blur();
      heightInput.value = this.formatHeightValue(this.block.styles[this.previewMode].height);
    }
  }
});
</script>

<style lang="scss">
.block-sidebar {
  &__field {
    position: relative;
    &-input {
      padding: 7px 30px 7px 8px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      border-radius: $shape_border_radius;
      border: 1px solid $color_input_border;
      transition: 0.3s;
      max-width: 80px;

      &:hover {
        border-color: $color_input_hover;
      }

      &:focus {
        border-color: $color_input_focus;
      }
    }
    &-prefix {
      position: absolute;
      right: 8px;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 12px;
      height: 13px;
      font-weight: 400;
      font-size: 10px;
      line-height: 12px;
      color: $gray700;
    }
  }
}

.blocks-lib {
  width: 100%;
  &__btn {
    cursor: pointer;
    padding: 5px;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    display: flex;
    align-items: center;

    svg {
      margin-right: 4px;
    }
    &.active {
      pointer-events: none;
    }
    &:hover {
      background: #f3f3f3;
      border-radius: $shape_border_radius;
    }
  }
}

.params-switch {
  width: auto;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  background: #f3f3f3;
  border-radius: $shape_border_radius;
  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: $shape_border_radius;
    &.active {
      background: #ffffff;
      box-shadow: $shadow_small;
    }
  }
}
</style>

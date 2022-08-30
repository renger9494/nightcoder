<template>
  <div :class="['dte-color-item', { 'dte-color-item_hide': hide }]">
    <div class="dte-color-item__head">
      <div @click="openColorPickerModal" class="dte-color-item__main" :class="{ active: isPopupOpen }">
        <span v-if="!isMixed" :style="`background-color: ${hex}`" />
        <img v-else src="@/assets/img/editor/rainbow.png" alt="rainbow img" />
      </div>

      <input
        ref="colorPickerInput"
        @change="$emit('changeColor', colorPickerInput.value.substr(1))"
        type="color"
        style="display: none"
      />

      <div class="dte-color-item__wrap">
        <span class="dte-color-item__wrap-text" v-if="isMixed && !isFocusedColor">mixed</span>
        <input
          ref="hexInput"
          @click="hexInput.select()"
          @keydown.13="applyHexValue"
          @keydown.27="cancelHexValue"
          @change="applyHexValue"
          @focus="isFocusedColor = true"
          @blur="isFocusedColor = false"
          v-model="localHex"
          class="dte-color-item__input dte-color-item__input_hex"
          type="text"
        />
      </div>

      <div class="dte-color-item__input-container">
        <span class="dte-color-item__wrap-text" v-if="isMixed && !isFocusedOpacity">mix...</span>
        <input
          ref="opacityInput"
          @click="opacityInput.select()"
          :value="opacity"
          @blur="applyInputValue(false)"
          @focus="isFocusedOpacity = true"
          @input="applyInputValue(true)"
          @keydown.27.13="applyInputValue(false)"
          @keydown.shift.38.exact="changeValue($event, 'add', 10)"
          @keydown.38.exact="changeValue($event, 'add', 1)"
          @keydown.shift.40.exact="changeValue($event, 'subtract', 10)"
          @keydown.40.exact="changeValue($event, 'subtract', 1)"
          type="number"
          class="dte-color-item__input dte-color-item__input_opacity dte-color-item__input_icon"
          min="0"
          max="100"
        />
        <span class="dte-color-item__input-icon">%</span>
      </div>

<!--      <square-icon-btn-->
<!--        v-if="!disableHide"-->
<!--        @click="proceedHide"-->
<!--        :icon-settings="{ name: !hide ? 'hide' : 'unhide', ...iconSize }"-->
<!--      />-->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
// import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
import { ColorPickerPopupData, PopupContainerType, PopupSettings, PopupType } from '../../../Modal/types';

export default Vue.extend({
  // components: {
  //   SquareIconBtn
  // },
  name: 'ColorItem',
  props: {
    hide: {
      type: Boolean,
      default: false
    },
    disableHide: {
      type: Boolean,
      default: false
    },
    hex: {
      type: String
    },
    opacity: {
      type: [Number, String]
    },
    colorPickerData: Object,
    isMixed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localHex: this.hex,
      iconSize: { width: 24, height: 24 },
      unActiveItem: false,
      isFocusedColor: false,
      isFocusedOpacity: false
    };
  },
  computed: {
    ...mapState({
      popupSettings: (state: any) => state.editor.popupSettings
    }),
    isColorPickerOpened(): boolean {
      if (this.popupSettings.content != PopupType.ColorPicker) return false;
      return this.popupSettings.active;
    },
    colorPickerInput(): any {
      return this.$refs.colorPickerInput;
    },
    opacityInput(): any {
      return this.$refs.opacityInput;
    },
    hexInput(): any {
      return this.$refs.hexInput;
    },
    isPopupOpen(): boolean {
      return this.popupSettings.active && this.popupSettings.data.styleProperty === this.colorPickerData.styleProperty;
    }
  },
  watch: {
    hex(newValue) {
      this.localHex = newValue;
    }
  },
  methods: {
    proceedHide() {
      this.$emit('hide', !this.hide);
    },
    openColorPickerModal() {
      const popupSettings: PopupSettings<ColorPickerPopupData> = {
        active: true,
        closeButton: true,
        header: 'Change Color',
        content: PopupType.ColorPicker,
        container: PopupContainerType.Medium,
        location: this.$el.getBoundingClientRect(),
        data: this.colorPickerData
      };
      this.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings);
    },
    applyHexValue() {
      this.$emit('changeColor', this.localHex);
    },
    cancelHexValue() {
      this.localHex = this.hex;
    },
    changeValue(e: any, operator: string, val: number) {
      if (!(this.$refs.opacityInput as any).value.length && this.isMixed) return;
      e.preventDefault();
      let count = null;
      if (operator === 'add') {
        count = +this.opacity + val;
        if (count > 100) count = 100;
      } else {
        count = +this.opacity - val;
        if (count < 0) count = 0;
      }
      if (count >= 0 && count <= 100) this.$emit('changeOpacity', count);
    },
    applyInputValue(state: boolean) {
      this.isFocusedOpacity = state;
      if (!(this.$refs.opacityInput as any).value.length && this.isMixed) return;
      this.$emit('changeOpacity', (this.$refs.opacityInput as any).value);
    }
  }
});
</script>

<style lang="scss">
.dte-color {
  &-item {
    border-radius: 4px;

    &_hide {
      .dte-color-item__title,
      input,
      svg {
        opacity: 0.4;
      }
    }

    &__input-container {
      position: relative;
      height: 32px;
      width: 53px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin: 0 2px 0 0;
    }

    &__input-icon {
      cursor: default;
      padding-right: 8px;
      font-style: normal;
      font-weight: normal;
      font-size: 10px;
      line-height: 12px;
      color: $gray400;
    }

    &__input {
      font-size: 12px;
      line-height: 14px;
      padding: 8px;
      border: 1px solid $color_input_border;
      transition: border-color 0.2s ease, opacity 0.2s ease;
      position: relative;

      &:hover {
        border-color: $color_input_hover;
        z-index: 3;
      }

      &:focus {
        border-color: $color_input_focus;
        z-index: 3;
      }

      &_icon {
        position: absolute;
        top: 0;
        left: 0;
        padding-right: 15px;
      }

      &_hex {
        max-width: 118px;
        text-transform: uppercase;
      }
    }

    & &__input_opacity {
      width: 28px;
      box-sizing: content-box;
      margin-left: -1px;
      border-radius: 0 4px 4px 0;
    }

    &__opacity-wrap {
      display: flex;
      align-items: flex-start;
      margin-right: 25px;
    }

    &__head {
      display: flex;
      align-items: center;
    }

    &__title {
      height: 32px;
      padding: 8px;
      border-radius: 0 4px 4px 0;
      width: 143px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      text-transform: capitalize;
      border: 1px solid $color_input_border;
      margin: 0 auto 0 0;
      cursor: pointer;
      transition: 0.3s;
      position: relative;

      &:hover {
        border-color: $color_input_hover;
        z-index: 2;
      }
    }

    .design-text-editor__content span {
      font-style: normal;
      font-weight: 300;
      font-size: 12px;
      line-height: 14px;
      color: $black;
    }

    &__main {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: $white;
      border: 1px solid $color_input_border;
      border-radius: $shape_border_radius 0 0 $shape_border_radius;
      cursor: pointer;
      transition: border-color 0.2s ease, opacity 0.2s ease;
      margin: 0 -1px 0 0;
      position: relative;

      &.active {
        pointer-events: none;
        z-index: 3;
      }

      &:hover {
        border-color: $color_input_hover;
        z-index: 3;
      }

      img {
        width: 16px;
        height: 16px;
      }

      span {
        display: block;
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2);
        background: $black;
      }
    }

    &__wrap {
      position: relative;
      &-text {
        position: absolute;
        top: 10px;
        left: 6px;
        z-index: 2;
        font-size: 12px;
        line-height: 14px;
        color: #000;
        pointer-events: none;
      }
    }
  }
}
</style>

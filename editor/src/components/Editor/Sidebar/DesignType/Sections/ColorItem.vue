<template>
  <div
    :class="[
      'dte-color-item',
      { 'dte-color-item_hide': hide },
    ]"
  >
    <div class="dte-color-item__head">
      <div
        @click="openColorPickerModal"
        class="dte-color-item__main"
        :class="{ active: isPopupOpen }"
      >
        <span :style="`background-color: ${hex}`" />
      </div>

      <input
        ref="colorPickerInput"
        @change="$emit('changeColor', colorPickerInput.value.substr(1))"
        type="color"
        style="display: none"
      />

      <input
        ref="hexInput"
        @click="hexInput.select()"
        @change="$emit('changeColor', hexInput.value)"
        @blur="$emit('changeColor', hexInput.value)"
        :value="hex"
        class="dte-color-item__input dte-color-item__input_hex"
        type="text"
      />

      <div class="dte-color-item__input-container">
        <input
          ref="opacityInput"
          @click="opacityInput.select()"
          :value="opacity"
          @blur="applyInputValue"
          @keydown.27.13="applyInputValue"
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
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
import { ColorPickerPopupData, PopupContainerType, PopupSettings, PopupType } from '../../Modal/types';

export default Vue.extend({
  name: 'ColorItem',
  components: {
    SquareIconBtn
  },
  props: {
    hide: {
      type: Boolean,
      default: false
    },
    hex: {
      type: String
    },
    opacity: Number,
    colorPickerData: Object,
    disableHide: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localOpacity: this.opacity,
      isPopupActive: false,
      iconSize: { width: 24, height: 24 }
    };
  },
  computed: {
    ...mapState({
      popupSettings: (state: any) => state.editor.popupSettings
    }),
    isColorPickerOpened(): any {
      return this.isPopupActive;
    },
    opacityInput(): any {
      return this.$refs.opacityInput;
    },
    hexInput(): any {
      return this.$refs.hexInput;
    },
    colorPickerInput(): any {
      return this.$refs.colorPickerInput;
    },
    isPopupOpen(): boolean {
      return this.popupSettings.active && this.popupSettings.data.styleProperty === this.colorPickerData.styleProperty;
    }
  },
  watch: {
    popupSettings(value) {
      if (!value.active) this.isPopupActive = false;
    }
  },
  methods: {
    proceedHide() {
      this.$emit('hide', !this.hide);
    },
    openColorPickerModal() {
      this.isPopupActive = true;
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
    changeValue(e: any, operator: any, val: any) {
      e.preventDefault();
      let count = null;
      if (operator === 'add') {
        count = this.opacity + val;
        if (count > 100) count = 100;
      } else {
        count = this.opacity - val;
        if (count < 0) count = 0;
      }
      if (count >= 0 && count <= 100) this.$emit('changeOpacity', count);
    },
    applyInputValue() {
      this.$emit('changeOpacity', (<any>this.$refs.opacityInput)?.value);
    }
  }
});
</script>

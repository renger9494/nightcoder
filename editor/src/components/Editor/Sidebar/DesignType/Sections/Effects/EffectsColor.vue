<template>
  <div
    :class="[
      'dte-color-item',
      { 'dte-color-item_unactive': unActiveItem },
      { 'dte-color-item_hide': false },
      { 'dte-color-item_highlighted': isColorPickerOpened }
    ]"
  >
    <div class="dte-color-item__head">
      <!-- $emit('openColorPicker', $refs.colorPickerInput) -->
      <div @click="openColorPickerModal" class="dte-color-item__main">
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
        @mouseenter="unActiveItem = true"
        @mouseleave="unActiveItem = false"
        @click="hexInput.select()"
        @change="$emit('changeColor', hexInput.value)"
        :value="hex"
        class="dte-color-item__input dte-color-item__input_hex"
        type="text"
      />

      <div class="dte-color-item__input-container">
        <input
          ref="opacityInput"
          @mouseenter="unActiveItem = true"
          @mouseleave="unActiveItem = false"
          @click="opacityInput.select()"
          @change="$emit('textOpacity', opacityInput.value)"
          :value="opacity * 100"
          type="number"
          class="dte-color-item__input dte-color-item__input_opacity dte-color-item__input_icon"
          max="100"
        />
        <span class="dte-color-item__input-icon">%</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { ColorPickerPopupData, PopupContainerType, PopupSettings, PopupType } from '../../../Modal/types';

export default Vue.extend({
  name: 'EffectsColor',
  props: {
    hex: {
      type: String,
      required: true
    },
    opacity: {
      type: Number,
      required: true
    },
    blockInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      popupSettings: (state: any) => state.editor.popupSettings
    }),
    isColorPickerOpened(): boolean {
      return this.isPopupActive;
    },
    colorPickerInput(): any {
      return this.$refs.colorPickerInput;
    },
    hexInput(): any {
      return this.$refs.hexInput;
    },
    opacityInput(): any {
      return this.$refs.opacityInput;
    }
  },
  watch: {
    popupSettings(value) {
      if (!value.active) this.isPopupActive = false;
    }
  },
  data() {
    return {
      unActiveItem: false,
      isPopupActive: false
    };
  },
  methods: {
    openColorPickerModal() {
      this.isPopupActive = true;
      const popupSettings: PopupSettings<ColorPickerPopupData> = {
        active: true,
        closeButton: true,
        header: 'Change Color',
        content: PopupType.ColorPicker,
        container: PopupContainerType.Medium,
        location: this.$el.getBoundingClientRect(),
        data: this.blockInfo
      };
      this.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings);
    }
  }
});
</script>

<style lang="scss">
.dte-color-item__input_opacity.dte-color-item__input_nm {
  margin-left: 0;
}
</style>

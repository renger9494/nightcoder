<template>
  <div
    class="dte-color-item"
    :class="{
      'dte-color-item_unactive': unActiveItem,
      'dte-color-item_hide': hide
    }"
  >
    <div class="dte-color-item__head" @click="openColorPickerModal">
      <!-- $emit('openColorPicker', $refs.colorPickerInput) -->
      <div class="dte-color-item__main" :class="{ active: isPopupOpen }">
        <span :style="`background: ${gradientColor}`" />
      </div>

      <div class="dte-color-item__title">
        {{ gradientType }}
      </div>
      <!--<div class="dte-color-item__input-container">-->
      <!--<input-->
      <!--ref="opacityInput"-->
      <!--@mouseenter="unActiveItem = true"-->
      <!--@mouseleave="unActiveItem = false"-->
      <!--@click="$refs.opacityInput.select()"-->
      <!--@change="$emit('changeOpacity', $refs.opacityInput.value)"-->
      <!--:value="opacity"-->
      <!--type="number"-->
      <!--class="dte-color-item__input dte-color-item__input_opacity dte-color-item__input_icon"-->
      <!--max="100"-->
      <!--/>-->
      <!--<span class="dte-color-item__input-icon">%</span>-->
      <!--</div>-->

      <square-icon-btn
        v-if="!disableHide"
        @click.stop.native="proceedHide"
        :icon-settings="{ name: !hide ? 'hide' : 'unhide', ...iconSize }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
import { PopupSettings, ColorPickerPopupData, PopupType, PopupContainerType } from '../../../Modal/types';

export default Vue.extend({
  name: 'gradient-item',
  components: {
    SquareIconBtn
  },
  props: {
    hide: {
      type: Boolean,
      default: false
    },
    disableHide: {
      type: Boolean,
      default: false
    },
    colorPickerData: Object,
    gradientColor: String
  },
  computed: {
    ...mapState({
      popupSettings: (state: any) => state.editor.popupSettings
    }),
    gradientType(): string {
      return this.colorPickerData.gradient.type;
    },
    isPopupOpen(): boolean {
      return this.popupSettings.active && this.popupSettings.data.styleProperty === this.colorPickerData.styleProperty;
    }
  },
  data() {
    return {
      unActiveItem: false,
      iconSize: { width: 24, height: 24 }
    };
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
    }
  }
});
</script>

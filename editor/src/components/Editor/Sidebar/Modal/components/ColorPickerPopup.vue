<template>
  <div class="sidebar-popup-color">
    <switcher v-if="!isOnlyColor" :switcher-items="switcherItems" @filterName="changeBgType" />

    <div class="sidebar-popup-color__container" :style="`margin-top: ${isOnlyColor ? '25px' : 0}`">
      <color-picker v-if="activeBgType === 'color'" @pickerChange="colorChange" v-model="defaultColor" />
      <gradient-picker
        v-if="activeBgType === 'gradient'"
        :gradient="defaultGradient"
        :isGradient="true"
        :onChange="color => onChange(color)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import Switcher from '@/components/Editor/Sidebar/Switcher.vue';
import Chrome from '@/components/ColorPickers/Chrome/Index.vue';
import ColorPicker from './GradientPicker/components/ColorPicker/index.vue';
import './GradientPicker/index.scss';
import { ColorPickerPopupData, PopupSettings } from '../types';

export default Vue.extend({
  name: 'ColorPickerPopup',
  components: {
    Switcher,
    ColorPicker: Chrome,
    GradientPicker: ColorPicker
  },
  data: () => ({
    activeBgType: 'color',
    color: {
      hex: '#ffffff',
      a: 0
    },
    defaultGradient: {
      type: 'linear',
      degree: 0,
      points: [
        {
          left: 0,
          red: 42,
          green: 245,
          blue: 152,
          alpha: 1
        },
        {
          left: 100,
          red: 0,
          green: 158,
          blue: 253,
          alpha: 1
        }
      ]
    }
  }),
  computed: {
    ...mapState({
      popupSettings: (state: any) => <PopupSettings<ColorPickerPopupData>>state.editor.popupSettings
    }),
    defaultColor: {
      get(): any {
        if (this.popupSettings.data.hex) {
          return {
            hex: this.popupSettings.data.hex,
            a: this.popupSettings.data.opacity
          };
        } else {
          return {
            hex: this.popupSettings.data.styleProperty === 'textColor' ? '#000000' : '#ffffff',
            a: 1
          };
        }
      },
      set(newVal: any) {
        this.color = newVal;
      }
    },
    isOnlyColor(): boolean {
      return this.popupSettings.data.isOnlyColor;
    },
    switcherItems(): any[] {
      return [
        {
          name: 'color',
          isActive: this.popupSettings.data.activeTab === 'color'
        },
        {
          name: 'gradient',
          isActive: this.popupSettings.data.activeTab === 'gradient'
        }
      ];
    }
  },
  mounted() {
    this.activeBgType = this.popupSettings.data.activeTab;
    if (!this.popupSettings.data.hex && this.popupSettings.data.gradient) {
      this.defaultGradient = this.popupSettings.data.gradient;
    }
  },
  methods: {
    colorChange(colorObject: any) {
      if(this.defaultColor.hex === colorObject.hex && this.defaultColor.a === colorObject.a) return
      const { colorPickHandler } = this.popupSettings.data;
      colorPickHandler(colorObject);
    },
    changeBgType(type: string) {
      this.activeBgType = type.toLowerCase();
    },
    onChange(attrs: any) {
      const { colorPickHandler } = this.popupSettings.data;
      colorPickHandler({ background: attrs.style });
      this.defaultGradient = attrs;
    }
  }
});
</script>

<style lang="scss">
.sidebar-popup-color {
  .switcher {
    margin-top: 18px;
    margin-bottom: 16px;
  }
}
</style>

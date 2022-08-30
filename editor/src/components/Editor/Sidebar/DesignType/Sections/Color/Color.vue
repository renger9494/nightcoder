<template>
  <div class="sidebar-block">
    <p class="sidebar-block__title">{{ header }}</p>
    <color-item
      v-if="!isGradient"
      :color-picker-data="{
        colorPickHandler: onColorPick,
        hex: colorProps.color,
        opacity: colorProps.opacity,
        activeTab: 'color',
        isNextToSidebar: true,
        isOnlyColor: isOnlyColor,
        styleProperty: styleProperty
      }"
      :hex="colorProps.color"
      :hide="hide"
      :opacity="colorOpacity"
      :is-mixed="isMixed"
      @changeColor="changeColor"
      @hide="hideColor"
      @openColorPicker="openColorPicker"
      @changeOpacity="changeOpacity"
    />
    <gradient-item
      v-else
      :color-picker-data="{
        colorPickHandler: onColorPick,
        gradient: colorProps,
        activeTab: 'gradient',
        isNextToSidebar: true,
        styleProperty: styleProperty
      }"
      :hide="hide"
      :gradient-color="gradientColor"
      @changeColor="changeColor"
      @hide="hideColor"
      @openColorPicker="openColorPicker"
      @changeOpacity="changeOpacity"
    />
  </div>
</template>

<script lang="ts">
import ColorItem from './ColorItem.vue';
import GradientItem from './GradientItem.vue';
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Color',
  components: {
    ColorItem,
    GradientItem
  },
  props: {
    hide: {
      type: Boolean,
      default: false
    },
    colorProps: {
      type: Object,
      default: () => ({})
    },
    styleProperty: {
      type: String,
      default: 'background'
    },
    header: {
      type: String,
      default: 'text'
    },
    isGradient: {
      type: Boolean,
      default: false
    },
    gradientColor: String,
    isOnlyColor: {
      type: Boolean,
      default: false
    },
    isMixed: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const colorOpacity = computed(() => {
      if (props.isMixed) return '';

      return Math.round(props.colorProps.opacity * 100);
    });

    function openColorPicker(picker: HTMLElement) {
      picker.focus();
      picker.click();
    }

    function onColorPick(colorObject: any) {
      if (colorObject.hex) {
        emit('changeColor', {
          color: colorObject.hex,
          opacity: colorObject.a
        });
      } else {
        emit('changeColor', colorObject);
      }
    }

    function hideColor(hide: any) {
      emit('hide', hide);
    }

    function changeColor(color: any) {
      emit('changeColor', {
        color: color,
        opacity: props.colorProps.opacity
      });
    }

    function changeOpacity(opacity: any) {
      let colorOpacity;
      if (Number(opacity) > 100) {
        colorOpacity = 100;
      } else if (Number(opacity) < 0) {
        colorOpacity = 0;
      } else colorOpacity = Number(opacity);

      emit('changeColor', {
        color: props.colorProps.color,
        opacity: colorOpacity / 100
      });
    }

    return {
      colorOpacity,
      changeColor,
      changeOpacity,
      openColorPicker,
      onColorPick,
      hideColor
    };
  }
});
</script>

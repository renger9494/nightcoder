<template>
  <div class="sidebar-block" @keydown.esc.stop.prevent.exact="showBorderTypes = false" tabindex="0">
    <div class="sidebar-block__head sidebar-block__head--interactive" @click="addBorder(true)">
      <p
        class="sidebar-block__title sidebar-block__title--no-gutter"
        :class="{ 'sidebar-block__title--inactive': !isBorderActive }"
      >
        Stroke
      </p>
      <square-icon-btn
        @click.native.stop="addBorder(isBorderActive ? false : true)"
        :icon-settings="{ name: !isBorderActive ? 'plus-icon' : 'minus-icon', ...iconSize }"
        :icon-color="!isBorderActive ? '#828282' : '#000'"
      />
    </div>
    <div v-if="isBorderActive" class="sidebar-block__body">
      <div class="sidebar-block__row">
        <color-item
          :color-picker-data="{
            colorPickHandler: onColorPick,
            hex: borderProps.borderColor,
            opacity: borderProps.borderOpacity,
            isNextToSidebar: true,
            activeTab: 'color',
            isOnlyColor: true
          }"
          :hex="borderProps.borderColor"
          :hide="isBorderHidden"
          :opacity="Math.round((borderProps.borderOpacity ? borderProps.borderOpacity : 0) * 100)"
          @changeColor="changeBorderColor"
          @hide="proceedHide(!isBorderHidden)"
          @openColorPicker="openColorPicker"
          @changeOpacity="changeBorderOpacity"
        />
      </div>
      <div class="sidebar-block__row">
        <prefix-input
          class="sidebar-block__item sidebar-block__item--s"
          type="borderWidth"
          :unit="'px'"
          @inputHandler="changeBorderWidth"
          :value="borderProps.borderWidth"
          v-tooltip="'Border width'"
        />
        <div class="border-dropdown sidebar-block__item" @click="showBorderTypes = !showBorderTypes">
          <span class="border-dropdown__cur" v-tooltip="'Stroke style'">
            <svg-icon :name="`border-${borderProps.borderType}-icon`" width="15" height="2" color="#000" />
            {{ borderProps.borderType }}
          </span>
          <transition mode="out-in" name="popup-layer">
            <div
              v-show="showBorderTypes"
              v-click-outside="() => (showBorderTypes = false)"
              class="border-dropdown__options"
            >
              <div
                v-for="(type, index) in Object.values(StrokeStyleType)"
                :key="index"
                :class="{ active: borderProps.borderType === type }"
                class="border-dropdown__option"
                @click.stop="changeBorderType(type)"
              >
                <svg-icon
                  :name="`border-${type}-icon`"
                  width="15"
                  height="2"
                  :color="borderProps.borderType === type ? '#318bf5' : '#000'"
                />
                {{ type }}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from '@vue/composition-api';
import { prepareOpacity } from '@/helpers/hexToRgb';
import useBorderEditor from '@/hooks/editor/visual/border.editor.hook';

import ColorItem from '../Color/ColorItem.vue';
import TogglePanelIcon from '@/components/Editor/Sidebar/DesignType/Sections/TogglePanelIcon.vue';
import { StrokeStyleType } from '@/constants/strokeStyle';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';

export default defineComponent({
  name: 'Border',
  components: {
    ColorItem,
    SquareIconBtn,
    TogglePanelIcon
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root }) {
    const showBorderTypes = ref(false);
    const strokeWidth = ref(4);
    const dashArray = ref(8);
    const dashOffset = ref(0);
    const lineCap = ref('square');
    const borderWidth = ref(null as null | HTMLInputElement);

    const previewMode = computed(() => root.$store.state.editor.previewMode);

    const styles = computed(() => {
      return props.value.styles[previewMode.value];
    });

    const {
      setHideCssProperty: setHideBorder,
      setCssProperty: setBorder,
      cssPropertyProps: borderProps,
      deleteCssProperty: deleteBorder,
      isCssPropertyActive: isBorderActive,
      isCssPropertyHidden: isBorderHidden
    } = useBorderEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const proceedHide = (val: boolean) => {
      setHideBorder(val);
    };

    function changeBorderColor(color: string) {
      setBorder({
        borderColor: color,
        borderOpacity: borderProps.value.borderOpacity,
        borderWidth: borderProps.value.borderWidth,
        borderType: borderProps.value.borderType
      });
    }

    function changeBorderOpacity(opacity: string) {
      setBorder({
        borderColor: borderProps.value.borderColor,
        borderOpacity: prepareOpacity(opacity) / 100,
        borderWidth: borderProps.value.borderWidth,
        borderType: borderProps.value.borderType
      });
    }

    function changeBorderType(type: StrokeStyleType) {
      showBorderTypes.value = false;
      setBorder({
        borderColor: borderProps.value.borderColor,
        borderOpacity: borderProps.value.borderOpacity,
        borderWidth: borderProps.value.borderWidth,
        borderType: type
      });
    }

    function openColorPicker(picker: HTMLDivElement) {
      picker.focus();
      picker.click();
    }

    function addBorder(val: boolean) {
      if (val)
        setBorder({
          borderColor: '#000000',
          borderOpacity: 1,
          borderWidth: 1,
          borderType: 'solid'
        });
      else deleteBorder();
    }

    function changeBorderWidth(val: { type: string; data: number }) {
      setBorder({
        borderColor: borderProps.value.borderColor,
        borderOpacity: borderProps.value.borderOpacity,
        borderWidth: val.data,
        borderType: borderProps.value.borderType
      });
    }

    function onColorPick(colorObject: { hex: string; a: number }) {
      setBorder({
        borderColor: colorObject.hex,
        borderOpacity: colorObject.a,
        borderWidth: borderProps.value.borderWidth,
        borderType: borderProps.value.borderType
      });
    }

    return {
      borderProps,
      isBorderActive,
      showBorderTypes,
      strokeWidth,
      dashArray,
      dashOffset,
      lineCap,
      previewMode,
      isBorderHidden,
      borderWidth,
      StrokeStyleType,
      iconSize: { width: 24, height: 24 },
      proceedHide,
      changeBorderWidth,
      changeBorderType,
      changeBorderColor,
      changeBorderOpacity,
      openColorPicker,
      addBorder,
      onColorPick
    };
  }
});
</script>

<style lang="scss">
.border-dropdown {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 79px;
  height: 32px;
  border: 1px solid #f3f3f3;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;

  &:hover {
    border-color: #bdc2c7;
  }

  &__options {
    background: #ffffff;
    border: 1px solid #dadada;
    box-sizing: border-box;
    box-shadow: 0 10px 20px rgba(9, 9, 9, 0.15);
    border-radius: 4px;
    padding: 6px;
    position: absolute;
    top: -5px;
    left: -5px;
    z-index: 999;
  }

  &__option {
    border-radius: 4px;
    height: 29px;
    width: 100%;
    padding: 0 8px;
    cursor: pointer;

    svg {
      margin: 0 8px 0 0;
      transition: 0.2s ease;
    }

    &:hover {
      transition: 0.2s ease;
      background: #f3f3f3;
      color: #318bf5;

      svg {
        color: #318bf5 !important;
      }
    }

    &.active {
      color: #318bf5;
    }
  }

  &__cur,
  &__option {
    display: flex;
    align-items: center;
    text-transform: capitalize;
    cursor: pointer;
    font-size: 12px;
    line-height: 16px;

    .svg-icon {
      display: flex;
      margin-right: 10px;
    }
  }
}

.border-field {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  align-items: center;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: #000000;
  border: 1px solid #f3f3f3;
  box-sizing: border-box;
  border-radius: 4px;
}

.dte-border {
  .dte-link__add {
    right: 8px;
  }
}
</style>

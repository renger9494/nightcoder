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
        />
        <div class="border-dropdown sidebar-block__item" @click="showBorderTypes = !showBorderTypes">
          <span class="border-dropdown__cur">
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
                :class="{ active: borderProps.borderType === 'solid' }"
                class="border-dropdown__option"
                @click.stop="changeBorderType('solid')"
              >
                <border-type-icon :borderType="'solid'" />
                Solid
              </div>
              <div
                :class="{ active: borderProps.borderType === 'dashed' }"
                class="border-dropdown__option"
                @click.stop="changeBorderType('dashed')"
              >
                <border-type-icon :borderType="'dashed'" />
                Dash
              </div>
              <div
                :class="{ active: borderProps.borderType === 'dotted' }"
                class="border-dropdown__option"
                @click.stop="changeBorderType('dotted')"
              >
                <border-type-icon :borderType="'dotted'" />
                Dotted
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
import useBorderMultipleEditor from '@/hooks/editor/visual/multiple/borderMultiple.editor.hook';

import ColorItem from '../Color/ColorItem.vue';
import BorderTypeIcon from './BorderTypeIcon.vue';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';

export default defineComponent({
  name: 'BorderMultiple',
  components: {
    ColorItem,
    BorderTypeIcon,
    SquareIconBtn
  },
  props: {
    value: {
      type: Array,
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
      return (props.value as Array<any>)[0]?.styles[previewMode.value];
    });

    const {
      setHideCssProperty: setHideBorder,
      setCssProperty: setBorder,
      cssPropertyProps: borderProps,
      deleteCssProperty: deleteBorder,
      isCssPropertyActive: isBorderActive,
      isCssPropertyHidden: isBorderHidden
    } = useBorderMultipleEditor({
      elements: computed(() => props.value),
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

    function changeBorderType(type: string) {
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
.border-params {
  display: flex;
  align-items: center;

  &__field {
    position: relative;
    box-sizing: border-box;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: #000000;

    &_sm {
      input {
        padding: 0 28px;
        text-align: left;
        border: 1px solid #f3f3f3;
        border-radius: 4px;

        &:hover {
          border-color: #bdc2c7;
        }
      }
    }
  }

  & &__field_icon {
    width: 86px;
    height: 34px;
    margin-right: 9px;
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

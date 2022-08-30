<template>
  <div class="sidebar-block effect-block">
    <div @click="toggleEffects(true)" class="sidebar-block__head sidebar-block__head--interactive">
      <p
        class="sidebar-block__title sidebar-block__title--no-gutter"
        :class="{ 'sidebar-block__title--inactive': !isBoxShadowActive }"
      >
        Effects
      </p>
      <square-icon-btn
        @click.native.stop="toggleEffects(isBoxShadowActive ? false : true)"
        :icon-settings="{ name: !isBoxShadowActive ? 'plus-icon' : 'minus-icon', ...iconSize }"
        :icon-color="!isBoxShadowActive ? '#828282' : '#000'"
      />
    </div>

    <div
      v-if="isBoxShadowActive"
      class="sidebar-block__body"
      :class="{ 'sidebar-block__body--hidden': isBoxShadowHidden }"
    >
      <div class="sidebar-block__row sidebar-block__row--sbc">
        <div class="type-dropdown">
          <div class="type-dropdown___header">
            <svg-icon name="effect-icon" width="12" height="12" color="#000" />
            Drop Shadow
          </div>
        </div>
<!--        <square-icon-btn-->
<!--          @click.native="proceedHide(!isBoxShadowHidden)"-->
<!--          :icon-settings="{ name: !isBoxShadowHidden ? 'hide' : 'unhide', ...iconSize }"-->
<!--        />-->
      </div>

      <div class="sidebar-block__row sidebar-block__row--sb">
        <prefix-input
          class="sidebar-block__item sidebar-block__item--s"
          :value="boxShadowProps.boxShadowX"
          @inputHandler="changeBoxShadowParam"
          unit="px"
          type="shadowX"
        />

        <prefix-input
          class="sidebar-block__item effect-block__input"
          :value="boxShadowProps.boxShadowBlurRadius"
          @inputHandler="changeBoxShadowParam"
          unit="px"
          type="shadowBlur"
        />
      </div>

      <div class="sidebar-block__row sidebar-block__row--sb">
        <prefix-input
          class="sidebar-block__item sidebar-block__item--s"
          :value="boxShadowProps.boxShadowY"
          @inputHandler="changeBoxShadowParam"
          unit="px"
          type="shadowY"
        />

        <prefix-input
          class="sidebar-block__item effect-block__input"
          :value="boxShadowProps.boxShadowSpread"
          @inputHandler="changeBoxShadowParam"
          unit="px"
          type="shadowSpread"
        />
      </div>

      <color-item
        :colorPickerData="{
          colorPickHandler: changeBoxShadowPaint,
          hex: boxShadowProps.boxShadowColor,
          opacity: boxShadowProps.boxShadowOpacity,
          isNextToSidebar: true,
          isOnlyColor: true,
          activeTab: 'color'
        }"
        :hex="boxShadowProps.boxShadowColor"
        :disable-hide="true"
        :opacity="Math.round((boxShadowProps.boxShadowOpacity ? boxShadowProps.boxShadowOpacity : 0) * 100)"
        @changeColor="changeBoxShadowColor"
        @changeOpacity="changeBoxShadowOpacity"
        @hide="setHideBoxShadow(!isBoxShadowActive)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import useBoxShadowMultipleEditor from '@/hooks/editor/visual/multiple/boxShadowMultiple.editor.hook';
import { prepareOpacity } from '@/helpers/hexToRgb';

import ColorItem from '@/components/Editor/Sidebar/DesignType/Sections/ColorItem.vue';
import TogglePanelIcon from '@/components/Editor/Sidebar/DesignType/Sections/TogglePanelIcon.vue';
import ToggleDisplayIcon from '@/components/Editor/Sidebar/DesignType/Sections/ToggleDisplayIcon.vue';
import SquareIconBtn from "@/components/Shared/ui/SquareIconBtn.vue";

export default defineComponent({
  components: {
    SquareIconBtn,
    ColorItem,
    TogglePanelIcon,
    ToggleDisplayIcon
  },
  props: {
    value: {
      type: Array,
      default: () => ({})
    },
    elementType: {
      type: String,
      default: ''
    }
  },
  setup(props, { root }) {
    const previewMode = computed(() => root.$store.state.editor.previewMode);

    const styles = computed(() => {
      return (props.value as Array<any>)[0]?.styles[previewMode.value];
    });

    const {
      cssPropertyProps: boxShadowProps,
      isCssPropertyActive: isBoxShadowActive,
      setHideCssProperty: setHideBoxShadow,
      setCssProperty: setBoxShadow,
      deleteCssProperty: deleteBoxShadow,
      isCssPropertyHidden: isBoxShadowHidden
    } = useBoxShadowMultipleEditor({
      elements: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const proceedHide = (val: boolean) => {
      setHideBoxShadow(val);
    };

    function changeBoxShadowParam({ type: style, data }: { type: any; data: any }) {
      setBoxShadow({
        boxShadowX: style === 'boxShadowX' || style === 'shadowX' ? data : boxShadowProps.value.boxShadowX,
        boxShadowY: style === 'boxShadowY' || style === 'shadowY' ? data : boxShadowProps.value.boxShadowY,
        boxShadowBlurRadius:
          style === 'boxShadowBlurRadius' || style === 'shadowBlur' ? data : boxShadowProps.value.boxShadowBlurRadius,
        boxShadowSpread:
          style === 'boxShadowSpread' || style === 'shadowSpread' ? data : boxShadowProps.value.boxShadowSpread,
        boxShadowColor: style === 'boxShadowColor' ? data : boxShadowProps.value.boxShadowColor,
        boxShadowOpacity: style === 'boxShadowOpacity' ? prepareOpacity(data) : boxShadowProps.value.boxShadowOpacity
      });
    }

    function changeBoxShadowColor(val: string) {
      changeBoxShadowParam({ type: 'boxShadowColor', data: val });
    }

    function openColorPicker(picker: HTMLDivElement) {
      picker.focus();
      picker.click();
    }

    function changeBoxShadowOpacity(val: any) {
      changeBoxShadowParam({ type: 'boxShadowOpacity', data: val });
    }

    function changeBoxShadowPaint(val: any) {
      changeBoxShadowParam({ type: 'boxShadowColor', data: val.hex });
      changeBoxShadowParam({ type: 'boxShadowOpacity', data: val.a * 100 });
    }

    function toggleEffects(val: boolean) {
      if (val) {
        setBoxShadow({
          boxShadowX: 0,
          boxShadowY: 10,
          boxShadowBlurRadius: 30,
          boxShadowSpread: 0,
          boxShadowColor: '#001950',
          boxShadowOpacity: 0.3
        });
      } else deleteBoxShadow();
    }

    return {
      isBoxShadowActive,
      isBoxShadowHidden,
      boxShadowProps,
      iconSize: { width: 24, height: 24 },
      proceedHide,
      toggleEffects,
      changeBoxShadowColor,
      changeBoxShadowOpacity,
      changeBoxShadowParam,
      changeBoxShadowPaint,
      openColorPicker,
      setHideBoxShadow
    };
  }
});
</script>

<style lang="scss">
.dte-effects {
  &__btns {
    display: flex;
    align-items: center;
    button:last-child {
      margin: 0;
    }
  }
  &__field-rows {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    row-gap: 1px;
    margin: 3px 0 12px;
  }
  &__field-wrap {
    &:nth-child(1),
    &:nth-child(2) {
      margin: 0 0 5px;
    }
  }
  &__top-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
  }
}
</style>

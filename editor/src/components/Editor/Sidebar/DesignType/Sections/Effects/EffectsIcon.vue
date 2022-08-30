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
          :value="iconShadowProps.boxShadowX"
          @inputHandler="changeBoxShadowParam"
          unit="px"
          type="shadowX"
        />
        <prefix-input
          class="effect-block__input"
          :value="iconShadowProps.boxShadowBlurRadius"
          @inputHandler="changeBoxShadowParam"
          unit="px"
          type="shadowBlur"
        />
      </div>
      <div class="sidebar-block__row sidebar-block__row--sb">
        <prefix-input
          :value="iconShadowProps.boxShadowY"
          @inputHandler="changeBoxShadowParam"
          unit="px"
          type="shadowY"
        />
      </div>

      <color-item
        :color-picker-data="{
          colorPickHandler: changeBoxShadowPaint,
          hex: iconShadowProps.boxShadowColor,
          opacity: iconShadowProps.boxShadowOpacity,
          isNextToSidebar: true,
          isOnlyColor: true,
          activeTab: 'color'
        }"
        :hex="iconShadowProps.boxShadowColor"
        :disable-hide="true"
        :opacity="Math.round((iconShadowProps.boxShadowOpacity ? +iconShadowProps.boxShadowOpacity : 0) * 100)"
        @changeColor="changeBoxShadowColor"
        @changeOpacity="changeBoxShadowOpacity"
        @hide="setHideBoxShadow(!isBoxShadowActive)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import useIconShadowEditor from '@/hooks/editor/visual/iconShadow.editor.hook';
import { prepareOpacity } from '@/helpers/hexToRgb';

import EffectsColor from './EffectsColor.vue';
import ColorItem from '@/components/Editor/Sidebar/DesignType/Sections/ColorItem.vue';
import TogglePanelIcon from '@/components/Editor/Sidebar/DesignType/Sections/TogglePanelIcon.vue';
import ToggleDisplayIcon from '@/components/Editor/Sidebar/DesignType/Sections/ToggleDisplayIcon.vue';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';

export default defineComponent({
  components: {
    SquareIconBtn,
    ColorItem,
    EffectsColor,
    TogglePanelIcon,
    ToggleDisplayIcon
  },
  props: {
    value: {
      type: Object,
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
      return props.value.styles[previewMode.value];
    });

    const {
      cssPropertyProps: iconShadowProps,
      isCssPropertyActive: isBoxShadowActive,
      setHideCssProperty: setHideBoxShadow,
      setCssProperty: setBoxShadow,
      deleteCssProperty: deleteBoxShadow,
      isCssPropertyHidden: isBoxShadowHidden
    } = useIconShadowEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const proceedHide = (val: boolean) => {
      setHideBoxShadow(val);
    };

    function changeBoxShadowParam({ type: style, data }: { type: any; data: any }) {
      setBoxShadow({
        boxShadowX: style === 'boxShadowX' || style === 'shadowX' ? data : iconShadowProps.value.boxShadowX,
        boxShadowY: style === 'boxShadowY' || style === 'shadowY' ? data : iconShadowProps.value.boxShadowY,
        boxShadowBlurRadius:
          style === 'boxShadowBlurRadius' || style === 'shadowBlur' ? data : iconShadowProps.value.boxShadowBlurRadius,
        boxShadowColor: style === 'boxShadowColor' ? data : iconShadowProps.value.boxShadowColor,
        boxShadowOpacity: style === 'boxShadowOpacity' ? prepareOpacity(data) : iconShadowProps.value.boxShadowOpacity
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
      console.log(val);
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
          boxShadowBlurRadius: 10,
          boxShadowColor: '#001950',
          boxShadowOpacity: 1
        });
      } else deleteBoxShadow();
    }

    return {
      isBoxShadowActive,
      isBoxShadowHidden,
      iconShadowProps,
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

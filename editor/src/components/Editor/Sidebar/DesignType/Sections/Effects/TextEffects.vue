<template>
  <div class="sidebar-block effect-block">
    <div @click="toggleEffects(true)" class="sidebar-block__head sidebar-block__head--interactive">
      <p
        class="sidebar-block__title sidebar-block__title--no-gutter"
        :class="{ 'sidebar-block__title--inactive': !isTextShadowActive }"
      >
        Effects
      </p>
      <square-icon-btn
        @click.native.stop="toggleEffects(isTextShadowActive ? false : true)"
        :icon-settings="{ name: !isTextShadowActive ? 'plus-icon' : 'minus-icon', ...iconSize }"
        :icon-color="!isTextShadowActive ? '#828282' : '#000'"
      />
    </div>
    <div
      v-if="isTextShadowActive"
      class="sidebar-block__body"
      :class="{ 'sidebar-block__body--hidden': isTextShadowHidden }"
    >
      <div class="sidebar-block__row sidebar-block__row--sbc">
        <div class="type-dropdown">
          <div class="type-dropdown___header">
            <svg-icon name="effect-icon" width="12" height="12" color="#000" />
            Drop Shadow
          </div>
        </div>
<!--        <square-icon-btn-->
<!--          @click.native="proceedHide(!isTextShadowHidden)"-->
<!--          :icon-settings="{ name: !isTextShadowHidden ? 'hide' : 'unhide', ...iconSize }"-->
<!--        />-->
      </div>
      <div class="sidebar-block__row sidebar-block__row--sb">
        <prefix-input
          class="sidebar-block__item sidebar-block__item--s"
          :value="textShadowProps.textShadowX"
          @inputHandler="changeTextShadowParam"
          unit="px"
          type="shadowX"
        />
        <prefix-input
          class="effect-block__input"
          :value="textShadowProps.textShadowBlurRadius"
          @inputHandler="changeTextShadowParam"
          unit="px"
          type="shadowBlur"
        />
      </div>
      <div class="sidebar-block__row sidebar-block__row--sb">
        <prefix-input
          :value="textShadowProps.textShadowY"
          @inputHandler="changeTextShadowParam"
          unit="px"
          type="shadowY"
        />
      </div>

      <color-item
        :color-picker-data="{
          colorPickHandler: changeTextShadowPaint,
          hex: textShadowProps.textShadowColor,
          opacity: textShadowProps.textShadowOpacity,
          isNextToSidebar: true,
          isOnlyColor: true,
          activeTab: 'color'
        }"
        :hex="textShadowProps.textShadowColor"
        :disable-hide="true"
        :opacity="Math.round((textShadowProps.textShadowOpacity ? textShadowProps.textShadowOpacity : 0) * 100)"
        @changeColor="changeTextShadowColor"
        @changeOpacity="changeTextShadowOpacity"
        @hide="setHideTextShadow(!isTextShadowActive)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import EffectsColor from './EffectsColor.vue';
import ColorItem from '@/components/Editor/Sidebar/DesignType/Sections/ColorItem.vue';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
import useTextShadowEditor from '@/hooks/editor/visual/textShadow.editor.hook';
import { prepareOpacity } from '@/helpers/hexToRgb';

export default defineComponent({
  components: {
    ColorItem,
    EffectsColor,
    SquareIconBtn
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root }) {
    const previewMode = computed(() => root.$store.state.editor.previewMode);

    const styles = computed(() => {
      return props.value.styles[previewMode.value];
    });

    const {
      cssPropertyProps: textShadowProps,
      isCssPropertyActive: isTextShadowActive,
      setHideCssProperty: setHideTextShadow,
      setCssProperty: setTextShadow,
      deleteCssProperty: deleteTextShadow,
      isCssPropertyHidden: isTextShadowHidden
    } = useTextShadowEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const proceedHide = (val: boolean) => {
      setHideTextShadow(val);
    };

    function changeTextShadowParam({ type: style, data }: { type: string; data: any }) {
      setTextShadow({
        textShadowX: style === 'textShadowX' || style === 'shadowX' ? data : textShadowProps.value.textShadowX,
        textShadowY: style === 'textShadowY' || style === 'shadowY' ? data : textShadowProps.value.textShadowY,
        textShadowBlurRadius:
          style === 'textShadowBlurRadius' || style === 'shadowBlur'
            ? data
            : textShadowProps.value.textShadowBlurRadius,
        textShadowColor: style === 'textShadowColor' ? data : textShadowProps.value.textShadowColor,
        textShadowOpacity:
          style === 'textShadowOpacity' ? prepareOpacity(data) : textShadowProps.value.textShadowOpacity
      });
    }

    function changeTextShadowColor(val: string) {
      changeTextShadowParam({ type: 'textShadowColor', data: val });
    }

    function openColorPicker(picker: HTMLDivElement) {
      picker.focus();
      picker.click();
    }

    function changeTextShadowOpacity(val: any) {
      changeTextShadowParam({ type: 'textShadowOpacity', data: val });
    }

    function changeTextShadowPaint(val: { hex: string; a: number }) {
      changeTextShadowParam({ type: 'textShadowColor', data: val.hex });
      changeTextShadowParam({ type: 'textShadowOpacity', data: val.a * 100 });
    }

    function toggleEffects(val: boolean) {
      if (val) {
        setTextShadow({
          textShadowX: 0,
          textShadowY: 10,
          textShadowBlurRadius: 10,
          textShadowColor: '#001950',
          textShadowOpacity: 0.3
        });
      } else deleteTextShadow();
    }

    return {
      isTextShadowActive,
      isTextShadowHidden,
      textShadowProps,
      iconSize: { width: 24, height: 24 },
      proceedHide,
      toggleEffects,
      changeTextShadowColor,
      changeTextShadowOpacity,
      changeTextShadowParam,
      changeTextShadowPaint,
      openColorPicker,
      setHideTextShadow
    };
  }
});
</script>

<style lang="scss">
.effect-block {
  &__input {
    flex: 1 0 0;
  }
}
.type-dropdown {
  border: 1px solid transparent;
  border-radius: $shape_border_radius;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  &___header {
    display: flex;
    align-items: center;
    color: $black;
    padding: 0 14px;
    margin-left: -14px;
    svg {
      margin-right: 10px;
    }
  }
}
</style>

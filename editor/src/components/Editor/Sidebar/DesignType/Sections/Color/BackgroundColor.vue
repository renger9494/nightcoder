<template>
  <color-section
    :value="value"
    :header="header"
    style-property="background"
    :color-props="backgroundColorProps"
    :hide="isBackgroundColorHidden"
    @changeColor="onChangeBackgroundColor"
    @hide="onHideBackgroundColor"
    :is-gradient="isGradient"
    :gradient-color="compiledBackground.background"
  />
</template>

<script lang="ts">
import ColorSection from './Color.vue';
import { computed, defineComponent, PropType } from '@vue/composition-api';
import useBackgroundEditor from '@/hooks/editor/visual/background.editor.hook';

export default defineComponent({
  name: 'BackgroundColor',
  components: {
    ColorSection
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    header: {
      type: String,
      default: 'Background Color'
    }
  },
  setup(props, { root }) {
    const previewMode = computed(() => root.$store.state.editor.previewMode);

    const styles = computed(() => {
      return props.value.styles[previewMode.value];
    });

    const {
      cssPropertyProps: backgroundColorProps,
      setHideCssProperty: hideBackgroundColor,
      setCssProperty: setBackgroundColor,
      isCssPropertyHidden: isBackgroundColorHidden,
      cssPropertyStyle: compiledBackground,
      isBackgroundPropertyGradient: isGradient
    } = useBackgroundEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const onHideBackgroundColor = function (hide: boolean) {
      hideBackgroundColor(hide);
    };

    function onChangeBackgroundColor(color: { opacity: number; color: string; background?: string }) {
      setBackgroundColor(color);
    }

    return {
      isGradient,
      compiledBackground,
      backgroundColorProps,
      isBackgroundColorHidden,
      onHideBackgroundColor,
      onChangeBackgroundColor
    };
  }
});
</script>

<style lang="scss">
.dte-color {
  &__features {
    &_title {
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: #828282;
      margin-bottom: 14px;
    }

    &_row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      span {
        border: 0.5px solid #bdc2c7;
        box-sizing: border-box;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-right: 14px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>

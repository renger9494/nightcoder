<template>
  <color-section
    :value="value"
    :header="header"
    style-property="textColor"
    :color-props="textColorProps"
    :hide="isTextColorHidden"
    @changeColor="onChangeTextColor"
    @hide="onHideTextColor"
    :is-gradient="isGradient"
    :isOnlyColor="isOnlyColor"
    :gradient-color="compiledBackground.color"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import useTextColorEditor from '@/hooks/editor/visual/textColor.editor.hook';
import ColorSection from './Color.vue';

export default defineComponent({
  name: 'TextColor',
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
      default: 'text'
    },
    isTextColor: {
      type: Boolean,
      default: false
    },
    isOnlyColor: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root }) {
    const previewMode = computed(() => root.$store.state.editor.previewMode);
    const gradientColor = computed(() => props.value.styles[previewMode.value].color);

    const styles = computed(() => {
      return props.value.styles[previewMode.value];
    });

    const {
      cssPropertyProps: textColorProps,
      hideTextColorProps: hideTextColor,
      setCssProperty: setTextColor,
      isCssPropertyHidden: isTextColorHidden,
      cssPropertyStyle: compiledBackground,
      isTextColorPropertyGradient: isGradient
    } = useTextColorEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'color'
    });

    const onHideTextColor = function (hide: boolean) {
      hideTextColor(hide);
    };

    function onChangeTextColor(color: { color: string; opacity: number }) {
      setTextColor(color);
    }

    return {
      isGradient,
      gradientColor,
      textColorProps,
      isTextColorHidden,
      compiledBackground,
      onHideTextColor,
      onChangeTextColor
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

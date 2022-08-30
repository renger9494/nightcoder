<template>
  <color-section
    :value="value"
    :header="header"
    style-property="textColor"
    :color-props="textColorProps"
    :hide="isTextColorHidden"
    @changeColor="onChangeTextColor"
    @hide="onHideTextColor"
    :isOnlyColor="true"
  />
</template>

<script lang="ts">
import ColorSection from './Color.vue';
import { computed, defineComponent } from '@vue/composition-api';
import useColorEditor from '@/hooks/editor/visual/color.editor.hook';

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
      setHideCssProperty: hideTextColor,
      setCssProperty: setTextColor,
      isCssPropertyHidden: isTextColorHidden
    } = useColorEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const onHideTextColor = function(hide: boolean) {
      hideTextColor(hide);
    };

    function onChangeTextColor(color: any) {
      setTextColor(color);
    }

    return {
      gradientColor,
      textColorProps,
      isTextColorHidden,
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

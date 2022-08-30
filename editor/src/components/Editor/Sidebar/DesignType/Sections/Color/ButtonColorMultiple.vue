<template>
  <color-section
    :header="header"
    style-property="textColor"
    :color-props="textColor"
    :hide="isTextColorHidden"
    :isOnlyColor="true"
    :is-mixed="isMixed"
    @changeColor="onChangeTextColor"
    @hide="onHideTextColor"
  />
</template>

<script lang="ts">
import ColorSection from './Color.vue';
import { computed, defineComponent } from '@vue/composition-api';
import useColorMultipleEditor from '@/hooks/editor/visual/multiple/colorMultiple.editor.hook';

export default defineComponent({
  name: 'TextColor',
  components: {
    ColorSection
  },
  props: {
    value: {
      type: Array,
      default: () => []
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
    const gradientColor = computed(() => (props.value as Array<any>)[0]?.styles[previewMode.value].color);

    const styles = computed(() => {
      return (props.value as Array<any>)[0]?.styles[previewMode.value];
    });

    const isMixed = computed(() => {
      const firstElementPathValue = (props.value as Array<any>)[0]?.styles[previewMode.value].color;
      return props.value.reduce(
        (_: any, el: any) => firstElementPathValue !== el.styles[previewMode.value].color,
        false
      );
    });

    const {
      cssPropertyProps: textColorProps,
      setHideCssProperty: hideTextColor,
      setCssProperty: setTextColor,
      isCssPropertyHidden: isTextColorHidden
    } = useColorMultipleEditor({
      elements: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const textColor = computed(() => {
      if (isMixed.value) return { color: '', opacity: '' };

      return textColorProps.value;
    });

    const onHideTextColor = function(hide: boolean) {
      hideTextColor(hide);
    };

    function onChangeTextColor(color: any) {
      setTextColor({ color: color.color, opacity: color.opacity ? color.opacity : 100 });
    }

    return {
      gradientColor,
      isTextColorHidden,
      isMixed,
      textColor,
      onHideTextColor,
      onChangeTextColor
    };
  }
});
</script>


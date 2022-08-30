<template>
  <color-section
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
import { computed, defineComponent } from '@vue/composition-api';
import useBackgroundMultipleEditor from '@/hooks/editor/visual/multiple/backgroundMultiple.editor.hook';

export default defineComponent({
  name: 'BackgroundColorMultiple',
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
      default: 'Background Color'
    }
  },
  setup(props, { root }) {
    const previewMode = computed(() => root.$store.state.editor.previewMode);

    const styles = computed(() => {
      return (props.value as Array<any>)[0]?.styles[previewMode.value];
    });

    const {
      cssPropertyProps: backgroundColorProps,
      setHideCssProperty: hideBackgroundColor,
      setCssProperty: setBackgroundColor,
      isCssPropertyHidden: isBackgroundColorHidden,
      cssPropertyStyle: compiledBackground,
      isBackgroundPropertyGradient: isGradient
    } = useBackgroundMultipleEditor({
      elements: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const onHideBackgroundColor = function(hide: boolean) {
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

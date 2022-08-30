<template>
  <component
    :is="hrefValue ? 'a' : 'div'"
    :href="hrefValue ? hrefValue : null"
    :target="openType"
    :download="isDownload ? 'airtap.io' : null"
    :class="[value.id, 'rect']"
    :style="computedStyle"
  />
</template>

<script lang="ts">
import { useRectangleElementCommonEditorFunctionality } from '@/components/Editor/Elements/rectangleElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';

export default defineComponent({
  name: 'RectangleElementEditor',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    previewMode: {
      type: String,
      default: 'laptop'
    }
  },
  setup(props, { root }) {
    useDisplayConditions({
      element: { value: props.value },
      conditions: [
        { condition: 'hideBackgroundColor', value: false },
        { condition: 'hideBorder', value: false },
        { condition: 'hideBoxShadow', value: false }
      ],
      store: root.$store
    });

    const rectangleCommonEditorFunctionality = useRectangleElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      ...rectangleCommonEditorFunctionality
    };
  }
});
</script>

<style lang="scss">
.rect {
  display: block;
  transition: opacity 0.3s linear;
}

a.rect {
  &:hover {
    opacity: 0.5;
  }
}
</style>

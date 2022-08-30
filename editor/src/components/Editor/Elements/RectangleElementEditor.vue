<template>
  <div :id="value.id" :class="value.id" :style="computedStyle" />
</template>

<script lang="ts">
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { useAnchorPointsByLocation } from '@/hooks/editor/anchorPoints.hook';
import { useRectangleElementCommonEditorFunctionality } from '@/components/Editor/Elements/rectangleElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';

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
    // Editor functionality
    useDisplayConditions({
      element: { value: props.value },
      conditions: [
        { condition: 'hideBackgroundColor', value: false },
        { condition: 'hideBorder', value: false },
        { condition: 'hideBoxShadow', value: false }
      ],
      store: root.$store
    });

    useAnchorPointsByLocation({
      element: props.value,
      location: computed(() => props.value.location[props.previewMode]),
      store: root.$store
    });

    // Common editor functionality
    const rectangleCommonEditorFunctionality = useRectangleElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      // Common editor functionality
      ...rectangleCommonEditorFunctionality
    };
  }
});
</script>

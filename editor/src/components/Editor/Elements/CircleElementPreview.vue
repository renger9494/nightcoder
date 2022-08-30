<template>
  <component
    :is="hrefValue ? 'a' : 'div'"
    :href="hrefValue ? hrefValue : null"
    :target="openType"
    :download="isDownload ? 'airtap.io' : null"
    :class="[value.id, 'circle']"
    :style="computedStyle"
  />
</template>

<script lang="ts">
import { useCircleElementCommonEditorFunctionality } from '@/components/Editor/Elements/circleElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';

export default defineComponent({
  name: 'CircleElementPreview',
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

    const circleCommonEditorFunctionality = useCircleElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      ...circleCommonEditorFunctionality
    };
  }
});
</script>

<style lang="scss">
.circle {
  display: block;
  transition: opacity 0.3s linear;
}

a.circle {
  &:hover {
    opacity: 0.5;
  }
}
</style>

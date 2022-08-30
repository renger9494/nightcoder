<template>
  <component :is="tag" :id="value.id" :class="value.id" :style="computedStyle" class="text-element">
    <contenteditable-span
      :drag-selector="'.drag-container'"
      :full-value="value"
      :style="textStyle"
      :value="value.payload.content"
      @processInput="processInput"
    />
  </component>
</template>

<script lang="ts">
import ContenteditableSpan from '@/components/Editor/Elements/ContenteditableSpan.vue';

import { useAnchorPointsByLocation } from '@/hooks/editor/anchorPoints.hook';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { useTextElementCommonEditorFunctionality } from '@/components/Editor/Elements/textElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TextElementEditor',
  components: {
    ContenteditableSpan
  },
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
        { condition: 'hideColor', value: false },
        { condition: 'hideFont', value: false }
      ],
      store: root.$store
    });

    useAnchorPointsByLocation({
      element: props.value,
      location: computed(() => props.value.location[props.previewMode]),
      store: root.$store
    });

    function processInput(v: string) {
      root.$store.commit('editor/changeElementPayload', {
        id: props.value.id,
        path: 'content',
        value: v
      });
    }

    // Common editor functionality
    const textCommonEditorFunctionality = useTextElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      // Editor functionality
      processInput,

      // Common editor functionality
      ...textCommonEditorFunctionality,

      tag: 'span'
    };
  }
});
</script>

<style lang="scss" scoped>
.text-element {
  display: block;
  span {
    -webkit-background-clip: text !important;
    color: transparent;
    display: block;
    word-break: break-word;
  }
}
</style>

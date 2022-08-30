<template>
  <component
    :is="tag"
    :href="hrefValue ? hrefValue : null"
    :target="openType"
    :download="isDownload ? 'airtap.io' : null"
    :class="value.id"
    class="text-element"
    :style="computedStyle"
  >
    <div :style="textStyle" v-html="value.payload.content"></div>
  </component>
</template>

<script lang="ts">
import ContenteditableSpan from '@/components/Editor/Elements/ContenteditableSpan.vue';
import { useTextElementCommonEditorFunctionality } from '@/components/Editor/Elements/textElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';

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
    useDisplayConditions({
      element: { value: props.value },
      conditions: [
        { condition: 'hideColor', value: false },
        { condition: 'hideFont', value: false }
      ],
      store: root.$store
    });

    const textCommonEditorFunctionality = useTextElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      ...textCommonEditorFunctionality
    };
  }
});
</script>

<style lang="scss" scoped>
.text-element {
  text-decoration: none;
  word-break: break-word;
  transition: opacity 0.3s linear;
  display: block;

  & div > ::v-deep * {
    font: inherit!important;
  }
}
a.text-element {
  &:hover {
    opacity: 0.5;
  }
}
</style>

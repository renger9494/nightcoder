<template>
  <component
    :is="hrefValue !== '' ? 'a' : 'div'"
    :id="value.id"
    :target="value.payload.link.openType === 'new' ? '_blank' : ''"
    :class="value.id"
    :style="computedStyle"
    class="button-element"
  >
    <img
      v-if="!isIconHidden && isIconLeft && iconSrc"
      :src="iconSrc"
      :style="iconSize"
      alt="button icon"
      class="button-element__icon"
    />
    <contenteditable-span
      :value="value.payload.content"
      :drag-selector="'.drag-container'"
      :full-value="value"
      :style="textStyle"
      :is-element-not-resizable-on-text-change="true"
      @processInput="processInput"
    />
    <img
      v-if="!isIconHidden && !isIconLeft && iconSrc"
      :src="iconSrc"
      :style="iconSize"
      alt="button icon"
      class="button-element__icon"
    />
  </component>
</template>

<script lang="ts">
import ContenteditableSpan from '@/components/Editor/Elements/ContenteditableSpan.vue';

import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { useAnchorPointsByLocation } from '@/hooks/editor/anchorPoints.hook';
import { useButtonElementCommonEditorFunctionality } from '@/components/Editor/Elements/buttonElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ButtonElementEditor',
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
        { condition: 'hideBackgroundColor', value: false },
        { condition: 'hideColor', value: false },
        { condition: 'hideFont', value: false },
        { condition: 'boxShadow', value: false },
        { condition: 'hideBorder', value: false }
      ],
      store: root.$store
    });

    useAnchorPointsByLocation({
      element: props.value,
      location: computed(() => props.value.location[props.previewMode]),
      store: root.$store
    });

    function processInput(value: string) {
      root.$store.commit('editor/changeElementPayload', {
        id: props.value.id,
        path: 'content',
        value: value
      });
    }

    // Common editor functionality
    const buttonCommonEditorFunctionality = useButtonElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      // Editor functionality
      processInput,

      // Common editor functionality
      ...buttonCommonEditorFunctionality
    };
  }
});
</script>

<style lang="scss" scoped>
.button-element {
  display: block;
  height: 100%;
  width: 100%;
  box-sizing: border-box;

  &__icon {
    height: auto;
  }
}
</style>

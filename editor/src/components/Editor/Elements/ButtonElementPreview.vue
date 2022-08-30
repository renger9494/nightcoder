<template>
  <component
    :is="hrefValue ? 'a' : 'div'"
    :href="hrefValue ? hrefValue : null"
    :target="openType"
    :download="isDownload ? 'airtap.io' : null"
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
    <div :full-value="value" :style="textStyle">
      {{ value.payload.content }}
    </div>
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
import { useButtonElementCommonEditorFunctionality } from '@/components/Editor/Elements/buttonElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';

export default defineComponent({
  name: 'ButtonElementPreview',
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
        { condition: 'hideBackgroundColor', value: false },
        { condition: 'hideColor', value: false },
        { condition: 'hideFont', value: false },
        { condition: 'boxShadow', value: false },
        { condition: 'hideBorder', value: false }
      ],
      store: root.$store
    });

    const buttonCommonEditorFunctionality = useButtonElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
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
  text-decoration: none;
  transition: opacity 0.3s linear;

  &__icon {
    height: auto;
  }
}

a.button-element {
  &:hover {
    opacity: 0.5;
  }
}
</style>

<template>
  <div class="form-button-element" :style="computedStyle" :id="value.id" :class="value.id">
    <span>{{ value.payload.text }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import { useFormButtonCommonEditorFunctionalityHook } from '@/components/Editor/Elements/FormElements/formButtonCommonEditorFunctionality.hook';

export default defineComponent({
  name: 'ButtonInputPreview',
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
    const styles = useFormButtonCommonEditorFunctionalityHook(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );
    return {
      ...styles
    };
  }
});
</script>

<style lang="scss" scoped>
.form-button-element {
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: 0.3s;

  span {
    font: inherit;
    width: 100%;
    display: block;
  }

  &:hover {
    opacity: 0.6;
  }
}
</style>

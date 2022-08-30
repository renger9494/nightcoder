<template>
  <button class="form-button-element" :style="computedStyle" :id="value.id" :class="value.id">
    <span>{{ value.payload.text }}</span>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { useFormButtonCommonEditorFunctionalityHook } from '@/components/Editor/Elements/FormElements/formButtonCommonEditorFunctionality.hook';

export default defineComponent({
  name: 'FormInputEditor',
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

  span {
    font: inherit;
    width: 100%;
    display: block;
  }
}
</style>

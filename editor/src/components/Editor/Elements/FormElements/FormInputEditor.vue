<template>
  <div class="form-input-element" :id="value.id" :class="value.id">
    <input :style="computedStyle" :placeholder="placeholder" disabled />
  </div>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api';
import { useFormInputCommonEditorFunctionalityHook } from '@/components/Editor/Elements/FormElements/formInputCommonEditorFunctionality.hook';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';

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
        { condition: 'hideFont', value: false },
        { condition: 'hideBorder', value: false },
        { condition: 'boxShadow', value: false },
      ],
      store: root.$store
    });
    const styles = useFormInputCommonEditorFunctionalityHook(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );
    return {
      ...styles,
      placeholder: computed(() => props.value.payload.text)
    };
  }
});
</script>

<style lang="scss" scoped>
.form-input-element {
  width: 100%;
  height: 100%;

  input {
    display: block;
    width: 100%;
    height: 100%;

    &::placeholder {
      color: inherit;
      font: inherit;
      opacity: 0.7;
    }
  }
}
</style>

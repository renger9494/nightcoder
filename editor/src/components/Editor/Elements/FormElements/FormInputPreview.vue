<template>
  <div class="form-input-element" :id="value.id" :class="value.id">
    <input :style="computedStyle" :placeholder="placeholder" />
  </div>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api';
import { useFormInputCommonEditorFunctionalityHook } from '@/components/Editor/Elements/FormElements/formInputCommonEditorFunctionality.hook';

export default defineComponent({
  name: 'FormInputPreview',
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
    transition: 0.3s;

    &::placeholder {
      color: inherit;
      font: inherit;
      opacity: 0.5;
    }

    &:focus {
      border-color: $blue200!important;
    }
  }
}
</style>

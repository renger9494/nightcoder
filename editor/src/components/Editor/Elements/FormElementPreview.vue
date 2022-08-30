<template>
  <div class="form-element" :style="computedStyle" :id="value.id" :class="value.id">
    <component
      v-for="(item, index) in elements"
      :is="`Form${_startCase(item.type)}Preview`"
      v-model="elements[index]"
      :key="`${index}_${item.id}`"
    />
  </div>
</template>

<script lang="ts">
import { startCase as _startCase } from 'lodash';
import { computed, defineComponent } from '@vue/composition-api';
import FormInputPreview from '@/components/Editor/Elements/FormElements/FormInputPreview.vue';
import FormButtonPreview from '@/components/Editor/Elements/FormElements/FormButtonPreview.vue';
import { useFormElementCommonEditorFunctionality } from '@/components/Editor/Elements/formElementCommonEditorFunctionality.hook';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';

export default defineComponent({
  name: 'FormElementPreview',
  components: {
    FormInputPreview,
    FormButtonPreview
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
        { condition: 'hideDisplay', value: false },
        { condition: 'hideGridAutoFlow', value: false },
        { condition: 'hideGridGap', value: false },
        { condition: 'hideGridTemplateRows', value: false }
      ],
      store: root.$store
    });

    const styles = useFormElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      _startCase,
      elements: props.value.elements,
      ...styles
    };
  }
});
</script>

<style lang="scss" scoped>
.form-element {
  height: 100%;
}
</style>

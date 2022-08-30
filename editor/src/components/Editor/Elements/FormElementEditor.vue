<template>
  <div class="form-element" :style="computedStyle" :id="value.id" :class="value.id">
    <component
      v-for="(item, index) in elements"
      :is="`Form${_startCase(item.type)}Editor`"
      :value="item"
      :key="`${index}_${item.id}`"
    />
  </div>
</template>

<script lang="ts">
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { startCase as _startCase } from 'lodash';
import { computed, defineComponent } from '@vue/composition-api';
import { useAnchorPointsByLocation } from '@/hooks/editor/anchorPoints.hook';
import FormInputEditor from '@/components/Editor/Elements/FormElements/FormInputEditor.vue';
import FormButtonEditor from '@/components/Editor/Elements/FormElements/FormButtonEditor.vue';
import { useFormElementCommonEditorFunctionality } from '@/components/Editor/Elements/formElementCommonEditorFunctionality.hook';

export default defineComponent({
  name: 'FormElementEditor',
  components: {
    FormInputEditor,
    FormButtonEditor
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

    useAnchorPointsByLocation({
      element: props.value,
      location: computed(() => props.value.location[props.previewMode]),
      store: root.$store
    });

    const styles = useFormElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      _startCase,
      elements: computed(() => props.value.elements as any[]),
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

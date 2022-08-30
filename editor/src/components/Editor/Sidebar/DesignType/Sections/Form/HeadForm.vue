<template>
  <div class="sidebar-block" :class="{ 'sidebar-block--merged': activeType === 'form' }">
    <switcher class="sidebar-block__row" :switcher-items="switcherItems" @filterName="changeSwitch" />
    <form-select
      class="sidebar-block__row"
      v-if="activeType !== 'form'"
      :active-type="activeType"
      :list="elements"
      @change="chooseElement"
    />
    <div v-if="activeType !== 'form'" class="sidebar-block__row sidebar-block__row--sb">
      <prefix-input :type="'h'" :unit="'px'" @inputHandler="changeElementStyle" :value="height" />
      <prefix-input
        :class="'nm'"
        :type="'borderRadius'"
        :unit="'px'"
        @inputHandler="changeElementStyle"
        :value="borderRadius"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import FormSelect from '@/components/Editor/Sidebar/DesignType/Sections/Form/FormSelect.vue';
import Switcher from '@/components/Editor/Sidebar/Switcher.vue';
import useCssMultipleStylesEditor from '@/hooks/editor/visual/multiple/cssMultipleStyle.editor.hook';

export default defineComponent({
  name: 'Head',
  components: {
    FormSelect,
    Switcher
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    block: {
      type: [String, Number],
      required: true
    },
    elements: {
      type: Array,
      required: true
    },
    selectedElements: {
      type: Array,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const elementName = computed(() => props.value.name);
    const activeType = ref('form');

    function chooseElement(type: any) {
      activeType.value = type.name;
      emit('chooseElement', type);
    }

    function changeSwitch(item: string) {
      const itemName = item.toLowerCase();
      if (itemName === 'form') {
        emit('chooseElement', { name: 'form' });
        activeType.value = 'form';
      } else {
        emit('chooseElement', { name: 'input' });
        activeType.value = 'input';
      }
    }

    const previewMode = computed(() => root.$store.state.editor.previewMode);

    const styles = computed(() => {
      return (props.selectedElements as Array<any>)[0]?.styles[previewMode.value];
    });

    const { numberValue: borderRadius, setCssProperty: setBorderRadius } = useCssMultipleStylesEditor({
      elements: computed(() => props.selectedElements),
      style: styles,
      store: root.$store,
      cssProperty: 'borderRadius'
    });

    const { numberValue: height, setCssProperty: setHeight } = useCssMultipleStylesEditor({
      elements: computed(() => props.selectedElements),
      style: styles,
      store: root.$store,
      cssProperty: 'height'
    });

    function changeElementStyle(val: any) {
      if (val.type === 'h') {
        setHeight(`${val.data}px`);
        root.$store.commit('editor/changeElementLocation', {
          element: props.value,
          data: { resizeImmediately: true }
        });
      } else {
        setBorderRadius(`${val.data}px`);
      }
    }

    return {
      changeSwitch,
      chooseElement,
      changeElementStyle,
      borderRadius,
      previewMode,
      elementName,
      activeType,
      height,
      switcherItems: [
        { name: 'Form', isActive: true },
        { name: 'Elements', isActive: false }
      ]
    };
  }
});
</script>

<style lang="scss">
.dte-type {
  &__select {
    margin: 0 0 0 10px;
    flex: 1;
    color: $black;
  }
}
.dte-form {
  &__switch {
    margin: 0 0 16px;
  }
}
</style>

<template>
  <div class="sidebar-block">
    <align class="sidebar-block__row" />
    <div class="sidebar-block__row sidebar-block__row--sb">
      <prefix-input :type="'x'" :unit="'px'" @inputHandler="changeElementLocation" :value="getChangingData('x')" />
      <prefix-input
        :class="'nm'"
        :type="'y'"
        :unit="'px'"
        @inputHandler="changeElementLocation"
        :value="getChangingData('y')"
      />
    </div>
    <div class="sidebar-block__row sidebar-block__row--sb">
      <prefix-input :type="'w'" :unit="'px'" @inputHandler="changeElementLocation" :value="getChangingData('w')" />
      <prefix-input
        :class="'nm'"
        :type="'h'"
        :unit="'px'"
        @inputHandler="changeElementLocation"
        :value="getChangingData('h')"
      />
    </div>
    <div class="sidebar-block__row sidebar-block__row--sb">
      <prefix-input :type="'gridGap'" :unit="'px'" @inputHandler="changeElementsParam" :value="getGridGap()" />
    </div>
  </div>
</template>

<script lang="ts">
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import Align from '@/components/Editor/Sidebar/DesignType/Sections/Align.vue';
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Dimension',
  components: { Align },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    block: {
      type: [String, Number],
      required: true
    },
    isHideBorderRadius: {
      type: Boolean,
      default: () => false
    },
    isActiveProportionButton: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root }) {
    const previewMode = computed(() => root.$store.state.editor.previewMode);
    const changingElementData = computed(() => root.$store.state.editor.uxCriticalData.changingElementData);

    const { displayConditions } = useDisplayConditions({
      element: computed(() => props.value),
      conditions: [{ condition: 'isEnableWidthHeightProportion' }],
      store: root.$store
    });

    function getChangingData(data: any) {
      if (changingElementData?.value && changingElementData.value[data] !== undefined) {
        return changingElementData.value[data];
      } else {
        return props.value.location[previewMode.value][data];
      }
    }

    function changeElementLocation(value: any) {
      const isChangeWidthOrHeight = ['w', 'h'].includes(value.type);
      if (isChangeWidthOrHeight && displayConditions.value.isEnableWidthHeightProportion) {
        const { w, h } = props.value.location[previewMode.value];
        const newData = value.type == 'w' ? (+value.data * h) / w : (+value.data * w) / h;
        const newProportion = {
          type: value.type == 'w' ? 'h' : 'w',
          data: Math.round(newData * 100) / 100
        };

        root.$store.commit('editor/changeElementLocation', {
          element: props.value,
          data: { [newProportion.type]: newProportion.data }
        });
      }

      root.$store.commit('editor/changeElementLocation', {
        element: props.value,
        data: { [value.type]: value.data, resizeImmediately: isChangeWidthOrHeight }
      });
    }

    function changeElementsParam(value: any) {
      root.$store.commit('editor/changeComponentStyle', {
        component: props.value,
        data: { [value.type]: value.data + 'px' }
      });
      root.$store.commit('editor/changeElementLocation', {
        element: props.value,
        data: { resizeImmediately: true },
        isSaveHistory: false
      });
    }

    function getGridGap() {
      const regex = /[0-9]*/g;
      return (
        props.value.styles[previewMode.value].gridGap && props.value.styles[previewMode.value].gridGap.match(regex)[0]
      );
    }

    return {
      previewMode,
      getChangingData,
      displayConditions,
      changeElementLocation,
      changeElementsParam,
      getGridGap
    };
  }
});
</script>

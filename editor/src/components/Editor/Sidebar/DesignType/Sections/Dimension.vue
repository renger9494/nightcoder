<template>
  <div class="sidebar-block">
    <align class="sidebar-block__row" />
    <div class="sidebar-block__row sidebar-block__row--sb">
      <prefix-input :type="'x'" :unit="'px'" @inputHandler="changeElementLocation" :value="getChangingData('x')" />
      <prefix-input :type="'y'" :unit="'px'" @inputHandler="changeElementLocation" :value="getChangingData('y')" />
    </div>
    <div class="sidebar-block__row">
      <prefix-input
        class="sidebar-block__item sidebar-block__item--xs"
        :type="'w'"
        :unit="'px'"
        @inputHandler="changeElementLocation"
        :value="getChangingData('w')"
      />
      <square-icon-btn
        class="sidebar-block__item sidebar-block__item--center sidebar-block__item--xs"
        :class="{ 'btn-hidden': !isActiveProportionButton }"
        :icon-settings="{
          name: !!displayConditions.isEnableWidthHeightProportion
            ? 'width-height-proportion-active-icon'
            : 'width-height-proportion-icon',
          width: '24',
          height: '24'
        }"
        @click="setWidthHeightProportion"
        :is-active="!!displayConditions.isEnableWidthHeightProportion"
        v-tooltip="'Constrain proportions'"
      />
      <prefix-input
        :class="'nm'"
        :type="'h'"
        :unit="'px'"
        @inputHandler="changeElementLocation"
        :value="getChangingData('h')"
      />
    </div>
    <div class="sidebar-block__row sidebar-block__row--sb">
      <prefix-input
        :type="'a'"
        unit=""
        :isUnitBig="true"
        @inputHandler="changeElementLocation"
        :value="value.location[previewMode].a"
        v-tooltip="'Rotation'"
      />
      <prefix-input
        :class="'nm'"
        :type="'borderRadius'"
        :unit="'px'"
        v-if="!isHideBorderRadius"
        @inputHandler="changeElementsParam"
        :value="getBorderRadius()"
        v-tooltip="'Corner radius'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { computed, defineComponent } from '@vue/composition-api';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
import Align from '@/components/Editor/Sidebar/DesignType/Sections/Align.vue';

export default defineComponent({
  name: 'Dimension',
  components: { Align, SquareIconBtn },
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

    const { setDisplayCondition, displayConditions } = useDisplayConditions({
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
    }

    function getBorderRadius() {
      const regex = /[0-9]*/g;
      return (
        props.value.styles[previewMode.value].borderRadius &&
        props.value.styles[previewMode.value].borderRadius.match(regex)[0]
      );
    }

    function setWidthHeightProportion() {
      if (!props.isActiveProportionButton) return;

      setDisplayCondition({
        id: props.value.id,
        condition: 'isEnableWidthHeightProportion',
        value: !displayConditions.value.isEnableWidthHeightProportion
      });
    }

    return {
      previewMode,
      displayConditions,
      getChangingData,
      setWidthHeightProportion,
      changeElementLocation,
      changeElementsParam,
      getBorderRadius
    };
  }
});
</script>

<style lang="scss">
.btn-hidden {
  opacity: 0;
  visibility: hidden;
}
</style>

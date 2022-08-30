<template>
  <div class="multiselection-type">
    <head-section :value="value" :is-link="false" />

    <div class="sidebar-block">
      <align-section class="sidebar-block__row" />

      <div class="sidebar-block__row sidebar-block__row--sb">
        <div class="multiselection-type__field-item">
          <span v-if="isLocationMixed('x') && !activeAxis.x">Mixed</span>
          <prefix-input
            ref="x"
            :type="'x'"
            :unit="'px'"
            @inputHandler="setElementsLocation('x')"
            @blur="activeAxis.x = false"
            @focus="activeAxis.x = true"
            :value="elementsX"
          />
        </div>
        <div class="multiselection-type__field-item">
          <span v-if="isLocationMixed('y') && !activeAxis.y">Mixed</span>
          <prefix-input
            ref="y"
            :type="'y'"
            :unit="'px'"
            @inputHandler="setElementsLocation('y')"
            @blur="activeAxis.y = false"
            @focus="activeAxis.y = true"
            :value="elementsY"
          />
        </div>
      </div>
    </div>

    <font-section-multiple
      v-if="isTextElements"
      :value="selectedElementsFormated"
      :elements-to-resize="selectedElementsFormated"
      :isForm="false"
    />

    <button-color-multiple v-if="isTextElements" :value="selectedElementsFormated" header="Text color" />

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import AlignSection from '@/components/Editor/Sidebar/DesignType/Sections/Align.vue';
import HeadSection from '@/components/Editor/Sidebar/DesignType/Sections/Head.vue';
import FontSectionMultiple from '@/components/Editor/Sidebar/DesignType/Sections/Multiple/FontMultiple.vue';
import ButtonColorMultiple from '@/components/Editor/Sidebar/DesignType/Sections/Color/ButtonColorMultiple.vue';

export default Vue.extend({
  name: 'Multisection',
  components: {
    AlignSection,
    HeadSection,
    FontSectionMultiple,
    ButtonColorMultiple
  },
  data() {
    return {
      activeAxis: {
        x: false,
        y: false
      },
      value: {
        name: 'Group of Elements',
        type: 'Group of Elements'
      }
    };
  },
  props: {
    block: {
      type: [String, Number],
      required: true
    }
  },
  methods: {
    setElementsLocation(path: string) {
      const $pathRefs = (<any>this.$refs[path])?.$refs;
      if (!$pathRefs) return;
      const inputValue = $pathRefs.prefixInput.value;
      if (inputValue === '' || isNaN(+inputValue)) return;

      this.selectedElements.forEach((element: any) =>
        this.$store.commit('editor/changeElementLocation', {
          element: element.element,
          data: {
            [path]: +inputValue
          }
        })
      );
    },
    isLocationMixed(path: string) {
      const firstElementPathValue = this.selectedElements[0].element.location[this.previewMode][path];
      return this.selectedElements.reduce(
        (_: any, el: any) => firstElementPathValue !== el.element.location[this.previewMode][path],
        false
      );
    }
  },
  computed: {
    ...mapState({
      selectedElements: (state: any) => state.editor.selectedElements,
      changingElementData: (state: any) => state.editor.uxCriticalData.changingElementData,
      userConfig: (state: any) => state.editor.userConfig,
      previewMode: (state: any) => state.editor.previewMode
    }),
    elementsX(): number | string {
      if (this.isLocationMixed('x')) return '';

      return (
        this.changingElementData?.x ||
        this.userConfig.allComponents[this.selectedElements[0].element.id].location[this.previewMode].x
      );
    },
    elementsY(): number | string {
      if (this.isLocationMixed('y')) return '';

      return (
        this.changingElementData?.y ||
        this.userConfig.allComponents[this.selectedElements[0].element.id].location[this.previewMode].y
      );
    },
    isTextElements(): boolean {
      return !this.selectedElements.some((item: any) => item.element.type !== 'text')
    },
    selectedElementsFormated(): Array<any> {
      return this.selectedElements.map((item: any) => item.element);
    }
  }
});
</script>

<style lang="scss" scoped>
.multiselection-type {
  &__field-item {
    position: relative;
    &:first-child {
      margin-right: 34px;
    }

    span {
      font-size: 12px;
      line-height: 14px;
      color: #000;
      position: absolute;
      top: 10px;
      left: 22px;
    }
  }
}
</style>

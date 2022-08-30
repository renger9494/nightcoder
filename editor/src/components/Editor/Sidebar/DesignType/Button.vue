<template>
  <div class="design-text-editor">
    <head-section :value="value" />

    <dimension-section :value="value" :block="block" :isActiveProportionButton="true" />

    <font-section :value="value" :block="block" :is-button="true" />

    <button-color :value="value" header="Text color" />

    <background-color :value="value" header="Background color" />

    <button-icon :value="value" />

    <border-section :value="value" />

    <effects-section :value="value" />

    <!--    <position-section />-->

    <!--<arrange-section />-->
  </div>
</template>

<script lang="ts">
// import ArrangeSection from '@/components/Editor/Sidebar/DesignType/Sections/Arrange.vue';
// import PositionSection from '@/components/Editor/Sidebar/DesignType/Sections/Position/index.vue';
import Vue from 'vue';
import BorderSection from '@/components/Editor/Sidebar/DesignType/Sections/Border/Border.vue';
import ButtonColor from '@/components/Editor/Sidebar/DesignType/Sections/Color/ButtonColor.vue';
import DimensionSection from '@/components/Editor/Sidebar/DesignType/Sections/Dimension.vue';
import FontSection from '@/components/Editor/Sidebar/DesignType/Sections/Font.vue';
import HeadSection from '@/components/Editor/Sidebar/DesignType/Sections/Head.vue';
import EffectsSection from '@/components/Editor/Sidebar/DesignType/Sections/Effects/Effects.vue';
import BackgroundColor from '@/components/Editor/Sidebar/DesignType/Sections/Color/BackgroundColor.vue';
import ButtonIcon from '@/components/Editor/Sidebar/DesignType/Sections/ButtonIcon.vue';

export default Vue.extend({
  components: {
    ButtonIcon,
    // PositionSection,
    // ArrangeSection,
    BackgroundColor,
    BorderSection,
    ButtonColor,
    DimensionSection,
    FontSection,
    HeadSection,
    EffectsSection
  },
  props: {
    block: {
      type: [String, Number],
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    }
  }
});
</script>

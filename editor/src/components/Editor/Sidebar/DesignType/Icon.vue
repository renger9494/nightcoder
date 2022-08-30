<template>
  <div class="design-text-editor">
    <head-section :value="value" />

    <dimension-section :value="value" :block="block" :isActiveProportionButton="true" />
    <image-section :value="value" :block="block" :is-icon="true" />

    <border-section :value="value" />

    <!--    <position-section />-->

    <!--<arrange-section />-->

    <effects-section :value="value" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BorderSection from '@/components/Editor/Sidebar/DesignType/Sections/Border/Border.vue';
import DimensionSection from '@/components/Editor/Sidebar/DesignType/Sections/Dimension.vue';
import HeadSection from '@/components/Editor/Sidebar/DesignType/Sections/Head.vue';
import EffectsSection from '@/components/Editor/Sidebar/DesignType/Sections/Effects/EffectsIcon.vue';
import ImageSection from '@/components/Editor/Sidebar/DesignType/Sections/Image/Image.vue';
// import ArrangeSection from '@/components/Editor/Sidebar/DesignType/Sections/Arrange.vue';
// import ColorSection from '@/components/Editor/Sidebar/DesignType/Sections/Color/Color.vue';
// import FontSection from '@/components/Editor/Sidebar/DesignType/Sections/Font.vue';
// import PositionSection from '@/components/Editor/Sidebar/DesignType/Sections/Position/index.vue';

export default Vue.extend({
  components: {
    ImageSection,
    BorderSection,
    DimensionSection,
    HeadSection,
    EffectsSection
    // PositionSection,
    // ArrangeSection,
    // ColorSection,
    // FontSection,
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

<style lang="scss"></style>

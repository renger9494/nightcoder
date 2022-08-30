<template>
  <div class="design-text-editor">
    <head-section :value="value" />

    <dimension-section :value="value" :block="block" :isActiveProportionButton="true" />

    <image-section :value="value" :block="block" :is-icon="false" />

    <border-section :value="value" />

    <!--    <position-section :value="value" />-->

    <!--<arrange-section />-->

    <effects-section :value="value" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BorderSection from '@/components/Editor/Sidebar/DesignType/Sections/Border/Border.vue';
// import PositionSection from '@/components/Editor/Sidebar/DesignType/Sections/Position/index.vue';
import DimensionSection from '@/components/Editor/Sidebar/DesignType/Sections/Dimension.vue';
import HeadSection from '@/components/Editor/Sidebar/DesignType/Sections/Head.vue';
import EffectsSection from '@/components/Editor/Sidebar/DesignType/Sections/Effects/Effects.vue';
import ImageSection from '@/components/Editor/Sidebar/DesignType/Sections/Image/Image.vue';

export default Vue.extend({
  components: {
    ImageSection,
    // PositionSection,
    BorderSection,
    DimensionSection,
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

<style lang="scss"></style>

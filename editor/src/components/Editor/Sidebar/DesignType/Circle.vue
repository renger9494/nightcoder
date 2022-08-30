<template>
  <div class="design-text-editor">
    <head-section :value="value" />
    <dimension-section :value="value" :block="block" :is-hide-border-radius="true" :isActiveProportionButton="true" />
    <background-color-section :value="value" header="Background color" />
    <effects-section :value="value" />
    <border-section :value="value" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BorderSection from '@/components/Editor/Sidebar/DesignType/Sections/Border/Border.vue';
import BackgroundColorSection from '@/components/Editor/Sidebar/DesignType/Sections/Color/BackgroundColor.vue';
import DimensionSection from '@/components/Editor/Sidebar/DesignType/Sections/Dimension.vue';
import HeadSection from '@/components/Editor/Sidebar/DesignType/Sections/Head.vue';
import EffectsSection from '@/components/Editor/Sidebar/DesignType/Sections/Effects/Effects.vue';

export default Vue.extend({
  components: {
    EffectsSection,
    BorderSection,
    BackgroundColorSection,
    DimensionSection,
    HeadSection
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

<template>
  <div class="design-text-editor">
    <head-section :value="value" :is-link="false" />

    <dimension-section :value="value" :block="block" :isActiveProportionButton="true" />

    <code-section :value="value" :block="block" />

    <border-section :value="value" />
    <effects-section :value="value" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BorderSection from '@/components/Editor/Sidebar/DesignType/Sections/Border/Border.vue';
import HeadSection from '@/components/Editor/Sidebar/DesignType/Sections/Head.vue';
import DimensionSection from '@/components/Editor/Sidebar/DesignType/Sections/Dimension.vue';
import CodeSection from '@/components/Editor/Sidebar/DesignType/Sections/Code.vue';
import EffectsSection from '@/components/Editor/Sidebar/DesignType/Sections/Effects/Effects.vue';

export default Vue.extend({
  components: {
    HeadSection,
    DimensionSection,
    CodeSection,
    EffectsSection,
    BorderSection
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

<template>
  <div>
    <head-section :value="value" :is-link="false" />

    <dimension-section :value="value" :block="block" :isActiveProportionButton="true" />

    <video-settings :value="value" />

    <effects-section :value="value" />
  </div>
</template>

<script>
import Vue from 'vue';
import HeadSection from '@/components/Editor/Sidebar/DesignType/Sections/Head.vue';
import VideoSettings from '@/components/Editor/Sidebar/DesignType/Sections/VideoSettings';
import EffectsSection from '@/components/Editor/Sidebar/DesignType/Sections/Effects/Effects.vue';
import DimensionSection from '@/components/Editor/Sidebar/DesignType/Sections/Dimension.vue';

export default Vue.extend({
  name: 'Video',
  props: {
    block: {
      type: [String, Number],
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    DimensionSection,
    EffectsSection,
    VideoSettings,
    HeadSection
  }
});
</script>

<style lang="scss" scoped></style>

<template>
  <div ref="el" class="template-wrapper">
    <branding-tag v-if="value.branding" :value="brandingStyles" :style="brandingPosition" />

    <dynamic-block
      v-for="(block, index) in blocksSortedBySortId"
      :block="index"
      :value="block"
      :key="index"
      :root="value.root"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BrandingTag from '@/components/Publish/Elements/Branding.vue';
import DynamicBlock from '@/components/Editor/Elements/DynamicBlock/DynamicBlockPreview.vue';
import { mapGetters } from "vuex";

export default Vue.extend({
  name: 'CustomTemplatePreview',
  components: {
    DynamicBlock,
    BrandingTag
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    previewMode: {
      type: String,
      default: () => 'laptop'
    },
    siteSettings: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      brandingPosition: {
        bottom: '30px',
        top: undefined as undefined | string,
        left: undefined as undefined | string,
        transition: undefined as undefined | string
      }
    };
  },
  computed: {
    ...mapGetters({
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    }),
    brandingStyles(): any {
      return {
        theme: this.siteSettings.brandingTheme,
        position: this.siteSettings.brandingPosition
      };
    }
  },
  methods: {
    brandingPositionSetter: function () {
      const {top, height, right, left} = (<any>this.$refs.el)?.getBoundingClientRect();
      this.brandingPosition = {
        bottom: top + height < window.innerHeight ? 'unset' : '30px',
        top: +top + +height < +window.innerHeight ? `${(+top) + (+height) - 30 - 59}px` : 'unset',
        left: this.siteSettings.brandingPosition === 'BottomLeft' ? `${left + 30}px` : `${right - 97 - 30}px`,
        transition: 'unset'
      };
    }
  },
  mounted() {
    this.brandingPositionSetter();
  },
  watch: {
    previewMode() {
      this.$nextTick(() => {
        this.brandingPositionSetter();
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.template-wrapper {
  padding: 10px 0 0;
}
</style>

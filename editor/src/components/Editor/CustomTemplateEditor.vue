<template>
  <div ref="el" :class="previewMode" class="template-wrapper">
    <!-- <branding-tag v-if="value.branding" :value="value.branding" /> -->
    <!-- <component
      v-if="closestCta"
      :is="closestCta.integrations.active"
      :value="closestCta"
      :projectId="value.projectId"
    /> -->
    <!-- <span> container snaps </span> -->
    <div v-for="(x, i) in containterSnapLines.x" :key="i" class="container-snap" :style="calcSnapLineStyle(x)" />
    <dynamic-block
      v-for="(block, index) in blocksSortedBySortId"
      :key="`${block.id}_${previewMode}`"
      :block="index"
      :value="block"
      :root="value.root"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BrandingTag from '@/components/Publish/Elements/Branding.vue';
import DynamicBlock from '@/components/Editor/Elements/DynamicBlock/DynamicBlockEditor.vue';
import {mapGetters, mapState} from 'vuex';

type containerSnapLines = {
  x: Set<number>;
};

export default Vue.extend({
  name: 'CustomTemplateEditor',
  components: {
    DynamicBlock,
    BrandingTag
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    }),
    ...mapState({
      containterSnapLines: (state: any) => <containerSnapLines>state.editor.uxCriticalData.containerSnapLines,
      zoom: (state: any) => state.editor.zoom
    }),
    previewMode(): string {
      return this.$store.state.editor.previewMode;
    },
    isEditor(): boolean {
      return this.$route.name === 'editor';
    },
    favicon(): string | null {
      if (this.value.faviconImage) {
        return this.value.faviconImage.path;
      }
      return null;
    },
    closestCta(): any {
      let data = null;

      Object.keys(this.value.blocks).map(el => {
        if (this.value.blocks[el].cta && this.value.blocks[el].cta.form) {
          data = this.value.blocks[el].cta.form;
        }
      });

      return data;
    },
    userConfig(): any {
      return this.$store.state.editor.userConfig;
    },
    includeMailService(): boolean {
      return process.env.VUE_APP_IS_INSERT_FONT_LINK === 'true';
    }
  },
  watch: {
    blocksSortedBySortId() {
      this.$nextTick(() => this.setIframeHeight());
    },
    previewMode() {
      this.$nextTick(() => {
        this.setIframeHeight();
      });
    }
  },
  beforeUpdate() {
    this.setIframeHeight();
  },
  mounted() {
    this.setIframeHeight();
  },
  methods: {
    calcSnapLineStyle(x: number) {
      const el = this.$el! as HTMLDivElement;

      return `top:${el.offsetTop}px;
              left:${el.offsetLeft + x - 1}px;
              width: ${1 / this.zoom}px;
              height: ${el.offsetHeight}px;`;
    },
    setIframeHeight() {
      this.$store.commit('editor/changeEditorParam', {
        path: 'iframeHeight',
        value: this.$el.clientHeight
      });
    }
  }
});
</script>

<style lang="scss">
.container-snap {
  position: absolute;
  z-index: 100;
  background-color: #4356be;
}
</style>

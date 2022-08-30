<template>
  <div class="editor-size-bar">
    <div class="editor-size-bar__item">
      Template width:
      {{ templateWidth }}
      px;
    </div>
    <div class="editor-size-bar__item">
      Container width:
      {{ containerWidth >= templateWidth ? templateWidth : containerWidth }}px
    </div>
  </div>
</template>

<script>
//@deprecated
import { mapState } from 'vuex';

export default {
  data() {
    return {
      templateWidth: 0
    };
  },
  computed: {
    ...mapState({
      previewMode: state => state.editor.previewMode,
      userConfig: state => state.editor.userConfig
    }),
    containerWidth() {
      if (this.userConfig && this.userConfig.root) return this.userConfig.root.containerWidth;
      return false;
    }
  },
  watch: {
    previewMode() {
      setTimeout(() => {
        this.setTemplateWidth();
      }, 200);
    }
  },
  mounted() {
    this.setTemplateWidth();
  },
  methods: {
    setTemplateWidth() {
      if (document.getElementById('editor')) this.templateWidth = document.getElementById('editor').clientWidth - 100;
    }
  }
};
</script>

<style lang="scss">
.editor-size-bar {
  display: flex;
  align-content: center;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.03em;
  color: #000000;
  margin-bottom: 10px;
  &__item:first-child {
    margin: 0 50px 0 20px;
  }
}
</style>

<template>
  <div class="design-text-editor__section design-text-editor__collapse dte-height">
    <div class="design-text-editor__head">
      <span>Container width</span>
    </div>
    <div class="design-text-editor__content container-">
      <div class="dte-color__opacity-wrap dte-container-width">
        <input
          class="dte-color__opacity"
          ref="widthInput"
          :value="root.containerWidth"
          max="9999"
          min="0"
          type="number"
          @change="changeContainerWidth"
        />
        <span>px</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    root: {
      type: Object
    }
  },
  methods: {
    changeContainerWidth() {
      this.$store.commit('editor/changeRootParam', {
        path: 'containerWidth',
        data: +(<any>this.$refs.widthInput).value
      });
    }
  }
});
</script>

<style lang="scss">
.dte-container-width {
  .dte-color__opacity {
    width: 28px;
  }
}
</style>

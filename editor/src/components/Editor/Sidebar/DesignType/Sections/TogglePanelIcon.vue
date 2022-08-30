<template>
  <svg-icon v-if="!isPanelActive" name="plus-icon" width="10" height="10" color="#000" />
  <svg-icon v-else name="minus-icon" width="24" height="24" color="#000" />
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    isPanelActive: {
      type: Boolean,
      default: () => false
    }
  }
});
</script>

<style></style>

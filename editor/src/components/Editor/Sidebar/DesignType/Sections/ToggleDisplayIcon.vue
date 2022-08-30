<template>
  <svg-icon v-if="!isDisplay" name="hide" width="12" height="8" color="#000" />
  <svg-icon v-else name="unhide" width="12" height="10" color="#000" />
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    isDisplay: {
      type: Boolean,
      default: () => false
    }
  }
});
</script>

<style></style>

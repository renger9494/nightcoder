<template>
  <h2 class="title-elem">
    <slot></slot>
  </h2>
</template>

<style lang="scss" scoped>
.title-elem {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  margin-top: 0;
  margin-bottom: 20px;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

})
</script>

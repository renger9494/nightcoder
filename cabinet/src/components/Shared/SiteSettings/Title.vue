<template>
  <h2 class="title_elem" :class="{ title_elem_dark: theme === 'brown' }">
    <slot></slot>
  </h2>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    theme: {
      validator: function(value: string) {
        return ['brown'].indexOf(value) !== -1;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.title_elem {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  margin-top: 0;

  &_dark {
    font-weight: bold;
    font-size: 13px;
    line-height: 15px;
    margin: 0 0 8px;
    color: $black;
  }
}
</style>

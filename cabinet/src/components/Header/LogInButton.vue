<template>
  <router-link class="log-in-button" :to="url">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    url: String,
  },
})
</script>

<style lang="scss" scoped>
.log-in-button {
  display: inline-block;
  vertical-align: top;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  color: #ffffff;
  background-color: #000000;
  border-radius: $shape_border_radius;
  padding-top: 8px;
  padding-right: 22px;
  padding-bottom: 7px;
  padding-left: 22px;
}
</style>

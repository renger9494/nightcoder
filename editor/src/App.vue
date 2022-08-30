<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  computed: {
    layout(): string {
      if (!this?.$route?.meta?.layout) return 'default-layout';

      return `${this.$route.meta.layout}-layout`;
    }
  }
});
</script>

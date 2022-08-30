<template>
  <error />
</template>

<script lang="ts">
import Vue from 'vue'
import error from '@/components/Pages/404.vue'

export default Vue.extend({
  components: {
    error,
  },
  layout: 'profile'
})
</script>

<template>
  <error-component class="outer-page" />
</template>

<script lang="ts">
import Vue from 'vue'
import errorComponent from '@/components/Pages/404.vue'

export default Vue.extend({
  name: 'error',
  components: {
    errorComponent,
  },
  layout: 'profile',
})
</script>

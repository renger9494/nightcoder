<template>
  <div class="outer-page">
    <nav-component :is-white="true" />
    <Nuxt />
    <footer-component />
    <cookies-popup />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import NavComponent from '@/layouts/default/Nav.vue'
import FooterComponent from '@/components/Footer/Footer.vue'

import CookiesPopup from '@/components/Shared/CookiesPopup.vue'

export default Vue.extend({
  components: {
    NavComponent,
    FooterComponent,
    CookiesPopup,
  },
})
</script>

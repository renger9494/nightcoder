<template>
  <div>
    <nav-component />
    <div id="content">
      <Nuxt />
      <footer-component class="footer-line footer--main" />
    </div>
    <cookies-popup />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
const NavComponent = () => import(/* webpackPrefetch: true */ '@/layouts/default/Nav.vue')
import FooterComponent from '@/components/Footer/Footer.vue'
import CookiesPopup from '@/components/Shared/CookiesPopup.vue'
export default Vue.extend({
  components: {
    NavComponent,
    CookiesPopup,
    FooterComponent,
  },
})
</script>

<style lang="scss">
.outer-page {
  display: flex;
  flex-direction: column;
}
</style>

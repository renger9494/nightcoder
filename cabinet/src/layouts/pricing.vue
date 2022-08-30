<template>
  <div class="pricing-page outer-page">
    <nav-component :is-dark="true" :is-full="true" />
    <div class="content pricing-page__content">
      <Nuxt />
    </div>
    <footer-component class="footer-line" />
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

<style lang="scss" scoped>
.pricing-page {
  background-color: #ffffff;
  padding: 60px 0 0;

  &__content {
    padding: 0 0 80px;
  }

  &__footer {
    border-top: 1px solid #dadada;
  }
}
</style>

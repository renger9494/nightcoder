<template>
  <div class="login-page">
    <air-nav :is-white="true" />
    <main class="page_wrapper">
      <div class="login">
        <div class="container">
          <Nuxt />
        </div>
      </div>
      <div class="login__tails-wrapper">
        <div class="login__tail tail-1"></div>
        <div class="login__tail tail-2"></div>
        <div class="login__tail tail-3"></div>
      </div>
    </main>
    <air-footer />
    <cookies-popup />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
const AirNav = () => import(/* webpackPrefetch: true */ '@/layouts/default/Nav.vue')
import AirFooter from '@/components/Footer/Footer.vue'
import CookiesPopup from '@/components/Shared/CookiesPopup.vue'

export default Vue.extend({
  components: {
    AirNav,
    AirFooter,
    CookiesPopup,
  },
})
</script>

<style lang="scss" scoped>
.page_wrapper {
  margin-bottom: 140px;

  @include xl-down {
    margin-bottom: 60px;
  }

  @include lg-down {
    margin-bottom: 60px;
  }

  @include sm-down {
    margin-bottom: 50px;
  }
}
</style>

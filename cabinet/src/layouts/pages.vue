<template>
  <div class="page_wrapper">
    <header-component :type="'large'" :is-inner-page="true" />
    <div class="page_wrapper__container">
      <Nuxt />
    </div>
    <footer-component :type="'large'" />
    <cookies-popup />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HeaderComponent from '@/components/Header/Header.vue'
import CookiesPopup from '@/components/Shared/CookiesPopup.vue'
import FooterComponent from '@/components/Footer/Footer.vue'

export default Vue.extend({
  components: {
    HeaderComponent,
    CookiesPopup,
    FooterComponent,
  },
})
</script>

<style lang="scss" scoped>
.page_wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  &__container {
    flex-grow: 1;
    max-width: 1574px;
    width: 100%;
    padding-right: 60px;
    padding-left: 60px;
    margin-right: auto;
    margin-left: auto;

    @include sm-down {
      padding-right: 40px;
      padding-left: 40px;
    }

    @include xs-down {
      padding-right: 15px;
      padding-left: 15px;
    }
  }
}
</style>



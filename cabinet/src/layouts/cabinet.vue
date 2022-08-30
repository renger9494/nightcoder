<template>
  <div class="cabinet">
    <header-component :is-inner-page="true" />
    <div class="cabinet__container">
      <Nuxt />
    </div>
    <!--<help-block v-if="this.$route.name == 'projects'" />-->
    <footer-component class="footer-line" />
    <cookies-popup />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HeaderComponent from '@/components/Header/Header.vue'
import HelpBlock from '@/layouts/cabinet/HelpBlock.vue'
import UserInfo from '@/layouts/cabinet/UserInfo.vue'
import ProfileHead from '@/layouts/cabinet/ProfileHead.vue'
import FooterComponent from '@/components/Footer/Footer.vue'
import CookiesPopup from '@/components/Shared/CookiesPopup.vue'

export default Vue.extend({
  components: {
    HeaderComponent,
    UserInfo,
    FooterComponent,
    CookiesPopup,
    ProfileHead,
    HelpBlock,
  },
})
</script>

<style lang="scss">
.cabinet {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
  &__container {
    flex-grow: 1;
    max-width: 1280px;
    width: 100%;
    padding-right: 70px;
    padding-left: 70px;
    margin-right: auto;
    margin-left: auto;
    background: #fff;
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
.footer-line {
  border-top: 1px solid #f3f3f3;
}
</style>

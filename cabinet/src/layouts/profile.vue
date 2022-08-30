<template>
  <div class="profile">
    <air-header v-if="isUserLoggedIn" :is-inner-page="true" />
    <header-log-in v-else />

    <div class="profile__container">
      <Nuxt />
    </div>

    <air-footer
      v-if="
        !(
          $route.name == 'login' ||
          $route.name == 'forgot-password' ||
          $route.path == '/sign-up' ||
          $route.path == '/welcome'
        )
      "
      class="footer-line"
    />
    <cookies-popup />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AirHeader from '@/components/Header/Header.vue'
import HeaderLogIn from '@/components/Header/HeaderLogIn.vue'
import HelpBlock from '@/layouts/cabinet/HelpBlock.vue'
import UserInfo from '@/layouts/cabinet/UserInfo.vue'
import ProfileHead from '@/layouts/cabinet/ProfileHead.vue'
import AirFooter from '@/components/Footer/Footer.vue'
import CookiesPopup from '@/components/Shared/CookiesPopup.vue'
import { mapState } from 'vuex'
export default Vue.extend({
  components: {
    AirHeader,
    HeaderLogIn,
    UserInfo,
    AirFooter,
    CookiesPopup,
    ProfileHead,
    HelpBlock,
  },
  computed: {
    ...mapState({
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
    }),
  },
})
</script>

<style lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
  &__container {
    flex-grow: 1;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    background: #fff;
    padding-right: 0px;
    padding-left: 0px;
    /*  @include sm-down {
      padding-right: 40px;
      padding-left: 40px;
    }

    @include xs-down {
      padding-right: 15px;
      padding-left: 15px;
    } */
  }
}
.footer-line {
  border-top: 1px solid #f3f3f3;
}
</style>

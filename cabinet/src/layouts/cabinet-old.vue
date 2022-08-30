<template>
  <div class="cabinet inner-page">
    <header-component :type="'large'" :is-inner-page="true"></header-component>
    <div class="cabinet__container">
      <user-info />
      <slot />
    </div>
    <footer-component :type="'large'"></footer-component>
    <cookies-popup></cookies-popup>
  </div>
</template>

<script>
import HeaderComponent from '@/components/Header/Header.vue'
import UserInfo from '@/layouts/cabinet/UserInfo.vue'
import FooterComponent from '@/components/Footer/Footer.vue'
import CookiesPopup from '@/components/Shared/CookiesPopup.vue'

export default {
  components: {
    HeaderComponent,
    UserInfo,
    FooterComponent,
    CookiesPopup,
  },
}
</script>


<style lang="scss" scoped>
.cabinet {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

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


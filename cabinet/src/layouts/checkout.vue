<template>
  <div class="checkout-page outer-page">
    <header-component :is-empty-header="true"></header-component>
    <div class="checkout-page__container">
      <Nuxt />
    </div>
    <cookies-popup></cookies-popup>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HeaderComponent from '@/components/Header/Header.vue'
import CookiesPopup from '@/components/Shared/CookiesPopup.vue'

const Paddle = {} as any

export default Vue.extend({
  mounted() {
    const setupPaddle = () => {
      try {
        Paddle.Setup({ vendor: 40246 })
      } catch (e) {
        setTimeout(setupPaddle, 100)
      }
    }

    const paddleScript = document.createElement('script')
    paddleScript.setAttribute('src', 'https://cdn.paddle.com/paddle/paddle.js')
    paddleScript.setAttribute('defer', '')
    document.body.appendChild(paddleScript)

    setupPaddle()
  },
  components: {
    HeaderComponent,
    CookiesPopup,
  },
})
</script>

<style lang="scss" scoped>
.checkout-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
  padding-bottom: 40px;

  &__container {
    max-width: 1133px;
    width: 100%;
    padding-top: 60px;
    margin-right: auto;
    margin-left: auto;

    @include xl-down {
      max-width: 968px;
    }

    @include lg-down {
      padding-top: 40px;
    }

    @include sm-down {
      padding-top: 30px;
      padding-right: 15px;
      padding-left: 15px;
    }
  }
}
</style>

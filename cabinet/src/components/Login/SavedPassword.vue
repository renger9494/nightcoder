<template>
  <div>
    <air-title
      title="Success"
      urlImage="/img/login/icons/emoji-cracker.png"
      urlImage2x="/img/login/icons/emoji-cracker@2x.png 2x"
    />
    <div class="forgotPassword__item__container">
      <p class="forgotPassword__description">
        Your new password has been successfully seved. Click the button below to
        sign in.
      </p>
      <div class="forgotPassword__button">
        <login-button :action="goToLogin" button-text="Sign in" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AirTitle from '@/components/Login/Title.vue'
import LoginButton from '@/components/Login/LoginButton.vue'

export default Vue.extend({
  components: {
    LoginButton,
    AirTitle,
  },
  methods: {
    goToLogin() {
      this.$router.push(`/login`)
    },
  },
})
</script>
<style lang="scss">
.forgotPassword__description {
  margin-bottom: 30px;
}
</style>
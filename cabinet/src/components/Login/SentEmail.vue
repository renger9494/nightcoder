<template>
  <div>
    <air-title
      title="Sent! Check Your Email"
      urlImage="/img/login/icons/emoji-balloon.png"
      urlImage2x="/img/login/icons/emoji-balloon@2x.png 2x"
    />
    <div class="forgotPassword__item__container">
      <p class="forgotPassword__description">
        An email has been sent. Click the link in the email to reset your
        password.
      </p>
      <div class="forgotPassword__button">
        <login-button :action="goToLogin" button-text="Done" />
      </div>
      <div class="forgotPassword__goback">
        <a href="/login">Go Back</a>
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
    AirTitle,
    LoginButton,
  },
  methods: {
    goToLogin() {
      this.$router.push(`/login`)
    },
  },
})
</script>

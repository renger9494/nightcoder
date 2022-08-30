<template>
  <div>
    <air-title
      title="Success"
      urlImage="/img/login/icons/emoji-cracker.png"
      urlImage2x="/img/login/icons/emoji-cracker@2x.png 2x"
    />
    <div class="forgotPassword__item__container">
      <p class="forgotPassword__description">
        Your email has been successfully changed. Click the button below to
        serve your projects.
      </p>
      <div class="forgotPassword__button">
        <login-button :action="goToDashboard" button-text="Go to Dashboard" />
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
    goToDashboard() {
      this.$router.push(`/dashboard`)
    },
  },
})
</script>

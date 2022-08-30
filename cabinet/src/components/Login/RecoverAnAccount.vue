<template>
  <div>
    <air-title
      title="Recover an account"
      urlImage="/img/login/icons/emoji-key.png"
      urlImage2x="/img/login/icons/emoji-key@2x.png 2x"
    />
    <div class="forgotPassword__item__container">
      <p class="forgotPassword__description">
        Enter your email address and we will send you a link to reset your
        password.
      </p>
      <div class="forgotPassword__errors">
        <login-error :errors="errors" />
      </div>
      <div
        :class="{
          forgotPassword__inputErrors: errors,
        }"
        class="forgotPassword__field-wrapper"
      >
        <input
          class="forgotPassword__input"
          id="email"
          type="email"
          value=""
          name="Email"
          placeholder="Email"
          v-model="email"
          @keyup="errors = ''"
          @keyup.enter="checkEmail"
          @blur="checkEmail"
        />
      </div>
      <div class="forgotPassword__button">
        <login-button
          :action="recover"
          :is-disabled="errors != ''"
          :is-processing="isProcessing"
          button-text="Submit"
        />
      </div>
      <div class="forgotPassword__goback">
        <a href="/login">Go Back</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import apiClient from '@/utils/apiClient'
import Email from '@/utils/email'

import TermsPolicy from '@/components/Login/TermsPolicy.vue'
import AirTitle from '@/components/Login/Title.vue'

import LoginError from '@/components/Login/LoginErrorMessage.vue'
import ButtonGray from '@/components/Login/ButtonGray.vue'
import LoginButton from '@/components/Login/LoginButton.vue'
import { ForgotPasswordDto } from '@/utils/api'

export default Vue.extend({
  components: {
    TermsPolicy,
    AirTitle,
    LoginError,
    LoginButton,
    ButtonGray,
  },
  data() {
    return {
      email: '',
      focusedFind: true,
      isProcessing: false,
      isSuccessed: false,
      errors: '',
    }
  },
  methods: {
    checkEmail() {
      if (!this.email) {
        this.errors = 'Please fill out all required fields.'
      } else {
        this.errors = Email.isValid(this.email)
      }
    },
    recover() {
      this.errors = ''
      this.checkEmail()

      if (this.errors) return
      var data: ForgotPasswordDto = {
        email: this.email,
      }
      this.isProcessing = true
      apiClient.auth
        .authForgotPassword(data)
        .then(() => {
          this.isSuccessed = true
          this.$emit('сhange')
        })
        .catch((error) => {
          this.isProcessing = false
          this.isSuccessed = false
          console.log(error)
        })
    },
  },
})
</script>

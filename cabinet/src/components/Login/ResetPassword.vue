<template>
  <div>
    <air-title
      title="Reset Password"
      urlImage="/img/login/icons/emoji-chicken.png"
      urlImage2x="/img/login/icons/emoji-chicken@2x.png 2x"
    />
    <div class="forgotPassword__item__container">
      <p class="forgotPassword__description">
        Enter a new password for your account
      </p>
      <password :isLogin="false" @changedPassword="changedPassword" />
      <div class="forgotPassword__button">
        <login-button
          :action="resetPassword"
          :is-disabled="errors != ''"
          :is-processing="isProcessing"
          button-text="Submit"
        />
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
import Password from '@/components/Login/Password.vue'
import LoginError from '@/components/Login/LoginErrorMessage.vue'
import ButtonGray from '@/components/Login/ButtonGray.vue'
import LoginButton from '@/components/Login/LoginButton.vue'
import { ResetPasswordDto } from '@/utils/api'

export default Vue.extend({
  components: {
    TermsPolicy,
    AirTitle,
    LoginError,
    LoginButton,
    ButtonGray,
    Password,
  },
  data() {
    return {
      password: '',
      repeatPassword: '',
      focusedFind: true,
      isProcessing: false,
      isSuccessed: false,
      errors: '',
      verifiedPassword: false,
    }
  },
  props: {
    email: {
      type: String,
      default: '',
    },
    token: {
      type: String,
      default: '',
    },
  },
  methods: {
    changedPassword(
      verifiedPassword: boolean,
      inputPass: string,
      inputRepeatPass: string
    ) {
      this.password = inputPass
      this.repeatPassword = inputRepeatPass
      this.verifiedPassword = verifiedPassword
    },

    resetPassword() {
      if (!this.verifiedPassword) {
        return
      }
      var data: ResetPasswordDto = {
        newPassword: this.password,
        confirmedPassword: this.repeatPassword,
        email: this.email,
        token: this.token,
      }
      this.isProcessing = true
      apiClient.auth
        .authResetPassword(data)
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

<template>
  <div class="login__container">
    <div class="login__item">
      <air-title
        class="login__title"
        title="It’s a pleasure to meet you"
        urlImage="/img/login/icons/emoji-cat.png"
        urlImage2x="/img/login/icons/emoji-cat@2x.png 2x"
      />

      <div
        :class="{
          login__inputErrors: errorsFullName,
          login__сhecked: verifiedFullName,
        }"
        class="login__field-wrapper"
      >
        <input
          class="login__input"
          id="fullName"
          type="text"
          name="FullName"
          placeholder="Full Name"
          v-model="fullName"
          @keyup=";(errorsFullName = ''), (verifiedFullName = false)"
          @keydown.enter="check"
          @blur="check"
        />
      </div>
      <div class="login__errors">
        <login-error :errors="errorsFullName" />
      </div>
      <div
        :class="{
          login__inputErrors: errorsEmail,
          login__сhecked: verifiedEmail,
        }"
        class="login__field-wrapper login__field-wrapper__email"
      >
        <input
          class="login__input"
          id="email"
          type="email"
          name="Email"
          placeholder="Email"
          v-model="email"
          @keyup=";(errorsEmail = ''), (verifiedEmail = false)"
          @keydown.enter="check"
          @blur="check"
        />
      </div>
      <div class="login__errors">
        <login-error :errors="errorsEmail" />
      </div>
      <password :isLogin="false" @changedPassword="changedPassword" />
      <div class="login__button">
        <login-button
          :action="createAccount"
          :is-processing="isProcessing"
          :is-disabled="
            !(verifiedFullName && verifiedFullName && verifiedPassword)
          "
          button-text="Create an account"
        />
      </div>
      <login-with class="login__socialLogin" :isRegisteredPage="true" />
      <div class="login__create">
        <p>Already have an account?</p>
        <a href="/login"> Log in here </a>
      </div>
    </div>
    <user-feedback />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosError } from 'axios'

import emailValidator from '@/utils/email'
import apiClient from '@/utils/apiClient'

import LoginWith from '@/components/Login/LoginWith.vue'
import TermsPolicy from '@/components/Login/TermsPolicy.vue'
import AirTitle from '@/components/Login/Title.vue'
import Password from '@/components/Login/Password.vue'
import LoginError from '@/components/Login/LoginErrorMessage.vue'
import ButtonGray from '@/components/Login/ButtonGray.vue'
import LoginButton from '@/components/Login/LoginButton.vue'
import { ErrorDto, RegistrationUserDto } from '@/utils/api'
import { getErrorData } from '@/utils/http'
import { Context } from '@nuxt/types'
import UserFeedback from '@/components/Login/UserFeedback.vue'

export default Vue.extend({
  head() {
    return {
      title: 'Sign Up'
    }
  },
  middleware: ['login'],
  layout: 'profile',
  components: {
    LoginWith,
    TermsPolicy,
    AirTitle,
    ButtonGray,
    LoginError,
    LoginButton,
    UserFeedback,
    Password,
  },
  asyncData(ctx: Context): Promise<object | void> | object | void {
    const { email } = ctx.route.query

    return {
      email,
    }
  },
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      repeatPassword: '',
      errorsEmail: '' as string | ErrorDto[],
      errorsFullName: '' as string | ErrorDto[],
      verifiedFullName: false,
      verifiedEmail: false,
      verifiedPassword: false,
      isProcessing: false,
      isSuccessed: false,
    }
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
    check() {
      if (!this.fullName) {
        this.errorsFullName = 'Please fill out all required fields'
        this.verifiedFullName = false
      } else this.verifiedFullName = true
      if (!this.email) {
        this.errorsEmail = 'Please fill out all required fields'
        this.verifiedEmail = false
      } else {
        this.errorsEmail = emailValidator.isValid(this.email)
        this.verifiedEmail = this.errorsEmail == ''
      }
    },
    createAccount() {
      this.check()

      if (
        !(this.verifiedPassword && this.verifiedEmail && this.verifiedFullName)
      ) {
        return
      }

      var data: RegistrationUserDto = {
        email: this.email,
        fullName: this.fullName,
        password: this.password,
      }

      this.isProcessing = true
      apiClient.auth
        .authRegister(data)
        .then(() => {
          setTimeout(() => {
            this.isSuccessed = true

            setTimeout(() => {
              this.$store.dispatch('auth/checkIsUserLoggedIn')
              location.href = '/dashboard'
            }, 500)
          }, 1000)
        })
        .catch((errorResponse: AxiosError) => {
          this.errorsEmail = getErrorData(errorResponse)
          setTimeout(() => {
            this.isProcessing = false
          }, 1000)
        })
    },
  },
})
</script>

<style lang="scss">
.login {
  font-family: 'Poppins';
  &__container {
    margin: auto;
    display: grid;
    grid-template-columns: 50% 50%;
    height: calc(100vh - 60px);
    min-height: 586px;
  }
  &__title {
    width: 100%;
  }
  &__errors {
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: #f46363;
    text-align: left;
    width: 100%;
    margin-bottom: 1px;
    height: 15px;
    margin-top: 0px;
    font-family: 'Poppins';
  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 350px;
    margin: auto;
  }

  &__field-wrapper {
    width: 100%;
    height: 38px;
    position: relative;
    padding: 8px;
    border: 1px solid #dadada;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &:hover {
      border: 1px solid #318bf5;
    }
    &__password,
    &__email {
      position: relative;
    }
  }
  &__field-wrapper__password:hover {
    .login__passwordFootnote {
      display: block;
    }
  }
  &__mobilePasswordFootnote {
    display: none;
  }
  &__passwordFootnote {
    display: none;
    position: absolute;
    right: -256px;
    bottom: -50px;
    z-index: 9;
  }
  &__passwordCharacters {
    position: relative;
    width: 239px;
    height: 140px;
    box-shadow: 0px 5px 30px -4px rgba(0, 0, 0, 0.12);
    padding: 16px;
    background: #ffffff;
    border-radius: 4px;
    font-size: 12px;
    line-height: 18px;
    color: #333333;
    &::before,
    &::after {
      content: '';
      z-index: -1;
      transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
      position: absolute;
      left: -20px;
      bottom: 60px;
      border: 10px solid transparent;
      border-top: 10px solid #ffffff;
      box-shadow: 0px 5px 30px -4px rgba(0, 0, 0, 0.12);
    }
    &::before {
      z-index: 1;
      box-shadow: none;
    }
    &__header {
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      color: #000000;
      margin-bottom: 16px;
    }
    &__item {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        margin-left: 8px;
      }
    }
    &__readyItem {
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      color: #dadada;
      text-decoration-line: line-through;
    }
  }
  &__input {
    font-family: 'Poppins';
    width: 100%;
    font-size: 13px;
    line-height: 20px;
    background-color: #ffffff;
    -webkit-appearance: none;
    &:-webkit-autofill {
      box-shadow: 0 0 0 50px white inset;
    }
    &__password {
      width: calc(100% - 32px);
    }
    &::placeholder {
      color: #828282;
    }
  }

  &__inputErrors {
    border: 1px solid #f46363;
  }
  &__сhecked {
    border: 1px solid #53b71b;
  }
  &__icon-slide {
    position: absolute;
    z-index: 9;
    right: 8px;
    top: 12px;
    transition: all 0.3s ease;
    cursor: pointer;
    opacity: 0.3;
    &:hover {
      opacity: 1;
    }
  }
  &__inline {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;
  }
  &__button {
    padding: 14px 0px 30px;
    border-bottom: 1px solid #ebebeb;
    width: 100%;
  }
  &__socialLogin {
    width: 100%;
    margin-top: 30px;
    margin-bottom: 16px;
  }
  &__create {
    display: inline-flex;
    text-align: center;
    p {
      font-size: 13px;
      line-height: 20px;
      color: #828282;
      margin-right: 10px;
    }
    a {
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      text-decoration: none;
      color: #173bef;
      &:hover {
        color: #000000;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .login {
    &__item {
      width: 100%;
      max-width: 100%;
      padding: 0px $margin_page_tablet;
    }
  }
}
@media screen and (max-width: 538px) {
  .login {
    &__passwordFootnote {
      right: -220px;
      bottom: -60px;
    }

    &__passwordCharacters {
      width: 200px;
      height: 160px;

      &::before,
      &::after {
        left: -20px;
        bottom: 70px;
      }
    }
  }
}
@media screen and (max-width: 630px) {
  .login {
    &__container {
      grid-template-columns: 100%;
      height: fit-content;
    }
    &__input {
      font-size: 12px;
      line-height: 18px;
    }
    &__field-wrapper__password:hover {
      .login__passwordFootnote {
        display: none;
      }
    }
    &__passwordFootnote {
      display: none;
    }
    &__create {
      p {
        font-size: 12px;
        line-height: 18px;
      }
      a {
        font-size: 12px;
        line-height: 18px;
      }
    }
    &__mobilePasswordFootnote {
      display: block;
      font-size: 12px;
      line-height: 18px;
      margin-top: 8px;
      width: 100%;
    }
    &__passwordCharacters {
      &__header {
        font-size: 12px;
        line-height: 18px;
        margin-bottom: 8px;
      }
    }
  }
}
@media screen and (max-width: 414px) {
  .login {
    &__item {
      padding: 0px $margin_page_mobile;
    }
  }
}
</style>

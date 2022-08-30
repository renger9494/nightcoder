<template>
  <div class="login__container">
    <div class="login__item">
      <air-title
        class="login__title"
        title="Happy to see you"
        urlImage="/img/login/icons/emoji-hi.png"
        urlImage2x="/img/login/icons/emoji-hi@2x.png 2x"
      />
      <div
        :class="{
          login__inputErrors: errorsEmail,
          login__сhecked: verifiedEmail,
        }"
        class="login__field-wrapper"
      >
        <input
          class="login__input"
          id="email"
          type="email"
          name="Email"
          placeholder="Email"
          v-model="email"
          @keyup="
            ;(errorsEmail = ''), (errorsPassword = ''), (verifiedEmail = false)
          "
          @keydown.enter="check"
          @blur="check"
        />
      </div>
      <div class="login__errors">
        <login-error :errors="errorsEmail" />
      </div>
      <password
        :isLogin="true"
        :errors="errorsPassword"
        @changedPassword="changedPassword"
      />
      <div class="login__inline">
        <div class="login__remember">
          <input
            type="checkbox"
            id="remember"
            name="interest"
            v-model="remember"
            checked
          />
          <label for="remember">Remember me</label>
        </div>
        <a class="login__forgot-password" href="/forgot-password">
          Forgot your password?
        </a>
      </div>
      <div class="login__button">
        <login-button
          :action="login"
          :is-disabled="!verifiedPassword || errorsEmail.length > 0"
          :is-processing="isProcessing"
          button-text="Log in"
        />
      </div>
      <login-with class="login__socialLogin" />
      <div class="login__create" v-if="isRegistrationAccess">
        <p>Don't have an account?</p>
        <a href="/sign-up"> Sign up for free</a>
      </div>
    </div>
    <user-feedback />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import http from '@/utils/http'
import apiClient from '@/utils/apiClient'
import emailValidator from '@/utils/email'
import AirTitle from '@/components/Login/Title.vue'
import LoginWith from '@/components/Login/LoginWith.vue'
import LoginError from '@/components/Login/LoginErrorMessage.vue'
import LoginButton from '@/components/Login/LoginButton.vue'
import UserFeedback from '@/components/Login/UserFeedback.vue'
import SvgIcon from '@/components/Shared/SvgIcon.vue'
import Password from '@/components/Login/Password.vue'
export default Vue.extend({
  head() {
    return {
      title: 'Login',
    }
  },
  middleware: ['login'],
  layout: 'profile',
  components: {
    LoginWith,
    AirTitle,
    LoginError,
    LoginButton,
    UserFeedback,
    SvgIcon,
    Password,
  },
  data() {
    return {
      email: '',
      password: '',
      errorsEmail: '',
      errorsPassword: '',
      verifiedEmail: false,
      verifiedPassword: false,
      isProcessing: false,
      isSuccessed: false,
      remember: true,
    }
  },
  computed: {
    isRegistrationAccess() {
      return process.env.USER_IS_CAN_CREATE_ACCOUNT == 'true'
    },
  },
  methods: {
    changedPassword(verifiedPassword: boolean, inputPass: string) {
      this.password = inputPass
      this.verifiedPassword = verifiedPassword
      this.errorsPassword = ''
      if ((this.errorsEmail = 'Incorrect email or password. Please try again.'))
        this.errorsEmail = ''
    },
    login() {
      this.check()
      if (!(this.verifiedPassword && this.verifiedEmail)) {
        return
      }
      var data = {
        userName: this.email,
        password: this.password,
        rememberMe: this.remember,
      }
      this.isProcessing = true
      // apiClient.auth.authLogin(data)
      http
        .post('/api/auth/login', data)
        .then(() => {
          setTimeout(() => {
            this.isSuccessed = true
            setTimeout(() => {
              this.$store.dispatch('auth/checkIsUserLoggedIn')
            }, 500)
          }, 1000)
          this.isProcessing = false
          if (!!this.$route.query.redirectUrl) {
            location.href = decodeURI(this.$route.query.redirectUrl)
          } else {
            location.href = '/dashboard'
          }
        })
        .catch((error) => {
          setTimeout(() => {
            this.isProcessing = false
            this.errorsEmail = 'Incorrect email or password. Please try again.'
            this.errorsPassword =
              'Incorrect email or password. Please try again.'
          }, 1000)
        })
    },
    check() {
      if (!this.email) {
        this.errorsEmail = 'Please fill out all required fields.'
      } else {
        this.errorsEmail = emailValidator.isValid(this.email)
        this.verifiedEmail = this.errorsEmail == ''
      }
    },
  },
})
</script>

<style lang="scss">
.login {
  font-family: 'Poppins';
  &__container {
    //max-width: 1280px;
    margin: auto;
    display: grid;
    grid-template-columns: 50% 50%;
    //height: 1020px;
    height: calc(100vh - 60px);
    min-height: 464px;
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
    margin-top: 0px;
    margin-bottom: 0px;
    height: 16px;
    font-family: 'Poppins';
  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 350px;
    margin: auto;
  }
  &__field-wrapper {
    width: 100%;
    height: 38px;
    position: relative;
    border-radius: 4px;
    border: 1px solid #dadada;
    box-sizing: border-box;
    padding: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &:hover {
      border: 1px solid #318bf5;
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
  &__сhecked {
    border: 1px solid #53b71b;
  }
  &__inputErrors {
    border: 1px solid #f46363;
  }
  &__icon-slide {
    position: absolute;
    z-index: 9;
    right: 8px;
    top: 12px;
    // display: flex;
    // flex-direction: row;
    //align-items: center;
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
    padding: 30px 0px;
    border-bottom: 1px solid #ebebeb;
    width: 100%;
  }
  &__forgot-password {
    color: #000000;
    font-size: 13px;
    line-height: 20px;
    text-decoration: none;
    text-align: right;
    &:hover {
      color: #bdbdbd;
    }
  }
  &__remember {
    color: #828282;
    font-size: 13px;
    line-height: 20px;
    input {
      position: absolute;
      z-index: -1;
      opacity: 0;

      & + label {
        display: inline-flex;
        align-items: center;
        user-select: none;
      }
      & + label::before {
        content: '';
        display: inline-block;
        width: 15px;
        height: 15px;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1px solid #dadada;
        border-radius: 2px;
        margin-right: 10px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 10px 15px;
      }
      &:checked + label::before {
        border-color: #000000;
        background-color: #000000;
        background-image: url('/img/login/icons/labelChecked.svg');
      }
      & + label:hover::before {
        cursor: pointer;
      }
    }
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
      padding: 0px $margin_page_tablet;
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
    &__remember {
      font-size: 12px;
      line-height: 18px;
    }
  }
  &__forgot-password {
    font-size: 12px;
    line-height: 18px;
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

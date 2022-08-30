<template>
  <div class="login__item">
    <air-title
      class="login__title"
      :title="`Enter a new Email${isGoogle ? ' and Password' : ''} 💌`"
      urlImage=""
      urlImage2x=""
    />
    <div class="login__errors">
      <login-error :errors="errorstoken" />
    </div>
    <div
      :class="{
        login__inputErrors: errorsemail,
        login__сhecked: verifiedEmail,
      }"
      class="login__field-wrapper"
    >
      <input
        class="login__input"
        id="newEmail"
        type="email"
        name="newEmail"
        placeholder="New Email"
        autocomplete="off"
        v-model="newEmail"
        @keyup="
          ;(errorsemail = ''), (errorspassword = ''), (verifiedEmail = false)
        "
        @keydown.enter="check"
        @blur="check"
      />
      <div v-if="isTimer" class="login__btn-send">{{ timer }} sec</div>
      <button v-else-if="isSendCode" class="login__btn-send" @click="sendCode">
        Send Code
      </button>
    </div>
    <div class="login__errors">
      <login-error :errors="errorsemail" />
    </div>

    <div
      :class="{
        login__inputErrors: errorscode,
        login__сhecked: verifiedCode,
      }"
      class="login__field-wrapper"
    >
      <input
        class="login__input"
        id="code"
        type="text"
        name="Code"
        v-facade="'###-###'"
        placeholder="Verification code"
        autocomplete="off"
        v-model="code"
        @keydown.enter="check"
        @blur="check"
      />
    </div>
    <div class="login__errors">
      <login-error :errors="errorscode" />
    </div>
    <password
      v-if="isGoogle"
      :isLogin="false"
      @changedPassword="changedPassword"
    />

    <div class="login__button">
      <login-button
        :action="changedEmail"
        :is-disabled="
          !verifiedPassword || !verifiedCode || errorsemail.length > 0
        "
        :is-processing="isProcessing"
        button-text="Change"
      />
    </div>
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
import { SendChangedEmailCodeDto, VerifyChangedEmailDto } from '@/utils/api'
export default Vue.extend({
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
      newEmail: '',
      newPassword: '',
      repeatPassword: '',
      code: '',
      errorspassword: '',
      errorsemail: '',
      errorscode: '',
      errorstoken: '',
      verifiedEmail: false,
      verifiedCode: false,
      verifiedPassword: false,
      isProcessing: false,
      isSuccessed: false,
      isGoogle: true,
      timer: 0,
      isTimer: false,
      isSendCode: true,
      emailCode: '',
    }
  },
  props: {
    token: {
      type: String,
      default: '',
    },
  },
  computed: {
    isRegistrationAccess() {
      return process.env.USER_IS_CAN_CREATE_ACCOUNT == 'true'
    },
  },

  methods: {
    changedPassword(
      verifiedPassword: boolean,
      inputPass: string,
      inputRepeatPass: string
    ) {
      this.newPassword = inputPass
      this.repeatPassword = inputRepeatPass
      this.verifiedPassword = verifiedPassword
    },
    changedEmail() {
      this.check()
      if (!(this.verifiedPassword && this.verifiedEmail)) {
        return
      }
      const userCode = this.code
      var data: VerifyChangedEmailDto = {
        newEmail: this.newEmail,
        newPassword: this.newPassword,
        token: this.token,
        code: userCode.replace('-', ''),
      }
      this.isProcessing = true
      apiClient.auth
        .authChangedEmail(data)
        .then(() => {
          setTimeout(() => {
            this.isSuccessed = true
            setTimeout(() => {
              this.$store.dispatch('auth/checkIsUserLoggedIn')
            }, 500)
          }, 1000)
          this.isProcessing = false
          this.$emit('сhange')
        })
        .catch((error) => {
          this.isProcessing = false
          var key: string
          let errors = error.response.data
          for (key in errors) {
            ;(<any>this)['errors' + key] = errors[key]
          }
        })
    },
    check() {
      if (!this.newEmail) {
        this.errorsemail = 'Please fill out all required fields'
      } else {
        this.errorsemail = emailValidator.isValid(this.newEmail)
        this.verifiedEmail = this.errorsemail == ''
      }
      this.errorscode = ''
      if (!this.code) {
        this.errorscode = 'Please fill out all required fields'
      } else if (this.code.length < 7) {
        this.errorscode = 'The code was entered incorrectly'
      }

      this.verifiedCode = this.errorscode == ''
      this.isSendCode = !this.verifiedCode
      if (this.emailCode != this.newEmail) this.isSendCode = true
    },
    sendCode() {
      if (!this.newEmail) {
        this.errorsemail = 'Please fill out all required fields'
      } else {
        this.errorsemail = emailValidator.isValid(this.newEmail)
        this.verifiedEmail = this.errorsemail == ''
      }
      if (!this.verifiedEmail) return
      var data: SendChangedEmailCodeDto = {
        newEmail: this.newEmail,
      }
      apiClient.auth
        .authSendChangedEmailCode(data)
        .then(() => {
          this.emailCode = this.newEmail
        })
        .catch((error) => {
          console.log(error)
        })
      setTimeout(() => {
        this.timer = 30
        this.isTimer = true
        window.setInterval(() => {
          if (this.timer - 1 <= 0) {
            this.isTimer = false
            return
          }

          this.timer = this.timer - 1
        }, 1000)
      }, 500)
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
    font-family: 'Poppins';
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
  &__btn-send {
    font-family: 'Poppins';
    color: #173bef;
    font-weight: 500;
    font-size: 14px;
    line-height: normal;
    position: absolute;
    z-index: 9;
    right: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      color: #000000;
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

  &__inline {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;
  }
  &__button {
    padding: 30px 0px;

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

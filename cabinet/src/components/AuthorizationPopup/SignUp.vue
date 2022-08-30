<template>
  <div class="login-page">
    <main class="page_wrapper">
      <div class="login">
        <div class="container">
          <div class="login__container">
            <div class="login__item">
              <air-title title="Create an account" />
            </div>
            <div class="login__item login__item_flex">
              <div class="login-email">
                <div class="login-email__item">
                  <login-error :errors="errors" />
                </div>
                <div class="login-email__item">
                  <input
                    id="fullName"
                    type="text"
                    name="FullName"
                    placeholder="Full Name"
                    v-model="fullName"
                    @focus="focusedName = false"
                    @blur="focusedName = true"
                  />
                  <transition name="icon-slide">
                    <img
                      src="/img/login/icons/icon-login.svg"
                      alt=""
                      v-if="focusedName"
                    />
                  </transition>
                </div>
                <div class="login-email__item">
                  <input
                    id="email"
                    type="email"
                    name="Email"
                    placeholder="Email"
                    v-model="email"
                    @focus="focusedMail = false"
                    @blur="focusedMail = true"
                  />
                  <transition name="icon-slide">
                    <img
                      src="/img/login/icons/icon-mail.svg"
                      alt=""
                      v-if="focusedMail"
                    />
                  </transition>
                </div>
                <div class="login-email__item">
                  <input
                    id="password"
                    type="password"
                    name="Password"
                    placeholder="Password"
                    v-model="password"
                    @focus="focusedPass = false"
                    @blur="focusedPass = true"
                  />
                  <transition name="icon-slide">
                    <img
                      src="/img/login/icons/icon-password.svg"
                      alt=""
                      v-if="focusedPass"
                    />
                  </transition>
                </div>
                <div class="login-email__item">
                  <input
                    id="repeatPassword"
                    type="password"
                    name="RepeatPassword"
                    placeholder="Repeat Password"
                    v-model="repeatPassword"
                    @keyup.enter="createAccount()"
                    @focus="focusedPassRep = false"
                    @blur="focusedPassRep = true"
                  />
                  <transition name="icon-slide">
                    <img
                      src="/img/login/icons/icon-password.svg"
                      alt=""
                      v-if="focusedPassRep"
                    />
                  </transition>
                </div>
                <div class="login-email__item">
                  <login-button
                    :action="createAccount"
                    :is-processing="isProcessing"
                    :is-successed="isSuccessed"
                    button-text="Create an account"
                  />
                </div>
              </div>
              <div class="login-line"></div>
              <login-with></login-with>
            </div>
            <div class="login__item">
              <div class="login-create">
                <div>
                  <p>Already have an account?</p>
                </div>
                <button-gray :onClick="onLoginButtonClick">
                  Log in<img src="/img/login/icons/icon-login.svg" alt="" />
                </button-gray>
              </div>
            </div>
            <div class="login__item">
              <terms-policy text="By creating an account"></terms-policy>
            </div>
          </div>
          <a class="login__close-button" href="#" @click="closeModal"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              fill="none"
            >
              <path
                fill="#BDBDBD"
                d="M7.74148 1.14999C7.73213.923128 7.64775.698128 7.47396.524991c-.1731-.173138-.39814-.258105-.625-.267517-.25248-.01062-.5081.074379-.70059.267517L3.99961 2.67437 1.85086.524991C1.65775.331853 1.40275.247474 1.15024.257474.923372.266854.698372.351232.525235.524991.352131.698128.26713.923128.257719 1.14999c-.010621.25252.074379.50748.267516.70062L2.67399 3.99999.525235 6.14875c-.193137.1931-.277516.44814-.267516.70059.009379.22686.093758.45189.267516.625.173137.17313.398137.25813.625005.26751.25251.01062.50751-.07434.70062-.26751l2.14875-2.14873 2.14938 2.14938c.19314.19311.44814.27748.70062.26752.22687-.00938.45187-.09376.625-.26752.17314-.17314.25811-.39814.26752-.625.01062-.25252-.07438-.50748-.26752-.70062L5.32524 3.99999l2.14872-2.14876c.19317-.1931.27814-.4481.26752-.70124z"
              ></path></svg
          ></a>
        </div>
      </div>
      <div class="login__tails-wrapper">
        <div class="login__tail tail-1"></div>
        <div class="login__tail tail-2"></div>
        <div class="login__tail tail-3"></div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import Vue, { PropType } from 'vue'
import '@/assets/scss/login/animations.scss'

import http from '@/utils/http'
import Email from '@/utils/email'

import LoginWith from '@/components/Login/LoginWith.vue'
import TermsPolicy from '@/components/Login/TermsPolicy.vue'
import AirTitle from '@/components/Login/Title.vue'

import LoginError from '@/components/Login/LoginErrorMessage.vue'
import ButtonGray from '@/components/Login/ButtonGray.vue'
import LoginButton from '@/components/Login/LoginButton.vue'
import { ActiveTabType } from './types'

export default Vue.extend({
  components: {
    LoginWith,
    TermsPolicy,
    AirTitle,
    ButtonGray,
    LoginError,
    LoginButton,
  },
  props: {
    onSwitchTabClick: {
      type: Function as PropType<(type: ActiveTabType) => void>,
    },
  },
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      repeatPassword: '',
      errors: '',
      focusedPassRep: true,
      focusedPass: true,
      focusedMail: true,
      focusedName: true,
      isProcessing: false,
      isSuccessed: false,
    }
  },
  methods: {
    closeModal(event: Event) {
      if (event) event.preventDefault()

      this.$store.dispatch('ui/closeModal')
    },
    onLoginButtonClick(event: Event) {
      if (event) event.preventDefault()

      this.onSwitchTabClick(ActiveTabType.Login)
    },
    createAccount() {
      this.errors = ''
      if (this.password != this.repeatPassword) {
        this.errors = 'Passwords are different'
        return
      }

      this.errors = Email.isValid(this.email)
      if (this.errors) return

      var data = {
        email: this.email,
        fullName: this.fullName,
        password: this.password,
      }

      this.isProcessing = true
      http
        .post('/api/auth/register', data)
        .then(() => {
          setTimeout(() => {
            this.isSuccessed = true

            setTimeout(() => {
              this.$store.dispatch('auth/checkIsUserLoggedIn')
              this.$store.dispatch('ui/closeModal')
            }, 500)
          }, 1000)
        })
        .catch((error) => {
          setTimeout(() => {
            this.isProcessing = false
            this.errors = error.errors
          }, 1000)
        })
    },
  },
})
</script>

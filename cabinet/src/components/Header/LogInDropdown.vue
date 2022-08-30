<template>
  <transition name="popup-layer" mode="out-in">
    <div class="log-in-dropdown" v-if="isVisible">
      <div class="log-in-dropdown__inner">
        <ul class="log-in-dropdown__menu">
          <li class="log-in-dropdown__menu-item">
            <a
              class="log-in-dropdown__menu-link"
              :class="{
                'log-in-dropdown__menu-link_active':
                  activeDropdownItem === 'templates',
              }"
              href="/templates"
            >
              <span>Templates</span>
            </a>
          </li>
          <li class="log-in-dropdown__menu-item">
            <a
              class="log-in-dropdown__menu-link"
              :class="{
                'log-in-dropdown__menu-link_active':
                  activeDropdownItem === 'pricing',
              }"
              href="/pricing"
            >
              <span>Pricing</span>
            </a>
          </li>
          <li class="log-in-dropdown__menu-item">
            <a
              class="log-in-dropdown__menu-link"
              :class="{
                'log-in-dropdown__menu-link_active':
                  activeDropdownItem === 'feed',
              }"
              href="/settings/feed"
            >
              <span>Discover</span>
            </a>
          </li>
        </ul>
        <div class="log-in-dropdown__actions">
          <a
            class="log-in-dropdown__action log-in-dropdown__action__login"
            @click="goToLogin"
          >
            <span>Log in</span>
          </a>
          <a
            class="log-in-dropdown__action log-in-dropdown__action__create"
            @click="singUp"
          >
            <span>Create an account</span>
          </a>
        </div>

        <ul class="log-in-dropdown__social-menu">
          <li class="log-in-dropdown__social-menu-item">
            <a
              class="log-in-dropdown__social-menu-link"
              href="https://twitter.com/AirtapCo"
            >
              <img :src="srcTwitter" />
              <span>Twitter</span>
            </a>
          </li>
          <li class="log-in-dropdown__social-menu-item">
            <a
              class="log-in-dropdown__social-menu-link"
              href="https://www.facebook.com"
            >
              <img :src="srcFacebook" /><span>Facebook</span>
            </a>
          </li>
          <li class="log-in-dropdown__social-menu-item">
            <a
              class="log-in-dropdown__social-menu-link"
              href="https://www.instagram.com/"
            >
              <img :src="srcInstagram" /><span>Instagram</span>
            </a>
          </li>
        </ul>
        <div class="log-in-dropdown__footer">
          <ul class="log-in-dropdown__policyService-menu">
            <li class="log-in-dropdown__policyService-menu-item">
              <a
                class="log-in-dropdown__policyService-menu-link"
                href="/privacy-policy"
              >
                <span>Privacy Policy</span>
              </a>
            </li>
            <li class="log-in-dropdown__policyService-menu-item">
              <a class="log-in-dropdown__policyService-menu-link" href="/terms">
                <span>Terms of Service</span>
              </a>
            </li>
          </ul>
          <p class="log-in-dropdown__footer__text">
            ©{{ currentYear }} airtap.io
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import UpgradeToProButton from './UpgradeToProButton.vue'

import apiClient from '../../utils/apiClient'
import { AccountDto, PlanCategory } from '../../utils/api'

export default Vue.extend({
  components: {
    UpgradeToProButton,
  },
  props: {
    activeDropdownItem: {
      type: String,
      default: '',
    },
    isVisible: Boolean,
  },

  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
    }),
    currentYear(): number {
      return new Date().getFullYear()
    },
    srcFacebook() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/facebook.svg'
    },
    srcTwitter() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/twitter.svg'
    },
    srcInstagram() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/instagram.svg'
    },
  },
  methods: {
    singUp() {
      location.href = `/sign-up?redirectUrl=${location.pathname}`
    },
    goToLogin() {
      location.href = `/login?redirectUrl=${location.pathname}`
    },
  },
})
</script>

<style lang="scss" scoped>
.actionDisabled {
  pointer-events: none;
  cursor: default;
}
.log-in-dropdown {
  font-family: 'Poppins', sans-serif;
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 999;
  min-width: 300px;
  max-width: 414px;
  background-color: #ffffff;
  border: 1px solid #dadada;
  box-shadow: 0 4px 15px rgba(189, 189, 189, 0.15);

  &__actions {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 8px;
  }
  &__action {
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    min-width: unset;
    text-align: center;
    color: $black;
    background: $white;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    padding: 16px 8px;
    transition: 0.3s;
    border: 1px solid #bdc2c7;
    border-radius: 4px;
    outline: none;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }

    &:active {
      opacity: 1;
    }
    &__create {
      background: #318bf5;
      color: #ffffff;
      border: 1px solid transparent;
    }
  }

  &__inner {
    padding-right: 15px;
    padding-left: 15px;
  }

  &__menu {
    padding-top: 30px;
    padding-bottom: 30px;
    list-style-type: none;
    text-align: center;
  }
  &__menu-item {
    padding-bottom: 16px;
    &:last-child {
      padding-bottom: 0;
    }
  }
  &__menu-link {
    text-decoration: none;
    border-radius: $shape_border_radius;
    transition: 0.3s;
    font-style: normal;
    text-align: center;
    &:hover {
      background-color: #f2f2f2;
    }

    span {
      font-weight: 500;
      font-size: 22px;
      line-height: 33px;
      text-align: center;
      color: #333333;
      transition: 0.3s;
    }
  }

  &__subtitle {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-bottom: 14px;
  }

  &__social-menu {
    display: flex;
    padding-left: 0;
    margin-top: 30px;
    margin-bottom: 18px;
    list-style-type: none;
    justify-content: space-between;
  }

  &__social-menu-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #000000;
    font-size: 12px;
    line-height: 18px;
    text-decoration: none;
    &:hover {
      img {
        fill: #000000;
      }
    }

    img {
      height: 12px;
      margin-right: 8px;
      transition: 0.3s;
    }
  }
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    padding-bottom: 16px;
    border-top: 1px solid #dadada;
    &__text {
      color: #828282;
      font-size: 10px;
      line-height: 15px;
      opacity: 0.7;
    }
  }
  &__policyService-menu {
    display: flex;
    list-style-type: none;
  }
  &__policyService-menu-link {
    display: flex;
    align-items: center;
    color: #828282;
    font-size: 10px;
    line-height: 15px;
    opacity: 0.7;
    text-decoration: none;
    margin-right: 16px;
  }
}
@media screen and (max-width: 414px) {
  .log-in-dropdown {
    min-width: 100%;
    width: 100%;
  }
}
</style>

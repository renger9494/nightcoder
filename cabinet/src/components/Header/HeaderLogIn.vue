<template>
  <header
    class="header"
    :class="{
      header_large: type === 'large',
      'header__full-width':
        $route.name == 'login' ||
        $route.name == 'forgot-password' ||
        $route.name == 'sign-up',
    }"
  >
    <div class="header__inner">
      <div class="header__side">
        <a class="header__logo" href="/">
          <img
            width="79"
            height="21"
            src="/img/icons/logo_black.svg"
            alt="logo black itmeo"
          />
        </a>
        <div class="editor-menu">
          <MainInternalMenu :activeLink="$route.name" :isDefault="true" />
        </div>
      </div>
      <div class="header__nav">
        <ul class="header__nav__menu">
          <li v-if="!isLogInDropdownVisible">
            <a class="header__button header__button__login" @click="goToLogin"
              >Log in</a
            >
          </li>
          <li>
            <a class="header__button header__button__free" @click="singUp"
              >Try for free</a
            >
          </li>
        </ul>
        <log-in-dropdown
          class="header__log-in-dropdown"
          :activeDropdownItem="activeDropdownItem"
          :isVisible="isLogInDropdownVisible"
        />
        <burger
          class="header__menu-dropdown-toggler"
          :isActive="isLogInDropdownVisible"
          :click="toggleMenuDropdown"
        />
      </div>
    </div>
    <overlay :isVisible="isLogInDropdownVisible" />
  </header>
</template>

<script lang="ts">
//it's used in airtap-publish-ruler => all paths must be relative
import Vue from 'vue'
import MainInternalMenu from './MainInternalMenu.vue'
import { mapState } from 'vuex'
import { AccountDto } from '../../utils/api'
import LogInDropdown from './LogInDropdown.vue'
import Burger from './Burger.vue'
import Overlay from './Overlay.vue'
export default Vue.extend({
  components: {
    MainInternalMenu,
    LogInDropdown,
    Burger,
    Overlay,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isLogInDropdownVisible: false,
    }
  },
  computed: {
    ...mapState({
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
      user: (state: any) => <AccountDto>state.auth.user,
    }),
    routeName(): string | undefined | null {
      return this.$route.name
    },
    activeDropdownItem(): string {
      if (this.$route.name === 'templates') return 'templates'
      if (this.$route.name === 'pricing') return 'pricing'
      if (this.$route.name === 'feed') return 'feed'
      return ''
    },
  },
  async created() {
    if (!(<any>process).client) return
    document.addEventListener('click', this.hideLogInDropdown)
    document.addEventListener('keyup', this.hideLogInDropdown)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hideLogInDropdown)
    document.removeEventListener('keyup', this.hideLogInDropdown)
  },
  methods: {
    singUp() {
      location.href = `/sign-up?redirectUrl=${location.pathname}`
    },
    goToLogin() {
      location.href = `/login?redirectUrl=${location.pathname}`
    },
    toggleMenuDropdown(event: any) {
      if (event) event.preventDefault()

      this.isLogInDropdownVisible = !this.isLogInDropdownVisible
    },
    hideLogInDropdown(event: any) {
      if (event) {
        if (
          event.key === 'Escape' ||
          // These are exceptions: the blocks on what click should NOT close the profile dropdown
          (!event.target.closest('.header__log-in-dropdown') &&
            !event.target.closest('.header__menu-dropdown-toggler')) ||
          // These are blocks on what click SHOULD close the profile dropdown
          event.target.classList.contains('log-in-dropdown__menu-item') ||
          event.target.closest('.log-in-dropdown__menu-item') ||
          event.target.classList.contains(
            'log-in-dropdown__social-menu-item'
          ) ||
          event.target.closest('.log-in-dropdown__social-menu-item') ||
          event.target.closest('.log-in-dropdown__action')
        ) {
          this.isLogInDropdownVisible = false
        }
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.popup-enter-active {
  animation: popup-in 0.2s forwards;
}
.popup-leave-active {
  animation: popup-out 0.2s forwards;
}
@keyframes popup-in {
  from {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px) scale(0.95);
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
    visibility: visible;
  }
}
@keyframes popup-out {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
    visibility: visible;
  }
  to {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px) scale(0.95);
  }
}
.header {
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.06);
  height: 60px;
  z-index: 10;

  &__nav {
    display: flex;
    align-items: center;

    &__menu {
      display: flex;
      align-items: center;
      list-style-type: none;
    }
  }
  &__button {
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    min-width: unset;
    text-align: center;
    color: $white;
    background: $black;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    padding: 8px 16px;
    transition: 0.3s;
    border: 1px solid transparent;
    border-radius: 4px;
    outline: none;
    text-decoration: none;
    cursor: pointer;
    margin-left: 8px;
    &:hover {
      opacity: 0.6;
    }

    &:active {
      opacity: 1;
    }
    &__login {
      color: $black;
      background: $white;
      border: 1px solid #bdc2c7;
    }
  }
  &--templates {
    font-family: 'Poppins', sans-serif;
  }

  &_large {
    .header__inner {
      max-width: 1574px;
      width: 100%;
    }
  }

  &__inner {
    position: relative;
    z-index: 998;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // max-width: 1280px;
    height: 60px;
    background-color: #ffffff;
    padding-right: $margin_page_high_resolution;
    padding-left: $margin_page_high_resolution;
    margin-right: auto;
    margin-left: auto;
  }

  &__side {
    display: flex;
    align-items: center;
    min-width: 80px; // Why? It is for correct centering Menu, it is the largest width of side blocks
  }

  &__logo {
    display: inline-block;
    vertical-align: top;
  }

  &__upgrade-to-pro-button {
    margin-right: 20px;
  }

  &__menu-dropdown-toggler {
    display: none;
    border: none;
    background: none;
  }
}

.editor-menu {
  display: flex;
  align-items: center;
  height: 30px;
  margin-left: 20px;
  padding-left: 20px;
  position: relative;
  &__trigger {
    display: flex;
    align-items: center;
  }
  &__iconed {
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    padding: 0 6px;
    height: 30px;
    background: transparent;
    border-radius: $shape_border_radius;
    transition: 0.3s all ease;
    &:first-of-type {
      margin-left: 0;
    }
    &.disabled {
      pointer-events: none;
    }
    &:hover {
      background: #f2f2f2;
      path {
        fill: #000000;
      }
    }
    svg {
      position: relative;
      top: 2px;
      transition: 0.3s all ease;
    }
    &.active {
      svg {
        transform: rotate(90deg);
      }
    }
    span {
      display: inline-block;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 15px;
      color: #000000;
      max-width: 77px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  a.editor-menu__iconed {
    span {
      margin-left: 10px;
    }
    path {
      transition: 0.3s all ease;
    }
    &:hover {
      path {
        fill: #333;
      }
    }
  }
  div.editor-menu__iconed {
    margin-left: 4px;
    span {
      margin-right: 6px;
    }
  }
  &__sep {
    margin-left: 4px;
  }
}
@media screen and (max-width: 1440px) {
  .header {
    &__inner {
      padding-right: $margin_page_desktop;
      padding-left: $margin_page_desktop;
    }
  }
}
@media screen and (max-width: 990px) {
  .header {
    &__full-width {
      .header__inner {
        max-width: 100%;
        padding-right: 20px;
        padding-left: 20px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .header {
    &__inner {
      padding-right: $margin_page_tablet;
      padding-left: $margin_page_tablet;
    }
  }
}
@media screen and (max-width: 584px) {
  .editor-menu {
    display: none;
  }
  .header {
    &__full-width {
      .header__inner {
        padding-right: 15px;
        padding-left: 15px;
      }
    }
    &__button__free {
      display: none;
    }
    &__menu-dropdown-toggler {
      display: block;
      margin-left: 16px;
    }
  }
}
@media screen and (max-width: 414px) {
  .header {
    &__inner {
      padding-right: $margin_page_mobile;
      padding-left: $margin_page_mobile;
    }
  }
}
</style>

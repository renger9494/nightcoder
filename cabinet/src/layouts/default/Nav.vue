<template>
  <header
    class="nav nav--main"
    :class="{ 'nav--white': isWhite , scroll: isScrolled, isMenuOpen, 'nav--dark': isDark, 'nav--full': isFull }"
  >
    <nav class="container container--main nav__container" @click.exact="close">
      <div class="nav__left_part">
        <nuxt-link class="nav__logo_link" to="/">
          <svg-icon v-if="!isWhite" width="79" height="21"  name="logo_white" class="nav__logo_img" />
          <svg-icon v-else width="78" height="21"  name="logo_black" class="nav__logo_img" />
        </nuxt-link>
      </div>
      <ul class="nav__row">
        <li class="nav__row-item nav__row-item--link">
          <nuxt-link class="nav__row-link" to="/templates">Templates</nuxt-link>
        </li>
        <li class="nav__row-item nav__row-item--link">
          <nuxt-link class="nav__row-link" to="/pricing">Pricing</nuxt-link>
        </li>
        <li class="nav__row-item nav__row-item--link">
          <nuxt-link class="nav__row-link nav__row-link--new" to="/feed?PageNumber=1&Show=All&SortBy=MostAppreciated">
            Discover
            <svg-icon name="new_icon" width="30" height="12"/>
          </nuxt-link>
        </li>
        <transition name="fade">
          <li v-if="!isMenuOpen" class="nav__row-item">
            <nuxt-link
              v-if="!isSignup && !isUserLoggedIn"
              class="nav__btn"
              to="/sign-up"
              >Sign Up</nuxt-link
            >
            <nuxt-link
              v-if="isSignup && !isUserLoggedIn"
              class="nav__btn"
              to="/login"
              >Sign In</nuxt-link
            >
            <nuxt-link v-if="isUserLoggedIn" class="nav__btn" to="/dashboard"
              >Dashboard</nuxt-link
            >
          </li>
        </transition>
      </ul>
      <div
        v-if="!isMenuOpen"
        class="nav__adaptive_toggle"
        @click.prevent.stop.exact="openMenu"
      ></div>
      <div v-if="isMenuOpen" class="nav__close" @click="isMenuOpen = false">
        <close-right />
      </div>
    </nav>
    <div
      v-show="isMenuOpen"
      class="nav__menu-mob container container--main mob-menu"
      :class="{ active: isMenuOpen }"
    >
      <div class="mob-menu__list">
        <nuxt-link class="mob-menu__list-item fade" to="/templates">
          Templates</nuxt-link>
        <nuxt-link class="mob-menu__list-item fade" to="/pricing">
          Pricing
        </nuxt-link>
        <nuxt-link class="mob-menu__list-item fade" to="/feed?PageNumber=1&Show=All&SortBy=MostAppreciated">
          Discover
        </nuxt-link>
      </div>
      <nuxt-link
        to="/sign-up"
        class="mob-menu__btn mob-menu__btn--white fade"
        v-if="!isUserLoggedIn"
      >
        Sign up for free
        <arrow-right />
      </nuxt-link>
      <nuxt-link
        to="/login"
        class="mob-menu__btn mob-menu__btn--outline fade"
        v-if="!isUserLoggedIn"
      >
        Sign in
      </nuxt-link>
      <nuxt-link
        to="/dashboard"
        class="mob-menu__btn mob-menu__btn--white fade"
        v-if="isUserLoggedIn"
      >
        Dashboard
      </nuxt-link>
      <div class="mob-menu__social-links">
        <nuxt-link to="#" class="fade">
          <instagram-icon class="in" />
        </nuxt-link>
        <nuxt-link to="#" class="fade">
          <facebook-icon class="fb" />
        </nuxt-link>
        <nuxt-link to="#" class="fade">
          <twitter-icon class="tw" />
        </nuxt-link>
        <nuxt-link to="#" class="fade">
          <discord-icon class="dc" />
        </nuxt-link>
        <nuxt-link to="#" class="fade">
          <behance-icon class="be" />
        </nuxt-link>
        <nuxt-link to="#" class="fade">
          <dribbble-icon class="dr" />
        </nuxt-link>
      </div>
      <div class="mob-menu__bottom">
        <nuxt-link class="mob-menu__bottom-link fade" to="/terms"
          >Terms & Conditions</nuxt-link
        >
        <nuxt-link class="mob-menu__bottom-link fade" to="/privacy-policy"
          >Privacy Policy</nuxt-link
        >
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import InstagramIcon from '@/assets/icons/social/instagram.svg?inline'
import TwitterIcon from '@/assets/icons/social/ta-twi.svg?inline'
import FacebookIcon from '@/assets/icons/facebook.svg?inline'
import DiscordIcon from '@/assets/icons/social/discord.svg?inline'
import BehanceIcon from '@/assets/icons/social/behance.svg?inline'
import DribbbleIcon from '@/assets/icons/social/dribbble.svg?inline'
import ArrowRight from '@/assets/icons/arrow_right.svg?inline'
import CloseRight from '@/assets/icons/close.svg?inline'
import SvgIcon from "~/components/Shared/SvgIcon.vue";

declare module 'vue/types/vue' {
  interface Vue {
    $gsap: any
  }
}

export default Vue.extend({
  name: 'Nav',
  components: {
    SvgIcon,
    InstagramIcon,
    FacebookIcon,
    TwitterIcon,
    DiscordIcon,
    BehanceIcon,
    DribbbleIcon,
    ArrowRight,
    CloseRight,
  },
  props: {
    isWhite: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    isDark: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    isFull: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  data() {
    return {
      isMenuOpen: false,
      animation: null as any,
      isScrolled: false,
      scrollPos: 0
    }
  },
  computed: {
    ...mapState({
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
    }),
    isSignup(): boolean {
      return this.$route.path === '/sign-up'
    },
  },
  mounted() {
    this.animation = this.$gsap.to('.fade', {
      opacity: 1,
      transform: 'translateY(0)',
      duration: 0.2,
      stagger: 0.05,
      paused: true
    });
    this.headerClass();
  },
  methods: {
    openMenu() {
      this.isMenuOpen = true;
      this.animation.progress(0);
      this.animation.play();
      const body = document.querySelector('body');
      if (body) {
        this.scrollPos = window.scrollY
        body.style.overflow = 'hidden';
      }
    },
    close() {
      this.isMenuOpen = false
      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = '';
        window.scrollTo(0, this.scrollPos);
      }
    },
    headerClass() {
      window.onscroll = () => {
        this.isScrolled = window.pageYOffset > 100;
      }
    },
  },
  beforeDestroy() {
    const body = document.querySelector('body');
    if(body) body.style.overflow = '';
  }
})
</script>

<style lang="scss">
@import '@/assets/scss/main/components/nav';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s linear;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

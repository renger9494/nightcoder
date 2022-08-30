<template>
  <nav class="menu-dropdown" :class="{ 'menu-dropdown_visible': isVisible }">
    <ul class="menu-dropdown__list">
      <li class="menu-dropdown__list-item">
        <a
          class="menu-dropdown__list-link"
          :class="{
            'menu-dropdown__list-link_active': activeLink === 'templates',
          }"
          href="/templates"
          >Templates</a
        >
      </li>
      <li class="menu-dropdown__list-item">
        <a
          class="menu-dropdown__list-link"
          :class="{
            'menu-dropdown__list-link_active': activeLink === 'pricing',
          }"
          href="/pricing"
          >Pricing</a
        >
      </li>
      <li class="menu-dropdown__list-item">
        <a
          class="menu-dropdown__list-link"
          :class="{
            'menu-dropdown__list-link_active': activeLink === 'examples',
          }"
          href="/examples"
          >Examples</a
        >
      </li>
      <li class="menu-dropdown__list-item">
        <a
          class="menu-dropdown__list-link"
          :class="{ 'menu-dropdown__list-link_active': activeLink === 'about' }"
          href="/about"
          >About</a
        >
      </li>
      <li class="menu-dropdown__list-item">
        <a
          class="menu-dropdown__login-button"
          href="#"
          @click="onLogInLinkClick"
          >Log In</a
        >
      </li>
      <li class="menu-dropdown__list-item">
        <a
          class="menu-dropdown__list-link"
          :class="{ 'menu-dropdown__list-link_active': activeLink === 'faq' }"
          href="/faq"
          >FAQ</a
        >
      </li>
      <li class="menu-dropdown__list-item">
        <a
          class="menu-dropdown__list-link"
          :class="{
            'menu-dropdown__list-link_active': activeLink === 'roadmap',
          }"
          href="/roadmap"
          >Roadmap</a
        >
      </li>
      <li class="menu-dropdown__list-item">
        <a
          class="menu-dropdown__list-link"
          :class="{
            'menu-dropdown__list-link_active': activeLink === 'affliate',
          }"
          href="/affiliate"
          >Affiliate</a
        >
      </li>
      <li class="menu-dropdown__list-item">
        <a
          class="menu-dropdown__list-link"
          :class="{
            'menu-dropdown__list-link_active': activeLink === 'changelog',
          }"
          href="/changelog"
          >Changelog</a
        >
      </li>
    </ul>
    <h3 class="menu-dropdown__subtitle">Follow Us</h3>
    <div class="menu-dropdown__social-list">
      <a
        class="menu-dropdown__social-list-link"
        href="https://www.facebook.com/itmeocom"
        target="_blank"
      >
        <img class="menu-dropdown__social-list-icon" :src="srcFacebook" /> </a
      ><a
        class="menu-dropdown__social-list-link"
        href="https://twitter.com/itmeohq"
        target="_blank"
      >
        <img class="menu-dropdown__social-list-icon" :src="srcTwitter" /> </a
      ><a
        class="menu-dropdown__social-list-link"
        href="https://www.instagram.com/itmeo.design/"
        target="_blank"
      >
        <img class="menu-dropdown__social-list-icon" :src="srcInstagram" /> </a
      ><a
        class="menu-dropdown__social-list-link"
        href="https://slack.com/"
        target="_blank"
      >
        <img class="menu-dropdown__social-list-icon" :src="srcSlack" /> </a
      ><a
        class="menu-dropdown__social-list-link"
        href="https://spectrum.chat/"
        target="_blank"
      >
        <img class="menu-dropdown__social-list-icon" :src="srcSpectrum" />
      </a>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    activeLink: String,
    onLogInLinkClick: Function,
    isVisible: Boolean,
  },
  components: {},
  computed: {
    srcFacebook() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/facebook.svg'
    },
    srcTwitter() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/twitter.svg'
    },
    srcInstagram() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/instagram.svg'
    },
    srcSlack() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/slack.svg'
    },
    srcSpectrum() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/spectrum.svg'
    },
  },
})
</script>

<style lang="scss" scoped>
.menu-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 999;
  display: none;
  width: 320px;
  background-color: #ffffff;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  box-shadow: 0 4px 15px rgba(189, 189, 189, 0.15);
  padding-top: 24px;
  padding-right: 15px;
  padding-bottom: 34px;
  padding-left: 15px;
  transform: translateY(-4px) scale(0.95);
  opacity: 0;
  transition: transform 0.2s, opacity 0.15s;
  visibility: hidden;

  @include lg-down {
    display: block;
  }

  &_visible {
    transform: translateY(0) scale(1);
    opacity: 1;
    visibility: visible;
  }

  &__list {
    list-style-type: none;
    border-bottom: 1px solid #dadada;
    padding-bottom: 24px;
    padding-left: 0;
    margin-top: 0;
    margin-right: -10px;
    margin-bottom: 24px;
    margin-left: -10px;
  }

  &__list-item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__list-link {
    display: block;
    font-size: 18px;
    font-weight: 400;
    text-decoration: none;
    color: #333333;
    border-radius: $shape_border_radius;
    padding-top: 5px;
    padding-right: 10px;
    padding-bottom: 5px;
    padding-left: 10px;
    transition: 0.3s;

    &:hover {
      color: #000000;
      background-color: #f2f2f2;
    }

    &:active {
      color: #000000;
      background-color: #dadada;
    }

    &.menu-dropdown__list-link_active {
      color: #ffffff;
      background-color: #000000;
    }
  }

  &__login-button {
    display: block;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    text-decoration: none;
    color: #ffffff;
    background-color: #000000;
    border-radius: $shape_border_radius;
    padding-top: 7px;
    padding-right: 30px;
    padding-bottom: 6px;
    padding-left: 30px;
    margin-top: 4px;
    margin-right: 10px;
    margin-bottom: 4px;
    margin-left: 10px;
  }

  &__subtitle {
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    margin-top: 0;
    margin-bottom: 30px;
  }

  &__social-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style-type: none;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  &__social-list-icon {
    height: 24px;
    fill: #333333;
  }
}
</style>



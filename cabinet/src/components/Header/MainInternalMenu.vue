<template>
  <ul class="menu-internal">
    <li>
      <a
        class="menu-internal__list-link"
        :class="{
          'menu-internal__list-link__active': activeItem === 'templates',
        }"
        href="/templates"
      >
        Templates
      </a>
    </li>
    <li v-if="!isDefault">
      <a
        class="menu-internal__list-link"
        :class="{
          'menu-internal__list-link__active': activeItem === 'dashboard',
        }"
        href="/dashboard"
      >
        Dashboard
      </a>
    </li>
    <li v-if="isDefault">
      <a
        class="menu-internal__list-link"
        :class="{
          'menu-internal__list-link__active': activeItem === 'pricing',
        }"
        href="/pricing"
      >
        Pricing
      </a>
    </li>
    <li>
      <a
        class="menu-internal__list-link menu-internal__list-link--new"
        :class="{
          'menu-internal__list-link__active': activeItem === 'feed',
        }"
        href="/feed"
      >
        Discover
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="30"
          height="12"
        >
          <use
            :xlink:href="`/img/components/header/sprite.svg#icon-new_icon`"
            :href="`/img/components/header/sprite.svg#icon-new_icon`"
          />
        </svg>
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    activeLink: {
      type: String,
      default: '',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    activeItem(): string {
      if (!this.activeLink) return ''
      const routePathParts = this.activeLink.split('/')
      if (routePathParts && routePathParts.length > 0) {
        return routePathParts[1]
      } else return ''
    },
  },
})
</script>

<style lang="scss">
.menu-internal {
  display: flex;
  align-items: center;
  list-style-type: none;
  &__list-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding-right: 20px;
    transition: 0.3s;
    font-size: 13px;
    color: #000000;
    font-family: Poppins,-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu, Cantarell,"Open Sans","Helvetica Neue",sans-serif;

    &--new {
      svg {
        margin: 0 0 0 2px;
      }
    }

    &:hover {
      color: #173bef;
    }

    &__active {
      color: #173bef;
    }
  }
}
</style>

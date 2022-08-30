<template>
  <div class="menu-footer">
    <ul class="menu-footer__column-list">
      <li class="menu-footer__column-item">
        <router-link class="menu-footer__column-link" to="/templates">
          Templates
        </router-link>
      </li>
      <li class="menu-footer__column-item">
        <router-link class="menu-footer__column-link" to="/pricing">
          Pricing
        </router-link>
      </li>
      <li class="menu-footer__column-item">
        <router-link class="menu-footer__column-link" to="/faq"
          >FAQ</router-link
        >
      </li>
      <li class="menu-footer__column-item">
        <router-link class="menu-footer__column-link" to="/feed"
          >Discover</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FacebookIcon from '@/assets/icons/facebook.svg?inline'
import TwitterIcon from '@/assets/icons/twitter.svg?inline'
import InstagramIcon from '@/assets/icons/instagram.svg?inline'
import SlackIcon from '@/assets/icons/slack.svg?inline'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg?inline'

export default Vue.extend({
  data() {
    return {
      activeMenuItemName: '',
    }
  },
  components: {
    FacebookIcon,
    TwitterIcon,
    InstagramIcon,
    SlackIcon,
    ArrowDownIcon,
  },
})
</script>

<style lang="scss">
.menu-footer {
  display: flex;
  height: 36px;
  &__column-list {
    list-style-type: none;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    display: inline-flex;
    align-items: center;
  }

  &__column-item {
    max-width: 104px;
    margin-right: 32px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__column-link {
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0.005em;
    text-decoration: none;
    color: $black;
    transition: 0.3s;
    border-bottom: 1px solid transparent;

    &:hover {
      color: #bdbdbd;

      .menu {
        &__column-link-icon {
          path {
            fill: #000000;
          }
        }
      }
    }
  }

  &__column-link-icon-wrapper {
    display: flex;
    align-items: center;
    width: 20px;
  }

  &__column-link-icon {
    width: 12px;

    &_twitter {
      width: 14px;
    }

    path {
      fill: #333333;
      transition: 0.3s;
    }
  }
}

@media screen and (max-width: 414px) {
  .menu-footer {
    &__column-link {
      font-size: 12px;
      line-height: 18px;
    }
    &__column-item {
      margin-right: 15px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>

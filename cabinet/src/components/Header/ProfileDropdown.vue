<template>
  <transition name="popup-layer" mode="out-in">
    <div class="profile-dropdown" v-if="isVisible">
      <div class="profile-dropdown__inner">
        <div class="profile-dropdown__user-info">
          <picture v-if="user.avatar">
            <source
              v-if="user.avatar.fullPathWebP"
              type="image/webp"
              :srcset="user.avatar.fullPathWebP.replace(' ', '%20')"
            />
            <source
              v-if="user.avatar.fullPathJp2"
              type="image/jp2"
              :srcset="user.avatar.fullPathJp2.replace(' ', '%20')"
            />
            <img
              class="profile-dropdown__user-avatar"
              v-if="user.avatar.fullPath"
              :src="user.avatar.fullPath"
            />
          </picture>
          <avatar
            v-else
            :size="30"
            :name="avatarName"
            class="profile-dropdown__user-avatar"
          />
          <div class="profile-dropdown__user-info-section">
            <span class="profile-dropdown__user-name">{{ user.fullName }}</span>
            <span class="profile-dropdown__user-email">{{ user.email }}</span>
          </div>
        </div>
        <ul class="profile-dropdown__menu">
          <li
            class="profile-dropdown__menu-item"
            v-for="(item, index) in menuTop"
            :key="index"
          >
            <a :href="item.link" :target="item.isNewPage ? '_blank' : null" class="profile-dropdown__menu-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="14"
                height="14"
              >
                <use
                  :xlink:href="`/img/components/header/sprite.svg#icon-${item.icon}`"
                  :href="`/img/components/header/sprite.svg#icon-${item.icon}`"
                />
              </svg>
              <span>{{ item.name }}</span>
            </a>
          </li>
        </ul>
        <ul class="profile-dropdown__menu profile-dropdown__menu--second">
          <li
            class="profile-dropdown__menu-item"
            v-for="(item, index) in menuBottom"
            :key="`bottom${index}`"
          >
            <a
              v-if="!item.isClick"
              :href="item.link"
              class="profile-dropdown__menu-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="14"
                height="14"
              >
                <use
                  :xlink:href="`/img/components/header/sprite.svg#icon-${item.icon}`"
                  :href="`/img/components/header/sprite.svg#icon-${item.icon}`"
                />
              </svg>
              <span :class="{ bold: item.isBold }">{{ item.name }}</span>
            </a>
            <div v-else class="profile-dropdown__menu-link" @click="item.click">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="14"
                height="14"
              >
                <use
                  :xlink:href="`/img/components/header/sprite.svg#icon-${item.icon}`"
                  :href="`/img/components/header/sprite.svg#icon-${item.icon}`"
                />
              </svg>
              <span>{{ item.name }}</span>
            </div>
          </li>
        </ul>
        <h3 class="profile-dropdown__subtitle">Follow us:</h3>
        <ul class="profile-dropdown__social-menu">
          <li class="profile-dropdown__social-menu-item">
            <a
              class="profile-dropdown__social-menu-link"
              href="https://twitter.com/itmeohq"
              target="_blank"
            >
              <img :src="srcTwitter" />
            </a>
          </li>
          <li class="profile-dropdown__social-menu-item">
            <a
              class="profile-dropdown__social-menu-link"
              href="https://www.facebook.com/itmeocom"
              target="_blank"
            >
              <img :src="srcFacebook" />
            </a>
          </li>
          <!--  <li class="profile-dropdown__social-menu-item">
            <a
              class="profile-dropdown__social-menu-link"
              href="https://slack.com/"
              target="_blank"
            >
              <img src="srcSlack" />
            </a>
          </li>
          <li class="profile-dropdown__social-menu-item">
            <a
              class="profile-dropdown__social-menu-link"
              href="https://spectrum.chat/"
              target="_blank"
            >
              <img
                src="srcSpectrum"
              />
            </a>
          </li> -->
          <li class="profile-dropdown__social-menu-item">
            <a
              class="profile-dropdown__social-menu-link"
              href="https://www.instagram.com/itmeo.design/"
              target="_blank"
            >
              <img :src="srcInstagram" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
//
import Vue from 'vue'
import { mapState } from 'vuex'

import UpgradeToProButton from './UpgradeToProButton.vue'
import Avatar from './avatar/Avatar.vue'

import apiClient from '../../utils/apiClient'
import { AccountDto, PlanCategory } from '../../utils/api'

export default Vue.extend({
  components: {
    Avatar,
    UpgradeToProButton,
  },
  props: {
    activeDropdownItem: {
      type: String,
      default: '',
    },
    isVisible: Boolean,
  },
  data() {
    return {
      PlanCategory,
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
    }),
    avatarName(): string {
      return !!this.user.fullName ? this.user.fullName : 'itmeo'
    },
    menuTop(): Array<any> {
      return [
        {
          name: 'Dashboard',
          icon: 'dashboard',
          link: '/dashboard',
          isNewPage: false
        },
        {
          name: 'View profile',
          icon: 'profile',
          link: `/${this.user.userName}`,
          isNewPage: true
        },
        {
          name: 'Templates',
          icon: 'templates',
          link: '/templates',
          isNewPage: false
        },
        {
          name: 'Discover',
          icon: 'discover',
          link: '/feed',
          isNewPage: false
        },
      ]
    },
    menuBottom(): Array<any> {
      return [
        {
          name: 'Edit Profile',
          icon: 'edit-profile',
          link: '/settings/profile',
        },
        {
          name: 'Settings',
          icon: 'settings_h',
          link: '/dashboard/settings',
        },
        {
          name: 'Plans',
          icon: 'star',
          link: '/dashboard/plans',
          isBold: true,
        },
        {
          name: 'Help',
          icon: 'help',
          link: '/dashboard/help',
        },
        {
          name: 'Log out',
          icon: 'logout',
          click: this.logout,
          isClick: true,
        },
      ]
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
    logout(event: Event) {
      if (event) event.preventDefault()

      apiClient.auth
        .authLogout()
        .then(() => {
          //this.$store.commit('auth/changeIsUserLoggedIn', false)
          // this.$store.commit('auth/changeUser', null)
          location.href = '/login'
        })
        .catch((error) => console.error(error))
    },
  },
})
</script>

<style lang="scss" scoped>
.actionDisabled {
  pointer-events: none;
  cursor: default;
}
.profile-dropdown {
  font-family: 'Poppins', sans-serif;
  position: absolute;
  top: calc(60px - 15px + 13px + 10px);
  right: 10px;
  z-index: 999;
  min-width: 210px;
  background-color: $white;
  border-radius: $shape_border_radius;
  border: 1px solid $gray200;
  box-shadow: 0 10px 50px rgba(24, 39, 75, 0.1);

  &__inner {
    padding: 20px;
  }

  &__user-info {
    display: flex;
    align-items: center;

    picture {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__user-info-section {
    overflow: hidden;
  }

  &__user-avatar {
    width: 30px;
    height: 30px;
    margin-right: 12px;
    border-radius: 50%;
  }

  &__user-name {
    max-width: 100%;
    display: block;
    font-size: 14px;
    line-height: 21px;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000000;
    overflow: hidden;
  }
  &__user-email {
    display: block;
    font-size: 10px;
    line-height: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &__main-menu {
    display: none;
  }
  &__menu {
    border-bottom: 1px solid #dadada;
    list-style-type: none;
    padding: 16px 0;
    margin: 0 0 16px;

    &--second {
      padding: 0 0 16px;
    }
  }

  &__menu-item {
    &:not(:last-child) {
      margin-bottom: 14px;
    }

    &_upgrade-to-pro-button {
      display: none;
    }
  }

  &__menu-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    border-radius: $shape_border_radius;
    transition: 0.3s;
    cursor: pointer;
    &:hover {
      svg {
        color: $blue200 !important;
      }

      span {
        color: $blue200;
      }
    }

    svg {
      margin-right: 15px;
      transition: 0.3s;
      color: $black;
    }

    span {
      font-size: 14px;
      line-height: 21px;
      color: #000000;
      transition: 0.3s;

      &.bold {
        font-weight: bold;
      }
    }

    &.nuxt-link-exact-active {
      svg {
        color: $blue200 !important;
      }

      span {
        color: $blue200;
      }
    }
    /*  &.nuxt-link-active {
      svg {
        color: $blue200 !important;
      }

      span {
        color: $blue200;
      }
    } */
  }

  &__subtitle {
    font-size: 13px;
    font-weight: 400;
    color: #000000;
    margin-bottom: 8px;
    margin-top: 16px;
  }

  &__social-menu {
    display: flex;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    list-style-type: none;
  }

  &__social-menu-item {
    margin-right: 16px;

    &:last-child {
      margin-right: 0;
    }
  }

  &__social-menu-link {
    display: inline-block;
    vertical-align: top;

    &:hover {
      img {
        fill: #000000;
      }
    }

    img {
      height: 14px;
      width: 24px;
      fill: #333333;
      transition: 0.3s;
    }
  }
}
</style>

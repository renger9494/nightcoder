<template>
  <header
    class="header"
    :class="{
      header_large: type === 'large',
      'header_full-width': type === 'full-width',
    }"
  >
    <div class="header__inner">
      <div class="header__side">
        <a class="header__logo" :href="rootUrl">
          <img :src="srcLogo" alt="Airtap" />
        </a>
        <div class="editor-menu" v-if="isInnerPage">
          <MainInternalMenu :activeLink="$route.path" :isDefault="false" />
        </div>
      </div>
      <div class="header__side" v-if="!isInnerPage && !isEmptyHeader">
        <menu class="header__menu" />
      </div>
      <div class="header__side" v-if="!isInnerPage && !isEmptyHeader">
        <user-info
          class="header__user-info"
          :activeProfileDropdownItem="activeDropdownItem"
          :isProfileDropdownVisible="isProfileDropdownVisible"
          :toggleProfileDropdown="toggleProfileDropdown"
          v-if="isUserLoggedIn"
        />
        <profile-dropdown
          class="header__profile-dropdown"
          :activeDropdownItem="activeDropdownItem"
          :isVisible="isProfileDropdownVisible"
          v-if="isUserLoggedIn"
        />
        <log-in-button
          class="header__log-in-button"
          v-if="!isUserLoggedIn"
          url="/login"
        >
          Log In
        </log-in-button>
        <burger
          class="header__menu-dropdown-toggler"
          :isActive="isMenuDropdownVisible"
          :click="toggleMenuDropdown"
        />
      </div>
      <div class="header__side" v-if="isInnerPage && !isEmptyHeader">
        <upgrade-to-pro-button
          class="header__upgrade-to-pro-button"
          v-if="upgradeButtonCondition"
        />
        <user-info
          class="header__user-info"
          :activeProfileDropdownItem="activeDropdownItem"
          :isProfileDropdownVisible="isProfileDropdownVisible"
          :toggleProfileDropdown="toggleProfileDropdown"
        />
        <profile-dropdown
          class="header__profile-dropdown"
          :activeDropdownItem="activeDropdownItem"
          :isVisible="isProfileDropdownVisible"
        />
        <burger
          class="header__profile-dropdown-toggler"
          :isActive="isProfileDropdownVisible"
          :click="toggleProfileDropdown"
        />
      </div>
    </div>
    <menu-dropdown
      class="header__menu-dropdown"
      :activeLink="$route.name"
      :onLogInLinkClick="handleLogInLinkClick"
      :isVisible="isMenuDropdownVisible"
    />
    <overlay :isVisible="isMenuDropdownVisible || isProfileDropdownVisible" />
  </header>
</template>

<script lang="ts">
//it's used in airtap-publish-ruler => all paths must be relative
import Vue from 'vue'
import Menu from './Menu.vue'
import UpgradeToProButton from './UpgradeToProButton.vue'
import LogInButton from './LogInButton.vue'
import UserInfo from './UserInfo.vue'
import ProfileDropdown from './ProfileDropdown.vue'
import Burger from './Burger.vue'
import MenuDropdown from './MenuDropdown.vue'
import MainInternalMenu from './MainInternalMenu.vue'
import Overlay from './Overlay.vue'

import { mapGetters, mapState } from 'vuex'
import { AccountDto, PlanCategory } from '../../utils/api'

export default Vue.extend({
  components: {
    Menu,
    UpgradeToProButton,
    LogInButton,
    UserInfo,
    ProfileDropdown,
    Burger,
    MenuDropdown,
    Overlay,
    MainInternalMenu,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    isInnerPage: { type: Boolean, default: false },
    isEmptyHeader: { type: Boolean, default: false },
  },
  data() {
    return {
      PlanCategory,
      isProfileDropdownVisible: false,
      isMenuDropdownVisible: false,
      isUsersSitesDropdownVisible: false,
      isUsersPagesDropdownVisible: false,
      projectId: this.$route.params.projectId || null,
    }
  },
  computed: {
    ...mapState({
      templateId: (state: any) => state.editor.templateId,
      projects: (state: any) => state.project.projects,
      projectPages: (state: any) => state.project.projectPages,
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
      user: (state: any) => <AccountDto>state.auth.user,
    }),
    ...mapGetters({
      isUserWithFreePlan: 'auth/isUserWithFreePlan',
    }),
    routeName(): string | undefined | null {
      return this.$route.name
    },
    selectedProject(): any {
      return this.projects.find((project: any) => {
        return project.id == this.projectId
      })
    },
    selectedPage(): any {
      return this.projectPages.find((page: any) => {
        return page.id == this.$route.params.pageId
      })
    },
    rootUrl(): string {
      return this.isUserLoggedIn ? '/dashboard' : '/'
    },
    activeDropdownItem(): string {
      if (this.$route.name === 'dashboard') return 'dashboard'
      if (this.$route.name === 'feed') return 'feed'
      if (
        this.$route.name === 'settings-section' &&
        this.$route.params.section === 'help'
      )
        return 'help'

      if (
        this.$route.name === 'settings-section' &&
        this.$route.params.section === 'plans'
      )
        return 'plans'

      if (this.$route.name === 'settings-section') return 'settings'

      return ''
    },
    selectedProjectName(): string {
      return this.routeName === 'projects-projectId-pages'
        ? this.selectedProject.name
        : ''
    },
    upgradeButtonCondition(): boolean {
      if (!this.isUserWithFreePlan) return this.isUserWithFreePlan
      return !this.user.isAdmin
    },
    srcLogo() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/logo-uplaunch.svg'
    },
  },
  async created() {
    if (!(<any>process).client) return
    document.addEventListener('click', this.hideProfileDropdown)
    document.addEventListener('click', this.hideEditDropdown)
    document.addEventListener('keyup', this.hideEditDropdown)
    document.addEventListener('keyup', this.hideProfileDropdown)
    document.addEventListener('click', this.hideMobileDropdown)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hideProfileDropdown)
    document.removeEventListener('keyup', this.hideProfileDropdown)
    document.addEventListener('click', this.hideMobileDropdown)
  },
  methods: {
    toggleEditDropdown(popup: string) {
      if (popup === 'pages') {
        this.isUsersSitesDropdownVisible = false
        this.isUsersPagesDropdownVisible = !this.isUsersPagesDropdownVisible
      } else {
        this.isUsersPagesDropdownVisible = false
        this.isUsersSitesDropdownVisible = !this.isUsersSitesDropdownVisible
      }
    },
    toggleProfileDropdown(event: any) {
      if (event) event.preventDefault()

      this.isProfileDropdownVisible = !this.isProfileDropdownVisible
    },
    toggleMenuDropdown(event: any) {
      if (event) event.preventDefault()

      this.isMenuDropdownVisible = !this.isMenuDropdownVisible
    },
    hideEditDropdown(event: any) {
      if (event) {
        if (
          event.key === 'Escape' ||
          // These are exceptions: the blocks on what click should NOT close the profile dropdown
          (!event.target.closest('div.editor-menu__iconed') &&
            !event.target.closest('.edit-dropdown')) ||
          // These are blocks on what click SHOULD close the profile dropdown
          event.target.classList.contains('edit-dropdown-item__preview-wrap') ||
          event.target.closest('.edit-dropdown-item__preview-wrap') ||
          event.target.classList.contains('edit-dropdown__close') ||
          event.target.closest('.edit-dropdown__close') ||
          event.target
            .closest('.edit-dropdown-item__btn')
            .classList.contains('settings') ||
          event.target.classList.contains('settings')
        ) {
          this.isUsersSitesDropdownVisible = false
          this.isUsersPagesDropdownVisible = false
        }
      }
    },
    hideProfileDropdown(event: any) {
      if (event) {
        if (
          event.key === 'Escape' ||
          // These are exceptions: the blocks on what click should NOT close the profile dropdown
          (!event.target.closest('.header__user-info') &&
            !event.target.closest('.user-info__profile-dropdown') &&
            !event.target.closest('.header__profile-dropdown') &&
            !event.target.closest('.header__profile-dropdown-toggler')) ||
          // These are blocks on what click SHOULD close the profile dropdown
          event.target.classList.contains('profile-dropdown__menu-item') ||
          event.target.closest('.profile-dropdown__menu-item') ||
          event.target.classList.contains(
            'profile-dropdown__social-menu-item'
          ) ||
          event.target.closest('.profile-dropdown__social-menu-item') ||
          event.target.closest('.profile-dropdown__action')
        ) {
          this.isProfileDropdownVisible = false
        }
      }
    },
    hideMobileDropdown(event: any) {
      if (event) {
        if (
          event.target.classList.contains('menu-dropdown__list-link_active') ||
          event.target.closest('.menu-dropdown__list-link_active') ||
          event.target.closest('.header__menu-dropdown-toggler')
        ) {
          return
        }

        if (
          event.target.classList.contains('menu-dropdown__list-link') ||
          event.target.closest('.menu-dropdown__list-link') ||
          event.target.classList.contains('menu-dropdown__social-list-link') ||
          event.target.closest('.menu-dropdown__social-list-link') ||
          !event.target.closest('.header__menu-dropdown')
        ) {
          this.isMenuDropdownVisible = false
        }
      }
    },
    handleLogInLinkClick(event: Event) {
      if (event) event.preventDefault()
      this.$router.push({
        path: '/login',
        query: { redirectUrl: this.$route.fullPath },
      })
      this.isMenuDropdownVisible = false
    },
  },
})
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
}
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 1px;
  height: 60px;
  z-index: 998;
  position: sticky;
  top: 0;

  &--templates {
    font-family: 'Poppins', sans-serif;
  }

  &_full-width {
    .header__inner {
      max-width: 100%;
      padding-right: $margin_page_high_resolution;
      padding-left: $margin_page_high_resolution;
    }
  }
  &__profile-dropdown-toggler {
    display: none;
  }
  &__profile-dropdown {
    display: none;
  }
  &_large {
    .header__inner {
      //max-width: 1574px;
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
    //min-width: 80px; // Why? It is for correct centering Menu, it is the largest width of side blocks
  }

  &__logo {
    display: inline-block;
    vertical-align: top;
  }

  &__upgrade-to-pro-button {
    margin-right: 16px;
  }
}

.editor-menu {
  display: flex;
  align-items: center;
  height: 30px;
  margin-left: 16px;
  padding-left: 16px;
  position: relative;
  border-left: 1px solid #dadada;
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
@media screen and (max-width: 768px) {
  .header {
    &__inner {
      padding-right: $margin_page_tablet;
      padding-left: $margin_page_tablet;
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
@media screen and (max-width: 655px) {
  .editor-menu {
    display: none !important;
  }
  .header {
    &__profile-dropdown-toggler {
      display: block !important;
    }
    &__profile-dropdown {
      display: block !important;
    }
    &__user-info {
      display: none !important;
    }
    &__menu {
      display: none !important;
    }
  }
}
@media screen and (max-width: 414px) {
  .header {
    &__inner {
      padding-right: $margin_page_mobile;
      padding-left: $margin_page_mobile;
    }
    &__profile-dropdown-toggler {
      display: block !important;
    }
    &__profile-dropdown {
      display: block !important;
    }
    &__user-info {
      display: none !important;
    }
    &__menu {
      display: none !important;
    }
  }
}
</style>

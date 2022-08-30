<template>
  <div
    class="site-settings"
    :class="classesSiteSettings"
    @click="handleWrapperClick"
    tabindex="0"
    @keydown.esc="closeModal"
  >
    <div class="site-settings__inner" ref="siteSettingsInner">
      <div class="site-settings__inner-header">
        <div class="site-settings__site-title">
          {{ mode === ModalMode.Page ? 'Page settings' : 'Project settings' }}
        </div>
        <button class="site-settings__close-button" @click="closeModal">
          <svg-icon name="close" width="8" height="8" color="#BDBDBD" />
        </button>
      </div>
      <div class="site-settings__scroll">
        <div class="site-settings__inner-title">
          <div class="site-settings__title">
            <span @click="siteMode" :class="{ site: mode === ModalMode.Project }">{{ projectSettings.title }}</span>
            <span v-if="mode === ModalMode.Page">/</span>
            <span v-if="mode === ModalMode.Page">
              {{ currentPage.name || 'Unnamed Page' }}
            </span>
          </div>
          <upgrade-to-pro-header v-if="isUserWithFreePlan && !user.isAdmin" />
        </div>
        <div class="site-settings__inner-content">
          <navigation
            :activeSection="activeSection"
            :changeActiveSection="changeActiveSection"
            :currentPage="currentPage"
          />
          <main class="site-settings__content">
            <general
              v-if="activeSection === SectionType.GENERAL"
              :openProjectId="projectId"
              :settings="projectSettings"
            />
            <favicon
              v-if="activeSection === SectionType.FAVICON"
              :openProjectId="projectId"
              :settings="projectSettings"
            />
            <domain
              v-if="activeSection === SectionType.DOMAIN"
              :openProjectId="projectId"
              :settings="projectSettings"
            />
            <integrations
              v-if="activeSection === SectionType.INTEGRATIONS"
              :openProjectId="projectId"
              :settings="projectSettings"
            />
            <branding
              v-if="activeSection === SectionType.BRANDING"
              :projectId="projectId"
              :projectSettings="projectSettings"
            />
            <transfer
              v-if="activeSection === SectionType.TRANSFER"
              :openProjectId="projectId"
              :settings="projectSettings"
            />
            <home-page v-if="activeSection === SectionType.HOME_PAGE" :settings="projectSettings" />
            <help v-if="activeSection === SectionType.HELP" />
            <general-page
              v-if="activeSection === SectionType.PAGE_GENERAL"
              :changeActiveSection="changeActiveSection"
              :page="currentPage"
              :projectSettings="projectSettings"
            />
            <seo v-if="activeSection === SectionType.PAGE_SEO" :page="currentPage" />
            <social-share-image
              v-if="activeSection === SectionType.PAGE_SSI"
              :openProjectId="projectId"
              :page="currentPage"
            />
            <message
              class="site-settings__message"
              v-if="visibleMessageName === VisibleMessageNameType.Success"
              :emoji="'🎉'"
              :text="'Your settings have been successfully updated!'"
            />
            <message
              class="site-settings__message"
              v-if="visibleMessageName === VisibleMessageNameType.Failed"
              :type="'error'"
              :text="'Something went wrong'"
            />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import HTMLElementEvent from '@/utils/types/HTMLElementEvent';
import { ModalMode, SiteSettingsMutations, SectionType, SiteSettingsState } from '@/store/siteSettings';
import { VisibleMessageNameType } from '@/store/ui';

import Navigation from '@/components/Shared/SiteSettings/Navigation.vue';

import General from '@/components/Shared/SiteSettings/Project/General.vue';
import Favicon from '@/components/Shared/SiteSettings/Project/Favicon.vue';
import Domain from '@/components/Shared/SiteSettings/Project/Domain.vue';
import Integrations from '@/components/Shared/SiteSettings/Project/Integrations.vue';
import Branding from '@/components/Shared/SiteSettings/Project/Branding.vue';
import HomePage from '@/components/Shared/SiteSettings/Project/HomePage.vue';
import Transfer from '@/components/Shared/SiteSettings/Project/Transfer.vue';
import GeneralPage from '@/components/Shared/SiteSettings/Page/GeneralPage.vue';
import Seo from '@/components/Shared/SiteSettings/Page/Seo.vue';
import SocialShareImage from '@/components/Shared/SiteSettings/Page/SocialShareImage.vue';

import Help from '@/components/Shared/SiteSettings/Help.vue';
import Message from '@/components/Shared/SiteSettings/Message.vue';

import { ProjectSettingsDto, AccountDto } from '@/utils/api';
import UpgradeToProHeader from '@/components/Shared/SiteSettings/UpgradeToProHeader.vue';

export default Vue.extend({
  components: {
    UpgradeToProHeader,
    GeneralPage,
    Seo,
    SocialShareImage,
    Navigation,
    General,
    Favicon,
    Domain,
    Integrations,
    Branding,
    HomePage,
    Help,
    Message,
    Transfer
  },
  props: {
    isVisible: Boolean
  },

  data(): any {
    return {
      VisibleMessageNameType,
      heightIsMore: false,
      SectionType,
      ModalMode
    };
  },
  computed: {
    ...mapState({
      //TODO: move to shared message modal
      visibleMessageName: (state: any) => <VisibleMessageNameType>state.ui.visibleMessageName,
      mode: (state: any) => (<SiteSettingsState>state.siteSettings).mode,
      activeSection: (state: any) => (<SiteSettingsState>state.siteSettings).activeSection,
      currentPage: (state: any) => (<SiteSettingsState>state.siteSettings).page,
      project: (state: any) => (<SiteSettingsState>state.siteSettings).project,
      user: (state: any) => <AccountDto>state.auth.user
    }),
    ...mapGetters({
      isUserWithFreePlan: 'auth/isUserWithFreePlan'
    }),

    projectSettings(): ProjectSettingsDto | null {
      return this.project ? this.project.settings : null;
    },
    projectId(): number | null {
      return this.project ? this.project.id : null;
    },
    classesSiteSettings(): any {
      return {
        'site-settings_visible': this.isVisible,
        'site-settings_block': this.heightIsMore,
        'site-settings_small-height': !this.isUserWithFreePlan || this.user.isAdmin
      };
    }
  },
  mounted() {
    setTimeout(() => {
      this.checkHeight();
    }, 500);

    window.addEventListener('resize', this.checkHeight);

    if (this.$el) (this.$el as HTMLElement).focus();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkHeight);
  },
  methods: {
    checkHeight() {
      const siteSettingsInnerHeight = (<HTMLDivElement>this.$refs.siteSettingsInner).offsetHeight;
      const windowHeight = window.innerHeight;

      if (siteSettingsInnerHeight > windowHeight) {
        this.heightIsMore = true;
      } else {
        this.heightIsMore = false;
      }
    },
    siteMode(event: Event) {
      this.$store.commit(`siteSettings/${SiteSettingsMutations.CHANGE_MODAL_MODE}`, ModalMode.Project);

      this.changeActiveSection(SectionType.GENERAL, event);
    },
    changeActiveSection(newActiveSection: number, event: Event) {
      if (event) event.preventDefault();

      this.$store.commit(`siteSettings/${SiteSettingsMutations.CHANGE_ACTIVE_SECTION}`, newActiveSection);
    },
    closeModal(event: Event) {
      if (event) event.preventDefault();

      this.$store.dispatch('ui/closeModal');
    },
    handleWrapperClick(event: HTMLElementEvent<HTMLDivElement>) {
      if (event && event.target.classList.contains('site-settings')) {
        this.closeModal(event);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.site-settings {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &_visible {
    opacity: 1;
    visibility: visible;
  }

  &_block {
    display: block;
    padding-top: 80px;
    padding-bottom: 80px;

    @include sm-down {
      padding-top: 0;
      padding-bottom: 0;
    }

    .site-settings__inner {
      margin-right: auto;
      margin-left: auto;
    }
  }

  &_small-height {
    .site-settings__inner {
      height: 565px;

      @include sm-down {
        overflow: scroll;
        min-height: 100%;
        height: auto;
      }
    }
  }

  &__inner {
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 800px;
    width: 100%;
    max-height: 560px;
    min-height: 560px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 15px 30px rgba(79, 79, 79, 0.2);
    overflow: hidden;

    @include sm-down {
      height: auto;
      min-height: 100%;
      border-radius: 0;
    }

    @media all and (max-height: 600px) {
      max-height: 400px;
      min-height: 400px;
    }

    &-title {
      width: 100%;
      height: 70px;
      padding: 18px 30px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      position: sticky;
      top: 0;
      background: $white;
      z-index: 20;
    }

    &-header {
      display: flex;
      align-items: center;
      width: 100%;
      background: $gray100;
      line-height: 50px;
      height: 50px;

      @include sm-down {
        height: 0;
        background: transparent;
        border-bottom: none;
      }
    }

    &-content {
      display: flex;
      flex-wrap: nowrap;
      align-items: flex-start;
      width: 100%;
      height: 440px;
      min-height: 440px;
      overflow-y: scroll;

      &::-webkit-scrollbar {
        width: 2px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: #bdc2c7;
        height: 30px;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-track-piece {
        display: none;
      }

      @include sm-down {
        flex-direction: column;
        min-height: 100%;
      }
    }
  }

  &__scroll {
    height: 100%;
  }

  &__content {
    flex: 1 1 auto;
    padding: 0 30px 40px 50px;
    overflow: hidden;

    @include sm-down {
      padding: 20px 11px 70px;
    }
  }

  &__title {
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    display: flex;
    align-items: center;
    span:first-of-type,
    span:nth-child(2) {
      color: #000000;
      opacity: 0.4;
      cursor: pointer;
      margin-right: 3px;
      transition: 0.3s;
      &.site {
        opacity: 1;
        cursor: default;
      }
    }
    span:nth-child(3) {
      display: inline-block;
      width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span:first-of-type:hover {
      opacity: 1;
    }
  }

  &__site-title {
    color: #000;
    font-size: 13px;
    margin-left: 30px;
    @include sm-down {
      display: none;
    }
  }

  &__message {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translate(-50%, 50%);

    @include sm-down {
      position: fixed;
    }

    &.message_visible {
      transform: translateX(-50%);
    }
  }

  &__close-button {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: none;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    transition: 0.3s;
    margin-left: auto;
    margin-right: 16px;

    @include sm-down {
      position: absolute;
      top: 14px;
      right: 14px;
      margin-right: 0;
      background-color: #f2f2f2;
    }

    &:hover {
      background-color: #828282;

      path {
        fill: #ffffff;
      }
    }

    &:active {
      background-color: #333333;

      path {
        fill: #ffffff;
      }
    }

    path {
      fill: #bdbdbd;
      transition: 0.3s;
    }
  }
}

.popup-settings-enter-active {
  transition: transform 0.5s cubic-bezier(0.8, -0.5, 0.2, 1.4), opacity 0.5s cubic-bezier(0.8, -0.5, 0.2, 1.4);
}
.popup-settings-leave-active {
  transition: 0s;
}
.popup-settings-enter,
.popup-settings-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}
</style>

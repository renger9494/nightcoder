<template>
  <div class="publish-popup-wrap">
    <switcher
      :class="['publish-popup-switcher']"
      :isWhite="currentLayout === PublishType.Community && !isAlreadyProjectPublished"
      colorElement="#949CAD"
      colorActiveElement="#000000"
      :switcher-items="switcherItems"
      @filterName="changeViewType"
    />

    <div class="publish-popup-wrap__child" v-if="currentLayout === PublishType.Link">
      <img
        v-if="!isAlreadyPagePublished"
        class="publish-popup-status-img publish-popup-status-img--not-published"
        src="@/assets/img/editor/not_published.svg"
        alt="new"
      />
      <img
        v-if="isAlreadyPagePublished"
        class="publish-popup-status-img publish-popup-status-img--published"
        src="@/assets/img/editor/published-success.png"
        srcset="@/assets/img/editor/published-success@2x.png 2x"
        alt="new"
      />

      <div class="publish-popup-status-title">
        <div class="publish-popup-status-title-line">
          Your page «
          <div class="publish-popup-status-title-name">{{ pageName }}</div>
          »
        </div>
        is {{ isAlreadyPagePublished ? 'published now' : 'not published yet' }}
      </div>

      <div class="publish-popup-wrap__domain">
        <publish-input
          class="publish-popup-wrap__domain-field"
          :url="airtapDomainUrl"
          :is-published="isAlreadyPagePublished"
          :is-home-page="isHomePage"
          :open-settings="openSettings"
        />
      </div>
    </div>

    <div v-if="currentLayout === PublishType.Community" class="custom-domain-section custom-domain-section--domain">
      <Project v-if="isAlreadyProjectPublished" :project="project" :choosedPages="choosedPages" :user="user" />
      <img
        v-else
        class="publish-popup-status-img publish-popup-status-img--community"
        src="@/assets/img/publish-popup/community.png"
        alt="new"
      />

      <div v-if="!isAlreadyProjectPublished" class="publish-popup-status-title title-community">
        Add your project in community & make it featured
      </div>
    </div>

    <div class="action-btns" v-if="isPublished && currentLayout == PublishType.Link">
      <a class="btn tweet" :href="linkTweet">
        <svg-icon name="twitter" width="23" height="23" color="#fff" />
        <span>Tweet</span>
      </a>
      <a class="btn facebook" :href="linkShare">
        <svg-icon name="facebook" width="16" height="16" color="#fff" />
        <span>Share</span>
      </a>
    </div>
    <div class="action-btn" v-else-if="currentLayout == PublishType.Link">
      <template v-if="!isAlreadyPagePublished">
        <button v-if="additionalPublishStatus == PublishStatus.InProgress" class="btn loading iconed">
          <svg-icon name="loader-icon" width="16" height="16" color="#fff" />
          <div class="btn-inline">
            Share «
            <div class="btn-name">{{ pageName }}</div>
            » page
          </div>
        </button>
        <button v-else @click="publish" class="btn primary iconed" :disabled="!canPublishPage">
          <svg-icon name="publish-icon" width="16" height="16" color="#fff" />
          <div class="btn-inline">
            Share «
            <div class="btn-name">{{ pageName }}</div>
            » page
          </div>
        </button>
      </template>
      <template v-if="isAlreadyPagePublished">
        <button v-if="additionalPublishStatus == PublishStatus.InProgress" class="btn loading iconed">
          <svg-icon name="loader-icon" width="16" height="16" color="#fff" />
          <div class="btn-inline">
            Updating «
            <div class="btn-name">{{ pageName }}</div>
            » page
          </div>
        </button>
        <button @click="publish" v-else class="btn gray iconed">
          <svg-icon name="update-stroke-icon" width="13" height="13" color="#fff" />
          <div class="btn-inline">
            Update «
            <div class="btn-name">{{ pageName }}</div>
            » page
          </div>
        </button>
      </template>
    </div>

    <div class="action-btn" v-else-if="currentLayout == PublishType.Community && !isAlreadyProjectPublished">
      <button @click="openSettingsCommunity" class="btn iconed" ref="popupCommunityButton">
        <svg-icon name="add" width="24" height="24" color="#000" />
        <span>Publish in community</span>
      </button>
    </div>
    <div class="action-btns" v-else-if="currentLayout == PublishType.Community && isAlreadyProjectPublished">
      <button @click="openSettingsCommunity" class="btn iconed" ref="popupCommunityButton">
        <svg-icon name="edit" width="13" height="13" color="#000" />
        <span>Edit</span>
      </button>
      <button v-if="additionalPublishStatus != PublishStatus.InProgress" @click="updatePages" class="btn gray iconed">
        <svg-icon name="update-stroke-icon" width="13" height="13" color="#fff" />
        <span>Update pages</span>
      </button>

      <button v-if="additionalPublishStatus == PublishStatus.InProgress" class="btn loading iconed">
        <svg-icon name="loader-icon" width="16" height="16" color="#fff" />
        <span>Updating pages</span>
      </button>
    </div>
    <publish-custom-domain-switch
      class="publish-popup-wrap__switch"
      :class="{
        'publish-popup-wrap__switch--community': currentLayout === PublishType.Community,
        'publish-popup-wrap__switch--gutter': !isAlreadyPagePublished,
        'publish-popup-wrap__switch--hidden': isPro
      }"
      :is-pro="!isPro"
    />
    <message
      class="publish-popup-wrap__message"
      v-if="visibleMessageName === VisibleMessageNameType.Success"
      :emoji="'🎉'"
      :text="'Your project has been successfully updated!'"
    />
    <message
      class="publish-popup-wrap__message"
      v-if="visibleMessageName === VisibleMessageNameType.Failed"
      :type="'error'"
      :text="'Something went wrong'"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { VisibleMessageNameType } from '@/store/ui';
import { cloneDeep as _cloneDeep } from 'lodash';

import Switcher from '@/components/Editor/Sidebar/Switcher.vue';
import apiClient from '@/utils/apiClient';
import PublishPlan from '@/components/Editor/Sidebar/Modal/components/Publish/PublishPlan.vue';
import Project from '@/components/Editor/Sidebar/Modal/components/Publish/Project.vue';
import PublishInput from '@/components/Editor/Sidebar/Modal/components/Publish/PublishInput.vue';
import PublishState from '@/components/Shared/PublishStatus.vue';
import Message from '@/components/Shared/SiteSettings/Message.vue';
import PublishCustomDomainSwitch
  from "@/components/Editor/Sidebar/Modal/components/Publish/PublishCustomDomainSwitch.vue";

import {
  BaseProjectDto,
  BaseProjectPageDto,
  CustomDomainStatus,
  ProjectSettingsDto,
  AccountDto,
  CommunityProjectDto,
  PlanCategory
} from '@/utils/api';

import { DomainStatus, domainStatusChecker } from '@/utils/domainChecker';
import { SectionType } from '@/store/siteSettings';
import { PopupSettings, PublishPopupData, PopupType, PublishInCommunityPopupData } from '../../types';

enum PublishStatus {
  NotPublished = 'NotPublished',
  InProgress = 'InProgress',
  PublishedSuccessful = 'PublishedSuccessful',
  WebsiteIsPublished = 'WebsiteIsPublished',
  Failed = 'Failed'
}

enum PublishType {
  Link = 'Link',
  Community = 'Community'
}

export default Vue.extend({
  components: {
    PublishCustomDomainSwitch,
    Switcher,
    PublishInput,
    PublishPlan,
    Message,
    Project,
    'publish-status': PublishState
  },
  data: () => ({
    PublishStatus,
    PublishType,
    currentLayout: PublishType.Link,
    VisibleMessageNameType,
    publishAlert: null,
    additionalPublishStatus: PublishStatus.NotPublished,
    isPublished: false,
    projectCommunity: {} as CommunityProjectDto,
    customDomainNoticeText: `<span>Note:</span> It may take 24 hours to connect the new DNS settings for your domain. When your site is connected, click "Check domain".`
  }),
  computed: {
    ...mapState({
      popupSettings: (state: any) => <PopupSettings<PublishPopupData>>state.editor.popupSettings,
      user: (state: any) => <AccountDto>state.auth.user,
      userConfig: (state: any) => state.editor.userConfig,
      visibleMessageName: (state: any) => <VisibleMessageNameType>state.ui.visibleMessageName
    }),
    isPro():boolean {
      return this.user.plan.category == PlanCategory.Pro || this.user.isAdmin
    },
    page(): BaseProjectPageDto {
      return this.popupSettings.data.page;
    },
    project(): BaseProjectDto {
      return this.popupSettings.data.project;
    },
    pageName(): string {
      return this.popupSettings.data.page?.name || '';
    },
    choosedPages(): number {
      return this.popupSettings.data.pages?.filter(item => item.isPublished).length || 0;
    },
    canPublishPage(): boolean {
      const homePage = this.popupSettings.data.pages.find(page => page.isHomePage);
      return (homePage?.isPublished && !this.page.isHomePage) || this.page.isHomePage;
    },
    canUnpublishPage(): boolean {
      return !this.page.isHomePage;
    },
    domain(): string {
      return process.env.VUE_APP_AIRTAP_DOMAIN;
    },
    projectSettings(): ProjectSettingsDto {
      return this.project.settings;
    },
    customDomainStatus(): string {
      return this.projectSettings.customDomainStatus;
    },
    isAlreadyPagePublished(): boolean {
      return this.page?.isPublished ?? false;
    },
    isAlreadyProjectPublished(): boolean {
      return this.project.isPublishedInCommunity;
    },
    isHomePage(): boolean {
      return this.page.isHomePage;
    },
    airtapDomainUrl(): string {
      if (this.isHomePage) return `${this.domain}/w/${this.projectSettings.airtapDomain}`;

      return `${this.domain}/w/${this.projectSettings.airtapDomain}/${this.page.url}`;
    },
    linkShare(): string {
      return `https://www.facebook.com/sharer.php?u=${this.airtapDomainUrl}&amp;t=${this.project.name}%20on%20@aiptap:%20${this.airtapDomainUrl}`;
    },

    linkTweet(): string {
      return `https://twitter.com/share?url=${this.airtapDomainUrl}&amp;text=${this.project.name}%20on%20@aiptap:%20${this.airtapDomainUrl}`;
    },
    isCustomDomainSet(): boolean {
      return !!this.projectSettings.customDomain;
    },
    isCustomDomainPublishedSetAndNeedToBeChecked(): boolean {
      return (
        this.isAlreadyPagePublished &&
        this.customDomainStatus === CustomDomainStatus.NotPublished &&
        this.isCustomDomainSet
      );
    },
    isCustomDomainSetApprovedAndPublished(): boolean {
      return (
        this.isAlreadyPagePublished &&
        this.customDomainStatus === CustomDomainStatus.Published &&
        this.isCustomDomainSet
      );
    },
    switcherItems(): any {
      return [
        {
          name: PublishType.Link,
          isActive: this.currentLayout == PublishType.Link
        },
        {
          name: PublishType.Community,
          icon: 'community',
          iconWidth: '16',
          iconHeight: '16',
          iconColor: this.currentLayout == PublishType.Community ? '#000' : '#949CAD',
          isActive: this.currentLayout == PublishType.Community
        }
      ];
    }
  },
  created() {
    this.currentLayout = this.isAlreadyProjectPublished ? PublishType.Community : PublishType.Link;
    this.changeHeaderPopup();
  },
  async mounted() {
    try {
      const { data: project } = await apiClient.projects.projectsGetCommunity(this.project.id);
      this.projectCommunity = project;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async updatePages() {
      try {
        const projectId = this.project.id;
        this.additionalPublishStatus = PublishStatus.InProgress;
        apiClient.projects
          .projectsUpdatePagesInCommunity(projectId)
          .then(({ data: dto }) => {
            this.additionalPublishStatus = PublishStatus.PublishedSuccessful;
            setTimeout(() => {
              this.additionalPublishStatus = PublishStatus.WebsiteIsPublished;
            }, 3000);
            this.$store.commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success);
          })
          .catch((error: any) => {
            this.additionalPublishStatus = PublishStatus.Failed;
            this.$store.commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
            setTimeout(() => {
              this.additionalPublishStatus = PublishStatus.WebsiteIsPublished;
            }, 3000);
            console.error(error);
          });
      } catch (error) {
        this.additionalPublishStatus = PublishStatus.Failed;
        this.$store.commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
        setTimeout(() => {
          this.additionalPublishStatus = PublishStatus.WebsiteIsPublished;
        }, 3000);
        console.error(error);
      }
    },
    openSettingsCommunity() {
      let pages = [] as BaseProjectPageDto[];
      apiClient.projectPages.projectPagesGet(+this.project.id).then(({ data }) => {
        pages = data;
        const domRect = (<HTMLDivElement>this.$refs['popupCommunityButton']).getBoundingClientRect();
        const popupSettings: PopupSettings<PublishInCommunityPopupData> = {
          active: true,
          closeButton: true,
          header: 'Publish in community',
          description: 'Get likes and comments and share your work with the world.',
          content: PopupType.PublishInCommunity,
          location: domRect,
          data: {
            project: this.projectCommunity,
            pages,
            projectSettings: this.projectSettings,
            projectId: this.project.id
          }
        };
        this.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings);
      });
    },
    changeViewType(type: PublishType) {
      this.currentLayout = type;
      this.changeHeaderPopup();
    },
    onCancel() {
      this.$store.commit('editor/SET_POPUP_SETTINGS', {
        active: false
      });
    },
    async publish() {
      if (!this.canPublishPage) return;

      try {
        this.additionalPublishStatus = PublishStatus.InProgress;

        const projectId = this.project.id;
        const pageId = this.page.id;

        /*  const userConfigString = JSON.stringify(this.userConfig).replace(/\\n/g, '');
        await apiClient.projectPages.projectPagesSaveSettings(projectId, pageId, {
          settings: userConfigString
        }); */

        apiClient.projectPages
          .projectPagesPublish(projectId, pageId)
          .then(({ data: dto }) => {
            this.additionalPublishStatus = PublishStatus.PublishedSuccessful;
            setTimeout(() => {
              this.additionalPublishStatus = PublishStatus.WebsiteIsPublished;
            }, 3000);
            this.$store.commit('project/publishPage', {
              publishedPage: dto.page,
              projectId: projectId
            });
            this.isPublished = true;
          })
          .catch((error: any) => {
            this.additionalPublishStatus = PublishStatus.Failed;
            this.$store.commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
            setTimeout(() => {
              this.additionalPublishStatus = PublishStatus.NotPublished;
            }, 3000);
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    },
    unPublish() {
      if (!this.canUnpublishPage) return;

      this.additionalPublishStatus = PublishStatus.InProgress;
      const projectId = this.project.id;
      const pageId = this.page.id;

      apiClient.projectPages
        .projectPagesUnpublished(projectId, pageId)
        .then(() => {
          this.additionalPublishStatus = PublishStatus.NotPublished;
          this.$store.commit('project/unPublishPage', {
            publishedPage: { ...this.page, isPublished: false },
            projectId: projectId
          });
        })
        .catch((error: any) => {
          this.additionalPublishStatus = PublishStatus.WebsiteIsPublished;
        });
    },
    async openSettings(event: Event, isHomePage: boolean) {
      if (event) event.preventDefault();

      const { dispatch, commit } = this.$store;

      await dispatch('siteSettings/loadModalData', { id: this.page.id, projectId: this.project.id });

      if (isHomePage) {
        commit('siteSettings/CHANGE_ACTIVE_SECTION', SectionType.DOMAIN);
      } else {
        await dispatch('siteSettings/setPage', { page: this.page });
      }

      await dispatch('ui/changeVisibleModalName', { newVisibleModalName: 'site-settings' });
      this.closeModal();
    },
    closeModal() {
      this.$store.commit('editor/SET_POPUP_SETTINGS', {
        active: false
      });
    },
    changeHeaderPopup() {
      if (
        (this.currentLayout == PublishType.Community && this.isAlreadyProjectPublished) ||
        (this.currentLayout == PublishType.Link && this.isAlreadyPagePublished)
      ) {
        this.$store.commit('editor/CHANGE_POPUP_HEADER', 'Update changes');
        this.$store.commit('editor/CHANGE_POPUP_DESCRIPTION', 'Update your changes');
      } else {
        this.$store.commit('editor/CHANGE_POPUP_HEADER', 'Publish');
        this.$store.commit('editor/CHANGE_POPUP_DESCRIPTION', 'Anyone with the link can view');
      }
      this.$store.commit(
        'editor/CHANGE_POPUP_BACKGROUND',
        this.currentLayout == PublishType.Community && !this.isAlreadyProjectPublished
          ? 'https://s3.amazonaws.com/beta.airtap.io/Defaults/community-popup-background.png'
          : ''
      );
    },
    async confirmCustomDomain() {
      this.additionalPublishStatus = PublishStatus.InProgress;
      const projectSettings = _cloneDeep(this.projectSettings);

      const payload = {
        id: this.project.id,
        settings: projectSettings
      };

      const { commit } = this.$store;

      //check domain
      const domainStatus = await domainStatusChecker.isWorked(this.project.id);

      if (domainStatus == DomainStatus.NotWorked) {
        //show message to user about fail
        this.customDomainNoticeText =
          '<span>Notice!</span> Make sure that you have configured the DNS settings correctly. Please wait when your DNS settings would be connected with the new domain. If it has been more than 24 hours since you changed the new DNS settings, please write to support.';
        this.additionalPublishStatus = PublishStatus.PublishedSuccessful;
      } else {
        this.additionalPublishStatus = PublishStatus.PublishedSuccessful;
        payload.settings = {
          ...projectSettings,
          customDomainStatus: CustomDomainStatus.Published
        };

        apiClient.projects
          .projectsSaveSettings(payload.id, payload.settings)
          .then(() => {
            commit('project/changeProjectSettings', payload);
            commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success);
          })
          .catch(error => {
            console.error(error);
            commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
          });
      }
    }
  }
});
</script>


<style lang="scss" scoped>
.community {
  &-table {
    margin: 0 0 56px;
  }
  &-checkbox {
    margin: 0 0 50px;
    ::v-deep & > span {
      font-size: 13px;
      line-height: 18px;
      color: $gray700;

      a {
        text-decoration: none;
        border-bottom: 1px solid $blue200;
        color: $blue200;
        transition: 0.3s;
        &:hover {
          border-bottom-color: transparent;
        }
      }
    }
  }
}
.publish-progress-bar {
  display: flex;
  align-items: center;
  &__progress {
    width: 230px;
    height: 6px;
    background: #ffffff;
    border: 0.5px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    margin-right: 14px;
    margin-top: 1.5px;
  }
  &__persent {
    width: 25px;
    display: flex;
    justify-content: flex-end;
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.03em;
    text-transform: capitalize;
    color: #000000;
  }
  &__completed {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    height: 100%;
    span {
      transition: 0.3s all ease-in-out;
      background: #000000;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
    }
  }
}
.switcher.publish-popup-switcher {
  margin-bottom: 32px;
  &-community {
    background-color: rgba(243, 243, 243, 0.3);
    .switcher-element {
      color: #949cad;
    }
  }
  /* .switcher-element__name {
    color: #949cad;
  } */
  .switcher-element__active {
    color: #000000;
  }
}
.publish-popup-status-state {
  margin: 0 0 23px;
  display: flex;
  align-self: flex-start;
}
.publish-popup-status-title {
  font-style: normal;

  font-weight: 400;
  font-size: 25px;
  margin-bottom: 17px;
  color: #000000;
  align-items: center;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  &-line {
    display: flex;
    flex-wrap: nowrap;
  }
  &-name {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 12ch;
    transition: 0.3s;
  }
  &.title-community {
    font-weight: 400;
    font-size: 25px;
    line-height: 38px;
    color: #ffffff;
    width: 380px;
  }
  svg {
    margin: 0 0 0 6px;
  }

  &__drop {
    padding: 14px;
    background: $black;
    border-radius: 8px;
    overflow: hidden;
    max-width: 192px;
    min-width: 192px;
    position: absolute;
    left: 50%;
    top: calc(100% + 5px);
    transform: translate(-50%, 0);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
    font-size: 12px;
    line-height: 16px;
    color: rgba($white, 0.9);
    z-index: 2;

    &-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      &:hover {
        .publish-popup-status-title__drop {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }
}
.publish-popup-status-img {
  margin: 0 0 35px;
  max-width: 100%;

  &--published {
    max-width: 113px;
  }

  &--community {
    width: 376px;
    height: 265px;
    margin: 0 0 23px;
  }

  &--not-published {
    max-width: 56px;
  }
}

.publish-status-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.publish-status-dotted {
  display: inline-flex;
  align-items: center;
  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #000000;
    opacity: 0.3;
    margin-right: 6px;
  }
  span {
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.03em;
    color: #000000;
    text-transform: capitalize;
  }
}
.publish-status-alert {
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
  color: #f26b60;
  max-width: 250px;
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.publish-popup-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 350px;
  height: 100%;
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
  &--community,
  &--not-set {
    min-height: auto;
  }

  &__child {
    margin: auto 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  &__domain {
    width: 100%;
    margin: 0;

    &-field {
      background: #f3f3f3;
      border-radius: 4px;
      padding: 8px;
      margin: 0 0 11px;
      &-community {
        background: rgba(243, 243, 243, 0.2);
      }
    }
  }
  .action-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    width: calc(100% - 40px);
    bottom: 20px;
    button {
      width: 100%;
    }
  }
  .action-btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    width: calc(100% - 40px);
    bottom: 20px;
  }

  .btn {
    text-decoration: none;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    width: calc(50% - 10px);
    height: 40px;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: normal;
    color: $black;
    background: #ffffff;
    border: 1px solid #ebebeb;
    cursor: pointer;
    transition: background 0.3s, color 0.3s, border 0.3s;
    &:hover {
      background: $black;
      color: $white;
      border-color: $black;
      svg {
        color: $white !important;
      }
    }
    svg {
      transition: color 0.3s;
    }
    &-inline {
      display: flex;
      align-items: center;
      line-height: normal;
    }
    &-name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      max-width: 12ch;
    }
    &.primary {
      background: $black;
      border-color: $black;
      color: $white;
      &:hover {
        background: rgba($black, 0.85);
      }
    }
    &.gray {
      background: #949cad;
      border-color: #949cad;
      color: $white;
      &:hover {
        border-color: $black;
        background: $black;
      }
    }
    &.transparent {
      background: transparent;
      border-color: #ebebeb;
      color: $white;
    }
    &.blue {
      background: transparent;
      border: 1px solid $blue200;
      color: $blue200;
      transition: 0.3s;

      &:hover {
        background: $blue200;
        color: $white;
      }
    }
    &.black {
      background: $gray100;
      border-color: $gray100;
      color: $black;
    }
    &.loading {
      background: #949cad;
      color: $white;
      svg {
        animation: spin 1s linear infinite;
      }
    }
    &.tweet {
      background: #03a9f4;
      border-color: #03a9f4;
      color: $white;
    }
    &.facebook {
      background: #0680dd;
      border-color: #0680dd;
      color: $white;
    }
    &.tweet,
    &.facebook {
      transition: 0.3s;
      &:hover {
        opacity: 0.8;
      }
    }
    &.iconed {
      &--right {
        svg {
          margin-right: 0;
          margin-left: 8px;
        }
      }
      .setting_icon {
        fill: $white;
      }
    }
    &.long {
      width: 100%;
    }
    &:disabled,
    &[disabled] {
      opacity: 0.4;
      background: $black !important;
      pointer-events: none;
    }
    svg {
      margin-right: 8px;
    }
  }

  &__switch {
    margin: 10px 0 0;
    &--community {
      display: none;
    }
    &--gutter {
      margin: 20px 0 0;
    }
    &--hidden {
      opacity: 0;
      visibility: hidden;
    }
  }
}

.community-section {
  margin: auto 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &--domain {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &--confirm {
    margin: 0;
  }
  &__descr {
    font-size: 13px;
    line-height: 17px;
    max-width: 331px;
    color: $gray700;

    a {
      color: $blue200;
      border-bottom: 1px solid $blue200;
      transition: 0.3s;
      text-decoration: none;

      &:hover {
        border-color: transparent;
      }
    }

    span {
      color: $black;
    }

    &--left {
      align-self: flex-start;
      margin: 0 0 40px;
    }
  }
  &__status {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 0 0 20px;
    &-date {
      font-size: 10px;
      line-height: 12px;
      span {
        color: $gray700;
      }
    }
  }
  &__domain-field {
    margin: 0 0 13px;
  }
  .publish-domain-field {
    input {
      width: 100%;
      &::placeholder {
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 14px;
        color: #000000;
        opacity: 0.2;
      }
    }
  }
}

.gray-domain-palceholder {
  padding: 15px 12px;
  border-radius: 4px;
  background: #f3f3f3;
  color: rgba(#000000, 0.4);
  font-size: 12px;
  line-height: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;

  &__question {
    cursor: pointer;
    position: relative;
    display: flex;

    &:hover {
      .gray-domain-palceholder {
        &__dropdown {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }

  &__dropdown {
    position: absolute;
    right: 0;
    bottom: -2px;
    background: #000000;
    border-radius: 8px;
    min-width: 166px;
    color: $white;
    padding: 8px;
    transform: translateY(100%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
  }
}
</style>

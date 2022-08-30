<template>
  <div class="publish-popup-wrap">
    <PublishSettings
      v-if="step == 1"
      :projectName="projectCommunity.name"
      :project="project"
      :categories="categories"
      :tags="tags"
      :category="category"
      :user="user"
      :pages="pages"
      :choosedPages="choosedPages"
      :previewImage="PreviewImage"
      :imageLoading="imageLoading"
      :isSubmitting="isSubmitting"
      @uploadImage="uploadImage"
      @selectedCategory="selectedCategory"
      @selectedTag="selectedTag"
      @changeName="changeName"
      @changedPublished="changedPublished"
    />
    <PaidContent
      v-if="step == 2"
      :selectedAction="projectCommunity.actionButton.type"
      :buttonName="projectCommunity.actionButton.title || ''"
      :isEnabledActionButton="projectCommunity.actionButton.enabled"
      :file="file"
      :previewImage="PreviewImage"
      :project="projectCommunity"
      :link="link"
      @changeButtonName="changeButtonName"
      @changeActionLink="changeActionLink"
      @changedIsEnabledActionButton="changedIsEnabledActionButton"
      @selectedFile="selectedFile"
      @selectAction="selectAction"
    />
    <PublishedModal v-if="step == 3" :projectName="projectCommunity.name" :airtapDomainUrl="airtapDomainUrl" />
    <div :class="{ popupFooter__actions__all: step == 2 }" class="popupFooter__actions">
      <button class="popupFooter__btn popupFooter__btn--transparent" v-if="step == 2" @click="changeStep(step - 1)">
        Back
      </button>
      <button v-if="step < 2" @click="changeStep(2)" :disabled="false" class="popupFooter__btn popupFooter__btn__black">
        <span>Next</span>
        <svg-icon name="next-icon" width="12" height="7" color="#ffffff" class="popupFooter__btn__icon" />
      </button>
      <button
        v-if="step == 2"
        @click="publish"
        :disabled="isDisabled"
        :class="{ loading: additionalPublishStatus == PublishStatus.InProgress }"
        class="popupFooter__btn popupFooter__btn__black"
      >
        <span v-if="additionalPublishStatus == PublishStatus.InProgress">
          {{ isAlreadyProjectPublished ? 'Saving' : 'Publishing' }}</span
        >
        <span v-else>{{ isAlreadyProjectPublished ? 'Save Changes' : 'Publish' }}</span>
        <svg-icon
          :name="additionalPublishStatus == PublishStatus.InProgress ? 'loader-icon' : 'publish-community-icon'"
          width="16"
          height="16"
          color="#fff"
          class="popupFooter__btn__icon"
        />
      </button>
    </div>
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
import { cloneDeep as _cloneDeep } from 'lodash';
import { VisibleMessageNameType } from '@/store/ui';
import apiClient from '@/utils/apiClient';
import PaidContent from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/PaidContent.vue';
import PublishSettings from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/PublishSettings.vue';
import PublishedModal from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/PublishedModal.vue';
import Message from '@/components/Shared/SiteSettings/Message.vue';

import PublishState from '@/components/Shared/PublishStatus.vue';
import http from '@/utils/http';
import { Converter } from '@/utils/converter';
import {
  CommunityProjectDto,
  CommunityActionButtonType,
  BaseProjectPageDto,
  ProjectSettingsDto,
  CommunityProjectActionButtonDto,
  AccountDto,
  ProjectTagDto,
  ProjectCategoryWithTagsDto,
  PlanCategory
} from '@/utils/api';
import { PopupSettings, PublishInCommunityPopupData } from '../../types';
enum PublishStatus {
  NotPublished = 'NotPublished',
  InProgress = 'InProgress',
  PublishedSuccessful = 'PublishedSuccessful',
  WebsiteIsPublished = 'WebsiteIsPublished',
  Failed = 'Failed'
}
enum DefaultTitleButton {
  Subscribe = 'Subscribe',
  Download = 'Download',
  Click = 'Click on me'
}
type ProjectTag = ProjectTagDto & { isActive: boolean };
type ProjectPage = BaseProjectPageDto & { numberPage: number | undefined };
interface FileProject {
  name: string | null;
  size: number | null;
  id: undefined | string;
  file: null | File | Blob;
  path: string | ArrayBuffer | null;
}
interface Preview {
  id: undefined | string;
  file: null | File | Blob;
  fullPath: string | ArrayBuffer | undefined;
  fullPathWebP: string | undefined;
  fullPathJp2: string | undefined;
  dominantColor: undefined | string;
}
export default Vue.extend({
  components: {
    PublishSettings,
    PaidContent,
    PublishedModal,
    'publish-status': PublishState,
    Message
  },
  data() {
    return {
      PublishStatus,
      VisibleMessageNameType,
      pages: [] as ProjectPage[],
      step: 1,
      tags: [] as ProjectTag[] | undefined,
      categories: [] as ProjectCategoryWithTagsDto[],
      category: {} as ProjectCategoryWithTagsDto | null,
      tagsCount: 0,
      file: {
        name: null,
        size: null,
        id: undefined,
        file: null,
        path: null
      } as FileProject,
      projectCommunity: {} as CommunityProjectDto,
      PreviewImage: {
        id: undefined,
        file: null,
        fullPath: undefined,
        fullPathWebP: undefined,
        fullPathJp2: undefined,
        dominantColor: undefined
      } as Preview,
      imageLoading: false,
      additionalPublishStatus: PublishStatus.NotPublished,
      isSubmitting: false,
      link: '',
      isErrorLink: false
    };
  },
  created() {
    var projectCommunity = _cloneDeep(this.project);
    if (!projectCommunity.publishedDate) {
      projectCommunity.actionButton = {} as CommunityProjectActionButtonDto;
      projectCommunity.actionButton.enabled = true;
      projectCommunity.actionButton.title = DefaultTitleButton.Subscribe;
      projectCommunity.actionButton.type = CommunityActionButtonType.Form;
    } else this.additionalPublishStatus = PublishStatus.WebsiteIsPublished;

    this.projectCommunity = projectCommunity;
    this.file.path = this.projectCommunity.actionButton.file?.path || '';
    this.file.name = this.projectCommunity.actionButton.file?.originalFileName || '';
    this.file.size = (this.projectCommunity.actionButton.file?.size || 0) * 1024 * 1024;
    this.file.id = this.projectCommunity.actionButton.file?.id || undefined;
    this.file.file = null;
    this.link = this.projectCommunity.actionButton.link || '';
    this.category = null;
    this.tags = undefined;
    if (this.project.preview) {
      const { preview } = this.project;
      this.PreviewImage.id = preview.id;
      this.PreviewImage.fullPath = preview.fullPath;
      this.PreviewImage.dominantColor = preview.dominantColor;
      this.PreviewImage.fullPathWebP = preview.fullPathWebP;
      this.PreviewImage.fullPathJp2 = preview.fullPathJp2;
    }
  },
  computed: {
    ...mapState({
      popupSettings: (state: any) => <PopupSettings<PublishInCommunityPopupData>>state.editor.popupSettings,
      user: (state: any) => <AccountDto>state.auth.user,
      visibleMessageName: (state: any) => <VisibleMessageNameType>state.ui.visibleMessageName
    }),
    project(): CommunityProjectDto {
      return this.popupSettings.data.project;
    },
    projectId(): Number {
      return this.popupSettings.data.projectId;
    },
    projectSettings(): ProjectSettingsDto {
      return this.popupSettings.data.projectSettings;
    },
    choosedPages(): number {
      return this.pages.filter(item => !!item.numberPage).length;
    },
    isAlreadyProjectPublished(): boolean {
      return !!this.popupSettings.data.project.publishedDate;
    },
    isErrorSettings(): boolean {
      return this.tagsCount < 3 || this.projectCommunity.name == '';
    },
    domain(): string {
      return process.env.VUE_APP_AIRTAP_DOMAIN;
    },
    airtapDomainUrl(): string {
      return `${this.domain}/w/${this.projectSettings.airtapDomain}`;
    },
    isErrorSubscribe(): boolean {
      if (!this.projectCommunity.actionButton.enabled) return false;
      if (!this.projectCommunity.actionButton.title) return true;
      if (!(this.user.plan.category == PlanCategory.Pro || this.user.isAdmin)) return true;
      if (
        (this.projectCommunity.actionButton.type == CommunityActionButtonType.File && !this.file.name) ||
        (this.projectCommunity.actionButton.type == CommunityActionButtonType.Link && (!this.link || this.isErrorLink))
      )
        return true;
      return false;
    },
    isDisabled(): boolean {
      return (this.step == 1 && this.isErrorSettings) || (this.step == 2 && this.isErrorSubscribe);
    }
  },
  watch: {
    tags: function (val) {
      if (!this.tags) return false;
      this.tagsCount = this.tags.filter(item => item.isActive).length;
    }
  },
  async mounted() {
    try {
      const { data: categories } = await apiClient.projectCategories.projectCategoriesGetWithTags();
      this.categories = categories;
      if (this.projectCommunity.categoryId) {
        const category = this.categories.find(category => category.id === this.projectCommunity.categoryId);
        if (category) this.selectedCategory(category, true);
      }

      let pages = _cloneDeep(this.popupSettings.data.pages);
      pages.sort(item => (item.isHomePage ? -1 : 1));
      let numberPage = 0;

      this.pages = pages.map(tc => {
        (<ProjectPage>tc).numberPage =
          this.projectCommunity.pages?.some(id => id == tc.id) || tc.isHomePage ? ++numberPage : undefined;
        return <ProjectPage>tc;
      });
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    selectedFile(file: File | null) {
      this.file.file = file;
      this.file.id = '';
      this.file.name = file?.name || '';
      this.file.size = file?.size || null;
    },
    changedIsEnabledActionButton() {
      const { actionButton } = this.projectCommunity;
      actionButton.enabled = !actionButton.enabled;
      if (actionButton.enabled && !this.project.actionButton.enabled) {
        actionButton.title = DefaultTitleButton.Subscribe;
        actionButton.type = CommunityActionButtonType.Form;
      }
    },

    selectAction(action: CommunityActionButtonType) {
      const { actionButton } = this.projectCommunity;
      actionButton.type = action;
      if (
        action == CommunityActionButtonType.File &&
        !this.project.actionButton.title &&
        (actionButton.title == DefaultTitleButton.Subscribe || actionButton.title == DefaultTitleButton.Click)
      )
        actionButton.title = DefaultTitleButton.Download;
      if (
        action == CommunityActionButtonType.Form &&
        !this.project.actionButton.title &&
        (actionButton.title == DefaultTitleButton.Download || actionButton.title == DefaultTitleButton.Click)
      )
        actionButton.title = DefaultTitleButton.Subscribe;
      if (
        action == CommunityActionButtonType.Link &&
        !this.project.actionButton.title &&
        (actionButton.title == DefaultTitleButton.Download || actionButton.title == DefaultTitleButton.Subscribe)
      )
        actionButton.title = DefaultTitleButton.Click;
    },
    changeButtonName(name: any) {
      this.projectCommunity.actionButton.title = name;
    },
    changeActionLink(link: string, isErrorLink: boolean) {
      this.link = link;
      this.isErrorLink = isErrorLink;
    },
    changeName(name: string) {
      this.projectCommunity.name = name;
    },
    selectedCategory(category: ProjectCategoryWithTagsDto, created: boolean) {
      this.isSubmitting = false;
      this.category = category;
      this.tags = category.tags?.map(tc => {
        const isActive = !!(created && this.projectCommunity.tags?.some(tag => tag === tc.id));
        (<ProjectTag>tc).isActive = isActive;
        return <ProjectTag>tc;
      });
    },
    selectedTag(tag: ProjectTag, index: number) {
      if (this.tagsCount == 7 && !tag.isActive) return;
      if (this.tags) Vue.set(this.tags, index, { ...tag, isActive: !tag.isActive });
    },
    changeHomePage(pageId: number) {
      this.pages.forEach((item, index) => {
        item.isHomePage = item.id === pageId;
      });
    },
    changedPublished(index: number) {
      const page = this.pages[index];
      const changedPage = page.numberPage || 0;
      page.numberPage = changedPage == 0 ? this.choosedPages + 1 : undefined;
      if (!page.numberPage) {
        this.pages.forEach(item => {
          if (item.numberPage && item.numberPage > changedPage) item.numberPage--;
        });
      }
    },
    changeStep(step: number) {
      if (this.isDisabled && this.step === 1) {
        this.isSubmitting = true;
        return;
      }
      this.step = step;
    },
    uploadImage(file: File) {
      this.imageLoading = true;
      const preview = this.PreviewImage;
      if (preview) {
        var reader = new FileReader();
        reader.onload = function () {
          preview.fullPath = reader.result || undefined;
          preview.id = '';
          preview.file = file;
          preview.fullPathWebP = undefined;
          preview.fullPathJp2 = undefined;
        };
        reader.readAsDataURL(file);
      }
      this.imageLoading = false;
    },
    publish() {
      this.additionalPublishStatus = PublishStatus.InProgress;
      const dto = {
        Name: this.projectCommunity.name
      } as any;
      if (this.category) dto.CategoryId = this.category.id;

      dto.Pages = this.pages?.reduce(function (pages: number[], item) {
        if (item.numberPage) pages.push(item.id);
        return pages;
      }, [] as number[]);

      dto.Tags = this.tags?.reduce(function (tags: number[], item: ProjectTag) {
        if (item.isActive) tags.push(item.id);
        return tags;
      }, [] as number[]);
      if (this.projectCommunity.actionButton.enabled) {
        dto.ActionButton = {
          Type: this.projectCommunity.actionButton.type,
          Title: this.projectCommunity.actionButton.title
        } as any;

        if (this.projectCommunity.actionButton.type == CommunityActionButtonType.File) {
          if (this.file.id) dto.ActionButton.FileId = this.file.id;
          if (this.file.file) dto.ActionButton.File = this.file.file;
        }
        if (this.projectCommunity.actionButton.type == CommunityActionButtonType.Link && this.link) {
          dto.ActionButton.Link = this.link;
        }
      }
      if (this.PreviewImage.file) dto.Preview = this.PreviewImage.file;
      else if (this.PreviewImage.id) dto.PreviewId = this.PreviewImage.id;

      const formData = Converter.jsonToFormData(dto);
      http
        .put(`/api/projects/${this.projectId}/community/published`, formData)
        .then(({ data }) => {
          this.$store.commit('editor/CHANGE_POPUP_BACKGROUND', '');
          this.$store.commit('editor/CHANGE_POPUP_HEADER', '');
          this.$store.commit('editor/CHANGE_POPUP_DESCRIPTION', '');
          this.$store.commit('project/changePublishedProject', {
            id: this.projectId,
            name: this.projectCommunity.name,
            previewImage: data.preview
          });
          this.step = 3;
          this.additionalPublishStatus = PublishStatus.PublishedSuccessful;
        })
        .catch(error => {
          this.additionalPublishStatus = PublishStatus.Failed;
          this.$store.commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
        });
    }
  }
});
</script>

<style lang="scss" >
.publish-popup-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: fit-content;
  height: 100%;
}
.popupFooter {
  height: 40px;
  width: 100%;
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  &__settingsBtn {
    background: #ffffff;
    height: 35px;
    border: 1px solid #ebebeb;
    margin-right: 10px;
    padding: 8px 16px;
    position: relative;
    svg {
      margin-right: 8px;
      max-width: 16px;
    }
    &:hover {
      background: #000000;
      color: #ffffff;
      .popupFooter__settingsBtn__icon-plan {
        opacity: 0;
      }
      .popupFooter__settingsBtn__icon-hover {
        opacity: 1;
      }
    }
    span {
      margin-left: 20px;
    }
    &__icon-plan {
      opacity: 1;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 16px;
      margin: auto;
    }
    &__icon-hover {
      opacity: 0;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 16px;
      margin: auto;
    }
  }
  &__pages {
    display: flex;
    flex-direction: row;
    align-items: center;
    &__all {
      font-size: 12px;
      color: black;

      span {
        font-size: 10px;
        color: #bdbdbd;
      }
    }
  }
  &__step {
    font-size: 10px;
    span {
      color: #dadada;
    }
  }
  &__message {
    font-size: 10px;
    color: #333333;
    &__error {
      color: #f46363;
    }
  }
  &__actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    &__all {
      width: 100%;
    }
  }
  &__btn {
    margin-left: 20px;
    font-family: 'Poppins', sans-serif;
    border: 1px solid $gray100;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 37px;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 15px;
    padding: 8px 30px;
    color: $black;
    background: $gray100;
    cursor: pointer;
    transition: background 0.3s, color 0.3s, border 0.3s;
    &:hover {
      background: #ececec;
    }
    &__black {
      background: $black;
      border-color: $black;
      color: $white;
      &:hover {
        background: rgba($black, 0.85);
      }
    }
    &.loading {
      background: #949cad;
      border-color: #949cad;
      color: $white;
      pointer-events: none;
      svg {
        animation: spin 1s linear infinite;
      }
    }
    &:disabled,
    &[disabled] {
      opacity: 0.4;
      background: $black !important;
      pointer-events: none;
    }
    &__icon {
      margin-left: 4px;
    }
    &--transparent {
      background: transparent;
      padding: 8px 16px;
      border-color: transparent;
    }
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

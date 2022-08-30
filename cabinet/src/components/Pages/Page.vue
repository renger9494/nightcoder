<template>
  <div class="page" :class="!isVisible ? 'page_visible' : ''">
    <div class="page__preview">
      <PreviewImage
        image-class-name="page__poster"
        :class="{ 'page__poster-wrapper--empty': isPageNew }"
        :href="editorUrl"
        :preview-image="page.previewImage"
      />
      <div class="page__btn">
        <a
          v-if="page.isPublished"
          :href="`https://${pageUrl}`"
          target="_blank"
          class="page__btn-view"
        >
          <div class="page__btn-view__icons">
            <svg-icon
              class="page__btn-view__plain"
              width="100%"
              height="100%"
              color="#000000"
              name="open-link"
            />
            <svg-icon
              class="page__btn-view__hover"
              width="100%"
              height="100%"
              color="#ffffff"
              name="open-link"
            />
          </div>
        </a>
        <a @click="openPage" class="page__btn-edit">
          <div class="page__btn-edit__icons">
            <svg-icon
              class="page__btn-edit__plain"
              width="100%"
              height="100%"
              color="#000000"
              name="pencil"
            />
            <svg-icon
              class="page__btn-edit__hover"
              width="100%"
              height="100%"
              color="#ffffff"
              name="pencil"
            />
          </div>
        </a>
      </div>
      <page-quick-actions
        :isDropdownVisible="isQuickActionsDropdownVisible"
        :toggleDropdown="toggleQuickActionsDropdown"
        :page="page"
        :is-last-page="isLastPage"
        :is-published="page.isPublished"
        :copy-link="copyLink"
        :openSiteSettings="openSiteSettings"
        :editPageName="enableNameEditing"
        :page-link="`https://${pageUrl}`"
        :unpublishPage="publishPage"
        :duplicate="duplicatePage"
        v-click-outside="() => (isQuickActionsDropdownVisible = false)"
      />
    </div>
    <div class="page__info">
      <div class="page__info-top-line">
        <div class="page__info-top-line-title">
          <component
            v-if="!isNameEditing"
            :is="page.isPublished ? 'a' : 'span'"
            :href="page.isPublished ? `https://${pageUrl}` : null"
            class="page__name"
            :class="{ not_published: !page.isPublished }"
            v-tooltip="page.name"
          >
            <svg-icon
              v-if="page.isHomePage"
              class="page__home-icon"
              width="16"
              height="16"
              color="#000000"
              name="home"
            />
            <span> {{ page.name }}</span>
          </component>
          <input
            class="page__name-input"
            v-if="isNameEditing"
            :value="nameInputValue"
            @keyup="handleNameInputChange"
            :ref="'projectNameInput'"
          />
          <a
            class="page__save-name"
            v-if="isNameEditing"
            href="#"
            @click="saveName"
          >
            Save
          </a>
        </div>
        <div v-if="!isNameEditing" class="page__info-top-line-lastupdate">
          {{ page.lastUpdateUtcDateTime | lastUpdateDate }}
        </div>
      </div>
      <div class="page__link-wrapper" v-if="page.isPublished">
        <a
          class="page__link"
          :href="`https://${pageUrl}`"
          target="_blank"
          @mouseover="changeColorIcon"
          @mouseout="originalColorIcon"
        >
          <svg-icon width="22" height="22" color="#173BEF" name="open-link" />
          <span> {{ pageUrl }}</span>
        </a>
        <a
          class="page__link-tip"
          data-title="Publish the project so that other users can see it!"
        >
          <svg-icon
            class="page__link-question"
            width="14"
            height="14"
            :color="colorQuestionIcon"
            name="question" />
          <svg-icon
            class="page__link-question-hover"
            width="14"
            height="14"
            color="white"
            name="question-hover"
        /></a>
      </div>
      <span class="page__status" v-else>
        <svg-icon width="22" height="22" color="#BDBDBD" name="open-link" />
        <span>Not Published</span>
        <a
          class="page__link-tip"
          data-title="Publish the project so that other users can see it!"
        >
          <svg-icon
            class="page__link-question"
            width="14"
            height="14"
            :color="colorQuestionIcon"
            name="question" />
          <svg-icon
            class="page__link-question-hover"
            width="14"
            height="14"
            color="white"
            name="question-hover"
        /></a>
      </span>
    </div>
    <transition name="popup-layer" mode="out-in">
      <div :ref="'popupButton-' + page.id"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { createEditorPageUrl } from '@/utils/http'
import HTMLElementEvent from '@/utils/types/HTMLElementEvent'

import PencilIcon from '@/assets/icons/pencil_rename.svg?inline'
import Home from '@/assets/icons/home.svg?inline'
import NotPublished from '@/assets/icons/not-published.svg?inline'
import {
  PopupSettings,
  PopupType,
  PublishPopupData,
} from '@/components/Modal/types'
import PageQuickActions from '@/components/Pages/PageQuickActions.vue'
import PreviewImage from '@/components/Shared/PreviewImage.vue'
import copyToClipboard from '@/utils/copy_to_clibpoard'

import {
  AccountDto,
  BaseProjectPageDto,
  ChangePageNameDto,
  PagedProjectDto,
} from '@/utils/api'
import { VisibleModalType } from '@/store/ui'
import apiClient from '@/utils/apiClient'

export default Vue.extend({
  components: {
    PageQuickActions,
    PencilIcon,
    PreviewImage,
    Home,
    NotPublished,
  },
  props: {
    page: {
      type: Object as PropType<BaseProjectPageDto>,
    },
    projectHref: {
      type: String,
    },
    isLastPage: {
      type: Boolean,
      required: true,
    },
    pagesCount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isVisible: false,
      isQuickActionsDropdownVisible: false,
      isNameEditing: false,
      nameInputValue: this.page.name,
      colorQuestionIcon: '#BDBDBD',
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      projects: (state: any) => <PagedProjectDto[]>state.project.projects,
    }),
    editorUrl(): string {
      return createEditorPageUrl(this.page.projectId, this.page.id)
    },
    pageUrl(): string {
      if (this.page.isHomePage) return this.projectHref
      const pageUrl = this.page.url ? `/${this.page.url}` : ''
      return `${this.projectHref}${pageUrl}`
    },
    isPageNew(): boolean {
      return !this.page.previewImage
    },
    pagesLimit(): number {
      return this.user.plan.features.projectPages
    },
  },
  mounted() {
    if (!process.client) return
    document.addEventListener(
      'click',
      this.hideQuickActionsDropdownOnDocumentClick
    )
    document.addEventListener(
      'keyup',
      this.hideQuickActionsDropdownOnDocumentClick
    )
    document.addEventListener('keyup', this.disableNameEditing)
    document.addEventListener('keyup', this.saveNameOnEnter)
    document.addEventListener('click', this.disableNameEditingOnClick)

    /*  setTimeout(() => {
      this.isVisible = false
    }, 10) */

    this.$store.subscribeAction((action) => {
      if (action.type === 'project/duplicatePage') {
        this.$store.commit(
          'ui/changeVisibleModalName',
          VisibleModalType.PageDuplicated
        )
     /*    setTimeout(() => {
          location.reload()
        }, 2000) */
      }
     /*  if (action.type === 'project/restorePage') {
        location.reload()
      }
      if (action.type === 'project/deleteProject') {
        this.$router.push({ name: 'projects' })
      } */
    })
  },
  beforeDestroy() {
    document.removeEventListener(
      'click',
      this.hideQuickActionsDropdownOnDocumentClick
    )
    document.removeEventListener(
      'keyup',
      this.hideQuickActionsDropdownOnDocumentClick
    )
    document.removeEventListener('keyup', this.disableNameEditing)
    document.removeEventListener('keyup', this.saveNameOnEnter)
    document.removeEventListener('click', this.disableNameEditingOnClick)
  },
  methods: {
    changeColorIcon() {
      this.colorQuestionIcon = '#000000'
    },
    originalColorIcon() {
      this.colorQuestionIcon = '#BDBDBD'
    },
    toggleQuickActionsDropdown() {
      this.isQuickActionsDropdownVisible = !this.isQuickActionsDropdownVisible
    },
    openSiteSettings(event: Event) {
      if (event) event.preventDefault()

      const { dispatch } = this.$store
      const { projectId, id } = this.page

      dispatch('siteSettings/loadModalData', { projectId, pageId: id }).then(
        () => {
          dispatch('ui/changeVisibleModalName', {
            newVisibleModalName: VisibleModalType.SiteSettings,
          })
          dispatch('project/loadProjectPages', projectId)
        }
      )
    },
    hideQuickActionsDropdownOnDocumentClick(event: any) {
      if (event) {
        if (
          event.key === 'Escape' ||
          event.target.classList.contains('quick-actions__dropdown-item') ||
          event.target.closest('.quick-actions__dropdown-item') ||
          !event.target.closest('.quick-actions')
        ) {
          this.isQuickActionsDropdownVisible = false
        }
      }
    },
    enableNameEditing(event: Event) {
      if (event) event.preventDefault()

      setTimeout(() => {
        this.isNameEditing = true

        setTimeout(() => {
          const projectNameInput = <HTMLInputElement>this.$refs.projectNameInput
          projectNameInput.focus()
          projectNameInput.setSelectionRange(0, projectNameInput.value.length)
        }, 50)
      }, 0)
    },
    disableNameEditing(event: KeyboardEvent) {
      if (event && event.key === 'Escape') {
        this.isNameEditing = false
        this.nameInputValue = this.page.name
      }
    },
    disableNameEditingOnClick(event: any) {
      if (!event.target.closest('.page')) {
        this.isNameEditing = false
        this.nameInputValue = this.page.name
      }
    },
    saveName(event: Event) {
      if (event) event.preventDefault()

      const { projectId, id } = this.page
      const dto: ChangePageNameDto = {
        name: this.nameInputValue,
      }
      apiClient.projectPages
        .projectPagesChangeName(projectId, id, dto)
        .then(() => {
          this.isNameEditing = false
          this.$store.commit('project/changePageName', {
            pageId: id,
            name: this.nameInputValue,
          })
        })
        .catch((error) => {
          console.error(error)
        })
    },
    saveNameOnEnter(event: KeyboardEvent) {
      if (event && event.key === 'Enter') {
        this.saveName(event)
      }
    },
    handleNameInputChange(event: HTMLElementEvent<HTMLInputElement>) {
      this.nameInputValue = event.target.value
    },
    copyLink() {
      copyToClipboard(`https://${this.pageUrl}`)
      this.$store.commit(
        'ui/changeVisibleModalName',
        VisibleModalType.LinkCopied
      )
    },
    publishPage() {
      /*   this.$store.commit('project/changePageToPublish', this.page)
      this.$store.commit(
        'ui/changeVisibleModalName',
        VisibleModalType.PublishPage
      )
 */
      const projectId = this.page.projectId
      if (!projectId) {
        console.error("[PublishBtn]: user doesn't edit project page")
        return
      }
      const project = this.projects.find((p) => p.id == +projectId)
      const page = this.page
      const pageId = page?.id
      if (!project || !page) {
        console.error('[PublishBtn]: not found project or page in store')
        return
      }

      const domRect = (<HTMLDivElement>(
        this.$refs['popupButton-' + pageId]
      )).getBoundingClientRect()
      let pages = [] as BaseProjectPageDto[]
      apiClient.projectPages.projectPagesGet(+projectId).then(({ data }) => {
        pages = data

        const popupSettings: PopupSettings<PublishPopupData> = {
          active: true,
          closeButton: true,
          header: 'Publish',
          description: 'Anyone with the link can view',
          content: PopupType.Publish,
          location: domRect,
          data: {
            project,
            isPage: true,
            page,
            pages,
          },
        }
        this.$store.commit('ui/SET_POPUP_SETTINGS', popupSettings)
      })
    },
    duplicatePage() {
      if (!this.user.isAdmin && this.pagesCount >= this.pagesLimit) {
        this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
        return
      }
      this.$store.dispatch('project/duplicatePage', this.page)
    },
    openPage(e: Event) {
      e.preventDefault()
      const { dispatch } = this.$store
      if (window.innerWidth < 1200) {
        dispatch('ui/changeVisibleModalName', {
          newVisibleModalName: VisibleModalType.MobileAlert,
        })
        return
      }
      window.location.href = this.editorUrl
    },
    leave(el: any, done: any) {
      this.$gsap.tweenMax.to(el, 0.25, {
        x: '-100%',
        clearProps: 'all',
        ease: this.$gsap.expo.easeIn,
        onComplete: () => {
          done()
        },
      })
    },
    enter(el: any, done: any) {
      this.$gsap.tweenMax.fromTo(
        el,
        0.5,
        {
          x: '-100%',
        },
        {
          x: '0%',
          clearProps: 'all',
          ease: this.$gsap.expo.easeOut,
          onComplete: () => {
            done()
          },
        }
      )
    },
  },
})
</script>

<style lang="scss">
.page {
  flex: 0 0 calc(20% - 30px);
  width: calc(20% - 30px);
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  margin: 0 15px 40px;
  transform: translateY(5%);
  opacity: 0.5;
  transition: box-shadow 0.3s, transform 0.3s ease, opacity 0.3s ease;
  &__home-hover-icon {
    display: none;
  }
  &__preview {
    display: block;
    position: relative;
    //max-width: 326px;
    width: 100%;
    height: 100%; //240px;
    &:hover {
      .page__btn {
        opacity: 1;
      }
    }
    &:hover
      ~ .page__info
      > .page__info-top-line
      > .page__info-top-line-title
      > .page__name {
      span {
        color: #173bef;
        border-bottom: 1px solid #173bef;
      }
    }
  }
  .quick-actions__button {
    transform: none;
    opacity: 1 !important;
  }

  &_no-shadow {
    box-shadow: none !important;
  }

  &_visible {
    transform: none;
    opacity: 1;
  }

  &__link-copied {
    position: fixed;
    bottom: 0;
    left: 50%;
    display: table !important;
    z-index: 500 !important;
    transform: translate(-50%, calc(-63% + -10px)) !important;
    &.message_visible {
      transform: translate(-50%, -50%) !important;
    }
  }

  &__poster {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__poster-wrapper {
    // width: 326px;
    width: 100%;
    height: 100%; //240px;
    //min-height: 200px;
    padding: 15px;
    overflow: hidden;
    border: 1px solid #d8d8d8;
    border-radius: 12px;
    position: relative;
    display: block;
    &:after {
      content: '';
      position: absolute;
      left: 15px;
      top: 15px;
      border-radius: 12px;
      background: $white;
      width: calc(100% - 30px); //296px;
      height: calc(100% - 30px); //210px;
      z-index: 1;
    }
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 15px;
      top: 15px;
      height: calc(100% - 30px);
      width: calc(100% - 30px);
      min-height: 150px;
      background: linear-gradient(
        to right,
        transparent 20%,
        rgba(232, 232, 232, 0.2) 80%,
        transparent 100%
      );
      animation: load 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    img {
      position: relative;
      z-index: 2;
      border-radius: 12px;
      box-shadow: 0 65.3633px 152.514px rgba(0, 0, 0, 0.4);
      object-fit: cover;
      min-height: 208px;
    }
    &--empty {
      padding: 15px;
      background: #6168ff;
      border-radius: 12px;
      display: block;
      width: 100%; //296px;
      height: 100%; //210px;
      object-fit: cover;
      &:before {
        content: '';
        display: block;
        position: absolute;
        left: 15px;
        top: 15px;
        height: 100%;
        min-height: 150px;
        background: linear-gradient(
          to right,
          transparent 20%,
          rgba(232, 232, 232, 0.2) 80%,
          transparent 100%
        );
        animation: load 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      img {
        position: relative;
        z-index: 1;
        box-shadow: 0 41.2821px 96.3249px rgba(0, 0, 0, 0.4);
        border-radius: 6px;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 0 0;
  }

  &__info-top-line {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    margin-bottom: 4px;
    height: 24px;
    &-lastupdate {
      font-size: 12px;
      line-height: 14px;
      color: #949cad;
      width: 130px;
      text-align: right;
    }

    &-title {
      display: flex;
      align-items: center;
      position: relative;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: calc(100% - 130px);
      &:hover {
        .page__edit-name {
          opacity: 1;
          visibility: visible;
        }
      }
    }

    &_editable {
      width: 80%;
      margin-bottom: 23px;
    }
  }

  &__name {
    position: relative;
    max-width: 190px;
    font-size: 16px;
    line-height: 24px;
    font-weight: normal;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000000;
    margin-top: 0;
    margin-right: 8px;
    margin-bottom: 0;
    overflow: hidden;
    transition: 0.3s;
    text-decoration: none;
    display: inline-block;
    span {
      transition: 0.3s;
      border-bottom: 1px solid transparent;
    }

    &:hover {
      span {
        color: #173bef;
        border-bottom-color: #173bef;
      }
    }
    svg {
      margin: 0 5px 0 0;
      width: 16px;
      height: 16px;
      flex: 0 0 16px;
      transform: translate(4px, 3px);
    }

    &.not_published {
      &:hover {
        span {
          color: #000000;
          border-bottom-color: transparent;
        }
      }
    }
  }

  &__name-input {
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    border-bottom: 1px solid #dadada;
    padding-bottom: 1px;
    margin-right: 8px;
  }

  &__edit-name {
    line-height: 0;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      .project__edit-name-icon {
        fill: #000000;
      }
    }
  }

  &__edit-name-icon {
    width: 12px;
    fill: #333333;
    transition: 0.3s fill;
  }

  &__save-name {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    text-decoration: none;
    color: #ffffff;
    background-color: #000000;
    border-radius: $shape_border_radius;
    padding: 3px 8px;
    transition: 0.3s background-color;

    &:hover {
      background-color: #333333;
      color: #ffffff;
    }
  }

  &__link-wrapper {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;

    padding-bottom: 5px;
    margin-bottom: -5px;
  }

  &__link {
    max-width: 90%;

    white-space: nowrap;

    position: relative;
    font-size: 13px;
    line-height: 20px;
    font-weight: 400;
    text-decoration: none;
    color: #173bef;
    transition: 0.3s;
    display: flex;
    align-items: center;
    span {
      border-bottom: 1px solid transparent;
      margin: 0 0 0 2px;
      text-overflow: ellipsis;
      overflow: hidden;
      width: calc(100% - 10px);
    }

    svg {
      margin: 0 2px 0 -4px;
    }

    &:hover {
      span {
        border-bottom: 1px solid #173bef;
      }
    }
  }

  &__status {
    font-size: 13px;
    line-height: 20px;
    color: #949cad;
    display: flex;
    align-items: center;
    span {
      margin: 0 4px 0 2px;
    }
    svg {
      margin-left: -4px;
    }
  }
  &__btn {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    gap: 16px;
    opacity: 0;
    z-index: 3;
    a {
      width: 60px;
      height: 60px;
      background: #ffffff;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 80px;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    &__icons {
      object-fit: cover;
      object-position: center;
      width: 32px;
      height: 32px;
      position: relative;
    }
    @include bp($sm) {
      display: none;
    }
  }
  &__btn-view {
    &__hover {
      display: none;
    }
    &__icons {
      object-fit: cover;
      object-position: center;
      width: 32px;
      height: 32px;
      position: relative;
    }
    &:hover {
      background-color: $black;
      .page__btn-view__hover {
        display: block;
      }
      .page__btn-view__plain {
        display: none;
      }
    }
  }
  &__btn-edit {
    &__hover {
      display: none;
    }
    &__icons {
      object-fit: cover;
      object-position: center;
      width: 32px;
      height: 32px;
      position: relative;
    }
    &:hover {
      background-color: $black;
      .page__btn-edit__hover {
        display: block;
      }
      .page__btn-edit__plain {
        display: none;
      }
    }
  }
  &__link-question-hover {
    display: none;
  }
  &__link-question {
    display: block;
  }
  &__link-tip {
    position: relative;
    margin-left: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &:hover {
      .page__link-question-hover {
        display: block;
      }
      .page__link-question {
        display: none;
      }
    }
    &:hover::after {
      content: attr(data-title);
      padding: 8px;
      background: #000000;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      font-size: 10px;
      color: #ffffff;
      position: absolute;
      margin: auto;
      left: 15px;
      transform: translate(0.5em, -10%);
      z-index: 1;
      width: 172px;
      height: 24px;
      line-height: 12px;
      display: flex;
    }
  }

  @include bp(1728px) {
    flex: 0 0 calc(25% - 30px);
    width: calc(25% - 30px);
  }
  @include bp(1440px) {
    flex: 0 0 calc(33.333% - 30px);
    width: calc(33.333% - 30px);
  }
  @include bp(960px) {
    flex: 0 0 calc(50% - 30px);
    width: calc(50% - 30px);
    margin: 0 15px 30px;
  }
  @include bp(480px) {
    flex: 0 0 100%;
    width: 100%;
    margin: 0 0 30px;
  }
}
</style>

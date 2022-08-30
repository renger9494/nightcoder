<template>
  <div class="project-item">
    <transition :css="false" @enter="enter" @leave="leave">
      <div
        class="project"
        :class="{
          'project_no-shadow': isQuickActionsDropdownVisible,
          project_visible: !isVisible,
        }"
      >
        <div class="project__preview" :class="{ loading: imageLoading }">
          <template v-if="!imageLoading">
            <PreviewImage
              image-class-name="project__preview__poster"
              :href="`/dashboard/projects/${projectUser.id}/pages`"
              :height="140"
              :preview-image="projectUser.previewImage"
            />
            <input
              ref="preview-image-input"
              type="file"
              :accept="'image/jpeg,image/png'"
              multiple
              @change="uploadPreview($event, projectUser)"
            />
            <div class="project__preview__button">
              <button
                class="project__preview__changePreview"
                @click.prevent="previewimageInput.click()"
              >
                <svg-icon
                  class="project__preview__changePreview__plain"
                  width="13"
                  height="13"
                  color="#000000"
                  name="loadingImage"
                />
                <svg-icon
                  class="project__preview__changePreview__hover"
                  width="13"
                  height="13"
                  color="#ffffff"
                  name="loadingImage"
                />
              </button>
            </div>
          </template>
          <loader v-else :size="54" />
        </div>
        <div class="project__info">
          <div class="project__heading">
            <div
              class="project__info-top-line"
              :class="{ 'project__info-top-line_editable': isNameEditing }"
            >
              <a
                class="project__name"
                :href="`/dashboard/projects/${projectUser.id}/pages`"
                v-if="!isNameEditing"
              >
                {{ projectUser.name }}
              </a>
              <input
                class="project__name-input"
                v-if="isNameEditing"
                :maxlength="300"
                :value="nameInputValue"
                @keyup="handleNameInputChange"
                :ref="'projectNameInput'"
              />
              <a
                class="project__save-name"
                v-if="isNameEditing"
                href="#"
                @click="saveName"
              >
                Save
              </a>
            </div>
          </div>
          <div class="project__views">
            {{ projectUser.lastUpdateUtcDateTime | lastUpdateDate }}
          </div>
          <div
            class="project__likeAndView"
            :class="{ disabled: !isProjectPublished }"
          >
            <span>
              <button @click="likeProject()">
                <svg-icon
                  width="14"
                  height="14"
                  :color="projectUser.hasLike ? '#F46363' : '#dbdbdb'"
                  :name="projectUser.hasLike ? 'likeProject' : 'like'"
                />
              </button>
              {{ projectUser.likes }}</span
            >
            <span>
              <svg-icon
                class="project__likeAndView__iconView"
                width="14"
                height="13"
                color="#dbdbdb"
                name="view"
              />
              {{ projectUser.views }}</span
            >
          </div>
        </div>
        <div class="project__footer">
          <div class="project__link-wrapper" v-if="isProjectPublished">
            <a
              class="project__link"
              :href="`https://${mergedUrl}`"
              target="_blank"
              @mouseover="changeColorIcon"
              @mouseout="originalColorIcon"
            >
              <svg-icon
                width="22"
                height="22"
                color="#173BEF"
                name="open-link"
              /><span> {{ mergedUrl }}</span>
            </a>
            <a
              class="project__link-tip"
              data-title="Publish the project so that other users can see it!"
            >
              <svg-icon
                class="project__link-question"
                width="14"
                height="14"
                :color="colorQuestionIcon"
                name="question" />
              <svg-icon
                class="project__link-question-hover"
                width="14"
                height="14"
                color="white"
                name="question-hover"
            /></a>
          </div>
          <div class="project__status" v-else>
            <svg-icon width="22" height="22" color="#BDBDBD" name="open-link" />
            <span>Not Published </span>
            <a
              class="project__link-tip"
              data-title="Publish the project so that other users can see it!"
            >
              <svg-icon
                class="project__link-question"
                width="14"
                height="14"
                :color="colorQuestionIcon"
                name="question"
              />
              <svg-icon
                class="project__link-question-hover"
                width="14"
                height="14"
                color="white"
                name="question-hover"
              />
            </a>
          </div>

          <div class="project__footer__item">
            <div class="project__count-page">
              <svg-icon
                class="project__count-page__icon"
                width="14"
                height="14"
                color="#BDBDBD"
                name="page"
              />
              <span>{{ projectUser.pagesCount }}</span>
              <span class="project__count-page__total">/{{ pageLimit }}</span>
            </div>

            <button-publish
              :class="{ project__btn__grey: isProjectPublished }"
              class="project__btn"
              :text="isProjectPublished ? 'Update' : 'Publish'"
              :white="isProjectPublished"
              @showPublishPopup="showPublishPopup"
            />

            <quick-actions
              :isDropdownVisible="isQuickActionsDropdownVisible"
              :isProject="true"
              :isPublished="isProjectPublished"
              :openWebsite="openWebsite"
              :openSiteSettings="openSiteSettings"
              :copyWebsiteLink="copyWebsiteLink"
              :editProjectName="enableNameEditing"
              :duplicateProject="duplicateProject"
              :openDeleteProjectConfirmation="openDeleteProjectConfirmation"
              :toggleDropdown="toggleQuickActionsDropdown"
              :unpublishProject="showPublishPopup"
            />
          </div>
        </div></div
    ></transition>
    <transition name="popup-layer" mode="out-in">
      <div :ref="'popupButton-' + projectUser.id"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import http from '@/utils/http'
import QuickActions from '@/components/Projects/QuickActions.vue'
import PencilIcon from '@/assets/icons/pencil_rename.svg?inline'
import NotPublishedIcon from '@/assets/icons/not-published.svg?inline'
import PreviewImage from '@/components/Shared/PreviewImage.vue'
import copyToClipboard from '@/utils/copy_to_clibpoard'
import ButtonPublish from '@/components/Projects/ButtonPublish.vue'
import {
  PagedProjectDto,
  ProjectStatus,
  AccountDto,
  BaseProjectPageDto,
} from '@/utils/api'
import apiClient from '@/utils/apiClient'
import HTMLElementEvent from '@/utils/types/HTMLElementEvent'
import { DeleteModalData, DeleteModalMode } from '@/store/project'
import { VisibleModalType } from '@/store/ui'
import Popup from '@/components/Modal/Popup.vue'
import Loader from '@/components/Shared/ui/loader.vue'
import {
  PopupSettings,
  PopupType,
  PublishPopupData,
} from '@/components/Modal/types'
import { debounce, cloneDeep as _cloneDeep } from 'lodash'

export default Vue.extend({
  components: {
    QuickActions,
    PencilIcon,
    NotPublishedIcon,
    PreviewImage,
    ButtonPublish,
    Popup,
    Loader,
  },
  props: {
    project: {
      type: Object as PropType<PagedProjectDto>,
    },
    projectPlanPage: Number,
    totalProjects: Number,
  },
  watch: {
    project: {
      deep: true,
      handler(val) {
        this.projectUser = _cloneDeep(val)
      },
    },
  },
  data() {
    return {
      nameInputValue: this.project.name,
      isVisible: false,
      isNameEditing: false,
      isQuickActionsDropdownVisible: false,
      colorQuestionIcon: '#BDBDBD',
      imageLoading: false,
      projectHasLike: { hasLike: this.project.hasLike },
      projectUser: _cloneDeep(this.project),
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      popupSettings: (state: any) => state.ui.popupSettings,
    }),
    isProjectsLimit(): boolean {
      if (this.user.isAdmin) return false

      return this.totalProjects >= this.user.plan.features.draftProjects
    },
    isProjectPublished(): boolean {
      return this.project.isPublishedInCommunity
    },
    mergedUrl(): string {
      const { customDomain, airtapDomain } = this.project.settings

      if (customDomain) return customDomain
      return `${process.env.VUE_APP_AIRTAP_DOMAIN}/w/${airtapDomain}`
    },
    posterColor(): string {
      const color = this.project.previewImage?.dominantColor
      return `background: ${color ? color : '#6168FF'}`
    },
    pageLimit(): string {
      return this.user.isAdmin
        ? '∞'
        : this.user.plan.features.projectPages.toString()
    },
    previewimageInput(): any {
      return this.$refs['preview-image-input']
    },
  },
  created() {
    if (process.client) {
      document.addEventListener(
        'hide-quick-actions-dropdown',
        this.hideQuickActionsDropdown
      )
      document.addEventListener(
        'click',
        this.hideQuickActionsDropdownOnDocumentClick
      )
      document.addEventListener('hide-projects', this.hideProject)
      document.addEventListener('show-projects', this.showProject)
      document.addEventListener('keyup', this.hideQuickActionsDropdown)
      document.addEventListener('keyup', this.disableNameEditing)
      document.addEventListener('keyup', this.saveNameOnEnter)
      document.addEventListener('click', this.disableNameEditingOnClick)
    }
  },
  mounted() {
    setTimeout(() => {
      this.isVisible = false
    }, 10)
  },
  beforeDestroy() {
    document.removeEventListener(
      'hide-quick-actions-dropdown',
      this.hideQuickActionsDropdown
    )
    document.removeEventListener(
      'click',
      this.hideQuickActionsDropdownOnDocumentClick
    )
    document.removeEventListener('hide-projects', this.hideProject)
    document.removeEventListener('show-projects', this.showProject)
    document.removeEventListener('keyup', this.hideQuickActionsDropdown)
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
    likeProject() {
      if (!this.user.userName) {
        return
      }
      this.projectUser.hasLike = !this.projectUser.hasLike
      this.projectUser.likes =
        this.projectUser.likes + (this.projectUser.hasLike ? 1 : -1)
      this.toggleProjectLike(
        this.projectUser,
        this.user.userName,
        this.projectHasLike
      )
    },
    toggleProjectLike: debounce(
      (project: PagedProjectDto, userName: string, projectHasLike: any) => {
        if (projectHasLike.hasLike == project.hasLike) return
        apiClient.profiles
          .profilesToggleProjectLike(project.id, userName)
          .then(() => {
            projectHasLike.hasLike = project.hasLike
          })
          .catch(() => {
            project.hasLike = !project.hasLike
            project.likes = project.likes + (project.hasLike ? 1 : -1)
          })
      },
      800
    ),
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
        this.nameInputValue = this.project.name
      }
    },
    disableNameEditingOnClick(event: any) {
      if (!event.target.closest('.project')) {
        this.isNameEditing = false
        this.nameInputValue = this.project.name
      }
    },
    saveName(event: Event) {
      if (event) event.preventDefault()

      const projectName = this.nameInputValue
      if (!projectName) {
        console.error('Project name is empty')
        return
      }

      apiClient.projects
        .projectsChangeName(this.project.id, { projectName })
        .then(() => {
          this.isNameEditing = false
          this.$store.commit('project/changeProjectName', {
            id: this.project.id,
            name: projectName,
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

    openWebsite(event: Event) {
      if (event) event.preventDefault()
      if (!this.isProjectPublished) return

      window.open(`https://${this.mergedUrl}`, '_blank')
    },

    openSiteSettings(event: Event) {
      if (event) event.preventDefault()
      const { dispatch, commit } = this.$store

      dispatch('siteSettings/loadModalData', {
        projectId: this.project.id,
      }).then(() => {
        dispatch('ui/changeVisibleModalName', {
          newVisibleModalName: VisibleModalType.SiteSettings,
        })
      })
    },
    copyWebsiteLink(event: Event) {
      if (event) event.preventDefault()

      copyToClipboard(`https://${this.mergedUrl}`)

      this.$store.commit(
        'ui/changeVisibleModalName',
        VisibleModalType.LinkCopied
      )
    },
    duplicateProject(event: Event) {
      if (event) event.preventDefault()
      if (this.isProjectsLimit)
        this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
      else this.$store.dispatch('project/duplicateProject', this.project.id)
    },
    openDeleteProjectConfirmation(event: Event) {
      if (event) event.preventDefault()

      const { id, name } = this.project

      const deleteModalData: DeleteModalData = {
        type: DeleteModalMode.Project,
        projectId: id,
        name,
        actionAfterDelete: () => {
          location.reload()
        },
      }

      this.$store.commit('project/changeDeleteModalData', deleteModalData)
      this.$store.dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: VisibleModalType.DeleteProjectConfirmation,
      })
    },
    showPublishPopup() {
      const projectId = this.project.id
      if (!projectId) {
        console.error("[PublishBtn]: user doesn't edit project page")
        return
      }
      const project = this.project
      const page = project?.homePage
      const pageId = page?.id
      if (!project || !page) {
        console.error('[PublishBtn]: not found project or page in store')
        return
      }

      const domRect = (<HTMLDivElement>(
        this.$refs['popupButton-' + projectId]
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
          background: '',
          data: {
            project,
            isPage: false,
            pages,
          },
        }
        this.$store.commit('ui/SET_POPUP_SETTINGS', popupSettings)
      })
    },
    toggleQuickActionsDropdown(event: Event) {
      if (event) event.preventDefault()

      if (!this.isQuickActionsDropdownVisible === true) {
        document.dispatchEvent(new Event('hide-quick-actions-dropdown'))
      }

      this.isQuickActionsDropdownVisible = !this.isQuickActionsDropdownVisible
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
    hideQuickActionsDropdown() {
      this.isQuickActionsDropdownVisible = false
    },

    showProject() {
      this.isVisible = false
    },
    hideProject() {
      this.isVisible = true
    },
    uploadPreview(
      e: HTMLElementEvent<HTMLInputElement>,
      project: PagedProjectDto
    ) {
      e.preventDefault()
      e.stopPropagation()
      if (e.target?.files == null || !e.target.files[0]) return
      const file = e.target.files[0]
      const fd = new FormData()
      fd.append('files', file)
      const url = `/api/files/projects/${this.project.id}/preview`
      this.imageLoading = true
      http
        .post(url, fd)
        .then(({ data: images }) => {
          const image = images[0]
          this.projectUser.previewImage = image
          this.imageLoading = false
          this.$emit('loaded')
        })
        .catch((error) => {
          console.error(error)
        })
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
.project-item {
  flex: 0 0 calc(33.333% - 40px);
  width: calc(33.333% - 40px);
  position: relative;
  //z-index: 10;
  margin-right: 20px;
  margin-bottom: 40px;
  margin-left: 20px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  display: flex;
  flex-direction: column;
}
.project {
  position: relative;
  display: grid;
  padding: 30px;
  border: 1px solid #ebebeb;
  box-sizing: border-box;
  grid-template-columns: calc(100% - 240px) 220px;
  column-gap: 20px;
  grid-template-rows: minmax(150px, 166px) 61px;
  border-radius: 12px;
  background-color: #ffffff;
  width: 100%;
  &__preview {
    display: flex;
    grid-column: 1/2;
    grid-row: 1/2;
    position: relative;
    width: 100%;
    height: 100%;
    input[type='file'] {
      display: none;
    }
    &.loading {
      border-radius: 16px;
      border: 1px solid #ebebeb;
    }
    &:hover {
      &:before {
        opacity: 1;
      }
      .project__preview__changePreview {
        opacity: 1;
      }
    }
    &__poster {
      display: block;
      width: 100%;
      height: 100%;
    }
    &__poster-wrapper {
      border-radius: 16px;
      overflow: hidden;
      height: 100%;
      width: 100%;
      padding: 10px;
      background: #6168ff;
      position: absolute;
      box-shadow: inset 0 65.3633px 152.514px rgba(0, 0, 0, 0.4);

      &:after {
        content: '';
        position: absolute;
        left: 10px;
        top: 10px;
        border-radius: 12px;
        background: $white;
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        z-index: 1;
      }

      img {
        position: relative;
        z-index: 2;
        border-radius: 12px;
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }
    &__button {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      position: absolute;
    }
    &__changePreview {
      width: 40px;
      height: 40px;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      background-color: $white;
      opacity: 0;
      transition: 0.3s;
      position: relative;
      z-index: 3;
      &__hover {
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
      }
      img {
        transition: 0.3s;
      }
      &:hover {
        background-color: $black;
        .project__preview__changePreview__hover {
          opacity: 1;
        }
        .project__preview__changePreview__plain {
          opacity: 0;
        }
      }
    }
  }
  &__likeAndView {
    font-size: 12px;
    display: flex;
    margin-top: 16px;
    align-items: center;
    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    span {
      display: flex;
      margin-right: 10px;
      align-items: center;
    }
    button {
      width: 16px;
      height: 16px;
      background: #ffffff;
      cursor: pointer;
      margin-right: 2px;
    }
    &__iconView {
      margin-right: 4px;
    }
    svg {
      transition: 0.3s;
    }
    &:hover {
      span:first-child svg {
        color: $black !important;
      }
    }
  }
  &__info {
    grid-column: 2/3;
    grid-row: 1/2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  &__footer {
    grid-column: 1/3;
    grid-row: 2/3;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid #ebebeb;
    &__item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      width: 220px;
    }
  }
  &__count-page {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    &__total {
      font-weight: 400;
      font-size: 10px;
      line-height: 15px;
      color: #bdbdbd;
    }
    &__icon {
      margin-right: 4px;
    }
  }
  &__btn {
    margin-left: 16px;
    margin-right: 16px;
    &__grey {
      background: #949cad;
      border: 1px solid #949cad;
      &:hover {
        background: #828282;
      }
    }
  }
  &__heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    width: 100%;
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
    visibility: visible;
  }

  &__info-top-line {
    display: flex;
    align-items: flex-start;
    max-width: 100%;
    margin-bottom: 4px;
    position: relative;

    &_editable {
      width: 100%;
      margin-bottom: 9px;
    }
  }

  &__name {
    font-weight: normal;
    font-size: 25px;
    line-height: 38px;
    color: #000000;
    position: relative;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 0;
    margin-right: 8px;
    margin-bottom: 0;
    overflow: hidden;
    width: 220px;
    transition: 0.3s;
    text-decoration: none;
    &:hover {
      color: #173bef;
    }
  }

  &__name-input {
    width: 100%;
    height: 24px;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: #000000;
    border: 1px solid #dadada;
    padding: 9px 8px;
    margin-right: 8px;
    border-radius: 4px;
  }

  &__save-name {
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    text-decoration: none;
    color: #ffffff;
    background: #000000;
    border-radius: 4px;
    padding: 3px 8px;
    transition: 0.3s background-color;
    height: 24px;
    &:hover {
      background: #333333;
      color: #ffffff;
    }
  }

  &__link-wrapper {
    width: calc(100% - 180px);
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__link {
    position: relative;
    line-height: 12px;
    font-size: 13px;
    font-weight: 400;
    text-decoration: none;
    color: #173bef;
    transition: 0.3s;
    display: flex;
    align-items: center;
    margin-left: 2px;
    max-width: calc(100% - 30px);
    span {
      border-bottom: 1px solid transparent;
      margin-bottom: -3px;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #173bef;
      overflow: hidden;
      width: calc(100% - 10px);
      &:hover {
        border-bottom: 1px solid #173bef;
      }
    }
  }
  &__views {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    color: #bdbdbd;
    span {
      color: #000;
    }
  }
  &__status {
    font-style: normal;
    font-weight: normal;
    line-height: 20px;
    font-size: 13px;
    color: #bdbdbd;
    display: flex;
    align-items: center;
    margin-left: 2px;
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
      .project__link-question-hover {
        display: block;
      }
      .project__link-question {
        display: none;
      }
    }
    &:hover::after {
      content: attr(data-title);
      padding: 8px;
      background: #000000;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
}
@media screen and (min-width: 2200px) {
  .project {
    grid-template-rows: minmax(200px, 220px) 61px;
  }
}
@media screen and (max-width: 1866px) {
  .project {
    padding: 20px;
    grid-template-rows: minmax(140px, 150px) 61px;
  }
  .project-item {
    flex: 0 0 calc(33.333% - 20px);
    width: calc(33.333% - 20px);
    margin-right: 10px;
    margin-bottom: 20px;
    margin-left: 10px;
  }
}
@media screen and (max-width: 1710px) {
  .project {
    grid-template-rows: minmax(130px, 140px) 61px;
  }
}

@media screen and (max-width: 1620px) {
  .project {
    padding: 30px;
    grid-template-rows: minmax(150px, 190px) 61px;
  }
  .project-item {
    flex: 0 0 calc(50% - 40px);
    width: calc(50% - 40px);
    margin-right: 20px;
    margin-bottom: 40px;
    margin-left: 20px;
  }
}
@media screen and (max-width: 1320px) {
  .project {
    padding: 20px;
    grid-template-rows: minmax(140px, 150px) 61px;
  }
  .project-item {
    flex: 0 0 calc(50% - 20px);
    width: calc(50% - 20px);
    margin-right: 10px;
    margin-bottom: 20px;
    margin-left: 10px;
  }
}
@media screen and (max-width: 1200px) {
  .project {
    grid-template-rows: minmax(120px, 130px) 61px;
  }
}
@media screen and (max-width: 1150px) {
  .project {
    grid-template-columns: calc(100% - 220px) 200px;
    grid-template-rows: minmax(80px, 90px) 61px;
  }
}
@media screen and (max-width: 1000px) {
  .project {
    padding: 30px;
    grid-template-columns: 300px calc(100% - 320px);
    grid-template-rows: minmax(190px, 190px) 61px;
  }
  .project-item {
    flex: 0 0 calc(100% - 20px);
    width: calc(100% - 20px);
    margin-right: 10px;
    margin-bottom: 20px;
    margin-left: 10px;
  }
}
@media screen and (max-width: 625px) {
  .project {
    padding: 20px;
    grid-template-columns: calc(100% - 240px) 220px;
    grid-template-rows: minmax(160px, 170px) 61px;
  }
}
@media screen and (max-width: 550px) {
  .project {
    grid-template-rows: minmax(130px, 140px) 61px;
  }
}
@media screen and (max-width: 510px) {
  .project {
    grid-template-rows: minmax(100px, 110px) 61px;
  }
}
@media screen and (max-width: 475px) {
  .project {
    padding: 15px;
    grid-template-columns: 100%;
    grid-template-rows: 195px 68px 61px;
    &__info {
      grid-column: 1/2;
      grid-row: 2/3;
      display: grid;
      grid-template-columns: calc(100% - 100px) 100px;
      grid-template-rows: 38px 18px;
      margin-top: 12px;
    }
    &__likeAndView {
      grid-column: 2/3;
      grid-row: 1/2;
      justify-content: flex-end;
      margin-top: 10px;
    }
    &__status {
      width: calc(100% - 170px);
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: calc(100% - 20px);
      }
    }
    &__link-wrapper {
      width: calc(100% - 170px);
    }
    &__btn {
      margin-left: 8px;
      margin-right: 8px;
    }
    &__heading {
      grid-column: 1/2;
      grid-row: 1/2;
    }
    &__views {
      grid-column: 1/3;
      grid-row: 2/3;
    }
    &__footer {
      grid-column: 1/2;
      grid-row: 3/4;
      &__item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        width: 170px;
      }
    }
  }
}
</style>

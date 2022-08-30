<template>
  <div class="pages">
    <template v-if="!isLoading">
      <div class="pages__header pages__project">
        <div class="pages__project__path">
          <a href="/dashboard"> {{ path }}</a> / <span>{{ project.name }}</span>
        </div>
        <a :data-title="project.name" class="pages__project__title">
          <span>{{ project.name }}</span></a
        >

        <div class="pages__project__link-wrapper">
          <a
            class="pages__project__link"
            :class="{
              'pages__project__link--unpublished': !isProjectPublished,
              'pages__project__link--published': isProjectPublished,
            }"
            :href="isProjectPublished ? `https://${projectHref}` : null"
            target="_blank"
          >
            <svg-icon
              width="22"
              height="22"
              :color="isProjectPublished ? '#173BEF' : '#BDBDBD'"
              name="open-link"
            />
            <span v-html="projectHref"></span>
          </a>
          <a
            class="pages__project__link-tip"
            data-title="Publish the project so that other users can see it!"
          >
            <svg-icon
              class="pages__project__link-question"
              width="14"
              height="14"
              color="#000000"
              name="question" />
            <svg-icon
              class="pages__project__link-question-hover"
              width="14"
              height="14"
              color="white"
              name="question-hover"
          /></a>
        </div>

        <div class="pages__count">
          <div class="pages__count__page">
            <svg-icon
              width="16"
              height="16"
              color="#000000"
              name="page"
            />
            <span
              class="pages__count__text"
              :class="{
                projects__count__limit:
                  projectPages.length == Number(pagesLimit),
              }"
              >{{ projectPages.length }}/{{ pagesLimit }} pages</span
            >

            <a class="pages__link-tip">
              <svg-icon
                class="pages__count__question"
                width="14"
                height="14"
                color="#000000"
                name="question"
              />
              <svg-icon
                class="pages__count__question-hover"
                width="14"
                height="14"
                color="white"
                name="question-hover"
              /><span class="pages__link-tip__div"
                >You have exceeded the pages limit.<span
                  class="pages__link-tip__text"
                >
                  Upgrade to pro!</span
                ></span
              ></a
            >
          </div>
          <div class="pages__count__submissions">
            <svg-icon
              width="16"
              height="16"
              name="submissions"
              color="#333333"
            />
            <span
              class="pages__count__text"
              :class="{
                projects__count__limit:
                  projectPages.length == Number(pagesLimit),
              }"
              >0/0 Submissions</span
            >

            <a class="pages__link-tip">
              <svg-icon
                class="pages__count__question"
                width="14"
                height="14"
                color="#000000"
                name="question"
              />
              <svg-icon
                class="pages__count__question-hover"
                width="14"
                height="14"
                color="white"
                name="question-hover"
              /><span class="pages__link-tip__div"
                >You have exceeded the pages limit.<span
                  class="pages__link-tip__text"
                >
                  Upgrade to pro!</span
                ></span
              ></a
            >
          </div>
        </div>
        <div class="pages__project__action">
          <div
            class="add-site-btn pages__settingsBtn"
            @click="openSiteSettingsModal"
          >
            <svg-icon
              width="16"
              height="16"
              color="black"
              name="settings-switch"
            />
            <span>Project Settings</span>
          </div>
          <div class="drop-down">
            <div
              class="pages__addBtn add-site-btn"
              @click.stop="openProjectDropdown"
            >
              <svg-icon
                width="16"
                height="16"
                color="#ffffff"
                name="plus"
              />

              <span>Add page</span>
            </div>
            <div
              v-if="isDropdownOpen"
              v-click-outside="() => (isDropdownOpen = false)"
              class="drop-down__container"
            >
              <ul class="drop-down__list">
                <li class="drop-down__item">
                  <div
                    class="drop-down__item-container"
                    @click="redirectToTemplatesPage"
                  >
                    <layer />
                    <span>Browse templates</span>
                  </div>
                </li>
                <li class="drop-down__item">
                  <div
                    class="drop-down__item-container"
                    @click="createDefaultPage"
                  >
                    <file />
                    <span>Blank page</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <pages-list
        :projectPages="filteredPages"
        :projectHref="projectHref"
        :createPage="createDefaultPage"
        :additivePage="additivePage"
      />
    </template>
    <div v-else class="pages__skeleton">
      <div class="pages__skeleton-title">
        <skeleton
          max-width="100%"
          height="120"
          width="100%"
          radius="4"
          style="margin-bottom: 20px"
        />
      </div>
      <div
        class="pages__skeleton-item"
        v-for="item in 4"
        :key="`${item}skeleton`"
      >
        <skeleton
          max-width="100%"
          height="240"
          width="100%"
          radius="12"
          style="margin-bottom: 8px"
        />
        <skeleton max-width="100%" height="48" width="100%" radius="12" />
      </div>
    </div>
    <!-- <options-panel /> -->

    <site-settings
      v-if="visibleModalName === VisibleModalType.SiteSettings"
      :isVisible="visibleModalName === VisibleModalType.SiteSettings"
    />
    <publish-modal
      :is-visible="visibleModalName === VisibleModalType.PublishPage"
    />
    <delete-project-confirmation-modal
      :modal-type="filteredPages.length === 1 ? 'project' : 'page'"
      :isVisible="
        visibleModalName === VisibleModalType.DeleteProjectConfirmation
      "
    />
    <delete-project-success-message
      :modal-type="filteredPages.length === 1 ? 'project' : 'page'"
      :isVisible="visibleMessageName === VisibleModalType.DeleteProjectSuccess"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { VisibleModalType } from '@/store/ui'
import apiClient from '@/utils/apiClient'
import {
  BaseProjectDto,
  BaseProjectPageDto,
  AccountDto,
  ProjectFilterType,
} from '@/utils/api'
import ProfileToggle from '@/components/ProfileHead/ProfileToggle.vue'
import ProfilePlan from '@/components/ProfileHead/ProfilePlan.vue'
import RatioRange from '@/components/ProfileHead/RatioRange.vue'
import PlusSvg from '@/components/ProfileHead/Svg/Plus.vue'
import SettingsSvg from '@/components/Pages/Svg/SettingsSvg.vue'
import PagesList from '@/components/Pages/PagesList.vue'
import SiteSettings from '@/components/Shared/SiteSettings/SiteSettings.vue'
import Message from '@/components/Shared/SiteSettings/Message.vue'
import DeleteProjectSuccessMessage from '@/components/Shared/DeleteProjectSuccessMessage.vue'
import DeleteProjectConfirmationModal from '@/components/Shared/DeleteProjectConfirmationModal.vue'
import PublishModal from '@/components/Shared/PublishModal.vue'
import Skeleton from '@/components/Shared/ui/skeleton.vue'

import EmptyIcon from '@/assets/icons/empty.svg?inline'
import NotPublished from '@/assets/icons/not-published.svg?inline'
import File from '@/assets/icons/file.svg?inline'
import Layer from '@/assets/icons/layers.svg?inline'

enum ToggleStatus {
  All = 'All',
  Published = 'Published',
  Drafts = 'Drafts',
}

class ToggleItem {
  constructor(
    public status: ToggleStatus,
    public pages: BaseProjectPageDto[]
  ) {}

  get count() {
    return this.pages.length
  }

  get name() {
    return this.status
  }
}

export default Vue.extend({
  head() {
    return {
      title: 'Project pages',
    }
  },
  layout: 'cabinet',
  middleware: ['auth'],
  components: {
    PagesList,
    Skeleton,
    SiteSettings,
    Message,
    DeleteProjectConfirmationModal,
    DeleteProjectSuccessMessage,
    PublishModal,
    RatioRange,
    ProfileToggle,
    ProfilePlan,
    PlusSvg,
    SettingsSvg,
    EmptyIcon,
    NotPublished,
    File,
    Layer,
  },
  data() {
    return {
      VisibleModalType,
      activeToggleItem: null as ToggleItem | null,
      project: {} as BaseProjectDto,
      overlayException: ['link-copied', 'page-duplicated'],
      isDropdownOpen: false as boolean,
      isLoading: true,
    }
  },
  props: {
    activeSectionProjects: {
      type: String as PropType<ProjectFilterType>,
      default: '',
    },
  },
  async mounted() {
    try {
      const projectId = this.$route.params.projectId
      const getProjectPages = () => {
        return apiClient.projectPages.projectPagesGet(+projectId)
      }

      const getProjectById = () => {
        return apiClient.projects.projectsGetById(+projectId)
      }
      const [{ data: projectPages }, { data: project }] = await Promise.all([
        getProjectPages(),
        getProjectById(),
      ])

      if (!project || !projectPages || !projectPages.length) {
        this.$router.push('/404')
        return
      }

      this.project = project
      this.isLoading = false
      this.$store.commit('project/changeProjects', [this.project])
      this.$store.commit('project/changeProjectPages', projectPages)
    } catch (error) {
      console.error(error)
      this.$router.push('/404')
    }
  },

  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      projectPages: (state: any) =>
        <BaseProjectPageDto[]>state.project.projectPages,
      visibleModalName: (state: any) => state.ui.visibleModalName,
      visibleMessageName: (state: any) => state.ui.visibleMessageName,
    }),
    path(): string {
      if (this.activeSectionProjects == ProjectFilterType.All)
        return 'All projects'
      if (this.activeSectionProjects == ProjectFilterType.Drafts)
        return 'Drafts'
      if (this.activeSectionProjects == ProjectFilterType.Community)
        return 'Projects in community'
      if (this.activeSectionProjects == ProjectFilterType.Custom)
        return 'Custom domain'
      return ''
    },
    isLimit(): boolean {
      if (this.user.isAdmin) return false

      return this.projectPages.length >= this.user.plan.features.projectPages
    },
    pagesLimit(): string {
      return this.user.isAdmin
        ? '∞'
        : this.user.plan.features.projectPages.toString()
    },
    isProjectPublished(): boolean {
      if (!this.project) return false
      return this.project && this.project.statusName === 'published'
    },
    projectHref(): string {
      if (!this.project.settings) return ''
      if (!!this.project.settings.customDomain)
        return this.project.settings.customDomain

      const airtapDomain = !this.isProjectPublished
        ? `<span>____</span>`
        : this.project.settings.airtapDomain

      const domain = process.env.VUE_APP_AIRTAP_DOMAIN

      return `${domain}/w/${airtapDomain}`
    },
    toggleItems(): ToggleItem[] {
      const publishedPages = this.projectPages.filter(
        (page) => page.isPublished
      )
      const draftPages = this.projectPages.filter((page) => !page.isPublished)
      // const deletedPages = this.projectPages.filter((page) => page.statusName == 'deleted')

      return [
        new ToggleItem(ToggleStatus.All, this.projectPages),
        new ToggleItem(ToggleStatus.Published, publishedPages),
        new ToggleItem(ToggleStatus.Drafts, draftPages),
      ]
    },
    filteredPages(): BaseProjectPageDto[] {
      return !this.activeToggleItem ||
        this.activeToggleItem === this.toggleItems[0]
        ? this.projectPages
        : this.activeToggleItem.pages
    },
    projectId(): number {
      return +this.$route.params.projectId
    },
    additivePage(): Boolean {
      return this.projectPages.length < this.user.plan.features.projectPages
    },
  },
  methods: {
    changeActiveToggleItem(item: ToggleItem) {
      this.activeToggleItem = item
    },
    redirectToTemplatesPage(event: Event) {
      if (event) event.preventDefault()

      if (!this.isLimit) {
        this.$router.push(`/projects/${this.$route.params.projectId}/templates`)
        return
      }

      this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
    },
    async openSiteSettingsModal(event: Event) {
      if (event) event.preventDefault()

      const { projectId } = this.$route.params
      const { dispatch } = this.$store

      await dispatch('siteSettings/loadModalData', { projectId })

      dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: VisibleModalType.SiteSettings,
      })
    },
    createDefaultPage() {
      const { dispatch } = this.$store
      if (window.innerWidth < 1200) {
        dispatch('ui/changeVisibleModalName', {
          newVisibleModalName: VisibleModalType.MobileAlert,
        })
        return
      }

      dispatch('project/createPage', {
        projectId: this.projectId,
        templateId: '31',
      })
    },
    openProjectDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
  },
})
</script>

<style lang="scss" scoped>
.pages {
  font-family: 'Poppins', sans-serif;
  margin: 30px 0 20px 0;
  &__skeleton {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    margin-right: -20px;
    margin-left: -20px;

    &-title {
      flex: 0 0 calc(100% - 40px);
      width: calc(100% - 40px);
      height: 120px;
      margin-right: 20px;
      margin-bottom: 20px;
      margin-left: 20px;
    }
    &-item {
      flex: 0 0 calc(20% - 40px);
      width: calc(20% - 40px);
      margin-right: 20px;
      margin-bottom: 40px;
      margin-left: 20px;
    }
  }
  &__project {
    display: grid;
    grid-template-columns: calc(100% - 680px) 358px 322px;
    grid-template-rows: 18px 48px 37px;
    row-gap: 8px;
    &__title {
      font-weight: 500;
      font-size: 32px;
      line-height: 48px;
      grid-column: 1/4;
      grid-row: 2/3;
      position: relative;
      span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        position: absolute;
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
        left: 110px;
        top: -15px;
        transform: translate(0.5em, -10%);
        z-index: 1;
        width: fit-content;
        height: auto;
        line-height: 12px;
        display: flex;
      }
    }
    &__path {
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      color: #949cad;
      margin-bottom: 4px;
      grid-column: 1/4;
      grid-row: 1/2;
      a {
        color: #949cad;
        text-decoration: none;
        &:hover {
          color: #173bef;
        }
      }
      span {
        color: #000000;
      }
    }
    &__action {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      grid-column: 3/4;
      grid-row: 3/4;
    }

    &__link-question-hover {
      display: none;
    }
    &__link-question {
      display: block;
    }
    &__link-wrapper {
      max-width: calc(100% - 358px);
      display: flex;
      flex-direction: row;
      align-items: center;
      width: fit-content;
      grid-column: 1/3;
      grid-row: 3/4;
    }
    &__link {
      position: relative;
      line-height: 18px;
      font-size: 12px;
      font-weight: 400;
      text-decoration: none;
      color: #173bef;
      transition: 0.3s;
      display: flex;
      align-items: center;
      width: calc(100% - 18px);
      &--unpublished {
        color: #949cad;
      }
      &--published {
        &:hover {
          span {
            border-bottom: 1px solid #173bef;
          }
        }
      }
      span {
        border-bottom: 1px solid transparent;
        margin-bottom: -3px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: calc(100% - 22px);
        margin-left: 4px;
      }
    }
    &__header {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      &__item {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .add-site-btn {
          padding: 8px 16px;
          border: 1px solid #ebebeb;
          height: 34px;
          span {
            font-weight: 500;
            font-size: 13px;
            line-height: 20px;
          }
        }
      }
    }
    &__link-tip {
      position: relative;
      margin-left: 4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      &:hover {
        .pages__project__link-question-hover {
          display: block;
        }
        .pages__project__link-question {
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
  &__settingsBtn {
    background: #ffffff;
    height: 35px;
    border: 1px solid #ebebeb;
    margin-right: 16px;
    padding: 8px 16px;
    svg {
      margin-right: 8px;
      max-width: 16px;
    }
    &:hover {
      background: #ebebeb;
      color: #000000;
    }
  }
  &__addBtn {
    background: #000000;
    height: 35px;
    border: 1px solid #000000;
    color: #fff;
    svg {
      margin-right: 8px;
      max-width: 16px;
    }
    &:hover {
      background: #333333;
    }
  }
  &__count {
    grid-column: 2/3;
    grid-row: 3/4;
    height: 37px;
    padding: 8px 16px;
    background: #f3f3f3;
    border-radius: 4px;
    margin-right: 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: fit-content;
    margin-left: auto;
    div {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      svg {
        margin-right: 4px;
      }
    }
    &__page {
      margin-right: 16px;
    }
    &__text {
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      margin-right: 4px;
    }
    &__limit {
      color: #f46363;
    }
    &__question-hover {
      display: none;
    }
    &__question {
      display: block;
    }
  }
  &__link-tip {
    position: relative;
    margin-left: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &__div {
      display: none;
      padding: 8px;
      background: #000000;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      font-size: 10px;
      color: #ffffff;
      position: absolute;
      margin: auto;
      left: -50px;
      top: 35px;
      z-index: 3;
      width: 200px;
      height: 52px;
      line-height: 12px;
    }
    &__text {
      font-weight: 500;
      font-size: 13px;
      display: block;
      line-height: 20px;
      margin-top: 3px;
    }
    &:hover {
      .pages__count__question-hover {
        display: block;
      }
      .pages__count__question {
        display: none;
      }
      .pages__link-tip__div {
        display: block;
      }
    }
  }
}
.drop-down {
  position: relative;
  &__container {
    width: 100%;
    min-width: 200px;
    background: $white;
    color: $black;
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    border: 1px solid #dadada;
    box-shadow: 0 10px 20px rgba(9, 9, 9, 0.15);
    border-radius: 4px;
    padding: 2px 6px;
    z-index: 10;
  }
  &__item {
    padding: 4px;
    margin: 0 -4px;

    &-container {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 10px 11px;
      border-radius: 4px;
      transition: 0.3s;
      cursor: pointer;

      span {
        font-size: 13px;
        line-height: 15px;
        margin-left: 5px;
      }

      path {
        transition: 0.3s;
      }

      &:hover {
        background: #f3f3f3;
        color: #318bf5;

        path {
          stroke: #318bf5;
        }
      }
    }
  }
}

@media screen and (max-width: 1728px) {
  .pages {
    &__skeleton-item {
      flex: 0 0 calc(25% - 40px);
      width: calc(25% - 40px);
    }
  }
}
@media screen and (max-width: 1440px) {
  .pages {
    margin: 30px 0 20px 0;
    &__skeleton-item {
      flex: 0 0 calc(33.333% - 40px);
      width: calc(33.333% - 40px);
    }
  }
}
@media screen and (max-width: 1020px) {
  .pages {
    &__project {
      grid-template-columns: calc(100% - 322px) 0px 322px;
      grid-template-rows: 18px 48px 37px 37px;
      &__link-wrapper {
        grid-column: 1/4;
        grid-row: 3/4;
        max-width: calc(100% - 330px);
      }
    }

    &__count {
      grid-column: 1/4;
      grid-row: 4/5;
      margin-left: 0;
    }
  }
}
@media screen and (max-width: 960px) {
  .pages {
    &__skeleton-item {
      flex: 0 0 calc(50% - 40px);
      width: calc(50% - 40px);
    }
  }
}
@media screen and (max-width: 768px) {
  .pages {
    &__addBtn {
      display: none;
    }
    &__settingsBtn {
      margin-right: 0px;
    }
    &__project {
      display: grid;
      grid-template-columns: calc(100% - 515px) 349px 166px;
      grid-template-rows: 18px 48px 18px;
      &__title {
        grid-column: 1/2;
        grid-row: 2/3;
      }
      &__action {
        grid-column: 3/4;
        grid-row: 2/3;
      }
      &__link-wrapper {
        grid-column: 1/4;
        grid-row: 3/4;
        max-width: 100%;
      }
    }
    &__count {
      grid-column: 2/3;
      grid-row: 2/3;
      margin-top: auto;
      margin-bottom: auto;
      margin-left: auto;
      margin-right: 0;
    }
  }
}
@media screen and (max-width: 655px) {
  .pages {
    &__project {
      grid-template-columns: calc(100% - 166px) 166px;
      grid-template-rows: 18px 48px 18px 37px;
      &__title {
        grid-column: 1/2;
        grid-row: 2/3;
      }
      &__action {
        grid-column: 2/3;
        grid-row: 2/3;
      }
      &__link-wrapper {
        grid-column: 1/3;
        grid-row: 3/4;
      }
      &__link-tip {
        &:hover::after {
          left: -170px;
          top: 25px;
        }
      }
    }
    &__count {
      grid-column: 1/3;
      grid-row: 4/5;
      width: 100%;

      &__submissions {
        .pages__link-tip__div {
          left: -185px;
          top: 35px;
        }
      }
    }
  }
}
</style>

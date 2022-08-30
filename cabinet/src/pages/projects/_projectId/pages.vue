<template>
  <div>
    <div class="profile-head">
      <div class="profile-head__col">
        <div class="profile-head__heading" style="margin-bottom: 18px">
          <h1 class="profile-head__title" :title="project.name">{{ project.name }}</h1>
        </div>
        <a
          class="profile-head__heading profile-head__heading--link"
          :class="{
            'profile-head__heading--unpublished': !isProjectPublished,
            'profile-head__heading--published': isProjectPublished,
          }"
          :href="isProjectPublished ? `https://${projectHref}` : null"
          target="_blank"
          style="margin-bottom: 30px"
        >
          <not-published />
          <span v-html="projectHref"></span>
        </a>
        <ProfileToggle :toggleItems="toggleItems" @changeActiveItem="changeActiveToggleItem" />
      </div>
      <div class="profile-head__col">
        <RatioRange :limit="pagesLimit" :current="projectPages.length" countName="pages" style="margin-bottom: auto" />
        <div class="profile-head__btns">
          <div class="add-site-btn" @click="openSiteSettingsModal">
            <SettingsSvg />
            <span>Site Settings</span>
          </div>
          <div class="drop-down">
            <div class="add-site-btn" @click.stop="openProjectDropdown">
              <PlusSvg />
              <span>New Page</span>
            </div>
            <div v-if="isDropdownOpen" v-click-outside="() => (isDropdownOpen = false)" class="drop-down__container">
              <ul class="drop-down__list">
                <li class="drop-down__item">
                  <div class="drop-down__item-container" @click="createDefaultPage">
                    <file />
                    <span>Blank page</span>
                  </div>
                </li>
                <li class="drop-down__item">
                  <div class="drop-down__item-container" @click="redirectToTemplatesPage">
                    <layer />
                    <span>Browse templates</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <options-panel /> -->
    <pages-list v-if="filteredPages.length > 0" :projectPages="filteredPages" :projectHref="projectHref" />
    <div class="empty-state" v-if="filteredPages.length <= 0">
      <h1>{{ projectPages.length > 0 ? 'You have not published pages yet' : 'You have not any pages yet' }}</h1>
      <EmptyIcon />
    </div>

    <site-settings
      v-if="visibleModalName === VisibleModalType.SiteSettings"
      :isVisible="visibleModalName === VisibleModalType.SiteSettings"
    />
    <limit-modal
      v-if="visibleModalName === VisibleModalType.Limit"
      :isVisible="visibleModalName === VisibleModalType.Limit"
    />
    <message
      class="page__link-copied"
      v-if="visibleModalName === VisibleModalType.LinkCopied"
      :emoji="'🎉'"
      :text="'Link copied'"
    />
    <message
      class="page__link-copied"
      v-if="visibleModalName === VisibleModalType.PageDuplicated"
      :emoji="'🎉'"
      :text="'Page duplicated'"
    />
    <publish-modal :is-visible="visibleModalName === VisibleModalType.PublishPage" />
    <delete-project-confirmation-modal
      :modal-type="filteredPages.length === 1 ? 'project' : 'page'"
      :isVisible="visibleModalName === VisibleModalType.DeleteProjectConfirmation"
    />
    <delete-project-success-message
      :modal-type="filteredPages.length === 1 ? 'project' : 'page'"
      :isVisible="visibleMessageName === VisibleModalType.DeleteProjectSuccess"
    />
    <overlay :isVisible="visibleModalName && !overlayException.includes(visibleModalName)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'

import { mapState } from 'vuex'
import { VisibleModalType } from '@/store/ui'

import apiClient from '@/utils/apiClient'
import { BaseProjectDto, BaseProjectPageDto, AccountDto } from '@/utils/api'

import ProfileToggle from '@/components/ProfileHead/ProfileToggle.vue'
import ProfilePlan from '@/components/ProfileHead/ProfilePlan.vue'
import RatioRange from '@/components/ProfileHead/RatioRange.vue'
import PlusSvg from '@/components/ProfileHead/Svg/Plus.vue'
import SettingsSvg from '@/components/Pages/Svg/SettingsSvg.vue'

import PagesList from '@/components/Pages/PagesList.vue'
import LimitModal from '@/components/Shared/LimitModal.vue'
import Overlay from '@/components/Shared/Overlay.vue'
import SiteSettings from '@/components/Shared/SiteSettings/SiteSettings.vue'
import Message from '@/components/Shared/SiteSettings/Message.vue'
import DeleteProjectSuccessMessage from '@/components/Shared/DeleteProjectSuccessMessage.vue'
import DeleteProjectConfirmationModal from '@/components/Shared/DeleteProjectConfirmationModal.vue'
import PublishModal from '@/components/Shared/PublishModal.vue'

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
  constructor(public status: ToggleStatus, public pages: BaseProjectPageDto[]) {}

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

    SiteSettings,
    LimitModal,
    Overlay,
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
      projectPages: [] as BaseProjectPageDto[],
      overlayException: ['link-copied', 'page-duplicated'],
      isDropdownOpen: false as boolean,
    }
  },
  async asyncData({ params, req, redirect }: Context) {
    try {
      const { projectId } = params
      const { cookie } = req.headers
      apiClient.instance.defaults.headers.Cookie = cookie

      const getProjectPages = () => {
        return apiClient.projectPages.projectPagesGet(+projectId)
      }

      const getProjectById = () => {
        return apiClient.projects.projectsGetById(+projectId)
      }

      const [{ data: projectPages }, { data: project }] = await Promise.all([getProjectPages(), getProjectById()])
      if (!project || !projectPages || !projectPages.length) {
        redirect('/404')
        return
      }

      return {
        project,
        projectPages,
      }
    } catch (error) {
      console.error(error)
      redirect('/404')
    }
  },
  created() {
    this.$store.commit('project/changeProjectPages', this.projectPages)
    this.$store.commit('project/changeProjects', [this.project])
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      visibleModalName: (state: any) => state.ui.visibleModalName,
      visibleMessageName: (state: any) => state.ui.visibleMessageName,
    }),
    isLimit(): boolean {
      if (this.user.isAdmin) return false

      return this.projectPages.length >= this.user.plan.features.projectPages
    },
    pagesLimit(): string {
      return this.user.isAdmin ? '∞' : this.user.plan.features.projectPages.toString()
    },
    isProjectPublished(): boolean {
      if (!this.project) return false
      return this.project && this.project.statusName === 'published'
    },
    projectHref(): string {
      if (!this.project) return ''
      if (!!this.project.settings.customDomain) return this.project.settings.customDomain

      const airtapDomain = !this.isProjectPublished ? `<span>____</span>` : this.project.settings.airtapDomain

      const domain = process.env.VUE_APP_AIRTAP_DOMAIN

      return `${domain}/w/${airtapDomain}`
    },
    toggleItems(): ToggleItem[] {
      const publishedPages = this.projectPages.filter((page) => page.isPublished)
      const draftPages = this.projectPages.filter((page) => !page.isPublished)
      // const deletedPages = this.projectPages.filter((page) => page.statusName == 'deleted')

      return [
        new ToggleItem(ToggleStatus.All, this.projectPages),
        new ToggleItem(ToggleStatus.Published, publishedPages),
        new ToggleItem(ToggleStatus.Drafts, draftPages),
      ]
    },
    filteredPages(): BaseProjectPageDto[] {
      return !this.activeToggleItem || this.activeToggleItem === this.toggleItems[0]
        ? this.projectPages
        : this.activeToggleItem.pages
    },
    projectId(): number {
      return +this.$route.params.projectId
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

    svg {
      margin: 0 14px 0 0;
    }

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
</style>

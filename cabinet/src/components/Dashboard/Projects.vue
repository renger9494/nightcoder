<template>
  <div>
    <div class="projects">
      <templates-carousel v-if="showTemplatesCarousel" />
      <div class="projects__header">
        <div class="projects__title" ref="title">{{ title }}</div>
        <div class="projects__header__item">
          <div
            class="projects__count"
            :class="{
              projects__count__limit: projects.length == Number(projectsLimit),
            }"
          >
            <span class="projects__count__text">
              {{ totalProjects }}/{{ projectsLimit }} projects
            </span>
            <a class="projects__link-tip">
              <svg-icon
                class="projects__count__question"
                width="14"
                height="14"
                color="#000000"
                name="question"
              />
              <svg-icon
                class="projects__count__question-hover"
                width="14"
                height="14"
                color="white"
                name="question-hover"
              /><span class="projects__link-tip__div"
                >You have exceeded the project limit.<span
                  class="projects__link-tip__text"
                >
                  Upgrade to pro!</span
                ></span
              ></a
            >
          </div>
          <div class="drop-down">
            <div
              v-if="
                !isProjectsLimit &&
                (activeSectionProjects == ProjectFilterType.All ||
                  activeSectionProjects == ProjectFilterType.Drafts)
              "
              class="add-site-btn projects__btn"
              @click="openProjectDropdown"
            >
              <PlusIcon />
              <span>New Project</span>
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
      <template v-if="!isLoading">
        <div
          v-if="
            activeSectionProjects == ProjectFilterType.Custom &&
            !isUserWithFreePlan &&
            !user.isAdmin
          "
          class="projects__custom"
        >
          <svg-icon width="168" height="150" name="upgrade-to-pro-neon" />

          <span class="projects__custom__text"
            >Upgrade to PRO to publish a project to Custom Domain</span
          >
          <upgrade-to-pro-button
            class="projects__custom__upgrade-to-pro-button"
          />
        </div>
        <div v-else class="projects__inner">
          <projects-list
            :projects="projects"
            :totalProjects="totalProjects"
            :additiveProject="additiveProject"
            :createDefaultPage="createDefaultPage"
            :redirectToTemplatesPage="redirectToTemplatesPage"
          />
          <pagination
            class="projects__pagination"
            v-if="totalPages > 1"
            :pageNumber="pageNumber"
            :totalPages="totalPages"
            @loadingList="loadingList"
          />
          <empty-state-community
            v-if="
              activeSectionProjects === ProjectFilterType.Community &&
              !projects.length
            "
          />
          <articles class="projects__articles" :articles="articles" v-if="articles.length" />
          <delete-project-confirmation-modal
            :isVisible="
              visibleModalName === VisibleModalType.DeleteProjectConfirmation
            "
          />
          <limit-modal
            v-if="visibleModalName === VisibleModalType.Limit"
            :isVisible="visibleModalName === VisibleModalType.Limit"
          />
          <site-settings
            v-if="visibleModalName === VisibleModalType.SiteSettings"
            :isVisible="visibleModalName === VisibleModalType.SiteSettings"
          />
          <delete-project-success-message
            :isVisible="
              visibleMessageName === VisibleModalType.DeleteProjectSuccess
            "
          />
          <!--   <popup v-if="popupSettings.active" /> -->
          <message
            class="projects__link-copied"
            v-if="visibleModalName === VisibleModalType.LinkCopied"
            :emoji="'🎉'"
            :text="'Link copied'"
          />
          <message
            class="projects__link-copied"
            v-if="visibleModalName === VisibleModalType.PageDuplicated"
            :emoji="'🎉'"
            :text="'Page duplicated'"
          />
          <message
            class="projects__link-copied"
            v-if="visibleModalName === VisibleModalType.ProjectDuplicates"
            :emoji="'🎉'"
            :text="'Project duplicated'"
          /></div
      ></template>
      <div v-else class="projects__skeleton">
        <div
          class="projects__skeleton-item"
          v-for="item in 3"
          :key="`${item}skeleton`"
        >
          <skeleton max-width="100%" height="269" width="100%" radius="12" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapState } from 'vuex'
import { VisibleModalType } from '@/store/ui'
import UpgradeToProButton from '@/components/Header/UpgradeToProButton.vue'
import ProjectsList from '@/components/Projects/ProjectsList.vue'
import DeleteProjectSuccessMessage from '@/components/Shared/DeleteProjectSuccessMessage.vue'

//Modals
import DeleteProjectConfirmationModal from '@/components/Shared/DeleteProjectConfirmationModal.vue'
import SiteSettings from '@/components/Shared/SiteSettings/SiteSettings.vue'
import Message from '@/components/Shared/SiteSettings/Message.vue'

//Icons
import Empty from '@/assets/icons/empty.svg?inline'
import PlusIcon from '@/components/ProfileHead/Svg/Plus.vue'
import File from '@/assets/icons/file.svg?inline'
import Layer from '@/assets/icons/layers.svg?inline'
import Skeleton from '@/components/Shared/ui/skeleton.vue'
import TemplatesCarousel from '@/components/Dashboard/TemplatesCarousel.vue'
import Articles from '@/components/Dashboard/Articles.vue'

import apiClient from '@/utils/apiClient'
import {
  AccountDto,
  HelpPageDto,
  ProjectFilterType,
  BaseProjectDto,
} from '@/utils/api'
import EmptyStateCommunity from '@/components/Dashboard/EmptyStateCommunity.vue'

export default Vue.extend({
  layout: 'profile',
  head() {
    return {
      title: 'Dashboard',
    }
  },
  middleware: ['auth'],
  components: {
    EmptyStateCommunity,
    UpgradeToProButton,
    ProjectsList,
    PlusIcon,
    Empty,
    File,
    Layer,
    DeleteProjectConfirmationModal,
    DeleteProjectSuccessMessage,
    SiteSettings,
    Message,
    Skeleton,
    TemplatesCarousel,
    Articles,
  },
  async mounted() {
    try {
      const { data } = await apiClient.projects.projectsGetPaged({
        Type: this.activeSectionProjects,
        PageSize: 12,
        PageNumber: this.$route.query.PageNumber
          ? Number(this.$route.query.PageNumber)
          : 1,
      })
      this.$store.commit('project/changeProjects', data.items)
      this.totalPages = data.pagination.totalPages
      this.pageNumber = data.pagination.pageNumber
      this.totalProjects = data.all
       const { data: helpPages } = await apiClient.helpPages.helpPagesGet({
        pageNumber: 1,
        pageSize: 3,
      })
      this.articles = helpPages.items
      this.isLoading = false
    } catch (error) {
      console.log(error)
    }
  },
  props: {
    activeSectionProjects: {
      type: String as PropType<ProjectFilterType>,
      default: ProjectFilterType.All,
    },
    showTemplatesCarousel: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      ProjectFilterType,
      VisibleModalType,
      activeToggleItem: null as any,
      totalProjects: 0,
      overlayMessages: ['link-copied', 'page-duplicated', 'project-duplicated'],
      isDropdownOpen: false,
      pageNumber: 1,
      totalPages: 1,
      isLoading: true,
      articles: [] as HelpPageDto[],
    }
  },
  watch: {
    queryPageNumber(val: number) {
      this.pageNumber = val
      this.showNextProjects()
    },
  },
  created() {
    this.$store.subscribeAction((action, state) => {
      if (action.type === 'project/restoreProject') {
        location.reload()
      }
      if (action.type === 'project/duplicateProject') {
        this.$store.commit(
          'ui/changeVisibleModalName',
          VisibleModalType.ProjectDuplicates
        )
        setTimeout(() => {
          location.reload()
        }, 2000)
      }
    })
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      projects: (state: any) => <BaseProjectDto[]>state.project.projects,
      areProjectsLoading: (state: any) => state.project.areProjectsLoading,
      visibleModalName: (state: any) =>
        <VisibleModalType | null>state.ui.visibleModalName,
      visibleMessageName: (state: any) => state.ui.visibleMessageName,
      popupSettings: (state: any) => state.ui.popupSettings,
    }),
    ...mapGetters({
      isUserWithFreePlan: 'auth/isUserWithFreePlan',
    }),
    projectsLimit(): string {
      return this.user.isAdmin
        ? '∞'
        : this.user.plan.features.draftProjects.toString()
    },
    queryPageNumber(): number {
      return this.$route.query?.PageNumber ? +this.$route.query?.PageNumber : 1
    },
    title(): string {
      if (this.activeSectionProjects == ProjectFilterType.All)
        return 'All projects'
      if (this.activeSectionProjects == ProjectFilterType.Drafts)
        return 'Drafts'
      if (this.activeSectionProjects == ProjectFilterType.Community)
        return 'Projects in community'
      if (this.activeSectionProjects == ProjectFilterType.Custom)
        return 'Domain'
      return ' '
    },

    additiveProject(): Boolean {
      return (
        (this.activeSectionProjects == ProjectFilterType.All ||
          this.activeSectionProjects == ProjectFilterType.Drafts) &&
        (this.user.isAdmin ||
          this.projects.length < this.user.plan.features.draftProjects) &&
        this.pageNumber >= this.totalPages
      )
    },
    isProjectsLimit(): boolean {
      if (this.user.isAdmin) return false

      return this.totalProjects >= this.user.plan.features.draftProjects
    },
  },
  methods: {
    changeActiveToggleItem(item: any) {
      this.activeToggleItem = item
    },
    redirectToTemplatesPage(event: Event) {
      if (event) event.preventDefault()

      if (!this.isProjectsLimit) {
        this.$router.push('/templates')
        return
      }

      this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
    },
    createDefaultPage() {
      const { dispatch } = this.$store
      if (window.innerWidth < 1200) {
        dispatch('ui/changeVisibleModalName', {
          newVisibleModalName: VisibleModalType.MobileAlert,
        })
        return
      }
      dispatch('project/createProject', { isWithBlankPage: true })
    },
    openProjectDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    loadingList(currentPage: number) {
      this.pageNumber = currentPage
      if (this.$refs.title) {
        ;(this.$refs.title as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }
      this.changeRouteQuery()
      this.showNextProjects()
    },
    changeRouteQuery() {
      this.$router.push({
        query: { PageNumber: this.pageNumber.toString() },
      })
    },
    showNextProjects() {
      apiClient.projects
        .projectsGetPaged({
          Type: this.activeSectionProjects,
          PageSize: 12,
          PageNumber: this.pageNumber,
        })
        .then(({ data }) => {
          this.$store.commit('project/changeProjects', data.items)
        })
        .catch((error) => {})
    },
  },
})
</script>

<style lang="scss">
html {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>

<style lang="scss" scoped>
.projects {
  margin: 30px $margin_page_high_resolution 0 0;

  &__skeleton {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    margin-right: -20px;
    margin-left: -20px;
    &-item {
      flex: 0 0 calc(33.333% - 40px);
      width: calc(33.333% - 40px);
      margin-right: 20px;
      margin-bottom: 40px;
      margin-left: 20px;
    }
  }
  &__inner {
    display: flex;
    flex-direction: column;
    min-height: 770px;
  }
  &__articles {
    margin-top: auto;
  }
  &__custom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 117px;
    cursor: pointer;
    &__text {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 420px;
      text-align: center;
      margin-top: 20px;
      font-weight: 400;
      font-size: 25px;
      line-height: 38px;
      margin-bottom: 20px;
    }
    &__upgrade-to-pro-button {
      height: 48px;
    }
  }
  &__title {
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
  }
  &__pagination {
    margin-top: 30px;
  }
  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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
        svg {
          margin-right: 8px;
          max-width: 10px;
        }
      }
    }
  }
  &__count {
    padding: 8px 16px;
    background: #f3f3f3;
    border-radius: 4px;
    margin-right: 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    &__limit {
      background: $danger;
      color: $white;
      svg {
        color: $white !important;
      }
    }
    &__text {
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      margin-right: 8px;
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
      right: -20px;
      top: 35px;
      z-index: 3;
      width: 200px;
      height: 52px;
    }
    &__text {
      font-weight: 500;
      font-size: 13px;
      display: block;
      margin-top: 3px;
    }
    &:hover {
      .projects__count__question-hover {
        display: block;
      }
      .projects__count__question {
        display: none;
      }
      .projects__link-tip__div {
        display: block;
      }
    }
  }
  &__link-copied {
    position: fixed;
    bottom: 0;
    left: 50%;
    display: table;
    z-index: 500;
    transform: translate(-50%, calc(-63% + -10px));
    &.message_visible {
      transform: translate(-50%, -50%);
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
@media screen and (max-width: 1866px) {
  .projects {
    &__skeleton-item {
      flex: 0 0 calc(33.333% - 20px);
      width: calc(33.333% - 20px);
      margin-right: 10px;
      margin-bottom: 20px;
      margin-left: 10px;
    }
  }
}
@media screen and (max-width: 1620px) {
  .projects {
    &__skeleton-item {
      flex: 0 0 calc(50% - 40px);
      width: calc(50% - 40px);
      margin-right: 20px;
      margin-bottom: 40px;
      margin-left: 20px;
    }
  }
}
@media screen and (max-width: 1440px) {
  .projects {
    margin: 30px $margin_page_desktop 0 0;
  }
}

@media screen and (max-width: 1320px) {
  .projects {
    &__skeleton-item {
      flex: 0 0 calc(50% - 20px);
      width: calc(50% - 20px);
      margin-right: 10px;
      margin-bottom: 20px;
      margin-left: 10px;
    }
  }
}
@media screen and (max-width: 1150px) {
  .projects {
    &__skeleton-item {
      flex: 0 0 calc(100% - 20px);
      width: calc(100% - 20px);
    }
  }
}

@media screen and (max-width: 768px) {
  .projects {
    &__btn {
      display: none;
    }
    &__count {
      margin-right: 0px;
    }
    &__title {
      font-size: 32px;
      line-height: 48px;
    }
  }
}
@media screen and (max-width: 475px) {
  .projects {
    margin: 30px 0px 0 0;
    &__title {
      font-size: 22px;
      line-height: 33px;
    }
  }
}
</style>

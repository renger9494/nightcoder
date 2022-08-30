<template>
  <div class="dashboard">
    <div class="settings">
      <navigation
        :activeSection="activeSection"
        :activeSectionProjects="activeSectionProjects"
        :user="user"
        @showLimitProjectPopup="showLimitProjectPopup"
      />
      <main
        class="settings__content"
        :class="{
          settings__content__project:
            activeSection === SectionType.Projects && !isProject,
        }"
      >
        <pages
          v-if="isProject"
          :activeSectionProjects="activeSectionProjects"
          :showTemplatesCarousel="showTemplatesCarousel"
        />
        <projects
          v-else-if="activeSection === SectionType.Projects"
          :activeSectionProjects="activeSectionProjects"
          :showTemplatesCarousel="showTemplatesCarousel"
        />
        <submissions :user="user" v-else-if="activeSection === SectionType.Submissions" />
        <notifications :user="user" v-else-if="activeSection === SectionType.Notifications" />
        <settings v-else-if="activeSection === SectionType.Settings" />
        <profile v-else-if="activeSection === SectionType.Profile" />
        <help v-else-if="activeSection === SectionType.Help" :is-title-center="false" title="Help and support" />
        <plans
          v-else-if="activeSection === SectionType.Plans"
          :open-modal="openCancelModal"
        />
      </main>
    </div>
    <unsubscribe-modal
      v-if="isCancelModalIsOpen"
      :cancel-modal="cancelModal"
      :close-modal="closeModal"
    />
    <popup v-if="popupSettings.active" />
    <limit-modal
      v-if="visibleModalName === VisibleModalType.Limit"
      :isVisible="visibleModalName === VisibleModalType.Limit"
    />
    <mobile-alert-modal v-if="visibleModalName === VisibleModalType.MobileAlert" />
    <overlay
      :isVisible="
        (visibleModalName && !overlayMessages.includes(visibleModalName)) ||
        popupSettings.active
      "
    />
    <transition name="popup-layer" mode="out-in">
      <div ref="popupButton"></div
    ></transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { VisibleModalType } from '@/store/ui'
import { Context } from '@nuxt/types'
import cookies from '@/utils/cookies'
import Navigation from '@/components/Dashboard/Navigation.vue'
import Pages from '@/components/Dashboard/Pages.vue'
import Plans from '@/components/Dashboard/Plans/Plans.vue'
import Help from '@/components/Dashboard/Help.vue'
import Settings from '@/components/Dashboard/Settings.vue'
import Projects from '@/components/Dashboard/Projects.vue'
import Popup from '@/components/Modal/Popup.vue'
import Overlay from '@/components/Shared/Overlay.vue'
import ProjectsList from '@/components/Projects/ProjectsList.vue'
import Profile from '@/components/Settings/Profile/Profile.vue'
import Submissions from '@/components/Dashboard/Submissions/Submissions.vue';
import Notifications from '@/components/Dashboard/Notifications/Notifications.vue';
//Modals
import LimitModal from '@/components/Shared/LimitModal.vue'
import SiteSettings from '@/components/Shared/SiteSettings/SiteSettings.vue'
import Message from '@/components/Shared/SiteSettings/Message.vue'

import UnsubscribeModal from '@/components/Settings/UnsubscribeModal.vue'
import MobileAlertModal from '@/components/Shared/MobileAlertModal.vue'
import { AccountDto, BaseProjectDto, ProjectFilterType } from '@/utils/api'
import { getShowTemplatesCarousel } from '@/utils/converter'
import {
  PopupSettings,
  PopupType,
  BasePopupData,
} from '@/components/Modal/types'

enum SectionType {
  Projects = 'projects',
  Submissions = 'submissions',
  Plans = 'plans',
  Settings = 'settings',
  Help = 'help',
  Profile = 'profile',
  Notifications = 'notifications',
}

export default Vue.extend({
  layout: 'profile',
  head() {
    return {
      title: 'Dashboard',
    }
  },
  middleware: ['auth'],
  components: {
    MobileAlertModal,
    Notifications,
    Submissions,
    Navigation,
    Help,
    Plans,
    Settings,
    Projects,
    UnsubscribeModal,
    ProjectsList,
    Overlay,
    SiteSettings,
    LimitModal,
    Message,
    Profile,
    Popup,
    Pages,
  },
  asyncData({ route, req }: Context) {
    try {
      const routePathParts = route.path.split('/')
      let showTemplatesCarousel
      if (process.server) {
        showTemplatesCarousel = getShowTemplatesCarousel(req)
      }
      if (process.client) {
        showTemplatesCarousel = !cookies.getItem('templates-carousel')
      }
      let activeSection = SectionType.Projects
      let activeSectionProjects = ProjectFilterType.All
      let isProject = false
      if (routePathParts.length > 2) {
        const routePathPart = routePathParts[2]
        if (routePathPart == SectionType.Plans)
          activeSection = SectionType.Plans
        if (routePathPart == SectionType.Help) activeSection = SectionType.Help
        if (routePathPart == SectionType.Settings)
          activeSection = SectionType.Settings

        if (routePathPart == SectionType.Profile)
          activeSection = SectionType.Profile
        if (routePathPart == SectionType.Submissions)
          activeSection = SectionType.Submissions
        if (routePathPart == SectionType.Notifications)
          activeSection = SectionType.Notifications
        if (routePathPart == 'projects') isProject = true
        if (routePathPart == 'community')
          activeSectionProjects = ProjectFilterType.Community
        if (routePathPart == 'custom')
          activeSectionProjects = ProjectFilterType.Custom
        if (routePathPart == 'drafts')
          activeSectionProjects = ProjectFilterType.Drafts
      }

      return {
        activeSectionProjects,
        activeSection,
        isProject,
        showTemplatesCarousel,
      }
    } catch (error) {
      console.log(error)
    }
  },
  data() {
    return {
      isProject: false,
      SectionType,
      ProjectFilterType,
      activeToggleItem: null as any,
      VisibleModalType,
      overlayMessages: ['link-copied', 'page-duplicated', 'project-duplicated'],
      isDropdownOpen: false,
      isCancelModalIsOpen: false,
      activeSection: '' as SectionType,
      activeSectionProjects: '' as ProjectFilterType,
      showTemplatesCarousel: true,
    }
  },

  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      projects: (state: any) => <BaseProjectDto[]>state.projects,
      areProjectsLoading: (state: any) => state.project.areProjectsLoading,
      visibleModalName: (state: any) =>
        <VisibleModalType | null>state.ui.visibleModalName,
      visibleMessageName: (state: any) => state.ui.visibleMessageName,
      popupSettings: (state: any) => state.ui.popupSettings,
    }),
    projectsLimit(): string {
      return this.user.isAdmin
        ? '∞'
        : this.user.plan.features.draftProjects.toString()
    },
    isProjectsLimit(): boolean {
      if (this.user.isAdmin) return false

      return this.projects.length >= this.user.plan.features.draftProjects
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

      dispatch('project/createProject', { isWithBlankPage: true })
    },
    openProjectDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    closeModal() {
      this.isCancelModalIsOpen = false
    },
    openCancelModal() {
      this.isCancelModalIsOpen = true
    },
    cancelModal() {},
    showLimitProjectPopup() {
      const domRect = (<HTMLDivElement>(
        this.$refs['popupButton']
      )).getBoundingClientRect()
      const popupSettings: PopupSettings<BasePopupData> = {
        active: true,
        closeButton: true,
        header: '',
        content: PopupType.LimitProject,
        location: domRect,
        data: {},
      }
      this.$store.commit('ui/SET_POPUP_SETTINGS', popupSettings)
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
html {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>

<style lang="scss" scoped>
.dashboard {
  width: 100%;
  margin: auto;
}

.settings {
  position: relative;
  display: flex;
  align-items: stretch;
  min-height: 650px;
  width: 100%;
  &__content {
    width: 100%;
    padding-right: $margin_page_high_resolution;
    &__project {
      padding-right: 0;
    }
    &_overflow-hidden {
      overflow: hidden;
    }
  }
}
@media screen and (max-width: 1440px) {
  .settings {
    &__content {
      width: calc(100% - 240px);
      padding-right: $margin_page_desktop;
      &__project {
        padding-right: 0;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .settings {
    &__content {
      width: 100%;
      padding: 0 $margin_page_tablet;
      &__project {
        padding-right: 0;
      }
    }
  }
}
@media screen and (max-width: 414px) {
  .dashboard {
    padding: 0px $margin_page_mobile;
  }
  .settings {
    &__content {
      padding: 0;
    }
  }
}
</style>

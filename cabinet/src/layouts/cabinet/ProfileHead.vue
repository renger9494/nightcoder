<template>
  <div class="profile-head">
    <div class="profile-head__col">
      <div class="profile-head__heading">
        <h1 class="profile-head__title">{{ this.$route.name }}</h1>
        <!-- TODO: Дублирование кода v-if-else, нужно сделать через v-for -->
        <ProfilePlan v-if="this.$route.name == 'projects'" />
      </div>
      <ProfileToggle />
    </div>
    <div class="profile-head__col">
      <!-- TODO: Дублирование кода v-if-else, нужно вынести в компонент -->
      <RatioRange
        v-if="this.$route.name == 'projects'"
        :limit="projectsLimit"
        :current="projects.length"
        countName="projects"
      />
      <RatioRange
        v-else-if="this.$route.name == 'project'"
        :limit="pagesLimit"
        :current="projectPages.length"
        countName="pages"
      />

      <!-- <div class="ratio-range" v-if="this.$route.name == 'anotherPage'">
        <div class="ratio-range__titles">
          <a href="#" class="ratio-range__item ratio-range__item_active">
            <div class="ratio-range__label">Email has arrived</div>
            <span>150 emails</span>
          </a>
          <a href="#" class="ratio-range__item">
            <div class="ratio-range__label">Total Email</div>
            <span>500 emails</span>
          </a>
        </div>
        <div class="ratio-range__line">
          <span style="width: 40%"></span>
        </div>
      </div> -->

      <!-- TODO: Дублирование кода v-if-else, нужно вынести в компонент + вынести отсюда логику, так как она зависит от страницы -->
      <div class="add-site-btn" @click="redirectToTemplatesPage" v-if="this.$route.name == 'projects'">
        <PlusSvg />
        <span>New Project</span>
      </div>
      <div class="add-site-btn" @click="openTemplatesModalForPage" v-if="this.$route.name == 'project'">
        <PlusSvg />
        <span>New Page</span>
      </div>
      <div class="add-site-btn" v-if="this.$route.name == 'anotherPage'">
        <PlusSvg />
        <span>New Campaign</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import PlusSvg from '@/components/ProfileHead/Svg/Plus.vue'
import ProfileToggle from '@/components/ProfileHead/ProfileToggle.vue'
import RatioRange from '@/components/ProfileHead/RatioRange.vue'
import ProfilePlan from '@/components/ProfileHead/ProfilePlan.vue'

import { VisibleModalType } from '@/store/ui'
import { AccountDto, BaseProjectPageDto, BaseProjectDto } from '@/utils/api'

export default Vue.extend({
  components: {
    ProfileToggle,
    RatioRange,
    ProfilePlan,
    PlusSvg,
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      projectPages: (state: any) => <BaseProjectPageDto[]>state.project.projectPages,
      projects: (state: any) => <BaseProjectDto[]>state.project.projects,
    }),
    isProjectsLimit(): boolean {
      if (this.user.isAdmin) return false

      return this.projects.length >= this.user.plan.features.draftProjects
    },
    projectsLimit(): string {
      return this.user.isAdmin ? '∞' : this.user.plan.features.draftProjects.toString()
    },
    isPagesLimit(): boolean {
      if (this.user.isAdmin) return false

      return this.projectPages.length >= this.user.plan.features.projectPages
    },
    pagesLimit(): string {
      return this.user.isAdmin ? '∞' : this.user.plan.features.projectPages.toString()
    },
  },
  methods: {
    redirectToTemplatesPage(event: Event) {
      if (event) event.preventDefault()

      if (!this.isProjectsLimit) {
        this.$router.push('/templates')
        return
      }

      this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
    },
    openTemplatesModalForPage(event: Event) {
      if (event) event.preventDefault()

      if (!this.isPagesLimit) {
        this.$router.push('/templates')
        return
      }

      this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
    },
  },
})
</script>

<style lang="scss">
.add-site-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  height: 40px;
  background: #ffffff;
  border: 1px solid #000;
  box-sizing: border-box;
  border-radius: $shape_border_radius;
  padding: 0 24px;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: -0.03em;
  color: #000000;
  cursor: pointer;
  span {
    font-size: inherit;
    font-weight: inherit;
  }
  svg {
    margin-right: 13px;
    max-width: 11px;
  }
  rect {
    fill: #000;
  }
  &:hover {
    background: #000;
    color: #fff;
    box-shadow: 0px 14px 18px rgba(152, 152, 152, 0.25);
    rect,
    path {
      fill: #fff;
    }
  }
}
</style>

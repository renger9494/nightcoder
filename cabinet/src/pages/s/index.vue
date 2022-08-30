<template>
  <div>
    <div class="feedSearch content">
      <p class="feedSearch__header-1">
        {{
          textSearch
            ? textSearch
            : `All ${
                selectedTypeSearch == TypeSearch.Projects ? 'projects' : 'users'
              } from Airtap Community`
        }}
      </p>

      <skeleton
        class="feedSearch__header-2"
        v-if="isLoading"
        max-width="300px"
        height="19"
        width="300px"
        radius="12"
      />
      <p
        v-else-if="selectedTypeSearch == TypeSearch.Projects"
        class="feedSearch__header-2"
      >
        Explore {{ countProjects }} <span>{{ textSearch }}</span> projects from
        independent creators
      </p>
      <p
        v-else-if="selectedTypeSearch == TypeSearch.Users"
        class="feedSearch__header-2"
      >
        Explore {{ countUsers }} <span>{{ textSearch }}</span> independent
        creators
      </p>

      <div class="feedSearch__row">
        <div
          :class="{ feedSearch__filtersBtn__active: isFilters }"
          class="feedSearch__filtersBtn"
          @click="isFilters = !isFilters"
        >
          <svg-icon
            width="16"
            height="16"
            color="black"
            name="settings-switch"
          />
          <span>Filters</span>
        </div>

        <FeedSearch
          @search="search"
          @changeSelectedTypeSearch="changeSelectedTypeSearch"
          :textSearch="textSearch"
          :selectedTypeSearch="selectedTypeSearch"
          :countProjects="countProjects"
          :countUsers="countUsers"
          :isLoading="isLoading"
          :isSearchPage="true"
        />
      </div>
      <FeedFilter
        :selectedActionShow="selectedActionShow"
        :selectedActionSort="selectedActionSort"
        @selectAction="selectAction"
        :isFilterUsers="selectedTypeSearch == TypeSearch.Users"
        v-if="isFilters"
      />
      <div
        v-if="selectedTypeSearch == TypeSearch.Projects"
        class="tagsCarousel"
      >
        <div
          v-if="isButtonsVisible"
          :class="{ tagsCarousel__nav__hidden: !isNavsLeftShown }"
          class="tagsCarousel__nav__arrow tagsCarousel__nav__left"
          @click="showPrevious"
        >
          <svg-icon width="16" height="16" color="#000" name="icon-left" />
        </div>
        <VueSlickCarousel
          v-if="tags && tags.length > 0"
          :dots="false"
          :arrows="false"
          :infinite="false"
          :speed="500"
          :slidesToScroll="1"
          :centerMode="false"
          :variableWidth="true"
          centerPadding="0px"
          :initialSlide="0"
          @beforeChange="beforeChange"
          @init="onSliderInit"
          ref="tagsCarousel"
        >
          <div
            v-for="tag in tags"
            :key="tag.id"
            class="tag"
            @click="search(tag.name || '')"
          >
            {{ tag.name }}
          </div>
        </VueSlickCarousel>
        <div v-if="isLoading" class="projects-skeleton">
          <div
            class="projects-skeleton-item"
            v-for="item in 3"
            :key="`${item}skeleton`"
          >
            <skeleton max-width="100%" height="35" width="150" radius="100" />
          </div>
        </div>
        <div
          v-if="isButtonsVisible"
          :class="{ tagsCarousel__nav__hidden: !isNavsRightShown }"
          class="tagsCarousel__nav__arrow tagsCarousel__nav__right"
          @click="showNext"
        >
          <svg-icon width="16" height="16" color="#000" name="icon-right" />
        </div>
      </div>

      <div
        class="feedSearch__component"
        :class="{
          feedSearch__users:
            selectedTypeSearch == TypeSearch.Users &&
            (!isSearchEmpty || isLoading),
        }"
      >
        <template v-if="selectedTypeSearch == TypeSearch.Projects">
          <div v-if="isLoading" class="projects-skeleton">
            <div
              class="projects-skeleton-item"
              v-for="item in 3"
              :key="`${item}skeleton`"
            >
              <skeleton
                max-width="100%"
                height="269"
                width="100%"
                radius="12"
              />
            </div>
          </div>
          <FeedProjects
            v-else
            :projects="projects"
            @likeProject="likeProject"
          />
        </template>
        <template v-if="selectedTypeSearch == TypeSearch.Users">
          <div v-if="isLoading" class="users-skeleton">
            <div
              class="users-skeleton-item"
              v-for="item in 3"
              :key="`${item}skeleton`"
            >
              <skeleton
                max-width="100%"
                height="269"
                width="100%"
                radius="12"
              />
            </div>
          </div>
          <FeedUsers
            class="feedSearch__users-list"
            v-else
            :users="users"
            @followUser="followUser"
          />
          <div
            class="feedSearch__users-right"
            :class="{ empty: !isLoading && !toFollow.length }"
          >
            <p
              class="feedSearch__users-title"
              v-if="!isLoading && toFollow.length"
            >
              Profiles you might like
            </p>
            <div
              class="feedSearch__users-wrap"
              v-if="!isLoading && toFollow.length"
            >
              <notifications-user-to-follow
                v-for="(user, index) in toFollow"
                :key="index"
                :data="user"
                @followUser="followUser"
              />
            </div>
            <div v-if="isLoading">
              <skeleton
                class="to-follow-skeleton"
                v-for="index in 6"
                :key="index"
                max-width="100%"
                height="37"
                width="100%"
                radius="4"
              />
            </div>
          </div>
        </template>
        <search-empty-state
          v-if="isSearchEmpty && !isLoading"
          :typeSearch="selectedTypeSearch"
        />
      </div>
      <pagination
        v-if="totalPages > 1 && !isSearchEmpty"
        :pageNumber="+filter.PageNumber"
        :totalPages="totalPages"
        @loadingList="loadingList"
      />
    </div>

    <FeedBanner
      v-if="!isSearchEmpty"
      class="feedProjects__card feedProjects__card--last"
      title="Publish your website to get plenty of new clients and followers"
      link-text="Start building - it’s free forever!"
      @onBtnClick="createProject"
    />
    <overlay :isVisible="!!visibleModalName" />
    <mobile-alert-modal
      v-if="visibleModalName === VisibleModalType.MobileAlert"
    />
    <limit-modal
      v-if="visibleModalName === VisibleModalType.Limit"
      :isVisible="visibleModalName === VisibleModalType.Limit"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  FeedProjectDto,
  AccountDto,
  WelcomeProfileDto,
  BaseNameDtoOfInteger,
} from '@/utils/api'
import apiClient from '@/utils/apiClient'
import { VisibleMessageNameType, VisibleModalType } from '@/store/ui'
import Pagination from '@/components/Shared/Pagination.vue'
import FeedFilter from '@/components/Discover/FeedFilter.vue'
import FeedSearch from '@/components/Discover/FeedSearch.vue'
import Overlay from '@/components/Shared/Overlay.vue'
import MobileAlertModal from '@/components/Shared/MobileAlertModal.vue'
import SearchEmptyState from '@/components/Discover/SearchEmprtState.vue'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import FeedBanner from '@/components/Discover/FeedBanner.vue'
import NotificationsUserToFollow from '@/components/Dashboard/Notifications/NotificationsUserToFollow.vue'
import { debounce, cloneDeep as _cloneDeep } from 'lodash'
import Skeleton from '@/components/Shared/ui/skeleton.vue'

export enum ShowActions {
  All = 'All projects',
  Following = 'Following',
}
export enum SortActions {
  MostAppreciated = 'Most appreciated',
  Latest = 'Latest',
}

export enum TypeSearch {
  Projects = 'projects',
  Tags = 'tags',
  Users = 'users',
}
export default Vue.extend({
  layout: 'profile',
  components: {
    SearchEmptyState,
    Pagination,
    FeedFilter,
    FeedSearch,
    Overlay,
    MobileAlertModal,
    VueSlickCarousel,
    FeedBanner,
    NotificationsUserToFollow,
    Skeleton,
  },
  data() {
    return {
      TypeSearch,
      projects: [] as FeedProjectDto[],
      projectsBase: new Map(),
      filter: { PageNumber: 1, PageSize: 24 } as any,
      tags: [] as BaseNameDtoOfInteger[] | undefined,
      users: [] as WelcomeProfileDto[],
      totalPages: 1 as Number,
      VisibleModalType,
      selectedActionShow: ShowActions.All,
      selectedActionSort: SortActions.MostAppreciated,
      textSearch: '',
      isNavsRightShown: true,
      isNavsLeftShown: false,
      isButtonsVisible: false,
      isSliderInit: false,
      countProjects: 0,
      countUsers: 0,
      selectedTypeSearch: TypeSearch.Projects,
      isFilters: false,
      toFollow: [] as WelcomeProfileDto[],
      isLoading: true,
    }
  },
  async asyncData({ route, req, redirect }) {
    try {
      const routePathParts = route.path.split('/')
      let selectedTypeSearch = <TypeSearch>routePathParts[2]
      const { textSearch } = route.params || ''

      let filter: any = {
        Show: 'All',
        SortBy: 'MostAppreciated',
        PageSize: selectedTypeSearch == TypeSearch.Projects ? 24 : 20,
        PageNumber: 1,
        ...route.query,
      }
      if (textSearch) filter.Search = textSearch
      let tags = undefined
      let projects = [] as FeedProjectDto[]
      let users = [] as WelcomeProfileDto[]
      let toFollow = [] as WelcomeProfileDto[]
      let totalPages = 0
      let countProjects = 0
      let countTags = 0
      let countUsers = 0
      let projectsBase = new Map()
      if (process.server) {
        const { cookie } = req.headers
        apiClient.instance.defaults.headers.Cookie = cookie
      }
      if (selectedTypeSearch == TypeSearch.Projects) {
        const { data } = await apiClient.feed.feedGetProjects(filter)
        projects = data.items
        projectsBase = new Map(
          data.items.map((item) => [item.id, item.hasLike])
        )
        totalPages = data.pagination.totalPages
        countProjects = data.pagination.totalRecords
        const { data: projectTags } =
          await apiClient.projectTags.projectTagsGet()
        tags = projectTags
      }
      if (selectedTypeSearch == TypeSearch.Users) {
        const { data } = await apiClient.feed.feedGetUsers({
          PageNumber: filter.PageNumber,
          PageSize: filter.PageSize,
          Search: filter.Search,
          SortBy: filter.SortBy,
        })
        users = data.items
        totalPages = data.pagination.totalPages
        countUsers = data.pagination.totalRecords
        const { data: profiles } = await apiClient.profiles.profilesGetWelcome({
          PageSize: 6,
          PageNumber: 1,
        })
        toFollow = profiles.items
      }
      let selectedActionShow =
        filter.Show == ShowActions.Following
          ? ShowActions.Following
          : ShowActions.All
      let selectedActionSort =
        filter.SortBy == SortActions.Latest
          ? SortActions.Latest
          : SortActions.MostAppreciated
      return {
        projects,
        projectsBase,
        users,
        filter,
        totalPages,
        countProjects,
        countTags,
        countUsers,
        selectedActionShow,
        selectedActionSort,
        tags,
        textSearch,
        selectedTypeSearch,
        toFollow,
        isLoading: false,
      }
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
      visibleMessageName: (state: any) =>
        <VisibleMessageNameType>state.ui.visibleMessageName,
      visibleModalName: (state: any) =>
        <VisibleModalType | null>state.ui.visibleModalName,
    }),
    isProjectsLimit(): boolean {
      if (this.user?.isAdmin) return false
      return (
        this.user.plan.currentProjects >= this.user.plan.features.draftProjects
      )
    },
    isSearchEmpty(): boolean {
      return (
        (this.projects.length === 0 &&
          this.selectedTypeSearch == TypeSearch.Projects) ||
        (this.users.length === 0 && this.selectedTypeSearch == TypeSearch.Users)
      )
    },
  },
  methods: {
    getKeyName(value: any, actions: any) {
      return (
        Object.entries(actions).find(([key, val]) => val === value)?.[0] || null
      )
    },
    changeSelectedTypeSearch(type: TypeSearch) {
      if (this.selectedTypeSearch == type) return
      this.selectedTypeSearch = type
      this.search(this.textSearch)
    },

    selectAction(show: ShowActions | null, sort: SortActions | null) {
      if (show) {
        if (show === this.selectedActionShow) return
        this.selectedActionShow = show
      }
      if (sort) {
        if (sort === this.selectedActionSort)
          return (this.selectedActionSort = sort)
        this.selectedActionSort = sort
      }
      this.changeFilter()
    },
    search(text: string) {
      this.isLoading = true
      this.$router.replace({
        path: `/s/${this.selectedTypeSearch}/${text || ''}`,
      })
    },
    beforeChange(oldSlideIndex: Number, newSlideIndex: Number) {
      if (this.tags)
        this.isNavsRightShown = newSlideIndex < this.tags.length - 1
      this.isNavsLeftShown = newSlideIndex > 0
    },
    showNext() {
      if (this.$refs.tagsCarousel) (this.$refs.tagsCarousel as any).next()
    },
    showPrevious() {
      if (this.$refs.tagsCarousel) (this.$refs.tagsCarousel as any).prev()
    },
    onSliderInit() {
      this.isSliderInit = !this.isSliderInit
    },
    likeProject(project: FeedProjectDto) {
      if (!this.isUserLoggedIn) {
        this.$router.push({
          path: '/login',
          query: { redirectUrl: this.$route.fullPath },
        })
        return
      }

      project.hasLike = !project.hasLike
      project.likes = project.likes + (project.hasLike ? 1 : -1)
      this.toggleProjectLike(project, this.user.userName, this.projectsBase)
    },
    toggleProjectLike: debounce(
      (project: FeedProjectDto, userName: string, projectsBase: any) => {
        if (projectsBase.get(project.id) == project.hasLike) return
        apiClient.profiles
          .profilesToggleProjectLike(project.id, userName)
          .then(() => {
            projectsBase.set(project.id, project.hasLike)
          })
          .catch(() => {
            project.hasLike = !project.hasLike
            project.likes = project.likes + (project.hasLike ? 1 : -1)
          })
      },
      800
    ),
    followUser(user: WelcomeProfileDto) {
      if (!this.isUserLoggedIn) {
        this.$router.push({
          path: '/login',
          query: { redirectUrl: this.$route.fullPath },
        })
        return
      }
      if (user.owned) {
        this.$router.push({
          path: '/settings/profile',
        })
        return
      }
      if (!user.userName) {
        return
      }
      apiClient.profiles
        .profilesToggleProfileFollow(user.userName)
        .then(() => {
          user.followed = !user.followed
        })
        .catch((error) => {})
    },
    changeFilter() {
      this.filter.PageSize =
        this.selectedTypeSearch == TypeSearch.Projects ? 24 : 20
      this.filter.PageNumber = 1
      this.filter.Show = this.getKeyName(this.selectedActionShow, ShowActions)
      this.filter.SortBy = this.getKeyName(this.selectedActionSort, SortActions)

      this.changeRouteQuery()
      if (this.selectedTypeSearch == TypeSearch.Users) this.showUsers()
      else this.showProjects()
    },
    showProjects() {
      this.isLoading = true
      apiClient.feed
        .feedGetProjects(this.filter)
        .then(({ data }) => {
          this.projects = data.items
          this.projectsBase = new Map(
            data.items.map((item) => [item.id, item.hasLike])
          )
          this.totalPages = data.pagination.totalPages
          this.countProjects = data.pagination.totalRecords
          this.isLoading = false
        })
        .catch((error) => {})
    },
    showUsers() {
      this.isLoading = true
      apiClient.feed
        .feedGetUsers({
          PageNumber: this.filter.PageNumber,
          PageSize: this.filter.PageSize,
          Search: this.filter.Search,
          SortBy: this.filter.SortBy,
        })
        .then(({ data }) => {
          this.users = data.items
          this.totalPages = data.pagination.totalPages
          this.countUsers = data.pagination.totalRecords
          this.isLoading = false
        })
        .catch((error) => {})
    },
    loadingList(page: number) {
      this.filter.PageNumber = page
      window.scrollTo(0, 0)
      this.changeRouteQuery()
      if (this.selectedTypeSearch == TypeSearch.Users) this.showUsers()
      else this.showProjects()
    },
    changeRouteQuery() {
      this.isLoading = true
      let filterQuery = {
        PageNumber: this.filter.PageNumber,
      } as any
      if (this.selectedTypeSearch == TypeSearch.Projects) {
        filterQuery.Show = this.filter.Show
        filterQuery.SortBy = this.filter.SortBy
      }
      this.$router.replace({
        query: filterQuery,
      })
    },
    createProject() {
      if (!this.isUserLoggedIn) {
        this.$router.push({
          path: '/login',
          query: { redirectUrl: this.$route.fullPath },
        })
        return
      }
      if (this.isProjectsLimit) {
        this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
        return
      }
      const { dispatch } = this.$store
      if (window.innerWidth < 1200) {
        dispatch('ui/changeVisibleModalName', {
          newVisibleModalName: VisibleModalType.MobileAlert,
        })
        return
      }

      // TODO: get templateId from method or create method for default project creation
      dispatch('project/createProject', { templateId: '31' })
    },
  },
})
</script>

<style lang="scss" scoped>
.content {
  margin: auto;
}
.feedSearch {
  font-family: 'Poppins', sans-serif;
  padding: 30px $margin_page_desktop 0px;
  &__component {
    margin-bottom: 80px;
    margin-top: -1px;
    padding-top: 30px;
  }
  &__row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &__header-1 {
    font-weight: 700;
    font-size: 45px;
    max-width: 850px;
    text-align: center;
    margin: 12px auto 24px;
  }
  &__header-2 {
    font-weight: normal;
    font-weight: 400;
    font-size: 13px;
    margin: 0px auto 40px;
    text-align: center;
    word-break: break-word;
    width: 463px;
    span {
      background: linear-gradient(
        90deg,
        #e64afa 0%,
        #8c38ff 40.1%,
        #3ca1ff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }
  &__users {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 30px;
    &-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, 432px);
      grid-template-rows: repeat(auto-fit, 188px);
      grid-gap: 30px;
      flex: 1;
      padding: 0 4px 0 0;
      margin: 0 -4px 0 0;
    }
    &-right {
      flex: 0 0 300px;
      background: #f3f3f3;
      border-radius: $shape_border_radius * 2;
      padding: 16px;
      position: sticky;
      top: 80px;
    }
    &-title {
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
      font-feature-settings: 'liga' off;
      margin: 0 0 16px;
    }
    @include bp($sm) {
      flex-direction: column;

      &-left {
        order: 2;
        max-height: 100%;
        width: 100%;
      }
      &-right {
        order: 1;
        width: 100%;
        flex: 0 0 100%;
      }
      &-wrap {
        display: flex;
        align-items: center;
        overflow-x: auto;
      }
    }
  }
  &__filtersBtn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    width: 98px;
    height: 37px;
    border: 1px solid #ebebeb;
    margin-right: 16px;
    padding: 8px 16px;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    border-radius: 4px;
    color: #000000;
    cursor: pointer;
    margin-right: 12px;
    span {
      margin-left: 8px;
    }
    svg {
      width: 16px;
    }
    &:hover {
      background: #dadada;
      span {
        color: #000000;
      }
      svg {
        color: #000000 !important;
      }
    }
    &__active {
      background: #000000;
      span {
        color: #ffffff;
      }
      svg {
        color: #ffffff !important;
      }
    }
  }
  &__card {
    margin: 60px 0;
    &--last {
      margin: 60px 0 0;
    }
  }

  &__banner-2 {
    position: relative;
    height: 377px;
    display: grid;
    margin-top: 100px;
    &__background {
      width: 100%;
      height: 100%;
      position: absolute;
      object-fit: cover;
      object-position: center;
    }
    &__content {
      text-align: center;

      z-index: 2;
      width: 584px;
      margin: 80px auto;
      display: grid;
    }
    &__interactive {
      display: flex;
      margin-top: 30px;
      align-items: center;
      justify-content: center;
      span {
        font-size: 13px;
        line-height: 20px;
        color: #333333;
        font-weight: 500;
      }
    }
    &__link {
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      color: #173bef;
      text-decoration: none;
    }
    &__header {
      font-size: 32px;
      line-height: 48px;
      color: #000000;
      max-width: 584px;
      margin: auto;
      margin-bottom: 16px;
    }
    &__text {
      font-size: 13px;
      line-height: 19px;
      color: #333333;
      max-width: 414px;
      margin: auto;
    }
    &__buttom {
      background: #173bef;
      border-radius: 4px;
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      color: #ffffff;
      text-align: center;
      padding: 8px 16px;
      width: fit-content;
      height: fit-content;
      text-decoration: none;
      margin-right: 16px;
    }
  }
}
.tagsCarousel {
  height: 35px;
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  transition: 0.3s;
  margin-top: 30px;
  .tag {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    text-transform: lowercase;
    display: inline-block;
    color: $black;
    margin-right: 10px;
    padding: 11px 15px;
    background: #f3f3f3;
    border-radius: 100px;
    transition: 0.3s;
    cursor: pointer;
    text-decoration: none;
    width: auto !important;
    &::first-letter {
      text-transform: uppercase;
    }

    &:hover {
      background: rgba(243, 243, 243, 0.5);
    }
    &:active {
      color: #ffffff;
      background-color: #000000;
    }
    &_active {
      background-color: #000000 !important;
      color: #ffffff;
      &:hover {
        opacity: 0.8 !important;
      }
    }
  }
  .slick-slide {
    height: 35px;
    margin-right: 10px;
  }
  .slick-slider {
    width: 100%;
  }

  &__nav {
    &__hidden {
      visibility: hidden;
    }
    &__arrow {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-top: 8px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 100%;
      background: #ffffff;
      cursor: pointer;
      position: absolute;
      z-index: 3;
      transition: 0.3s;
      div {
        width: 24px;
        height: 24px;
      }
      &:hover {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.2);
      }
    }
    &__left {
      left: 190px;
    }
    &__right {
      right: -12px;
    }
  }
}
.projects-skeleton {
  display: flex;
  flex-wrap: wrap;
  margin-right: -20px;
  margin-left: -20px;
  &-item {
    flex: 0 0 calc(33.333% - 40px);
    width: calc(33.333% - 40px);
    @media screen and (min-width: 1600px) {
      flex: 0 0 calc(25% - 40px);
      width: calc(25% - 40px);
    }
    margin-right: 20px;
    margin-bottom: 40px;
    margin-left: 20px;
  }
}
.users-skeleton {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  margin-right: -20px;
  margin-left: -20px;
  width: calc(100% - 300px);
  &-item {
    flex: 0 0 calc(50% - 40px);
    width: calc(50% - 40px);
    @media screen and (min-width: 1600px) {
      flex: 0 0 calc(33.333% - 40px);
      width: calc(33.333% - 40px);
    }
    margin-right: 20px;
    margin-bottom: 40px;
    margin-left: 20px;
  }
}
.to-follow-skeleton {
  &:not(:last-child) {
    margin: 0 0 16px;
  }
}
@media screen and (max-width: 768px) {
  .feedProjects {
    padding: 30px $margin_page_tablet 0px;
    &__header-1 {
      margin-top: 30px;
      max-width: fit-content;
    }
    &__header-2 {
      max-width: 487px;
      margin: 30px auto 40px;
    }
  }
}

@media screen and (max-width: 414px) {
  .feedProjects {
    padding: 30px $margin_page_mobile 0px;
    &__header-1 {
      margin-top: 20px;
      font-size: 30px;
      line-height: 45px;
    }
    &__header-2 {
      font-size: 13px;
      line-height: 20px;
      margin-top: 16px;
      margin-bottom: 50px;
    }
    &__filter {
      font-size: 12px;
      line-height: 18px;
      ul {
        li {
          &:first-child {
            margin-right: 15px;
          }
        }
      }
    }
  }
}
</style>

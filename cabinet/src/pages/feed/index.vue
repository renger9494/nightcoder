<template>
  <div>
    <div class="feedProjects content">
      <p class="feedProjects__header-1">
        Discover
        <span class="feedProjects__header-1__gradient">{{
          category ? category.name : 'inspiring'
        }}</span>
        projects from Airtap community
      </p>
      <p class="feedProjects__header-2" v-if="category">
        {{ category.description }}
      </p>

      <div class="feedProjects__row">
        <div
          :class="{ feedSearch__filtersBtn__active: isFilters }"
          class="feedProjects__filtersBtn"
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

        <FeedSearch @search="search" />
      </div>
      <FeedFilter
        :selectedActionShow="selectedActionShow"
        :selectedActionSort="selectedActionSort"
        @selectAction="selectAction"
        v-if="isFilters"
      />
      <FeedFilterCategoriesAndTags
        :categories="categories"
        :category="category"
        :tags="tags"
        @searchByTag="searchByTag"
      />
      <div class="feedProjects__component">
        <FeedProjects :projects="projectsFirst" @likeProject="likeProject" />
        <FeedBanner
          v-if="!isFollowersEmpty && projectsLast.length"
          class="feedProjects__card"
          :is-image="true"
          :is-reversed="true"
          title="Make a tap to become a creator"
          link-text="Start creating"
          @onBtnClick="createProject"
        />
        <FeedProjects
          v-if="projectsLast.length"
          :projects="projectsLast"
          @likeProject="likeProject"
        />
        <pagination
          v-if="totalPages > 1"
          :pageNumber="+filter.PageNumber"
          :totalPages="totalPages"
          @loadingList="loadingList"
        />
        <feed-empty-state v-if="isFollowersEmpty" />
      </div>
    </div>
    <FeedBanner
      v-if="!isFollowersEmpty"
      class="feedProjects__card feedProjects__card--last"
      title="Publish your website to get plenty of new clients and followers"
      link-text="Start building - it’s free forever!"
      @onBtnClick="createProject"
    />
    <mobile-alert-modal
      v-if="visibleModalName === VisibleModalType.MobileAlert"
    />
    <limit-modal
      v-if="visibleModalName === VisibleModalType.Limit"
      :isVisible="visibleModalName === VisibleModalType.Limit"
    />
    <overlay :isVisible="isShowAllCategories || !!visibleModalName" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  FeedProjectDto,
  AccountDto,
  ProjectTagDto,
  ProjectCategoriesDto,
  ProjectCategoryDto,
} from '@/utils/api'
import apiClient from '@/utils/apiClient'
import { VisibleMessageNameType, VisibleModalType } from '@/store/ui'
import Pagination from '@/components/Shared/Pagination.vue'
import FeedFilterCategoriesAndTags from '@/components/Discover/FeedFilterCategoriesAndTags.vue'
import FeedFilter from '@/components/Discover/FeedFilter.vue'
import FeedSearch from '@/components/Discover/FeedSearch.vue'
import Overlay from '@/components/Shared/Overlay.vue'
import MobileAlertModal from '@/components/Shared/MobileAlertModal.vue'
import FeedBanner from '@/components/Discover/FeedBanner.vue'
import FeedEmptyState from '@/components/Discover/FeedEmprtState.vue'
import { debounce, cloneDeep as _cloneDeep } from 'lodash'

type ProjectTag = ProjectTagDto & { isActive: boolean }
export enum ShowActions {
  All = 'All projects',
  Following = 'Following',
}
export enum SortActions {
  MostAppreciated = 'Most appreciated',
  Latest = 'Latest',
}
export default Vue.extend({
  layout: 'profile',
  components: {
    FeedEmptyState,
    FeedBanner,
    Pagination,
    FeedFilterCategoriesAndTags,
    FeedFilter,
    FeedSearch,
    Overlay,
    MobileAlertModal,
  },
  data() {
    return {
      projectsFirst: [] as FeedProjectDto[],
      projectsLast: [] as FeedProjectDto[],
      projectsBase: new Map(),
      filter: { PageNumber: 1, PageSize: 24 } as any,
      tags: [] as ProjectTag[] | undefined,
      categories: [] as ProjectCategoriesDto[],
      category: {} as ProjectCategoryDto | null,
      totalPages: 1 as Number,
      VisibleModalType,
      selectedActionShow: ShowActions.All,
      selectedActionSort: SortActions.MostAppreciated,
      isFilters: false,
    }
  },
  async asyncData({ route, req, redirect }) {
    try {
      let filter: any = {
        Show: 'All',
        SortBy: 'MostAppreciated',
        PageSize: 24,
        PageNumber: 1,
        ...route.query,
      }
      const categoryName = route.params.categoryName
        ? route.params.categoryName.replace(/-/g, ' ')
        : null
      if (!route.query.PageNumber || !route.query.SortBy || !route.query.Show) {
        const filterQuery = {
          PageNumber: '1',
          Show: 'All',
          SortBy: 'MostAppreciated',
        }
        filter = { ...filter, ...filterQuery }
        if (!categoryName) {
          redirect({ name: 'feed', query: filterQuery })
          return
        }

        redirect({
          name: 'discover-filter',
          path: `/feed/${route.params.categoryName}`,
          params: { categoryName: route.params.categoryName },
          query: filterQuery,
        })
        return
      }

      if (process.server) {
        const { cookie } = req.headers
        apiClient.instance.defaults.headers.Cookie = cookie
      }
      //categories
      const { data: categories } =
        await apiClient.projectCategories.projectCategoriesGet()
      let projectsCount = categories.reduce(function (sum, item) {
        return sum + item.projectsCount
      }, 0)
      categories.unshift({
        name: '🔍 All',
        id: 0,
        projectsCount: projectsCount,
        description: 'All projects in all categories',
      })
      let category = null
      let tags = undefined
      const selectedTag = route.query.TagId ? +route.query.TagId : null
      //category
      if (categoryName) {
        const { data: categoryDto } =
          await apiClient.projectCategories.projectCategoriesGetByName({
            Name: categoryName,
          })
        filter.ProjectCategoryId = categoryDto.id
        category = categoryDto
        //tags
        if (category.tags)
          tags = category.tags.map((tc) => {
            ;(<ProjectTag>tc).isActive = tc.id == selectedTag
            return <ProjectTag>tc
          })
        if (selectedTag) filter.TagId = selectedTag
      }

      const { data } = await apiClient.feed.feedGetProjects(filter)
      let selectedActionShow =
        filter.Show == ShowActions.Following
          ? ShowActions.Following
          : ShowActions.All
      let selectedActionSort =
        filter.SortBy == SortActions.Latest
          ? SortActions.Latest
          : SortActions.MostAppreciated

      const projectsBase = new Map(
        data.items.map((item) => [item.id, item.hasLike])
      )
      return {
        projectsFirst: data.items.slice(0, 12),
        projectsLast: data.items.slice(12, 24),
        projectsBase,
        filter,
        totalPages: data.pagination.totalPages,
        selectedActionShow,
        selectedActionSort,
        categories,
        category,
        tags,
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
      isShowAllCategories: (state: any) => state.ui.isAllCategories,
      visibleModalName: (state: any) =>
        <VisibleModalType | null>state.ui.visibleModalName,
    }),
    isProjectsLimit(): boolean {
      if (this.user?.isAdmin) return false
      return (
        this.user.plan.currentProjects >= this.user.plan.features.draftProjects
      )
    },
    isFollowersEmpty(): boolean {
      return this.projectsFirst.length === 0 && this.projectsLast.length === 0
    },
  },
  methods: {
    getKeyName(value: any, actions: any) {
      return (
        Object.entries(actions).find(([key, val]) => val === value)?.[0] || null
      )
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
      this.$router.push({
        path: `/s/projects/${text}`,
      })
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
    searchByTag(tag: ProjectTag) {
      if (!tag.isActive) this.filter.TagId = tag.id
      else delete this.filter.TagId

      if (this.tags) {
        this.tags.forEach((item) => {
          item.isActive = item.id === tag.id && !item.isActive
        })
      }

      this.changeFilter()
    },
    changeFilter() {
      this.filter.PageSize = 24
      this.filter.PageNumber = 1
      this.filter.Show = this.getKeyName(this.selectedActionShow, ShowActions)
      this.filter.SortBy = this.getKeyName(this.selectedActionSort, SortActions)

      this.changeRouteQuery()
      this.showProjects()
    },
    showProjects() {
      apiClient.feed
        .feedGetProjects(this.filter)
        .then(({ data }) => {
          this.projectsFirst = data.items.slice(0, 12)
          this.projectsLast = data.items.slice(12, 24)
          this.projectsBase = new Map(
            data.items.map((item) => [item.id, item.hasLike])
          )
          this.totalPages = data.pagination.totalPages
        })
        .catch((error) => {})
    },
    loadingList(page: number) {
      this.filter.PageNumber = page
      window.scrollTo(0, 0)
      this.changeRouteQuery()
      this.showProjects()
    },
    changeRouteQuery() {
      let filterQuery = {
        PageNumber: this.filter.PageNumber,
        Show: this.filter.Show,
        SortBy: this.filter.SortBy,
      } as any
      if (this.filter.TagId) filterQuery.TagId = this.filter.TagId
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
.feedProjects {
  font-family: 'Poppins', sans-serif;
  padding: 30px $margin_page_desktop 0px;
  &__component {
    margin-bottom: 20px;
    margin-top: -1px;
    padding-top: 30px;
  }
  &__row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
  &__header-1 {
    font-weight: 700;
    font-size: 45px;
    max-width: 850px;
    text-align: center;
    margin: 30px auto 0;
    &__gradient {
      background: linear-gradient(
        90deg,
        #e64afa 0%,
        #8c38ff 40.1%,
        #3ca1ff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
      text-fill-color: transparent;
    }
  }
  &__header-2 {
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    margin: 5px auto 20px;
    text-align: center;
    word-break: break-word;
    a {
      transition: 0.3s;
      text-decoration: none;
      outline: none;
      color: #173bef;
      border-bottom: 1px solid transparent;
      &:hover {
        border-bottom: 1px solid #173bef;
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

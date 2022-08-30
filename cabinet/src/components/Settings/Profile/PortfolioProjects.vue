<template v-if="isUserProjects">
  <div class="publicProfile">
    <div class="publicProfile__empty" v-if="!isUserProjects">
      <div>You haven't created any pages yet</div>
      <a href="/dashboard" class="publicProfile__empty__button">
        <svg-icon
          class="publicProfile__empty__button__icon"
          width="12"
          height="12"
          name="plus"
          color="#fff"
        />
        Create project
      </a>
      <EmptyIcon />
    </div>
    <div v-else-if="userProjects.length == 0">
      <div class="publicProfile__skeleton">
        <div
          class="publicProfile__skeleton-item"
          v-for="item in 2"
          :key="`${item}skeleton`"
        >
          <skeleton
            max-width="100%"
            height="429"
            width="100%"
            radius="16"
            style="margin-bottom: 15px"
          />
          <skeleton max-width="100%" height="25" width="100%" radius="16" />
        </div>
      </div>
    </div>
    <!--    <ul v-else class="publicProfile__setting">-->
    <!--      <li-->
    <!--        @click="showProjectsByFilter(OwnedProjectFilterType.All)"-->
    <!--        :class="{-->
    <!--          publicProfile__setting__active:-->
    <!--            filterProject == OwnedProjectFilterType.All,-->
    <!--        }"-->
    <!--      >-->
    <!--        All: {{ allProjects }}-->
    <!--      </li>-->
    <!--      <li-->
    <!--        @click="showProjectsByFilter(OwnedProjectFilterType.Published)"-->
    <!--        :class="{-->
    <!--          publicProfile__setting__active:-->
    <!--            filterProject == OwnedProjectFilterType.Published,-->
    <!--        }"-->
    <!--      >-->
    <!--        Feed: {{ publishedProjects }}-->
    <!--      </li>-->
    <!--      <li-->
    <!--        @click="showProjectsByFilter(OwnedProjectFilterType.Drafts)"-->
    <!--        :class="{-->
    <!--          publicProfile__setting__active:-->
    <!--            filterProject == OwnedProjectFilterType.Drafts,-->
    <!--        }"-->
    <!--      >-->
    <!--        Drafts: {{ draftsProjects }}-->
    <!--      </li>-->
    <!--    </ul>-->
    <ul class="publicProfile__userProjects">
      <li
        class="publicProfile__userProject"
        v-for="project in userProjects"
        :key="project.id"
      >
        <a :href="project.url" class="publicProfile__linkProject">
          <PreviewProject
            @likeProject="likeProject"
            :project="project"
            :isOwned="true"
          />
        </a>
        <div class="publicProfile__projectDescription">
          <ChangedNameProject :project="project" />

          <div class="publicProfile__likeAndView">
            <div>
              <button @click="likeProject(project)">
                <svg-icon
                  class="publicProfile__likeAndView__iconLike"
                  width="12"
                  height="11"
                  :color="project.hasLike ? '#F46363' : '#dbdbdb'"
                  :name="project.hasLike ? 'likeProject' : 'like'"
                />
                <svg-icon
                  class="publicProfile__likeAndView__iconHoverLike"
                  width="12"
                  height="11"
                  color="#F46363"
                  name="likeProject"
                />
              </button>
              <span>{{ project.likes }}</span>
            </div>

            <div :style="{ 'margin-left': '10px' }">
              <svg-icon
                class="publicProfile__likeAndView__iconView"
                width="12"
                height="11"
                color="#dbdbdb"
                name="view"
              />

              <span>{{ project.views }}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <pagination
      v-if="totalPages > 1"
      :pageNumber="pageNumber"
      :totalPages="totalPages"
      @loadingList="loadingList"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProfileProjectDto } from '@/utils/api'
import ChangedNameProject from '@/components/Settings/Profile/ChangedNameProject.vue'
import PreviewProject from '@/components/Settings/Profile/PreviewProject.vue'
import EmptyIcon from '@/assets/icons/empty.svg?inline'
import apiClient from '@/utils/apiClient'
import Skeleton from '@/components/Shared/ui/skeleton.vue'

enum OwnedProjectFilterType {
  All = 'All',
  Published = 'Published',
  Drafts = 'Drafts',
}

export default Vue.extend({
  components: {
    Skeleton,
    PreviewProject,
    ChangedNameProject,
    EmptyIcon,
  },
  data() {
    return {
      userProjects: [] as ProfileProjectDto[],
      projectsBase: new Map(),
      filterProject: OwnedProjectFilterType.All,
      isProjects: false,
      allProjects: 0,
      publishedProjects: 0,
      draftsProjects: 0,
      OwnedProjectFilterType,
      pageNumber: 1,
      totalPages: 1,
      isUserProjects: true,
      isLoading: true,
    }
  },
  props: {
    userAlias: {
      type: String,
      default: '',
    },
  },
  async mounted() {
    try {
      let filter: any = {
        Type: 'All',
        PageSize: 12,
        PageNumber: 1,
        ...this.$route.query,
      }
      let filterProject = filter.Type
      const { data: projects } =
        await apiClient.profiles.profilesGetOwnedProjects({
          Type: filterProject,
          PageSize: 12,
        })
      this.projectsBase = new Map(
        projects.items.map((item) => [item.id, item.hasLike])
      )
      this.userProjects = projects.items
      this.isUserProjects = projects.items.length > 0
      this.pageNumber = projects.pagination.pageNumber
      this.totalPages = projects.pagination.totalPages
      this.allProjects = projects.all
      this.publishedProjects = projects.published
      this.draftsProjects = projects.drafts
      this.filterProject = filterProject
      this.isLoading = false
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    queryPageNumber(): number {
      return this.$route.query?.PageNumber ? +this.$route.query?.PageNumber : 1
    },
  },
  watch: {
    queryPageNumber(val: number) {
      this.pageNumber = val
      this.loadingProjects()
    },
  },
  methods: {
    likeProject(project: ProfileProjectDto) {
      this.$emit('likeProject', project, this.projectsBase)
    },
    showProjectsByFilter(filter: OwnedProjectFilterType) {
      if (!this.userAlias) {
        return
      }
      this.pageNumber = 1
      this.filterProject = filter
      this.changeRouteQuery()
      this.loadingProjects()
    },
    loadingList(page: number) {
      this.pageNumber = page
      this.changeRouteQuery()
    },
    loadingProjects() {
      apiClient.profiles
        .profilesGetOwnedProjects({
          PageNumber: this.pageNumber,
          Type: this.filterProject,
          PageSize: 12,
        })
        .then(({ data }) => {
          this.projectsBase = new Map(
            data.items.map((item) => [item.id, item.hasLike])
          )
          this.userProjects = data.items
          this.allProjects = data.all
          this.publishedProjects = data.published
          this.draftsProjects = data.drafts
          this.totalPages = data.pagination.totalPages
        })
        .catch((error) => {})
    },
    changeRouteQuery() {
      this.$router.push({ query: { PageNumber: `${this.pageNumber}` } })
    },
  },
})
</script>

<style lang="scss">
.publicProfile {
  font-family: 'Poppins', sans-serif;
  &__empty {
    margin-top: 50px;
    font-size: 25px;
    line-height: 38px;
    text-align: center;
    color: #000000;
    div {
      max-width: 437px;
      margin: auto;
    }
    &__button {
      margin: 24px auto 58px auto;
      text-align: center;
      padding: 8px 16px;
      font-weight: 500;
      background: #000000;
      border-radius: 4px;
      color: #ffffff;
      font-size: 13px;
      line-height: 20px;
      display: flex;
      align-items: center;
      text-decoration: none;
      outline: none;
      width: fit-content;
      &__icon {
        margin-right: 8px;
      }
    }
  }
  &__setting {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px;
    width: fit-content;
    height: 40px;
    background: #f3f3f3;
    border-radius: 4px;
    margin: 20px $margin_page_high_resolution * 2;

    font-size: 13px;
    line-height: 16px;
    color: #000000;

    li {
      padding: 7px 16px;
      cursor: pointer;
      font-weight: 500;
    }
    &__active {
      background: #000000;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      color: #ffffff;
    }
  }
  &__userProjects {
    margin: 30px $margin_page_high_resolution * 2 - 15;
    display: flex;
    flex-wrap: wrap;
  }
  &__userProject {
    flex: 0 0 calc(33.333% - 30px);
    width: calc(33.333% - 30px);
    margin-right: 15px;
    margin-bottom: 30px;
    margin-left: 15px;
  }
  &__linkProject {
    &:hover
      ~ .publicProfile__projectDescription
      > .projectName
      > .projectName__name {
      color: #173bef;
      border-bottom: 1px solid #173bef;
    }
  }
  &__projectEditName {
    width: 16px;
    height: 16px;
    background: #ffffff;
    cursor: pointer;
  }
  &__projectDescription {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    color: $black;
    font-size: 16px;
    margin-left: 0px;
    line-height: 24px;
    margin-top: 15px;
    margin-bottom: 30px;
    justify-content: space-between;
    a {
      text-decoration: none;
      outline: none;
      color: $black;
    }

    img {
      width: 12px;
      height: 11px;
    }
  }
  &__likeAndView {
    font-size: 10px;
    align-items: center;
    display: flex;
    div {
      margin-left: 10px;
      align-items: center;
      display: flex;
    }
    button {
      width: 12px;
      height: 13px;
      background: #ffffff;
      cursor: pointer;
      margin-right: 3px;
      position: relative;
      transition: 0.3s;
      &:hover {
        .publicProfile__likeAndView__iconHoverLike {
          opacity: 0.5;
        }
        .publicProfile__likeAndView__iconLike {
          opacity: 0;
        }
      }
    }
    span {
      line-height: 0px;
    }
    &__iconView {
      margin-right: 3px;
    }
    &__iconHoverLike {
      opacity: 0;
    }
    &__iconLike {
      opacity: 1;
    }
    &__iconLike,
    &__iconHoverLike {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
  }
  &__skeleton-switch {
    margin: 20px $margin_page_high_resolution * 2;
  }
  &__skeleton {
    margin: 30px $margin_page_high_resolution * 2 - 15;

    &-item {
      flex: 0 0 calc(33.333% - 30px);
      width: calc(33.333% - 30px);
      margin-right: 15px;
      margin-bottom: 30px;
      margin-left: 15px;
    }
  }
}
@media screen and (max-width: 1728px) {
  .publicProfile {
    &__userProjects {
      margin: 30px $margin_page_high_resolution * 2 - 10;
    }
    &__userProject {
      flex: 0 0 calc(33.333% - 20px);
      width: calc(33.333% - 20px);
      margin-right: 10px;
      margin-bottom: 20px;
      margin-left: 10px;
    }
    &__skeleton {
      margin: 30px 10px;

      &-item {
        flex: 0 0 calc(33.333% - 20px);
        width: calc(33.333% - 20px);
        margin-right: 10px;
        margin-bottom: 20px;
        margin-left: 10px;
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .publicProfile {
    &__setting {
      margin: 20px 70px;
    }
    &__userProjects {
      margin: 30px 50px;
    }
    &__userProject {
      flex: 0 0 calc(50% - 40px);
      width: calc(50% - 40px);
      margin-right: 20px;
      margin-bottom: 40px;
      margin-left: 20px;
    }
    &__skeleton {
      margin: 30px 50px;

      &-item {
        flex: 0 0 calc(50% - 40px);
        width: calc(50% - 40px);
        margin-right: 20px;
        margin-bottom: 40px;
        margin-left: 20px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .publicProfile {
    &__empty {
      font-size: 22px;
      line-height: 38px;
      div {
        max-width: 384px;
      }
    }
    &__setting {
      margin: 16px $margin_page_tablet 30px;
      font-size: 12px;
      line-height: 15px;
    }
    &__userProjects {
      margin: 30px 10px;
    }
    &__userProject {
      grid-gap: 20px;
      flex: 0 0 calc(50% - 20px);
      width: calc(50% - 20px);
      margin-right: 10px;
      margin-bottom: 20px;
      margin-left: 10px;
    }
    &__projectEditName {
      width: 10px;
      height: 10px;
    }
    &__projectDescription {
      font-size: 14px;
      line-height: 21px;
    }
    &__likeAndView {
      font-size: 10px;
      span {
        margin-left: 3px;
        //line-height: 18px;
      }
    }
    &__skeleton {
      margin: 30px 10px;

      &-item {
        flex: 0 0 calc(50% - 20px);
        width: calc(50% - 20px);
        margin-right: 10px;
        margin-bottom: 20px;
        margin-left: 10px;
      }
    }
  }
}

@media screen and (max-width: 414px) {
  .publicProfile {
    &__empty {
      margin-top: 30px;
      font-size: 18px;
      line-height: 27px;
      div {
        max-width: 315px;
      }
      &__button {
        margin: 24px auto 48px auto;
        font-size: 12px;
        line-height: 18px;
      }
    }

    &__setting {
      font-size: 12px;
      justify-content: space-between;
      width: auto;
      margin: 16px $margin_page_mobile 30px;
      display: none;
    }
    &__userProjects {
      margin: 30px $margin_page_mobile;
    }
    &__userProject {
      flex: 0 0 100%;
      width: 100%;
      margin: 0 0 20px;
    }
    &__skeleton {
      margin: 30px $margin_page_mobile;

      &-item {
        flex: 0 0 100%;
        width: 100%;

        margin-bottom: 20px;
      }
    }
  }
}
</style>

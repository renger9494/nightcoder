<template>
  <div>
    <template v-if="!isLoading">
      <div class="userProfile__empty" v-if="!isUserProjects">
        <div>{{ userFullName }} doesn't have any pages yet</div>
        <EmptyIcon />
      </div>
      <ul class="userProfile__userProjects">
        <li
          class="userProfile__userProject"
          v-for="project in userProjects"
          :key="project.id"
        >
          <a :href="project.url" class="userProfile__linkProject">
            <PreviewProject
              @likeProject="likeProject"
              :project="project"
              :isOwned="false"
            />
          </a>

          <div class="userProfile__projectDescription">
            <a class="userProfile__projectName" :href="project.url">{{
              project.name
            }}</a>
            <div class="userProfile__likeAndView">
              <span>
                <button @click="likeProject(project)">
                  <svg-icon
                    class="userProfile__likeAndView__iconLike"
                    width="12"
                    height="11"
                    :color="project.hasLike ? '#F46363' : ''"
                    :name="project.hasLike ? 'likeProject' : 'like'"
                  />
                  <svg-icon
                    class="userProfile__likeAndView__iconHoverLike"
                    width="12"
                    height="11"
                    color="#F46363"
                    name="likeProject"
                  />
                </button>
                {{ project.likes }}</span
              >
              <span>
                <svg-icon
                  class="userProfile__likeAndView__iconView"
                  width="12"
                  height="11"
                  color="#dbdbdb"
                  name="view"
                />
                {{ project.views }}</span
              >
            </div>
          </div>
        </li>
      </ul>
    </template>
    <div v-else class="userProfile__skeleton">
      <div
        class="userProfile__skeleton-item"
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
import PreviewImage from '@/components/Shared/PreviewImage.vue'
import { ProfileProjectDto } from '@/utils/api'
import EmptyIcon from '@/assets/icons/empty.svg?inline'
import apiClient from '@/utils/apiClient'
import Pagination from '@/components/Shared/Pagination.vue'
import Skeleton from '@/components/Shared/ui/skeleton.vue'
import PreviewProject from '@/components/Settings/Profile/PreviewProject.vue'
export default Vue.extend({
  components: {
    Skeleton,
    PreviewImage,
    EmptyIcon,
    Pagination,
    PreviewProject,
  },
  data() {
    return {
      userProjects: [] as ProfileProjectDto[],
      projectsBase: new Map(),
      pageNumber: 1,
      totalPages: 1,
      isUserProjects: true,
      isLoading: true,
      isError: false,
    }
  },
  props: {
    userFullName: {
      type: String,
      default: '',
    },
    userAlias: {
      type: String,
      default: '',
    },
  },
  async mounted() {
    try {
      let filter: any = {
        PageSize: 12,
        PageNumber: 1,
        ...this.$route.query,
      }
      const { data: projects } = await apiClient.profiles.profilesGetProjects(
        this.userAlias,
        filter
      )
      this.projectsBase = new Map(
        projects.items.map((item) => [item.id, item.hasLike])
      )
      this.isUserProjects = projects.items.length > 0
      this.userProjects = projects.items
      this.pageNumber = projects.pagination.pageNumber
      this.totalPages = projects.pagination.totalPages
      this.isLoading = false
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    likeProject(project: ProfileProjectDto) {
      this.$emit('likeProject', project, this.projectsBase)
    },
    loadingList(page: number) {
      this.pageNumber = page
      this.changeRouteQuery()
      this.loadingProjects()
    },
    loadingProjects() {
      apiClient.profiles
        .profilesGetProjects(this.userAlias, {
          PageNumber: this.pageNumber,
          PageSize: 12,
        })
        .then(({ data }) => {
          this.userProjects = data.items
          this.projectsBase = new Map(
            data.items.map((item) => [item.id, item.hasLike])
          )
          this.totalPages = data.pagination.totalPages
        })
        .catch((error) => {})
    },
    changeRouteQuery() {
      this.$router.replace({
        name: 'profiles-user',
        query: {
          PageNumber: this.pageNumber.toString(),
        },
      })
    },
  },
})
</script>

<style lang="scss">
.userProfile {
  &__empty {
    margin-top: 50px;
    font-size: 25px;
    line-height: 38px;
    text-align: center;
    color: #000000;
    div {
      max-width: 437px;
      margin: auto;
      margin-bottom: 50px;
    }
  }
  &__userProjects {
    display: flex;
    flex-wrap: wrap;
    margin: 30px $margin_page_high_resolution * 2 - 15;
  }
  &__userProject {
    flex: 0 0 calc(33.333% - 30px);
    width: calc(33.333% - 30px);
    margin-right: 15px;
    margin-bottom: 30px;
    margin-left: 15px;
  }
  &__projectPreview {
    border-radius: 16px;
    padding: 7% 6% 71.48%;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.4);
      opacity: 0;
      transition: 0.3s;
      border-radius: 16px;
      z-index: 1;
    }

    &:hover {
      &:before {
        opacity: 1;
      }
    }
  }
  &__linkProject {
    &:hover {
      .userProfile__projectLike,
      .userProfile__projectEye {
        opacity: 1;
      }
    }
    &:hover ~ .userProfile__projectDescription > .userProfile__projectName {
      color: #173bef;
      border-bottom: 1px solid #173bef;
      // text-decoration: underline;
    }
  }
  &__previewImg {
    width: 88%;
    height: 86%;
    //height: 320px;
    // aspect-ratio: 3/2;
    object-fit: cover;
    object-position: center;
    //margin: auto;
    border-radius: 16px;
    //-top: 7px;
    background-color: white;
    position: absolute;
    left: 6%;
    top: 7%;
  }
  &__projectLike {
    width: 36px;
    height: 36px;
    background: #ffffff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    right: 5%;
    bottom: 6%;
    position: absolute;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: 0.3s;
    z-index: 2;
    &__hover {
      opacity: 0;
      transition: 0.3s;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
    }
    img {
      width: 18px;
      height: 18px;
      transition: 0.3s;
    }
    &:hover {
      .userProfile__projectLike__hover {
        opacity: 0.5;
      }
      .userProfile__projectLike__image {
        opacity: 0;
      }
    }
  }
  &__projectEye {
    width: 80px;
    height: 80px;
    background: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 80px;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: 0.3s;
    z-index: 2;
    &__icons {
      object-fit: cover;
      object-position: center;
      width: 43px;
      height: 43px;
      position: relative;
    }
    &__white {
      display: none;
    }
    &:hover {
      background: #000000;
      .userProfile__projectEye__black {
        display: none;
      }
      .userProfile__projectEye__white {
        display: block;
      }
    }
  }
  &__projectDescription {
    display: flex;
    flex-direction: row;
    color: $black;
    font-size: 16px;
    line-height: 24px;
    margin-top: 15px;
    justify-content: space-between;
    img {
      width: 12px;
      height: 11px;
    }
  }
  &__projectName {
    text-decoration: none;
    outline: none;
    color: $black;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 60%;
    border-bottom: 1px solid transparent;
    transition: 0.3s;
    &:hover {
      color: #173bef;
      border-bottom: 1px solid #173bef;
    }
  }

  &__likeAndView {
    font-size: 12px;
    align-items: center;
    display: flex;
    span {
      margin-left: 10px;
      align-items: center;
      display: flex;
    }
    button {
      width: 12px;
      height: 13px;
      background: #ffffff;
      cursor: pointer;
      margin-right: 2px;
      position: relative;
      transition: 0.3s;
      &:hover {
        .userProfile__likeAndView__iconHoverLike {
          opacity: 0.5;
        }
        .userProfile__likeAndView__iconLike {
          opacity: 0;
        }
      }
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
  .userProfile {
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
  .userProfile {
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
      margin: 30px 20px;

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
  .userProfile {
    &__userProjects {
      margin: 30px 10px;
    }
    &__userProject {
      grid-gap: 20px;
      flex: 0 0 calc(50% - 20px);
      width: calc(50% - 20px);
      margin-right: 10px;
      margin-bottom: 50px;
      margin-left: 10px;
    }
    &__projectLike {
      display: flex;
      opacity: 1;
    }
    &__projectEye {
      width: 60px;
      height: 60px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 60px;
      display: flex;
      opacity: 1;
      &__icons {
        width: 32px;
        height: 32px;
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
  .userProfile {
    &__userProjects {
      margin: 30px $margin_page_mobile;
    }
    &__userProject {
      flex: 0 0 100%;
      width: 100%;
      margin: 0 0 30px;
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

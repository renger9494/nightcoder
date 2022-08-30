<template>
  <div>
    <ul class="feedProjects__list">
      <li
        class="feedProjects__project"
        v-for="project in projects"
        :key="project.id"
      >
        <a :href="project.url" class="feedProjects__linkProject">
          <PreviewProject
            @likeProject="likeProject"
            :project="project"
            :isOwned="false"
          />
        </a>
        <div class="feedProjects__projectDescription">
          <a class="feedProjects__projectName" :href="project.url">{{
            project.name
          }}</a>
          <div class="feedProjects__likeAndView">
            <span>
              <button @click="likeProject(project)">
                <svg-icon
                  class="feedProjects__likeAndView__iconLike"
                  width="12"
                  height="11"
                  :color="project.hasLike ? '#F46363' : '#dbdbdb'"
                  :name="project.hasLike ? 'likeProject' : 'like'"
                />
                <svg-icon
                  class="feedProjects__likeAndView__iconHoverLike"
                  width="12"
                  height="11"
                  color="#F46363"
                  name="likeProject"
                />
              </button>
              {{ project.likes }}</span
            >
            <span :style="{ 'margin-left': '10px' }"
              ><svg-icon
                class="feedProjects__likeAndView__iconView"
                width="12"
                height="11"
                color="#dbdbdb"
                name="view"
              />

              {{ project.views }}</span
            >
          </div>
        </div>
        <div class="feedProjects__user-info">
          <a :href="`/${project.authorUserName}`" class="feedProjects__avatar">
            <picture v-if="project.authorAvatar">
              <source
                v-if="project.authorAvatar.fullPathWebP"
                type="image/webp"
                project
              />
              <source
                v-if="project.authorAvatar.fullPathJp2"
                type="image/jp2"
                :srcset="project.authorAvatar.fullPathJp2.replace(' ', '%20')"
              />
              <img
                v-if="project.authorAvatar.fullPath"
                :src="project.authorAvatar.fullPath"
              />
            </picture>
            <avatar v-else :size="20" :name="avatarName(project.authorName)" />
          </a>
          <p class="feedProjects__userName">
            by
            <a :href="`/${project.authorUserName}`">{{ project.authorName }}</a>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import PreviewImage from '@/components/Shared/PreviewImage.vue'
import { FeedProjectDto } from '@/utils/api'
import EmptyIcon from '@/assets/icons/empty.svg?inline'
import Pagination from '@/components/Shared/Pagination.vue'
import Avatar from '~/components/Header/avatar/Avatar.vue'
import PreviewProject from '@/components/Settings/Profile/PreviewProject.vue'
export default Vue.extend({
  components: {
    Avatar,
    PreviewImage,
    EmptyIcon,
    Pagination,
    PreviewProject,
  },
  props: {
    userFullName: {
      type: String,
      default: '',
    },
    projects: Array as PropType<FeedProjectDto[]>,
  },
  data() {
    return {
      isError: false,
    }
  },
  methods: {
    likeProject(project: FeedProjectDto) {
      //event.preventDefault()
      //event.stopPropagation()
      this.$emit('likeProject', project)
    },
    avatarName(name: string | undefined): string {
      return !!name ? name : 'itmeo'
    },
  },
})
</script>

<style lang="scss" scoped>
.content {
  max-width: 1280px;
  margin: auto;
}
.feedProjects {
  font-family: 'Poppins', sans-serif;
  margin: 30px $margin_page_desktop;
  &__likeAndView {
    display: flex;
    font-size: 12px;
    align-items: center;

    span {
      margin-left: 5px;
      display: flex;
      align-items: center;
    }
    button {
      width: 12px;
      height: 12px;
      background: #ffffff;
      cursor: pointer;
      margin-right: 5px;
      position: relative;
      transition: 0.3s;
      &:hover {
        .feedProjects__likeAndView__iconHoverLike {
          opacity: 0.5;
        }
        .feedProjects__likeAndView__iconLike {
          opacity: 0;
        }
      }
    }
    &__iconView {
      margin-right: 5px;
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

  &__list {
    display: grid;
    grid-template-columns: repeat(3, calc(33.33% - 26px));
    grid-gap: 30px 40px;
    justify-content: space-between;
    @media screen and (min-width: 1600px){
      grid-template-columns: repeat(4, calc(25% - 30px));
    }
  }
  &__projectPreview {
    position: relative;
    border-radius: 16px;
    padding: 7% 6% 71.48%;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      transition: 0.3s;
      opacity: 0;
      background: rgba($black, 0.4);
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
      .feedProjects__projectEye,
      .feedProjects__projectLike {
        opacity: 1;
      }
      & ~ .feedProjects__projectDescription > .feedProjects__projectName {
        color: #173bef;
        border-bottom: 1px solid #173bef;
      }
    }
  }
  &__previewImg {
    width: 88%;
    height: 86%;
    border-radius: 16px;
    object-fit: cover;
    object-position: center;
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
    transition: 0.3s;
    opacity: 0;
    z-index: 2;
    &__hover {
      opacity: 0;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
    img {
      width: 18px;
      height: 18px;
      transition: 0.3s;
    }
    &:hover {
      .feedProjects__projectLike__hover {
        opacity: 0.5;
      }
      .feedProjects__projectLike__image {
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
    transition: 0.3s;
    opacity: 0;
    z-index: 2;
    padding: 18px;
    &__icons {
      object-fit: cover;
      object-position: center;
      width: 43px;
      height: 43px;
      position: relative;
    }
    &__white {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      opacity: 0;
    }
    &:hover {
      background: #000000;
      .feedProjects__projectEye__black {
        opacity: 0;
      }
      .feedProjects__projectEye__white {
        opacity: 1;
      }
    }
  }
  &__projectDescription {
    display: flex;
    flex-direction: row;
    color: $black;
    font-weight: normal;
    font-size: 25px;
    line-height: 37px;
    margin-left: 0px;
    margin-top: 15px;
    justify-content: space-between;
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

  &__user-info {
    margin-top: 8px;
    display: flex;
    flex-direction: row;
  }

  &__avatar {
    width: 20px;
    height: 20px;
    display: inline;
    margin-right: 10px;
    img {
      border-radius: 20px;
      width: 20px;
      height: 20px;
    }
    &:hover ~ .feedProjects__userName > a {
      color: #173bef;
      border-bottom: 1px solid #173bef;
    }
  }

  &__userName {
    font-weight: normal;
    font-size: 13px;
    a {
      transition: 0.3s;
      text-decoration: none;
      outline: none;
      color: #000000;
      border-bottom: 1px solid transparent;
      &:hover {
        color: #173bef;
        border-bottom: 1px solid #173bef;
      }
    }
  }
}
@media screen and (max-width: 1030px) {
  .feedProjects {
    &__list {
      grid-template-columns: repeat(2, calc(50% - 10px));
      grid-gap: 20px;
    }
  }
}

@media screen and (max-width: 768px) {
  .feedProjects {
    margin: 30px $margin_page_tablet;
    &__projectLike {
      display: flex;
      opacity: 1;
    }
    &__projectEye {
      width: 60px;
      height: 60px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 60px;
      display: flex;
      opacity: 1;
      padding: 14px;
      &__icons {
        width: 32px;
        height: 32px;
      }
    }
    &__list {
      grid-gap: 50px 20px;
    }
    &__projectDescription {
      font-size: 22px;
    }

    &__userName {
      font-size: 13px;
    }
    &__likeAndView {
      font-size: 10px;
    }
  }
}

@media screen and (max-width: 660px) {
  .feedProjects {
    margin: 30px $margin_page_mobile;
    &__projectDescription {
      font-size: 18px;
    }
    &__list {
      display: grid;
      grid-template-columns: 100%;
      grid-gap: 30px;
    }
    &__userName {
      font-size: 12px;
    }
    &__likeAndView {
      font-size: 10px;
    }
  }
}
</style>

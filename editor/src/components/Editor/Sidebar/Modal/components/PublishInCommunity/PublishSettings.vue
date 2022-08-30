<template>
  <div class="publishSettings">
    <div class="publishSettings__info">
      <div class="publishSettings__title-name">
        Project Name
        <span>{{ name.length }}/80</span>
      </div>
      <input v-model="name" :maxlength="80" class="publishSettings__project-name" @keyup="changeName($event)" />
      <div class="publishSettings__title-name">Pages</div>
      <selected-pages :pages="pages" :choosedPages="choosedPages" @changedPublished="changedPublished" />
      <div class="publishSettings__title-name">Category</div>
      <categories-filter
        v-if="categories.length"
        :categories="categories"
        :category="category"
        :isSubmitting="isSubmitting"
        @selectedCategory="selectedCategory"
      />
      <skeleton v-if="!categories.length" max-width="100%" height="37" width="100%" radius="4" />
      <div v-if="tags">
        <div class="publishSettings__title-name" :class="{ error: isSubmitting && selectedTagsLength < 3 }">
          Tags (at least 3)
        </div>
        <div class="tags">
          <div
            v-for="(tag, index) in tags"
            :key="index"
            :class="{ tag__active: tag.isActive }"
            class="tag"
            @click="selectedTag(tag, index)"
          >
            {{ tag.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="publishSettings__project">
      <div class="publishSettings__title-name">Project Preview</div>
      <div class="publishSettings__project-wrap">
        <div class="publishSettings__preview">
          <div
            class="publishSettings__preview__poster"
            :style="{
            'background-color': imageLoading
              ? 'transparent'
              : previewImage.path && previewImage.dominantColor
              ? previewImage.dominantColor
              : '#1B53C0',
            border: imageLoading ? '1px solid #EBEBEB' : ''
          }"
          >
            <template v-if="!imageLoading">
              <picture v-if="previewImage.fullPath">
                <source
                  v-if="previewImage.fullPathWebP"
                  type="image/webp"
                  :srcset="previewImage.fullPathWebP.replace(' ', '%20')"
                />
                <source
                  v-if="previewImage.fullPathJp2"
                  type="image/jp2"
                  :srcset="previewImage.fullPathJp2.replace(' ', '%20')"
                />

                <img
                  class="publishSettings__preview__previewImg"
                  v-if="previewImage.fullPath"
                  :src="previewImage.fullPath"
                />
              </picture>

              <img v-else :src="getPlaceholderUrl()" class="publishSettings__preview__previewImg" alt="" />
            </template>
            <loader v-else :size="54" />
          </div>
          <input
            ref="preview-image-input"
            type="file"
            :accept="'image/jpeg,image/png'"
            multiple
            @change="uploadPreview($event)"
          />
          <div class="publishSettings__preview__button">
            <button class="publishSettings__preview__changePreview" @click.prevent="previewimageInput.click()">
              <svg-icon
                class="publishSettings__preview__changePreview__plain"
                width="20"
                height="20"
                color="#000000"
                name="loadingImage"
              />
              <svg-icon
                class="publishSettings__preview__changePreview__hover"
                width="20"
                height="20"
                color="#ffffff"
                name="loadingImage"
              />
            </button>
          </div>
        </div>
        <div class="publishSettings__projectDescription">
          <div class="publishSettings__projectName">{{ projectName }}</div>
          <div class="publishSettings__likeAndView">
          <span>
            <svg-icon
              class="publishSettings__likeAndView__iconLike"
              width="12"
              height="11"
              :color="project.hasLike ? '#F46363' : '#BDBDBD'"
              :name="project.hasLike ? 'likeProject' : 'like'"
            />
            {{ project.likes }}
          </span>
            <span :style="{ 'margin-left': '10px' }"
            ><svg-icon
              class="publishSettings__likeAndView__iconView"
              width="12"
              height="11"
              name="view"
              color="#BDBDBD"
            />

            {{ project.views }}</span
            >
          </div>
        </div>
        <div class="publishSettings__user-info">
          <a :href="`/${user.userName}`" class="publishSettings__avatar">
            <picture v-if="user.avatar">
              <source v-if="user.avatar.fullPathWebP" type="image/webp" project />
              <source
                v-if="user.avatar.fullPathJp2"
                type="image/jp2"
                :srcset="user.avatar.fullPathJp2.replace(' ', '%20')"
              />
              <img v-if="user.avatar.fullPath" :src="user.avatar.fullPath" />
            </picture>
            <avatar v-else :size="20" :name="avatarName(user.userName)" />
          </a>
          <p class="publishSettings__userName">
            by
            <a :href="`/${user.userName}`">{{ user.fullName }}</a>
          </p>
          <div class="publishSettings__userName__label-pro" v-if="user.plan.category == PlanCategory.Pro">
            <span>Pro</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  PagedProjectDto,
  ProjectTagDto,
  ProjectCategoryWithTagsDto,
  AccountDto,
  PlanCategory,
  BaseProjectPageDto
} from '@/utils/api';
import { getPlaceholderUrl } from '@/utils/images';
import HTMLElementEvent from '@/utils/types/HTMLElementEvent';
import Avatar from '@/components/Header/avatar/Avatar.vue';
import CategoriesFilter from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/CategoriesFilter.vue';
import SelectedPages from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/SelectedPages.vue';
import Skeleton from '@/components/Shared/ui/skeleton.vue';
type ProjectTag = ProjectTagDto & { isActive: boolean };
type ProjectPage = BaseProjectPageDto & { numberPage: number | undefined };
interface Preview {
  id: undefined | string;
  file: null | File | Blob;
  fullPath: string | ArrayBuffer | null;
  fullPathWebP: string | null;
  fullPathJp2: string | null;
  dominantColor: undefined | string;
}
export default Vue.extend({
  components: {
    Skeleton,
    Avatar,
    CategoriesFilter,
    SelectedPages
  },
  props: {
    projectName: {
      type: String
    },
    project: {
      type: Object as PropType<PagedProjectDto>
    },
    previewImage: {
      type: Object as PropType<Preview>
    },
    pages: {
      type: Array as PropType<ProjectPage[]>
    },
    categories: {
      type: Array as PropType<ProjectCategoryWithTagsDto[]>,
      required: true
    },
    category: {
      type: Object as PropType<ProjectCategoryWithTagsDto | null>,
      default: null
    },
    tags: {
      type: Array as PropType<ProjectTag[] | undefined>,
      default: undefined
    },
    user: {
      type: Object as PropType<AccountDto>
    },
    choosedPages: {
      type: Number
    },
    imageLoading: {
      type: Boolean
    },
    isSubmitting: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      PlanCategory,
      name: this.projectName
    };
  },
  computed: {
    posterColor(): string {
      const color = this.previewImage?.dominantColor;
      return `background: ${color ? color : '#6168FF'}`;
    },
    previewimageInput(): any {
      return this.$refs['preview-image-input'];
    },
    selectedTagsLength(): number {
      if (!this.tags) return 0;
      return this.tags?.filter(tag => tag.isActive).length;
    }
  },
  methods: {
    getPlaceholderUrl() {
      return getPlaceholderUrl();
    },
    avatarName(name: string | undefined): string {
      return name ? name : 'itmeo';
    },
    changeName(event: any) {
      this.$emit('changeName', event.currentTarget.value);
    },
    selectedTag(tag: ProjectTag, index: number) {
      this.$emit('selectedTag', tag, index);
    },
    selectedCategory(category: ProjectCategoryWithTagsDto, created: boolean) {
      this.$emit('selectedCategory', category, false);
    },
    changedPublished(index: number) {
      this.$emit('changedPublished', index);
    },
    uploadPreview(e: HTMLElementEvent<HTMLInputElement>) {
      e.preventDefault();
      e.stopPropagation();

      if (e.target?.files == null || !e.target.files[0]) return;
      const file = e.target.files[0];

      this.$emit('uploadImage', file);
    }
  }
});
</script>

<style lang="scss" scoped>
.publishSettings {
  min-height: 370px;
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: row;
  column-gap: 20px;
  margin: 0 0 20px;
  &__info {
    width: calc(50% - 10px);
  }
  &__title-name {
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: #949cad;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    &.error {
      color: $danger;
    }
  }
  &__project-name {
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    color: #000000;
    background: #ffffff;
    border: 1px solid #f3f3f3;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
    padding: 9px;
    margin-bottom: 20px;
    -webkit-appearance: none;
    transition: 0.3s;
    &:focus,
    &:hover {
      border: 1px solid #000000;
    }
  }
  &__project {
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(50% - 10px);

    &-wrap {
      padding: 20px 20px 16px;
      background: $gray100;
      height: 380px;
      border-radius: $shape_border_radius;
    }
  }
  &__preview {
    position: relative;
    display: flex;
    width: 100%;
    height: 272px;
    input[type='file'] {
      display: none;
    }
    &:hover {
      &:before {
        opacity: 1;
      }
    }

    &__poster {
      border-radius: 16px;
      overflow: hidden;
      height: 100%;
      width: 100%;
      padding: 15px;
      background: #6168ff;
      position: absolute;
    }
    &__previewImg {
      position: absolute;
      left: 15px;
      top: 15px;
      border-radius: 12px;
      background: $white;
      width: calc(100% - 30px);
      height: calc(100% - 30px);
      z-index: 1;
      object-fit: cover;
      box-shadow: 0 65.3633px 152.514px rgba(0, 0, 0, 0.4);
    }

    &__button {
      display: flex;
      flex-direction: row;
      top: 50%;
      left: 50%;
      margin-right: -50%;
      transform: translate(-50%, -50%);
      position: absolute;
      z-index: 2;
    }

    &__changePreview {
      width: 48px;
      height: 48px;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 24px;
      cursor: pointer;
      display: flex;
      background-color: $white;
      transition: 0.3s;
      position: relative;
      z-index: 2;
      &__hover {
        opacity: 0;
      }
      &__plain,
      &__hover {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
      }
      img {
        transition: 0.3s;
      }
      &:hover {
        background-color: $black;
        .publishSettings__preview__changePreview__hover {
          opacity: 1;
        }
        .publishSettings__preview__changePreview__plain {
          opacity: 0;
        }
      }
    }
  }
  &__projectLike {
    width: 36px;
    height: 36px;
    background: #ffffff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    border-radius: 18px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 8px;
    display: flex;
    transition: 0.3s;
    right: 20px;
    bottom: 20px;
    position: absolute;
    z-index: 2;
  }
  &__likeAndView {
    display: flex;
    font-size: 12px;
    align-items: center;

    span {
      margin-left: 5px;
      display: flex;
      align-items: center;
    }
    &__iconView {
      margin-right: 5px;
    }
    &__iconLike {
      opacity: 1;
      position: relative;
      right: 0;
      top: 0;
      bottom: 0;
      left: 0;
      width: 12px;
      height: 12px;
      margin: auto 5px auto auto;
    }
  }
  &__projectDescription {
    display: flex;
    flex-direction: row;
    color: $black;
    font-weight: normal;
    font-size: 25px;
    line-height: 37px;
    margin-left: 0;
    margin-top: 10px;
    justify-content: space-between;
  }
  &__projectName {
    text-decoration: none;
    outline: none;
    color: $black;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 75%;
    border-bottom: 1px solid transparent;
    transition: 0.3s;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }

  &__user-info {
    margin-top: 4px;
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
    &:hover ~ .publishSettings__userName > a {
      color: #173bef;
      border-bottom: 1px solid #173bef;
    }
  }

  &__userName {
    font-weight: normal;
    font-size: 13px;
    line-height: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 280px;
    a {
      transition: 0.3s;
      text-decoration: none;
      outline: none;
      color: #000000;
      border-bottom: 1px solid transparent;
      font-size: inherit;
      line-height: inherit;
      &:hover {
        color: #173bef;
        border-bottom: 1px solid #173bef;
      }
    }
    &__label-pro {
      position: relative;
      display: inline-flex;
      align-items: center;
      border-radius: $shape_border_radius;
      padding: 4px 8px;
      user-select: none;
      height: 20px;
      background-color: #000000;
      margin: 0 0 0 8px;
      span {
        font-weight: 500;
        font-size: 13px;
        line-height: 20px;
        color: #ffc557;
      }
    }
  }
}
.tags {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20px;
  row-gap: 6px;
  max-height: 128px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
    height: 7px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #bdc2c7;
    height: 30px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track-piece {
    display: none;
  }
}
.tag {
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  text-transform: lowercase;
  height: 37px;
  &::first-letter {
    text-transform: uppercase;
  }
  display: inline-flex;
  align-items: center;
  color: $black;
  margin-right: 6px;
  padding: 0 15px;
  background: #f3f3f3;
  border-radius: 100px;
  transition: 0.3s;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: rgba(243, 243, 243, 0.5);
  }
  &:active {
    color: #ffffff;
    background-color: #000000;
  }
  &__active {
    background-color: #000000 !important;
    color: #ffffff;
    &:hover {
      opacity: 0.8 !important;
    }
  }
}
</style>

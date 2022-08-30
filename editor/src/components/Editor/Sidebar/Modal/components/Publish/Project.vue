<template>
  <div class="project">
    <div class="project__preview">
      <div
        class="project__preview__block"
        :style="{
          'background-color':
            project.previewImage && project.previewImage.dominantColor ? project.previewImage.dominantColor : '#1B53C0'
        }"
      >
        <picture v-if="project.previewImage">
          <source
            v-if="project.previewImage.fullPathWebP"
            type="image/webp"
            :srcset="project.previewImage.fullPathWebP.replace(' ', '%20')"
          />
          <source
            v-if="project.previewImage.fullPathJp2"
            type="image/jp2"
            :srcset="project.previewImage.fullPathJp2.replace(' ', '%20')"
          />

          <img
            class="project__preview__previewImg"
            v-if="project.previewImage.fullPath"
            :src="project.previewImage.fullPath"
          />
        </picture>
        <img v-else :src="getPlaceholderUrl()" class="project__preview__previewImg" alt="" />
      </div>
      <div class="project__preview__button">
        <div class="project__preview__public">
          <svg-icon
            class="project__preview__public__imgBlack"
            width="15"
            height="15"
            color="#000000"
            name="pages-icon"
          />
          <span>{{ choosedPages }} pages</span>
        </div>
      </div>
    </div>

    <div class="project__description">
      <span class="project__name">{{ project.name }}</span>
      <div class="project__likeAndView">
        <div>
          <svg-icon
            class="project__likeAndView__iconLike"
            width="12"
            height="11"
            :color="project.hasLike ? '#F46363' : '#dbdbdb'"
            :name="project.hasLike ? 'likeProject' : 'like'"
          />

          <span> {{ project.likes }}</span>
        </div>
        <div>
          <svg-icon class="project__likeAndView__iconView" width="12" height="11" color="#dbdbdb" name="view" />
          <span>{{ project.views }}</span>
        </div>
      </div>
    </div>
    <div class="project__user-info">
      <div class="project__avatar">
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
      </div>
      <p class="project__userName">
        by
        <span>{{ user.userName }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { PagedProjectDto, AccountDto } from '@/utils/api';
import { getPlaceholderUrl } from '@/utils/images';
import Avatar from '@/components/Header/avatar/Avatar.vue';

export default Vue.extend({
  components: {
    Avatar
  },
  props: {
    project: {
      type: Object as PropType<PagedProjectDto>
    },
    choosedPages: {
      type: Number
    },
    user: {
      type: Object as PropType<AccountDto>
    }
  },
  methods: {
    getPlaceholderUrl() {
      return getPlaceholderUrl();
    },
    avatarName(name: string | undefined): string {
      return name ? name : 'itmeo';
    }
  }
});
</script>

<style lang="scss">
.project {
  position: relative;
  background: #f3f3f3;
  border-radius: 4px;
  width: 100%;
  height: 324px;
  padding: 10px;
  &__preview {
    position: relative;
    width: 360px;
    height: 246px;
    &:before {
      content: '';
      position: absolute;
      width: 360px;
      height: 246px;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.4);
      opacity: 0;
      transition: 0.3s;
      border-radius: 16px;
      z-index: 1;
    }
    &__block {
      border-radius: 16px;
      padding: 14px 16px;
      width: 360px;
      height: 246px;
      position: relative;
    }
    &__button {
      display: flex;
      flex-direction: row;
      right: 20px;
      top: 20px;
      position: absolute;
    }
    &__public {
      align-items: center;
      padding: 8px 11px;
      min-width: fit-content;
      background: #ffffff;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
      border-radius: 100px;
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
      cursor: pointer;
      display: flex;
      opacity: 1;
      transition: 0.3s;
      position: relative;
      z-index: 2;
      &__imgWhite {
        opacity: 0;
        position: absolute;
        left: 16px;
        top: 0;
        bottom: 0;
        margin: auto;
      }
      span {
        margin-left: 8px;
      }
    }

    &__previewImg {
      width: 328px;
      height: 218px;
      object-fit: cover;
      object-position: center;
      border-radius: 16px;
      background-color: white;
      position: absolute;
      right: 16px;
      top: 14px;
    }
  }
  &__description {
    display: flex;
    flex-direction: row;
    color: $black;
    font-size: 16px;
    line-height: 24px;
    margin-top: 10px;
    justify-content: space-between;
    img {
      width: 12px;
      height: 11px;
    }
  }
  &__name {
    text-decoration: none;
    outline: none;
    color: $black;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 60%;
    border-bottom: 1px solid transparent;
    transition: 0.3s;
  }

  &__likeAndView {
    font-size: 12px;
    align-items: center;
    display: flex;
    div {
      margin-left: 10px;
      align-items: center;
      display: flex;
    }
    &__iconView {
      margin-right: 3px;
    }
    &__iconLike {
      margin-right: 3px;
    }
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
  }

  &__userName {
    font-weight: normal;
    font-size: 13px;
    div {
      transition: 0.3s;
      text-decoration: none;
      outline: none;
      color: #000000;
      border-bottom: 1px solid transparent;
    }
  }
}
</style>

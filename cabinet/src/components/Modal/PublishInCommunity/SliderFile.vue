<template>
  <div class="sliderFile">
    <div class="sliderFile__preview">
      <div
        class="sliderFile__preview__poster">
        <div></div>
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
            class="sliderFile__preview__previewImg"
            v-if="previewImage.fullPath"
            :src="previewImage.fullPath"
          />
        </picture>

        <img
          v-else
          :src="getPlaceholderUrl()"
          class="sliderFile__preview__previewImg"
          alt=""
        />
      </div>
    </div>
    <div class="slide">
      <p class="slide__name">{{ project.name }}</p>
      <div class="slide__user-info">
        <a :href="`/${user.userName}`" class="slide__avatar">
          <picture v-if="user.avatar">
            <source
              v-if="user.avatar.fullPathWebP"
              type="image/webp"
              :srcset="user.avatar.fullPathWebP.replace(' ', '%20')"
            />
            <source
              v-if="user.avatar.fullPathJp2"
              type="image/jp2"
              :srcset="user.avatar.fullPathJp2.replace(' ', '%20')"
            />
            <img v-if="user.avatar.fullPath" :src="user.avatar.fullPath" />
          </picture>
          <avatar v-else :size="20" :name="avatarName(user.userName)" />
        </a>
        <span class="slide__userName">
          by
          <a :href="`/${user.userName}`">{{ user.fullName }} </a>
        </span>
      </div>
      <div v-if="isSubscribe" class="slide__button">{{ buttonName }}</div>
      <div class="slide__projectLike">
        <svg-icon
          class="slide__projectLike__image"
          width="18"
          height="18"
          :color="project.hasLike ? '#F46363' : '#BDBDBD'"
          name="likeProject"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { AccountDto, PagedProjectDto } from '@/utils/api'
import { getPlaceholderUrl } from '@/utils/images'
import Avatar from '@/components/Header/avatar/Avatar.vue'

interface Preview {
  id: undefined | string
  file: null | File | Blob
  fullPath: string | ArrayBuffer | null
  fullPathWebP: string | null
  fullPathJp2: string | null
  dominantColor: undefined | string
}

export default Vue.extend({
  components: {
    Avatar
  },
  props: {
    project: {
      type: Object as PropType<PagedProjectDto>,
    },
    user: {
      type: Object as PropType<AccountDto>,
    },
    isSubscribe: {
      type: Boolean,
    },
    buttonName: {
      type: String,
    },
    isFile: {
      type: Boolean,
    },
    previewImage: {
      type: Object as PropType<Preview>,
    },
  },
  methods: {
    getPlaceholderUrl() {
      return getPlaceholderUrl()
    },
    avatarName(name: string | undefined): string {
      return name ? name : 'itmeo';
    }
  }
})
</script>

<style lang="scss" scoped>
.sliderFile {
  position: relative;
  &__preview {
    position: relative;
    display: flex;
    width: 100%;
    height: 294px;

    input[type='file'] {
      display: none;
    }
    &:hover {
      &:before {
        opacity: 1;
      }
    }
    &__overlay {
      visibility: visible;
      z-index: 4;
      width: 100%;
      height: 100%;
      background: #000000;
      opacity: 0.5;
      transition: 0.3s;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    &__poster {
      border-radius: 4px;
      overflow: hidden;
      height: 100%;
      width: 100%;
      position: absolute;
      padding: 20px;
      background: $gray100;
    }
    &__previewImg {
      position: absolute;
      background: $white;
      width: 393px;
      height: 254px;
      z-index: 1;
      object-fit: cover;
      border-radius: 12px;
    }
  }
  &__nav {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    &__disable {
      pointer-events: none;
    }
    &__ellipse {
      display: flex;
      flex-direction: row;
      align-items: center;
      list-style: none;
      li {
        margin-right: 10px;
        :last-child {
          margin-right: 0;
        }
      }
    }
    &__arrow {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 24px;
      height: 24px;
      background: #ffffff;
      border: 1px solid #dadada;
      border-radius: 4px;
      margin: 0 20px;
      div {
        margin-left: 16px;
      }
    }
  }
}
.slide {
  z-index: 4;
  pointer-events: none;
  background: #ffffff;
  border: 1px solid #f3f3f3;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: absolute;
  top: 200px;
  height: 64px;
  margin: 0 30px;
  display: grid;
  grid-template-rows: 50% 50%;
  grid-template-columns: 1fr 115px 36px;
  column-gap: 10px;
  padding: 8px 15px;
  align-items: center;
  width: 373px;
  &__name {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
    text-decoration: unset;
  }
  &__user-info {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    margin-top: 5px;
    display: flex;
    flex-direction: row;
  }
  &__avatar {
    width: 20px;
    height: 20px;
    display: inline;
    margin-right: 0px;
    img {
      border-radius: 20px;
      width: 20px;
      height: 20px;
    }
    &:hover ~ .profileProject__userName > a {
      color: #173bef;
      border-bottom: 1px solid #173bef;
    }
  }

  &__userName {
    font-weight: normal;
    font-size: 13px;
    margin: auto 4px;
    color: #333333;
    white-space: nowrap;
    a {
      font-weight: normal;
      font-size: 13px;
      text-decoration: none;
      outline: none;
      color: #000000;
      max-width: calc(100% - 5px);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      // border-bottom: 1px solid #333333;
      &:hover {
        color: #173bef;
        border-bottom: 1px solid #173bef;
      }
    }
  }
  &__button {
    padding: 8px 16px;
    width: fit-content;
    height: 36px;
    background: #000000;
    border-radius: 1000px;
    grid-column: 2 / 3;
    grid-row: 1 / 3;
    margin-left: auto;
    color: #ffffff;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
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
    display: flex;
    transition: 0.3s;
    position: relative;
    z-index: 2;
    grid-column: 3 / 4;
    grid-row: 1 / 3;
  }
}
</style>

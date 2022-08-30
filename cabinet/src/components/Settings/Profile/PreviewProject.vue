<template>
  <div class="preview">
    <div
      class="preview__block"
      :style="{
        'background-color': imageLoading
          ? 'transparent'
          : project.preview && project.preview.dominantColor && !isError
          ? project.preview.dominantColor
          : '#1B53C0',
        opacity: project.published || !isOwned ? 1 : 0.6,
        border: imageLoading ? '1px solid #EBEBEB' : '',
      }"
    >
      <template v-if="!imageLoading">
        <picture v-if="project.preview && !isError">
          <source
            v-if="project.preview.fullPathWebP"
            type="image/webp"
            :srcset="project.preview.fullPathWebP.replace(' ', '%20')"
          />
          <source
            v-if="project.preview.fullPathJp2"
            type="image/jp2"
            :srcset="project.preview.fullPathJp2.replace(' ', '%20')"
          />

          <img
            class="preview__previewImg"
            v-if="project.preview.fullPath"
            :src="project.preview.fullPath"
            @error="isError = true"
          />
        </picture>
        <img v-else :src="getPlaceholderUrl()" class="preview__previewImg" alt=""
      /></template>
      <loader v-else :size="54" />
    </div>
    <input
      v-if="isOwned"
      ref="preview-image-input"
      type="file"
      :accept="'image/jpeg,image/png'"
      multiple
      @change="uploadPreview($event, project)"
    />
    <div class="preview__projectEye">
      <div class="preview__projectEye__icons">
        <svg-icon
          class="preview__projectEye__black"
          width="100%"
          height="100%"
          color="#000000"
          name="eye"
        />
        <svg-icon
          class="preview__projectEye__white"
          width="100%"
          height="100%"
          color="#ffffff"
          name="eye"
        />
      </div>
    </div>
    <div class="preview__button">
      <button
        v-if="isOwned"
        :class="{ editedProjects__private: project.published }"
        class="preview__public"
        @click="publicProject($event, project)"
      >
        <svg-icon
          class="preview__public__imgBlack"
          width="12"
          height="14"
          color="#000000"
          name="togglePublishedProject"
        />
        <svg-icon
          class="preview__public__imgWhite"
          width="12"
          height="14"
          color="#ffffff"
          name="togglePublishedProject"
        />

        <span v-if="project.published">Move to drafts</span
        ><span v-else>Move to feed</span>
      </button>
      <button
        v-if="isOwned"
        class="preview__changePreview"
        @click.prevent="previewimageInput.click()"
      >
        <svg-icon
          class="preview__changePreview__plain"
          width="13"
          height="13"
          color="#000000"
          name="loadingImage"
        />
        <svg-icon
          class="preview__changePreview__hover"
          width="13"
          height="13"
          color="#ffffff"
          name="loadingImage"
        />
      </button>

      <button
        class="preview__projectLike"
        @click="likeProject($event, project)"
      >
        <svg-icon
          class="preview__projectLike__image"
          width="18"
          height="18"
          :color="project.hasLike ? '#F46363' : '#BDBDBD'"
          name="likeProject"
        />
        <svg-icon
          class="preview__projectLike__hover"
          width="18"
          height="18"
          color="#F46363"
          name="likeProject"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ProfileProjectDto } from '@/utils/api'
import apiClient from '@/utils/apiClient'
import HTMLElementEvent from '@/utils/types/HTMLElementEvent'
import http from '@/utils/http'
import SvgIcon from '@/components/Shared/SvgIcon.vue'
import Loader from '@/components/Shared/ui/loader.vue'
import {getPlaceholderUrl} from '@/utils/images'
export default Vue.extend({
  components: { Loader, SvgIcon },
  props: {
    project: {
      type: Object as PropType<ProfileProjectDto>,
    },
    isOwned: Boolean,
  },
  data() {
    return {
      userName: this.$route.params.alias,
      imageLoading: false,
      isError: false,
    }
  },
  computed: {
    previewimageInput(): any {
      return this.$refs['preview-image-input']
    },
  },
  methods: {
     getPlaceholderUrl(){
      return getPlaceholderUrl()
    },
    likeProject(event: any, project: ProfileProjectDto) {
      event.preventDefault()
      event.stopPropagation()
      this.$emit('likeProject', project)
    },
    publicProject(event: any, project: ProfileProjectDto) {
      event.preventDefault()
      event.stopPropagation()
      apiClient.profiles
        .profilesTogglePublishedProject(this.userName, project.id)
        .then(() => {
          project.published = !project.published
        })
        .catch((error) => {})
    },
    uploadPreview(
      e: HTMLElementEvent<HTMLInputElement>,
      project: ProfileProjectDto
    ) {
      e.preventDefault()
      e.stopPropagation()
      if (e.target?.files == null || !e.target.files[0]) return
      this.imageLoading = true
      const file = e.target.files[0]
      const fd = new FormData()
      fd.append('files', file)
      const url = `/api/files/projects/${project.id}/preview`

      http
        .post(url, fd)
        .then(({ data: images }) => {
          const image = images[0]

          this.project.preview = image
          this.imageLoading = false
          this.$emit('loaded')
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
})
</script>

<style lang="scss" >
.preview {
  font-family: 'Poppins', sans-serif;
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

  &__block {
    border-radius: 16px;
    padding: 7% 6% 71.48%;
  }
  &:hover {
    &:before {
      opacity: 1;
    }
    .preview__projectEye,
    .preview__projectLike,
    .preview__changePreview {
      opacity: 1;
    }
    .projectName__name {
      color: #173bef;
    }
  }

  input[type='file'] {
    display: none;
  }

  &__previewImg {
    width: 88%;
    height: 86%;
    object-fit: cover;
    object-position: center;
    border-radius: 16px;
    background-color: white;
    position: absolute;
    left: 6%;
    top: 7%;
  }
  &__button {
    display: flex;
    flex-direction: row;
    right: 5%;
    bottom: 6%;
    position: absolute;
  }
  &__changePreview {
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    border-radius: 18px;
    cursor: pointer;
    display: flex;
    margin-left: 8px;
    background-color: $white;
    opacity: 0;
    transition: 0.3s;
    position: relative;
    z-index: 2;
    &__hover {
      opacity: 0;
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
      .preview__changePreview__hover {
        opacity: 1;
      }
      .preview__changePreview__plain {
        opacity: 0;
      }
    }
  }
  &__public {
    align-items: center;
    padding: 8px 16px;
    min-width: fit-content;
    background: #ffffff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    font-weight: 500;
    font-size: 13px;
    line-height: 19px;
    cursor: pointer;
    display: flex;
    opacity: 0;
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
    &:hover {
      background-color: $black;
      color: $white;
      .preview__public__imgWhite {
        opacity: 1;
      }
      .preview__public__imgBlack {
        opacity: 0;
      }
    }
    span {
      margin-left: 8px;
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
    opacity: 0;
    transition: 0.3s;
    position: relative;
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
    &:hover {
      .preview__projectLike__hover {
        opacity: 0.5;
      }
      .preview__projectLike__image {
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
      opacity: 0;
      position: absolute;
      right: 0;
      bottom: 0;
      top: 0;
      left: 0;
      margin: auto;
    }
    &:hover {
      background: #000;
      .preview__projectEye__black {
        opacity: 0;
      }
      .preview__projectEye__white {
        opacity: 1;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .preview {
    &__projectLike {
      display: flex;
      opacity: 1;
    }
    &__public {
      display: flex;
      opacity: 0;
    }
    &__changePreview {
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
  }
}
@media screen and (max-width: 375px) {
  .preview {
    &__public {
      font-size: 12px;
    }
  }
}
</style>

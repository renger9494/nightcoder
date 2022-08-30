<template>
  <div class="image-upload" :class="classesImageUpload">
    <input type="file" accept="image/x-png,image/jpeg" hidden="hidden" />
    <div
      class="image-upload__image-wrapper"
      :class="{ 'image-upload__image-wrapper--social': isSocialImage }"
      @click="isDisabled ? false : openUploadDialog()"
      @mouseleave="onMouseLeave"
    >
      <img class="image-upload__image" :style="stylesImg" :src="imageSRC" />
      <div class="image-upload__image-overlay">
        <svg-icon name="upload-cloud-icon" width="20" height="20" color="#828282" />
      </div>
    </div>
    <div class="image-upload__actions">
      <button
        class="image-upload__button image-upload__button_refresh"
        @click="isDisabled ? false : openUploadDialog()"
      >
        <svg-icon name="upload-cloud-icon" width="20" height="20" color="#828282" />
      </button>
      <button
        v-if="!isDefaultImage"
        class="image-upload__button"
        :class="{ disabled: !removeImageById }"
        @click="isDisabled || !removeImageById ? false : removeImage()"
      >
        <svg-icon name="delete" width="15" height="20" color="#828282" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    theme: String,
    isDisabled: Boolean,
    stylesImg: String,
    image: {
      type: Object,
      default: () => ({
        id: '',
        fullPath: '',
        originalFileName: '',
        path: ''
      })
    },
    onChange: Function,
    removeImageById: {
      type: Function,
      required: false
    },
    onClick: {
      type: Function,
      required: true
    },
    onMouseLeave: Function,
    isSocialImage: {
      type: Boolean,
      default: false
    },
    isDefaultImage: {
      type: Boolean,
      default: true
    }
  },
  //TODO: base64, potential memory leak. It's used to upload a social image and a favicon for saving in project settings
  mounted() {
    const fileInput = <HTMLInputElement>this.$el.querySelector('input[type=file]');
    const fileReader = new FileReader();

    fileInput.addEventListener('change', () => {
      if (!fileInput || !fileInput.files) return;
      this.imageFile = fileInput.files[0];
      const formData = new FormData();
      formData.append('files', this.imageFile);

      this.fileData = formData;

      fileReader.onload = () => {
        this.uploadedFileBase64 = fileReader.result;
      };

      fileReader.readAsDataURL(this.imageFile);
    });
  },

  data() {
    return {
      uploadedFileBase64: '' as string | ArrayBuffer | null,
      fileData: null as FormData | null,
      imageFile: null as File | null
    };
  },

  watch: {
    fileData() {
      this.onChange ? this.onChange(this.imageFile) : false;
    }
  },

  computed: {
    imageSRC(): string {
      return this.uploadedFileBase64 ? this.uploadedFileBase64 : this.image.fullPath;
    },
    classesImageUpload(): any {
      return {
        'image-upload_square': this.theme === 'square',
        'image-upload_disabled': this.isDisabled
      };
    }
  },

  methods: {
    openUploadDialog() {
      const fileInput = <HTMLInputElement>this.$el.querySelector('input[type=file]');

      fileInput.click();
      this.onClick();
    },
    removeImage() {
      if (!this.removeImageById) return;
      this.removeImageById(this.image.id);
      this.uploadedFileBase64 = '';
      this.fileData = null;
    }
  }
});
</script>

<style lang="scss" scoped>
.image-upload {
  display: flex;
  align-items: center;

  &_square {
    .image-upload {
      &__image-wrapper {
        width: 50px;
      }
    }
  }

  &__image-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 269px;
    height: 50px;
    border: 1px solid $gray300;
    border-radius: $shape_border_radius;
    margin-right: 30px;
    cursor: pointer;
    background: url(/img/editor/icons/favicon_upload.svg);

    img {
      max-width: 18px !important;
      height: 18px;
      padding: 0 !important;
      position: absolute;
      z-index: 20;
      left: 89px;
    }

    &:hover {
      .image-upload {
        &__image-overlay {
          opacity: 1;
        }
      }

      ~ .image-upload__actions .image-upload__button {
        &_refresh {
          svg {
            fill: #333333;
            opacity: 1;
          }
        }
      }
    }

    &:active {
      .image-upload {
        &__image-overlay {
          background-color: rgba(#f2f2f2, 0.9);
          border: 1px dashed #949cad;
          opacity: 1;
        }
      }

      ~ .image-upload__actions .image-upload__button {
        &_refresh {
          svg {
            fill: #333333;
            opacity: 1;
          }
        }
      }
    }

    &--social {
      width: 229px;
      height: 118px;
      background: none;
      background-size: 230px 120px;
      border: 1px solid $gray100;
      border-radius: 4px;
      overflow: hidden;

      @media only screen and (-webkit-min-device-pixel-ratio: 2),
        only screen and (min--moz-device-pixel-ratio: 2),
        only screen and (-o-min-device-pixel-ratio: 2/1),
        only screen and (min-device-pixel-ratio: 2),
        only screen and (min-resolution: 192dpi),
        only screen and (min-resolution: 2dppx) {
        background: url(/img/editor/social_image@2x.png) 50% no-repeat;
        background-size: 230px 120px;
      }

      img {
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 228px;
        height: 120px;
        object-fit: cover;
        max-width: unset !important;
      }
    }
  }

  &__image-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #dadada;
    border-radius: $shape_border_radius;
    opacity: 0;
    transition: 0.3s;
    z-index: 21;

    svg {
      height: 20px;
      fill: $black;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
  }

  &__button {
    background: none;
    border: none;
    margin-right: 24px;
    outline-width: thin;
    cursor: pointer;

    &:hover {
      svg {
        fill: #333333;
        opacity: 1;
      }
    }

    &:last-child {
      margin-right: 0;
    }

    svg {
      height: 20px;
      fill: #828282;
      opacity: 0.3;
      transition: 0.3s;
    }

    &.disabled {
      cursor: default;
      svg {
        fill: #828282;
        transform: rotate(0deg);
        opacity: 0.3;
      }
    }
  }

  &_disabled {
    cursor: not-allowed;

    .image-upload__image-wrapper {
      cursor: not-allowed;

      &:active,
      &:hover {
        cursor: not-allowed;

        .image-upload {
          &__image-overlay {
            display: none;
          }
        }

        ~ .image-upload__actions .image-upload__button {
          &_refresh {
            svg {
              fill: #828282;
              transform: rotate(0deg);
              opacity: 0.3;
            }
          }
        }
      }
    }

    .image-upload__button {
      cursor: not-allowed;

      &:hover {
        background: none;
        border: none;
        outline-width: thin;
        cursor: not-allowed;

        svg {
          fill: #828282;
          opacity: 0.3;
        }
      }

      &_refresh {
        &:hover {
          svg {
            transform: rotate(0deg);
            fill: #828282;
          }
        }
      }
    }
  }
}
</style>

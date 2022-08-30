<template>
  <div ref="root" class="image-uploader-wrapper" @dragover="showFileLoader = true">
    <drop-provider
      v-if="showFileLoader"
      :style="fileLoaderStyle"
      @dragleave="showFileLoader = false"
      @dropped="proceedDrop"
    />
    <input
      class="image-uploader-wrapper__input"
      ref="image-input"
      type="file"
      :accept="isIcon ? 'image/svg+xml' : 'image/*'"
      multiple
      @change="loadImage"
    />
    <button
      :class="{ 'image-loaded': value }"
      class="image-uploader-wrapper__custom-uploader"
      @click.prevent="imageInput.click()"
    >
      <div class="image-uploader-wrapper__upload-icon" v-tooltip="'Upload image'">
        <svg-icon name="upload-icon" width="13" height="13" color="#000" />
      </div>
      <image-loader v-if="loading" class="image-uploader-wrapper__loader" />
      <div v-if="(PreviewImage && PreviewImage.path) || value" class="image-uploader-wrapper__image-preview" :class="{ loading: loading }">
        <img
          v-if="PreviewImage.path && !value && PreviewImage.path.indexOf(' 2x') != -1"
          :srcset="PreviewImage.path"
          alt=""
       />
        <img
          v-else-if="PreviewImage.path && !value && PreviewImage.path.indexOf(' 2x') == -1"
          :src="PreviewImage.path"
          alt=""
        />

        <picture v-if="value">
          <source v-if="value.fullPathWebP" type="image/webp" :srcset="value.fullPathWebP.replace(' ', '%20')" />
          <source v-if="value.fullPathJp2" type="image/jp2" :srcset="value.fullPathJp2.replace(' ', '%20')" />
          <img v-if="value.fullPath" :src="value.fullPath" alt="" />
          <img v-else-if="value.indexOf(' 2x') !== -1" :srcset="value" alt="" />
          <img v-else :src="value" alt="" />
        </picture>
      </div>
      <svg-icon
        v-else
        class="image-uploader-wrapper__default-icon"
        name="preview-image-icon"
        width="49"
        height="40"
        color="#949CAD"
      />
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ImageLoader from '@/components/Editor/Elements/ImageLoader.vue';

import DropProvider from '@/components/Editor/Elements/DropProvider.vue';
import { Converter } from '@/utils/converter';
import HTMLElementEvent from '@/utils/types/HTMLElementEvent';
import { FileDto } from '@/utils/api';
interface Preview {
  id: undefined | string;
  file: null | File;
  path: string | null;
}
export default Vue.extend({
  components: {
    DropProvider,
    ImageLoader
  },
  props: {
    block: {
      type: String,
      default: ''
    },
    value: {
      type: [Object, String],
      default: null
    },
    isIcon: {
      type: Boolean,
      default: false
    },
    /**
     * for supporting async operations and don't lose a data during uploading
     */
    uploadImage: {
      type: Function as PropType<(fd: FormData) => Promise<FileDto>>,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      // loadedPreview: null,
      errorMessage: null as null | string,
      showFileLoader: false,
      PreviewImage: {
        id: undefined,
        file: null,
        path: null
      } as Preview
    };
  },
  computed: {
    fileLoaderStyle(): any {
      const rootElement = this.$refs.root as HTMLDivElement | null;
      return {
        display: this.showFileLoader === true ? 'block' : 'none',
        position: 'absolute',
        zIndex: 100,
        width: `${rootElement?.offsetWidth ?? 0}px`,
        height: `${rootElement?.offsetHeight ?? 0}px`,
        top: '0px',
        left: '0px'
      };
    },
    imageInput(): any {
      return this.$refs['image-input'];
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.PreviewImage.file = null;
        this.PreviewImage.id = undefined;
        this.PreviewImage.path = null;
      }
    }
  },
  methods: {
    proceedDrop(e: any) {
      console.log('loadImage', e);
      this.loadImage(<any>{ target: { files: e.files } });
      this.showFileLoader = false;
    },
    loadImage(e: HTMLElementEvent<HTMLInputElement>) {
      if (e.target?.files == null || !e.target.files[0]) return;
      const file = e.target.files[0];
      this.$emit('input', null);
      this.$emit('loading');
      this.loading = true;
      this.errorMessage = null;
      const preview = this.PreviewImage;
      var reader = new FileReader();
      reader.onload = function () {
        preview.path = reader.result as string;
        preview.file = file;
        preview.id = undefined;
      };
      reader.readAsDataURL(file);
      if (!file) {
        this.loading = false;
        return;
      }
      const payload = {
        Image: file
      } as any;
      const formData = Converter.jsonToFormData(payload);
      this.uploadImage(formData)
        .then(image => {
          this.loading = false;
          this.$emit('loaded');
        })
        .catch(error => {
          console.error(error);
          if (error.message === 'Request Entity Too Large') {
            this.errorMessage = 'Sorry, the image is too large';
          }
        });
    }
  }
});
</script>

<style lang="scss" scoped>
.image-uploader-wrapper {
  position: relative;
  width: 100%;

  &__default-icon {
    transition: 0.3s;
    opacity: 0.6;
  }

  &__input {
    display: none;
  }

  &__upload-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 8px;
    bottom: 10px;
    z-index: 999;
    width: 30px;
    height: 30px;
    background: $white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    transition: 0.3s;

    svg {
      transition: 0.3s;
    }

    &:hover {
      background: $black;

      svg {
        color: $white !important;
      }
    }
  }

  &__custom-uploader {
    background: $gray100;
    width: 100%;
    height: 116px;
    border: 1px solid rgba(189, 194, 199, 0.2);
    border-radius: $shape_border_radius;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin: 0;
    transition: 0.3s;

    &:hover {
      border: 1px solid $gray300;
      .image-uploader-wrapper__default-icon {
        opacity: 1;
      }
    }

    &.image-loaded {
      border: 1px solid $gray400;
    }
  }

  &__image-preview {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__loader {
    position: absolute;
    z-index: 200;
  }

  img {
    width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
}
</style>

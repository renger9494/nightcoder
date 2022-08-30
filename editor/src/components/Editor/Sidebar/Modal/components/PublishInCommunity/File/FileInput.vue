<template>
  <div class="file-uploader">
    <div v-if="!isPro" class="file-uploader__onlyPro">
      <only-pro :is-limit="false" />
    </div>
    <div v-else-if="selectedFile.file || selectedFile.id" class="file-uploader__file">
      <div class="file-uploader__file-preview">
        <span class="file-uploader__file-preview__name">{{ selectedFile.name }}</span>
        <span class="file-uploader__file-preview__size">{{ formatBytes() }}</span>
      </div>
      <button class="file-uploader__delete-file" @click="deleteFile">
        <svg-icon width="12" height="13" name="delete" color="#F46363" />
      </button>
    </div>
    <div v-else ref="root" class="file-uploader-wrapper" @dragover="showFileLoader = true">
      <drop-provider
        v-if="showFileLoader"
        :style="fileLoaderStyle"
        @dragleave="showFileLoader = false"
        @dropped="proceedDrop"
      />
      <input class="file-uploader-wrapper__input" ref="file-input" type="file" @change="loadImage" />
      <button
        :class="{ 'file-uploader-wrapper__custom-uploader__error': isError }"
        class="file-uploader-wrapper__custom-uploader"
        @click.prevent="imageInput.click()"
      >
        <div class="file-uploader-wrapper__upload-file">
          <svg-icon name="upload-file" width="24" height="24" folder="dashboard" />
          <span class="file-uploader-wrapper__upload-file__h1">Drop file Here</span>
          <span
            :class="{
              'file-uploader-wrapper__upload-file__h2__error': isError
            }"
            class="file-uploader-wrapper__upload-file__h2"
            >(50 Mb max size)</span
          >
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DropProvider from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/File/DropProvider.vue';
import OnlyPro from "@/components/Editor/Sidebar/Modal/components/PublishInCommunity/OnlyPro.vue";
import HTMLElementEvent from '@/utils/types/HTMLElementEvent';
import { formatBytes } from '@/utils/images';

interface FileProject {
  name: string | null;
  size: number | null;
  id: undefined | string;
  file: null | File | Blob;
  path: string | ArrayBuffer | null;
}

export default Vue.extend({
  components: {
    OnlyPro,
    DropProvider
  },
  props: {
    value: {
      type: [Object, String],
      default: null
    },
    isPro: {
      type: Boolean,
      default: false
    },
    file: {
      type: Object as PropType<FileProject>
    }
  },
  data() {
    return {
      isError: false,
      showFileLoader: false,
      selectedFile: this.file
    };
  },
  watch: {
    file: {
      deep: true,
      handler(val) {
        this.selectedFile = val;
      }
    }
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
      return this.$refs['file-input'];
    }
  },
  methods: {
    formatBytes(): string {
      return formatBytes(this.selectedFile.size);
    },
    deleteFile() {
      this.selectedFile.file = null;
      this.$emit('selectedFile', null);
    },
    proceedDrop(e: any) {
      this.loadImage(<any>{ target: { files: e.files } });
      this.showFileLoader = false;
    },
    loadImage(e: HTMLElementEvent<HTMLInputElement>) {
      if (e.target?.files == null || !e.target.files[0]) return;
      this.isError = false;
      const file = e.target.files[0];
      if (file.size / 1024 / 1024 > 50) {
        this.isError = true;
        return;
      }
      this.selectedFile.file = file;
      this.selectedFile.name = file.name;
      this.selectedFile.size = file.size;
      this.$emit('selectedFile', file);
    }
  }
});
</script>

<style lang="scss" scoped>
.file-uploader {
  margin-bottom: 20px;
  &__onlyPro {
    width: 100%;
    height: 100px;
    border-radius: 6px;
  }
  &__file {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    margin-bottom: 20px;
    &-preview {
      position: relative;
      display: flex;
      flex-direction: column;
      width: calc(100% - 30px);
      &__name {
        font-size: 12px;
        line-height: 16px;
        color: #000000;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &__size {
        font-size: 10px;
        line-height: 12px;
        color: #b3b3b3;
      }
    }
  }
  &__delete-file {
    cursor: pointer;
  }
  &-wrapper {
    position: relative;
    width: 100%;

    &__default-icon {
      transition: 0.3s;
      opacity: 0.6;
    }

    &__input {
      display: none;
    }

    &__upload-file {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      width: 80%;
      height: 90%;
      z-index: 2;
      background: $white;

      &__h1 {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #949cad;
      }
      &__h2 {
        font-size: 10px;
        line-height: 15px;
        color: #bdc2c7;
        opacity: 0.43;
        &__error {
          color: #f46363;
          opacity: 1;
        }
      }
    }

    &__custom-uploader {
      width: 100%;
      height: 100px;
      background: #ffffff;
      border: 1px solid #dadada;
      box-shadow: 0px 10px 20px rgba(9, 9, 9, 0.15);
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin: 0;
      transition: 0.3s;
      &__error {
        border-color: #f46363;
      }
      &:hover {
        border: 1px solid #318bf5;
      }

      &.image-loaded {
        border: 1px solid $gray400;
      }
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
}
</style>

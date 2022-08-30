<template>
  <div class="img-wrap">
    <div v-if="isBlur" class="img-wrap__blur" :class="{ isLoaded }" :style="`background-image: url(${blurPath});`"></div>
    <picture>
      <source
        v-for="(source, index) in imageSrcSet.source"
        :srcset="source.srcset"
        :media="source.media"
        :key="index"
      >
      <img :src="imageSrcSet.src" alt="airtap img" @load="load" />
    </picture>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ResponsiveImage, { ImageSrcSet, MediaSize } from '@/utils/ResponsiveImage';

export default Vue.extend({
  name: 'ResponsiveImage',
  data() {
    return {
      responsiveImage: null as any,
      isLoaded: false
    }
  },
  props: {
    isImgix: {
      type: Boolean,
      default: () => false
    },
    imgSrc: {
      type: String,
      required: true
    },
    sizes: {
      type: Array as PropType<Array<MediaSize>>,
      default: () => []
    },
    width: {
      type: String,
      required: true
    },
    isBlur: {
      type: Boolean,
      required: false
    }
  },
  created() {
    this.responsiveImage = new ResponsiveImage(this.imageFullPath, this.sizes, this.width);
  },
  computed: {
    imgRootPath(): string {
      return this.isImgix ? 'https://itmeo.imgix.net' : '@/assets';
    },
    imageFullPath(): string {
      return `${this.imgRootPath}${this.imgSrc}`;
    },
    blurPath(): string {
      return `${this.imageFullPath}?auto=format&width=50`
    },
    imageSrcSet(): ImageSrcSet {
      if (this.isImgix) return this.responsiveImage.createImgixSet();
      return this.responsiveImage.createImgixSet();
    }
  },
  methods: {
    load() {
      this.isLoaded = true;
    }
  }
});
</script>

<style lang="scss">
.img-wrap {
  color: $white;
  position: relative;
  &__blur {
    transition: 0.3s;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: 50%;
    filter: blur(5px);
    z-index: 10;

    &.isLoaded {
      opacity: 0;
    }
  }
}
</style>

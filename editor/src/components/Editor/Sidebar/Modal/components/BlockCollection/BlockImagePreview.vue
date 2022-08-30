<template>
  <div class="block-image-preview" :class="{ isLoading }">
    <picture>
      <source v-if="image && image.fullPathWebP" type="image/webp" :srcset="image.fullPathWebP.replace(' ', '%20')" />
      <source v-if="image && image.fullPathJp2" type="image/jp2" :srcset="image.fullPathJp2.replace(' ', '%20')" />
      <source v-if="image && image.isElement" type="image/jp2" :srcset="image.retinaPath" />
      <img
        ref="lazy_image"
        v-if="image && image.fullPath"
        :src="image.fullPath"
        :data-src="image.fullPath"
        class="block-image-preview__image"
        alt="airtap image"
        draggable="false"
      />
      <img
        class="block-image-preview__image"
        v-else
        ref="lazy_image"
        :src="emptyImageSrc"
        :srcset="emptyImageSrcset"
        alt="airtap image"
        draggable="false"
      />
    </picture>
    <skeleton class="block-image-preview__skeleton" max-width="100%" :height="skeletonHeight" width="500" radius="2" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Skeleton from '@/components/Shared/ui/skeleton.vue';

export default Vue.extend({
  name: 'BlockImagePreview',
  components: { Skeleton },
  props: {
    data: {
      type: Object,
      required: true
    },
    skeletonHeight: {
      type: Number,
      required: true
    }
  },
  data(): any {
    return {
      emptyImageSrcset: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/empty_block.jpg, ${process.env.VUE_APP_BUCKET_NAME}/Defaults/empty_block@2x.jpg 2x`,
      emptyImageSrc: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/empty_block.jpg`,
      isLoading: true
    };
  },
  computed: {
    image(): any {
      return this.data?.files != null && this.data?.files.length != 0 ? this.data?.files[0] : null;
    }
  },
  created() {
    setTimeout(() => {
      if (!this.$refs.lazy_image) return;
      const lazyImageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage: any = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImageObserver.unobserve(lazyImage);
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          }
        });
      });
      lazyImageObserver.observe(this.$refs.lazy_image);
    }, 300);
  }
});
</script>

<style lang="scss" scoped>
.block-image-preview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  &.isLoading {
    position: relative;

    img {
      opacity: 0 !important;
    }

    ::v-deep .skeleton {
      opacity: 1;
      visibility: visible;
      transition: 0.3s;
    }
  }

  &__image {
    max-width: 100%;
    transition: 0.3s;
    opacity: 1;
    height: 100%;
    width: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: 50% 0;
    object-position: 50% 0;
    -webkit-user-drag: none;
  }

  &__skeleton {
    position: absolute !important;
    left: 0;
    top: 0;
    opacity: 0;
    visibility: hidden;
  }
}
</style>

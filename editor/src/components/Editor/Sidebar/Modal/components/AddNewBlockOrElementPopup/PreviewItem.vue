<template>
  <div class="block-item" @click="onItemClick">
    <div class="block-item__descr">
      <p class="block-item__descr-left">{{ interfaceElement.name }}</p>
      <p class="block-item__descr-right">{{ interfaceElement.title }}</p>
    </div>
    <div class="block-item__bg" :class="{ isLoading }">
      <picture>
        <source v-if="image && image.fullPathWebP" type="image/webp" :srcset="image.fullPathWebP.replace(' ', '%20')" />
        <source v-if="image && image.fullPathJp2" type="image/jp2" :srcset="image.fullPathJp2.replace(' ', '%20')" />
        <source v-if="image && image.isElement" type="image/jp2" :srcset="image.retinaPath" />
        <img
          ref="lazy_image"
          v-if="image && image.fullPath"
          :src="image.fullPath"
          :data-src="image.fullPath"
          class="block-item__image"
          alt="airtap image"
        />
        <img v-else :src="emptyImageSrc" :srcset="emptyImageSrcset" alt="airtap image" />
      </picture>
      <skeleton max-width="100%" height="148" width="400" radius="4" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IBlock } from './types';
import Skeleton from '@/components/Shared/ui/skeleton.vue';
import { mapState } from 'vuex';

export default Vue.extend({
  components: { Skeleton },
  props: {
    interfaceElement: {
      type: Object as () => IBlock,
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
    ...mapState({
      user: (state: any) => state.auth.user
    }),
    image(): any {
      return this.interfaceElement?.files != null && this.interfaceElement?.files.length != 0
        ? this.interfaceElement?.files[0]
        : null;
    }
  },
  methods: {
    onItemClick(): void {
      this.$emit('blockSelection', this.interfaceElement);
    }
  },
  mounted() {
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
  }
});
</script>

<style lang="scss" scoped>
.block-item {
  cursor: pointer;

  &:not(:last-child) {
    margin: 0 0 20px;
  }

  &__descr {
    display: flex;
    justify-content: space-between;
    margin: 0 0 8px;
    font-size: 11px;
    line-height: 13px;
    letter-spacing: 0.05em;

    &-left {
      color: #000;
    }

    &-right {
      color: #949cad;
    }
  }

  &__bg {
    background-color: $gray100;
    background-position: 50%;
    background-repeat: no-repeat;
    border: 1px solid #f3f3f3;
    border-radius: 4px;
    overflow: hidden;
    height: 150px;

    &.isLoading {
      position: relative;

      img {
        opacity: 0 !important;
      }

      ::v-deep .skeleton {
        position: absolute !important;
        left: 0;
        top: 0;
      }
    }
  }

  &__image {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: 50% 0;
    transition: 0.3s;
    opacity: 1;
  }
}
</style>

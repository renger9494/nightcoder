<template>
  <a
    :class="`${imageClassName}-wrapper`"
    @click="redirectTo"
    :style="previewImageStyle"
  >
    <picture
      v-if="previewImage && !isError"
      :id="previewImage.id"
      class="prew-image"
    >
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
        :class="imageClassName"
        :src="previewImage.fullPath"
        :alt="alt"
        @error="isError = true"
      />
    </picture>
    <img
      :class="imageClassName"
      class="placeholder-image"
      v-else
      :src="getPlaceholderUrl()"
      alt=""
    />
  </a>
</template>

<script lang="ts">
import Vue from 'vue'
import { VisibleModalType } from '~/store/ui'
import {getPlaceholderUrl} from '@/utils/images'
export default Vue.extend({
  name: 'PreviewImage',
  props: {
    alt: {
      type: String,
      default: () => '',
    },
    href: {
      type: String,
    },
    previewImage: {
      type: Object,
    },
    imageClassName: {
      type: String,
    },
  },
  data() {
    return {
      isError: false,
    }
  },

  computed: {
    previewImageStyle(): string {
      const color = this.previewImage?.dominantColor
      return `background: ${color && !this.isError ? color : '#6168FF'}`
    },
  },
  methods: {
     getPlaceholderUrl(){
      return getPlaceholderUrl()
    },
    redirectTo() {
      const { dispatch } = this.$store
      if (window.innerWidth < 1200) {
        dispatch('ui/changeVisibleModalName', {
          newVisibleModalName: VisibleModalType.MobileAlert,
        })
        return
      }
      location.href = this.href
    },
  },
})
</script>

<style lang="scss">
.placeholder-image {
  background: #ffffff;
}
</style>

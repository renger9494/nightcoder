<template>
  <a :class="`${imageClassName}-wrapper`" @click="redirectTo">
    <picture v-if="previewImage">
      <source
        v-if="previewImage.fullPathWebP"
        type="image/webp"
        :srcset="previewImage.fullPathWebP.replace(' ', '%20')"
      />
      <source v-if="previewImage.fullPathJp2" type="image/jp2" :srcset="previewImage.fullPathJp2.replace(' ', '%20')" />
      <img :class="imageClassName" :src="previewImage.fullPath" :alt="alt" :style="previewImageStyle" />
    </picture>
    <img :class="imageClassName" v-else :src="placeholder" :style="previewImageStyle" alt="" />
  </a>
</template>

<script>
export default {
  name: 'PreviewImage',
  props: {
    alt: {
      type: String,
      default: () => ''
    },
    href: {
      type: String
    },
    previewImage: {
      type: Object
    },
    imageClassName: {
      type: String
    }
  },
  computed: {
    previewImageStyle() {
      let style = {};

      if (this.previewImage && this.previewImage.dominantColor) style.backgroundColor = this.previewImage.dominantColor;

      return style;
    },
    placeholder() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/placeholder.svg';
    }
  },
  methods: {
    redirectTo() {
      location.href = this.href;
    }
  }
};
</script>

<style></style>

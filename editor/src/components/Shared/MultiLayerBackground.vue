<template>
  <div :style="{ ...backgroundColor }" class="templates-bg" :class="backgroundClass">
    <picture v-if="!isBackgroundImageHidden && imagePath" class="templates-bg__image">
      <source v-if="imagePath.fullPathWebP" type="image/webp" :srcset="imagePath.fullPathWebP.replace(' ', '%20')" />
      <source v-if="imagePath.fullPathJp2" type="image/jp2" :srcset="imagePath.fullPathJp2.replace(' ', '%20')" />
      <img
        v-if="imagePath.fullPath"
        :src="imagePath.fullPath"
        class="templates-bg__image"
        :style="{ ...backgroundImage }"
      />
      <img
        v-else-if="imagePath.indexOf(' 2x') !== -1"
        :srcset="imagePath"
        class="templates-bg__image"
        :style="{ ...backgroundImage }"
      />
      <img v-else :src="imagePath" class="templates-bg__image" :style="{ ...backgroundImage }" />
    </picture>
    <div
      :style="backgroundOverlay"
      class="templates-bg__overlay"
      :class="overlayClass"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'MultilayerBackground',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    backgroundColor: {
      type: Object,
      default: () => ({})
    },
    backgroundImage: {
      type: Object,
      default: () => ({})
    },
    backgroundOverlay: {
      type: Object,
      default: () => ({})
    },
    isBackgroundImageHidden: {
      type: Boolean,
      default: false
    },
    backgroundClass: {
      type: String,
      default: ''
    },
    overlayClass: {
      type: String,
      default: ''
    },
    imagePath: {
      type: Object,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.templates-bg {
  z-index: -1;

  &,
  &__image,
  &__overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>

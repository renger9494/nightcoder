<template>
  <div class="overlay" :class="{ overlay_visible: isVisible }"></div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: none;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;

  @include sm-down {
    display: block;
  }

  &_visible {
    opacity: 1;
    visibility: visible;
  }
}
</style>



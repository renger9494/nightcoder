<template>
  <div
    class="overlay"
    :class="{ overlay_visible: isVisible }"
    @click="closeModal"
  ></div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
  },
  created() {
    if (process.client) {
      document.addEventListener('keyup', this.closeModal)
    }
  },
  beforeDestroy() {
    if (process.client) {
      document.removeEventListener('keyup', this.closeModal)
    }
  },
  methods: {
    closeModal(event) {
      if (event) {
        event.preventDefault()

        if (event.key) {
          if (event.key === 'Escape') {
            this.$store.dispatch('ui/closeModal')
          } else {
            return
          }
        }
      }

      this.$store.dispatch('ui/closeModal')
    },
  },
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;

  &_visible {
    opacity: 1;
    visibility: visible;
  }
}
</style>



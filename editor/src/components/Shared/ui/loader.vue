<template>
  <div
    class="spinner-loading"
    :style="`height: ${size}px; width: ${size}px;`"
  />
</template>

<script>
export default {
  name: 'loader',
  props: {
    size: {
      type: Number,
      default: () => 24,
    },
  },
}
</script>

<style lang="scss" scoped>
.spinner-loading {
  border: 10px solid #828282;
  border-right-color: transparent;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.7;
    transform: translate(-50%, -50%) rotate(1turn);
  }
}
</style>

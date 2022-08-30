<template>
  <div
    class="skeleton"
    :class="{ light }"
    :style="`width: ${modifiedWidth}; height: ${height}px; border-radius: ${radius}px; max-width: ${maxWidth};`"
  ></div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      required: true
    },
    height: {
      type: [String, Number],
      required: true
    },
    radius: {
      type: [String, Number],
      required: true
    },
    maxWidth: {
      type: String,
      default: () => '50%'
    },
    light: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    modifiedWidth() {
      return this.width.charAt(this.width.length) === '%' ? this.width : `${this.width}px`;
    }
  }
};
</script>

<style lang="scss" scoped>
.skeleton {
  position: relative;
  background: #f1f2f6;
  overflow: hidden;
  max-width: 50%;

  &:after {
    content: '';
    animation: skeletonShimmer 1s forwards infinite cubic-bezier(0.17, 0.67, 0.83, 0.67);
    background: linear-gradient(to right, #f1f2f6 0%, #fffcfc 50%, #f1f2f6 100%);
    background-size: 200% 100%;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  &.light {
    &:after {
      animation: skeletonShimmer 1s forwards infinite cubic-bezier(0.17, 0.67, 0.83, 0.67);
      background: linear-gradient(90deg, #adb3b8 0%, #576575 50%, #adb3b8 100%);
      background-size: 200% 100%;
    }
  }
}

@keyframes skeletonShimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="8"
    viewBox="0 0 10 8"
    fill="none"
    class="save-icon"
    :class="{ 'save-icon_disabled': !isDisabled }"
  >
    <path
      d="M3.84615 4.39645L2.41935 2.98458C1.96581 2.53579 1.2331 2.54373 0.789389 3.00224C0.352183 3.45404 0.360482 4.17368 0.807993 4.61527L3.04843 6.82606C3.26008 7.02949 3.54046 7.14286 3.83191 7.14286C4.12336 7.14286 4.40374 7.02949 4.61538 6.82606L9.18059 2.46106C9.63468 2.02689 9.65499 1.30822 9.22615 0.849097C8.78979 0.381935 8.05574 0.361639 7.59425 0.803977L3.84615 4.39645Z"
    />
  </svg>
</template>

<script>
export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.save-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: $shape_border_radius;
  cursor: pointer;
  &:not(.auto-save_disabled):hover {
    background: #f3f3f3;
    path {
      fill: rgba(0, 0, 0, 1);
    }
  }
  path {
    fill: rgba(0, 0, 0, 0.3);
  }
  &_disabled {
    pointer-events: none;
    path {
      fill: #53b71b;
    }
  }
}
</style>
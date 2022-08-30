<template>
  <div @click="onClick" class="square-icon-btn" :class="{ active: isActive, disabled: disabled }" :style="btnSize">
    <svg-icon :name="iconSettings.name" :width="iconSettings.width" :height="iconSettings.height" :color="iconColor" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SquareIconBtn',
  props: {
    size: {
      type: Object,
      default: () => ({
        width: 24,
        height: 24
      })
    },
    iconSettings: {
      required: true,
      type: Object
    },
    iconColor: {
      type: String,
      default: () => '#000'
    },
    isActive: {
      type: Boolean,
      default: () => false
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    btnSize(): string {
      return `width: ${this.size.width}px; height: ${this.size.width}px;`;
    }
  },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
});
</script>

<style lang="scss" scoped>
.square-icon-btn {
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  border-radius: $shape_border_radius;

  svg {
    transition: 0.3s;
  }

  &:hover {
    background: $gray100;
  }

  &.active {
    background: $gray100;
  }

  &.disabled {
    cursor: default;
    &:hover {
      background: transparent;
    }
  }
}
</style>

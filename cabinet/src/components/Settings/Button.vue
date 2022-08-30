<template>
  <component
    class="button"
    :class="{ button_blue: theme === 'blue' }"
    :is="tag"
    :href="tag === 'a' && '#'"
    :disabled="!isActive"
    @click="onClick"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'AirButton',
  props: {
    tag: {
      type: String,
      required: true,
    },
    theme: {
      validator(value: any) {
        // The value must match one of these strings
        return ['transparent', 'blue'].indexOf(value) !== -1
      },
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    onClick: { type: Function, default: () => {} },
  },
})
</script>

<style lang="scss" scoped>
.button {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  min-width: unset;
  text-align: center;
  color: $white;
  background: $black;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  padding: 9px 24px;
  transition: 0.3s;
  border: none;
  border-radius: $shape_border_radius;
  outline: none;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }

  &:active {
    opacity: 1;
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
  @include sm-down {
    min-width: 103px;
    padding-right: 15px;
    padding-left: 15px;
  }

  &_blue {
    min-width: initial;
    color: #ffffff;
    background-color: #4256be;
    border: none;
  }
}
</style>

<template>
  <div class="switch" @click="onClick">
    <input class="switch__input" :type="'checkbox'" :checked="isActive" />
    <div class="switch__label">Toggle</div>
  </div>
</template>

<style lang="scss" scoped>
.switch {
  &__input {
    position: absolute;
    width: 0;
    height: 0;
    visibility: hidden;

    &:checked {
      + .switch__label {
        background-color: #318df5;

        &:after {
          left: 2px;
          transform: none;
        }
      }
    }
  }

  &__label {
    position: relative;
    display: block;
    width: 24px;
    height: 14px;
    background-color: #dadada;
    text-indent: -9999px;
    border-radius: 10px;
    cursor: pointer;

    &:after {
      content: '';
      position: absolute;
      top: 2px;
      left: calc(100% - 2px);
      width: 10px;
      height: 10px;
      background-color: #ffffff;
      border-radius: 100px;
      transition: 0.3s;
      transform: translateX(-100%);
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
  },
})
</script>
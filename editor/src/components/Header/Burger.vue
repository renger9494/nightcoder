<template>
  <button class="burger" :class="{ burger_active: isActive }" @click="click">
    <div class="burger__inner"></div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isActive: Boolean,
    click: Function
  }
});
</script>

<style lang="scss" scoped>
.burger {
  position: relative;
  display: none;
  width: 28px;
  height: 24px;
  padding-top: 5px;
  padding-right: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  margin-top: -5px;
  margin-right: -5px;
  margin-bottom: -5px;

  @include lg-down {
    display: block;
  }

  &_active {
    .burger {
      &__inner {
        transform: translate(-50%) rotate(45deg);
        transition: 0.2s 0.2s;

        &:before {
          top: 0;
          opacity: 0;
          transition: top 0.2s;
        }

        &:after {
          bottom: 0;
          transform: rotate(-90deg);
          transition: bottom 0.2s, transform 0.2s 0.2s;
        }
      }
    }
  }

  &__inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 2px;
    background-color: #000000;
    border-radius: $shape_border_radius;
    transform: translate(-50%);
    transition: 0.2s;

    &:before {
      content: '';
      position: absolute;
      top: -6px;
      left: 0;
      width: 18px;
      height: 2px;
      background-color: #000000;
      border-radius: $shape_border_radius;
      transition: top 0.2s 0.2s;
    }

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -6px;
      width: 18px;
      height: 2px;
      background-color: #000000;
      border-radius: $shape_border_radius;
      transition: bottom 0.2s 0.2s, transform 0.2s;
    }
  }
}
</style>



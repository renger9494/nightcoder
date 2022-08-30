<template>
  <nuxt-link :to="to" class="start-btn">
    <span class="start-btn__text">
      <slot/>
    </span>
    <arrow-btn class="start-btn__arrow" />
  </nuxt-link>
</template>

<script>
import ArrowBtn from '@/assets/icons/arrow_btn.svg?inline'
export default {
  name: 'StartBtn',
  components: {
    ArrowBtn
  },
  props: {
    to: {
      required: true,
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.start-btn {
  padding: 15px 30px;
  border-radius: 4px;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0E0E11;
  text-decoration: none;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
    transition: 0.3s;
    background: linear-gradient(90deg, #E64AFA 0%, #8C38FF 40.1%, #3CA1FF 100%);
    border-radius: 4px;

  }
  &:before {
    background: $white;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition: 0.3s;
    border-radius: 4px;
  }
  &__text {
    position: relative;
    z-index: 2;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
  }
  &__arrow {
    position: relative;
    z-index: 2;
    width: 16px;
    height: 16px;
    margin: 0 0 0 15px;
    svg {
      transition: 0.3s;
    }
  }

  &:hover {
    color: $white;
    svg {
      path {
        fill: $white;
      }
    }
    &:after {
      opacity: 1;
    }
    &:before {
      opacity: 0;
    }
  }
}
</style>

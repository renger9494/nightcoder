<template>
  <div :class="{ onlyPro__limit: isLimit }" class="onlyPro">
    <div v-if="!isLimit" class="onlyPro__text">Only for <span>PRO</span> Users</div>
    <div v-else class="onlyPro__text onlyPro__text__limit">
      <div>Your limit is reached</div>
      <div>You need to <span>update</span> your plan</div>
    </div>
    <router-link class="onlyPro__upgrade-to-pro-button" to="/checkout/pro" data-text="Upgrade to PRO">
      <svg-icon name="star_filled" width="13" height="13" />
      <span>U</span>
      <span>p</span>
      <span>g</span>
      <span>r</span>
      <span>a</span>
      <span>d</span>
      <span>e&nbsp;</span>
      <span>t</span>
      <span>o&nbsp;</span>
      <span>P</span>
      <span>R</span>
      <span>O</span>
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    isLimit: {
      type: Boolean
    }
  }
});
</script>

<style lang="scss">
.onlyPro {
  width: 100%;
  height: 100%;
  background: #000000;
  border-radius: 6px;
  padding: 17px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  &__limit {
    padding: 20px;
  }
  &__text {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    text-align: center;

    color: #ffffff;
    &__limit {
      font-size: 18px;
      line-height: 22px;
    }
    span {
      text-transform: uppercase;
      color: #ffc557;
      font-weight: 600;
    }
  }
  &__upgrade-to-pro-button {
    background-color: #ffc557;
    color: #000000;

    &:before {
      padding-left: 23px;
    }

    svg {
      width: 13px;
      fill: #000000;
      margin-right: 10px;
    }
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    line-height: normal;
    text-align: center;
    text-decoration: none;
    border-radius: $shape_border_radius;
    padding: 8px 16px;
    overflow: hidden;
    width: fit-content;
    &:before {
      content: attr(data-text);
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 13px;
      font-weight: 500;
      line-height: normal;
      text-align: center;
      white-space: nowrap;
      padding-top: 8px;
      padding-bottom: 16px;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }

    &:hover {
      &:before {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }

      span {
        opacity: 1;
        transform: translate3d(0, 0, 0);

        &:nth-child(1) {
          transition-delay: 0.045s;
        }

        &:nth-child(2) {
          transition-delay: 0.09s;
        }

        &:nth-child(3) {
          transition-delay: 0.135s;
        }

        &:nth-child(4) {
          transition-delay: 0.18s;
        }

        &:nth-child(5) {
          transition-delay: 0.225s;
        }

        &:nth-child(6) {
          transition-delay: 0.27s;
        }

        &:nth-child(7) {
          transition-delay: 0.315s;
        }

        &:nth-child(8) {
          transition-delay: 0.36s;
        }

        &:nth-child(9) {
          transition-delay: 0.405s;
        }

        &:nth-child(10) {
          transition-delay: 0.45s;
        }

        &:nth-child(11) {
          transition-delay: 0.5s;
        }

        &:nth-child(12) {
          transition-delay: 0.55s;
        }

        &:nth-child(13) {
          transition-delay: 0.6s;
        }
      }
    }

    span {
      font-size: 13px;
      font-weight: 500;
      line-height: normal;
      text-align: center;
      transform: translate3d(0, -10px, 0);
      opacity: 0;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }
  }
}
</style>

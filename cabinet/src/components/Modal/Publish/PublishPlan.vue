<template>
  <div class="publish-plan" @click="goToPlans">
    <div class="publish-plan__col publish-plan__col--free">
      <h2 class="publish-plan__title">Upgrade to <span>PRO</span></h2>
      <p class="publish-plan__text">Start with basic features and create your own website in minutes</p>
      <button class="publish-plan__btn">
        <svg-icon name="star-icon" width="13" height="13" />
        <span class="static">Go to pricing</span>
        <span class="to-show">
          <span>G</span>
          <span>o</span>
          <span></span>
          <span>t</span>
          <span>o</span>
          <span></span>
          <span>p</span>
          <span>r</span>
          <span>i</span>
          <span>c</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
        </span>
      </button>
    </div>
    <div class="publish-plan__col">
      <ul class="publish-plan__list">
        <li class="publish-plan__list-item">Custom Domain</li>
        <li class="publish-plan__list-item">No Airtap Branding</li>
        <li class="publish-plan__list-item">5 Websites</li>
        <li class="publish-plan__list-item">Pro Templates</li>
        <li class="publish-plan__list-item">Integrations</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getCabinetUrl } from '@/utils/http';

export default Vue.extend({
  methods: {
    goToPlans() {
      window.location.href = `${getCabinetUrl()}/dashboard/plans`;
    }
  }
});
</script>

<style lang="scss" scoped>
.publish-plan {
  background: #000000;
  border-radius: 6px;
  color: $white;
  padding: 22px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  &__title {
    font-weight: bold;
    font-size: 16px;
    line-height: 21px;
    margin: 0 0 12px;

    span {
      font-weight: inherit;
      color: #ffc557;
    }
  }

  &__text {
    font-size: 12px;
    line-height: 15px;
    color: rgba(255, 255, 255, 0.8);
    max-width: 142px;
    margin: 0 0 50px;
  }

  &__col {
    flex: 0 0 calc(50% - 49px);
    &--free {
      flex: 1 0 0;
    }
  }

  &__btn {
    padding: 10px 17px;
    background: linear-gradient(270deg, #ffcd1a 0%, #fd9c0c 100%);
    display: flex;
    border-radius: 6px;
    position: relative;
    cursor: pointer;

    & > span {
      transition: 0.3s;
      margin: 0 0 0 8px;
    }

    span {
      letter-spacing: 0.05em;
      font-weight: bold;
      font-size: 10px;
      line-height: 14px;
      text-transform: uppercase;
    }

    & > span:nth-child(3) {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 17px;
      margin: auto;
      height: 14px;

      span {
        display: inline-block;
        opacity: 0;
        transform: translate3d(0, -5px, 0);
        transition: transform 0.3s;
        transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);

        &:empty {
          width: 2px;
        }
      }
    }

    @mixin transition {
      $transition: 0.045;
      @for $i from 1 through 13 {
        $transition: $transition + 0.02;
        &:nth-child(#{$i}) {
          transition-delay: (#{$transition}s);
        }
      }
    }

    &:hover {
      & > span:nth-child(2) {
        opacity: 0;
        transform: translate3d(0, 5px, 0);
      }
      & > span:nth-child(3) {
        span {
          @include transition;
          transition: 0.3s;
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    }
  }

  &__list {
    list-style: none;
    &-item {
      position: relative;
      font-size: 12px;
      line-height: 15px;

      &:after {
        content: '';
        position: absolute;
        left: -17px;
        top: 0;
        bottom: 0;
        margin: auto 0;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #ffc557;
      }

      &:not(:last-child) {
        margin: 0 0 10px;
      }
    }
  }
}
</style>

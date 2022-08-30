<template>
  <div class="block-slider" v-if="data.blocks.length">
    <div class="block-slider__top block-slider-top">
      <div class="block-slider-top__title">
        <h2 class="block-slider-top__title-text">{{ data.title }}</h2>
        <p class="block-slider-top__title-count">({{ data.blocks.length }})</p>
      </div>
      <div @click="$emit('change', data.id)" class="block-slider-top__btn">Show all</div>
    </div>
    <div class="block-slider__swiper">
      <div v-if="!isFirstOne" class="block-slider__btn block-slider__btn--left" @click="$refs.carousel.goToPrev()">
        <svg-icon name="chevron-left" width="5" height="8" />
      </div>
      <agile-carousel
        class="block-slider__wrap"
        ref="carousel"
        v-bind="settings"
        @after-change="showCurrentSlide($event)"
      >
        <div v-for="item in data.blocks" :key="item.id" class="block-slider__container" @click="addBlock(item.id)">
          <div class="block-slider__item">
            <block-image-preview :data="item" :skeleton-height="80" />
          </div>
        </div>
      </agile-carousel>
      <div v-if="!isLastOne" class="block-slider__btn block-slider__btn--right" @click="$refs.carousel.goToNext()">
        <svg-icon name="chevron-left" width="5" height="8" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { VueAgile } from 'vue-agile';
import BlockImagePreview from './BlockImagePreview';

export default Vue.extend({
  name: 'BlocksSlide',
  components: {
    BlockImagePreview,
    AgileCarousel: VueAgile
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    addBlock: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      emptyImageSrcset: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/empty_block.jpg, ${process.env.VUE_APP_BUCKET_NAME}/Defaults/empty_block@2x.jpg 2x`,
      emptyImageSrc: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/empty_block.jpg`,
      settings: {
        navButtons: false,
        slidesToShow: 2,
        initialSlide: 0,
        swipeDistance: 0,
        centerMode: true,
        infinite: false
      },
      activeIndex: 0
    };
  },
  methods: {
    showCurrentSlide({ currentSlide }) {
      this.activeIndex = currentSlide;
    }
  },
  computed: {
    isFirstOne() {
      return this.activeIndex === 0;
    },
    isLastOne() {
      return this.activeIndex === this.data.blocks.length - 1;
    }
  }
});
</script>

<style lang="scss" scoped>
.block-slider {
  &__wrap {
    margin: 0 -4px;
    pointer-events: none;
  }
  &__container {
    padding: 0 4px;
    min-width: 162px;
  }
  &__item {
    height: 80px;
    border: 1px solid $gray100;
    border-radius: $shape_border_radius;
    overflow: hidden;
    cursor: pointer;
    pointer-events: initial;
  }
  &__top {
    margin: 0 0 $margin_s;
  }
  &__swiper {
    position: relative;
  }
  &__btn {
    position: absolute;
    top: 0;
    height: 100%;
    padding: 10px;
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &--left {
      left: -4px;
      background: linear-gradient(90deg, $white -19.32%, rgba(255, 255, 255, 0) 100%, rgba(255, 255, 255, 0.1) 100%);
    }
    &--right {
      right: -4px;
      background: linear-gradient(270deg, $white -19.32%, rgba(255, 255, 255, 0) 100%, rgba(255, 255, 255, 0.1) 100%);
      svg {
        transform: rotate(180deg);
      }
    }
  }
}
.block-slider-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  &__title {
    position: relative;
    &-text {
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
    }
    &-count {
      position: absolute;
      right: -2px;
      top: 0;
      transform: translate(100%, 0);
      font-weight: 400;
      font-size: 10px;
      line-height: 12px;
      color: $gray200;
    }
  }
  &__btn {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: $blue200;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      color: $blue100;
    }
  }
}
</style>

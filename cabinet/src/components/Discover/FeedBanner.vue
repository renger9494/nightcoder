<template>
  <div class="feedProjects__banner" :class="{ isReversed }">
    <div class="feedProjects__banner-wrap">
      <h2 class="feedProjects__banner-title">{{ title }}</h2>
      <a href="#" @click="onClick" class="feedProjects__banner-link">{{ linkText }}</a>
      <img
        v-if="isImage"
        class="feedProjects__banner-img feedProjects__banner-img--one"
        src="~/assets/img/feed/feed_girl_one.png"
        srcset="~/assets/img/feed/feed_girl_one.png, ~/assets/img/feed/feed_girl_one@2x.png 2x"
      >
      <img
        v-if="isImage"
        class="feedProjects__banner-img feedProjects__banner-img--two"
        src="~/assets/img/feed/feed_girl_two.png"
        srcset="~/assets/img/feed/feed_girl_two.png, ~/assets/img/feed/feed_girl_two@2x.png 2x"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeedBanner',
  props: {
    isImage: {
      type: Boolean,
      default: () => false
    },
    isReversed: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      required: true
    },
    linkText: {
      type: String,
      required: true
    }
  },
  methods: {
    onClick(e) {
      if (e) e.preventDefault();
      this.$emit('onBtnClick');
    }
  }
}
</script>

<style lang="scss" scoped>
.feedProjects {
  &__banner {
    padding: 50px 20px;
    position: relative;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.07);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    &.isReversed {
      &:after {
        transform: rotate(180deg);
        border-radius: 10px;
      }

      @include bp($md) {
        .feedProjects__banner-wrap {
          max-width: 450px;
        }
      }
    }

    &::after {
      content: '';
      position: absolute;
      left: -1;
      top: 0;
      right: 0;
      bottom: 0;
      width: calc(100% + 1px);
      height: 100%;
      background-image: url('~assets/img/feed/feed_bg_pc.jpg');
      background-size: cover;
      background-position: 50%;
      z-index: 1;

      @include retina() {
        background-image: url('~assets/img/feed/feed_bg_pc@2x.jpg');
      }

      @include bp(1240px) {
        background-image: url('~assets/img/feed/feed_bg_laptop.jpg');
      }

      @include retinaSize(1240px) {
        background-image: url('~assets/img/feed/feed_bg_laptop@2x.jpg');
      }
    }

    &-title {
      font-weight: 700;
      font-size: 45px;
      line-height: 130%;
      color: $white;
      margin: 0 0 20px;
      max-width: 835px;

      @include bp($sm) {
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
      }
    }

    &-link {
      padding: 8px 16px;
      background: $white;
      color: inherit;
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
      border-radius: $shape_border_radius;
      text-decoration: none;
      transition: 0.3s;


      &:hover {
        background: $black;
        color: $white;
      }
    }

    &-wrap {
      position: relative;
      z-index: 2;
      display: inline-flex;
      flex-direction: column;
      align-items: center;

      @include bp($md) {
        max-width: 595px;
      }
    }

    &-img {
      position: absolute;
      z-index: 2;
      top: 50%;

      &--one {
        left: 0;
        transform: translate(-100%,-50%);
      }
      &--two {
        right: 0;
        transform: translate(100%,-50%);
      }

      @include bp($md) {
        max-width: 87px;
        top: unset;
        bottom: -30px;

        &--one {
          transform: translate(0);
        }
        &--two {
          transform: translate(0);
        }
      }

      @include bp($sm) {
        max-width: 48px;
      }
    }
  }
}
</style>

<template>
  <section class="cover js-cover-section" :class="{ isLoaded }">
    <div class="cover__content">
      <div class="container container--main">
        <article class="cover__fade">
          <h1 class="cover__title">Publish your ideas live.&#13;&#10;Share with <span>creators.</span></h1>
          <p class="cover__text">
            This effortless free editor is the only you need to share your ideas and creations instantly. Start creating your own page easily with drag and drop and no code.
          </p>
          <div class="cover__action">
            <start-btn class="cover__action-btn" to="/sign-up">
              Start building — it’s free
            </start-btn>
          </div>
        </article>
      </div>
      <div class="cover__img">
        <div class="cover__img-bg"></div>
        <div class="container container--main">
          <responsive-image
            :is-imgix="true"
            :is-blur="true"
            :sizes="[{size: '334', breakPoint: '$sm'}, {size: '709', breakPoint: '$md'}]"
            img-src="/Landing/main.png"
            width="1200"
          />
          <responsive-image
            :is-imgix="true"
            :is-blur="true"
            :sizes="[{size: '66', breakPoint: '$sm'}, {size: '140', breakPoint: '$md'}]"
            img-src="/Landing/hero_group.png"
            width="302"
            class="cover__img-group_img"
          />
          <responsive-image
            :is-imgix="true"
            :is-blur="true"
            :sizes="[{size: '69', breakPoint: '$sm'}, {size: '142', breakPoint: '$md'}]"
            img-src="/Landing/hero_phone.png"
            width="298"
            class="cover__img-phone"
          />
          <responsive-image
            :is-imgix="true"
            :is-blur="true"
            :sizes="[{size: '506', breakPoint: '$md'}, {size: '240', breakPoint: '$sm'}]"
            img-src="/Landing/hero_board.png"
            width="897"
            class="cover__img-left"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CheckIcon from '@/assets/icons/check.svg?inline'
import ArrowRight from '@/assets/icons/arrow_right.svg?inline'
import ResponsiveImage from '@/components/Ui/ResponsiveImage.vue';
import StartBtn from '@/components/HomePage/StartBtn.vue';

export default {
  name: 'Cover',
  components: {
    StartBtn,
    ResponsiveImage,
    CheckIcon,
    ArrowRight
  },
  data() {
    return {
      isLoaded: false
    }
  },
  computed: {
    isMobile() {
      if (!process.client) return false
      return window.innerWidth <= 1279
    }
  },
  mounted() {
    this.$gsap.timeline({
      scrollTrigger: {
        trigger: '.cover',
        start: `top ${this.isMobile? '-=50' : '-=200'}`,
        end: this.isMobile? '+=250' : '+=700',
        scrub: true,
      }
    })
      .to('.cover__img-bg', {
        height: this.isMobile? '50px' : '150px',
        duration: 1,
      })

    this.$gsap.to(".cover__img-group_img", {
      yPercent: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.cover__img',
        start: `top top+=500px`,
        scrub: true
      },
    });

    this.$gsap.to(".cover__img-phone", {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.cover__img',
        start: `top top+=500px`,
        scrub: true
      },
    });

    this.$gsap.to(".cover__img-left", {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.cover__img',
        start: `top top+=500px`,
        scrub: true
      },
    });

    this.$emit('onComponentLoad');
    setTimeout(() => {
      this.isLoaded = true;
    },500)
  }
}
</script>

<style lang="scss">
.cover {
  position: relative;
  background: #0E0E11;
  padding: 147px 0 0;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100%;
    opacity: 0;
    transition: 1s;
    background-position: 50% 100%;
    background-color: #0E0E11;
    background-repeat: no-repeat;
  }

  &.isLoaded {
    &::after {
      background-image: url("https://itmeo.imgix.net/Landing/main_bg.jpg?auto=format&width=1920&dpr=1");
      background-size: cover;

      @include bp(1280px) {
        height: 770px;
        background-image: url("https://itmeo.imgix.net/Landing/main_bg.jpg?auto=format&width=1280&dpr=1");
        background-size: 100% 100%;
      }

      @include retinaSize(1512px) {
        background-image: url("https://itmeo.imgix.net/Landing/main_bg.jpg?auto=format&width=1512&dpr=1");
        background-size: cover;
      }

      @include retinaSize(1440px) {
        background-image: url("https://itmeo.imgix.net/Landing/main_bg.jpg?auto=format&width=1440&dpr=1");
        background-size: 100% 100%;
      }

      @include bp(767px) {
        background-image: url("https://itmeo.imgix.net/Landing/main_bg.jpg?auto=format&width=767&dpr=1");
        background-size: 100% 100%;
      }

      @include retinaSize(767px) {
        background-image: url("https://itmeo.imgix.net/Landing/main_bg.jpg?auto=format&width=767&dpr=2");
        background-size: 100% 100%;
      }
      opacity: 1;
    }
  }

  &__content {
    position: relative;
    z-index: 2;
  }

  input,
  button {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  &__fade {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 20;
  }

  &__img {
    position: relative;
    z-index: 11;
    padding: 2px 2px 150px;
    height: 100%;

    &-bg {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 850px;
      width: 100%;
      background: radial-gradient(258% 136% at 50% -55%, rgba(14, 14, 17, 0) 44%, rgba(14, 14, 17, 0.3) 54%, #0E0E11 85%);
      z-index: 3;
    }
    img {
      max-width: 100%;
      height: auto;
      margin: 0 auto;
      display: block;
    }
    &-group_img {
      position: absolute!important;
      left: 225px;
      top: 30px;
    }
    & &-phone {
      position: absolute!important;
      right: -20px;
      bottom: 0;
    }
    &-left {
      position: absolute!important;
      left: -20px;
      bottom: -20px;
    }
  }

  &__title {
    font-weight: bold;
    font-size: 64px;
    line-height: 85px;
    margin: 0 auto 20px;
    color: $white;
    text-align: center;
    max-width: 778px;
    white-space: pre-wrap;
    span {
      font-weight: inherit;
      background: linear-gradient(119.66deg, #34315B 0%, #6A85AE 24.99%, #79AAC6 37.16%, #A8C5DA 54.16%, #BDC6E9 68.9%, #EAB6DA 83.64%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &__text {
    max-width: 513px;
    margin: 0 auto 44px;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #EBEBEB;
  }

  &__action {
    display: flex;
    max-width: 389px;
    margin: 0 auto 50px;
  }

  &__list-adv {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto 50px;
    &-item {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin: 0 53px 0 0;
      }
      svg {
        @include size(15px, 15px);
        margin: 0 10px 0 0;
        path {
          fill: $white;
        }
      }
      p {
        font-weight: 500;
        font-size: 18px;
        line-height: 27px;
        color: $white;
      }
    }
  }

  @include bp($tablet) {
    padding: 120px 0 80px;
    &__title {
      font-size: 48px;
      line-height: 64px;
      max-width: 728px;
    }
    &__text {
      font-size: 16px;
      line-height: 24px;
      &-blue {
        margin: 0 0 36px;
      }
      &-gray {
        font-size: 36px;
        line-height: 53px;
        margin: 0 0 50px;
      }
    }
    &__img {
      &-bg {
        height: 700px;
      }
      &-group_img {
        left: 0;
        top: 30px;
      }
    }
    &__action {
      flex-direction: column;
      margin: 0 auto 40px;
    }
    &__list {
      flex-direction: column;
      &-item {
        font-size: 16px;
        line-height: 24px;
      }
      &-adv {
        justify-content: center;
        &-item {
          margin: 0!important;
        }
      }
    }
    &__img {
      padding: 0;
      &-bg {
        height: 550px;
        bottom: -50px;
      }
    }
  }

  @include bp($mobile) {
    padding: 90px 0 55px;
    min-height: auto;

    &:after {
      height: 100%;
    }
    &__fade {
      &-bg {
        width: 1200%;
        transform: translate(-65%,0);
      }
    }
    &__title {
      font-size: 30px;
      line-height: 45px;
      margin: 0 auto 20px;
      max-width: 300px;
      white-space: unset;
    }
    &__img {
      display: flex;
      padding: 0;
      .container {
        width: auto;
      }
    }
    &__text {
      font-size: 14px;
      line-height: 21px;
      max-width: 329px;
      margin: 0 auto 40px;
    }
    &__list {
      flex-wrap: wrap;
      margin: 0 0 -23px;
      &-item {
        font-size: 14px;
        line-height: 21px;
        margin: 0 25px 23px 0;
      }
    }
    &__action-btn {
      font-size: 14px;
      line-height: 21px;
      margin: 0 auto 40px;
    }
    &__img-bg {
      height: 250px;
      bottom: -55px;
    }
  }
}
</style>

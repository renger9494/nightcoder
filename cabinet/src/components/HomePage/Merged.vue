<template>
  <div class="merged">
    <div class="container container--main">
      <div class="merged__wrap">
        <div class="merged__col">
          <p class="merged__title">One platform to replace them all</p>
          <h2 class="merged__big-text split-text">We merged all popular services in one. Now you don’t need to think where to share your ideas.</h2>
          <div class="merged__picture">
            <div class="merged__picture-fade"></div>
            <responsive-image
              class="merged__pc"
              :is-imgix="true"
              :sizes="[{size: '345', breakPoint: '$sm'}, {size: '533', breakPoint: '$md'}]"
              img-src="/Landing/merged_pc.jpg"
              width="848"
            />
          </div>
        </div>
        <div class="merged__col">
          <responsive-image
            class="merged__phone"
            :is-imgix="true"
            :sizes="[{size: '120', breakPoint: '$sm'}, {size: '132', breakPoint: '$md'}]"
            img-src="/Landing/merged_phone.jpg"
            width="271"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ResponsiveImage from '@/components/Ui/ResponsiveImage.vue';
export default {
  name: 'merged',
  components: {
    ResponsiveImage
  },
  mounted() {
    this.$emit('onComponentLoad');
    if (window.innerWidth <= 1279) return
    window.onload = () => {
      const picture = document.querySelector('.merged__picture');

      this.$gsap.to('.merged__big-text .char', {
        opacity: 1,
        duration: 1,
        stagger: 0.012,
        scrollTrigger: {
          trigger: '.merged',
          start: `top top+=500px`,
          end: '+=500px',
          scrub: true
        }
      })

      this.$gsap.timeline({
        scrollTrigger: {
          trigger: '.merged',
          pin: '.merged',
          start: `top top`,
          end: '+=700px',
          scrub: true
        }
      })
        .to('.merged__big-text', {
          opacity: 0,
          duration: 1
        })
        .to('.merged__title', {
          opacity: 0,
          duration: 1
        },'-=1')
        .to(picture, {
          yPercent: -100,
          duration: 1.5
        },'-=1')
        .to('.merged__picture-fade', {
          height: '0px',
          duration: 1
        },'-=1.5')
        .to('.merged__phone', {
          scale: 0.8,
          duration: 1
        },'-=0.5')
    }
  }
}
</script>

<style lang="scss">
.merged {
  padding: 100px 0;
  height: 100vh;
  background: #0E0E11;
  overflow: hidden;
  &__title {
    max-width: 351px;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    background: linear-gradient(169deg, #34315B 8.06%, #6A85AE 24.99%, #79AAC6 37.16%, #A8C5DA 54.16%, #BDC6E9 68.9%, #EAB6DA 83.64%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    margin: 0 0 30px;
  }
  &__big-text {
    font-weight: 700;
    font-size: 64px;
    line-height: 85px;
    color: $white;
    max-width: 852px;
    margin: 0 0 100px;

    span {
      font-weight: inherit;
    }

    .char {
      opacity: 0;

      @include bp($tablet) {
        opacity: 1;
      }
    }
  }
  &__wrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    position: relative;
    height: 100%;
  }
  &__col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    &:first-child {
      max-width: 848px;
      width: 100%;
    }
    &:nth-child(2) {
      height: calc(100vh - 200px);
    }
  }
  &__phone {
    img {
      box-shadow: 0 3px 35px rgba(0, 0, 0, 0.15);
      border-radius: 25px;
      @include bp($tablet) {
        border-radius: 15px;
      }
    }
  }
  &__pc {
    img {
      max-width: 100%;
      box-shadow: 0 3px 35px rgba(0, 0, 0, 0.15);
      border-radius: 25px;
      @include bp($tablet) {
        border-radius: 15px;
      }
    }
  }
  &__picture {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, 50%);
    overflow: hidden;
    &-fade {
      width: 100%;
      height: 150%;
      position: absolute;
      right: 0;
      bottom: 0;
      background: radial-gradient(136% 136% at 50% -28%, rgba(14, 14, 17, 0) 44%, rgba(14, 14, 17, 0.46) 63.3%, #0E0E11 85%);
    }
  }

  @include bp($tablet) {
    padding: 80px 0;
    height: auto;
    .container {
      height: 100%;
    }
    &__title {
      font-size: 16px;
      line-height: 24px;
    }
    &__big-text {
      font-size: 48px;
      line-height: 64px;
      margin: 0 0 50px;
    }
    &__col {
      height: 100%;
      &:first-child {
        justify-content: flex-start;
      }
      &:nth-child(2) {
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        justify-content: flex-end;
      }
    }
    &__picture {
      position: relative;
      transform: unset;

      &-fade {
        display: none;
      }
    }
  }
  @include bp($mobile) {
    padding: 50px 0;
    &__title {
      font-size: 14px;
      line-height: 21px;
      margin: 0 0 30px;
    }
    &__big-text {
      font-size: 30px;
      line-height: 45px;
    }
    &__col:nth-child(2) {
      justify-content: flex-end;
      padding: 0 0 20px;
    }
  }
}
</style>

<template>
  <section class="discover">
    <div class="container container--main">
      <h2 class="discover__title">Simplify your process with&#13;&#10;<span>our templates</span> for various cases</h2>
      <div class="discover__tag-wrap">
        <a class="discover__tag" v-for="(item, index) in tags" :key="index">{{item}}</a>
      </div>
      <div class="discover__imgs">
        <div
          class="discover__imgs-col"
          :class="`discover__imgs-col--${item.classList}`"
          v-for="(item, index) in list"
          :key="index"
        >
          <responsive-image
            v-for="(itemImg, indexImg) in item.images"
            :key="indexImg"
            :is-imgix="true"
            :sizes="itemImg.sizes"
            :img-src="itemImg.src"
            width="400"
          />
        </div>
        <start-btn class="discover__btn" to="/">
          Explore all templates
        </start-btn>
      </div>
    </div>
  </section>
</template>

<script>
import ArrowRight from '@/assets/icons/arrow_right.svg?inline'
import ResponsiveImage from '@/components/Ui/ResponsiveImage.vue';
import StartBtn from '@/components/HomePage/StartBtn.vue';

export default {
  name: 'Discover',
  components: {
    StartBtn,
    ArrowRight,
    ResponsiveImage
  },
  data() {
    return {
      tags: [
        'software',
        'Startup',
        'service',
        'personal website',
        'app',
        'tutorial',
        'demo',
        'portfolio',
        'event',
        'saas',
        'ios',
        'newsletter',
        'plugin',
        'developer tool'
      ],
      list: [
        {
          classList: 'one',
          images: [
            {
              src: '/Landing/discover_1.jpg',
              sizes: [{size: '127', breakPoint: '$sm'}, {size: '238', breakPoint: '$md'}]
            },
            {
              src: '/Landing/discover_2.jpg',
              sizes: [{size: '127', breakPoint: '$sm'}, {size: '238', breakPoint: '$md'}]
            },
            {
              src: '/Landing/discover_3.jpg',
              sizes: [{size: '127', breakPoint: '$sm'}, {size: '238', breakPoint: '$md'}]
            }
          ],
        },
        {
          classList: 'two',
          images: [
            {
              src: '/Landing/discover_4.jpg',
              sizes: [{size: '127', breakPoint: '$sm'}, {size: '238', breakPoint: '$md'}],
            },
            {
              src: '/Landing/discover_5.jpg',
              sizes: [{size: '127', breakPoint: '$sm'}, {size: '238', breakPoint: '$md'}],
            },
            {
              src: '/Landing/discover_6.jpg',
              sizes: [{size: '127', breakPoint: '$sm'}, {size: '238', breakPoint: '$md'}],
            }
          ],
        },
        {
          classList: 'three',
          images: [
            {
              src: '/Landing/discover_7.jpg',
              sizes: [{size: '127', breakPoint: '$sm'}, {size: '238', breakPoint: '$md'}],
            },
            {
              src: '/Landing/discover_8.jpg',
              sizes: [{size: '127', breakPoint: '$sm'}, {size: '238', breakPoint: '$md'}],
            },
            {
              src: '/Landing/discover_9.jpg',
              sizes: [{size: '127', breakPoint: '$sm'}, {size: '238', breakPoint: '$md'}],
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.$gsap.to('.discover__imgs-col--one', {
      yPercent: 5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.discover',
        start: 'top top',
        scrub: true
      },
    });

    this.$gsap.to('.discover__imgs-col--two', {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.discover',
        start: 'top top',
        scrub: true
      },
    });

    this.$gsap.to('.discover__imgs-col--three', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.discover',
        start: 'top top',
        scrub: true
      },
    });

    this.$emit('onComponentLoad');
  }
}
</script>

<style lang="scss">
.discover {
  padding: 85px 0 0;
  background: $white;
  overflow: hidden;

  &__title {
    text-align: center;
    font-weight: 700;
    font-size: 64px;
    line-height: 85px;
    color: #0E0E11;
    margin: 0 auto 50px;
    max-width: 1040px;
    white-space: pre-wrap;

    span {
      font-weight: inherit;
      background: linear-gradient(90deg, #95D3F3 0%, #D8A8EB 41.15%, #6780FA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &__tag-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    margin: 0 -8px 50px;
  }

  &__tag {
    padding: 8px 10px;
    color: #0E0E11;
    text-transform: lowercase;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    border: 1px solid #DADADA;
    border-radius: 4px;
    transition: 0.3s;

    &:hover {
      color: $white;
      background: #0E0E11;
      border-color: transparent;
    }

    &:not(:last-child) {
      margin: 0 8px 11px 0;
    }
  }

  &__imgs {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      height: 100%;
      width: 150vw;
      left: -50vw;
      bottom: 0;
      background: radial-gradient(131.92% 131.92% at 49.97% -28.47%, rgba(255, 255, 255, 0) 37.5%, rgba(234, 182, 218, 0.37) 58.54%, rgba(189, 198, 233, 0.69) 100%);
    }

    &-col {
      flex: 0 0 calc(33.333% - 10px);
      width: calc(33.333% - 10px);
      text-align: center;
      img {
        max-width: 100%;
      }
    }
  }

  &__btn {
    position: absolute;
    bottom: 50px;
    right: 0;
    left: 0;
    margin: 0 auto;
    box-shadow: 0 3px 35px rgba(0, 0, 0, 0.15);
  }

  @include bp($tablet) {
    padding: 70px 0 0;
    &__title {
      font-size: 48px;
      line-height: 64px;
      white-space: unset;
      max-width: 534px;
      margin: 0 auto 50px;
    }
    &__link {
      margin: 0 0 45px;
    }
    &__bottom {
      &-title {
        max-width: 776px;
        font-size: 48px;
        line-height: 72px;
      }
    }
    &__tag-wrap {
      margin: 0 0 48px;
    }
    &__imgs {
      margin: 0 -41px;
    }
  }

  @include bp($mobile) {
    padding: 49px 0 0;

    &__title {
      font-size: 30px;
      line-height: 45px;
      margin: 0 auto 28px;
    }

    &__link {
      padding: 15px 25px;
      margin: 0 0 39px;
      span {
        font-size: 16px;
        line-height: 24px;
      }
    }

    &__bottom {
      &-title {
        font-size: 30px;
        line-height: 45px;
        margin: 0 0 30px;
      }
    }

    &__links {
      flex-direction: column;

      a:first-child {
        margin: 0 0 15px;
      }
    }

    &__imgs {
      margin: 0 -15px;

      &:after {
        bottom: -1px;
      }

      &-col {
        flex: 0 0 calc(33.333% - 4px);
        img {
          max-width: 100%;
          width: 100%;
        }
      }
    }

    &__tag {
      font-size: 12px;
      line-height: 18px;
    }
  }
}
</style>

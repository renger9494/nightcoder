<template>
  <section class="steps">
    <div class="container container--main">
      <h2 class="steps__title"><span>3 easy steps</span> to turn your ideas into community</h2>
      <div class="steps__list-wrap">
        <div
          class="steps__col step-item"
          :class="{'active': activeClass === index, isClicked}"
          v-for="(item, index) in list"
          :key="index"
          @click="changeSlide(index)"
        >
          <div class="step-item__top">
            <p class="step-item__count">0{{ index+1 }}.</p>
            <p class="step-item__title">{{ item.title }}</p>
          </div>
          <p class="step-item__text">{{ item.text }}</p>
          <div class="step-item__line"></div>
        </div>
      </div>
      <div class="steps__list-gallery list-gallery">
        <div
          class="list-gallery__col"
          :class="{'active': activeClass === index}"
          v-for="(item, index) in listGallery"
          :key="index"
        >
          <responsive-image
            class="list-gallery__img"
            v-for="(image, indexImage) in item"
            :key="indexImage"
            :is-imgix="true"
            :sizes="image.sizes"
            :img-src="image.src"
            :width="image.width"
            :data-parralax="image.parallaxPercentage"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ResponsiveImage from '@/components/Ui/ResponsiveImage.vue';

export default {
  name: 'Steps',
  components: {
    ResponsiveImage,
  },
  data() {
    return {
      list: [
        {
          title: 'Design',
          text: 'Make custom design for all devices and edit as you want. Flexible settings for any kind of elements, ready-to-use blocks or sections and a bunch of templates.'
        },
        {
          title: 'Publish',
          text: 'You get a ready webpage which is available with Airtap or your custom domain. All pages in Airtap are SEO optimized. Publish in a second and share.'
        },
        {
          title: 'Be a star',
          text: 'Bring your ideas into life and become a star. You can easily publish your content, get likes and see page views instantly. Get inspired and be inspiration to others.'
        }
      ],
      listGallery: [
        [
          {
            src: '/Landing/step_1_1.jpg',
            sizes: [{size: '345', breakPoint: '$sm'}, {size: '661', breakPoint: '$md'}],
            width: '922',
            parallaxPercentage: 5
          },
          {
            src: '/Landing/step_1_2.png',
            sizes: [{size: '72', breakPoint: '$sm'}, {size: '146', breakPoint: '$md'}],
            width: '204',
            parallaxPercentage: 20
          },
          {
            src: '/Landing/step_1_3.png',
            sizes: [{size: '63', breakPoint: '$sm'}, {size: '145', breakPoint: '$md'}],
            width: '204',
            parallaxPercentage: -15
          }
        ],
        [
          {
            src: '/Landing/step_2_1.jpg',
            sizes: [{size: '345', breakPoint: '$sm'}, {size: '661', breakPoint: '$md'}],
            width: '922',
            parallaxPercentage: 5
          },
          {
            src: '/Landing/step_2_2.png',
            sizes: [{size: '68', breakPoint: '$sm'}, {size: '154', breakPoint: '$md'}],
            width: '204',
            parallaxPercentage: 20
          },
          {
            src: '/Landing/step_2_3.jpg',
            sizes: [{size: '86', breakPoint: '$sm'}, {size: '181', breakPoint: '$md'}],
            width: '284',
            parallaxPercentage: 30
          },
          {
            src: '/Landing/step_2_4.jpg',
            sizes: [{size: '65', breakPoint: '$sm'}, {size: '138', breakPoint: '$md'}],
            width: '216',
            parallaxPercentage: 20
          }
        ],
        [
          {
            src: '/Landing/step_3_1.jpg',
            sizes: [{size: '345', breakPoint: '$sm'}, {size: '661', breakPoint: '$md'}],
            width: '922',
            parallaxPercentage: 5
          },
          {
            src: '/Landing/step_3_2.jpg',
            sizes: [{size: '72', breakPoint: '$sm'}, {size: '153', breakPoint: '$md'}],
            width: '237',
            parallaxPercentage: 30
          },
          {
            src: '/Landing/step_3_3.jpg',
            sizes: [{size: '106', breakPoint: '$sm'}, {size: '224', breakPoint: '$md'}],
            width: '350',
            parallaxPercentage: 30
          }
        ],
      ],
      activeClass: -1,
      sliderInterval: null,
      isClicked: false
    };
  },
  computed: {
    isMobile() {
      if (!process.client) return false
      return window.innerWidth <= 769
    }
  },
  mounted() {
    this.activeClass = 0;
    this.slider();
    this.parallax();
    if (this.isMobile) {
      window.onload = () => {
        const height = this.$el.scrollHeight;
        this.$el.style.height = `${height}px`
      }
    }
    this.$emit('onComponentLoad');
  },
  methods: {
    slider() {
      this.sliderInterval = setInterval(() => {
        if(this.activeClass === 2) {
          this.activeClass = 0;
        } else {
          this.activeClass++;
        }
      },5000);
    },
    changeSlide(index) {
      this.activeClass = index;
      this.isClicked = true;
      if(this.sliderInterval) clearInterval(this.sliderInterval);
    },
    parallax() {
      const imgArr = document.querySelectorAll('.list-gallery__img');
      for(const img of imgArr) {
        this.$gsap.to(img, {
          yPercent: img.dataset.parralax,
          ease: 'none',
          scrollTrigger: {
            trigger: '.steps__title',
            start: `top bottom`,
            scrub: true
          },
        });
      }
    }
  }
}
</script>

<style lang="scss">
.steps {
  background: $white;
  padding: 85px 0 200px;
  overflow: hidden;
  &__title {
    max-width: 885px;
    margin: 0 auto 60px;
    font-weight: 700;
    font-size: 64px;
    line-height: 85px;
    text-align: center;
    span {
      font-weight: inherit;
      background: linear-gradient(90deg, #E64AFA 0%, #8C38FF 40.1%, #3CA1FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  &__list-wrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 -20px 60px;
  }
  &__col {
    flex: 1;
    max-width: 350px;
    margin: 0 20px;
  }

  @include bp($tablet) {
    padding: 70px 0 120px;
    &__title {
      font-size: 48px;
      line-height: 64px;
      max-width: 640px;
      margin: 0 auto 50px;
    }

    &__list-wrap {
      margin: 0 -10px 50px;
    }

    &__col {
      margin: 0 10px;
    }
  }

  @include bp($mobile) {
    padding: 50px 0 70px;
    &__title {
      font-size: 30px;
      line-height: 45px;
      max-width: 345px;
      margin: 0 auto 40px;
    }
    &__list-wrap {
      flex-direction: column;
    }
    &__col {
      max-width: 100%;
      &:not(:last-child) {
        margin: 0 0 20px;
      }
    }
  }
}
.step-item {
  &__top {
    display: flex;
    align-items: center;
    margin: 0 0 15px;
  }
  &__count,&__title {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    cursor: pointer;
  }

  &__count {
    color: #BDC2C7;
    margin: 0 20px 0 0;
  }

  &__text {
    cursor: pointer;
    font-size: 16px;
    line-height: 24px;
    color: #232323;
    margin: 0 0 30px;
  }

  &__line {
    width: 100%;
    height: 2px;
    background: rgba(#0E0E11, 0.1);
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background: #0E0E11;
      transform: scale(0,1);
      transform-origin: 0 50%;
    }
  }

  &.active {
    .step-item__title,
    .step-item__count {
      background: linear-gradient(90deg, #E64AFA 0%, #8C38FF 40.1%, #3CA1FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .step-item__line {
      &:after {
        transition: 5s;
        transform: scale(1,1);
      }
    }
  }

  &.isClicked.active {
    .step-item__line {
      &:after {
        transition: 0s;
        transform: scale(1,1);
      }
    }
  }

  @include bp($mobile) {
    margin: 0;
    &__count,&__title {
      font-size: 16px;
      line-height: 24px;
    }
    &__count {
      margin: 0 12px 0 0;
    }
    &__top {
      margin: 0 0 10px;
    }
    &__text {
      max-height: 0;
      display: block;
      overflow: hidden;
      transition: 0.35s;
      margin: 0;
    }
    &.active {
      .step-item__text {
        padding: 0 0 12px;
        max-height: 500px;
      }
    }
  }
}
.list-gallery {
  position: relative;
  display: flex;
  justify-content: center;
  &__col {
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    &:nth-child(1) {
      .list-gallery__img {
        &:nth-child(2) {
          left: 0;
          top: 48px;
          img {
            transition-delay: 0.1s;
          }
        }
        &:nth-child(3) {
          right: 0;
          top: 115px;
          img {
            transition-delay: 0.2s;
          }
        }
      }
    }
    &:nth-child(2) {
      .list-gallery__img {
        &:nth-child(2) {
          left: 0;
          top: 8px;
          img {
            transition-delay: 0.1s;
          }
        }
        &:nth-child(3) {
          right: 0;
          bottom: 40px;
          img {
            transition-delay: 0.2s;
          }
        }
        &:nth-child(4) {
          right: 355px;
          bottom: -50px;
          img {
            transition-delay: 0.3s;
          }

          @include bp($tablet) {
            right: 250px;
          }
        }
      }
    }
    &:nth-child(3) {
      .list-gallery__img {
        &:nth-child(2) {
          left: -20px;
          top: -8px;
          img {
            transition-delay: 0.1s;
          }
        }
        &:nth-child(3) {
          right: 0;
          bottom: -50px;
          img {
            transition-delay: 0.2s;
          }
        }
      }
    }

    &.active {
      position: relative;
      opacity: 1;
      .list-gallery__img {
        img {
          opacity: 1;
          clip-path: polygon(-50% -50%, 150% -50%, 150% 150%, -50% 150%);
        }
      }
    }

    @include bp($mobile) {
      width: auto;
    }
  }
  &__img {
    margin: 0 auto;
    max-width: 100%;
    display: block;
    &:first-child {
      img {
        border-radius: 19px;

        @include bp($tablet) {
          border-radius: 10px;
        }
      }
    }

    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4), {
      position: absolute;
      img {
        border-radius: 4px;
      }
    }

    img {
      transition: 0.5s;
      opacity: 0;
      clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
      box-shadow: 0 2px 32px rgba(0, 0, 0, 0.15);
      display: block;
    }
  }

  @include bp($mobile) {
    &__img {
      img {
        max-width: 100%;
      }
    }
  }
}
</style>

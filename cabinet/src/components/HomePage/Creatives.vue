<template>
  <section class="creatives">
    <div class="container container--main">
      <h2 class="creatives__title">Made by creatives <span>for creatives</span></h2>
      <ul class="creatives__tab">
        <li
          class="creatives__tab-item"
          :class="{active: activeIndex === index }"
          v-for="(item, index) in list"
          :key="index"
          @click="activeIndex = index"
        >
          {{item.tag}}
        </li>
      </ul>
      <div class="creatives__wrap">
        <div class="creatives__col">
          <div class="creatives__tab-container tab-container">
            <div
              class="tab-container__item"
              :class="{active: activeIndex === index }"
              v-for="(item, index) in list"
              :key="index"
            >
              <h3 class="tab-container__title">{{item.title}}</h3>
              <p class="tab-container__text" v-html="item.text"></p>
              <p class="tab-container__name">{{item.name}}</p>
              <p class="tab-container__position">{{item.position}}</p>
              <start-btn class="tab-container__btn" :to="item.link">Check our use cases</start-btn>
            </div>
          </div>
        </div>
        <div class="creatives__col parallax-creatives">
          <div
            class="creatives__col-item"
            :class="{active: activeIndex === index }"
            v-for="(item, index) in list"
            :key="index"
          >
            <responsive-image
              class="creatives__col-image"
              v-for="(image, indexImage) in item.image"
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
    </div>
  </section>
</template>

<script>
import ResponsiveImage from '@/components/Ui/ResponsiveImage.vue';
import ArrowRight from '@/assets/icons/arrow_right.svg?inline'
import StartBtn from '@/components/HomePage/StartBtn.vue';

export default {
  name: 'Creatives',
  components: {
    StartBtn,
    ResponsiveImage,
    ArrowRight
  },
  data() {
    return {
      activeIndex: 0,
      list: [
        {
          tag: 'NFT Creator',
          title: 'We open new opportunities for your own NFT marketplace',
          text: 'This effortless free editor is the only you need to share your ideas and creations instantly. Start creating your own page easily with <span class="highlight">drag and drop and no code.<span>',
          name: 'Xiang Yin',
          position: 'NFT Creator, artist',
          link: '#',
          image: [
            {
              src: '/Landing/creatives_1_1.jpg',
              sizes: [{size: '226', breakPoint: '$sm'}, {size: '232', breakPoint: '$md'}],
              width: '400',
              parallaxPercentage: 15
            },
            {
              src: '/Landing/creatives_1_2.jpg',
              sizes: [{size: '107', breakPoint: '$sm'}, {size: '110', breakPoint: '$md'}],
              width: '190',
              parallaxPercentage: 20
            },
            {
              src: '/Landing/creatives_1_3.jpg',
              sizes: [{size: '262', breakPoint: '$sm'}, {size: '269', breakPoint: '$md'}],
              width: '464',
              parallaxPercentage: 10
            },
          ]
        },
        {
          tag: 'Musician',
          title: 'We help musicians turn followers into diehard fans',
          text: 'This effortless free editor is the only you need to share your ideas and creations instantly. Start creating your own page easily with <span class="highlight">drag and drop and no code.<span>',
          name: 'Charlotte West',
          position: 'songwritter, musician',
          link: '#',
          image: [
            {
              src: '/Landing/creatives_2_1.jpg',
              sizes: [{size: '226', breakPoint: '$sm'}, {size: '232', breakPoint: '$md'}],
              width: '400',
              parallaxPercentage: 15
            },
            {
              src: '/Landing/creatives_2_2.jpg',
              sizes: [{size: '125', breakPoint: '$sm'}, {size: '125', breakPoint: '$md'}],
              width: '210',
              parallaxPercentage: 60
            },
            {
              src: '/Landing/creatives_2_3.jpg',
              sizes: [{size: '262', breakPoint: '$sm'}, {size: '267', breakPoint: '$md'}],
              width: '461',
              parallaxPercentage: 10
            },
            {
              src: '/Landing/creatives_2_4.jpg',
              sizes: [{size: '90', breakPoint: '$sm'}, {size: '90', breakPoint: '$md'}],
              width: '156',
              parallaxPercentage: 80
            },
          ]
        },
        {
          tag: 'Tutor',
          title: 'Refine your expertise and get more clients with us',
          text: 'This effortless free editor is the only you need to share your ideas and creations instantly. Start creating your own page easily with <span class="highlight">drag and drop and no code.<span>',
          name: 'Robert Nilan',
          position: 'English and French language tutor',
          link: '#',
          image: [
            {
              src: '/Landing/creatives_3_1.jpg',
              sizes: [{size: '226', breakPoint: '$sm'}, {size: '232', breakPoint: '$md'}],
              width: '400',
              parallaxPercentage: 15
            },
            {
              src: '/Landing/creatives_3_2.jpg',
              sizes: [{size: '125', breakPoint: '$sm'}, {size: '125', breakPoint: '$md'}],
              width: '210',
              parallaxPercentage: 60
            },
            {
              src: '/Landing/creatives_3_3.jpg',
              sizes: [{size: '262', breakPoint: '$sm'}, {size: '268', breakPoint: '$md'}],
              width: '462',
              parallaxPercentage: 10
            },
          ]
        },
        {
          tag: 'Podcaster',
          title: 'We help turn casual listeners into true fans',
          text: 'This effortless free editor is the only you need to share your ideas and creations instantly. Start creating your own page easily with <span class="highlight">drag and drop and no code.<span>',
          name: 'Adam Sayles',
          position: 'Podcaster',
          link: '#',
          image: [
            {
              src: '/Landing/creatives_4_1.jpg',
              sizes: [{size: '226', breakPoint: '$sm'}, {size: '232', breakPoint: '$md'}],
              width: '400',
              parallaxPercentage: 15
            },
            {
              src: '/Landing/creatives_4_2.jpg',
              sizes: [{size: '125', breakPoint: '$sm'}, {size: '156', breakPoint: '$md'}],
              width: '270',
              parallaxPercentage: 60
            },
            {
              src: '/Landing/creatives_4_3.jpg',
              sizes: [{size: '261', breakPoint: '$sm'}, {size: '268', breakPoint: '$md'}],
              width: '462',
              parallaxPercentage: 10
            },
            {
              src: '/Landing/creatives_4_4.jpg',
              sizes: [{size: '152', breakPoint: '$sm'}, {size: '156', breakPoint: '$md'}],
              width: '270',
              parallaxPercentage: 80
            },
          ]
        },
        {
          tag: 'Designer',
          title: 'Get more clients and be inspiration for others',
          text: 'This effortless free editor is the only you need to share your ideas and creations instantly. Start creating your own page easily with <span class="highlight">drag and drop and no code.<span>',
          name: 'Martin Schnagl',
          position: 'Art-director, Web designer',
          link: '#',
          image: [
            {
              src: '/Landing/creatives_5_1.jpg',
              sizes: [{size: '226', breakPoint: '$sm'}, {size: '232', breakPoint: '$md'}],
              width: '400',
              parallaxPercentage: 15
            },
            {
              src: '/Landing/creatives_5_2.jpg',
              sizes: [{size: '152', breakPoint: '$sm'}, {size: '156', breakPoint: '$md'}],
              width: '270',
              parallaxPercentage: 60
            },
            {
              src: '/Landing/creatives_5_3.jpg',
              sizes: [{size: '261', breakPoint: '$sm'}, {size: '268', breakPoint: '$md'}],
              width: '462',
              parallaxPercentage: 10
            },
          ]
        },
        {
          tag: 'Developer',
          title: 'You’ll collect your best portfolio with our platform',
          text: 'This effortless free editor is the only you need to share your ideas and creations instantly. Start creating your own page easily with <span class="highlight">drag and drop and no code.<span>',
          name: 'Christina Stevenson',
          position: 'Front-end developer',
          link: '#',
          image: [
            {
              src: '/Landing/creatives_6_1.jpg',
              sizes: [{size: '226', breakPoint: '$sm'}, {size: '232', breakPoint: '$md'}],
              width: '400',
              parallaxPercentage: 15
            },
            {
              src: '/Landing/creatives_6_2.jpg',
              sizes: [{size: '144', breakPoint: '$sm'}, {size: '148', breakPoint: '$md'}],
              width: '256',
              parallaxPercentage: 60
            },
            {
              src: '/Landing/creatives_6_3.jpg',
              sizes: [{size: '261', breakPoint: '$sm'}, {size: '268', breakPoint: '$md'}],
              width: '462',
              parallaxPercentage: 10
            },
            {
              src: '/Landing/creatives_6_4.jpg',
              sizes: [{size: '70', breakPoint: '$sm'}, {size: '71', breakPoint: '$md'}],
              width: '123',
              parallaxPercentage: 80
            },
          ]
        },
      ]
    }
  },
  mounted() {
    this.parallax();
    this.$emit('onComponentLoad');
  },
  methods: {
    parallax() {
      const imgArr = document.querySelectorAll('.creatives__col-image');
      for(const img of imgArr) {
        this.$gsap.to(img, {
          yPercent: img.dataset.parralax,
          ease: 'none',
          scrollTrigger: {
            trigger: '.parallax-creatives',
            start: `top top+=200`,
            scrub: true
          },
        });
      }
    }
  }
}
</script>

<style lang="scss">
.creatives {
  padding: 85px 0 100px;
  background: #0e0e11;

  @include bp($tablet) {
    padding: 70px 0 80px;
  }

  @include bp($mobile) {
    padding: 50px 0;
  }

  &__wrap {
    display: flex;
    flex-wrap: wrap;
  }

  &__col {
    &:first-child {
      max-width: 610px;
      width: 100%;
      @include bp($tablet) {
        max-width: 354px;
      }
    }
    &:nth-child(2) {
      margin: 0 0 0 20px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      @include bp($mobile) {
        margin: 0;
      }
    }
  }

  &__title {
    font-weight: 700;
    font-size: 64px;
    line-height: 85px;
    color: $white;
    margin: 0 0 55px;
    max-width: 610px;

    @include bp($tablet) {
      max-width: 465px;
      font-size: 48px;
      line-height: 64px;
    }

    @include bp($mobile) {
      max-width: 300px;
      font-size: 30px;
      line-height: 45px;
      margin: 0 0 40px;
    }

    span {
      font-weight: inherit;
      background: linear-gradient(119.66deg, #34315B 8.06%, #6A85AE 24.99%, #79AAC6 37.16%, #A8C5DA 54.16%, #BDC6E9 68.9%, #EAB6DA 83.64%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }

  &__tab {
    display: flex;
    justify-content: space-between;
    max-width: 610px;
    width: 100%;
    position: relative;

    @include bp($tablet) {
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 0 15px;
    }

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -15px;
      width: 100%;
      height: 2px;
      background: #FFFFFF;
      opacity: 0.3;

      @include bp($tablet) {
        bottom: 0;
      }
    }

    &-item {
      flex: 0 0 auto;
      font-size: 16px;
      line-height: 24px;
      color: $white;
      opacity: 0.5;
      position: relative;
      cursor: pointer;
      transition: 0.3s;

      @include bp($tablet) {
        &:not(:last-child) {
          margin: 0 30px 0 0;
        }
      }
      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -15px;
        width: 100%;
        height: 2px;
        background: $white;
        opacity: 0;
        transition: 0.3s;
      }

      &:before {
        content: '';
        left: -10px;
        bottom: -10px;
        height: calc(100% + 20px);
        width: calc(100% + 20px);
        position: absolute;
        z-index: 10;
      }

      &.active {
        opacity: 1;
        &:after {
          opacity: 1;
        }
      }

      &:hover {
        opacity: 1;
      }
    }

    @include bp($tablet) {
      max-width: unset;
    }
  }

  &__col {
    position: relative;
    &-item {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      width: 100%;
      height: 150%;
      top: 0;
      left: 0;
      opacity: 0;
      transition: 0.3s;
      transform: translate(0, -25%);

      &:nth-child(2) {
        .creatives__col-image {
          &:nth-child(4) {
            top: 127px;
            right: 77px;
          }
        }
      }
      &:nth-child(4) {
        .creatives__col-image {
          &:nth-child(4) {
            top: 370px;
            right: 20px;
          }
        }
      }
      &:nth-child(6) {
        .creatives__col-image {
          &:nth-child(4) {
            top: 125px;
            right: 20px;
          }
        }
      }

      &.active {
        opacity: 1;

        .creatives__col-image img {
          clip-path: polygon(-50% -50%, 150% -50%, 150% 150%, -50% 150%);
          transform: unset;
        }
      }

      @include bp($tablet) {
        height: 100%;
        transform: unset;
      }

      @include bp($mobile) {
        padding: 50px 0 100px;

        &.active {
          position: relative;
        }
      }
    }
    &-image {
      img {
        border-radius: 5px;
        transition: 0.5s;
        clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
        transform: translate(10px, 0);
      }
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        position: absolute;
        img {
          filter: drop-shadow(0px 3px 35px rgba(0, 0, 0, 0.15));
        }
      }

      &:nth-child(2) {
        top: 20px;
        right: 0;
        img {
          transition-delay: 0.1s;
        }
      }
      &:nth-child(3) {
        bottom: 0;
        left: 0;
        img {
          transition-delay: 0.2s;
        }
      }
      &:nth-child(4) {
        img {
          transition-delay: 0.3s;
        }
      }
    }
  }
}

.tab-container {
  padding: 40px 0 0;
  position: relative;
  &__item {
    position: absolute;
    left: 0;
    top: 40px;
    width: 100%;
    height: 100%;
    transition: 0.3s;
    opacity: 0;

    &.active {
      position: unset;
      opacity: 1;
    }
  }
  &__title {
    font-weight: 600;
    font-size: 36px;
    line-height: 54px;
    letter-spacing: -0.02em;
    color: $white;
    margin: 0 0 23px;
    @include bp($tablet) {
      font-size: 30px;
      line-height: 45px;
      max-width: 354px;
    }
    @include bp($mobile) {
      font-size: 26px;
      line-height: 39px;
      margin: 0 0 20px;
    }
  }
  &__text {
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: #979797;
    margin: 0 0 15px;
    max-width: 432px;
    padding: 0 0 0 20px;
    position: relative;

    &:after {
      position: absolute;
      left: 0;
      top: 0;
      content: '“';
      font-weight: 500;
      font-size: 25px;
      line-height: 38px;
      letter-spacing: -0.03em;
      color: $white;
    }

    .highlight {
      color: $white;
    }

    @include bp($mobile) {
      font-size: 16px;
      line-height: 24px;
      margin: 0 0 20px;
    }
  }
  &__name {
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    font-feature-settings: 'liga' off;
    color: #979797;
    margin: 0 0 1px;
  }
  &__position {
    font-weight: 700;
    font-size: 10px;
    line-height: 15px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #979797;
    margin: 0 0 30px;
  }
  &__btn {
    display: inline-flex!important;
  }
}
</style>

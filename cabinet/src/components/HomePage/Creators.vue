<template>
  <section class="creators">
    <div class="container container--main">
      <h2 class="creators__title">Creators, who made <span>their dreams a reality</span></h2>
      <p class="creators__text">This effortless free editor is the only you need to share your ideas and creations instantly. Start creating your own page easily with drag and drop and no code.</p>
      <start-btn class="creators__btn" to="/">
        Join our community
      </start-btn>
    </div>
    <div class="creators__list">
      <client-only>
        <agile v-bind="settings">
          <div class="creators__list-item" v-for="(itemImg, indexImg) in images" :key="indexImg">
            <responsive-image
              :is-imgix="true"
              :sizes="itemImg.sizes"
              :img-src="itemImg.src"
              width="247"
            />
            <p class="creators__name">{{itemImg.text}}</p>
            <p class="creators__position">{{itemImg.position}}</p>
          </div>
        </agile>
      </client-only>
    </div>
  </section>
</template>

<script>
import ResponsiveImage from '@/components/Ui/ResponsiveImage.vue';
import StartBtn from '@/components/HomePage/StartBtn.vue';

export default {
  name: 'Creators',
  components: {
    ResponsiveImage,
    StartBtn
  },
  data() {
    return {
      settings: {
        navButtons: false,
        slidesToShow: 3,
        initialSlide: 0,
        swipeDistance: 0,
        centerMode: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 6,
              centerMode: false
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 4,
              centerMode: false
            }
          }
        ]
      },
      images: [
        {
          src: '/Landing/сreators_1.png',
          sizes: [{size: '127', breakPoint: '$sm'}, {size: '200', breakPoint: '$md'}],
          text: 'Edith Lloyd',
          position: 'Singer/songwriter'
        },
        {
          src: '/Landing/сreators_2.png',
          sizes: [{size: '127', breakPoint: '$sm'}, {size: '200', breakPoint: '$md'}],
          text: 'Freddie Perry',
          position: 'Author & podcaster'
        },
        {
          src: '/Landing/сreators_3.png',
          sizes: [{size: '127', breakPoint: '$sm'}, {size: '200', breakPoint: '$md'}],
          text: 'Bianca Ward',
          position: 'Wildlife photographer'
        },
        {
          src: '/Landing/сreators_4.png',
          sizes: [{size: '127', breakPoint: '$sm'}, {size: '200', breakPoint: '$md'}],
          text: 'Milena Webb',
          position: 'Violinist & songwriter'
        },
        {
          src: '/Landing/сreators_5.png',
          sizes: [{size: '127', breakPoint: '$sm'}, {size: '200', breakPoint: '$md'}],
          text: 'Jasper Elliott',
          position: 'UX/UI Designer'
        },
        {
          src: '/Landing/сreators_6.png',
          sizes: [{size: '127', breakPoint: '$sm'}, {size: '200', breakPoint: '$md'}],
          text: 'Gabriel Guallado',
          position: 'CEO at Digital Agency'
        }
      ]
    }
  },
  mounted() {
    this.$emit('onComponentLoad');
  }
}
</script>

<style lang="scss">
.creators {
  background: #0E0E11;
  padding: 85px 0 100px;
  text-align: center;
  @include bp($tablet) {
    padding: 70px 0 80px;
  }
  @include bp($tablet) {
    padding: 50px 0;
  }
  &__title {
    font-weight: 700;
    font-size: 64px;
    line-height: 85px;
    color: $white;
    max-width: 826px;
    margin: 0 auto 20px;

    span {
      font-weight: inherit;
      background: linear-gradient(119.66deg, #34315B -18.06%, #6A85AE 24.99%, #79AAC6 37.16%, #A8C5DA 54.16%, #BDC6E9 68.9%, #EAB6DA 120.64%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }

    @include bp($tablet) {
      font-size: 48px;
      line-height: 64px;
    }
    @include bp($mobile) {
      font-size: 30px;
      line-height: 45px;
      margin: 0 auto 20px;
    }
  }
  &__text {
    max-width: 513px;
    margin: 0 auto 30px;
    color: #EBEBEB;
    font-size: 16px;
    line-height: 24px;
    @include bp($mobile) {
      font-size: 14px;
      line-height: 21px;
      margin: 0 0 40px;
    }
  }
  &__btn {
    margin: 0 auto 20px;
  }
  &__list {
    margin: 0 -157px;
    &-item {
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      align-items: center;
      img {
        max-width: 100%;
      }
    }
    @include bp($tablet) {
      margin: 0 -75px;
    }
    @include bp($mobile) {
      margin: 0 -63px;
    }
  }
  &__name {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    margin: 15px 0 3px;
    color: $white;

    @include bp($mobile) {
      font-size: 16px;
      line-height: 24px;
    }
  }
  &__position {
    font-weight: 700;
    font-size: 10px;
    line-height: 15px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #FFFFFF;
    opacity: 0.5;
  }
}
</style>

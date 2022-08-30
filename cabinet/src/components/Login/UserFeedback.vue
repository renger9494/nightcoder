<template>
  <div class="users">
    <div class="userFeedback">
      <VueSlickCarousel
        :dots="false"
        :arrows="false"
        :edgeFriction="0.35"
        :infinite="false"
        :speed="500"
        :slidesToShow="1"
        :slidesToScroll="1"
        :accessibility="false"
        :draggable="false"
        :swipe="false"
        :touchMove="false"
        ref="carouselPhoto"
        class="userFeedback__photo"
      >
        <div v-for="(user, index) in users" :key="index">
          <responsive-image
            :is-imgix="true"
            :is-blur="true"
            :sizes="[
              { size: '377', breakPoint: '$sm' },
              { size: '632', breakPoint: '$md' },
            ]"
            :img-src="user.photo"
            width="953"
          />
        </div>
      </VueSlickCarousel>
      <div class="userFeedback__container">
        <VueSlickCarousel
          :dots="false"
          :arrows="false"
          :edgeFriction="0.35"
          :infinite="false"
          :speed="500"
          :slidesToShow="1"
          :slidesToScroll="1"
          :adaptiveHeight="true"
          :adaptiveWidht="true"
          :asNavFor="$refs.carouselPhoto"
          ref="carouselFeedback"
          @beforeChange="changeActivUser"
        >
          <div v-for="(user, index) in users" :key="index">
            <p class="userFeedback__text">“{{ user.feedback }}”</p>
            <div class="userFeedback__user">
              <img :src="user.avatar" srcset="img/profile/avatar@2x.jpg 2x" />
              <span>{{ user.name }}</span>
            </div>
          </div>
        </VueSlickCarousel>
        <div class="userFeedback__nav">
          <ul class="userFeedback__nav__ellipse">
            <li
              v-for="item in users.length"
              :key="item"
              @click="showByIndex(item - 1)"
            >
              <svg-icon
                width="6"
                height="6"
                :color="item - 1 == activUser ? '#000000' : '#DADADA'"
                name="icon-ellipse"
              />
            </li>
          </ul>
          <div class="userFeedback__nav__arrow">
            <div @click="showPrevious">
              <svg-icon width="12" height="7" name="VectorLeft" />
            </div>
            <div @click="showNext">
              <svg-icon width="12" height="7" name="VectorRight" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueSlickCarousel from 'vue-slick-carousel'
import ResponsiveImage from '@/components/Ui/ResponsiveImage.vue'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default Vue.extend({
  components: { VueSlickCarousel, ResponsiveImage },
  data() {
    return {
      users: [
        {
          photo: '/Landing/login_girl.jpg',
          avatar: '/img/profile/avatar.jpg',
          name: 'Mary Jane Watson, photographer',
          feedback:
            'I didn’t have any experience in web development before. But with Airtap I’ve made my first portfolio so easy!',
        },
        {
          photo: '/Landing/login_girl.jpg',
          avatar: '/img/profile/avatar.jpg',
          name: 'Mary Jane Watson, Photographer',
          feedback:
            'I didn’t have any experience in web development before. But with Airtap I’ve made my first portfolio so easy!',
        },
      ],
      activUser: 0,
    }
  },
  methods: {
    showNext() {
      if (this.$refs.carouselFeedback)
        (this.$refs.carouselFeedback as any).next()
      if (this.$refs.carouselPhoto) (this.$refs.carouselPhoto as any).next()
    },
    showPrevious() {
      if (this.$refs.carouselFeedback)
        (this.$refs.carouselFeedback as any).prev()
      if (this.$refs.carouselPhoto) (this.$refs.carouselPhoto as any).prev()
    },
    showByIndex(index: number) {
      this.activUser = index
      if (this.$refs.carouselFeedback)
        (this.$refs.carouselFeedback as any).goTo(index)
      if (this.$refs.carouselPhoto)
        (this.$refs.carouselPhoto as any).goTo(index)
    },
    changeActivUser(indexold: number, index: number) {
      this.activUser = index
    },
  },
})
</script>
<style lang="scss">
.userFeedback {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);
  min-height: 586px;
  display: flex;
  justify-content: center;
  &__photo {
    width: 100%;
    height: calc(100vh - 60px);
    min-height: 586px;
    position: absolute;
    img {
      width: 100%;
      height: calc(100vh - 60px);
      min-height: 586px;
      object-fit: cover;
      object-position: center;
      position: relative;
    }
  }
  &__container {
    position: absolute;
    bottom: -5px;
    margin: auto 30px 30px 30px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border-radius: 8px;
    padding: 30px;
    font-family: 'Poppins';
    width: 580px;
  }
  &__text {
    font-weight: 400;
    font-size: 25px;
    line-height: 38px;
    color: #000000;
  }
  &__user {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      border-radius: 20px;
    }
    span {
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
      color: #202020;
    }
  }
  &__nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    &__ellipse {
      display: flex;
      flex-direction: row;
      align-items: center;
      li {
        margin-right: 8px;
      }
    }
    &__arrow {
      display: flex;
      flex-direction: row;
      align-items: center;
      div {
        margin-left: 16px;
      }
    }
  }
}
@media screen and (max-width: 1300px) {
  .userFeedback {
    &__container {
      width: 480px;
    }
  }
}
@media screen and (max-width: 1100px) {
  .userFeedback {
    &__container {
      width: 380px;
    }
  }
}
@media screen and (max-width: 768px) {
  .userFeedback {
    &__text {
      font-size: 16px;
      line-height: 24px;
    }
    &__container {
      margin: auto 20px 20px 20px;
      padding: 15px;
      width: 300px;
    }
  }
}
@media screen and (max-width: 630px) {
  .userFeedback {
    margin-top: 50px;
    height: 500px;
    min-height: 500px;

    &__photo {
      height: 500px;
      min-height: 500px;
      img {
        height: 500px;
        min-height: 500px;
      }
    }
    &__container {
      margin: auto 15px 15px 15px;
      padding: 15px;
      width: 80%;
    }
    &__text {
      font-size: 16px;
      line-height: 24px;
    }
    &__user {
      margin-top: 16px;
      span {
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
}
</style>

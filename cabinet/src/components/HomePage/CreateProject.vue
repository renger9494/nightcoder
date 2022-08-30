<template>
  <div class="create-project">
    <div class="container container--main">
      <h2 class="create-project__title">Let’s start your <span>first project</span></h2>
      <start-btn class="create-project__btn" to="/">
        Start building — it’s free
      </start-btn>
    </div>
  </div>
</template>

<script>
import StartBtn from '@/components/HomePage/StartBtn.vue';
export default {
  name: 'CreateProject',
  components: {
    StartBtn
  }
}
</script>

<style lang="scss" scoped>
.create-project {
  padding: 127px 0 327px;
  background: url("https://itmeo.imgix.net/Landing/footer_bg.jpg?auto=format&width=1920&dpr=1") no-repeat 50% 100%;
  background-size: cover;
  text-align: center;

  @include bp(1280px) {
    background: #0E0E11 url("https://itmeo.imgix.net/Landing/footer_bg.jpg?auto=format&width=1280&dpr=1") no-repeat 50% 100%;
    background-size: cover;
  }

  @include retinaSize(1512px) {
    background: #0E0E11 url("https://itmeo.imgix.net/Landing/footer_bg.jpg?auto=format&width=1512&dpr=1") no-repeat 50% 100%;
    background-size: cover;
  }

  @include retinaSize(1440px) {
    background: #0E0E11 url("https://itmeo.imgix.net/Landing/footer_bg.jpg?auto=format&width=1440&dpr=1") no-repeat 50% 100%;
    background-size: cover;
  }

  @include bp($mobile) {
    padding: 100px 0 353;
    background: #0E0E11 url("https://itmeo.imgix.net/Landing/footer_bg.jpg?auto=format&width=767&dpr=1") no-repeat 50% 100%;
    background-size: 150% 100%;
  }

  @include retinaSize($mobile) {
    background: #0E0E11 url("https://itmeo.imgix.net/Landing/footer_bg.jpg?auto=format&width=767&dpr=2") no-repeat 50% 100%;
    background-size: 150% 100%;
  }

  &__title {
    font-weight: 700;
    font-size: 64px;
    line-height: 85px;
    max-width: 628px;
    margin: 0 auto 40px;
    color: $white;
    span {
      font-weight: inherit;
      background: linear-gradient(119.66deg, #34315B -28.06%, #6A85AE 24.99%, #79AAC6 37.16%, #A8C5DA 54.16%, #BDC6E9 68.9%, #EAB6DA 128.64%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }

    @include bp($tablet) {
      font-size: 48px;
      line-height: 64px;
      max-width: 463px;
    }

    @include bp($mobile) {
      font-size: 30px;
      line-height: 45px;
      max-width: 250px;
    }
  }

  &__btn {
    margin: 0 auto;
  }
}
</style>

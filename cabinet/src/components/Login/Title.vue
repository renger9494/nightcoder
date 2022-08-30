<template>
  <div class="loginPage__title">
    <svg-icon width="40" height="33" name="logo-content" />
    <div class="loginPage__title__header">
      <p>{{ title }}</p>
      <img :src="urlImage" :srcset="urlImage2x" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    title: {
      type: String,
      default: '',
    },
    urlImage: {
      type: String,
      default: '',
    },
    urlImage2x: {
      type: String,
      default: '',
    },
  },
})
</script>

<style lang="scss">
.loginPage__title {
  font-family: 'Poppins';
  font-style: normal;
  &__header {
    img {
      display: inline;
      // width: 36px;
      height: 36px;
      margin-left: 3px;
    }
  }
  p {
    display: inline;
    font-weight: 500;
  }

  font-size: 32px;
  line-height: 48px;
  color: #000000;
  margin-bottom: 30px;
}
@media screen and (max-width: 630px) {
  .loginPage__title {
    margin-top: 50px;
    font-size: 30px;
    line-height: 45px;
  }
}
</style>

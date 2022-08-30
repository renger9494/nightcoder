<template>
  <button class="socialLogin" type="button" @click="action()">
    <svg-icon
      class="socialLogin__image"
      width="16"
      height="15"
      :name="buttonImage"
    />
    <!--   <svg-icon
      class="socialLogin__image-hover"
      width="16"
      height="15"
      folder="login"
      :name="buttonImageActive"
    /> -->
    <span>{{ buttonText }}</span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    socialNetwork: String,
    action: Function,
    buttonText: String,
  },
  computed: {
    buttonImage(): String {
      return this.socialNetwork === 'google'
        ? 'google'
        : this.socialNetwork === 'apple'
        ? 'appleLogo'
        : ''
    },
    buttonImageActive(): String {
      return this.socialNetwork === 'google'
        ? 'googleLogo'
        : this.socialNetwork === 'apple'
        ? 'appleLogoWhite'
        : ''
    },
  },
})
</script>

<style lang="scss">
.socialLogin {
  width: 100%;
  border: 1px solid #dadada;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 9px 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  cursor: pointer;
  &__image {
    margin-right: 10px;
  }
  span {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    color: #000000;
  }
  &__image-hover {
    display: none;
    //visibility: hidden;
  }
  &:hover {
    background: #000000;
    span {
      color: #ffffff;
    }
    /* .socialLogin__image-hover {
      display: inline-block;
      //visibility: visible;
    }
    .socialLogin__image {
      display: none;
      // visibility: hidden;
    } */
  }
}
@media screen and (max-width: 414px) {
  .socialLogin {
    span {
      font-size: 12px;
      line-height: 18px;
    }
  }
}
</style>

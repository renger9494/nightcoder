<template>
  <div class="profile-popup-component">
    <div class="profile-popup-component__overlay"></div>
    <div class="profile-popup cancel" v-click-outside="closeModal">
      <button class="profile-popup__close" @click="closeModal">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M17.6674 2.21901L10.9258 8.9607L18 16.0349L16.0349 18L8.9607 10.9258L2.24924 17.6372L0.362781 15.7508L7.07424 9.0393L0 1.96507L1.96507 0L9.0393 7.07424L15.781 0.33255L17.6674 2.21901Z"
            fill="#BFBFBF"
          />
        </svg>
      </button>
      <h2 class="profile-popup__title">Are you sure you want to cancel the subscription?</h2>
      <p class="profile-popup__desc">Canceling your subscription you agree to lose access to your plan</p>
      <button class="profile-popup__btn" @click="cancelModal">Cancel Subscription</button>
      <button class="profile-popup__link-btn" @click="closeModal">I`m not sure</button>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'unsubscribe-modal',
  props: {
    closeModal: {
      type: Function,
      required: true
    },
    cancelModal: {
      type: Function,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.profile-popup-component {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1002;
  width: 100%;
  height: 100%;
  &__overlay {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.2);
    opacity: 1;
    z-index: 1;
  }
}
.profile-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 860px;
  width: 100%;
  height: auto !important;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 100px 0 120px;
  box-shadow: 0 1px 4px rgba(0, 0,  0 , 0.06);

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    background: none;
    cursor: pointer;
    width: 18px;
    height: 18px;
    top: 14px;
    right: 14px;
  }
  &.cancel {
    //background-image: url(https://d10z6vylcn8rcd.cloudfront.net/images/profilePopupCancel.png);
    background: $white;
    .profile-popup__btn {
      background: $black;
      color: $white;
    }
  }
  &__title {
    font-style: normal;
    font-weight: normal;
    font-size: 32px;
    line-height: 48px;
    letter-spacing: -1px;
    max-width: 460px;
    color: $black;
    margin-bottom: 14px;
  }
  &__desc {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
    max-width: 350px;
    text-align: center;
    margin-bottom: 38px;
    color: $black;
  }
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 240px;
    height: 46px;
    background: #f30016;
    border-radius: 11px;
    font-weight: 500;
    font-size: 20px;
    line-height: 30px;
    color: $black;
    margin-bottom: 28px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      opacity: 0.8;
    }
  }
  &__link-btn {
    background: none;
    border: none;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 30px;
    color: #666666;
    cursor: pointer;
  }
}

@media only screen and (max-width: 767px) {
  .profile-popup {
    padding: 80px 15px 53px;
    &__title {
      font-size: 26px;
      line-height: 39px;
    }
  }
}
</style>

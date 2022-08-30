<template>
  <div class='mobile-alert'>
    <a class='mobile-alert__close-button' href="#" @click.prevent="closePopup">
      <svg-icon name="close"  width="8" height="8" color="#BDBDBD" />
    </a>
    <h1 class='mobile-alert__title'>You should login with desktop browser </h1>
    <p class='mobile-alert__text'>Airtap is working on screen resolution from 1200 px.</p>
    <img
      src="/img/modals/delete-project-illustration.png"
      srcset="/img/modals/delete-project-illustration.png, /img/modals/delete-project-illustration@2x.png 2x"
      alt="delete"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MobileAlertModal',
  methods: {
    closePopup() {
      this.$store.dispatch("ui/closeModal");
    }
  }
})
</script>

<style lang="scss" scoped>
.mobile-alert {
  text-align: center;
  background: $white;
  box-shadow: $shadow_popup;
  border-radius: $shape_border_radius * 2;
  width: 100%;
  max-width: 560px;
  padding: 80px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: 1000;
  display: table;

  @include bp(600px) {
    max-width: calc(100vw - 30px);
    padding: 30px;
  }

  &__close-button {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f2f2f2;
    border-radius: 50%;
    transition: 0.3s;

    &:hover {
      background-color: #828282;

      path {
        fill: #ffffff;
      }
    }

    &:active {
      background-color: #333333;

      path {
        fill: #ffffff;
      }
    }

    path {
      fill: #bdbdbd;
      transition: 0.3s;
    }
  }

  &__title {
    font-weight: bold;
    font-size: 32px;
    line-height: 40px;
    color: #000000;
    margin: 0 0 31px;
  }
  &__text {
    font-weight: normal;
    font-size: 18px;
    line-height: 27px;
    font-feature-settings: 'liga' off;
    color: #000000;
    margin: 0 auto 66px;
    max-width: 311px;
  }
}
</style>

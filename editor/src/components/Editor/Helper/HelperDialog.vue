<template>
  <div class="helper-dialog">
    <div class="helper-dialog__list">
      <div class="helper-dialog__list-item">
        <p>Help Center</p>
      </div>
      <div class="helper-dialog__list-item">
        <p>Support Forum</p>
      </div>
      <div class="helper-dialog__list-divider"></div>

      <div class="helper-dialog__list-item" @click="$emit('helperPopupClick')">
        <p>Keyboard shortcut</p>
        <p>Ctrl+Shift+H</p>
      </div>

      <div class="helper-dialog__list-item" @click="$emit('openTour')">
        <p>Product tour</p>
      </div>

      <div class="helper-dialog__list-divider"></div>
      <div class="helper-dialog__list-item" @click="openFeedbackPopup">
        <p>Submit feedback</p>
      </div>
      <div class="helper-dialog__list-item">
        <p>Contact support</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelperDialog',
  methods: {
    openFeedbackPopup() {
      this.$store.commit('ui/changeFeedbackOpenType', true);
    }
  }
});
</script>

<style lang="scss" scoped>
.helper-dialog {
  position: absolute;
  right: 0;
  top: 0;
  transform: translateY(calc(-100% - 16px));
  padding: $margin_s;
  background: $white;
  border: 1px solid $gray100;
  box-shadow: 0 10px 20px rgba(130, 130, 130, 0.15);
  border-radius: $shape_border_radius;
  width: 225px;
  cursor: default;
  outline: none;

  &__list {
    &-item {
      border-radius: $shape_border_radius;
      padding: 6px 8px;
      transition: 0.3s;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      p {
        font-size: 12px;
        line-height: 16px;
        color: $black;
      }

      &:hover {
        background: $gray100;
      }
    }

    &-divider {
      margin: $margin_s 0;
      height: 1px;
      width: 100%;
      background: $gray100;
    }
  }
}
</style>

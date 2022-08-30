<template>
  <div class="submissions-download">
    <div class="submissions-download__head" :class="{ active: isPopupOpen }" @click="togglePopup">
      <svg-icon
        width="16"
        height="16"
        color="#000000"
        name="dropdown_arrow"
      />
      Download CSV
    </div>
    <transition name="fade">
      <div class="submissions-download__body" v-if="isPopupOpen" v-click-outside="() => isPopupOpen = null">
        <div class="submissions-download__body-item">Download all</div>
        <div class="submissions-download__body-item">Download selected</div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SvgIcon from "~/components/Shared/SvgIcon.vue";

export default Vue.extend({
  name: 'SubmissionsDownloadDropdown',
  components: {
    SvgIcon
  },
  data() {
    return {
      isPopupOpen: false
    }
  },
  methods: {
    togglePopup() {
      this.isPopupOpen = !this.isPopupOpen;
    }
  }
});
</script>

<style lang="scss" scoped>
.submissions-download {
  position: relative;
  &__head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 16px;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    font-feature-settings: 'liga' off;
    border: 1px solid $gray100;
    border-radius: $shape_border_radius;
    cursor: pointer;
    transition: 0.3s;

    svg {
      transition: 0.3s;
    }

    &:hover {
      border-color: $gray400;
    }

    &.active {
      border-color: $blue200;
      svg {
        color: $blue200!important;
      }
    }

    @include bp($sm) {
      font-size: 12px;
      line-height: 18px;
      padding: 7px 12px;
    }
  }
  &__body {
    position: absolute;
    right: 0;
    bottom: -4px;
    transform: translateY(100%);
    padding: 8px;
    background: $white;
    box-shadow: $shadow_small;
    border-radius: 4px;
    width: 100%;
    z-index: 20;

    &-item {
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: 0.3s;
      border-radius: $shape_border_radius;

      &:hover {
        background: $gray100;
      }

      &:not(:last-child) {
        margin: 0 0 8px;
      }

      &.isNotPro {
        pointer-events: none;
        color: rgba($black, 0.5);
      }

      &--red {
        color: $danger;

        &.isNotPro {
          color: rgba($danger, 0.5);
        }
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

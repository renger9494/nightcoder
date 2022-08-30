<template>
  <div class="submissions-delete">
    <div class="submissions-delete__button" @click="isPopupOpen = !isPopupOpen">
      ...
    </div>
    <transition name="fade">
      <div
        class="submissions-delete__body"
        v-if="isPopupOpen"
        v-click-outside="() => (isPopupOpen = false)"
      >
        <div
          @click="openDeletePopup(false)"
          v-if="count > 0"
          class="submissions-delete__body-item"
          :class="{ isNotPro: !isPro }"
        >
          Delete selected
          <span v-if="!isPro" class="submissions-delete__badge">Pro</span>
        </div>
        <div
          @click="openDeletePopup(true)"
          class="
            submissions-delete__body-item
            submissions-download__body-item--red
          "
          :class="{ isNotPro: !isPro }"
        >
          Delete all
          <span v-if="!isPro" class="submissions-delete__badge">Pro</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SubmissionsDeleteDropdown',
  props: {
    openDeletePopup: {
      type: Function,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    isPro: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isPopupOpen: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.submissions-delete {
  position: relative;
  &__button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $shape_border_radius;
    padding: 0 0 9px;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      background: $gray100;
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
    width: 180px;
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

  &__badge {
    padding: 2px 4px;
    background: $black;
    border-radius: 4px;
    font-weight: 600;
    font-size: 13px;
    line-height: 20px;
    color: #ffc557;
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

<template>
  <div class="submissions-popup">
    <div class="submissions-popup__head" @click="isPopupOpen = !isPopupOpen">
      <span v-if="!selectedAction">All actions</span>
      <span v-else >{{ EmailActions[selectedAction] }}</span>
      <svg-icon
        width="16"
        height="16"
        color="#000000"
        name="dropdown_arrow"
      />
    </div>
    <transition name="fade">
      <div
        class="submissions-popup__body"
        v-if="isPopupOpen"
        v-click-outside="() => (isPopupOpen = false)"
      >
        <div
          class="submissions-popup__item"
          v-for="(action, index) in actionsArr"
          :key="index"
          @click.prevent.stop="selectAction(action[0])"
          :class="{ active: action[0] === selectedAction }"
        >
          <p class="submissions-popup__text">{{ action[1] }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SvgIcon from '@/components/Shared/SvgIcon.vue';
import Checkbox from '@/components/Shared/ui/Сheckbox.vue';
import { EmailActions } from './SubmissionsTable.vue';

export default Vue.extend({
  name: 'SubmissionsActionsPopup',
  components: {Checkbox, SvgIcon},
  data() {
    return {
      isPopupOpen: false,
      EmailActions
    }
  },
  props: {
    selectedAction: {
      required: true
    },
    actions: {
      type: Object,
      required: true
    },
  },
  computed: {
    actionsArr(): Array<any> {
      return Object.entries(this.actions);
    }
  },
  methods: {
    selectAction(action: EmailActions) {
      this.isPopupOpen = false;
      this.$emit('selectedActionChange', action === this.selectedAction ? null : action);
    }
  }
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.submissions-popup {
  position: relative;
  user-select: none;

  &__head {
    border: 1px solid $color_input_border;
    border-radius: $shape_border_radius;
    display: flex;
    align-items: center;
    padding: 8px;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    transition: 0.3s;
    cursor: pointer;

    svg {
      margin: 0 0 0 auto;
    }

    &:hover {
      border-color: $gray400;
    }

    span {
      display: inline-block;
      width: 114px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    @include bp($sm) {
      width: 100%;
    }
  }

  &__body {
    left: 0;
    bottom: -5px;
    transform: translateY(100%);
    position: absolute;
    background: $white;
    box-shadow: $shadow_small;
    border-radius: $shape_border_radius;
    padding: 15px;
    width: 250px;
    z-index: 20;
    max-height: 300px;
    overflow-y: auto;

    @include bp($sm) {
      width: 100%;
    }

    &::-webkit-scrollbar {
      width: 4px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #bdc2c7;
      height: 30px;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-track-piece {
      display: none;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    position: relative;

    &:after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    &:not(:last-child) {
      margin: 0 0 12px;
    }

    &:hover, &.active {
      .submissions-popup__text {
        color: $blue200;
      }
    }
  }

  &__img {
    background-size: cover;
    background-position: 50%;
    @include size(30px, 24px);
    border-radius: $shape_border_radius;
  }

  &__text {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    max-width: 159px;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    transition: 0.3s;
  }
}
</style>

<template>
  <div class="notifications-top-popup">
    <div
      class="
        notifications-top-popup__button notifications-top-popup__button--gray
      "
      :class="{ 'notifications-top-popup__button--hidden': isMarkUnreadBtnShown }"
      @click="markAllAsRead"
    >
      <svg-icon width="16" height="16" color="#000" name="email" />
      Mark all as read
    </div>
    <nuxt-link
      v-show="false"
      to="/dashboard/settings"
      class="
        notifications-top-popup__button notifications-top-popup__button--outline
      "
    >
      <svg-icon width="16" height="16" color="#000" name="settings" />
      Notification Settings
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SvgIcon from '~/components/Shared/SvgIcon.vue'

export default Vue.extend({
  name: 'NotificationsTopPopup',
  components: { SvgIcon },
  props: {
    isMarkUnreadBtnShown: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    markAllAsRead() {
      this.$emit('markAllAsRead')
    },
  },
})
</script>

<style lang="scss" scoped>
.notifications-top-popup {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;

  &__button {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid transparent;
    border-radius: $shape_border_radius;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    font-feature-settings: 'liga' off;
    text-decoration: none;
    color: $black;
    cursor: pointer;
    transition: 0.3s;

    &--gray {
      background: $gray100;
      border-color: $gray100;

      &:hover {
        background: transparent;
      }
    }

    &--outline {
      border-color: $gray100;

      &:hover {
        background: $gray100;
      }
    }

    &--hidden {
      visibility: hidden;
      opacity: 0;
    }
  }
}
</style>

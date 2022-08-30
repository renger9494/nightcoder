<template>
  <div class="notifications">
    <div class="notifications__btn" @click="isOpen = !isOpen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="20"
        height="20"
      >
        <use
          :xlink:href="`/img/components/header/sprite.svg#icon-ring`"
          :href="`/img/components/header/sprite.svg#icon-ring`"
        />
      </svg>
      <div v-if="countUnread > 0" class="notifications__btn-ring"></div>
    </div>
    <transition name="fade">
      <div
        class="notifications__popup popup-container"
        v-if="isOpen"
        v-click-outside="() => (isOpen = false)"
      >
        <div class="popup-container__top">
          <p class="popup-container__title">
            Notifications <span v-if="countUnread > 0">{{ countUnread }}</span>
          </p>
          <div class="popup-container__close" @click="isOpen = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="8"
              height="8"
              style="color: #bdbdbd"
            >
              <use
                :xlink:href="`/img/components/header/sprite.svg#icon-close`"
                :href="`/img/components/header/sprite.svg#icon-close`"
              />
            </svg>
          </div>
        </div>
        <div class="popup-container__wrap">
          <template v-if="countUnread > 0">
            <p class="popup-container__text">New</p>
            <notifications-item
              v-for="(item, index) in unreadNotifications"
              :data="item"
              :key="`${index}_unread`"
              :is-header="true"
            />
            <div class="popup-container__divider"></div>
            <p
              v-if="readNotifications.length > 0"
              class="popup-container__text"
            >
              Earlier
            </p>
          </template>
          <notifications-item
            v-for="(item, index) in readNotifications"
            :data="item"
            :isProPlan="isProPlan"
            :index="index"
            :key="`${index}_read`"
            :is-header="true"
          />
          <div class="popup-container__empty" v-if="!notifications.length">
            <p class="popup-container__empty-text">
              There are no notifications on this list.
            </p>
            <img
              class="popup-container__empty-img"
              src="/img/dashboard/empty_state.svg"
              alt="image empty airtap"
            />
          </div>
        </div>
        <a
          href="/dashboard/notifications"
          class="popup-container__btn"
          @click="isOpen = false"
          >View All
        </a>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import apiClient from '../../utils/apiClient'
import NotificationsItem from './NotificationsItem.vue'
import { NotificationDto, PlanCategory } from '../../utils/api'
export default Vue.extend({
  name: 'Notifications',
  components: { NotificationsItem },
  data() {
    return {
      notifications: [] as NotificationDto[],
      isOpen: false,
    }
  },
  async mounted() {
    try {
      let filter = {
        PageSize: 8,
        PageNumber: 1,
      } as any
      const { data: notifications } =
        await apiClient.notifications.notificationsGet(filter)
      this.notifications = notifications.items
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapState({
      category: (state: any) => state.auth.user.plan.category,
      userisAdmin: (state: any) => state.auth.user.isAdmin,
      countUnread: (state: any) => state.auth.user.plan.unreadNotifications,
    }),
    isProPlan(): boolean {
      return this.category == PlanCategory.Pro || this.userisAdmin
    },
    readNotifications(): Array<Object> {
      return this.countUnread > 0
        ? this.notifications.filter((item) => item.isRead)
        : this.notifications
    },
    unreadNotifications(): Array<Object> {
      return this.notifications.filter((item) => !item.isRead)
    },
  },
})
</script>

<style lang="scss" scoped>
.notifications {
  position: relative;
  &__btn {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;

    svg {
      transition: 0.3s;
    }

    &-ring {
      right: 0;
      top: 0;
      position: absolute;
      @include size(8px);
      background: #173bef;
      border-radius: 50%;
      border: 1px solid $white;
    }

    &:hover {
      svg {
        color: $gray700;
      }
    }
  }
}
.popup-container {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translate(0, 100%);
  padding: 30px;
  background: $white;
  box-shadow: 0 8px 20px rgba(130, 130, 130, 0.2);
  border-radius: $shape_border_radius * 2;
  width: 412px;
  user-select: none;

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 16px;
    margin: 0 0 16px;
    border-bottom: 1px solid $gray200;
  }

  &__close {
    @include size(20px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f2f2f2;
    cursor: pointer;

    svg {
      transition: 0.3s;
    }

    &:hover {
      svg {
        color: $black !important;
      }
    }
  }

  &__title {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;

    ::v-deep span {
      display: inline-block;
      margin: 0 0 0 8px;
      padding: 0 7px;
      background: #318bf5;
      border-radius: $shape_border_radius;
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
      color: $white;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    &-text {
      font-size: 13px;
      line-height: 20px;
      margin: 0 0 20px;
    }
    &-img {
      max-width: 120px;
    }
  }

  &__btn {
    display: block;
    margin: 16px 0 0;
    background: $gray600;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    font-feature-settings: 'liga' off;
    color: $white;
    text-align: center;
    padding: 8px;
    transition: 0.3s;
    cursor: pointer;
    border: 1px solid transparent;
    text-decoration: none;

    &:hover {
      background: $white;
      color: $gray600;
      border-color: $gray600;
    }
  }

  &__text {
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    font-feature-settings: 'liga' off;
    margin: 0 0 16px;
  }

  &__divider {
    border-bottom: 1px solid $gray200;
    margin: 0 0 16px;
  }

  &__wrap {
    overflow-y: auto;
    height: 400px;
    padding: 0 4px 0 0;
    margin: 0 -4px 0 0;

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
}
</style>

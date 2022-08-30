<template>
  <div class="notifications">
    <div class="notifications__top">
      <h2 class="notifications__title">Notifications</h2>
      <notifications-top-popup
        class="notifications__dropdown-top"
        :is-mark-unread-btn-shown="!unreadNotifications.length"
        @markAllAsRead="markAllAsRead"
      />
    </div>
    <div class="notifications__bottom">
      <div class="notifications__bottom-left">
        <div v-if="isLoading">
          <skeleton
            class="notifications__skeleton"
            v-for="index in 10"
            :key="index"
            max-width="100%"
            height="37"
            width="100%"
            radius="4"
          />
        </div>
        <p
          v-if="unreadNotifications.length > 0"
          class="notifications__bottom-title"
        >
          New
        </p>
        <notifications-item
          v-for="(item, index) in unreadNotifications"
          :data="item"
          :key="`${index}_unread`"
        />
        <p
          v-if="unreadNotifications.length > 0"
          class="notifications__bottom-title"
        >
          Earlier
        </p>
        <notifications-item
          v-for="(item, index) in readNotifications"
          :data="item"
          :isProPlan="isProPlan"
          :index="index"
          :key="`${index}_read`"
        />
        <div
          v-if="!isLoading && !readNotifications.length"
          class="notifications__empty"
        >
          <p class="notifications__empty-title">
            There are no notifications on this list.
          </p>
          <img
            class="notifications__empty-img"
            src="/img/dashboard/empty_state.svg"
            alt="image empty airtap"
          />
        </div>
      </div>
      <div
        class="notifications__bottom-right"
        :class="{ empty: !isLoading && !toFollow.length }"
      >
        <p
          class="notifications__bottom-title"
          v-if="!isLoading && toFollow.length"
        >
          Profiles you might like
        </p>
        <div
          class="notifications__bottom-wrap"
          v-if="!isLoading && toFollow.length"
        >
          <notifications-user-to-follow
            v-for="(user, index) in toFollow"
            :key="index"
            :data="user"
            @followUser="followUser"
          />
        </div>
        <div v-if="isLoading">
          <skeleton
            class="notifications__skeleton"
            v-for="index in 6"
            :key="index"
            max-width="100%"
            height="37"
            width="100%"
            radius="4"
          />
        </div>
      </div>
    </div>
    <pagination
      class="notifications__pagination"
      v-if="totalPages > 1"
      :page-number="pageNumber"
      :total-pages="totalPages"
      @loadingList="onPaginationChange"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import apiClient from '@/utils/apiClient'
import { mapState } from 'vuex'
import NotificationsTopPopup from './NotificationsTopPopup.vue'
import NotificationsItem from './NotificationsItem.vue'
import NotificationsUserToFollow from './NotificationsUserToFollow.vue'
import { NotificationDto, PlanCategory, WelcomeProfileDto } from '@/utils/api'
import Avatar from '~/components/Header/avatar/Avatar.vue'
import Skeleton from '~/components/Shared/ui/skeleton.vue'
import Pagination from '@/components/Shared/Pagination.vue'
export default Vue.extend({
  name: 'Notifications',
  components: {
    Skeleton,
    NotificationsUserToFollow,
    NotificationsItem,
    NotificationsTopPopup,
    Avatar,
    Pagination,
  },
  data() {
    return {
      notifications: [] as NotificationDto[],
      toFollow: [] as WelcomeProfileDto[],
      pageNumber: 1,
      totalPages: 1,
      isLoading: true,
    }
  },
  async mounted() {
    try {
      this.pageNumber = this.$route.query.PageNumber
        ? Number(this.$route.query.PageNumber)
        : 1
      let filter = {
        PageSize: 16,
        PageNumber: this.pageNumber,
      } as any
      const { data: notifications } =
        await apiClient.notifications.notificationsGet(filter)
      const { data: users } = await apiClient.profiles.profilesGetWelcome({
        PageSize: 6,
        PageNumber: 1,
      })
      this.notifications = notifications.items
      this.totalPages = notifications.pagination.totalPages
      this.toFollow = users.items
      this.isLoading = false
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapState({
      category: (state: any) => state.auth.user.plan.category,
      userisAdmin: (state: any) => state.auth.user.isAdmin,
    }),
    isProPlan(): boolean {
      return this.category == PlanCategory.Pro || this.userisAdmin
    },
    readNotifications(): Array<NotificationDto> {
      return this.notifications.filter((item) => item.isRead)
    },
    unreadNotifications(): Array<NotificationDto> {
      return this.notifications.filter((item) => !item.isRead)
    },
  },
  methods: {
    markAllAsRead() {
      apiClient.notifications
        .notificationsReadAll()
        .then(() => {
          this.notifications.forEach((item) => {
            item.isRead = true
          })
          this.$store.commit('auth/readAllNotifications')
        })
        .catch((error) => {})
    },
    followUser(user: WelcomeProfileDto) {
      if (!user.userName) {
        return
      }
      apiClient.profiles
        .profilesToggleProfileFollow(user.userName)
        .then(() => {
          user.followed = !user.followed
        })
        .catch((error) => {})
    },
    onPaginationChange(page: number) {
      this.pageNumber = page
      this.getNotifications()
    },
    getNotifications() {
      this.isLoading = true
      let filter = {
        PageSize: 16,
        PageNumber: this.pageNumber,
      } as any

      apiClient.notifications
        .notificationsGet(filter)
        .then(({ data }) => {
          this.notifications = data.items
          this.totalPages = data.pagination.totalPages
          this.isLoading = false
        })
        .catch((error) => {})
    },
  },
})
</script>

<style lang="scss" scoped>
.notifications {
  padding: 30px 0;
  height: 100%;
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin: 0 0 30px;

    @include bp($sm) {
      margin: 0 0 12px;
    }
  }
  &__title {
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
    font-feature-settings: 'liga' off;
    margin: 0 auto 0 0;
    flex: 1;

    @include bp(920px) {
      width: 100%;
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      font-feature-settings: 'liga' off;
      margin: 0 0 12px;
    }
  }
  &__dropdown-top {
    margin: 0 0 0 auto;
  }
  &__date {
    width: 100%;
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: $gray600;
  }
  &__actions {
    margin: 30px 0 20px;
  }
  &__filter {
    max-width: 200px;
  }
  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 30px;

    &-title {
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
      font-feature-settings: 'liga' off;
      margin: 0 0 16px;
    }

    &-left {
      flex: 1;

      padding: 0 4px 0 0;
      margin: 0 -4px 0 0;
    }

    &-right {
      flex: 0 0 300px;
      background: #f3f3f3;
      border-radius: $shape_border_radius * 2;
      padding: 16px;
      position: sticky;
      top: 80px;

      &.empty {
        display: none;
      }
    }

    @include bp($sm) {
      flex-direction: column;

      &-left {
        order: 2;
        max-height: 100%;
        width: 100%;
      }
      &-right {
        order: 1;
        width: 100%;
        flex: 0 0 100%;
      }
      &-wrap {
        display: flex;
        align-items: center;
        overflow-x: auto;
      }
    }
  }
  &__skeleton {
    &:not(:last-child) {
      margin: 0 0 16px;
    }
  }
  &__empty {
    max-height: calc(100vh - 185px);
    min-height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &-title {
      margin: 0 0 8px;
      font-weight: 400;
      font-size: 25px;
      line-height: 38px;
      font-feature-settings: 'liga' off;
    }

    &-img {
      margin: 30px 0 0;
    }
  }
}
</style>

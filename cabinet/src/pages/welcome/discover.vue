<template>
  <div class="discover">
    <p class="discover__header-1">
      Discover more
      <span class="discover__header-1__gradient"> popular creators</span>
      and start following them
    </p>

    <div>
      <template v-if="!isLoading">
        <FeedUsers
          class="discover__list"
          :users="users"
          @followUser="followUser"
        />
      </template>
      <template v-else>
        <div
          class="discover__user skeleton"
          v-for="item in 2"
          :key="`${item}skeleton`"
        >
          <div class="skeleton__avatar">
            <skeleton max-width="100%" height="100" width="100" radius="50" />
            <skeleton max-width="100%" height="19" width="150" radius="4" />
          </div>
          <div class="skeleton__project">
            <skeleton max-width="100%" height="140" width="182" radius="8" />
            <skeleton max-width="100%" height="140" width="182" radius="8" />
          </div>
        </div>
      </template>
    </div>
    <div class="discover__link" @click="goToFeed">Go to Discover</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { WelcomeProfileDto } from '@/utils/api'
import apiClient from '@/utils/apiClient'
import Loader from '@/components/Shared/ui/loader.vue'
import Avatar from '@/components/Header/avatar/Avatar.vue'
import ButtonFollow from '@/components/Settings/Profile/ButtonFollow.vue'
import Skeleton from '@/components/Shared/ui/skeleton.vue'
import FeedUsers from '@/components/Discover/FeedUsers.vue'
export default Vue.extend({
  layout: 'profile',
  head() {
    return {
      title: 'Discover',
    }
  },
  middleware: ['auth'],
  components: { Loader, Avatar, ButtonFollow, Skeleton, FeedUsers },
  data() {
    return {
      users: [] as WelcomeProfileDto[],
      isLoading: true,
    }
  },
  async asyncData({ route, redirect }) {
    try {
      let filter: any = {
        PageSize: 6,
        PageNumber: 1,
      }
      const { data } = await apiClient.profiles.profilesGetWelcome(filter)
      return {
        users: data.items,
        isLoading: false,
      }
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapState({
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
    }),
  },
  methods: {
    goToFeed() {
      this.$router.push(`/feed`)
    },
    followUser(user: WelcomeProfileDto) {
      if (!this.isUserLoggedIn) {
        this.$router.push({
          path: '/login',
          query: { redirectUrl: this.$route.fullPath },
        })
        return
      }
      if (user.owned) {
        this.$router.push({
          path: '/settings/profile',
        })
        return
      }
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
  },
})
</script>

<style lang="scss" scoped>
.discover {
  font-family: 'Poppins', sans-serif;
  padding: 60px $margin_page_desktop 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__header-1 {
    font-weight: 600;
    font-size: 32px;
    line-height: 48px;
    max-width: 562px;
    text-align: center;
    margin: 0 auto 60px;
    &__gradient {
      background: linear-gradient(
        90deg,
        #e64afa 0%,
        #8c38ff 40.1%,
        #3ca1ff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
      text-fill-color: transparent;
    }
  }
  &__link {
    margin-top: 20px;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    color: #bdc2c7;
    cursor: pointer;
    &:hover {
      color: $black;
    }
  }
  &__list {
    display: grid;
    grid-template-columns: 432px 432px;
    grid-template-rows: repeat(3, 188px);
    grid-gap: 30px;
    justify-content: center;
  }
}
.skeleton {
  display: flex;
  &__avatar {
    display: flex;
    .skeleton {
      &:first-child {
        flex: 0 0 100px;
        margin-right: 15px;
      }
      &:nth-child(2) {
        flex: 0 0 150px;
      }
    }
  }

  &__project {
    margin: 0 0 0 auto;
    display: flex;
    .skeleton {
      flex: 0 0 182px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .discover {
    padding: 30px $margin_page_tablet 0px;
    &__header-1 {
      margin-top: 30px;
      max-width: fit-content;
    }
  }
}

@media screen and (max-width: 414px) {
  .discover {
    padding: 30px $margin_page_mobile 0px;
    &__header-1 {
      margin-top: 20px;
      font-size: 30px;
      line-height: 45px;
    }
  }
}
</style>

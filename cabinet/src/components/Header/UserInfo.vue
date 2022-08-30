<template>
  <div v-if="user" class="user-info" :class="{ 'user-info_visible-dropdown': isProfileDropdownVisible }">
    <notifications class="user-info__notification" />
    <div class="user-info__inner" @click="toggleProfileDropdown">
      <picture v-if="user.avatar">
        <source
          v-if="user.avatar.fullPathWebP"
          type="image/webp"
          :srcset="user.avatar.fullPathWebP.replace(' ', '%20')"
        />
        <source v-if="user.avatar.fullPathJp2" type="image/jp2" :srcset="user.avatar.fullPathJp2.replace(' ', '%20')" />
        <img class="user-info__avatar" v-if="user.avatar.fullPath" :src="user.avatar.fullPath" />
      </picture>
      <avatar class="user-info__avatar" v-else :size="30" :name="avatarName" />
      <span class="user-info__name">{{ user.fullName }}</span>
      <svg class="user-info__triangle" xmlns="http://www.w3.org/2000/svg" width="7" height="5">
        <path
          fill-rule="evenodd"
          d="M4.174 4.6809l2.6865-3.5445c.1667-.2227.187-.5109.0447-.7492C6.763.1492 6.4866 0 6.186 0H.8129C.512 0 .2357.1492.0935.3872.0325.4942 0 .6113 0 .7277c0 .1434.0488.286.1422.4087l2.6865 3.5445c.1504.1997.4024.3191.6707.3191.2682 0 .5202-.1193.6746-.3191z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </div>
    <profile-dropdown
      class="user-info__profile-dropdown"
      :activeDropdownItem="activeProfileDropdownItem"
      :isVisible="isProfileDropdownVisible"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import ProfileDropdown from './ProfileDropdown.vue'
import Avatar from './avatar/Avatar.vue'
import Notifications from './Notifications.vue';
import { AccountDto } from '../../utils/api'

export default Vue.extend({
  props: {
    activeProfileDropdownItem: String,
    isProfileDropdownVisible: Boolean,
    toggleProfileDropdown: Function,
  },
  components: {
    Avatar,
    ProfileDropdown,
    Notifications,
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
    }),
    avatarName(): string {
      return !!this.user.fullName ? this.user.fullName : 'itmeo'
    },
  },
})
</script>

<style lang="scss" scoped>
.user-info {
  position: relative;
  border-left: 1px solid #dadada;
  padding-left: 16px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;

  &__notification {
    margin: 0 16px 0 0;
  }
  &_visible-dropdown {
    .user-info {
      &__triangle {
        transform: rotate(90deg);
      }
    }
  }

  &__inner {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__avatar {
    width: 30px;
    height: 30px;
    margin-right: 14px;
    border-radius: 30px;
  }

  &__name {
    font-size: 14px;
    line-height: 21px;
    color: #000000;
    margin-right: 5px;
    user-select: none;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 250px;
  }

  &__triangle {
    transition: 0.2s;

    path {
      fill: #000000;
    }
  }
}
@media screen and (max-width: 890px) {
  .user-info__name {
    display: none;
  }
}
</style>

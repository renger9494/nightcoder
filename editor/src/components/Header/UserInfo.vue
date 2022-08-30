<template>
  <div class="user-info" :class="{ 'user-info_visible-dropdown': isProfileDropdownVisible }">
    <div class="user-info__inner" v-on:click="toggleProfileDropdown">
      <img
        class="user-info__avatar"
        src="@/assets/img/projects/avatar.jpg"
        srcset="@/assets/img/projects/avatar@2x.jpg 2x"
        :alt="name"
      />
      <span class="user-info__name">{{ name }}</span>
      <svg class="user-info__triangle" xmlns="http://www.w3.org/2000/svg" width="7" height="5">
        <path
          fill-rule="evenodd"
          d="M4.174 4.6809l2.6865-3.5445c.1667-.2227.187-.5109.0447-.7492C6.763.1492 6.4866 0 6.186 0H.8129C.512 0 .2357.1492.0935.3872.0325.4942 0 .6113 0 .7277c0 .1434.0488.286.1422.4087l2.6865 3.5445c.1504.1997.4024.3191.6707.3191.2682 0 .5202-.1193.6746-.3191z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <profile-dropdown
      class="user-info__profile-dropdown"
      :name="name"
      :email="email"
      :avatarUrl="avatarUrl"
      :activeDropdownItem="activeProfileDropdownItem"
      :isVisible="isProfileDropdownVisible"
    />
  </div>
</template>

<script>
import ProfileDropdown from '@/components/Header/ProfileDropdown.vue';

export default {
  props: {
    name: String,
    email: String,
    avatarUrl: String,
    activeProfileDropdownItem: String,
    isProfileDropdownVisible: Boolean,
    toggleProfileDropdown: Function
  },
  components: {
    ProfileDropdown
  }
};
</script>

<style lang="scss" scoped>
.user-info {
  position: relative;
  border-left: 1px solid #dadada;
  padding-left: 20px;

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
  }

  &__name {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-right: 5px;
    user-select: none;
  }

  &__triangle {
    transition: 0.2s;

    path {
      fill: #000000;
    }
  }
}
</style>
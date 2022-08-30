<template>
  <div class="user-to-follow">
    <a class="user-to-follow__link" :href="`/${data.userName}`" target="_blank">
      <picture v-if="data.avatar">
        <source
          v-if="data.avatar.fullPathWebP"
          type="image/webp"
          :srcset="data.avatar.fullPathWebP.replace(' ', '%20')"
        />
        <source
          v-if="data.avatar.fullPathJp2"
          type="image/jp2"
          :srcset="data.avatar.fullPathJp2.replace(' ', '%20')"
        />
        <img
          class="user-to-follow__image"
          v-if="data.avatar.fullPath"
          :src="data.avatar.fullPath"
        />
      </picture>
      <avatar
        v-else
        size="30"
        :name="!!data.fullName ? data.fullName : 'itmeo'"
        class="user-to-follow__image"
      />
    </a>
    <a :href="`/${data.userName}`" class="user-to-follow__name">{{
      data.fullName
    }}</a>
    <div class="user-to-follow__follow" @click="followUser(data)">
      {{ data.followed ? 'Unfollow' : 'Follow' }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { WelcomeProfileDto } from '@/utils/api'
import Avatar from '@/components/Header/avatar/Avatar.vue'
export default Vue.extend({
  name: 'NotificationsUserToFollow',
  components: {
    Avatar,
  },
  props: {
    data: {
      type: Object as PropType<WelcomeProfileDto>,
      required: true,
    },
  },
  methods: {
    followUser(user: WelcomeProfileDto) {
      this.$emit('followUser', user)
    },
  },
})
</script>

<style lang="scss" scoped>
.user-to-follow {
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin: 0 0 16px;
    padding: 0 0 16px;
    border-bottom: 1px solid $gray200;
  }
  &__image {
    margin: 0 8px 0 0;
    @include size(30px);
    border-radius: 50%;
    transition: 0.3s;
  }
  &:hover {
    .user-to-follow__image {
      opacity: 0.8;
    }
  }
  &__name {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: $gray900;
    margin: 0 auto 0 0;
    cursor: pointer;
    border: 1px solid transparent;
    transition: 0.3s;
    text-decoration: underline transparent;
    &:hover {
      text-decoration: underline #173bef;
      color: #173bef;
    }
  }
  &__follow {
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    font-feature-settings: 'liga' off;
    color: #173bef;
    cursor: pointer;
    &:hover {
      color: #318bf5;
    }
  }

  @include bp($sm) {
    width: 280px;
    flex: 0 0 280px;
    padding: 16px;
    background: $white;
    border-radius: $shape_border_radius;
    &:not(:last-child) {
      margin: 0 16px 0 0;
      padding: 16px;
      border-bottom: unset;
    }
  }
}
</style>

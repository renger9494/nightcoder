<template>
  <button
    class="follower__button"
    id="follow"
    type="button"
    @click="change"
    :class="{ unfollow: isFollowed && !isOwned, templateButton: isTemplate }"
  >
    <svg-icon width="16" height="16" color="#fff" :name="buttonImage" />
    <span> {{ buttonText }} </span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    isFollowed: {
      type: Boolean,
      default: false,
    },
    isOwned: {
      type: Boolean,
      default: false,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonText(): String {
      return this.isOwned
        ? 'Edit profile'
        : this.isTemplate
        ? 'Start Edit'
        : this.isFollowed
        ? 'Unfollow'
        : 'Follow'
    },
    buttonImage(): String {
      return this.isOwned || this.isTemplate
        ? 'editProfile'
        : this.isFollowed
        ? 'unfollow'
        : 'follow'
    },
  },
  methods: {
    change() {
      this.$emit('change')
    },
  },
})
</script>

<style lang="scss">
.follower__button {
  box-sizing: border-box;
  min-width: fit-content;
  font-size: 13px;
  transition: 0.3s;
  border-radius: $shape_border_radius;
  outline: none;
  line-height: 19px;
  background-color: $black;
  border: 1px solid transparent;
  padding: 8px 16px;
  color: $white;
  height: 36px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  span {
    font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    font-weight: 500;
    white-space: nowrap;
    margin-left: 8px;
  }
  cursor: pointer;
  &:hover {
    background: #333333;
  }

  &:active {
    opacity: 1;
  }
}
.templateButton {
  padding: 14px 30px;
  height: 48px;
}
.unfollow {
  color: $black;
  background-color: $white;
  border: 1px solid #000000;
  &:hover {
    background: #ebebeb;
    border: 1px solid #ebebeb;
  }
}
@media screen and (max-width: 414px) {
  .follower__button {
    font-size: 12px;
    line-height: 18px;
    height: 34px;
  }
}
</style>

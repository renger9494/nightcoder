<template>
  <div class="email">
    <span class="email__label">Email</span>
    <div class="email__change-email" @click="onChangeEmailClick(false)">
      Change Email
    </div>
    <div class="email__section">
      <span class="email__value">{{ value }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true,
    },
    onChangeEmailClick: {
      type: Function,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.email {
  display: flex;
  flex-direction: column;
  width: 350px;
  //height: 100%;

  &__label {
    font-size: 13px;
    line-height: 14px;
    color: #000;
    margin-bottom: 4px;
  }

  &__section {
    display: flex;
    align-items: center;
    height: 36px;
    position: relative;
    border: 1px solid #dadada;
    padding: 10px 6px;
    border-radius: $shape_border_radius;
    :read-only {
      opacity: 0.6;
    }
  }

  &__value {
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    width: 100%;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__change-email {
    position: absolute;
    top: -1px;
    left: 350px;
    font-size: 10px;
    text-decoration: none;
    white-space: nowrap;
    color: #000000;
    padding: 2px 4px;
    transition: 0.3s;
    border-radius: $shape_border_radius;
    transform: translateX(-100%);
    cursor: pointer;
    &:hover {
      background-color: #f2f2f2;
    }

    &:active {
      background-color: #dadada;
    }
  }
}
@media screen and (max-width: 414px) {
  .email {
    width: 100%;
    &__change-email {
      left: 100%;
    }
  }
}
</style>



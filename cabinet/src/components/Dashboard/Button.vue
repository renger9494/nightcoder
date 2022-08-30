<template>
  <button
    class="dashboard__button"
    :class="{ background__whiteBackground: white }"
    id="follow"
    type="button"
    @click="click"
  >
    <svg-icon
      v-if="image"
      width="16"
      height="16"
      :name="image"
      :color="white ? '#000' : '#fff'"
    />
    <span> {{ text }} </span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    text: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    white: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    click() {
      this.$emit('click')
    },
  },
})
</script>

<style lang="scss">
.dashboard__button {
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
  &__whiteBackground {
    background-color: $black;
    color: $white;
  }
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
@media screen and (max-width: 414px) {
  .dashboard__button {
    font-size: 12px;
    line-height: 18px;
    height: 34px;
  }
}
</style>

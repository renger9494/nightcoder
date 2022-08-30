<template>
  <button
    class="projects__button"
    :class="{ background__whiteBackground: white }"
    id="follow"
    type="button"
    @click.stop="showPublishPopup"
  >
    <svg-icon name="new_publish" width="16" height="17" color="#fff"/>
    {{ text }}
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import SvgIcon from "~/components/Shared/SvgIcon.vue";

export default Vue.extend({
  components: {SvgIcon},
  props: {
    text: {
      type: String,
      default: '',
    },
    white: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    showPublishPopup() {
      this.$emit('showPublishPopup')
    },
  },
})
</script>

<style lang="scss">
.projects__button {
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  min-width: fit-content;
  font-size: 12px;
  font-weight: 400;
  transition: 0.3s;
  border-radius: $shape_border_radius;
  outline: none;
  line-height: 18px;
  background-color: $black;
  border: 1px solid transparent;
  padding: 6px 10px;
  color: $white;
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  svg {
    margin: 0 4px 0 0;
  }
  &__whiteBackground {
    background-color: $black;
    color: $white;
  }
  cursor: pointer;
  &:hover {
    background: #333333;
  }

  &:active {
    opacity: 1;
  }
}
</style>

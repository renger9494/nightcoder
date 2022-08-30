<template>
  <div
    :style="`width: ${width}; background: ${gradient};`"
    class="cover-background"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { generateGradient } from '~/components/Header/avatar/utilities'

export default Vue.extend({
  name: 'cover-background',
  props: {
    userName: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: () => '100%',
    },
    height: {
      type: String,
      default: () => '200px',
    },
  },
  computed: {
    gradient(): string {
      return generateGradient(this.userName)
    },
  },
})
</script>

<style lang="scss" scoped>
.cover-background {
  height: 250px;

  @include bp(768px) {
    height: 180px;
  }

  @include bp(414px) {
    height: 150px;
  }
}
</style>

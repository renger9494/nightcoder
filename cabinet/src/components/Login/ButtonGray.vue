<template>
  <div>
    <router-link class="button-gray" v-if="!!to" :to="to" :class="{ 'button-center': isCenter }">
      <slot></slot>
    </router-link>
    <a class="button-gray" v-else :class="{ 'button-center': isCenter }" @click="onClick">
      <slot></slot>
    </a>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    to: String,
    isCenter: Boolean,
    onClick: { type: Function as PropType<() => {}>, default: () => {} },
  },
})
</script>

<style lang="scss">
.button-gray {
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  color: #000000;
  background: transparent;
  border-radius: $shape_border_radius;
  padding: 6px 10px;
  transition: background-color 0.3s ease;

  img {
    margin-left: 6px;
  }

  &:hover {
    cursor: pointer;
  }
}

.button-gray:hover {
  color: #000000;
  background: #f2f2f2;
}

.button-gray.button-center {
  width: 100px;
  margin: auto;
}
</style>

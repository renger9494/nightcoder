<template>
  <svg
    :class="className"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="width"
    :height="height"
    :style="`color: ${color};`"
  >
    <use :xlink:href="iconPath" :href="iconPath" x="0" y="0"></use>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
      default: 'close',
    },
    folder: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: null,
    },
    width: {
      type: [Number, String],
      default: 24,
    },
    height: {
      type: [Number, String],
      default: 24,
    },
    color: {
      type: String,
      default: '#000',
    },
  },
  methods: {},
  computed: {
    iconPath(): any {
      return `#icon-${this.name}`
    },
    className(): string {
      return `svg-icon svg-icon--${this.name}`
    },
  },
})
</script>
<style lang="scss">
.svg-icon {
  display: inline-block;
}
</style>


<template>
  <div class="switch" :class="{ right: activeItem == 1 }">
    <div
      class="switch__item"
      v-for="(item, index) in itemsList"
      :key="index"
      :class="{ active: item.term == activeItem }"
      @click="setActiveItem(item.term)"
    >
      {{ item.text }}
    </div>
    <div class="switch__slide"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'pricing-switch',
  props: {
    itemsList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeItem: 0
    }
  },
  methods: {
    setActiveItem(item: number) {
      this.$emit('onChange', item);
      this.activeItem = item;
    }
  }
})
</script>

<style lang="scss" scoped>
.switch {
  padding: 3px 4px;
  background: #F3F3F3;
  border-radius: 1000px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  &.right {
    .switch__slide {
      transform: translateX(100%);
    }
  }
  &__item {
    border-radius: 1000px;
    padding: 5px 16px;
    text-align: center;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    flex: 0 0 50%;
    position: relative;
    z-index: 2;
    &.active {
      color: $white;
    }
  }
  &__slide {
    background: #000000;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    border-radius: 1000px;
    position: absolute;
    left: 4px;
    top: 3px;
    width: 50%;
    height: calc(100% - 6px);
    transition: 0.3s;
  }
}
</style>

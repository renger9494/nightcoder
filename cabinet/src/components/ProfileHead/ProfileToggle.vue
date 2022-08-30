<template>
  <div class="profile-toggle">
    <a
      class="profile-toggle__link"
      v-for="(toggleItem, index) in toggleItems"
      :key="index"
      :class="{ active: currentToggleItem.name == toggleItem.name }"
      @click="changeActiveItem(toggleItem)"
    >
      {{ toggleItem.name }}: {{ toggleItem.count }}
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    toggleItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentToggleItem:
        this.toggleItems && this.toggleItems.length > 0
          ? this.toggleItems[0]
          : null,
    }
  },
  methods: {
    changeActiveItem(item: any) {
      this.currentToggleItem = item
      this.$emit('changeActiveItem', item)
    },
  },
})
</script>

<style lang="scss">
.profile-toggle {
  display: inline-flex;
  align-items: center;
  padding: 5px;
  background: #f2f2f2;
  border-radius: $shape_border_radius;
  cursor: pointer;
  &__link {
    display: flex;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    color: #000000;
    padding: 6px 16px;
    margin-right: 2px;
    transition: all 0.3s ease;
    border-radius: $shape_border_radius;
    text-decoration: none;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      background: #000;
      color: #fff;
    }
  }
}
</style>

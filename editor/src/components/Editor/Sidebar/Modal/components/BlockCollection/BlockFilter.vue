<template>
  <ul class="block-filter">
    <li
      v-for="(item, index) in filterList"
      :key="index"
      @click="onCategorySelect(item.id)"
      class="block-filter__item"
      :class="{ 'block-filter__item--active': item.id === activeCategoryId }"
    >
      {{ item.title }}
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BlockFilter',
  props: {
    filterList: {
      type: Array,
      required: true
    },
    activeCategoryId: {
      type: Number,
      required: false
    }
  },
  methods: {
    onCategorySelect(id: number) {
      this.$emit('change', this.activeCategoryId === id ? 0 : id);
    }
  }
});
</script>

<style lang="scss" scoped>
.block-filter {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -2px -4px;
  list-style: none;

  &__item {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    border-radius: $shape_border_radius;
    border: 1px solid $gray100;
    color: $black;
    padding: 4px 8px;
    margin: 0 2px 4px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background: $gray300;
    }

    &--active {
      background: $black;
      color: $white;
      border-color: $black;
    }
  }
}
</style>

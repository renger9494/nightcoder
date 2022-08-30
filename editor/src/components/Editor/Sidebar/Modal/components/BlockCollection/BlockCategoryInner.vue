<template>
  <div class="category-inner">
    <div class="category-inner__title">
      <h2 class="category-inner__title-text">{{ data.title }}</h2>
      <p class="category-inner__title-count">({{ data.blocks.length }})</p>
    </div>
    <block-card
      class="category-inner__block"
      v-for="block in data.blocks"
      :key="block.id"
      :block="block"
      :add-or-delete-favorite="addOrDeleteFavorite"
      :is-block-favorite="isBlockFavorite"
      :add-block="addBlock"
      :drag-star="dragStar"
      :drag-end="dragEnd"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BlockCard from './BlockCard.vue';

export default Vue.extend({
  name: 'BlockCategoryInner',
  components: { BlockCard },
  props: {
    data: {
      type: Object,
      required: true
    },
    addOrDeleteFavorite: {
      type: Function,
      required: true
    },
    isBlockFavorite: {
      type: Function,
      required: true
    },
    addBlock: {
      type: Function,
      required: true
    },
    dragStar: {
      type: Function,
      required: true
    },
    dragEnd: {
      type: Function,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
.category-inner {
  &__title {
    display: table;
    position: relative;
    margin: 0 0 $margin_s;

    &-text {
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
    }

    &-count {
      position: absolute;
      right: -2px;
      top: 0;
      transform: translate(100%, 0);
      font-weight: 400;
      font-size: 10px;
      line-height: 12px;
      color: $gray200;
    }
  }

  &__block {
    position: relative;
    &:not(:last-child) {
      margin: 0 0 $margin_l;
    }
  }
}
</style>

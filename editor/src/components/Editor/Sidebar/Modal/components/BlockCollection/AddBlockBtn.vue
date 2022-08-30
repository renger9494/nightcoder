<template>
  <div class="add-block-btn" @click="$emit('click')">
    <span>Add empty block</span>
    <svg-icon name="plus-icon" width="24" height="24" color="#000" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AddBlockBtn'
});
</script>

<style lang="scss" scoped>
.add-block-btn {
  padding: 4px 4px 4px 16px;
  background: $white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  border-radius: $shape_border_radius;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: $black;
  transition: 0.3s;

  span {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
  }

  svg {
    margin: 0 0 0 4px;
    transition: 0.3s;
  }

  &:hover {
    background: $black;
    color: $white;

    svg {
      color: $white !important;
    }
  }
}
</style>

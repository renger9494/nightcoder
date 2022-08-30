<template>
  <div class="editor-skeleton-bar">
    <skeleton
      v-for="index in 10"
      :key="index"
      class="editor-skeleton-bar__item"
      height="30"
      width="30"
      max-width="100%"
      radius="4"
    />
  </div>
</template>

<script>
import Skeleton from '@/components/Shared/ui/skeleton';
export default {
  name: 'editorSkeleton',
  components: { Skeleton }
};
</script>

<style lang="scss" scoped>
.editor-skeleton-bar {
  height: calc(100% - 61px);
  padding: $padding_l 0;
  width: 52px;
  position: absolute;
  left: 0;
  top: 61px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $white;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.06);

  &__item {
    &:not(:last-child) {
      margin: 0 0 $margin_l;
    }
    &:last-child {
      margin: auto 0 0;
    }
  }
}
</style>

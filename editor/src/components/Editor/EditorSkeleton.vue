<template>
  <div class="editor-skeleton">
    <div class="editor-skeleton__sidebar skeleton-sidebar">
      <div class="skeleton-sidebar__top">
        <skeleton class="skeleton-sidebar__top-item" height="16" width="50" radius="4" />
        <skeleton class="skeleton-sidebar__top-item" height="16" width="60" radius="4" />
        <skeleton class="skeleton-sidebar__top-item" height="16" width="40" radius="4" />
      </div>
      <div class="skeleton-sidebar__bottom">
        <skeleton
          v-for="(item, index) in list"
          :key="index"
          class="skeleton-sidebar__bottom-item"
          height="30"
          :width="item"
          max-width="100%"
          radius="4"
        />
      </div>
    </div>
    <div class="editor-skeleton__canvas" />
  </div>
</template>

<script>
import Skeleton from '@/components/Shared/ui/skeleton';
export default {
  name: 'editorSkeleton',
  components: { Skeleton },
  data() {
    return {
      list: [
        '240',
        '220',
        '56',
        '180',
        '240',
        '120',
        '240',
        '190',
        '56',
        '180',
        '240',
        '120',
        '240',
        '220',
        '56',
        '180',
        '240'
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.editor-skeleton {
  height: calc(100% - 60px);
  position: absolute;
  right: 0;
  top: 60px;
  z-index: 200;

  &__sidebar {
    width: 240px;
    height: 100%;
    background-color: $white;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.06);
  }
}

.skeleton-sidebar {
  &__top {
    padding: 16px 20px;
    display: flex;
    border-bottom: 1px solid #f3f3f3;
    &-item {
      &:first-child {
        margin: 0 20px 0 0;
      }
      &:last-child {
        margin: 0 0 0 auto;
      }
    }
  }
  &__bottom {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    &-item {
      margin: 0 0 2px;
    }
  }
}
</style>

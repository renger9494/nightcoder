<template>
  <div class="header-skeleton">
    <div class="header-skeleton__first">
      <div class="header-skeleton__logo">
        <svg-icon name="logo" width="34" height="34" />
      </div>
      <skeleton class="header-skeleton__first-item" height="16" width="92" radius="4" />
      <skeleton class="header-skeleton__first-item" height="16" width="92" radius="4" />
    </div>
    <div class="header-skeleton__mid">
      <skeleton class="header-skeleton__mid-item" height="32" width="140" radius="4" />
      <skeleton class="header-skeleton__mid-item" height="32" width="140" radius="4" />
    </div>
    <div class="header-skeleton__last">
      <skeleton class="header-skeleton__last-item" height="30" width="30" radius="4" />
      <skeleton class="header-skeleton__last-item" height="30" width="100" radius="4" />
      <skeleton class="header-skeleton__last-item" height="30" width="80" radius="4" />
      <skeleton class="header-skeleton__last-item" height="32" width="96" radius="4" />
    </div>
  </div>
</template>

<script>
import Skeleton from '@/components/Shared/ui/skeleton';
export default {
  name: 'HeaderSkeleton',
  components: { Skeleton }
};
</script>

<style lang="scss" scoped>
.header-skeleton {
  height: 60px;
  width: 100%;
  background-color: #ffffff;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba($black, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  z-index: 9999;
  left: 0;
  top: 0;

  &__first {
    margin: 0 86px 0 0;
    display: flex;
    align-items: center;
    &-item {
      &:nth-child(2) {
        margin: 0 12px 0 0;
      }
    }
  }

  &__logo {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 14px 0 0;
  }

  &__mid,
  &__last {
    display: flex;
    align-items: center;
  }

  &__mid-item {
    &:first-child {
      margin: 0 5px 0 0;
    }
  }

  &__last {
    &-item {
      &:first-child {
        margin: 0 5px 0 0;
      }
      &:nth-child(2) {
        margin: 0 5px 0 0;
      }
      &:last-child {
        margin: 0 0 0 20px;
      }
    }
  }
}
</style>

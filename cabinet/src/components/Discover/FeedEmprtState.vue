<template>
  <div class="feed-empty">
    <h2 class="feed-empty__title">You aren’t following anyone yet</h2>
    <img src="/img/dashboard/empty_state.svg" alt="empty state airtap" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FeedEmptyState'
}
</script>

<style lang="scss" scoped>
.feed-empty {
  padding: 30px 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  &__title {
    font-weight: 400;
    font-size: 25px;
    line-height: 38px;
    margin: 0 auto 30px;
  }
}
</style>

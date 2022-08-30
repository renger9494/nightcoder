<template>
  <div class="search-empty">
    <h2 class="search-empty__title">
      No {{ typeSearch }} were found for your request
    </h2>
    <EmptyIcon />
  </div>
</template>

<script lang="ts">
import EmptyIcon from '@/assets/icons/empty.svg?inline'
export default {
  name: 'SearchEmptyState',
  components: {
    EmptyIcon,
  },
  props: {
    typeSearch: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.search-empty {
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

<template>
  <div class="empty-community">
    <h2 class="empty-community__title">Add your project in community & take your project to the next level</h2>
    <img class="empty-community__img" src="/img/dashboard/empty_state.svg" alt="empty state airtap" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'EmptyStateCommunity'
})
</script>

<style lang="scss" scoped>
.empty-community {
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
    max-width: 500px;
  }
}
</style>

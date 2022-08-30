<template>
  <div class="error">
    <h1 class="error__title">Page not found</h1>
    <empty />
    <nuxt-link to="/" class="error__btn">Go Home</nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import empty from '~/assets/icons/empty.svg?inline'
export default Vue.extend({
  name: 'error',
  head() {
    return {
      title: '404',
    }
  },
  components: { empty },
})
</script>

<style lang="scss">
.error {
  margin-top: 140px;
  height: calc(50vh - 140px);
  min-height: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &__title {
    width: 100%;
    font-size: 24px;
    font-weight: 300;
    text-align: center;
    color: #000000;
    margin-top: 0;
    margin-bottom: 34px;
  }

  &__btn {
    font-weight: 400;
    text-decoration: none;
    color: #2f80ed;
    font-size: 20px;
    line-height: 28px;
    transition: 0.3s;

    &:hover {
      color: #000;
    }
  }
}
</style>

<template>
  <div class="success">
    <picture>
      <source
        srcset="
          /img/editor/published-success.png,
          /img/editor/published-success@2x.png 2x
        "
      />
      <img src="/img/editor/published-success.png" alt="new" />
    </picture>
    <p class="success__title">
      You successfully purchased <b>{{ plan }}</b> plan
    </p>
    <router-link class="success__link" to="/dashboard"
      >Start Creating</router-link
    >
  </div>
</template>

<script>
import Vue from 'vue'
import { PlanCategory } from '@/utils/api'

export default Vue.extend({
  name: 'success',
  layout: 'checkout',
  head() {
    return {
      script: [
        {
          src: 'https://cdn.paddle.com/paddle/paddle.js',
        },
      ],
    }
  },
  asyncData(ctx) {
    const plans = {
      pro: PlanCategory.Pro,
      starter: PlanCategory.Starter,
    }

    return {
      plan: plans[ctx.route.query.plan],
    }
  },
})
</script>

<style lang="scss" scoped>
.success {
  height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  img {
    margin: 0 0 22px;
  }
  &__title {
    font-size: 24px;
    line-height: 28px;
    max-width: 270px;
    margin: 0 0 40px;
  }
  &__link {
    padding: 9px 24px;
    background: $black;
    border-radius: 4px;
    text-decoration: none;
    outline: none;
    color: $white;
    font-weight: bold;
    font-size: 10px;
    line-height: 12px;
    text-align: center;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
}
</style>

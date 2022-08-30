<template>
  <div class="plans">
    <div class="plans__title">Plans and Coupons</div>
    <p class="plans__text">
      Your current plan&nbsp;<strong>{{ user.plan.name }}</strong>
    </p>
    <plans-section :is-dashboard='true' :activePlan="user.plan.category" :openModal="openModal" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PlansSection from '@/components/Pricing/PlansSection.vue'
import { mapState } from 'vuex'
import { AccountDto } from '@/utils/api'

export default Vue.extend({
  components: {
    PlansSection
  },
  props: {
    openModal: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
    }),
  },
})
</script>

<style lang="scss" scoped>
.plans {

  margin: 30px $margin_page_desktop 20px 0;
  &__title {
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
    margin-bottom: 20px;
  }
  &__text {
    font-size: 13px;
    margin-top: 0;
    margin-bottom: 16px;

    strong {
      font-weight: 500;
    }
  }
}
</style>

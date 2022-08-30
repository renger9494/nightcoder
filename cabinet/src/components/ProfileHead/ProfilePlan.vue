<template>
  <router-link
    class="profile-head__plan"
    :class="[`profile-head__plan_${user.plan.category.toLowerCase()}`]"
    v-if="user && user.plan.category"
    to="/dashboard/plans"
    target="_blank"
  >
    {{ user.plan.category }} plan
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { AccountDto, PlanCategory } from '@/utils/api'

export default Vue.extend({
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
    }),
  },
})
</script>

<style lang="scss">
.profile-head {
  &__plan {
    margin-left: 16px;
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    color: #ffffff;
    background: #4256be;
    border-radius: $shape_border_radius;
    padding: 3px 8px 4px;
    transition: 0.3s;
    text-decoration: none;
    text-transform: capitalize;
    &:hover {
      box-shadow: 0 4px 12px rgba(9, 9, 9, 0.18);
      transform: translateY(-2px);
    }

    &_free {
      background-color: #949cad;
    }

    &_starter {
      background-color: #4256be;
    }

    &_pro {
      color: #ffc557;
      background-color: #000000;
    }
  }
}
</style>

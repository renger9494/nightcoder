<template>
  <div class="user-info">
    <img class="user-info__avatar" :src="user.avatar" />
    <div class="user-info__info">
      <h2 class="user-info__name">{{ user && user.fullName }}</h2>
      <span class="user-info__email">{{ user && user.email }}</span>
      <router-link
        class="user-info__plan user-info__plan_free"
        v-if="user && user.plan.category === PlanCategory.Free"
        to="/dashboard/plans"
        target="_blank"
      >
        free plan
      </router-link>
      <router-link
        class="user-info__plan user-info__plan_starter"
        v-if="user && user.plan.category === PlanCategory.Starter"
        to="/dashboard/plans"
        target="_blank"
      >
        starter plan
      </router-link>
      <router-link
        class="user-info__plan user-info__plan_pro"
        v-if="user && user.plan.category === PlanCategory.Pro"
        to="/dashboard/plans"
        target="_blank"
      >
        pro plan
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { AccountDto, PlanCategory } from '@/utils/api'

export default Vue.extend({
  data() {
    return {
      PlanCategory,
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
    }),
  },
})
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dadada;
  padding-top: 40px;
  padding-bottom: 40px;

  @include sm-down {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  &__avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-right: 30px;

    @include sm-down {
      width: 50px;
      height: 50px;
      margin-right: 20px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__name {
    font-size: 19px;
    font-weight: 400;
    color: #333333;
    margin-top: 0;
    margin-bottom: 0;

    @include sm-down {
      font-size: 14px;
      margin-bottom: 2px;
    }
  }

  &__email {
    font-size: 12px;
    font-weight: 400;
    color: #828282;
    margin-bottom: 16px;

    @include xs-down {
      margin-bottom: 10px;
    }
  }

  &__plan {
    font-size: 10px;
    font-weight: 500;
    text-decoration: none;
    color: #ffffff;
    border-radius: $shape_border_radius;
    padding-top: 3px;
    padding-right: 8px;
    padding-bottom: 4px;
    padding-left: 8px;
    transition: 0.3s;

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

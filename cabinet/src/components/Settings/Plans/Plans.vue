<template>
  <div class="plans">
    <title-component>Plans</title-component>
    <p class="plans__text">
      Your current plan&nbsp;<strong>{{ user.plan.name }}</strong>
    </p>
    <plans-section :activePlan="user.plan.category" :openModal="openModal" />
    <faq-section />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TitleComponent from '@/components/Settings/Title.vue'
import PlansSection from '@/components/Settings/Plans/PlansSection.vue'
import FaqSection from '@/components/Settings/Plans/FaqSection.vue'

import { mapState } from 'vuex'
import { AccountDto } from '@/utils/api'

export default Vue.extend({
  components: {
    TitleComponent,
    PlansSection,
    FaqSection,
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
  &__text {
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 40px;

    strong {
      font-weight: 500;
    }
  }
}
</style>

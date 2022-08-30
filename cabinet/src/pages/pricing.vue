<template>
  <div class="pricing-component container container--main">
    <plans-section />
<!--    <coupons-section />-->
<!--    <faq-section id="faq" />-->
<!--    <affiliate-section />-->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PlansSection from '@/components/Pricing/PlansSection.vue'
import CouponsSection from '@/components/Pricing/CouponsSection.vue'
import FaqSection from '@/components/Pricing/FaqSection.vue'
import AffiliateSection from '@/components/Pricing/AffiliateSection.vue'

export default Vue.extend({
  head() {
    return {
      title: 'Pricing'
    }
  },
  layout: 'pricing',
  components: {
    PlansSection,
    CouponsSection,
    // FaqSection,
    // AffiliateSection,
  },
})
</script>

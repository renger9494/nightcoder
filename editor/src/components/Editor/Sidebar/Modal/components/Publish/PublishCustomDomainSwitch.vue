<template>
  <div class="domain-switch" @click.prevent.stop="goToProCheckout">
    <div class="domain-switch__content">
      <p class="domain-switch__text">Connect custom domain</p>
      <p class="domain-switch__pro">Go to Pro</p>
    </div>
    <switch-component :is-active="false" :is-text-visible="false" :onClick="goToProCheckout" :name="'customDomain'" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Switch from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/Switch.vue';

export default Vue.extend({
  name: 'PublishCustomDomainSwitch',
  components: { 'switch-component': Switch },
  props: {
    isPro: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    goToProCheckout() {
      location.assign(`${process.env.VUE_APP_CABINET_URL}/checkout/pro`);
    }
  }
});
</script>

<style lang="scss" scoped>
.domain-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    opacity: 0.8;
  }
  &__content {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  &__text {
    font-size: 13px;
    line-height: 20px;
    color: $gray900;
  }
  &__pro {
    font-weight: 600;
    font-size: 13px;
    line-height: 20px;
    font-feature-settings: 'liga' off;
    color: #ffc557;
    padding: 2px 4px;
    background: $black;
    border-radius: $shape_border_radius;
  }
}
</style>

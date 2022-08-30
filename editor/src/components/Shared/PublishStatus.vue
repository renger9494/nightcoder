<template>
  <div class="publish-status-dotted" :class="className">
    <i></i>
    <span v-if="status === CustomDomainState.NotPublished">Not published</span>
    <span v-if="status === CustomDomainState.DomainIsDisabled">Custom domain is disabled</span>
    <span v-if="status === CustomDomainState.DomainIsntConnected">Custom domain is not connected yet</span>
    <span v-if="status === CustomDomainState.WebsiteIsPublished"
      >{{ isHomePage ? 'Website' : 'Page' }} is published</span
    >
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export enum CustomDomainState {
  NotPublished = 'NotPublished',
  DomainIsDisabled = 'DomainIsDisabled',
  DomainIsntConnected = 'DomainIsntConnected',
  WebsiteIsPublished = 'WebsiteIsPublished'
}

export default Vue.extend({
  name: 'PublishState',
  data: () => ({
    CustomDomainState
  }),
  props: {
    status: {
      type: String as PropType<CustomDomainState>,
      required: true
    },
    isHomePage: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  computed: {
    className(): any {
      return {
        NotPublished: this.status === CustomDomainState.NotPublished,
        DomainIsntConnected: [CustomDomainState.DomainIsntConnected, CustomDomainState.DomainIsDisabled].includes(
          this.status
        ),
        WebsiteIsPublished: this.status === CustomDomainState.WebsiteIsPublished
      };
    }
  }
});
</script>

<style lang="scss" scoped>
.publish-status-dotted {
  display: inline-flex;
  align-items: center;
  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 6px;
  }
  span {
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.03em;
    color: $black;
  }
  &.NotPublished {
    i {
      background: #949cad;
    }
    span {
      color: #949cad;
    }
  }
  &.DomainIsntConnected {
    i {
      background: $black;
      opacity: 0.3;
    }
    span {
      color: #949cad;
    }
  }
  &.WebsiteIsPublished {
    i {
      background: #38bc6d;
      opacity: 0.3;
    }
    span {
      color: #38bc6d;
    }
  }
}
</style>

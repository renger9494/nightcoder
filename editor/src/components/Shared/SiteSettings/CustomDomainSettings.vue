<template>
  <div>
    <description class="domain__text" style="font-weight: bold;">Step 1. Setup DNS settings</description>
    <div class="domain__section domain__section_mb-20">
      <description class="domain__section-description">
        Enter your domain above, then add the following host records via your domain registrar or DNS provider &nbsp;(
        <router-link to="/">how do I do this?</router-link>
        ):
      </description>
    </div>
    <div class="domain__section domain__section_mb-20">
      <table-component
        :data="hostsTableData"
        :rowItemsWithBackgroundByKey="['name', 'content']"
        :onClickByKey="{
          name: copyDomainToClipboard,
          content: copyDomainToClipboard
        }"
      />
    </div>
    <div class="domain__section domain__section_mb-20">
      <description class="domain__section-description domain__section-description_small">
        <b>Note:</b> It may take 24 hours to connect the new DNS settings for your domain. When your site is connected,
        click "Check domain".
      </description>
    </div>
    <description class="domain__text" style="font-weight: bold;">Step 2: Enter your custom domain name</description>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Description from '@/components/Shared/SiteSettings/Description.vue';
import TableComponent from '@/components/Shared/SiteSettings/Table.vue';

export default Vue.extend({
  name: 'CustomDomainSettings',
  components: {
    Description,
    TableComponent
  },
  props: {
    copyDomainToClipboard: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      hostsTableData: [
        {
          type: 'CNAME',
          name: 'www',
          content: 'your-domain.com'
        },
        {
          type: 'A',
          name: '@',
          content: process.env.VUE_APP_IP_ADDRESS
        }
      ]
    };
  }
});
</script>

<style lang="scss" scoped>
.domain {
  &__text {
    margin: 0 0 18px;
  }

  &__section {
    &_mb-20 {
      margin-bottom: 20px;
    }
  }

  &__section-description {
    margin-bottom: 0;
    max-width: 437px;
    font-size: 12px;

    ::v-deep {
      a {
        text-decoration: none;
        color: $blue200;
      }
    }

    span {
      color: #000;
    }

    &_small {
      ::v-deep {
        font-size: 10px;
        line-height: 14px;
      }
    }
  }
}
</style>

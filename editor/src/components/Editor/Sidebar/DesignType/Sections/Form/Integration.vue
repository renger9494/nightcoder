<template>
  <div class="sidebar-block integration-section">
    <div class="sidebar-block__head">
      <p class="sidebar-block__title">Integrations</p>
    </div>
    <!--   <switcher class="integration-section__switch" :switcher-items="switcherItems" @filterName="changeSwitch" />-->
    <integration-dropdown class="sidebar-block__row" :active-item="integrationType" @onChange="changeSwitch" />

    <label class="integration-section__label">
      <input
        class="integration-section__input"
        :class="{ error: isApiKeyWrong }"
        :placeholder="`Enter Api key from ${integrationName}`"
        type="text"
        v-model="apiKey"
        @change="setApiKey"
      />
      <svg-icon
        name="check-mark-icon"
        width="10"
        height="8"
        color="#53B71B"
        class="integration-section__icon"
        :class="{ active: isKeySaved && !isApiKeyWrong }"
      />
      <span v-if="isApiKeyWrong">Invalid key</span>
    </label>

    <p
      class="integration-section__text"
      v-tooltip="
        'Copy an existing API key or create a new one in your Integrations account. Enter a valid key in the field above.'
      "
    >
      <svg-icon name="question-flat-icon" width="16" height="16" />
      <span>How to add API key</span>
    </p>

    <form-select v-if="list.length" :list="list" :active-type="activeList.name" @change="setList" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api';
import Switcher from '@/components/Editor/Sidebar/Switcher.vue';
import FormSelect from '@/components/Editor/Sidebar/DesignType/Sections/Form/FormSelect.vue';
import apiClient from '@/utils/apiClient';
import { ListInfo } from '@/utils/api';
import IntegrationDropdown from "@/components/Editor/Sidebar/DesignType/Sections/Form/IntegrationDropdown.vue";

enum IntegrationType {
  MAILCHIMP = 'mailchimp',
  ZAPIER = 'zapier'
}

export default defineComponent({
  name: 'Integration',
  components: {
    IntegrationDropdown,
    FormSelect,
    Switcher
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { root }) {
    const list = ref([] as Array<ListInfo>);
    const apiKey = ref('' as string);
    const isApiKeyWrong = ref(false as boolean);
    const isKeySaved = ref(false as boolean);
    const integrationType = computed(() => props.value.payload.integration);
    const activeList = computed(() => props.value.payload.list || { id: '', name: '' });
    const integrationName = computed(() =>
      integrationType.value === IntegrationType.MAILCHIMP ? 'Mailchimp' : 'Zapier'
    );

    const { projectId } = root.$route.params;

    function changeSwitch(val: string) {
      root.$store.commit('editor/changeElementPayload', {
        id: props.value.id,
        path: 'integration',
        value: val.toLowerCase()
      });
    }

    function setList(item: ListInfo) {
      root.$store.commit('editor/changeElementPayload', {
        id: props.value.id,
        path: 'list',
        value: { ...item, projectId: `${projectId}` }
      });
    }

    function fetchMailchimpSettings() {
      apiClient.mailchimp.mailchimpGetSettings(+projectId).then(({ data }: { data: any }) => {
        apiKey.value = data.apiKey;
      });
    }

    function fetchMailchimpList() {
      apiClient.mailchimp
        .mailchimpGetLists(+projectId)
        .then(({ data }: { data: any }) => {
          list.value = data;
        })
        .catch((e: any) => {
          console.log(e.response);
          list.value = [];
          setList({ id: '', name: '' });
          if (apiKey.value.length) {
            isApiKeyWrong.value = true;
          }
        });
    }

    function setApiKey() {
      if (integrationType.value === IntegrationType.MAILCHIMP) {
        apiClient.mailchimp.mailchimpSetUpSettings(+projectId, { apiKey: apiKey.value ?? '' }).then(() => {
          isApiKeyWrong.value = false;
          setTimeout(() => {
            if (apiKey.value.length) {
              isKeySaved.value = true;
            }
          }, 500);
          fetchMailchimpList();
        });
      }
      if (integrationType.value === IntegrationType.ZAPIER) {
        apiClient.zapier.zapierSetUpSettings(+projectId, { webHook: apiKey.value ?? '' }).then(() => {
          // fetch list of zappier
        });
      }
      setTimeout(() => {
        isKeySaved.value = false;
      }, 3000);
    }

    onMounted(() => {
      fetchMailchimpSettings();
      fetchMailchimpList();
    });

    return {
      changeSwitch,
      setList,
      setApiKey,
      integrationType,
      list,
      activeList,
      apiKey,
      integrationName,
      isApiKeyWrong,
      isKeySaved,
      switcherItems: [
        { name: 'Mailchimp', isActive: integrationType.value === 'mailchimp' },
        { name: 'Zapier', isActive: integrationType.value === 'zapier' }
      ]
    };
  }
});
</script>

<style lang="scss" scoped>
.integration-section {
  &__switch {
    margin: 0 0 $margin_s;
  }
  &__label {
    position: relative;
    span {
      position: absolute;
      right: 0;
      bottom: -26px;
      color: $danger;
      font-size: 10px;
      line-height: 14px;
    }
  }
  &__input {
    background: $white;
    border: 1px solid $gray100;
    border-radius: $shape_border_radius;
    width: 100%;
    height: 34px;
    transition: 0.3s;
    padding: 0 5px;
    font-size: 13px;
    line-height: 16px;
    color: $black;
    margin: 0 0 5px;

    &.error {
      border-color: $danger;
    }

    &:hover {
      border-color: $gray400;
    }

    &:focus {
      border-color: $blue200;
    }
  }
  &__icon {
    position: absolute;
    z-index: 9999;
    right: 7px;
    top: 7px;
    opacity: 0;
    transition: all 0.3s ease;
    &.active {
      opacity: 1;
    }
  }
  &__text {
    display: flex;
    align-items: center;

    svg {
      margin: 0 4px 0 0;
    }

    span {
      font-size: 10px;
      line-height: 12px;
      color: $gray400;
    }
    &:not(:last-child) {
      margin: 0 0 $margin_s;
    }
  }
}
</style>

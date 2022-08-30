<template>
  <div class="domain">
    <div class="domain__header domain__header_pb-14">
      <title-component>Domain Settings</title-component>
    </div>
    <div class="domain__section">
      <title-component class="domain__subtitle" :theme="'brown'">Airtap Domain</title-component>
      <description class="domain__text">Edit your free Airtap domain</description>
      <button-component
        v-if="customDomainStatus != CustomDomainStatus.NotPublished"
        :tag="'button'"
        :is-small="true"
        :onClick="toggleDomain"
        class="domain__section-btn"
      >
        Switch to
        {{ customDomainStatus == CustomDomainStatus.Published ? 'airtap' : 'custom' }}
        domain
      </button-component>
      <field
        :tag="'input'"
        :name="'airtapDomain'"
        :value="inputValues.airtapDomain || ''"
        :error="inputErrors.airtapDomain || ''"
        :placeholder="'Example, itmeoblog'"
        :lockedText="lockedText"
        :isInputLocked="!!customDomain && customDomainStatus === CustomDomainStatus.Published"
        :isLockedTextCombined="true"
        :lockedTextAlign="'left'"
        :onChange="changeInputValue"
      />
    </div>
    <template v-if="!isUserCanChangeCustomDomain">
      <div class="domain__section">
        <title-component class="domain__subtitle" :theme="'brown'">Custom Domain</title-component>
        <description class="domain__text">Get a branded domain for your site</description>
        <upgrade-to-pro>
          <div class="domain__become-pro">
            <svg-icon name="www-logo" width="42" height="30" color="#000" />
            <p>Connect your own custom domain.</p>
          </div>
        </upgrade-to-pro>
      </div>
    </template>
    <template v-else>
      <div class="domain__section">
        <title-component class="domain__subtitle" :theme="'brown'">Custom Domain</title-component>
        <template v-if="!customDomain">
          <custom-domain-settings :copy-domain-to-clipboard="copyDomainToClipboard" />
        </template>
        <accordion v-if="!!customDomain" title="DNS settings">
          <custom-domain-settings :copy-domain-to-clipboard="copyDomainToClipboard" />
        </accordion>
        <field
          :tag="'input'"
          :name="'customDomain'"
          :value="inputValues.customDomain || ''"
          :error="inputErrors.customDomain || ''"
          :placeholder="'Example, itmeo.com'"
          :onChange="changeInputValue"
        />
        <publish-status
          class="domain__section-status"
          v-if="!!customDomain"
          :status="domainPublishStatus"
          :is-home-page="true"
        />
        <description v-if="customDomainStatusError" class="domain__text">
          Notice: Make sure that you have configured the DNS settings correctly. Please wait when your DNS settings
          would be connected with the new domain. If it has been more than 24 hours since you changed the new DNS
          settings, please write to support.
        </description>
      </div>
      <div
        class="domain__section domain__section_mb-20"
        v-if="!!customDomain && domainPublishStatus === CustomDomainState.DomainIsntConnected"
      >
        <button-component
          v-if="!isChecking"
          :tag="'button'"
          :theme="isDomainActive ? 'green' : 'blue'"
          :onClick="confirmCustomDomain"
        >
          {{ isDomainActive ? 'Domain Is Active' : 'Check Domain' }}
        </button-component>
        <div v-else class="domain__checking">
          <svg-icon name="loader-icon" width="16" height="16" color="#fff" />
          <span>Checking</span>
        </div>
      </div>
    </template>
    <div class="domain__actions" :class="isHasChanges ? '' : 'action-blocked'">
      <button-component :tag="'button'" :onClick="saveChanges">Save</button-component>
    </div>
  </div>
</template>

<script lang="ts">
//TODO: add disabled status for custom domain
import Vue, { PropType } from 'vue';
import { mapState } from 'vuex';
import TitleComponent from '@/components/Shared/SiteSettings/Title.vue';
import ButtonComponent from '@/components/Shared/SiteSettings/Button.vue';
import Description from '@/components/Shared/SiteSettings/Description.vue';
import Field from '@/components/Shared/SiteSettings/Field.vue';
import UpgradeToPro from '@/components/Shared/SiteSettings/UpgradeToPro.vue';
import CustomDomainSettings from '@/components/Shared/SiteSettings/CustomDomainSettings.vue';

import copyToClipboard from '@/utils/copy_to_clibpoard';
import { cloneDeep as _cloneDeep } from 'lodash';

import { VisibleMessageNameType } from '@/store/ui';
import ObjectKeys from '@/utils/types/ObjectKeys';
import apiClient from '@/utils/apiClient';
import { ErrorCode, ErrorDto, ProjectSettingsDto, AccountDto } from '@/utils/api';
import Accordion from '@/components/Shared/ui/Accordion.vue';
import PublishStatus, { CustomDomainState } from '@/components/Shared/PublishStatus.vue';
import { CustomDomainStatus } from '@/utils/api';
import { DomainStatus, domainStatusChecker } from '@/utils/domainChecker';
import { SiteSettingsMutations } from '@/store/siteSettings';
import { getErrorData } from '@/utils/http';

export default Vue.extend({
  components: {
    PublishStatus,
    Accordion,
    CustomDomainSettings,
    TitleComponent,
    ButtonComponent,
    Field,
    Description,
    UpgradeToPro
  },
  props: {
    openProjectId: {
      type: Number,
      required: true
    },
    settings: {
      type: Object as PropType<ProjectSettingsDto & ObjectKeys<string>>,
      required: true
    }
  },

  data() {
    const { customDomain, airtapDomain, customDomainStatus } = this.settings;
    return {
      CustomDomainState,
      CustomDomainStatus,
      isDomainActive: customDomainStatus == CustomDomainStatus.Published,
      customDomainStatusError: false,
      isChecking: false,

      inputValues: {
        airtapDomain,
        customDomain
      } as ObjectKeys<string>,

      inputErrors: {
        airtapDomain: '' as string | undefined,
        customDomain: '' as string | undefined
      }
    };
  },

  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user
    }),
    isUserCanChangeCustomDomain(): boolean {
      return this.user.isAdmin || this.user.plan.features.isCustomHosting;
    },
    isHasChanges(): boolean {
      for (const key in this.inputValues) {
        if (this.settings[key] != this.inputValues[key]) return true;
      }
      return false;
    },
    isCustomDomainHasChanges(): boolean {
      return this.inputValues.customDomain != this.settings.customDomain;
    },
    domain(): string | undefined {
      return process.env.VUE_APP_AIRTAP_DOMAIN;
    },
    lockedText(): string {
      return !!this.customDomain && this.customDomainStatus === CustomDomainStatus.Published
        ? `${this.domain}/w/${this.airtapDomain}`
        : `${this.domain}/w/`;
    },
    airtapDomain(): string | undefined {
      return this.settings.airtapDomain;
    },
    customDomain(): string | undefined {
      return this.settings.customDomain;
    },
    customDomainStatus(): CustomDomainStatus {
      return this.settings.customDomainStatus;
    },
    domainPublishStatus(): CustomDomainState {
      if (this.customDomainStatus === CustomDomainStatus.Disabled) return CustomDomainState.DomainIsDisabled;

      if (this.isCustomDomainHasChanges) return CustomDomainState.NotPublished;

      return this.customDomainStatus === CustomDomainStatus.Published
        ? CustomDomainState.WebsiteIsPublished
        : CustomDomainState.DomainIsntConnected;
    }
  },
  methods: {
    changeInputValue(inputName: string, event: Event) {
      this.inputValues[inputName] = (<HTMLInputElement>event.currentTarget).value;

      if (inputName === 'customDomain') {
        this.isDomainActive = false;
        this.customDomainStatusError = false;
      }
    },

    copyDomainToClipboard(value: string, event: Event) {
      copyToClipboard(value);
    },

    saveChanges() {
      let projectSettings: any = _cloneDeep(this.settings);
      projectSettings = {
        ...projectSettings,
        ...this.inputValues,
        customDomainStatus: CustomDomainStatus.NotPublished
      };
      const payload = {
        id: this.openProjectId,
        settings: projectSettings
      };
      this.inputErrors = {
        customDomain: '',
        airtapDomain: ''
      };

      const { commit } = this.$store;

      apiClient.projects
        .projectsSaveSettings(payload.id, payload.settings)
        .then(() => {
          commit('project/changeProjectSettings', payload);
          commit(`siteSettings/${SiteSettingsMutations.CHANGE_PROJECT_SETTINGS}`, payload.settings);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success);
        })
        .catch(error => {
          const errors = getErrorData(error);
          console.error(error);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
          if (!errors.length) return;
          const errorData = errors[0];
          if (errorData.code == ErrorCode.IsExistSameCustomDomain) {
            const projectId = (<ErrorDto & { projectId: number | undefined }>errorData).projectId;
            const projectMessage = projectId
              ? `Change it in <a href="/dashboard/projects/${projectId}/pages">your project</a>`
              : 'Write a message to support';
            this.inputErrors.customDomain = `${errorData.description} ${projectMessage}`;
            return;
          }

          if (!!this.inputValues.customDomain) {
            this.inputErrors.customDomain = errorData.description;
          } else {
            this.inputErrors.airtapDomain = errorData.description;
          }
        });
    },

    toggleDomain() {
      let projectSettings = _cloneDeep(this.settings);

      projectSettings.customDomainStatus =
        projectSettings.customDomainStatus != CustomDomainStatus.Disabled
          ? CustomDomainStatus.Disabled
          : CustomDomainStatus.Published;

      const payload = {
        id: this.openProjectId,
        settings: projectSettings
      };

      const { commit } = this.$store;
      apiClient.projects
        .projectsSaveSettings(payload.id, payload.settings)
        .then(() => {
          commit('project/changeProjectSettings', payload);
          commit(`siteSettings/${SiteSettingsMutations.CHANGE_PROJECT_SETTINGS}`, payload.settings);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success);
        })
        .catch(error => {
          console.error(error);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
        });
    },
    async confirmCustomDomain() {
      this.customDomainStatusError = false;
      this.isChecking = true;

      let projectSettings = _cloneDeep(this.settings);

      const payload = {
        id: this.openProjectId,
        settings: projectSettings
      };

      const { commit } = this.$store;

      //check domain
      const domainStatus = await domainStatusChecker.isWorked(this.openProjectId);

      if (domainStatus == DomainStatus.NotWorked) {
        //show message to user about fail
        this.customDomainStatusError = true;
        this.isChecking = false;
      } else {
        this.isChecking = false;
        payload.settings.customDomainStatus = CustomDomainStatus.Published;

        apiClient.projects
          .projectsSaveSettings(payload.id, payload.settings)
          .then(() => {
            commit('project/changeProjectSettings', payload);
            commit(`siteSettings/${SiteSettingsMutations.CHANGE_PROJECT_SETTINGS}`, payload.settings);
            commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success);
          })
          .catch(error => {
            console.error(error);
            commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
          });
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.domain {
  &__header {
    margin-bottom: 30px;

    &_pb-14 {
      padding-bottom: 10px;
      border-bottom: 1px solid $gray200;

      .title {
        margin-bottom: 0;
      }
    }
  }

  &__become-pro {
    display: flex;
    align-items: center;
    padding: 5px 0;

    p {
      font-weight: 500;
      font-size: 13px;
      line-height: 15px;
      margin: 0 0 0 20px;
    }
  }

  &__text {
    margin: 0 0 18px;
  }

  &__description {
    max-width: 330px;
  }

  &__section {
    margin-bottom: 30px;
    position: relative;

    &_mb-20 {
      margin-bottom: 20px;
    }

    &_mb-8 {
      margin-bottom: 8px;
    }

    &_row {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &-status {
      margin: 15px 0;
    }

    &-btn {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  &__checking {
    padding: 9px 24px;
    background: #949cad;
    color: $white;
    display: inline-flex;
    align-items: center;
    border-radius: 4px;
    font-weight: 500;
    font-size: 13px;
    line-height: 14px;

    svg {
      margin: 0 5px 0 0;
      animation: spin 1s linear infinite;
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

  &__subtitle {
    margin-bottom: 10px;
  }

  &__actions {
    margin-top: 60px;
  }

  &__button-short-link {
    margin-right: 20px;
  }

  &__field-short-link {
    width: 126px;
  }

  &__link-copied-notify {
    opacity: 0;
    color: #000000;
    font-size: 12px;
    margin-left: 15px;
    transition: all 0.2s ease-in-out;

    &_active {
      opacity: 1;
    }
  }

  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
}
</style>

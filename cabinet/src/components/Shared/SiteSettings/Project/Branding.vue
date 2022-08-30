<template>
  <div class="branding">
    <div class="branding__header branding__header_pb-14">
      <title-component>Airtap Branding</title-component>
    </div>
    <div class="branding__top">
      <title-component class="branding__top-title" :theme="'brown'">Airtap Button</title-component>
      <description>Airtap button will be displayed at the bottom right and will fix when scrolling website</description>
    </div>
    <div class="branding__toggle-wrapper">
      <span class="branding__toggle-value">Airtap Button</span>
      <switch-component
        class="branding__switch"
        :isActive="inputValues.isEnabled || !isUserCanDisableBranding"
        :isDisabled="!isUserCanDisableBranding"
        :onClick="handleSwitchClick"
      />
    </div>
    <div class="branding__made-with-buttons">
      <made-with-airtap
        class="branding__made-with-button"
        :isActive="inputValues.theme === BrandingThemeType.White"
        :onClick="changeTheme"
        :theme="BrandingThemeType.White"
      />
      <made-with-airtap
        class="branding__made-with-button"
        :isActive="inputValues.theme === BrandingThemeType.Black"
        :onClick="changeTheme"
        :theme="BrandingThemeType.Black"
      />
    </div>
    <description class="branding__thanks">
      We will be glad if you tell for other users about Airtap and will not turn off the button thereby support the
      project. Thank you.
    </description>
    <div class="branding__btns">
      <title-component :theme="'brown'">Button Position</title-component>
      <div class="button-position__option">
        <span>Bottom Right</span>
        <switch-component
          class="branding__switch"
          :isActive="inputValues.position === BrandingPositionType.BottomRight"
          :onClick="changePosition"
          :name="BrandingPositionType.BottomRight"
        />
      </div>
      <div class="button-position__option">
        <span>Bottom Left</span>
        <switch-component
          class="branding__switch"
          :isActive="inputValues.position === BrandingPositionType.BottomLeft"
          :onClick="changePosition"
          :name="BrandingPositionType.BottomLeft"
        />
      </div>
    </div>
    <upgrade-to-pro class="branding__upgrade-to-pro" v-if="!isUserCanDisableBranding" :arrowType="'long'">
      Upgrade your plan to a&nbsp;<span>Starter Plan (Yearly)</span>&nbsp;or&nbsp;<span>Pro Plan (Yearly)</span>&nbsp;to
      remove airtap&nbsp;branding.
    </upgrade-to-pro>
    <div class="branding__actions" :class="!isDisabledSaveChanges ? 'action-blocked' : ''">
      <button-component :tag="'button'" :onClick="saveChanges"> Save </button-component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapState } from 'vuex';
import { cloneDeep as _cloneDeep } from 'lodash';

import TitleComponent from '@/components/Shared/SiteSettings/Title.vue';
import Description from '@/components/Shared/SiteSettings/Description.vue';
import ButtonComponent from '@/components/Shared/SiteSettings/Button.vue';
import UpgradeToPro from '@/components/Shared/SiteSettings/UpgradeToPro.vue';
import SwitchComponent from '@/components/Shared/SiteSettings/Switch.vue';
import MadeWithAirtap from '@/components/Shared/SiteSettings/MadeWithAirtap.vue';
import { VisibleMessageNameType } from '@/store/ui';
import { SiteSettingsMutations } from '@/store/siteSettings';
import { ProjectSettingsDto, BrandingThemeType, BrandingPositionType, AccountDto } from '@/utils/api';
import apiClient from '@/utils/apiClient';

export default Vue.extend({
  components: {
    TitleComponent,
    Description,
    ButtonComponent,
    UpgradeToPro,
    SwitchComponent,
    MadeWithAirtap
  },
  props: {
    projectSettings: {
      type: Object as PropType<ProjectSettingsDto>,
      required: true
    },
    projectId: {
      type: Number,
      required: true
    }
  },
  data(): any {
    return {
      BrandingThemeType,
      BrandingPositionType,
      inputValues: {
        isEnabled: this.projectSettings.isAirtapBranding,
        theme: this.projectSettings.brandingTheme,
        position: this.projectSettings.brandingPosition
      },
      isDisabledSaveChanges: false
    };
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user
    }),
    isUserCanDisableBranding(): boolean {
      return this.user.isAdmin || this.user.plan.features.isDisabledAirtapBranding;
    }
  },
  methods: {
    handleSwitchClick(event: Event) {
      if (event) event.preventDefault();
      this.inputValues.isEnabled = !this.inputValues.isEnabled;
      this.isDisabledSaveChanges = this.inputValues.isEnabled !== this.projectSettings.isAirtapBranding;
    },

    changeTheme(data: BrandingThemeType) {
      this.inputValues.theme = data;
      this.isDisabledSaveChanges = this.inputValues.theme !== this.projectSettings.brandingTheme;
    },

    changePosition(data: BrandingPositionType) {
      this.inputValues.position = data;
      this.isDisabledSaveChanges = this.inputValues.position !== this.projectSettings.brandingPosition;
    },
    saveChanges() {
      let projectSettings = _cloneDeep(this.projectSettings);

      projectSettings.isAirtapBranding = this.inputValues.isEnabled;
      projectSettings.brandingTheme = this.inputValues.theme;
      projectSettings.brandingPosition = this.inputValues.position;

      const payload = {
        id: this.projectId,
        settings: projectSettings
      };

      const { commit } = this.$store;

      apiClient.projects
        .projectsSaveSettings(payload.id, payload.settings)
        .then(() => {
          this.isDisabledSaveChanges = false;
          commit('project/changeProjectSettings', payload);
          commit('editor/changeProjectSettings', payload.settings);
          commit(`siteSettings/${SiteSettingsMutations.CHANGE_PROJECT_SETTINGS}`, payload.settings);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success);
        })
        .catch(error => {
          console.error(error);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
        });
    }
  }
});
</script>

<style lang="scss" scoped>
.branding__made-with-buttons .made-with {
  position: relative !important;
}
.button-position {
  .title {
    margin-bottom: 18px;
  }
  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 209px;
    margin-bottom: 13px;
    &:last-child {
      margin-bottom: 0;
    }
    span {
      font-size: 12px;
      line-height: 14px;
      color: #000000;
    }
  }
}
.branding {
  &__header {
    margin-bottom: 20px;
    &_pb-14 {
      padding-bottom: 10px;
      margin-bottom: 30px;
      border-bottom: 1px solid $gray200;

      .title {
        margin-bottom: 0;
      }
    }
  }

  &__top {
    margin: 0 0 20px;
    &-title {
      margin: 0 0 8px;
    }
  }

  &__toggle-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 22px;
  }

  &__toggle-value {
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #000000;
  }

  &__switch {
    margin-left: 15px;
    margin-right: 10px;
  }

  &__thanks {
    max-width: 389px;
    margin-bottom: 30px;
    ::v-deep {
      font-size: 10px;
      line-height: 14px;
      color: #828282;
    }
  }

  &__made-with-buttons {
    display: flex;
    align-items: center;
    margin-bottom: 17px;
  }

  &__made-with-button {
    margin-right: 10px;
  }

  &__actions {
    margin-top: 60px;
  }

  &__btns {
    margin: 0 0 30px;
  }
}
</style>

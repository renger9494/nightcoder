<template>
  <div class="integrations">
    <div class="integrations__header integrations__header_pb-14">
      <title-component>Domain Settings</title-component>
    </div>
    <div class="integrations__section">
      <title-component class="integrations__subtitle" :theme="'brown'">Google Analytics</title-component>
      <description class="integrations__section-description">
        Add up to 5 meta tags that describe what you offer.
      </description>
      <field
        :tag="'input'"
        :name="'googleAnalyticsId'"
        :placeholder="'Google Analytics ID'"
        :value="inputValues.googleAnalyticsId"
        icon-name="go"
        :error="isFormSending && !isGAValid ? 'Wrong Google Analytics ID' : null"
        :onChange="changeInputValue"
      />
    </div>
    <div class="integrations__section">
      <title-component class="integrations__subtitle" :theme="'brown'">Google Tag Manager</title-component>
      <description class="integrations__section-description">
        Add up to 5 meta tags that describe what you offer.
      </description>
      <field
        :tag="'input'"
        :name="'googleTagManagerId'"
        :placeholder="'Google Tag Manager ID'"
        :value="inputValues.googleTagManagerId"
        icon-name="tag"
        mask="GTM-NNNNNN?"
        :error="isFormSending && !isGTMValid ? 'Wrong Google Tag Manager ID' : null"
        :onChange="changeInputValue"
      />
    </div>
    <div class="integrations__section">
      <title-component class="integrations__subtitle" :theme="'brown'">FB Pixel</title-component>
      <description class="integrations__section-description">
        Add up to 5 meta tags that describe what you offer.
      </description>
      <field
        :tag="'input'"
        :name="'facebookPixelId'"
        :placeholder="'FB Pixel ID'"
        :value="inputValues.facebookPixelId"
        icon-name="pixel"
        mask="###############"
        :error="isFormSending && !isFBPixelValid ? 'Wrong FB Pixel ID' : null"
        :onChange="changeInputValue"
      />
    </div>
    <div class="integrations__section">
      <title-component class="integrations__subtitle" :theme="'brown'">Hotjar</title-component>
      <description class="integrations__section-description">
        Add up to 5 meta tags that describe what you offer.
      </description>
      <field
        :tag="'input'"
        :name="'hotjarId'"
        :placeholder="'Hotjar ID'"
        :value="inputValues.hotjarId"
        icon-name="hot"
        mask="#######"
        :error="isFormSending && !isHotJarValid ? 'Wrong Hotjar ID' : null"
        :onChange="changeInputValue"
      />
    </div>
    <div class="integrations__actions" :class="isHasChanges ? '' : 'action-blocked'">
      <button-component :tag="'button'" :onClick="saveChanges">Save</button-component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import TitleComponent from '@/components/Shared/SiteSettings/Title.vue';
import Description from '@/components/Shared/SiteSettings/Description.vue';
import Field from '@/components/Shared/SiteSettings/Field.vue';
import ButtonComponent from '@/components/Shared/SiteSettings/Button.vue';

import { cloneDeep as _cloneDeep } from 'lodash';
import { VisibleMessageNameType } from '@/store/ui';
import ObjectKeys from '@/utils/types/ObjectKeys';
import apiClient from '@/utils/apiClient';
import { SiteSettingsMutations } from '@/store/siteSettings';
import { ProjectSettingsDto } from '@/utils/api';

export default Vue.extend({
  components: {
    TitleComponent,
    ButtonComponent,
    Description,
    Field
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
    const { googleAnalyticsId, googleTagManagerId, hotjarId, facebookPixelId } = this.settings;
    return {
      inputValues: {
        googleAnalyticsId,
        googleTagManagerId,
        hotjarId,
        facebookPixelId
      } as ObjectKeys<string>,
      isFormSending: false as boolean
    };
  },
  computed: {
    isHasChanges(): boolean {
      for (const key in this.inputValues) {
        if (this.settings[key] != this.inputValues[key]) return true;
      }
      return false;
    },
    isGTMValid(): boolean {
      if (!this.inputValues.googleTagManagerId) return true;
      const { length } = this.inputValues.googleTagManagerId;
      if (!length) return true;
      return length === 10 || length === 11;
    },
    isGAValid(): boolean {
      if (!this.inputValues.googleAnalyticsId) return true;
      const { length } = this.inputValues.googleAnalyticsId;
      if (!length) return true;
      return /\b[A-Z][A-Z0-9]?-[A-Z0-9]{4,10}(?:\-[1-9]\d{0,3})?\b/.test(this.inputValues.googleAnalyticsId);
    },
    isHotJarValid(): boolean {
      if (!this.inputValues.hotjarId) return true;
      const { length } = this.inputValues.hotjarId;
      if (!length) return true;
      return length === 7;
    },
    isFBPixelValid(): boolean {
      if (!this.inputValues.facebookPixelId) return true;
      const { length } = this.inputValues.facebookPixelId;
      if (!length) return true;
      return length === 15;
    },
    isFormValid(): boolean {
      return this.isGTMValid && this.isGAValid && this.isHotJarValid && this.isFBPixelValid;
    }
  },
  methods: {
    changeInputValue(inputName: string, event: any) {
      this.inputValues[inputName] = event.currentTarget.value;
    },
    saveChanges() {
      this.isFormSending = true;
      if (!this.isFormValid) return;

      let projectSettings = _cloneDeep(this.settings);
      projectSettings = { ...projectSettings, ...this.inputValues };
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
          this.isFormSending = false;
        })
        .catch(error => {
          console.error(error);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
          this.isFormSending = false;
        });
    }
  }
});
</script>

<style lang="scss" scoped>
.integrations {
  &__header {
    &_pb-14 {
      padding-bottom: 10px;
      margin-bottom: 30px;
      border-bottom: 1px solid $gray200;

      .title {
        margin-bottom: 0;
      }
    }
  }
  &__section {
    margin-bottom: 30px;
  }

  &__subtitle {
    margin-bottom: 10px;
  }

  &__section-description {
    margin-bottom: 18px;
  }

  &__actions {
    margin-top: 60px;
  }
}
</style>

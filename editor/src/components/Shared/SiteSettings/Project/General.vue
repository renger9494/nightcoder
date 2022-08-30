<template>
  <div class="general">
    <div class="general__header general__header_pb-14">
      <title-component>General</title-component>
    </div>
    <div class="general__section">
      <title-component class="general__subtitle" :theme="'brown'"> Title </title-component>
      <description class="general__section-description"> Enter your site name to search </description>
      <field
        :tag="'input'"
        :name="'title'"
        :value="inputValues.title"
        :error="inputErrors.title"
        :lockedText="!isUserCanChangeDescription ? 'Made by Airtap - Free website builder' : ''"
        :onChange="changeInputValue"
      />
    </div>
    <div class="general__section">
      <title-component class="general__subtitle" :theme="'brown'"> Description </title-component>
      <description class="general__section-description"> Tell everyone briefly what you do </description>
      <field
        :tag="'textarea'"
        :name="'description'"
        :rows="3"
        :value="!isUserCanChangeDescription ? 'Software for companies with a mission' : inputValues.description"
        :onChange="changeInputValue"
        :isUserFree="!isUserCanChangeDescription"
      />
    </div>
    <div class="general__actions" :class="isHasChanges ? '' : 'action-blocked'">
      <button-component :tag="'button'" :onClick="saveChanges"> Save </button-component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapState } from 'vuex';

import TitleComponent from '@/components/Shared/SiteSettings/Title.vue';
import Description from '@/components/Shared/SiteSettings/Description.vue';
import SwitchComponent from '@/components/Shared/SiteSettings/Switch.vue';
import Field from '@/components/Shared/SiteSettings/Field.vue';
import ButtonComponent from '@/components/Shared/SiteSettings/Button.vue';

import { cloneDeep as _cloneDeep } from 'lodash';
import { VisibleMessageNameType } from '@/store/ui';
import ObjectKeys from '@/utils/types/ObjectKeys';
import apiClient from '@/utils/apiClient';
import { SiteSettingsMutations } from '@/store/siteSettings';
import { PlanCategory, ProjectSettingsDto, AccountDto } from '@/utils/api';

export default Vue.extend({
  components: {
    TitleComponent,
    Description,
    Field,
    SwitchComponent,
    ButtonComponent
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
    const { title, description } = this.settings;
    return {
      inputValues: {
        title,
        description
      } as ObjectKeys<any>,
      inputErrors: {
        title: ''
      }
    };
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user
    }),
    isUserCanChangeDescription(): boolean {
      return this.user.isAdmin || this.user.plan.category != PlanCategory.Free;
    },
    isHasChanges(): boolean {
      for (const key in this.inputValues) {
        if (this.settings[key] != this.inputValues[key]) return true;
      }
      return false;
    }
  },
  methods: {
    changeSwitchValue(switchName: string) {
      this.inputValues[switchName] = !this.inputValues[switchName];
    },
    changeInputValue(inputName: string, event: any) {
      this.inputValues[inputName] = event.currentTarget.value;
    },
    saveChanges() {
      if (this.inputValues.title.length === 0) {
        this.inputErrors.title = 'This field may not be empty';

        return;
      }
      this.inputErrors.title = '';

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
        })
        .catch(error => {
          console.error(error);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
        });
    }
  }
});
</script>

<style lang="scss">
.action-blocked {
  opacity: 0.5;
  pointer-events: none;
}
</style>
<style lang="scss" scoped>
.general {
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

  &__description {
    max-width: 330px;
  }

  &__section {
    margin-bottom: 30px;
  }

  &__subtitle {
    margin-bottom: 10px;
  }

  &__section-description {
    margin: 0 0 18px;
  }

  &__switch {
    margin-top: 10px;
  }

  &__actions {
    margin-top: 60px;
  }
}
</style>

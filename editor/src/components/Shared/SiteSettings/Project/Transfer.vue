<template>
  <div class="transfer">
    <div class="transfer__header transfer__header_pb-14">
      <title-component>Project action</title-component>
    </div>
    <div class="transfer__section">
      <title-component class="transfer__subtitle" :theme="'brown'"> Transfer project: </title-component>
      <description class="transfer__section-description">
        The recipient will see a request to translate the website in their mail. After the recipient clicks the “Accept”
        button, the website will be transferred to his account.
      </description>
      <field
        :tag="'input'"
        :name="'title'"
        :placeholder="'Email'"
        :value="email"
        :error="errorsEmail"
        :onChange="changeInputValue"
      />
      <description class="transfer__thanks">
        Once the transfer request is accepted, the website will be removed from your account automatically.
      </description>
      <div class="transfer__actions" :class="isHasChanges ? '' : 'action-blocked'">
        <button-component :tag="'button'" :onClick="transferProject"> Transfer </button-component>
      </div>
    </div>
    <div class="transfer__section">
      <title-component class="transfer__subtitle" :theme="'brown'"> Delete project: </title-component>
      <description class="transfer__section-description">
        After deleting, the project will disappear from your dashboard forever
      </description>
      <div class="transfer__actions">
        <button-component :tag="'button'" :theme="'red'" :onClick="deleteProject"> Delete </button-component>
      </div>
      <description class="transfer__thanks"> Note: these actions cannot be revoked </description>
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
import emailValidator from '@/utils/email';
import { cloneDeep as _cloneDeep } from 'lodash';
import { VisibleMessageNameType } from '@/store/ui';
import ObjectKeys from '@/utils/types/ObjectKeys';
import apiClient from '@/utils/apiClient';
import { SiteSettingsMutations } from '@/store/siteSettings';
import { PlanCategory, ProjectSettingsDto, AccountDto, MovedProjectDto } from '@/utils/api';

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
    return {
      email: '',
      errorsEmail: ''
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
      if (!this.email) {
        return false;
      } else this.errorsEmail = emailValidator.isValid(this.email);
      return this.errorsEmail == '';
    }
  },
  methods: {
    changeInputValue(inputName: string, event: any) {
      this.email = event.currentTarget.value;
    },
    transferProject() {
      const data: MovedProjectDto = {
        projectId: this.openProjectId,
        whomEmail: this.email
      };

      apiClient.projects
        .projectsMoved(this.openProjectId.toString(), data)
        .then(() => {
          this.$store.commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success);
          this.$store.commit('project/removeProject', this.openProjectId);
          setTimeout(() => {
            this.$store.dispatch('ui/closeModal');
          }, 2000);
        })
        .catch(error => {
          console.error(error);
          this.$store.commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
        });
    },
    deleteProject() {
      this.$store.dispatch('project/deleteProject', {
        projectId: this.openProjectId
      });
      this.$store.dispatch('ui/closeModal');
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
.transfer {
  &__header {
    &_pb-14 {
      padding-bottom: 20px;
      margin-bottom: 30px;
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
    max-width: 437px;
  }

  &__switch {
    margin-top: 10px;
  }

  &__actions {
    margin-top: 60px;
  }

  &__thanks {
    max-width: 389px;
    margin-top: 17px;
    ::v-deep {
      font-size: 10px;
      line-height: 14px;
      color: #828282;
    }
  }
  &__actions {
    margin-top: 15px;
  }
}
</style>

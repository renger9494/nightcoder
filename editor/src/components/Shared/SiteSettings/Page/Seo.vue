<template>
  <div class="seo">
    <div class="seo__header seo__header_mb-14">
      <title-component>Search Engine Optimization</title-component>
    </div>
    <div class="seo__section">
      <title-component class="seo__subtitle" :theme="'brown'">Title</title-component>
      <description class="seo__section-description">Enter your site name to search</description>
      <field
        :tag="'input'"
        :name="'title'"
        :value="inputValues.title || ''"
        :error="inputErrors.title"
        :lockedText="isUserWithFreePlan ? 'Made by Airtap - Free website builder' : ''"
        :onChange="changeInputValue"
      />
    </div>
    <div class="seo__section">
      <title-component class="seo__subtitle" :theme="'brown'">Description</title-component>
      <description class="seo__section-description">Tell everyone briefly what you do</description>
      <field
        :tag="'textarea'"
        :name="'description'"
        :rows="3"
        :value="isUserWithFreePlan ? 'Software for companies with a mission' : inputValues.description"
        :onChange="changeInputValue"
        :isUserFree="isUserWithFreePlan"
      />
    </div>
    <div class="seo__section">
      <title-component class="seo__subtitle" :theme="'brown'">Keywords</title-component>
      <description class="seo__section-description">Add up to 5 keywords that describe what you offer</description>
      <field :tag="'input'" :name="'keywords'" :value="inputValues.keywords || ''" :onChange="changeInputValue" />
    </div>
    <div class="seo__section">
      <title-component class="seo__subtitle" :theme="'brown'"> Disable search indexing (noindex) </title-component>
      <description class="seo__section-description"> Enter your site name to search. </description>
      <switch-component
        class="general__switch"
        name="isNoIndex"
        :isActive="inputValues.isNoIndex"
        :onClick="changeSwitchValue"
      />
    </div>
    <div class="seo__actions" :class="isDisabledSaveChanges ? 'action-blocked' : ''">
      <button-component :tag="'button'" :onClick="saveChanges" :isDisabled="isDisabledSaveChanges">
        Save
      </button-component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapState, mapGetters } from 'vuex';
import TitleComponent from '@/components/Shared/SiteSettings/Title.vue';
import Description from '@/components/Shared/SiteSettings/Description.vue';
import SwitchComponent from '@/components/Shared/SiteSettings/Switch.vue';
import Field from '@/components/Shared/SiteSettings/Field.vue';
import ButtonComponent from '@/components/Shared/SiteSettings/Button.vue';
import UpgradeToPro from '@/components/Shared/SiteSettings/UpgradeToPro.vue';

import { VisibleMessageNameType } from '@/store/ui';
import ObjectKeys from '@/utils/types/ObjectKeys';
import { BaseProjectPageDto, AccountDto } from '@/utils/api';
import { SiteSettingsMutations } from '@/store/siteSettings';

export default Vue.extend({
  components: {
    TitleComponent,
    Description,
    Field,
    ButtonComponent,
    UpgradeToPro,
    SwitchComponent
  },
  props: {
    page: {
      type: Object as PropType<BaseProjectPageDto>
    }
  },
  data() {
    const { title, description, keywords, isNoIndex } = this.page;
    return {
      inputValues: {
        title,
        description,
        keywords,
        isNoIndex
      } as ObjectKeys<any>,
      inputErrors: {
        title: ''
      },
      isDisabledSaveChanges: true
    };
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user
    }),
    ...mapGetters({
      isUserWithFreePlan: 'auth/isUserWithFreePlan'
    })
  },
  watch: {
    page(currentPage: BaseProjectPageDto) {
      const { title, description, keywords, isNoIndex } = currentPage;
      this.inputValues.title = title;
      this.inputValues.description = description;
      this.inputValues.keywords = keywords;
      this.inputValues.isNoIndex = isNoIndex;

      this.isDisabledSaveChanges = true;
    }
  },
  methods: {
    changeInputValue(inputName: string, event: any) {
      this.inputValues[inputName] = event.currentTarget.value;
      this.isDisabledSaveChanges = false;
    },
    changeSwitchValue(switchName: string) {
      this.inputValues[switchName] = !this.inputValues[switchName];
      this.isDisabledSaveChanges = false;
    },
    saveChanges() {
      if (this.inputValues.title.length === 0) {
        this.inputErrors.title = 'This field must be filled';
        return;
      } else {
        this.inputErrors.title = '';
      }

      const { commit, dispatch } = this.$store;

      const page = { ...this.page, ...this.inputValues };

      dispatch('project/savePage', { page })
        .then(() => {
          this.isDisabledSaveChanges = true;
          commit(`siteSettings/${SiteSettingsMutations.CHANGE_PAGE}`, page);
          commit(`siteSettings/${SiteSettingsMutations.UPDATE_PROJECT_PAGES_PAGE}`, page);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success);
        })
        .catch(() => {
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
        });
    }
  }
});
</script>

<style lang="scss" scoped>
.seo {
  &__header {
    margin-bottom: 30px;

    &_mb-14 {
      padding-bottom: 14px;
      margin-bottom: 30px;
      border-bottom: 1px solid $gray200;

      .title {
        margin-bottom: 0px;
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
    margin-bottom: 8px;
  }

  &__switch {
    margin-top: 10px;
  }

  &__section-description {
    margin-bottom: 18px;
  }

  &__actions {
    margin-top: 60px;
  }
}
</style>

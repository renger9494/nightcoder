<template>
  <div class="general">
    <div class="general__header general__header_mb-14">
      <title-component>General</title-component>
    </div>
    <div>
      <div class="general__section">
        <title-component class="general__subtitle" :theme="'brown'">
          URL
        </title-component>
        <description class="general__section-description">
          Set a name for your page to share with it
        </description>
        <field
          :tag="'input'"
          :name="'url'"
          :value="url || ''"
          :isInputLocked="isHomePage"
          :placeholder="'Example, itmeoblog'"
          :lockedText="publishUrl"
          :isLockedTextCombined="true"
          :lockedTextAlign="'left'"
          :onChange="changeUrl"
        />
        <publish-status :status="publishStatus" :is-home-page="page.isHomePage" />
      </div>
    </div>
    <div class="general__actions" :class="isDisabledSaveChanges ? 'action-blocked' : ''">
      <button-component :tag="'button'" :onClick="saveChanges" :isDisabled="isDisabledSaveChanges">
        Save
      </button-component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import { ModalMode, SiteSettingsMutations, SectionType } from '@/store/siteSettings';

import TitleComponent from '@/components/Shared/SiteSettings/Title.vue';
import Description from '@/components/Shared/SiteSettings/Description.vue';
import Field from '@/components/Shared/SiteSettings/Field.vue';
import ButtonComponent from '@/components/Shared/SiteSettings/Button.vue';
import PublishStatus, { CustomDomainState } from '@/components/Shared/PublishStatus.vue';

import { VisibleMessageNameType } from '@/store/ui';
import { CustomDomainStatus, AccountDto } from '@/utils/api';

export default Vue.extend({
  components: {
    PublishStatus,
    TitleComponent,
    Description,
    Field,
    ButtonComponent
  },
  props: {
    changeActiveSection: {
      type: Function
    },
    page: {
      type: Object
    },
    projectSettings: {
      type: Object
    }
  },
  data() {
    return {
      isDisabledSaveChanges: true,
      url: this.page.url,
      isHomePage: this.page.isHomePage
    };
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user
    }),
    ...mapGetters({
      isUserWithFreePlan: 'auth/isUserWithFreePlan'
    }),
    customDomainStatus(): CustomDomainStatus {
      return this.projectSettings.customDomainStatus;
    },
    publishUrl(): string {
      const { airtapDomain, customDomain } = this.projectSettings;
      const domain = process.env.VUE_APP_AIRTAP_DOMAIN;
      return !!customDomain && this.customDomainStatus === CustomDomainStatus.Published
        ? `${customDomain}${this.isHomePage ? '' : '/'}`
        : `${domain}/w/${airtapDomain}${this.isHomePage ? '' : '/'}`;
    },
    publishStatus(): CustomDomainState {
      if (
        !!this.projectSettings.customDomain &&
        this.projectSettings.customDomainStatus === CustomDomainStatus.NotPublished
      )
        return CustomDomainState.DomainIsntConnected;
      return this.page.isPublished ? CustomDomainState.WebsiteIsPublished : CustomDomainState.NotPublished;
    }
  },
  watch: {
    page(currentPage) {
      this.url = currentPage && currentPage.url;
      this.isHomePage = currentPage && currentPage.isHomePage;
      this.isDisabledSaveChanges = true;
    }
  },
  methods: {
    toDomainSetting() {
      this.$store.commit(`siteSettings/${SiteSettingsMutations.CHANGE_MODAL_MODE}`, ModalMode.Project);
      this.changeActiveSection(SectionType.DOMAIN);
    },
    changeUrl(name: string, event: any) {
      //TODO: change this, it's similar a hack
      if (event.currentTarget && event.currentTarget.value)
        this.url = event.currentTarget.value.replace(/ /g, '_').toLowerCase();

      this.isDisabledSaveChanges = false;
    },
    saveChanges() {
      const page = { ...this.page, isHomePage: this.isHomePage, url: this.url };
      const isChangeHomePage = this.page.isHomePage != page.isHomePage;
      const isChangeUrl = this.url != this.page.url;
      const { commit, dispatch } = this.$store;

      dispatch('project/savePage', { page, isChangeHomePage, isChangeUrl })
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
.general {
  &__header {
    margin-bottom: 30px;

    &_mb-14 {
      padding-bottom: 14px;
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
    a {
      color: #000;
      text-decoration: none;
      &:hover {
        color: #2f80ed;
      }
    }
  }

  &__switch {
    margin-top: 10px;
  }

  &__actions {
    margin-top: 60px;
  }
  &__btn {
    font-weight: bold;
    font-size: 10px;
    line-height: 12px;
    text-align: center;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #bdbdbd;
    padding: 9px 23px;
    background: #ffffff;
    border: 1px solid #dadada;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    margin-top: 17px;

    &.active {
      background: green;
      color: white;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>

<template>
  <div class="home-page">
    <div class="home-page__header home-page__header_pb-14">
      <title-component>Home Page</title-component>
    </div>
    <div class="home-page__section">
      <title-component class="home-page__subtitle" :theme="'brown'">
        Select a Homepage
      </title-component>
      <description class="home-page__section-description">
        You can select this page as your homepage.<br />
        Do not forget to change the link for the homepage.
      </description>
      <div class="dropdown" v-click-outside="() => (dropDown = false)">
        <div class="dropdown__top" @click.prevent="toggleDropdown">
          <p class="dropdown__title">{{ pageName }}</p>
          <svg-icon class="dropdown__icon" :class="{ 'dropdown__icon--open': dropDown }" name="arrow-down-icon" width="9" height="5" color="#4356be" />
        </div>
        <ul class="dropdown__list" :class="{ 'dropdown__list--open': dropDown }">
          <li
            v-for="(page, index) in pages"
            :key="page.id"
            class="dropdown__list-item"
            :class="{ 'dropdown__list-item--home': page.isHomePage }"
            @click="setHomePage(page, index)"
          >
            <svg-icon v-if="page.isHomePage" name="home-page-icon" width="12" height="12" color="#333" />
            <span>{{ page.name }}</span>
          </li>
        </ul>
      </div>
      <div class="home-page__actions" :class="isDisabledSaveChanges ? 'action-blocked' : ''">
        <button-component :tag="'button'" :onClick="saveChanges" :is-disabled="isDisabledSaveChanges">
          Save
        </button-component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import Vue from 'vue';
import { SiteSettingsState, Page, SiteSettingsMutations } from '@/store/siteSettings';
import TitleComponent from '@/components/Shared/SiteSettings/Title.vue';
import Description from '@/components/Shared/SiteSettings/Description.vue';
import ButtonComponent from '@/components/Shared/SiteSettings/Button.vue';
import { cloneDeep as _cloneDeep } from 'lodash';
import { VisibleMessageNameType } from '@/store/ui';

export default Vue.extend({
  name: 'home-page',
  components: {
    TitleComponent,
    Description,
    ButtonComponent,
  },
  computed: {
    ...mapState({
      pages: (state: any) => (<SiteSettingsState>state.siteSettings).projectPages
    }),
    pageName(): string {
      if (this.selectedPage) {
        return this.selectedPage.name;
      } else {
        return this.pages.filter((page: Page) => page.isHomePage)[0].name;
      }
    }
  },
  data(): any {
    return {
      dropDown: false,
      isDisabledSaveChanges: true,
      selectedPage: null
    };
  },
  methods: {
    toggleDropdown() {
      this.dropDown = !this.dropDown;
    },
    setHomePage($page: Page, index: number): void {
      this.$store.commit(`siteSettings/${SiteSettingsMutations.CHANGE_HOME_PAGE}`, index);
      const page = _cloneDeep($page);
      page.isHomePage = true;
      page.url = null;
      this.selectedPage = page;
      this.isDisabledSaveChanges = false;
      this.toggleDropdown();
    },
    saveChanges() {
      const page = { ...this.selectedPage };
      const isChangeHomePage = true;
      const isChangeUrl = true;

      const { commit, dispatch } = this.$store;

      dispatch('project/savePage', { page, isChangeHomePage, isChangeUrl })
        .then(() => {
          this.isDisabledSaveChanges = true;
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
.home-page {
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

  &__section {
    margin-bottom: 30px;
  }

  &__subtitle {
    margin-bottom: 10px;
  }

  &__section-description {
    margin: 0 0 18px;
    max-width: 330px;
  }

  &__actions {
    margin: 46px 0 0;
  }
}

.dropdown {
  width: 100%;
  position: relative;
  &__top {
    width: 100%;
    border: 1px solid #ebebeb;
    box-shadow: 0 2px 4px rgba(57, 61, 69, 0.06);
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    box-sizing: border-box;
    cursor: pointer;
    transition: 0.3s ease-in;

    &:hover {
      border-color: $gray400;
    }
  }

  &__title {
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    margin: 0;
    display: inline-block;
    width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__icon {
    width: 8px;
    height: 5px;
    transition: 0.3s;

    &--open {
      transform: scaleY(-1);
    }
  }

  &__list {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border: 1px solid $gray200;
    box-sizing: border-box;
    box-shadow: 0 8px 18px -6px rgba(24, 39, 75, 0.12), 0 12px 42px -4px rgba(24, 39, 75, 0.12);
    border-radius: 6px;
    padding: 6px;
    z-index: 2;
    background: #fff;
    transition: 0.3s;
    opacity: 0;
    visibility: hidden;
    list-style: none;
    max-height: 150px;
    overflow-y: scroll;
    transform: translate(0, calc(100% + 6px));

    &::-webkit-scrollbar {
      width: 2px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #bdc2c7;
      height: 30px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track-piece {
      display: none;
    }

    &--open {
      opacity: 1;
      visibility: visible;
    }

    &-item {
      padding: 10px 16px;
      transition: 0.3s;
      cursor: pointer;
      display: flex;
      align-items: center;

      &:not(:last-child) {
        margin: 0 0 1px;
      }

      span {
        font-weight: 500;
        font-size: 13px;
        line-height: 15px;
        display: inline-block;
        width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      svg {
        width: 15px;
        height: 15px;
        margin: 0 10px 0 0;
      }

      &:hover {
        background: #f3f3f3;
        border-radius: 4px;
      }

      &--home {
        background-color: #f2f2f2;
        color: $lilac !important;
        svg {
          path {
            fill: $lilac;
          }
        }
      }
    }
  }
}
</style>

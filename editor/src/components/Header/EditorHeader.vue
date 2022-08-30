<template>
  <header
    :class="{
      header_large: type === 'large',
      'header_full-width': type === 'full-width'
    }"
    class="header preview-header"
  >
    <div class="header__inner">
      <div class="header__side first">
        <a :href="rootUrl" class="header__logo" v-tooltip="'Back to dashboard'">
          <svg-icon name="logo" width="34" height="34" />
          <svg-icon name="chevron-left" width="6" height="10" />
        </a>
        <div v-if="authorized == true" class="editor-menu">
          <a v-if="projectId" class="editor-menu__iconed editor-menu__iconed--gray" :href="projectCabinetLink">
            <div class="editor-menu__trigger" v-if="selectedProject && selectedProject.name">
              <span v-tooltip="selectedProject.name">{{ selectedProject.name }}</span>
              <span>/</span>
            </div>
          </a>
          <div
            v-if="projectId && selectedProject"
            :class="isUsersPagesDropdownVisible ? 'active' : ''"
            @click.stop="toggleEditDropdown('pages')"
            class="editor-menu__iconed"
          >
            <div class="editor-menu__trigger" :class="{ 'active' : selectedProject }">
              <svg-icon name="project-page" width="24" height="24" color="#000" />
              <span v-tooltip="selectedPage ? selectedPage.name : ''">{{ selectedPage ? selectedPage.name : '' }}</span>
              <svg-icon class="arrow" name="arrow-down-icon" width="9" height="5" color="#000" />
            </div>
            <transition name="popup-layer" mode="out-in">
              <users-pages-dropdown
                :isUsersSitesDropdownVisible="isUsersSitesDropdownVisible"
                :isUsersPagesDropdownVisible="isUsersPagesDropdownVisible"
                :projectPages="projectPages"
                :hideEditDropdown="hideEditDropdown"
                :selectedProject="selectedProject"
                @showNotification="showDuplicationNotification"
              />
            </transition>
          </div>
        </div>
      </div>
      <div class="header-sections-wrap">
        <div class="header__side">
          <adaptive-buttons-block :isEditor="true" />
        </div>
        <div class="header__section">
          <div class="header__side">
            <div class="header__btns">
              <!--              <button-->
              <!--                @click="saveToBackend(false)"-->
              <!--                :class="{ 'auto-save_disabled': !pageChanged }"-->
              <!--                class="auto-save"-->
              <!--                v-tooltip="'Changes saved'"-->
              <!--              >-->
              <!--                <svg-icon-->
              <!--                  name="check-mark-icon"-->
              <!--                  width="10"-->
              <!--                  height="8"-->
              <!--                  :color="!pageChanged ? '#53b71b' : 'rgba(0, 0, 0, 0.3)'"-->
              <!--                />-->
              <!--              </button>-->
              <button v-if="selectedPage" @click="openPageSettings" class="link-btn">
                <svg-icon name="settings-icon" width="12" height="12" color="#333" />
                <span>Site settings</span>
              </button>
              <router-link
                :to="projectId ? `/preview/projects/${projectId}/pages/${pageId}` : `/preview/templates/${templateId}`"
                tag="button"
                class="link-btn"
              >
                <svg-icon name="preview-icon" width="14" height="9" color="#000" />
                <span>Preview</span>
              </router-link>
            </div>
            <PublishBtn
              v-if="selectedPage"
              :isHasUnpublishedChanges="selectedPage && selectedPage.isHasUnPublishedChanges"
              :isPublished="selectedPage.isPublished"
            />
            <div v-if="user.isAdmin && isTemplate" class="img-button">
              <button @click="openSaveTemplatePopup()" class="img-button__btn">
                <span class="img-button__text">Update template</span>
                <svg-icon name="arrow-down-icon" width="9" height="5" color="#fff" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <transition name="popup-settings" mode="out-in">
        <site-settings v-if="visibleModalName === 'site-settings'" :isVisible="visibleModalName === 'site-settings'" />
      </transition>
      <transition name="fade">
        <SavePopup v-if="savePopup" :text="savePopupText" />
      </transition>
      <overlay :isVisible="visibleModalName !== null" />
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import UsersPagesDropdown from '@/components/Shared/Header/UsersPagesDropdown.vue';
import AdaptiveButtonsBlock from '@/components/Editor/AdaptiveButtonsBlock.vue';
import PublishBtn from './PublishBtn.vue';
import SiteSettings from '@/components/Shared/SiteSettings/SiteSettings.vue';
import Overlay from '@/components/Shared/Overlay.vue';
import SavePopup from '@/components/Editor/SavePopup.vue';
import { mapGetters, mapState } from 'vuex';
import { BaseProjectDto, BaseProjectPageDto, InterfaceElementType, SaveInterfaceElementConfigDto } from '@/utils/api';
import apiClient from '@/utils/apiClient';
import {
  PopupContainerType,
  PopupSettings,
  PopupType,
  NewTemplatePopupData,
  SaveTemplatePopupData,
  TemplateElement
} from '../Editor/Sidebar/Modal/types';

export default Vue.extend({
  name: 'EditorHeader',
  components: {
    UsersPagesDropdown,
    AdaptiveButtonsBlock,
    PublishBtn,
    SiteSettings,
    Overlay,
    SavePopup
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    authorized: Boolean
  },
  data() {
    return {
      savePopupText: 'Project successfully saved!!!',
      savePopup: false,
      isProfileDropdownVisible: false,
      isMenuDropdownVisible: false,
      isUsersSitesDropdownVisible: false,
      isUsersPagesDropdownVisible: false,
      pageChanged: false,
      saveTimer: null as null | number
    };
  },
  computed: {
    ...mapState({
      user: (state: any) => state.auth.user,
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
      templateId: (state: any) => state.editor.templateId,
      template: (state: any) => state.editor.template,
      historyUn: (state: any) => state.editor.editorHistoryUn.length,
      historyRe: (state: any) => state.editor.editorHistoryRe.length,
      previewMode: (state: any) => state.editor.previewMode,
      userConfig: (state: any) => state.editor.userConfig,
      lastSaveRequest: (state: any) => state.editor.lastSaveRequest,
      editorFieldWidth: (state: any) => state.editor.editorFieldWidth,
      visibleModalName: (state: any) => state.ui.visibleModalName,
      projectPages: (state: any) => state.project.projectPages,
      projects: (state: any) => <BaseProjectDto[]>state.project.projects,
      templateElement: (state: any) => <TemplateElement>state.editor.templateElement
    }),
    ...mapGetters({
      // templateElement: 'editor/templateElement',
      getElementsByCondition: 'elementTypes/getElementsByCondition'
    }),
    projectId(): string {
      return this.$route.params.projectId;
    },
    pageId(): string {
      return this.$route.params.pageId;
    },
    routeName(): string | null | undefined {
      return this.$route.name;
    },
    selectedProject(): BaseProjectDto | undefined {
      return this.projects.find((project: BaseProjectDto) => {
        console.log(project.id, +this.projectId);
        return project.id == +this.projectId;
      });
    },
    selectedPage(): BaseProjectPageDto {
      return this.projectPages.find((page: BaseProjectPageDto) => {
        return page.id == +this.pageId;
      });
    },
    rootUrl(): string {
      const cabinetUrl = process.env.VUE_APP_CABINET_URL;
      return this.isUserLoggedIn ? `${cabinetUrl}/dashboard` : `${cabinetUrl}`;
    },
    projectCabinetLink(): string {
      const cabinetUrl = process.env.VUE_APP_CABINET_URL;
      return `${cabinetUrl}/dashboard/projects/${this.projectId}/pages`;
    },
    activeDropdownItem(): string {
      const { name, params } = this.$route;

      if (name === 'dashboard') return 'dashboard';
      if (name === 'settings' && params.section === 'help') return 'help';
      if (name === 'settings' && params.section === 'plans') return 'plans';
      if (name === 'settings') return 'settings';

      return '';
    },
    isTemplate(): boolean {
      return !!this.$route?.params?.templateId;
    }
  },
  watch: {
    userConfig: {
      deep: true,
      handler() {
        this.pageChanged = true;
      }
    },
    lastSaveRequest: {
      handler(newValue, oldValue) {
        if (newValue && newValue.status === 'saved') {
          this.savePopup = true;
          this.pageChanged = false;
          this.saveTimer = setTimeout(() => {
            this.savePopup = false;
          }, 2000);
        }
      }
    }
  },
  async created() {
    document.addEventListener('click', this.hideProfileDropdown);
    document.addEventListener('click', this.hideEditDropdown);
    document.addEventListener('keyup', this.hideEditDropdown);
    document.addEventListener('keyup', this.hideProfileDropdown);
    document.addEventListener('click', this.hideMobileDropdown);

    const { name, params } = this.$route;
    console.info('router name', { name, params });
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hideProfileDropdown);
    document.removeEventListener('keyup', this.hideProfileDropdown);
    document.addEventListener('click', this.hideMobileDropdown);
  },
  methods: {
    openNewTemplatePopup() {
      if (this.templateElement) return;
      const { pageId, projectId } = this.$route.params;

      const popupSettings: PopupSettings<NewTemplatePopupData> = {
        active: true,
        closeButton: true,
        header: 'Save as template',
        content: PopupType.NewTemplate,
        container: PopupContainerType.Large,
        data: {
          pageId: +pageId,
          projectId: +projectId
        }
      };
      this.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings);
    },
    openSaveTemplatePopup() {
      const { dependTemplate } = this.userConfig; // <== deprecated, remove this after all depedencies save in TemplateProjectPageDependencies
      const popupSettings: PopupSettings<SaveTemplatePopupData> = {
        active: true,
        closeButton: true,
        header: 'Save template',
        content: PopupType.SaveTemplate,
        container: PopupContainerType.Large,
        data: {
          template: !this.templateElement ? dependTemplate : this.templateElement
        }
      };

      this.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings);
    },

    toggleEditDropdown(popup: any) {
      if (popup === 'pages') {
        this.isUsersSitesDropdownVisible = false;
        this.isUsersPagesDropdownVisible = !this.isUsersPagesDropdownVisible;
      } else {
        this.isUsersPagesDropdownVisible = false;
        this.isUsersSitesDropdownVisible = !this.isUsersSitesDropdownVisible;
      }
    },
    toggleProfileDropdown(event: Event) {
      if (event) event.preventDefault();

      this.isProfileDropdownVisible = !this.isProfileDropdownVisible;
    },
    toggleMenuDropdown(event: Event) {
      if (event) event.preventDefault();

      this.isMenuDropdownVisible = !this.isMenuDropdownVisible;
    },
    async openPageSettings() {
      const { dispatch } = this.$store;
      const { projectId, id } = this.selectedPage;
      await dispatch('siteSettings/loadModalData', { projectId, pageId: id });

      await dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: 'site-settings'
      });
    },
    hideEditDropdown(event: any) {
      if (event) {
        //TODO: why we don't use click outside??
        if (
          event.key === 'Escape' ||
          // These are exceptions: the blocks on what click should NOT close the profile dropdown
          (!event.target.closest('div.editor-menu__iconed') && !event.target.closest('.edit-dropdown')) ||
          // These are blocks on what click SHOULD close the profile dropdown
          event.target.classList.contains('edit-dropdown-item__preview-wrap') ||
          event.target.closest('.edit-dropdown-item__preview-wrap') ||
          event.target.classList.contains('edit-dropdown__close') ||
          event.target.closest('.edit-dropdown__close') ||
          event.target.closest('.edit-dropdown-item__btn').classList.contains('settings') ||
          event.target.classList.contains('settings')
        ) {
          this.isUsersSitesDropdownVisible = false;
          this.isUsersPagesDropdownVisible = false;
        }
      }
    },
    hideProfileDropdown(event: any) {
      if (event) {
        if (
          event.key === 'Escape' ||
          // These are exceptions: the blocks on what click should NOT close the profile dropdown
          (!event.target.closest('.header__user-info') &&
            !event.target.closest('.user-info__profile-dropdown') &&
            !event.target.closest('.header__profile-dropdown') &&
            !event.target.closest('.header__profile-dropdown-toggler')) ||
          // These are blocks on what click SHOULD close the profile dropdown
          event.target.classList.contains('profile-dropdown__menu-item') ||
          event.target.closest('.profile-dropdown__menu-item') ||
          event.target.classList.contains('profile-dropdown__social-menu-item') ||
          event.target.closest('.profile-dropdown__social-menu-item')
        ) {
          this.isProfileDropdownVisible = false;
        }
      }
    },
    hideMobileDropdown(event: any) {
      if (event) {
        if (
          event.target.classList.contains('menu-dropdown__list-link_active') ||
          event.target.closest('.menu-dropdown__list-link_active') ||
          event.target.closest('.header__menu-dropdown-toggler')
        ) {
          return;
        }

        if (
          event.target.classList.contains('menu-dropdown__list-link') ||
          event.target.closest('.menu-dropdown__list-link') ||
          event.target.classList.contains('menu-dropdown__social-list-link') ||
          event.target.closest('.menu-dropdown__social-list-link') ||
          !event.target.closest('.header__menu-dropdown')
        ) {
          this.isMenuDropdownVisible = false;
        }
      }
    },
    handleLogInLinkClick(event: Event) {
      if (event) event.preventDefault();

      this.$router.push('/login');
      this.isMenuDropdownVisible = false;
    },
    saveToBackend(isntConfirm: boolean) {
      if (!this.userConfig) {
        console.warn("[saveToBackend]: can't save userConfig. It's empty");
        return;
      }

      // const userConfigString = JSON.stringify(this.userConfig).replace(/\\n/g, '');
      const templateId = this.$route.params.templateId;
      if (templateId) {
        const templateElement = this.getElementsByCondition({
          elementType: 'Templates',
          condition: function (element: any) {
            return element.config.templateId == templateId;
          }
        })[0];

        if (!templateElement) {
          console.warn(`[saveToBackend]: not found template by id ${templateId} in store`);
          return;
        }

        const dto: SaveInterfaceElementConfigDto = {
          config: JSON.stringify({
            config: this.userConfig,
            templateId: templateElement.config.templateId
          })
        };

        apiClient.interfaceElements
          .interfaceElementsSaveConfig(InterfaceElementType.Templates, templateElement.id, dto)
          .then(() => {
            if (!isntConfirm) this.savePopup = true;
            this.$store.commit('editor/setLastSaveRequest', 'saved');
            this.savePopupText = 'Template successfully saved!';
            if (!isntConfirm) setTimeout(() => (this.savePopup = false), 1000);
          })
          .catch(error => {
            this.savePopupText = 'Error while saving template :(';
            this.$store.commit('editor/setLastSaveRequest', 'error');
            if (!isntConfirm) {
              this.savePopup = true;
              setTimeout(() => (this.savePopup = false), 1000);
            }
          });
      } else {
        this.$store
          .dispatch('editor/savePageSettings')
          .then(() => {
            this.savePopupText = 'Project successfully saved!';
            if (!isntConfirm) {
              this.savePopup = true;
              setTimeout(() => (this.savePopup = false), 1000);
            }
          })
          .catch(error => {
            this.savePopupText = 'Error while saving project :(';
            if (!isntConfirm) this.savePopup = true;
            if (!isntConfirm) setTimeout(() => (this.savePopup = false), 1000);
            console.error(error);
          });
      }
    },
    showDuplicationNotification(type: string) {
      this.savePopupText = `${type} duplicated`;
      this.savePopup = true;

      setTimeout(() => {
        this.savePopup = false;
        this.savePopupText = 'Project successfully saved!!!';
      }, 3000);
    }
  }
});
</script>

<style lang="scss" scoped>
.header-sections-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header__section {
  display: flex;
  align-items: center;
}
.img-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: space-between;
  padding: 0 18px;
  height: 30px;
  background: $black;
  border-radius: $shape_border_radius;
  cursor: pointer;
  transition: 0.3s;
  span {
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: normal;
    color: $white;
    margin-right: 5px;
  }
  &:hover {
    opacity: 0.8;
  }
}
.auto-save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #ffffff;
  border-radius: $shape_border_radius;
  cursor: pointer;
  &:not(.auto-save_disabled):hover {
    background: #f3f3f3;
    path {
      fill: rgba(0, 0, 0, 1);
    }
  }
  path {
    fill: rgba(0, 0, 0, 0.3);
  }
  &_disabled {
    pointer-events: none;
    path {
      fill: #53b71b;
    }
  }
}

.header__btns {
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.link-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 10px;
  margin-right: 10px;
  background: #ffffff;
  border-radius: $shape_border_radius;
  cursor: pointer;
  &:hover {
    background: #f3f3f3;
  }

  svg {
    margin: 0 8px 0 0;
  }

  span {
    font-size: 13px;
    line-height: 16px;
  }
}

.popup-enter-active {
  animation: popup-in 0.2s forwards;
}
.popup-leave-active {
  animation: popup-out 0.2s forwards;
}
@keyframes popup-in {
  from {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px) scale(0.95);
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
    visibility: visible;
  }
}
@keyframes popup-out {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
    visibility: visible;
  }
  to {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px) scale(0.95);
  }
}
.header {
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.06);
  height: 60px;
  z-index: 9999;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  &_full-width {
    .header__inner {
      max-width: 100%;
      padding-right: 20px;
      padding-left: 20px;

      @include sm-down {
        padding-right: 15px;
        padding-left: 15px;
      }

      @include xs-down {
        padding-right: 15px;
        padding-left: 15px;
      }
    }
  }

  &_large {
    .header__inner {
      max-width: 1574px;
      width: 100%;
      padding-right: 60px;
      padding-left: 60px;

      @include sm-down {
        padding-right: 40px;
        padding-left: 40px;
      }

      @include xs-down {
        padding-right: 20px;
        padding-left: 20px;
      }
    }
  }

  &__inner {
    position: relative;
    z-index: 998;
    display: flex;
    align-items: center;
    max-width: 1330px;
    height: 60px;
    background-color: #ffffff;
    padding-right: 60px;
    padding-left: 60px;
    margin-right: auto;
    margin-left: auto;

    @include sm-down {
      padding-right: 40px;
      padding-left: 40px;
    }

    @include xs-down {
      padding-right: 20px;
      padding-left: 20px;
    }
  }

  &__side {
    display: flex;
    align-items: center;
    margin: 0 auto;
    &.first {
      margin: 0 -50px 0 0;
    }
    @include lg-down {
      min-width: initial;
    }
  }

  &__logo {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: top;
    position: relative;
    transform: translate(-9px, 0);

    svg {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      position: absolute;
      transition: 0.3s;
      &:last-child {
        opacity: 0;
      }
    }

    &:hover {
      svg {
        &:first-child {
          opacity: 0;
        }
        &:last-child {
          opacity: 1;
        }
      }
    }
  }

  &__menu {
    @include lg-down {
      display: none;
    }
  }

  &__log-in-button {
    @include lg-down {
      display: none;
    }
  }

  &__upgrade-to-pro-button {
    margin-right: 20px;

    @include lg-down {
      display: none;
    }
  }

  &__user-info {
    @include lg-down {
      display: none;
    }
  }

  &__profile-dropdown {
    display: none;

    @include lg-down {
      display: block;
    }
  }
}
.template-width {
  display: flex;
  align-items: center;
  margin: 0 23px 0 14px;
  span {
    display: block;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    margin-left: 3px;
    color: #828282;
  }
  input {
    width: 30px;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    color: #000000;
    text-align: right;
  }
}

.editor-menu {
  display: flex;
  align-items: center;
  height: 30px;
  margin-left: 10px;
  position: relative;
  @include xs-down {
    display: none;
  }
  &__trigger {
    display: flex;
    align-items: center;
  }
  &__iconed {
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    padding: 4px 12px 4px 6px;
    background: transparent;
    border-radius: $shape_border_radius;
    transition: 0.3s all ease;
    &:first-of-type {
      margin-left: 0;
    }
    &.disabled {
      pointer-events: none;
    }
    &:hover, &.active {
      background: $gray100;
      svg,
      span {
        color: $lilac !important;
      }
    }
    .arrow {
      position: relative;
      top: 2px;
    }
    &.active {
      svg:last-child {
        transform: rotate(180deg);
      }
    }
    svg {
      transition: 0.3s all ease;
      &:first-child {
        margin: 0 4px 0 0;
      }
    }
    span {
      display: inline-block;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 15px;
      color: #000000;
      max-width: 77px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 6px;
      transition: 0.3s all ease;
    }

    &--gray {
      padding: 0;
      &:hover {
        background: transparent;
      }
      span {
        color: $gray600;
      }
    }
  }
  a.editor-menu__iconed {
    span {
      margin-left: 10px;
    }
    path {
      transition: 0.3s all ease;
    }
    &:hover {
      path {
        fill: #333;
      }
    }
  }
  div.editor-menu__iconed {
    &:not(:first-child) {
      margin-left: 4px;
    }
    span {
      margin-right: 6px;
    }
  }
  &__sep {
    margin-left: 4px;
  }
}
</style>

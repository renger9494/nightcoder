<template>
  <div class="design-block-editor">
    <div class="sidebar-head">
      <div class="sidebar-head__item">
        <p class="sidebar-head__title sidebar-head__title--dots" v-if="!isTemplate">
          <span style="color: #949cad; text-transform: initial">Page name: </span>
          <span class="dots">{{ selectedPage.name }}</span>
        </p>
      </div>
    </div>

    <!--  <div v-if="isUserAdmin" class="img-button">
      <button @click="isSavedTemplate ? openSaveTemplatePopup() : openNewTemplatePopup()" class="img-button__btn">
        <span class="img-button__img">
          <svg-icon name="save-icon" width="12" height="12" />
        </span>
        <span class="img-button__text">{{ isSavedTemplate ? 'Update template' : 'Save as new template' }}</span>
      </button>
    </div> -->

    <div class="design-block-editor__content">
      <svg-icon class="design-block-editor__icon" name="empty-sidebar-icon" width="31" height="33" />
      <p class="design-block-editor__text">Select the item to edit</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import RootSection from '@/components/Editor/Sidebar/DesignType/Sections/Root.vue';

import { mapState } from 'vuex';
import { AccountDto, BaseProjectPageDto } from '@/utils/api';
import {
  NewTemplatePopupData,
  PopupContainerType,
  PopupSettings,
  PopupType,
  SaveTemplatePopupData,
  TemplateElement
} from '@/components/Editor/Sidebar/Modal/types';

export default Vue.extend({
  components: {
    RootSection
  },
  props: {
    blockName: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      //
    };
  },
  computed: {
    ...mapState({
      userConfig: (state: any) => state.editor.userConfig,
      user: (state: any) => <AccountDto>state.auth.user,
      //we set it on editor page, when user go to pages 'template' or 'project page'
      templateElement: (state: any) => <TemplateElement>state.editor.templateElement,
      projectPages: (state: any) => state.project.projectPages
    }),
    pageId(): string {
      return this.$route.params.pageId;
    },
    selectedPage(): any {
      if (this.$route?.params?.blockId) return { name: 'Block update' };
      return this.projectPages.find((page: BaseProjectPageDto) => page.id == +this.pageId) ?? { name: 'Untitled' };
    },
    isUserAdmin(): boolean {
      return this.user?.isAdmin;
    },
    isSavedTemplate(): boolean {
      return (
        !!this.templateElement || (this.userConfig.dependTemplate && this.userConfig.dependTemplate.templateId > 0)
      );
    },
    isTemplate(): boolean {
      return !!this.$route?.params?.templateId;
    }
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
    }
  }
});
</script>

<style lang="scss">
.design-block-editor {
  height: 100%;
  &__content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__text {
    font-size: 12px;
    line-height: 16px;
    color: $gray200;
    margin: 0 0 15px;
  }

  &__icon {
    width: 31px;
    height: 33px;
  }

  .dots {
    display: inline-block;
    max-width: 110px;
    margin: 0 0 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.img-button {
  padding: 20px 20px 0;

  &__btn {
    display: flex;
    align-items: center;
  }

  &__img {
    margin-right: 12px;
  }

  &__btn:hover {
    cursor: pointer;
  }
}
</style>

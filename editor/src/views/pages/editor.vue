<template>
  <div class="editor-page-wrapper" ref="el">
    <clipboard-provider />
    <delete-project-confirmation-modal :is-visible="visibleModalName === VisibleModalType.DeleteProjectConfirmation" />
    <delete-project-success-message :is-visible="visibleMessageName === VisibleMessageNameType.DeleteProjectSuccess" />
    <templates-modal
      v-if="visibleModalName === VisibleModalType.Templates"
      :is-visible="visibleModalName === VisibleModalType.Templates"
    />
    <limit-modal
      v-if="visibleModalName === VisibleModalType.Limit"
      :is-visible="visibleModalName === VisibleModalType.Limit"
    />

    <transition name="skeleton-left">
      <editor-skeleton-bar v-if="!isEditorDataLoaded" />
    </transition>

    <transition name="fade">
      <div v-if="isEditorDataLoaded" class="template_area">
        <elements-bar v-if="thisIsEditor()" />

        <div :class="{ preview_mod: !isEditorMode }" class="editor_view">
          <div
            v-dragscroll="isDragscroll"
            :class="{
              dragscroll: isDragscroll,
              dragscrolling: isDragscrolling
            }"
            class="template_wrapper"
            @dragscrollend="isDragscrolling = false"
            @dragscrollstart="isDragscrolling = true"
            @click="templateWrapperClick"
            @scroll="onScrollTemplateWrapper"
            @wheel="onScrollTemplateWrapper"
          >
            <div style="minwidth: 100%" class="editor-area-wrapper">
              <div v-if="isEditorMode" class="editor-area-wrapper__breakpoint">{{ breakpointText }}</div>
              <editor-area
                ref="editorArea"
                :class="{
                  [`editor-area_${previewMode}`]: true,
                  'editor-area--preview': !isEditorMode
                }"
                :is-dragscroll="isDragscroll"
                :style="{
                  pointerEvents: isDragscroll ? 'none' : 'all',
                  height: isEditorMode ? `${iframeHeight}px` : 'auto',
                  ...(isEditorMode ? { transform: `scale(${zoom})` } : {}),
                  transformOrigin: `${transformOrigin.x}% ${transformOrigin.y}%`
                }"
                class="editor-area"
                :is-editor-mode="isEditorMode"
              >
                <CustomTemplatePreview
                  v-if="userConfig && !isEditorMode"
                  v-model="userConfig"
                  :previewMode="previewMode"
                  :siteSettings="siteSettings"
                />
                <CustomTemplateEditor v-if="userConfig && isEditorMode" v-model="userConfig" />
              </editor-area>
            </div>
          </div>
        </div>

        <sidebar-editor v-if="thisIsEditor()" :user-config="userConfig" />
      </div>
    </transition>

    <transition name="skeleton">
      <editor-skeleton v-if="!isEditorDataLoaded" />
    </transition>

    <SavePopup v-if="showPopup" :showEmoji="false" :text="popupText" />

    <message
      class="editor-page-wrapper__message"
      v-if="visibleMessageName === VisibleMessageNameType.MoveElement"
      :text="'Element moved to another Block'"
    />
    <!--    {{( isOnboardingActive || !isHelperShown )}}-->
    <onboarding v-if="isEditorDataLoaded && (!isHelperShown || isOnboardingActive)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// @ts-ignore
import { dragscroll } from 'vue-dragscroll';
import {
  cloneDeep as _cloneDeep,
  debounce,
  startCase as _startCase,
  throttle as _throttle,
  capitalize as _capitalize,
  capitalize
} from 'lodash';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import '@/assets/scss/editor/main.scss';
import 'shepherd.js/dist/css/shepherd.css';

import http, { getCabinetUrl, redirectTo404 } from '@/utils/http';
import apiClient from '@/utils/apiClient';
import mousetrap from 'mousetrap';

//templates components
import CustomTemplateEditor from '@/components/Editor/CustomTemplateEditor.vue';
import CustomTemplatePreview from '@/components/Editor/CustomTemplatePreview.vue';

import EditorArea from '@/components/Editor/EditorArea.vue';
import SidebarEditor from '@/components/Editor/Sidebar/index.vue';
import ElementsBar from '@/components/Editor/Sidebar/ElementsBar.vue';

//shared components
import DeleteProjectConfirmationModal from '@/components/Shared/DeleteProjectConfirmationModal.vue';
import DeleteProjectSuccessMessage from '@/components/Shared/DeleteProjectSuccessMessage.vue';
import LimitModal from '@/components/Shared/LimitModal.vue';
import PublishModal from '@/components/Shared/PublishModal.vue';
import PublishProcessModal from '@/components/Shared/PublishProcessModal.vue';
import AddElementPopup from '@/components/Editor/AddElementPopup.vue';
import EditorSkeleton from '@/components/Editor/EditorSkeleton.vue';
import EditorSkeletonBar from '@/components/Editor/EditorSkeletonBar.vue';
import SavePopup from '@/components/Editor/SavePopup.vue';
import ClipboardProvider from '@/components/Editor/Elements/ClipboardProvider.vue';
import Message from '@/components/Shared/SiteSettings/Message.vue';

import { getUploadUrlByRoute } from '@/helpers/upload';
import { getSelectedComponentsForClipboard, getUserConfigFromClipboard, ImageFile } from '@/helpers/editorUtilities';
import { ElementType } from '@/store/elements/create';
import { VisibleMessageNameType, VisibleModalType } from '@/store/ui';
import Onboarding from '@/components/Editor/Onboarding.vue';
import cookies from '@/utils/cookies';
import WebFont from 'webfontloader';

export default Vue.extend({
  name: 'EditorPage',
  components: {
    Onboarding,
    ElementsBar,
    EditorSkeleton,
    EditorSkeletonBar,
    SavePopup,
    PublishModal,
    EditorArea,
    LimitModal,
    SidebarEditor,
    DeleteProjectConfirmationModal,
    CustomTemplateEditor,
    CustomTemplatePreview,
    DeleteProjectSuccessMessage,
    PublishProcessModal,
    AddElementPopup,
    ClipboardProvider,
    Message
  },
  directives: {
    dragscroll
  },
  data() {
    return {
      // iframeWidth: 0,
      VisibleModalType,
      VisibleMessageNameType,
      innerWidth: window.innerWidth,
      isLoading: true,
      isTemplateLoaded: false,
      isPreviewing: false,
      projectId: null as null | number,
      pageId: null as null | number,
      isDragscroll: false,
      isDragscrolling: false,
      isProjectPublished: false,
      publishProgressInterval: null,
      saveTimer: undefined as number | undefined,
      lastScrollPosition: 0,
      transformOrigin: {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0
      },
      popupText: '',
      showPopup: false,
      isFirstSaveSettings: true,
      isHelperShown: 'true' as null | string
    };
  },
  computed: {
    ...mapGetters({
      activeShortcut: 'shortcut/activeShortcut',
      elementsSortedByZindex: 'editor/elementsSortedByZindex',
      templateElement: 'editor/templateElement',
      createNewBlockConfig: 'editor/createNewBlockConfig',
      blockToViewId: 'editor/blockToViewId',
      getProjectSettingsById: 'project/getProjectSettingsById',
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    }),
    ...mapState({
      iframeHeight: (state: any) => state.editor.iframeHeight,
      projects: (state: any) => state.project.projects,
      userConfig: (state: any) => state.editor.userConfig,
      visibleModalName: (state: any) => <VisibleModalType>state.ui.visibleModalName,
      visibleMessageName: (state: any) => <VisibleMessageNameType>state.ui.visibleMessageName,
      projectPages: (state: any) => state.project.projectPages,
      previewMode: (state: any) => state.editor.previewMode,
      zoom: (state: any) => state.editor.zoom,
      isTextEditing: (state: any) => state.ui.isTextEditing,
      isSelecting: (state: any) => state.ui.isSelecting,
      registeredShortcuts: (state: any) => state.shortcut.registeredShortcuts,
      selectedBlocks: (state: any) => state.editor.selectedBlocks,
      selectedElements: (state: any) => state.editor.selectedElements,
      isInserting: (state: any) => state.editor.isInserting,
      popupSettings: (state: any) => state.editor.popupSettings,
      templateId: (state: any) => state.editor.templateId,
      template: (state: any) => state.editor.template,
      clipboardImage: (state: any) => <ImageFile>state.editor.clipboard.image,
      clipboardContent: (state: any) => state.editor.clipboard.content,
      historyUn: (state: any) => state.editor.editorHistoryUn.length,
      historyRe: (state: any) => state.editor.editorHistoryRe.length,
      isEditorDataLoaded: (state: any) => state.ui.isEditorDataLoaded,
      isHelperOpen: (state: any) => state.ui.isHelperOpen,
      isOnboardingActive: (state: any) => state.ui.isOnboardingActive,
      editorFieldWidth: (state: any) => state.editor.editorFieldWidth
    }),
    isEditorMode(): boolean {
      return this.$route.name !== 'preview';
    },
    isEnableAutoSave(): boolean {
      const { blockId, templateId } = this.$route.params;
      if (blockId || templateId) return false;

      return process.env.VUE_APP_IS_AUTOSAVE !== 'false';
    },
    siteSettings(): any {
      const { projectId } = this.$route.params;
      return this.getProjectSettingsById(projectId);
    },
    isOnboardingActive(): boolean {
      return this.$store.state.ui.isOnboardingActive;
    },
    breakpointText(): string {
      return `${this.previewMode !== 'laptop' ? _capitalize(this.previewMode) : 'Desktop'}: ${
        this.editorFieldWidth
      } px`;
    }
  },
  watch: {
    //TODO: do we need to save changes for templates and another interface elements?
    userConfig: {
      deep: true,
      handler(newVal) {
        console.log('userConfig', newVal);
        if (this.isFirstSaveSettings) {
          this.isFirstSaveSettings = false;
          return;
        }

        // отключил автосейв в деве
        if (this.isEnableAutoSave) {
          if (this.saveTimer) clearTimeout(this.saveTimer);
          this.saveTimer = setTimeout(() => {
            this.savePageSettings();
          }, 1000);
        }
      }
    },
    clipboardImage: {
      async handler() {
        this.showNotification(`Please wait, pasting image...`, 1500);
        const pastedElement = await this.pasteImage({
          url: getUploadUrlByRoute(this.$route),
          imageFile: this.clipboardImage
        });
        this.showNotification(`Image pasted`, 1000);
      }
    },
    clipboardContent: {
      async handler() {
        // Если вставляют конфиг
        const userConfig = getUserConfigFromClipboard(this.clipboardContent.text);
        if (userConfig) {
          await this.loadCopiedElementsFonts(userConfig.config.selectedElements);
          const pastedElements = await this.pasteUserConfig({
            userConfig: userConfig.config
          });
          this.$store.commit('editor/actualiseFontList');
          if (pastedElements.length !== 0) this.showNotification(`Elements pasted`, 1000);
          return;
        }
        //Проверяем остальные варианты данных которые могли вставить текстом
        const parser = new DOMParser();
        const dom = parser.parseFromString(this.clipboardContent.text, 'application/xml');
        const nodeName = dom.documentElement.nodeName;
        if (nodeName !== 'parsererror' && nodeName === 'svg') {
          await this.pasteIcon({ dom, url: getUploadUrlByRoute(this.$route) });
          this.showNotification(`Icon pasted`, 1000);
        }
      }
    },
    blockToViewId: {
      deep: true,
      handler(newBlockId) {
        this.$nextTick(() => {
          const block = document.querySelector(`#${newBlockId}`);
          block?.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
          });
        });
      }
    },
    activeShortcut() {
      if (this.activeShortcut && this.activeShortcut.shortcut) {
        if (Array.isArray(this.activeShortcut.shortcut.desc)) {
          let shortcutIdx = -1;

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex(
            (value: string) => value === 'ctrl+z' || value === 'command+z'
          );
          if (shortcutIdx !== -1 && this.historyUn) {
            this.$store.commit('editor/cleanSelectedElements');
            this.dropAllAPs();
            this.changeConfigFromHistory(false);
          }

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex(
            (value: string) => value === 'ctrl+shift+z' || value === 'command+shift+z'
          );
          if (shortcutIdx !== -1 && this.historyRe) {
            this.$store.commit('editor/cleanSelectedElements');
            this.dropAllAPs();
            this.changeConfigFromHistory(true);
          }

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex(
            (value: string) => value === 'backspace' || value === 'del'
          );
          if (shortcutIdx !== -1 && !this.popupSettings.active) {
            this.removeSelectedBlocksAndElements();
          }

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex(
            (value: string) => value === 'ctrl+alt+down' || value === 'command+option+down'
          );
          if (shortcutIdx !== -1) {
            this.moveSelectedBlock(1);
          }

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex(
            (value: string) => value === 'ctrl+alt+up' || value === 'command+option+up'
          );
          if (shortcutIdx !== -1) {
            this.moveSelectedBlock(-1);
          }

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex((value: string) => {
            return value === 'ctrl+shift+h' || value === 'command+shift+h';
          });
          if (shortcutIdx !== -1) {
            this.changeHelperOpenType(!this.isHelperOpen);
          }

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex(
            (value: string) => value === 'ctrl+d' || value === 'command+d'
          );
          if (shortcutIdx !== -1) {
            if (!this.selectedElements.length && !this.selectedBlocks.length) return;
            let type = '';
            if (this.selectedBlocks.length === 0) {
              type = this.selectedElements.length > 1 ? 'Elements' : _startCase(this.selectedElements[0].element.type);
              this.duplicateSelectedElements();
            } else {
              type = this.selectedBlocks.length > 1 ? 'Blocks' : 'Block';
              this.duplicateSelectedBlocks();
            }
            this.showNotification(`${type} duplicated`, 1000);
          }

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex(
            (value: string) => value === 'ctrl+c' || value === 'command+c'
          );
          if (shortcutIdx !== -1 && (this.selectedBlocks.length >= 1 || this.selectedElements.length >= 1)) {
            this.proceedCopyShortcut();
          }

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex(
            (value: string) => value === 'ctrl+x' || value === 'command+x'
          );
          if (shortcutIdx !== -1) {
            this.proceedCopyShortcut();
            this.removeElements(this.selectedElements.map((el: any) => el.element));
            this.removeBlocks({ blocks: this.selectedBlocks });
            this.cleanSelectedElements();
          }

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex(
            (value: string) => value === 'ctrl+shift+b' || value === 'command+shift+b'
          );

          if (shortcutIdx !== -1) {
            const newBlockConfig = _cloneDeep(
              this.createNewBlockConfig({
                insertAfter: this.blocksSortedBySortId[this.blocksSortedBySortId.length - 1]?.sortId ?? 0,
                name: 'Empty Block'
              })
            );
            this.insertBlockToConfig({
              blockConfig: newBlockConfig
            });
            this.changeBlockToViewId(newBlockConfig.id);
            this.$store.commit('editor/changeBlockToViewId', newBlockConfig.id);
          }

          shortcutIdx = this.activeShortcut.shortcut.desc.findIndex(
            (value: string) => value === 'ctrl+i' || value === 'command+i'
          );
          if (shortcutIdx !== -1 && this.popupSettings.active === false) {
            this.addNewElement(ElementType.Icon);
          }
        }
        if (this.activeShortcut.shortcut.desc === 'esc') {
          if (this.popupSettings.active) {
            this.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
            return;
          }
          this.clearSelection();
          if (this.isInserting) {
            this.$store.commit('editor/changeEditorParam', {
              path: 'isInserting',
              value: false
            });
          }
        }

        if (this.activeShortcut.shortcut.desc === 'i' && this.popupSettings.active === false) {
          this.addNewElement(ElementType.Image);
        }
        if (this.activeShortcut.shortcut.desc === 't' && this.popupSettings.active === false) {
          this.addNewElement(ElementType.Text);
        }
        if (this.activeShortcut.shortcut.desc === 'b' && this.popupSettings.active === false) {
          this.addNewElement(ElementType.Button);
        }
        if (this.activeShortcut.shortcut.desc === 'r' && this.popupSettings.active === false) {
          this.addNewElement(ElementType.Rectangle);
        }
        if (this.activeShortcut.shortcut.desc === 'o' && this.popupSettings.active === false) {
          this.addNewElement(ElementType.Circle);
        }
        if (this.activeShortcut.shortcut.desc === 'e' && this.popupSettings.active === false) {
          this.addNewElement(ElementType.Embed);
        }
        if (this.activeShortcut.shortcut.desc === 'f' && this.popupSettings.active === false) {
          this.addNewElement(ElementType.Form);
        }
        if (this.activeShortcut.shortcut.desc === 'v' && this.popupSettings.active === false) {
          this.addNewElement(ElementType.Video);
        }

        if (this.activeShortcut.shortcut.desc === 'p' && this.popupSettings.active === false) {
          const parentRoute = this.$route.name === 'preview' ? 'editor' : 'preview';
          if (!this.projectId && !this.pageId && !this.templateId) {
            redirectTo404();
            return;
          }

          const path = this.projectId
            ? `/${parentRoute}/projects/${this.projectId}/pages/${this.pageId}`
            : `/${parentRoute}/templates/${this.templateId}`;
          this.$router.push(path);
        }

        if (
          this.activeShortcut.shortcut.desc === 'up' ||
          this.activeShortcut.shortcut.desc === 'right' ||
          this.activeShortcut.shortcut.desc === 'down' ||
          this.activeShortcut.shortcut.desc === 'left' ||
          this.activeShortcut.shortcut.desc === 'shift+up' ||
          this.activeShortcut.shortcut.desc === 'shift+right' ||
          this.activeShortcut.shortcut.desc === 'shift+down' ||
          this.activeShortcut.shortcut.desc === 'shift+left' ||
          this.activeShortcut.shortcut.desc === 'alt+up' ||
          this.activeShortcut.shortcut.desc === 'alt+right' ||
          this.activeShortcut.shortcut.desc === 'alt+down' ||
          this.activeShortcut.shortcut.desc === 'alt+left' ||
          this.activeShortcut.shortcut.desc === 'alt+shift+up' ||
          this.activeShortcut.shortcut.desc === 'alt+shift+right' ||
          this.activeShortcut.shortcut.desc === 'alt+shift+down' ||
          this.activeShortcut.shortcut.desc === 'alt+shift+left'
        ) {
          this.throttledMoveElement({
            shortcut: this.activeShortcut.shortcut.desc,
            event: this.activeShortcut.shortcut.event
          });
        }
      }
    },
    //это жестко, нужно понять что тут происходит и переписать это
    $route(to, from) {
      const wrapper = document.querySelector('.template_wrapper');
      const { commit } = this.$store;
      if (to.name == 'preview' && wrapper) {
        commit('editor/changeOpenedSidebarItem', '');
        commit('editor/changeOpenedSidebarItemsChild', '');
        this.lastScrollPosition = wrapper.scrollTop;
        if (!to.hash) wrapper.scrollTop = 0;
      }

      if (to.name == from.name) {
        commit('editor/cleanEditorHistory');
        const { projectId, pageId } = this.$route.params;

        if (!projectId) {
          console.error('Cannot loading a project');
          return;
        }

        this.projectId = +projectId;
        this.pageId = !pageId ? this.projectPages[0].id : +pageId;

        commit('editor/changeCurrentId', this.projectId);
        commit('editor/changeCurrentPageId', this.pageId);

        apiClient.projectPages
          .projectPagesGetSettings(+this.projectId, +(this.pageId ?? 0))
          .then(({ data }) => {
            if (data.settings) {
              commit('editor/changeEditorParam', {
                path: 'displayConditions',
                value: {}
              });
              commit('editor/SET_USER_CONFIG_FROM_LOCAL', JSON.parse(data.settings));
              commit('editor/fillAllComponents');
              this.isLoading = false;
              this.isTemplateLoaded = true;
              commit('ui/changeEditorDataLoadingState', true);
            }
          })
          .catch(error => {
            redirectTo404();
          });
      } else {
        commit('ui/changeRouteName', this.$route.name);
      }

      if (to.name == 'editor' && wrapper) {
        this.$nextTick(() => {
          if (this.lastScrollPosition) {
            wrapper.scrollTop = this.lastScrollPosition;
          } else {
            const editor = document.querySelector('#editor');
            editor && editor.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'center' });
          }
        });
      }
    },
    isTemplateLoaded(to) {
      if (to && this.$route.name === 'preview' && this.$route.hash) {
        setTimeout(() => {
          const el = document.querySelector(this.$route.hash);
          el && el.scrollIntoView();
        });
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.windowResize);
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
    // document.removeEventListener('wheel', this.wheel, { passive: false });
    document.removeEventListener('wheel', this.wheel);

    this.$store.commit('editor/changeTempData', null);
    this.$store.commit('editor/SET_USER_CONFIG_FROM_LOCAL', null);
    this.$store.commit('editor/cleanEditorHistory');
  },
  async created() {
    if (window.innerWidth < 1200) window.location.href = `${getCabinetUrl()}/dashboard-mobile`;
    const { blockId, templateId, projectId, pageId } = this.$route.params;
    const { commit } = this.$store;

    //if user go to a project page
    if (projectId && pageId) {
      this.changeEditorParam({ path: 'templateId', value: null });
      this.changeEditorParam({ path: 'template', value: null });

      try {
        //strange case, because we have another request in src\components\Shared\Header\UsersSitesDropdown.vue, where we receive project pages
        //also, we always have page id here therefore I think it's ridiculous
        const { data: projectPages } = await apiClient.projectPages.projectPagesGet(+projectId);
        if (!projectPages || !projectPages.length) {
          return redirectTo404();
        }

        commit('project/changeProjectPages', projectPages);

        this.projectId = +projectId;
        this.pageId = !pageId ? projectPages[0].id : +pageId;

        //used for modals, @deprecated
        commit('editor/changeCurrentId', +projectId);
        commit('editor/changeCurrentPageId', +pageId);
        //maybe @deprecated
        commit('ui/changeRouteName', this.$route.name);

        const { data: pageSettings } = await apiClient.projectPages.projectPagesGetSettings(+projectId, +pageId);

        if (!pageSettings.settings) {
          return redirectTo404();
        }

        if (pageSettings.attachedTemplates && pageSettings.attachedTemplates.length > 0) {
          this.changeEditorParam({
            path: 'templateElement',
            value: pageSettings.attachedTemplates[0]
          });
        }

        const settings = JSON.parse(pageSettings.settings);
        this.proceedBgStyleConvert(settings);
        commit('editor/SET_USER_CONFIG_FROM_LOCAL', settings);

        commit('editor/fillAllComponents');
        this.isLoading = false;
        this.isTemplateLoaded = true;
        commit('ui/changeEditorDataLoadingState', true);
      } catch (error) {
        console.error("Can't get project pages or page", error);
        return redirectTo404();
      }

      return;
    }

    //if user go to a template page
    if (templateId) {
      this.changeEditorParam({
        path: 'templateId',
        value: templateId
      });

      const template = await apiClient.templates.templatesGetById(+templateId);
      this.changeEditorParam({ path: 'template', value: template });

      if (!this.template) {
        return redirectTo404();
      }

      function getTemplateElement(templateId: string) {
        try {
          return http.get('/api/interface/templates/filtered', {
            templateId: +templateId
          });
        } catch (error) {
          return { data: null };
        }
      }

      const { data: templateElement } = await getTemplateElement(this.templateId);

      if (!templateElement || !templateElement.config) {
        return redirectTo404();
      }

      this.changeEditorParam({
        path: 'templateElement',
        value: { templateId, interfaceElementId: templateElement.id }
      });
      const templateConfig = JSON.parse(templateElement.config);
      this.proceedBgStyleConvert(templateConfig.config);
      commit('editor/SET_USER_CONFIG_FROM_LOCAL', templateConfig.config);
      commit('editor/fillAllComponents');
      this.isLoading = false;
      this.isTemplateLoaded = true;
      commit('ui/changeEditorDataLoadingState', true);
      return;
    }

    //if user go to a block page
    //for tests: http://localhost:8080/editor/blocks/519
    if (blockId) {
      try {
        const { data } = await http.get(`/api/interface/block/${blockId}`);
        let blockConfig;
        if (data.config) {
          const config = typeof data.config == 'string' ? JSON.parse(data.config) : data.config;
          blockConfig = config.blockConfig;
        } else {
          blockConfig = this.createNewBlockConfig({
            insertAfter: 0,
            name: data.name,
            dbId: blockId
          });
        }

        commit('editor/SET_USER_CONFIG_FROM_LOCAL', { googleFonts: { fonts: [] }, components: [blockConfig] });
        commit('editor/fillAllComponents');
        commit('editor/actualiseFontList');
        this.isLoading = false;
        this.isTemplateLoaded = true;
        commit('ui/changeEditorDataLoadingState', true);
      } catch (error) {
        return redirectTo404();
      }

      return;
    }
    return redirectTo404();
  },
  mounted() {
    window.addEventListener('resize', this.windowResize);
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
    document.addEventListener('wheel', this.wheel, { passive: false });
    window.addEventListener('blur', () => this.resetShortcut());
    const editorShcts = this.registeredShortcuts.find((shct: any) => shct.page === 'editor');
    editorShcts.shortcuts.forEach((value: any) => {
      mousetrap.bind(
        value.desc,
        (e: any) => {
          const templ = { ...this.activeShortcutTemplate() };
          templ.page = 'editor';
          templ.shortcut = { desc: value.desc, event: value.event };
          this.setActiveShortcut(templ);
          return false;
        },
        value.event
      );
    });
    this.isHelperShown = cookies.getItem('isHelperShown');
    //
  },
  methods: {
    ...mapActions({
      savePageSettings: 'editor/savePageSettings',
      pasteImage: 'editor/pasteImage',
      pasteIcon: 'editor/pasteIcon',
      pasteUserConfig: 'editor/pasteUserConfig'
    }),
    ...mapMutations({
      changeInsertElementTo: 'editor/changeInsertElementTo',
      changeEditorParam: 'editor/changeEditorParam',
      setActiveShortcut: 'shortcut/setActiveShortcut',
      setMarkOnActiveShct: 'shortcut/setMarkOnActiveShct',
      duplicateElements: 'editor/duplicateElements',
      duplicateBlock: 'editor/duplicateBlock',
      removeBlockFromConfig: 'editor/removeBlock',
      removeBlocks: 'editor/removeBlocks',
      removeElement: 'editor/removeElement',
      removeElements: 'editor/removeElements',
      cleanSelectedBlocks: 'editor/cleanSelectedBlocks',
      cleanSelectedElements: 'editor/cleanSelectedElements',
      moveElementByZindex: 'editor/moveElementByZindex',
      changeConfigFromHistory: 'editor/changeConfigFromHistory',
      zoomTemplate: 'editor/zoomTemplate',
      moveElement: 'editor/moveElement',
      insertBlockToConfig: 'editor/insertBlockToConfig',
      changeBlockToViewId: 'editor/changeBlockToViewId',
      dropAllAPs: 'editor/dropAllAPs',
      resetShortcut: 'shortcut/resetShortcut',
      changeBlockInViewPortId: 'editor/changeBlockInViewPortId',
      changeHelperOpenType: 'ui/changeHelperOpenType'
    }),
    ...mapGetters({
      activeShortcutTemplate: 'shortcut/activeShortcutTemplate'
    }),
    loadCopiedElementsFonts(selectedElements: Array<any>) {
      return new Promise(resolve => {
        const allFonts: Array<string> = [];
        for (const item of selectedElements) {
          if (item.type === 'form') {
            for (const formElement of item.elements) {
              if (formElement.payload.font) {
                const fontFamilies = Object.values(<string>formElement.payload.font);
                allFonts.push(...fontFamilies);
              }
            }
          } else if (['text', 'button'].includes(item.type)) {
            const fontFamilies = Object.values(<string>item.payload.font);
            allFonts.push(...fontFamilies);
          }
        }

        if (allFonts.length) {
          WebFont.load({
            google: {
              families: [...new Set(allFonts)]
            },
            active: () => {
              resolve(true);
            }
          });
        } else {
          resolve(true);
        }
      });
    },
    throttledMoveElement(args: any) {
      _throttle(() => {
        this.moveElement(args);
      }, 100)();
    },
    async proceedCopyShortcut() {
      await navigator.clipboard.writeText(
        getSelectedComponentsForClipboard({
          selectedElements: this.selectedElements,
          selectedBlocks: this.selectedBlocks
        })
      );
    },
    showNotification(text: string, timeout: number) {
      this.popupText = text;
      this.showPopup = true;
      timeout && setTimeout(() => (this.showPopup = false), timeout);
    },
    proceedBgStyleConvert(config: any) {
      /**
       * Функция конвертирующая старый backgroundColor: 'rgba(255, 255, 255, 1)' в новый универсальный background
       * delete in future
       * */
      const convertBackgroundStyle = ({ block, viewport }: any) => {
        block.styles[viewport].background = block.styles[viewport].backgroundColor;
        delete block.styles[viewport].backgroundColor;
      };

      for (const block of config.components) {
        if (!block.payload) {
          block.payload = { src: '' };
        }
        Object.keys(block.styles).forEach(viewport => {
          if (block.styles[viewport].backgroundColor) {
            convertBackgroundStyle({ block: block, viewport });
          }
        });
      }
    },
    thisIsEditor() {
      return this.$route.name === 'editor' || this.$route.name === 'templateEditor';
    },
    templateWrapperClick(event: any) {
      if (event.target.classList.contains('editor-area-wrapper') && !this.isDragscroll) {
        this.cleanSelectedBlocks();
        if (!this.isTextEditing && !this.isSelecting) {
          this.cleanSelectedElements();
        }
      }
    },
    moveSelectedBlock(step: any) {
      if (this.selectedElements.length > 1) return;
      const selectedElement = this.selectedElements[0].element;
      const oldIndex = this.elementsSortedByZindex(this.userConfig.allComponents[selectedElement.parentId]).findIndex(
        (value: any) => value.id === selectedElement.id
      );
      this.moveElementByZindex({
        oldIndex: oldIndex,
        newIndex: oldIndex + step,
        element: selectedElement
      });
    },
    duplicateSelectedElements() {
      this.duplicateElements({
        type: 'duplicate',
        elements: this.selectedElements.map((element: any) => element.element)
      });
      this.setMarkOnActiveShct({ comp: 'EditorPage', status: 'done' });
    },
    duplicateSelectedBlocks() {
      this.selectedBlocks.forEach((blk: any) => this.duplicateBlock(blk));
      this.setMarkOnActiveShct({ comp: 'EditorPage', status: 'done' });
    },
    removeSelectedBlocksAndElements() {
      if (this.selectedBlocks.length >= this.userConfig.components.length) {
        this.selectedBlocks.forEach((value: any) => this.removeBlockFromConfig({ block: value }));
        this.cleanSelectedBlocks({});
        this.createEmptyBlock();
        return;
      }
      this.selectedBlocks.forEach((value: any) => this.removeBlockFromConfig({ block: value }));
      this.cleanSelectedBlocks();

      this.selectedElements.forEach((el: any) => this.removeElement(el.element));
      this.cleanSelectedElements();
    },
    createEmptyBlock() {
      const newBlockConfig = this.createNewBlockConfig({
        insertAfter: -1,
        name: 'Empty Block'
      });

      this.insertBlockToConfig({
        blockConfig: newBlockConfig
      });
      this.changeBlockToViewId(newBlockConfig.id);
    },
    clearSelection() {
      this.cleanSelectedBlocks();
      /**
       * переносится в vdr
       * т.к необходимо выходить из режима редактирования текста
       * по нажатию на escape
       */
      if (!this.$store.state.ui.isTextEditing) {
        this.$store.commit('editor/cleanSelectedElements');
      }
    },
    addNewElement(element: ElementType) {
      this.changeInsertElementTo({
        block: this.blocksSortedBySortId[0],
        element
      });
      this.changeEditorParam({
        path: 'isInserting',
        value: true
      });
      this.setMarkOnActiveShct({ comp: 'EditorPage', status: 'done' });
    },
    wheel(e: any) {
      if ((e.ctrlKey || e.metaKey) && this.isEditorMode) {
        e.preventDefault();
        const delta = e.deltaY || e.detail || e.wheelDelta;
        const editorAreaRect = (<any>this.$refs.editorArea)?.$el.getBoundingClientRect();

        // const mouseX = e.pageX.toFixed(2) + this.transformOrigin.lastX;
        // const mouseY = e.pageY.toFixed(2) + this.transformOrigin.lastY;
        // const rectX = editorAreaRect.x.toFixed(2);
        // const rectY = editorAreaRect.y.toFixed(2);
        // const rectW = editorAreaRect.width.toFixed(2);
        // const rectH = editorAreaRect.height.toFixed(2);
        //
        // this.transformOrigin.lastX = e.pageX;
        // this.transformOrigin.lastY = e.pageY;
        //
        // const scrollToMouseDebounce = debounce(() => {
        //   if (this.zoom <= 0.8) {
        //     this.transformOrigin.x = ((mouseX - rectX) / rectW) * 100;
        //     this.transformOrigin.y = ((mouseY - rectY) / rectH) * 100;
        //   } else {
        //     this.transformOrigin.x = ((mouseX - rectX) / rectW) * 100;
        //     this.transformOrigin.y = ((mouseY - rectY) / rectH) * 100;
        //   }
        // }, 0);
        //
        // scrollToMouseDebounce();

        this.$store.commit('editor/changeTemplateZoom', {
          delta,
          pointer: {
            x: e.pageX - editorAreaRect.x,
            y: e.pageY - editorAreaRect.y
          },
          editorAreaRect: editorAreaRect
        });
      }
    },
    keyup(e: any) {
      if (this.$route.name == 'editor') {
        if (e.keyCode == 32 && !this.isTextEditing && e.srcElement.nodeName !== 'INPUT') {
          e.preventDefault();
          this.isDragscroll = false;
        }
      }
    },
    keydown(e: any) {
      if (
        (e.code == 'NumpadSubtract' || e.ctrlKey == 181 || e.ctrlKey == 109 || e.ctrlKey == 189 || e.code == 'Minus') &&
        (e.ctrlKey || e.metaKey)
      ) {
        e.preventDefault();
        this.zoomTemplate(this.zoom * 0.9);
      }
      if ((e.code == 'NumpadAdd' || e.code == 187 || e.code == 107 || e.code == 'Equal') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.zoomTemplate(this.zoom * 1.1);
      }
      if ((e.code == 'Digit0' || e.code == 'Numpad0' || e.ctrlKey == 48) && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.zoomTemplate(1);
      }
      if ((e.code == 'Digit1' || e.ctrlKey == 41 || e.ctrlKey == 49) && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const editor = document.querySelector('#editor');
        const wrapper = document.querySelector('.template_wrapper');
        if (!editor || !wrapper) return;
        const realHeight = editor.getBoundingClientRect().height / this.zoom;
        const fitScaleHeight = wrapper.getBoundingClientRect().height / realHeight;
        const realWidtb = editor.getBoundingClientRect().width / this.zoom;
        const fitScaleWidth = wrapper.getBoundingClientRect().width / realWidtb;
        this.zoomTemplate(fitScaleHeight < fitScaleWidth ? fitScaleHeight : fitScaleWidth);
        this.$nextTick(() => {
          wrapper.scrollLeft = 0;
          editor.scrollIntoView({
            behavior: 'auto',
            block: 'start',
            inline: 'center'
          });
          const editorRect = editor.getBoundingClientRect();
          if (editorRect.x > 300) {
            wrapper.scrollLeft += (editorRect.x - 300) / 2;
          }
        });
      }
      if (this.$route.name == 'editor') {
        if (e.keyCode == 32 && !this.isTextEditing && !['INPUT', 'TEXTAREA'].includes(e.srcElement.nodeName)) {
          e.preventDefault();
          this.isDragscroll = true;
        }
      }
    },
    windowResize(e: any) {
      this.innerWidth = window.innerWidth;

      // let iframeWidth = document.getElementById("iframeReload").contentDocument.body.clientWidth;
      // let mode = '';

      // if(iframeWidth > 1280) mode = 'lg';
      // else if(iframeWidth <= 1280 && iframeWidth > 991) mode = 'laptop';
      // else if(iframeWidth <= 991 && iframeWidth > 768) mode = 'md';
      // else if(iframeWidth <= 768) mode = 'sm';
      // else { console.warn("editor page resize, breakpoints calc err") }

      // this.$store.commit('editor/SET_PREVIEW_MODE', mode);
    },
    async openBrandingSettings(event: any) {
      if (this.$route.name == 'editor') {
        if (event) event.preventDefault();

        const { projectId } = this.$route.params;
        const { dispatch } = this.$store;

        await dispatch('siteSettings/loadModalData', {
          projectId: this.projectPages[0].projectId,
          activeSectionNumber: 4 //<== SectionType.BRANDING
        });
        // this.$store.commit('project/changeOpenPageSettingsId', this.projectPages[0]);
        // this.$store.commit('ui/setSettingsPopupMode', 'site');
        // this.$store.dispatch('project/loadProjectPages', this.projectPages[0].projectId);
        // this.$store.commit('ui/changeSettingsPopupTab', 'branding');

        dispatch('ui/changeVisibleModalName', {
          newVisibleModalName: VisibleModalType.SiteSettings
        });
      }
    },
    addBlockInView: debounce((id, self) => {
      self.changeBlockInViewPortId(id);
    }, 10),
    onScrollTemplateWrapper() {
      const elements = Array.from(document.querySelectorAll('.templates-block-wrap'));
      elements.forEach(element => {
        const { top, bottom } = element.getBoundingClientRect();
        const elemBottom = window.innerHeight - bottom;
        const centerSum = top - elemBottom;
        if (this.elementInViewport(element) && centerSum <= window.innerHeight / 2) {
          this.addBlockInView(element.id, this);
        }
      });
    },
    elementInViewport(el: any) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      return rect.top <= windowHeight && rect.top + rect.height >= 0;
    }
  }
});
</script>

<style lang="scss" scoped>
// .fixed-dot {
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translateX(-50%) translateY(-50%);
//   width: 50px;
//   height: 50px;
//   background: red;
// }
// .iframe-temp {
//   max-height: 80vh;
// }

.preview_mod {
  .editor-area-wrapper {
    padding: 0 !important;
    overflow: hidden !important;
    width: 100%;
  }
  #editor {
    overflow: hidden !important;
  }
  .template_wrapper {
    overflow-x: hidden !important;
  }
}
.editor-area-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  padding: 1000px;

  &__breakpoint {
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    color: $gray600;
    transform: translate(0);
    align-self: flex-start;
    z-index: 20;
    margin: 0 0 8px;
    cursor: default;
  }
}
.editor-area {
  //don't change it - right editorFieldWidth depends on it
  margin: 0 auto;
  //don't change it
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;

  * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
  }

  box-sizing: content-box;
  &_lg {
    min-width: 2048px;
    width: 100%;
    max-width: 80%;
  }
  &_laptop {
    width: 1280px;
  }
  &_tablet {
    width: 768px;
  }
  &_mobile {
    width: 375px;
  }
  &_laptop.editor-area--preview {
    width: 100%;
  }
}
.editor-area--preview {
  padding: 0;
  box-sizing: content-box;
  user-select: initial;
  -webkit-user-select: initial;
  -moz-user-select: initial;

  * {
    user-select: initial;
    -webkit-user-select: initial;
    -moz-user-select: initial;
  }
}
.editor-page-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  align-items: center;

  &__message {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.template_area {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

// .template_nav {
//   width: 300px;
//   min-width: 300px;
//   position: relative;
//   z-index: 100;
//   padding-bottom: 30px;
//   overflow-y: auto;
//   overflow-x: hidden;

//   &__left {
//     float: left;
//     display: flex;
//   }

//   &__right {
//     float: right;
//     .nav_box {
//       position: relative;
//       background-color: #fff;
//       border-radius: 4px;
//       padding: 6px 19px;
//       display: flex;
//       align-items: center;
//       & > div {
//         position: relative;
//         padding: 3px;
//         margin-right: 9px;
//         cursor: pointer;
//         &:last-child {
//           margin-right: 0;
//         }
//         svg {
//           display: block;
//         }
//         &.nav_separating_line {
//           cursor: default;
//         }
//       }

//       .not_saved.nav_save:after {
//         content: '';
//         position: absolute;
//         right: 0;
//         top: 0;
//         border: 2px #fb1300 solid;
//         border-radius: 10px;
//       }
//     }
//   }
// }

.template_wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: sticky;
  height: 100%; //height: calc(100vh - 111px);
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 2px;
    height: 7px;
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
  &.dragscroll {
    cursor: grab;
    &.dragscrolling {
      cursor: none;
    }
  }
}

.editor_view {
  overflow-x: hidden;
  padding: 10px 0 0px;
  width: 100%;
}

.editor_view.preview_mod {
  padding: 0;
}

.preview_mod {
  .iframe-temp {
    transition: 0.5s ease-in-out;
    margin: 0 auto;
    &_lg {
      max-width: 100%;
    }
    &_md {
      max-width: 768px;
    }
    &_sm {
      max-width: 375px;
    }
  }
}

.editor_view.preview_mod .template_wrapper {
  height: calc(100vh - 72px) !important;
}

.template_box {
  // position: relative;
  // margin: 0 auto;

  box-shadow: 0 1.5em 3em rgba(0, 0, 0, 0.15);
  // border-radius: 12px;
  overflow: hidden;
}

.editor {
  position: relative;
  z-index: 1000;
  width: 360px;
  height: 100%;
  background-color: #fff;

  * {
    user-select: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.skeleton-enter-active,
.skeleton-leave-active {
  transition: all 0.5s ease;
}
.skeleton-enter,
.skeleton-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
.skeleton-left-enter-active,
.skeleton-left-leave-active {
  transition: all 0.5s ease;
}
.skeleton-left-enter,
.skeleton-left-leave-to {
  opacity: 0;
  transform: translateX(-50%);
}
</style>

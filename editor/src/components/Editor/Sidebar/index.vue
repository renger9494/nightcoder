<template>
  <aside class="editor-aside">
    <transition :css="false" @enter="enter" @leave="leave">
      <div v-show="showSidebar" :class="['template_nav', isSafari && 'null_scrollbar']" :some="isSafari">
<!--        <div class="sidebar-content-type">-->
<!--          <div-->
<!--            @click="sidebarType = 'design'"-->
<!--            :class="sidebarType === 'design' ? 'active' : ''"-->
<!--            class="sidebar-content-type__item"-->
<!--          >-->
<!--            Design-->
<!--          </div>-->
<!--          <div-->
<!--            @click="sidebarType = 'layers'"-->
<!--            :class="sidebarType === 'layers' ? 'active' : ''"-->
<!--            class="sidebar-content-type__item"-->
<!--          >-->
<!--            Layers-->
<!--          </div>-->

<!--          <button-->
<!--            ref="popupButton"-->
<!--            :class="{ active: isPopupOpen }"-->
<!--            @click="-->
<!--              openPopup($event, {-->
<!--                content: 'AddNewBlockOrElement',-->
<!--                location: popupButton.getBoundingClientRect(),-->
<!--                data: {-->
<!--                  isNextToSidebar: true-->
<!--                }-->
<!--              })-->
<!--            "-->
<!--            class="de-title__add"-->
<!--          >-->
<!--            <svg-icon name="plus-border" width="16" height="16" color="#000" />-->
<!--            Add-->
<!--          </button>-->
<!--        </div>-->

        <design-text-editor
          :elementIndex="openedSidebarItemsChild"
          :block="openedSidebarItem"
          :value="selectedElement"
          v-if="userConfig && sidebarType === 'design' && designEditorComponent === 'text'"
          :key="selectedElement.id"
        />
        <design-button-editor
          :elementIndex="openedSidebarItemsChild"
          :block="openedSidebarItem"
          :value="selectedElement"
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === 'button'"
          :key="selectedElement.id"
        />
        <design-block-editor
          :blockName="openedSidebarItem"
          :value="userConfig"
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === 'block'"
        />

        <design-image-editor
          :elementIndex="openedSidebarItemsChild"
          :block="openedSidebarItem"
          :value="selectedElement"
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === 'image'"
          :key="selectedElement.id"
        />

        <design-icon-editor
          :elementIndex="openedSidebarItemsChild"
          :block="openedSidebarItem"
          :value="selectedElement"
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === 'icon'"
          :key="selectedElement.id"
        />

        <design-rectangle-editor
          :elementIndex="openedSidebarItemsChild"
          :block="openedSidebarItem"
          :value="selectedElement"
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === 'rectangle'"
          :key="selectedElement.id"
        />

        <design-circle-editor
          :elementIndex="openedSidebarItemsChild"
          :block="openedSidebarItem"
          :value="selectedElement"
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === 'circle'"
        />

        <design-multiselection-editor
          :blockName="openedSidebarItem"
          :elementIndex="openedSidebarItemsChild"
          :block="openedSidebarItem"
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === 'multiselection'"
        />

        <design-global-editor
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === undefined"
          :value="userConfig"
        />

        <design-embed-editor
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === 'embed'"
          :block="openedSidebarItem"
          :value="selectedElement"
          :key="selectedElement.id"
        />

        <design-from-editor
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === 'form'"
          :block="openedSidebarItem"
          :value="selectedElement"
          :key="selectedElement.id"
        />

        <design-video-editor
          v-else-if="userConfig && sidebarType === 'design' && designEditorComponent === 'video'"
          :block="openedSidebarItem"
          :value="selectedElement"
          :key="selectedElement.id"
        />
      </div>
    </transition>
    <transition name="popup-layer" mode="out-in">
      <popup v-if="popupSettings.active" v-click-outside="closeModal" />
    </transition>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';

import DesignEmbedEditor from '@/components/Editor/Sidebar/DesignType/EmbedElement.vue';
import DesignVideoEditor from '@/components/Editor/Sidebar/DesignType/Video.vue';
import DesignFromEditor from '@/components/Editor/Sidebar/DesignType/Form.vue';
import DesignCircleEditor from '@/components/Editor/Sidebar/DesignType/Circle.vue';
import DesignTextEditor from '@/components/Editor/Sidebar/DesignType/Text.vue';
import DesignImageEditor from '@/components/Editor/Sidebar/DesignType/Image.vue';
import DesignIconEditor from '@/components/Editor/Sidebar/DesignType/Icon.vue';
import DesignRectangleEditor from '@/components/Editor/Sidebar/DesignType/Rectangle.vue';
import DesignButtonEditor from '@/components/Editor/Sidebar/DesignType/Button.vue';
import DesignBlockEditor from '@/components/Editor/Sidebar/DesignType/Block.vue';
import DesignMultiselectionEditor from '@/components/Editor/Sidebar/DesignType/Multiselection.vue';
import DesignGlobalEditor from '@/components/Editor/Sidebar/DesignType/Global.vue';
import Popup from './Modal/Popup.vue';

import templateData from '@/template-data';
import { isSafari } from '@/helpers/miscellaneous';
import { TweenMax, Expo } from 'gsap';

export default Vue.extend({
  name: 'Sidebar',
  components: {
    DesignTextEditor,
    DesignGlobalEditor,
    DesignBlockEditor,
    DesignButtonEditor,
    DesignMultiselectionEditor,
    DesignImageEditor,
    DesignIconEditor,
    DesignRectangleEditor,
    DesignCircleEditor,
    DesignEmbedEditor,
    DesignFromEditor,
    DesignVideoEditor,
    Popup
  },
  props: {
    userConfig: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      sidebarType: 'design',
      sidebarSectionType: ''
    };
  },
  computed: {
    ...mapGetters({
      createNewBlockConfig: 'editor/createNewBlockConfig'
    }),
    ...mapState({
      showSidebar: (state: any) => state.ui.showSidebar,
      projectPages: (state: any) => state.project.projectPages,
      templateToCreate: (state: any) => state.project.templateToCreate,
      editorTemplates: (state: any) => state.editor.templates,
      projects: (state: any) => state.project.projects,
      selectedElements: (state: any) => state.editor.selectedElements,
      selectedBlocks: (state: any) => state.editor.selectedBlocks,
      openedSidebarItem: (state: any) => state.editor.openedSidebarItem,
      openedSidebarItemsChild: (state: any) => state.editor.openedSidebarItemsChild,
      popupSettings: (state: any) => state.editor.popupSettings,
      availableElements: (state: any) => state.editor.availableElements,
      elementTypes: (state: any) => state.elementTypes
    }),
    isSafari(): boolean {
      return isSafari();
    },
    designEditorComponent(): string | undefined {
      if (this.selectedElements.length > 1) return 'multiselection';
      if (this.selectedElements.length === 1) return this.selectedElements[0].element.type;
      if (this.selectedElements.length === 0 && this.selectedBlocks.length > 0) return 'block';
      return undefined;
    },
    selectedElement(): any {
      if (this.selectedElements.length === 1) return this.userConfig.allComponents[this.selectedElements[0].element.id];
      return false;
    },
    projectId(): string {
      return this.$route.params.projectId;
    },
    pageId(): string {
      return this.$route.params.pageId;
    },
    templateToCreateName(): string {
      let pastCteatedProject = this.projects.find((project: any) => {
        return project.id === +this.projectId;
      });

      return this.editorTemplates
        .find((template: any) => {
          return template.id === pastCteatedProject.templateId;
        })
        .name.replace(/\s/g, '')
        .toLowerCase();
    },
    popupButton(): any {
      return this.$refs.popupButton;
    },
    isPopupOpen(): boolean {
      return this.popupSettings.active && this.popupSettings.content === 'AddNewBlockOrElement';
    }
  },
  watch: {
    userConfig: {
      deep: true,
      handler(newConfig, oldConfig) {
        console.log('sidebar save user config');
        if (newConfig !== oldConfig) {
          console.log('newConfig !== oldConfig save history');
          this.$store.commit('editor/changeEditorHistory', {
            oldConfig: oldConfig
          });
        }
      }
    }
  },
  methods: {
    openPopup(e: any, { ...popupConfig }: any) {
      this.$store.commit('editor/SET_POPUP_SETTINGS', {
        active: true,
        closeButton: false,
        ...popupConfig,
        position: {
          top: `${e.y}px`
        }
      });
    },
    leave(el: any, done: any) {
      TweenMax.to(el, 0.25, {
        x: '-100%',
        clearProps: 'all',
        ease: Expo.easeIn,
        onComplete: () => {
          done();
        }
      });
    },
    enter(el: any, done: any) {
      TweenMax.fromTo(
        el,
        0.5,
        {
          x: '-100%'
        },
        {
          x: '0%',
          clearProps: 'all',
          ease: Expo.easeOut,
          onComplete: () => {
            done();
          }
        }
      );
    },
    /**
     * now project page is created with template config on backend
     * I think we don't need to call this function anymore
     * @deprecated
     */
    createDefaultUserConfigFromPresets() {
      const templateName = this.templateToCreateName;

      const presetString = JSON.stringify((<any>templateData)[templateName]);
      const userConfig = JSON.parse(presetString);

      userConfig.projectId = this.projectId;
      const currentProject = this.projects.find((project: any) => {
        return project.id === +this.projectId;
      });

      userConfig.faviconImage = currentProject.settings.faviconImage;

      userConfig.settings = currentProject.settings;

      const defaultBlock = this.createNewBlockConfig({ insertAfter: 0, name: 'Custom Block' });
      userConfig.components.push(defaultBlock);
      userConfig.allComponents[defaultBlock.id] = defaultBlock;

      const state = {
        userConfig
      };

      return state.userConfig;
    },
    closeModal() {
      this.$store.commit('editor/SET_POPUP_SETTINGS', {
        active: false
      });
    }
  }
});
</script>

<style lang="scss">
.editor-aside {
  max-height: calc(100vh - 61px);
  height: 100%;
  position: relative;
  z-index: 100;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

.template_nav {
  height: 100%;
  width: 240px;
  min-width: 240px;
  position: relative;
  z-index: 100;
  padding-bottom: 30px;
  background-color: #ffffff;
  overflow-y: hidden;
  overflow-x: hidden;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.06);
}

.template_nav:hover {
  overflow-y: overlay;
}
.template_nav::-webkit-scrollbar {
  width: 5px;
  background: transparent;
}
.template_nav::-webkit-scrollbar-thumb {
  background: #bdc2c7;
  height: 30px;
  border-radius: 10px;
}
.template_nav::-webkit-scrollbar-track-piece {
  display: none;
}
.null_scrollbar {
  &::-webkit-scrollbar {
    width: 0;
  }
}

.sidebar-content-type {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #f3f3f3;
  padding: 16px 20px;
  position: sticky;
  top: 0;
  z-index: 999;
  .de-title__add {
    cursor: pointer;
    position: absolute;
    right: 20px;

    &.active {
      pointer-events: none;
    }

    ::v-deep svg {
      path {
        fill: #000;
      }
    }
  }
  &__item {
    cursor: pointer;

    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    color: #000000;
    opacity: 0.3;
    transition: opacity 0.2s ease;

    &:not(:first-of-type) {
      margin-left: 20px;
    }

    &.active {
      opacity: 1;
    }
  }
}

// new styles
.sidebar {
  &-block {
    outline: none;
    padding: $padding_l $padding_xl;
    border-bottom: 1px solid $gray100;

    &--merged {
      padding: $padding_l $padding_xl 0;
      border-bottom: none;
    }

    &__row {
      display: flex;
      &:not(:last-child) {
        margin: 0 0 $margin_s;
      }
      &--gutter-l {
        &:not(:last-child) {
          margin: 0 0 $margin_l;
        }
      }
      &--sb {
        justify-content: space-between;
      }
      &--sbc {
        align-items: center;
        justify-content: space-between;
      }
    }

    &__col {
      &--flex {
        display: flex;
      }
    }

    &__container {
      margin: 0 0 $margin_s;
    }

    &__item {
      &--s {
        margin: 0 $margin_s 0 0;
      }
      &--xs {
        margin: 0 $margin_xs 0 0;
      }
      &--center {
        align-self: center;
      }
    }

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &--interactive {
        cursor: pointer;
        &:hover {
          .sidebar-block__title {
            color: $black;
          }
          .square-icon-btn svg {
            color: $black !important;
          }
        }
      }
    }

    &__body {
      margin: $margin_l 0 0;
      transition: 0.3s;

      &--hidden {
        opacity: 0.4;
      }
    }

    &__title {
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      color: $black;
      margin: 0 0 $margin_l;
      transition: 0.3s;

      &--inactive {
        color: $gray400;
      }

      &--no-gutter {
        margin: 0;
      }
    }
  }
}
</style>

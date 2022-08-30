<template>
  <main id="editor" @click="onClick">
    <slot />
    <snap-to-block v-if="showSnapToBlock && !isDragging" :blockId="snapToBlock" :elementId="snapFromElement" />
    <snap-to-element
      v-if="showSnapToElement && !isDragging"
      :blockId="snapBlockId"
      :elementId="snapFromElement"
      :toElementId="snapToElement"
    />
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
import WebFont from 'webfontloader';
import Selection from '@/helpers/selection';
import SnapToBlock from './Elements/Snaps/SnapToBlock.vue';
import SnapToElement from './Elements/Snaps/SnapToElement.vue';
import { breakpointsWidths } from '@/constants/breakpoints';
import { ElementType } from '@/store/elements/create';

export default Vue.extend({
  components: {
    SnapToBlock,
    SnapToElement
  },
  props: {
    isEditorMode: {
      type: Boolean
    },
    isDragscroll: {
      type: Boolean
    }
  },
  data() {
    return {
      selection: null as any,
      transition: false,
      showSnapToBlock: false,
      showSnapToElement: false,
      snapFromElement: null as null | string,
      snapToElement: null as null | string,
      snapBlockId: null,
      snapToBlock: null,
      fontsIterationCount: 0
    };
  },
  computed: {
    ...mapState({
      userConfig: (state: any) => state.editor.userConfig,
      previewMode: (state: any) => state.editor.previewMode,
      selectedElements: (state: any) => state.editor.selectedElements,
      isInserting: (state: any) => state.editor.isInserting,
      insertElementTo: (state: any) => <{ block: any; element: ElementType }>state.editor.insertElementTo,
      hoveredElement: (state: any) => state.editor.hoveredElement,
      hoveredBlock: (state: any) => state.editor.hoveredBlock,
      uxCriticalData: (state: any) => state.editor.uxCriticalData,
      isDragging: (state: any) => state.ui.isDragging
    }),
    ...mapGetters({
      isGlobalSelection: 'editor/isGlobalSelection',
      activeShortcut: 'shortcut/activeShortcut'
    }),
    //TODO: fonts
    fontConfig(): null | string[] {
      if (!this.userConfig) return null;
      return this.userConfig.googleFonts.fonts;
    }
  },
  watch: {
    activeShortcut() {
      this.proceedSnaps();
    },
    hoveredElement() {
      this.proceedSnaps();
    },
    $route(n) {
      if (n.name === 'editor') {
        this.scrollEditorIntoView();
      }
    },
    isEditorMode(editorMode) {
      if (editorMode) this.selection?.enable();
      else this.selection?.disable();
    },
    previewMode() {
      this.scrollEditorIntoView();
      setTimeout(() => {
        this.changeEditorField();
      });
    }
  },
  async mounted() {
    //TODO: fonts
    this.loadFonts();

    //TODO: insertElementTo by click
    document.getElementById('editor')?.addEventListener('mousedown', this.handleClick);

    //TODO: selection
    this.initSelection();
    if (!this.isEditorMode) this.selection?.disable();

    const wrapper = this.$el.closest('.template_wrapper');

    const wrapperWidth = wrapper?.clientWidth ?? 0;
    const templateWidth = this.$el.getBoundingClientRect().width;
    const templateFullWidth = templateWidth + (templateWidth / 100) * 20;

    this.initZoom(wrapperWidth, templateFullWidth)
      .then(() => {
        this.scrollEditorIntoView();
      })
      .then(() => {
        this.transition = true;
      });

    this.changeEditorField();
  },
  beforeDestroy() {
    //TODO: insertElementTo by click
    document.getElementById('editor')?.removeEventListener('mousedown', this.handleClick);
  },
  methods: {
    ...mapActions({ proceedElementClick: 'editor/proceedElementClick' }),
    ...mapMutations({ setIsFontRendered: 'editor/setIsFontRendered' }),
    onClick() {
      if (document.activeElement && document.activeElement.closest('.template_nav'))
        (<any>document.activeElement).blur();
    },
    proceedSnaps() {
      if (this.activeShortcut) {
        this.showSnapToBlock = false;
        this.showSnapToElement = false;
        const shortcut = this.activeShortcut.shortcut;
        if (
          shortcut &&
          shortcut.event === 'keydown' &&
          (shortcut.desc === 'alt' ||
            shortcut.desc === 'alt+right' ||
            shortcut.desc === 'alt+left' ||
            shortcut.desc === 'alt+up' ||
            shortcut.desc === 'alt+down' ||
            shortcut.desc === 'alt+shift+right' ||
            shortcut.desc === 'alt+shift+left' ||
            shortcut.desc === 'alt+shift+up' ||
            shortcut.desc === 'alt+shift+down')
        ) {
          setTimeout(() => {
            const blockId = this.hoveredElement?.parentId || this.hoveredBlock?.id;
            if (!blockId) return;
            const msa = this.uxCriticalData.msaReg[blockId];

            const isHoveredElementSelected =
              this.hoveredElement?.type !== 'msa' &&
              this.selectedElements.length === 1 &&
              this.hoveredElement?.id === this.selectedElements[0].element.id;

            // Если есть msa
            if (msa) {
              // Если есть элемент над которым висит курсор рисуем снапы к нему
              if (this.hoveredElement) {
                if (msa.id === this.hoveredElement.id) return;

                this.showSnapToElement = true;
                this.snapFromElement = msa.id;
                this.snapBlockId = blockId;
                this.snapToElement = `vdr_${this.hoveredElement.id}`;
              } else {
                // рисуем снапы к блоку
                if (blockId !== this.hoveredBlock?.id) return;

                this.showSnapToBlock = true;
                this.snapFromElement = msa.id;
                this.snapToBlock = blockId;
              }
              return;
            }

            // MSA нет

            // Если элемент над которым висит курсор выбран рисуем снапы к блоку
            if (isHoveredElementSelected) {
              this.showSnapToBlock = true;
              this.snapFromElement = `vdr_${this.selectedElements[0].element.id}`;
              this.snapToBlock = blockId;
            } else if (this.hoveredElement) {
              // Если есть элемент с курсом над ним, но он не выбран нужно решить
              // рисовать снапы до выбранного элемента или до блока
              if (
                !this.selectedElements[0] ||
                this.hoveredElement.parentId !== this.selectedElements[0].element.parentId
              ) {
                this.showSnapToBlock = true;
                this.snapFromElement = `vdr_${this.hoveredElement.id}`;
                this.snapToBlock = blockId;
                return;
              }
              // Рисуем снапы до выбранного элемента
              this.showSnapToElement = true;
              this.snapFromElement = `vdr_${this.selectedElements[0].element.id}`;
              this.snapBlockId = blockId;
              this.snapToElement = `vdr_${this.hoveredElement.id}`;
            } else {
              if (this.selectedElements[0]?.element.parentId !== blockId) return;

              this.showSnapToBlock = true;
              this.snapFromElement = `vdr_${this.selectedElements[0].element.id}`;
              this.snapToBlock = blockId;
            }
          }, 1);
        }
        if (shortcut && shortcut.desc === 'alt' && shortcut.event === 'keyup') {
          this.showSnapToBlock = false;
          this.showSnapToElement = false;
          this.snapFromElement = null;
          this.snapToElement = null;
          this.snapToBlock = null;
          this.snapBlockId = null;
        }
      }
    },
    scrollEditorIntoView() {
      const templWrapper = document.querySelector('[class="template_wrapper"]');
      const editor = document.getElementById('editor');
      if (!templWrapper || !editor) return;
      templWrapper.scrollLeft = 0;

      editor.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'center'
      });
      const editorRect = editor.getBoundingClientRect();
      if (editorRect.x > 300) {
        templWrapper.scrollLeft += (editorRect.x - 300) / 2;
      }
    },
    //TODO: insertElementTo by click
    handleClick(event: any) {
      if (this.isInserting && this.insertElementTo.element) {
        this.$store.commit('editor/cleanSelectedElements');

        /**
         * we need universal method to search target element id
         */
        const getTargetId = function(event: any) {
          let targetId = event.target.id;
          let deepIndex = 3;
          let parentElement = event.target.parentElement;
          while (targetId == '' && deepIndex >= 0) {
            targetId = parentElement.id;
            if (targetId) break;

            parentElement = parentElement.parentElement;
            deepIndex--;
          }

          if (!targetId) console.warn(`targetId is empty for`, event.target);
          return targetId;
        };

        const targetId = getTargetId(event);
        const blockId = event.target.closest('.templates-block').dataset.id;
        const coords = { x: event.offsetX, y: event.offsetY };
        if (targetId != blockId && targetId != '') {
          const targetComponent = this.userConfig.allComponents[targetId];
          coords.x += targetComponent.location[this.previewMode].x;
          coords.y += targetComponent.location[this.previewMode].y;
        }
        // console.log('insertElementTo ≤coords', {
        //   coords,
        //   blockId,
        //   targetId
        // });

        this.$store
          .dispatch('editor/createElement', {
            element: this.insertElementTo.element,
            block: this.userConfig.allComponents[blockId],
            coords
          })
          .then(element => {
            this.proceedElementClick({ element });
          });
        this.$store.commit('editor/changeEditorParam', {
          path: 'isInserting',
          value: false
        });
      }
    },
    async initZoom(wrapperWidth: number, templateFullWidth: number) {
      this.$store.commit('editor/changeEditorParam', {
        path: 'zoom',
        value: +(wrapperWidth / templateFullWidth).toFixed(2)
      });
    },
    //TODO: selection
    initSelection() {
      this.selection = Selection.create({
        class: 'selection-area',
        selectables: ['.vdr'],
        boundaries: ['.editor-area-wrapper']
      })
        .on('start', ({ inst, selected, oe }: any) => {
          // Remove class if the user isn't pressing the control key or ⌘ key
          if (!oe.ctrlKey && !oe.metaKey) {
            // Unselect all elements
            for (const el of selected) {
              el.classList.remove('selected');
              el.classList.remove('active');
              this.$store.commit('editor/removeSelectedElements', {
                block: el.dataset.block,
                elementIndex: el.dataset.index,
                elementId: el.dataset.id
              });
              inst.removeFromSelection(el);
            }

            // Clear previous selection
            inst.clearSelection();
          }

          this.$store.commit('ui/changeSelectingState', true);
        })
        .on('beforestart', (oe: any) => {
          if (
            this.isDragscroll ||
            oe.oe.target.closest('.vdr') != null ||
            oe.oe.target.closest('.multiselection-drag-area') != null ||
            oe.oe.target.closest('.templates-block__handle') != null
          )
            return false;
        })
        .on('move', ({ changed: { removed, added } }: any) => {

          for (const el of added) {
            if (!el.classList.contains('locked')) {
              this.$store.commit('editor/addSelectedElements', {
                element: this.userConfig.allComponents[el.dataset.id],
                parentWidth: el.closest('.templates-block').clientWidth,
                parentHeight: el.closest('.templates-block').clientHeight
              });
              this.$store.commit('editor/cleanSelectedBlocks');
            }
          }

          for (const el of removed) {
            if (!el.classList.contains('locked')) {
              this.$store.commit('editor/removeSelectedElements', {
                block: el.dataset.block,
                elementIndex: el.dataset.index,
                elementId: el.dataset.id
              });
            }
          }
        })
        .on('stop', ({ inst }: any) => {
          //we need it to handle another events, for example prevent handle templateWrapperClick in EditorPage.vue
          setTimeout(() => {
            this.$store.commit('ui/changeSelectingState', false);
          }, 300);

          if (!this.selectedElements.length) {
            this.$store.commit('editor/changeOpenedSidebarItem', '');
            this.$store.commit('editor/changeOpenedSidebarItemsChild', '');
          }

          // Remember selection in case the user wants to add smth in the next one
          inst.keepSelection();
        });
    },
    changeEditorField() {
      this.$store.commit('editor/changeEditorParam', {
        path: 'editorFieldWidth',
        value: breakpointsWidths[this.previewMode]
      });
    },
    loadFonts() {
      if (!this.fontConfig?.length) return;
      WebFont.load({
        google: {
          families: this.fontConfig
        }
      });
    }
  }
});
</script>

<style scoped>
.iframe-temp {
  border: none;
  width: 100%;
}

.editor-transition {
  transition: transform 0.3s ease;
}
</style>

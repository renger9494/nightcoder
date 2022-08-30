<template>
  <div class="new-item-popup">
    <div class="new-item-popup__head">
      <button class="new-item-popup__search-btn">
        <svg-icon name="search-icon" width="14" height="14" color="#828282" />
      </button>
      <input
        class="new-item-popup__search"
        v-model="searchBlockByTitleAndId"
        type="text"
        placeholder="Find your awesome block by title or ID"
      />
    </div>
    <div class="new-item-popup__body items-container">
      <div class="items-container__aside aside-section">
        <switcher :switcher-items="switcherItems" @filterName="setActiveTab" />

        <div v-if="activeTab === popupTab.BLOCKS" class="aside-section__wrapper">
          <div class="aside-section__head-item" @click="addBlock()">
            <p>Empty</p>
            <div class="aside-section__shortcut">
              <svg-icon name="command-icon" width="10" height="10" color="#949CAD" />
              <span>Shift B</span>
            </div>
          </div>
          <div class="aside-section__list-container">
            <p class="aside-section__list-title">Category</p>
            <ul v-if="filteredBlockCategories.length" class="aside-section__list">
              <li
                v-for="(item, index) in filteredBlockCategories"
                :key="index"
                class="aside-section__list-item"
                @click="onCategoryClick(item)"
              >
                <p>{{ item.title }}</p>
              </li>
            </ul>
            <ul v-if="!blockCategories.length" class="aside-section__list">
              <li v-for="index in 12" :key="index" class="aside-section__list-item">
                <skeleton max-width="100%" height="20" width="220" radius="4" />
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="aside-section__wrapper aside-section__wrapper--elem">
          <div v-for="(category, index) in elementCategories" :key="index" class="aside-section__category">
            <div class="aside-section__list-container">
              <p class="aside-section__list-title">
                {{ category.title }}
              </p>
              <ul class="aside-section__list">
                <li
                  v-for="(element, elementIndex) in category.blocks"
                  :key="elementIndex"
                  class="aside-section__list-item"
                  @click="addElementToConfig(element)"
                >
                  <svg-icon
                    :name="element.name.toLowerCase()"
                    :width="dynamicIconSizes[element.name.toLowerCase()].width"
                    :height="dynamicIconSizes[element.name.toLowerCase()].height"
                    color="#000"
                  />
                  <p>{{ element.name }}</p>
                  <p class="aside-section__shortcut">
                    {{ element.title }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredBlockCategories.length" ref="preview" class="items-container__main">
        <div
          v-for="(category, index) in activePreviewData"
          :id="category.id"
          :key="`${index}_${category.title}`"
          class="items-container__category"
        >
          <h2 class="items-container__category-title">{{ category.title }}</h2>
          <preview-item
            v-for="block in category.blocks"
            :key="block.id"
            :interface-element="block"
            @blockSelection="addElementToConfig"
          />
        </div>
      </div>
      <div v-if="!blockCategories.length" ref="preview" class="items-container__main">
        <div v-for="index in 3" :index="index" class="items-container__category" :key="`${index}-category`">
          <skeleton class="items-container__skeleton-title" max-width="100%" height="21" width="77" radius="4" />
          <div v-for="index in 3" :index="index" class="items-container__skeleton-container" :key="`${index}-skeleton`">
            <div class="items-container__skeleton-top">
              <skeleton max-width="100%" height="13" width="76" radius="4" />
              <skeleton max-width="100%" height="13" width="20" radius="4" />
            </div>
            <skeleton max-width="100%" height="148" width="400" radius="4" />
          </div>
        </div>
      </div>
      <div v-if="!filteredBlockCategories.length && blockCategories.length" class="items-container__main-empty">
        <svg-icon name="not-published-icon" width="110" height="187" />
        <p class="items-container__main-text">Nothing has been found</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import http from '@/utils/http';

import Switcher from '@/components/Editor/Sidebar/Switcher.vue';
import { IBlocksData, IBlock } from './types';
import { BlockConfigDto } from '@/utils/types/api/GetBlocksByCategories';
import PreviewItem from './PreviewItem.vue';

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { AxiosResponse } from 'axios';
import Skeleton from '@/components/Shared/ui/skeleton.vue';
import { cloneDeep as _cloneDeep } from 'lodash';
import apiClient from '@/utils/apiClient';
import { dynamicIconSizes } from '@/constants/dynamicIconSizes';

const PopupTab = {
  ELEMENTS: 'Element',
  BLOCKS: 'Block'
};

export default Vue.extend({
  components: {
    Skeleton,
    Switcher,
    PreviewItem
  },
  data() {
    return {
      blockCategories: [] as Array<IBlocksData>,
      searchBlockByTitleAndId: null as string | number | null,

      popupTab: PopupTab,
      activeTab: PopupTab.ELEMENTS,
      switcherItems: [
        {
          name: PopupTab.ELEMENTS,
          icon: 'elements-icon',
          iconWidth: 13,
          iconHeight: 14,
          iconColor: '#000'
        },
        {
          name: PopupTab.BLOCKS,
          icon: 'switch-block-icon',
          iconWidth: 20,
          iconHeight: 20,
          iconColor: '#000'
        }
      ],
      selectedCategory: null,
      dynamicIconSizes
    };
  },
  mounted() {
    this.getBlocksByCategories();
  },
  computed: {
    ...mapState({
      //TODO: add popupSettings here
      selectedBlocks: (state: any) => state.editor.selectedBlocks,
      userConfig: (state: any) => state.editor.userConfig,
      elementTypes: (state: any) => state.elementTypes.types,
      availableElements: (state: any) => state.editor.availableElements
    }),
    ...mapGetters({
      createNewBlockConfig: 'editor/createNewBlockConfig',
      activeShortcut: 'shortcut/activeShortcut',
      blockSelected: 'editor/blockSelected',
      blockInViewPortId: 'editor/blockInViewPortId',
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    }),
    activePreviewData(): Array<IBlocksData> {
      return this.activeTab === PopupTab.BLOCKS ? this.filteredBlockCategories : this.elementCategories;
    },
    filteredBlockCategories(): Array<IBlocksData> {
      if (!this.searchBlockByTitleAndId) return this.blockCategories;

      const filterByTitleAndId = (b: IBlock) => {
        return (
          b.id?.toString().includes(this.searchBlockByTitleAndId?.toString() ?? '') ||
          b.name.toLowerCase().includes(this.searchBlockByTitleAndId?.toString().toLowerCase() ?? '')
        );
      };

      return _cloneDeep(this.blockCategories)
        .filter(c => c.blocks.some(filterByTitleAndId))
        .map(c => {
          c.blocks = c.blocks.filter(filterByTitleAndId);
          return c;
        });
    },
    defaultBlock(): any {
      return this.userConfig.components[0];
    },
    elementCategories(): Array<IBlocksData> {
      return this.availableElements.reduce((elementTypes: Array<IBlocksData>, item: any) => {
        let elementType = elementTypes.find((type: IBlocksData) => type.title == item.type);
        const { name, shortcut, image } = item;
        const element = { name, title: shortcut, files: [] as any[] };

        if (Array.isArray(image) && image.length != 0) {
          element.files.push({
            fullPath: image[0],
            isElement: true,
            retinaPath: `${image[0]}, ${image[1]} 2x`
          });
        }
        if (elementType) {
          elementType.blocks.push(element);
          return elementTypes;
        }

        elementTypes.push({
          title: item.type,
          blocks: [element]
        });

        return elementTypes;
      }, []);
    }
  },
  methods: {
    ...mapActions({
      proceedElementClick: 'editor/proceedElementClick',
      createElement: 'editor/createElement'
    }),
    getBlocksByCategories() {
      apiClient.interfaceElements.interfaceElementsGetBlocksByCategories().then(({ data }) => {
        this.blockCategories = data
          .filter(x => x.items)
          .map(
            x =>
              ({
                id: x.id,
                title: x.name,
                blocks: x.items?.map(i => ({ id: i.id, title: `${i.id}`, name: i.name, files: i.files }))
              } as IBlocksData)
          );
      });
    },
    ...mapMutations({
      insertBlockToConfig: 'editor/insertBlockToConfig',
      changeBlockToViewId: 'editor/changeBlockToViewId',
      addCollectionBlock: 'editor/addCollectionBlock'
    }),
    onCategoryClick(category: any) {
      this.selectedCategory = category;
      const categoryTitleElement = (<HTMLDivElement>this.$refs.preview).querySelector(`[id="${category.id}"]`);
      if (!categoryTitleElement) return;
      categoryTitleElement.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'center'
      });
    },
    setActiveTab(tab: string) {
      this.activeTab = tab;
      (<HTMLDivElement>this.$refs.preview).scrollTo(0, 0);
    },
    addElementToConfig(block: IBlock) {
      switch (this.activeTab) {
        case PopupTab.BLOCKS: {
          http
            .get(`/api/interface/block/${block.id}/config`)
            .then(({ data: rawConfig }: AxiosResponse<BlockConfigDto>) => {
              if (!rawConfig) {
                console.warn(`[AddNewBlockOrElementPopup]: Block config is empty for ${block.id}`);
                return;
              }
              const config = typeof rawConfig == 'string' ? JSON.parse(rawConfig) : rawConfig;

              if (!config || !config.blockConfig) {
                console.warn(`[AddNewBlockOrElementPopup]: Block config is empty for ${block.id}`);
                return;
              }

              //remove a tie from block of library
              config.blockConfig.dbId = -1;

              this.addCollectionBlock({
                ...config.blockConfig,
                sortId: this.blocksSortedBySortId[this.blocksSortedBySortId.length - 1]?.sortId ?? 0
              });
            });

          break;
        }
        case PopupTab.ELEMENTS: {
          const blockInViewPort = document.querySelector(`#${this.blockInViewPortId}`);
          const coords = {
            x: !!blockInViewPort ? (blockInViewPort as HTMLElement).offsetWidth / 2 : 0,
            y: !!blockInViewPort ? (blockInViewPort as HTMLElement).offsetHeight / 2 : 0
          };
          this.createElement({
            element: block.name.toLowerCase(),
            block: this.userConfig.allComponents[this.blockInViewPortId],
            coords
          }).then(element => {
            this.proceedElementClick({ element });
          });

          // this.$store.commit('editor/changeInsertElementTo', {
          //   ...(this.selectedBlocks.length === 0 ? { block: this.defaultBlock } : { block: this.selectedBlocks[0] }),
          //   element: block.name.toLowerCase()
          // });
          // this.$store.commit('editor/changeEditorParam', {
          //   path: 'isInserting',
          //   value: true
          // });
          break;
        }
        default:
          throw new Error('[AddNewBlockOrElementPopup]: Unknown active tab');
      }

      this.closePopup();
    },
    addBlock() {
      const newBlockConfig = this.createNewBlockConfig({
        insertAfter: this.blocksSortedBySortId[this.blocksSortedBySortId.length - 1]?.sortId ?? 0,
        name: 'Empty Block'
      });

      this.insertBlockToConfig({
        blockConfig: newBlockConfig
      });
      this.changeBlockToViewId(newBlockConfig.id);
      this.closePopup();
    },
    closePopup() {
      this.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
    }
  }
});
</script>

<style lang="scss">
.new-item-popup {
  max-width: 619px;
  width: 100%;
  height: 100%;
  max-height: 590px;
  display: flex;
  flex-direction: column;
  &__head {
    padding: 12px 60px 12px 16px;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;
  }

  &__search {
    margin: 0 0 0 16px;
    font-size: 13px;
    line-height: 15px;
    width: 100%;

    &::placeholder {
      color: rgba(0, 0, 0, 0.4);
    }

    &-btn {
      display: flex;
      cursor: pointer;
      color: #949cad;
      transition: 0.3s ease-in-out;

      &:hover {
        color: #000;
      }
    }
  }

  &__body {
    width: 100%;
  }
}
.items-container {
  width: 100%;
  height: calc(100% - 41px);
  display: flex;

  &__aside {
    flex: 0 0 238px;
    padding: 16px;
    border-right: 1px solid #ebebeb;
  }

  &__main {
    padding: 30px;
    overflow-y: auto;
    width: 100%;
    height: 100%;
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
    &-item {
      height: 200%;
    }
    &-empty {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      svg {
        width: 55px;
        height: auto;
        margin: 0 0 20px;
      }
    }
    &-text {
      color: $black;
      font-weight: 500;
      font-size: 24px;
      line-height: 25px;
    }
  }

  &__category {
    &:not(:last-child) {
      margin: 0 0 30px;
    }

    &-title {
      font-size: 18px;
      line-height: 21px;
      margin: 0 0 20px;
    }
  }

  &__skeleton {
    &-container {
      margin: 0 0 20px;
    }
    &-title {
      margin: 0 0 21px;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      margin: 0 0 8px;
    }
  }
}
.aside-section {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
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

  .switcher {
    height: 34px;
  }

  &__wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100% - 40px);

    &--elem {
      padding: 20px 0 0;

      .aside-section__shortcut {
        direction: rtl;
      }
    }
  }

  &__head-item {
    margin: 10px -6px 20px -10px;
  }

  &__head-item,
  &__list-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 34px;
    padding: 0 20px;
    border-radius: 4px;
    transition: 0.3s ease-in-out;

    &:hover {
      background: #f3f3f3;
    }

    &:active {
      background: #318bf5;
      color: #fff;
      .aside-section__shortcut {
        color: #fff;

        svg path {
          fill: #fff;
        }
      }

      svg {
        path {
          fill: #fff;
        }
        rect,
        circle {
          stroke: #fff;
        }
      }
    }

    svg {
      margin: 0 13px 0 0;
      path,
      rect,
      circle {
        transition: 0.3s ease-in-out;
      }
    }

    p {
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      letter-spacing: 0.05em;

      &:not(:last-child) {
        margin: 0 auto 0 0;
      }

      &:nth-child(2),
      &:nth-child(3) {
        width: 7px;
        text-align: center;
      }
    }
  }

  &__shortcut {
    font-size: 13px;
    line-height: 15px;
    color: #949cad;
    transition: 0.3s ease-in-out;

    svg {
      margin: 0 4px 0 0;
    }
  }

  &__list {
    &-container {
      margin: 0 -16px;
      padding: 0 6px;
      overflow-y: scroll;
      flex: 1;
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
    }
    &-title {
      padding: 0 20px 10px;
      font-size: 11px;
      line-height: 13px;
      letter-spacing: 0.05em;
      color: #949cad;
    }
  }

  &__category {
    &:not(:last-child) {
      margin: 0 0 20px;
    }
  }
}
</style>

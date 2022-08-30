<template>
  <div class="block-popup">
    <div class="block-popup__search" :class="{ 'block-popup__search_active': inputSearchFocus }">
      <button>
        <svg-icon name="search-icon" width="14" height="14" color="#828282" />
      </button>
      <input
        ref="search"
        @focus="inputSearchFocus = true"
        @blur="inputSearchFocus = false"
        v-model="filterQuery"
        type="text"
        placeholder="Find block by title, tag or category"
      />
    </div>
    <switcher class="block-popup__switcher" :switcher-items="filterItems" @filterName="getFilter" />
    <template v-if="activeTab === 'Category'">
      <div v-if="filteredBlockCategories.length" class="block-popup__filter">
        <block-filter
          :filter-list="filteredBlockCategories"
          :active-category-id="activeCategoryId"
          @change="categoryChange"
        />
      </div>
      <div class="block-popup__line" v-if="filteredBlockCategories.length" />
      <div
        v-show="!activeCategoryId && !activeCategory && filteredBlockCategories.length"
        class="block-popup__slide-wrap"
      >
        <blocks-slide
          v-for="(category, index) in filteredBlockCategories"
          :key="`${category.id}-${index}`"
          :data="category"
          class="block-popup__slide"
          @change="categoryChange"
          :add-block="addBlock"
        />
      </div>
      <div v-if="activeCategoryId && !!activeCategory" class="block-popup__slide-wrap">
        <p class="block-popup__back-btn" @click="activeCategoryId = 0">Back to categories</p>
        <block-category-inner
          v-if="activeCategoryId && !!activeCategory"
          :data="activeCategory"
          :add-or-delete-favorite="addOrDeleteFavorite"
          :is-block-favorite="isBlockFavorite"
          :add-block="addBlock"
          :drag-star="dragStart"
          :drag-end="dragEnd"
        />
      </div>
      <block-collection-empty
        v-if="!filteredBlockCategories.length"
        :is-fav="false"
        @change="getFilter('Category')"
        class="block-popup__empty"
      />
      <add-block-btn class="block-popup__add-btn" @click="addEmptyBlock" />
    </template>
    <template v-else>
      <div v-if="filteredFavouriteBlocks.length" class="block-popup__line block-popup__line--fav" />
      <block-collection-empty
        v-if="!filteredFavouriteBlocks.length && filterQuery.length"
        :is-fav="false"
        @change="getFilter('Category')"
        class="block-popup__empty"
      />
      <block-collection-empty
        v-else-if="!allFavouriteBlocks.length"
        :is-fav="true"
        @change="getFilter('Category')"
        class="block-popup__empty"
      />
      <div class="block-popup__slide-wrap" v-else>
        <block-card
          class="block-popup__fav-block"
          v-for="block in filteredFavouriteBlocks"
          :key="block.id"
          :block="block"
          :add-or-delete-favorite="addOrDeleteFavorite"
          :is-block-favorite="isBlockFavorite"
          :add-block="addBlock"
          :drag-star="dragStart"
          :drag-end="dragEnd"
        />
      </div>
      <add-block-btn class="block-popup__add-btn" @click="addEmptyBlock" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { BlockPopupData } from '@/components/Editor/Sidebar/Modal/types';
import { IBlock, IBlocksData } from '@/components/Editor/Sidebar/Modal/components/AddNewBlockOrElementPopup/types';
import { BlockFavorite, IBlockFavoriteData, UserFavoriteStub } from '@/utils/favorites';
import { cloneDeep as _cloneDeep } from 'lodash';
import { mapGetters, mapMutations, mapState } from 'vuex';
import Switcher from '@/components/Editor/Sidebar/Switcher.vue';
import BlockFilter from './BlockFilter.vue';
import BlocksSlide from './BlocksSlide.vue';
import BlockCategoryInner from './BlockCategoryInner.vue';
import AddBlockBtn from './AddBlockBtn.vue';
import BlockCollectionEmpty from './BlockCollectionEmpty.vue';
import BlockCard from '@/components/Editor/Sidebar/Modal/components/BlockCollection/BlockCard.vue';
import http from '@/utils/http';
import { AxiosResponse } from 'axios';
import { BlockConfigDto } from '@/utils/types/api/GetBlocksByCategories';

export default Vue.extend({
  name: 'BlockCollectionPopup',
  components: {
    BlockCard,
    BlockCollectionEmpty,
    AddBlockBtn,
    BlockCategoryInner,
    BlocksSlide,
    BlockFilter,
    Switcher
  },
  data() {
    return {
      filterQuery: '',
      categoryFilterList: [
        {
          title: 'Hero'
        }
      ],
      activeCategoryId: 0,
      inputSearchFocus: false,
      favourites: [],
      activeTab: 'Category',
      userFavorites: new UserFavoriteStub<IBlockFavoriteData>(new BlockFavorite())
    };
  },
  mounted() {
    this.userFavorites.init();
  },
  beforeDestroy() {
    if (this.newBlockSortId) this.changeNewBlockSortId(null);
  },
  computed: {
    ...mapState({
      popupData: (state: any) => state.editor.popupSettings.data as BlockPopupData,
      newBlockSortId: (state: any) => state.ui.newBlockSortId as number | null
    }),
    ...mapGetters({
      createNewBlockConfig: 'editor/createNewBlockConfig',
      blocksSortedBySortId: 'editor/blocksSortedBySortId',
      selectedBlock: 'editor/selectedBlock'
    }),
    filterItems(): Array<any> {
      return [
        {
          name: 'Category',
          icon: 'settings-icon',
          iconWidth: 12,
          iconHeight: 12,
          iconColor: '#000',
          isActive: this.activeTab === 'Category'
        },
        {
          name: 'Favorite',
          icon: 'favorite-icon',
          iconWidth: 12,
          iconHeight: 12,
          iconColor: '#000',
          isActive: this.activeTab === 'Favorite'
        }
      ];
    },
    blockCategories(): Array<IBlocksData> {
      return this.popupData.blockCategories;
    },
    filteredBlockCategories(): Array<IBlocksData> {
      const filterByTitleAndId = (b: IBlock) => {
        return (
          b.id?.toString().includes(this.filterQuery?.toString() ?? '') ||
          b.name.toLowerCase().includes(this.filterQuery?.toString().toLowerCase() ?? '')
        );
      };

      return _cloneDeep(this.blockCategories)
        .filter(c => c.blocks.some(filterByTitleAndId))
        .map(c => {
          c.blocks = c.blocks.filter(filterByTitleAndId);
          return c;
        });
    },
    activeCategory(): IBlocksData | undefined {
      return this.filteredBlockCategories.find((item: IBlocksData) => item.id === this.activeCategoryId);
    },
    filteredFavouriteBlocks(): Array<IBlock> {
      const allBlock: Array<IBlock> = this.filteredBlockCategories
        .map((category: IBlocksData) => category.blocks)
        .flat();
      return allBlock.filter((block: IBlock) => this.userFavorites.has({ block }));
    },
    allFavouriteBlocks(): Array<IBlock> {
      const allBlock: Array<IBlock> = this.blockCategories.map((category: IBlocksData) => category.blocks).flat();
      return allBlock.filter((block: IBlock) => this.userFavorites.has({ block }));
    }
  },
  methods: {
    ...mapMutations({
      addCollectionBlock: 'editor/addCollectionBlock',
      insertBlockToConfig: 'editor/insertBlockToConfig',
      changeBlockToViewId: 'editor/changeBlockToViewId',
      cleanSelectedBlocks: 'editor/cleanSelectedBlocks',
      changeBlockDraggingType: 'ui/changeBlockDraggingType',
      changeNewBlockSortId: 'ui/changeNewBlockSortId'
    }),
    getFilter(item: string) {
      this.activeTab = item;
      this.filterQuery = '';
    },
    categoryChange(category: number) {
      this.activeCategoryId = category;
      const parent: HTMLDivElement | null = document.querySelector('.sidebar-popup');
      if (parent) parent.scrollTop = 0;
    },
    async addOrDeleteFavorite(block: IBlock) {
      await this.userFavorites.addOrDelete({ block });
    },
    isBlockFavorite(block: IBlock) {
      return this.userFavorites.has({ block });
    },
    addBlock(id: number, sortId?: number | null) {
      if (!sortId && this.newBlockSortId !== null) sortId = this.newBlockSortId;
      console.log(sortId);
      http.get(`/api/interface/block/${id}/config`).then(({ data: rawConfig }: AxiosResponse<BlockConfigDto>) => {
        if (!rawConfig) {
          console.warn(`[AddNewBlockOrElementPopup]: Block config is empty for ${id}`);
          return;
        }
        const config = typeof rawConfig == 'string' ? JSON.parse(rawConfig) : rawConfig;

        if (!config || !config.blockConfig) {
          console.warn(`[AddNewBlockOrElementPopup]: Block config is empty for ${id}`);
          return;
        }
        debugger
        //remove a tie from block of library
        config.blockConfig.dbId = -1;
        const lastBlockSortId = this.blocksSortedBySortId[this.blocksSortedBySortId.length - 1]?.sortId ?? 0;
        const newSortId = sortId !== null ? sortId : lastBlockSortId;
        this.addCollectionBlock({
          ...config.blockConfig,
          sortId: newSortId
        });
        if (sortId !== null) this.changeNewBlockSortId(null);
        this.closePopup();
      });
    },
    addEmptyBlock() {
      const insertAfter: number =
        this.newBlockSortId !== null
          ? this.newBlockSortId
          : this.blocksSortedBySortId[this.blocksSortedBySortId.length - 1]?.sortId;

      const newBlockConfig = this.createNewBlockConfig({
        insertAfter,
        name: 'Empty Block'
      });

      this.insertBlockToConfig({
        blockConfig: newBlockConfig
      });
      this.changeBlockToViewId(newBlockConfig.id);
      this.changeNewBlockSortId(null);
      this.closePopup();
    },
    closePopup() {
      this.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
    },
    dragStart() {
      if (this.selectedBlock) this.cleanSelectedBlocks();
      this.changeBlockDraggingType(true);
    },
    dragEnd(id: number) {
      this.changeBlockDraggingType(false);
      if (this.newBlockSortId !== null) {
        this.addBlock(id, this.newBlockSortId);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.block-popup {
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  position: relative;
  -webkit-tap-highlight-color: transparent;

  &__search {
    margin: $margin_l 0 $margin_s;
    position: relative;
    overflow: hidden;

    button {
      width: 12px;
      height: 12px;
      border: none;
      padding: 0;
      background-color: transparent;
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      transition: transform 0.2s ease, opacity 0.2s ease;

      svg {
        width: 12px;
        height: 12px;
      }
    }

    input {
      width: 100%;
      background: $white;
      border: 1px solid $color_input_overlay_border;
      box-sizing: border-box;
      border-radius: $shape_border_radius;
      font-size: 12px;
      line-height: 32px;
      padding: 0 15px 0 30px;
      transition: border-color 0.2s ease, padding-left 0.2s ease;
      will-change: padding-left;

      &:hover {
        border-color: $color_input_overlay_border_hover;
      }

      &:focus {
        border-color: $color_input_overlay_border_focus;
      }
    }

    &_active {
      input {
        padding-left: 6px;
      }

      button {
        opacity: 0;
        transform: translateY(-50%) translateX(-24px);
      }
    }
  }

  &__switcher {
    margin: 0 0 $margin_s;
  }

  &__filter {
    margin: 0 0 $margin_l;
  }

  &__line {
    border-bottom: 1px solid $gray100;
    margin: 0 0 $margin_l;

    &--fav {
      margin: $margin_l 0;
    }
  }

  &__slide-wrap {
    flex: 1 0 0;
  }

  &__slide {
    &:not(:last-child) {
      margin: 0 0 $margin_l;
    }
  }

  &__back-btn {
    color: $blue200;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    margin: 0 0 $margin_l;
    cursor: pointer;
    transition: 0.3s;
    display: table;

    &:hover {
      color: $blue100;
    }
  }

  &__add-btn {
    position: sticky;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 20px;
    width: 100%;
    max-width: 150px;
    margin: auto;
  }

  &__fav {
    //&-wrap {
    //  padding: 0 0 $padding_l;
    //}
    &-block {
      &:not(:last-child) {
        margin: 0 0 $margin_l;
      }
    }
  }

  &__empty {
    flex: 1 0 0;
  }
}
</style>

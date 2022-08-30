<template>
  <div class="ibp-container">
    <section class="ibp-categories">
      <h2 class="ibp__header ibp__header--active">Blocks</h2>
      <div
        v-for="(category, index) in elementTypes.BlockCategory.data"
        :key="index"
        :class="{ 'ibp-categories__item--active': selectedCategory === category.id }"
        @click="selectedCategory = category.id"
        class="ibp-categories__item"
      >
        {{ category.config.name }}
      </div>
    </section>
    <section class="ibp-blocks">
      <div v-for="(category, index) in elementTypes.BlockCategory.data" :key="index" class="ibp-blocks__category">
        <h2 :class="{ 'ibp__header--active': selectedCategory === category.id }" class="ibp__header">
          {{ category.config.name }}
        </h2>
        <div
          v-for="(block, index) in getBlocksByCategoryId(category.id)"
          :key="index"
          @click="insertBlock(block)"
          class="ibp-blocks__item"
        >
          <div class="ibp-blocks__name">
            {{ block.config.name }}
          </div>
          <div v-if="block.config.img" class="ibp-blocks__miniature">
            <img :src="block.config.img" class="ibp-blocks__picture" alt="" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
//maybe @deprecated
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import { InsertBlockPopupData, PopupSettings } from '../types';

export default Vue.extend({
  name: 'InsertBlockPopup',
  data() {
    return {
      selectedCategory: null
    };
  },
  computed: {
    ...mapState({
      popupSettings: (state: any) => <PopupSettings<InsertBlockPopupData>>state.editor.popupSettings,
      userConfig: (state: any) => state.editor.userConfig,
      elementTypes: (state: any) => <{ BlockCategory: { data: any[] }; Block: { data: any[] } }>state.elementTypes.types
    })
  },
  methods: {
    ...mapMutations({
      insertBlockWithConfig: 'editor/insertBlockWithConfig'
    }),
    getBlocksByCategoryId(id: number) {
      return this.elementTypes.Block.data.filter((block: any) => {
        return block.config.categoryId === id;
      });
    },
    insertBlock(block: any) {
      this.insertBlockWithConfig({
        config: block.config.blockConfig,
        dbId: block.id,
        insertAfter: this.popupSettings.data.insertAfter
      });
      this.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
    }
  }
});
</script>

<style lang="scss">
.ibp {
  &__header {
    color: #000000;

    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 21px;
    margin: 0 0 20px 0;

    &--active {
      color: #4356be;
    }
  }

  &-container {
    display: flex;
    width: 413px;
    height: 540px;
    overflow: auto;

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

  &-categories {
    height: 100%;
    width: 125px;
    border-right: 1px solid #dadada;
    padding-right: 10px;
    margin-top: 0px;

    &__item {
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      padding: 4px;
      margin-bottom: 4px;
      transition: all 0.2s;

      &:hover {
        cursor: pointer;
        background: #f1f1f1;
        border-radius: $shape_border_radius;
      }

      &--active {
        background: #f1f1f1;
        border-radius: $shape_border_radius;
      }
    }
  }

  &-blocks {
    height: 100%;
    width: 287px;
    padding: 0 10px 0 12px;

    &__category {
      margin-bottom: 30px;
    }

    &__item {
      padding: 0 0 2px 2px;
      margin-bottom: 16px;

      &:hover {
        cursor: pointer;
        background-color: #f1f1f1;
        border-radius: $shape_border_radius;
      }
    }

    &__picture {
      padding: 4px;
      width: 100%;
    }

    &__name {
      font-style: normal;
      font-weight: normal;
      font-size: 10px;
      line-height: 12px;
      letter-spacing: 0.05em;
      color: #777777;
      margin-bottom: 8px;
    }
  }
}
</style>

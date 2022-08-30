<template>
  <div class="font-popup">
    <form :class="['font-popup__search', { 'font-popup__search_active': inputSearchFocus }]" @submit.prevent>
      <button>
        <svg-icon name="search-icon" width="14" height="14" color="#828282" />
      </button>
      <input
        ref="search"
        @focus="inputSearchFocus = true"
        @blur="inputSearchFocus = false"
        @keydown.esc="$refs.search.blur()"
        v-model="searchFont"
        type="text"
        placeholder="Search fonts"
      />
    </form>

    <switcher :switcher-items="filterItems" @filterName="getFilter" />

    <div class="font-popup__categories">
      <span
        :class="{ active: filterCategories === el }"
        @click="changeFilterCategory(el)"
        v-for="(el, index) in categories"
        :key="index"
      >
        {{ el }}
      </span>
    </div>

    <div v-if="filteredFont.length" key="fontList" :class="{ favoriteList: pickedSection === PickedSectionType.Favorite }" class="font-popup-list">
      <div
        v-for="(font, fontFamilyIndex) in filteredFont"
        :key="`item_${fontFamilyIndex}`"
        class="font-popup-list__item"
      >
        <div
          :class="[ 'font-popup-list__type', { active: pickedFontFamily === font.family}, { favorite: isFontFavorite(font) } ]"
          :i="fontFamilyIndex"
          @click="addFont(font)"
        >
          <span :style="`font-family: ${font.family}; font-weight: ${setFontWeight(font)}; font-style: ${font.variants[0].style}`" >
            {{ font.family }}
          </span>
          <button :class="{ active: isFontFavorite(font) }" @click.stop="addOrDeleteFavorite(font)">
            <svg-icon name="favorite-icon" width="13" height="12" color="#B3B3B3" />
          </button>
          <skeleton height="30" width="500" radius="4" max-width="100%" />
        </div>
      </div>
    </div>
    <div key="writingBlock" v-if="!filteredFont.length && searchFont.length" class="font-popup__writing">
      <svg-icon name="empty-font-icon" width="144" height="74" />
      <p>Nothing found, please try again</p>
    </div>
    <div class="font-popup__writing" v-if="pickedSection === PickedSectionType.Favorite && !filteredFont.length && !searchFont.length">
      <svg-icon name="block-fav-empty" width="139" height="139" />
      <p>You haven’t added any favorites yet</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Switcher from '../../Switcher.vue';
import WebFont from 'webfontloader';
import { mapState, mapMutations } from 'vuex';
import fontDetectWeight from '@/helpers/font/fontDetectWeight';

import Skeleton from '@/components/Shared/ui/skeleton.vue';
import { FontPopupData, PopupSettings } from '../types';
import fonts from '@/helpers/font/fontImporter';
import { FontFavorite, IFont, IFontFavoriteData, UserFavoriteStub } from '@/utils/favorites';

enum PickedSectionType {
  AllFonts = 'All Fonts',
  Favorite = 'Favorite'
}

export default Vue.extend({
  name: 'FontModal',
  components: {
    Switcher,
    Skeleton
  },
  data: () => ({
    PickedSectionType,
    searchFont: '',
    inputSearchFocus: false,
    categories: ['Sans Serif', 'Serif', 'Display', 'Monospace'],
    filterItems: [
      {
        name: PickedSectionType.AllFonts,
        icon: 'little-burger-icon',
        iconWidth: 11,
        iconHeight: 8,
        iconColor: '#000'
      },
      {
        name: PickedSectionType.Favorite,
        icon: 'favorite-icon',
        iconWidth: 11,
        iconHeight: 10,
        iconColor: '#000'
      }
    ],
    userFavorites: new UserFavoriteStub<IFontFavoriteData>(new FontFavorite()),
    intersectionObserver: null as IntersectionObserver | null,
    filterCategories: null as string | null,
    pickedFontFamily: '',
    pickedSection: PickedSectionType.AllFonts,
    selectFontHandler: () => {}
  }),
  computed: {
    ...mapState({
      userConfig: (state: any) => state.editor.userConfig,
      previewMode: (state: any) => state.editor.previewMode,
      popupSettings: (state: any) => <PopupSettings<FontPopupData>>state.editor.popupSettings,
      loadedFonts: (state: any) => state.editor.loadedFonts
    }),

    filteredFont(): IFont[] {
      this.loadPreviewFonts();
      const sortedFonts = fonts.sort((a, b) => {
        if (a.family < b.family) {
          return -1;
        }
        if (a.family > b.family) {
          return 1;
        }
        return 0;
      });
      if (this.pickedSection === PickedSectionType.Favorite) {
        return sortedFonts.filter(font => {
          return this.userFavorites.has({ font });
        });
      }

      return sortedFonts.filter(el => {
        if (this.searchFont.length) {
          return el.family.toLowerCase().indexOf(this.searchFont.toLowerCase()) + 1;
        }
        if (this.filterCategories) {
          return el.category === this.filterCategories.toLowerCase().replace(/ /g, '-');
        } else {
          return el;
        }
      });
    },

    currentFont(): string {
      const { activeFontFamily } = this.popupSettings.data;
      const style = activeFontFamily;
      const fontFamily = /"(.*?)"/g.exec(style?.fontFamily);
      return fontFamily?.length ? fontFamily[1] : '';
    }
  },
  async mounted() {
    await this.userFavorites.init();
    if (this.popupSettings.data.isSearchFieldActive) {
      this.$nextTick(() => {
        (<HTMLInputElement>this.$refs.search).focus();
      })
    }

    this.loadPreviewFonts();

    this.pickedFontFamily = this.currentFont;
  },
  destroyed() {
    this.intersectionObserver?.disconnect();
  },
  methods: {
    ...mapMutations({
      setLoadedFont: 'editor/setLoadedFont'
    }),
    getFilter(e: PickedSectionType) {
      this.pickedSection = e;
    },
    async addOrDeleteFavorite(font: IFont) {
      await this.userFavorites.addOrDelete({ font });
    },
    isFontFavorite(font: IFont) {
      return this.userFavorites.has({ font });
    },
    computedFontWeight(type: string) {
      return fontDetectWeight(type);
    },
    addFont(family: IFont) {
      this.pickedFontFamily = family.family;
      let googleFontFamily = `${family.family}:`;
      const filteredVariants = family.variants.filter(el => el.style === 'normal' && el.name !== 'italic');

      filteredVariants.forEach((variant, index) => {
        googleFontFamily += filteredVariants.length - 1 === index ? `${variant.name}` : `${variant.name},`;
      });

      this.popupSettings.data.selectFontHandler({
        fontFamily: `"${family.family}", ${family.category}`,
        fontWeight: family.variants.some(item => item.name === '400' && item.style === 'normal')
          ? '400'
          : family.variants[0].name,
        fontStyle: family.variants[0].style,
        googleFontFamily
      });
    },
    changeFilterCategory(name: string) {
      if (this.filterCategories === name) {
        this.filterCategories = '';
      } else {
        this.filterCategories = name;
      }
    },
    loadPreviewFonts() {
      this.$nextTick(() => {
        this.addLoadingClasses();
        this.intersectionObserver = null;
        const threshold = [];
        for (let i = 0; i < 1.0; i += 0.1) {
          threshold.push(parseFloat(i.toFixed(1)));
        }
        this.intersectionObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach(entry => {
              if (entry.intersectionRatio > 0) {
                const targetAttribute = entry.target.getAttribute('i');
                if (!targetAttribute) return;
                const fontFamily = this.filteredFont[+targetAttribute].family;
                let families = [];
                families.push(fontFamily);
                setTimeout(() => {
                  entry.target.classList.remove('font-popup-list__type--loading');
                }, 300);
                //maybe we need to use userConfig.googleFonts.fonts for that?
                if (!this.loadedFonts.includes(fontFamily)) {
                  this.setLoadedFont(fontFamily);
                  WebFont.load({
                    google: {
                      families
                    }
                  });
                }
              }
            });
          },
          {
            threshold: threshold
          }
        );

        const elements = Array.from(document.querySelectorAll('.font-popup-list__type'));
        elements.forEach(element => this.intersectionObserver?.observe(element));
      });
    },
    addLoadingClasses() {
      const elements = document.querySelectorAll('.font-popup-list__type');

      elements.forEach(item => {
        item.classList.add('font-popup-list__type--loading');
      });
    },
    setFontWeight(font: any) {
      if(font.variants.length === 1) return font.variants[0].name
      return font.variants.find((item: any) => item.name === '400')?.name ?? font.variants[0].name
    }
  }
});
</script>

<style lang="scss">
.font-popup {
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

  &__categories {
    display: flex;
    margin-top: $margin_s;

    span {
      white-space: nowrap;
      padding: 5px 8px;
      border: 1px solid $color_input_overlay_border;
      box-sizing: border-box;
      border-radius: $shape_border_radius;
      font-size: 12px;
      line-height: 14px;
      color: $black;
      cursor: pointer;
      transition: box-shadow 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;

      &.active {
        background-color: $black;
        border-color: $black;
        color: $white;
      }

      &:hover {
        box-shadow: $shadow_small;
      }

      &:not(:last-of-type) {
        margin-right: 3px;
      }
    }
  }

  &-list {
    height: 290px;
    overflow-y: auto;
    margin: $margin_l -20px 0;
    padding: 0 $margin_xl 0;
    border-top: 1px solid $color_drop_divider;

    &.favoriteList {
      .font-popup-list__type:not(.favorite) {
        display: none;
      }
    }

    &::-webkit-scrollbar {
      margin-top: 8px;
      width: 2px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 30px;
      background: $gray400;
    }

    &__type {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      cursor: pointer;
      border-radius: $shape_border_radius;
      font-size: 12px;
      line-height: 16px;
      transition: background-color 0.2s ease, color 0.2s ease;
      color: $color_drop_item_text;
      height: 35px;
      position: relative;

      & > div {
        transition: 0.3s;
        opacity: 0;
        position: absolute !important;
        left: 10px;
        top: 0;
        bottom: 0;
        margin: auto;
        max-width: calc(100% - 20px) !important;
        z-index: -1;
      }

      span,
      button {
        opacity: 1;
        transition: 0.3s;
      }

      &--loading {
        &:hover {
          background: $white !important;
        }
        span,
        button {
          opacity: 0;
        }
        & > div {
          opacity: 1;
        }
      }

      button {
        padding: 2px 5px;
        transition: background-color 0.2s ease;
        cursor: pointer;

        svg {
          transition: 0.3s;
        }

        &:hover {
          svg {
            color: $danger!important;
          }
        }

        &.active {
          svg {
            color: $danger!important;
          }

          &:hover {
            svg {
              color: #cc0000 !important;
            }
          }
        }
      }

      &.active {
        color: $color_drop_active_item_text;
      }

      &:hover {
        background-color: $color_drop_item_bg_hover;
      }

      &:active {
        background-color: $color_drop_item_bg_focus;
      }
    }

    &__item {
      font-family: 'Inter', sans-serif;
      &:first-of-type {
        margin-top: 8px;
      }
    }
  }

  &__writing {
    height: 290px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 8px;

    svg {
      margin: 0 0 12px;
    }

    p {
      font-size: 12px;
      line-height: 14px;
      color: #949CAD;
      opacity: 0.6;
    }
  }

  .slide-y-enter-active,
  .slide-y-leave-active {
    transition: opacity 0.2s, transform 0.2s ease;
  }
  .slide-y-enter,
  .slide-y-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>

<template>
  <div class="categoriesCarousel">
    <div class="categoriesCarousel__skeleton" :class="{ isSliderInit }">
      <skeleton
        v-for="item in 8"
        :key="item"
        max-width="100%"
        height="95"
        width="198"
        radius="12"
        class="categoriesCarousel__skeleton-item"
      />
    </div>
    <div class="categoriesCarousel__container" :class="{ isSliderInit }">
      <div
        :class="{ categoriesCarousel__nav__hidden: !isNavsLeftShown }"
        class="categoriesCarousel__nav__arrow categoriesCarousel__nav__left"
        @click="showPrevious"
      >
        <svg-icon width="16" height="16" name="icon-left" color="#000" />
      </div>
      <VueSlickCarousel
        v-if="categories.length > 0"
        :dots="false"
        :arrows="false"
        :infinite="false"
        :slidesToShow="1"
        :slidesToScroll="2"
        :autoplay="false"
        :centerMode="false"
        :variableWidth="true"
        centerPadding="0px"
        :initialSlide="0"
        @beforeChange="beforeChange"
        @init="onInitCarousel"
        ref="categoriesCarousel"
        class="categoriesCarousel__slider"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          :class="{
            categoriesCarousel__category__isAll: category.id == 0,
            categoriesCarousel__category__isOther: category.id != 0,
          }"
          class="categoriesCarousel__category"
          @click="goToCategory(category.name)"
        >
          <div class="categoriesCarousel__category__header">
            <picture v-if="category.icon">
              <source
                v-if="category.icon.fullPathWebP"
                type="image/webp"
                project
              />
              <source
                v-if="category.icon.fullPathJp2"
                type="image/jp2"
                :srcset="category.icon.fullPathJp2.replace(' ', '%20')"
              />
              <img
                v-if="category.icon.fullPath"
                :src="category.icon.fullPath"
              />
            </picture>
            <span class="categoriesCarousel__category__name">{{
              category.name
            }}</span>
            <span class="categoriesCarousel__category__count"
              >({{ category.projectsCount }})</span
            >
          </div>
          <div class="categoriesCarousel__category__description">
            {{ category.description }}
          </div>
        </div>
      </VueSlickCarousel>
      <div
        :class="{ categoriesCarousel__nav__hidden: !isNavsRightShown }"
        class="categoriesCarousel__nav__arrow categoriesCarousel__nav__right"
        @click="showNext"
      >
        <svg-icon width="16" height="16" color="#000" name="icon-right" />
      </div>
      <div
        :class="{ categoriesCarousel__buttonAll__active: isShowAllCategories }"
        class="categoriesCarousel__buttonAll"
        @click="showAllCategories"
      >
        <svg-icon
          class="categoriesCarousel__icon"
          width="24"
          height="24"
          color="#000"
          name="three-points"
        />
      </div>
      <CategoriesProjects
        class="categoriesCarousel__categories"
        v-if="isShowAllCategories"
        :categories="categories"
        :selectedCategoryId="0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import apiClient from '@/utils/apiClient'
import { ProjectCategoriesDto } from '@/utils/api'
import CategoriesProjects from '@/components/Discover/CategoriesProjects.vue'
import Skeleton from "~/components/Shared/ui/skeleton.vue";
export default Vue.extend({
  components: {Skeleton, VueSlickCarousel, CategoriesProjects },
  data() {
    return {
      isNavsRightShown: true,
      isNavsLeftShown: false,
      slidesToShow: 1,
      isSliderInit: false,
      responsive: [
        {
          "breakpoint": 1024,
          "settings": {
            "slidesToShow": 3,
          }
        }
      ]
    }
  },
  props: {
    categories: {
      type: Array as PropType<ProjectCategoriesDto[]>,
    },
  },
  computed: {
    ...mapState({
      isShowAllCategories: (state: any) => state.ui.isAllCategories,
    }),
  },
  methods: {
    showNext() {
      if (this.$refs.categoriesCarousel)
        (this.$refs.categoriesCarousel as any).next()
    },
    showPrevious() {
      if (this.$refs.categoriesCarousel)
        (this.$refs.categoriesCarousel as any).prev()
    },
    beforeChange(oldSlideIndex: Number, newSlideIndex: Number) {
      this.isNavsRightShown = newSlideIndex < this.categories.length - 1
      this.isNavsLeftShown = newSlideIndex > 0
    },
    goToCategory(name: string | undefined) {
      const categoryName =
        name == '🔍 All' || name === undefined
          ? ''
          : `/${name.toLowerCase().replace(/ /g, '-')}`

      this.$router.push({
        path: `/feed${categoryName}`,
      })
    },
    showAllCategories() {
      this.$store.commit(
        'ui/changeAllCategoriesState',
        !this.isShowAllCategories
      )
    },
    onInitCarousel() {
      this.isSliderInit = true;
    }
  },
})
</script>
<style lang="scss">
.categoriesCarousel {
  position: relative;
  display: flex;
  flex-direction: row;
  margin: 40px 0 0;

  &__skeleton {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    display: flex;

    &.isSliderInit {
      opacity: 1;
      visibility: hidden;
    }

    &-item {
      &:not(:last-child) {
        margin: 0 10px 0 0;
      }
    }
  }

  &__buttonAll {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #ebebeb;
    border-radius: 12px;
    height: 95px;
    width: 52px;
    z-index: 1;
    cursor: pointer;
    margin-left: 30px;
    &:hover {
      background: rgba(243, 243, 243, 0.5);
    }
    &:active {
      border: 1px solid #ebebeb;
    }
    &__active {
      z-index: 999;
    }
  }
  &__category {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
    border: 1px solid #ebebeb;
    border-radius: 12px;
    color: #000000;
    cursor: pointer;
    width: 198px!important;
    height: 95px;
    margin: 0 10px 0 0;
    &__isOther {
      &:hover {
        background: rgba(243, 243, 243, 0.5);
      }
    }
    img {
      height: 18px;
      width: 18px;
    }
    &__header {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      margin-bottom: 10px;
    }
    &__name {
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
      margin-left: 5px;
      max-width: calc(100% - 65px);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    &__count {
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      color: #bdbdbd;
      width: 40px;
      margin-right: 5px;
    }
    &__description {
      font-weight: 400;
      font-size: 12px;
      width: 134px;
      line-height: 18px;
      color: #333333;
      word-wrap: break-word;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    &__isAll {
      background: #000000;
      color: #ffffff;
      div {
        color: #ffffff;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
  &__container {
    height: 95px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    opacity: 0;
    transition: 0.3s;
    &.isSliderInit {
      opacity: 1;
    }
    .slick-list {
      padding: 0;
    }
    .slick-slider {
      width: calc(100% - 80px);
    }
  }
  &__nav {
    &__hidden {
      visibility: hidden;
    }
    &__arrow {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-top: 40px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 100%;
      background: #ffffff;
      cursor: pointer;
      position: absolute;
      z-index: 3;
      transition: 0.3s;
      div {
        width: 16px;
        height: 16px;
      }
      &:hover {
        background: #f3f3f3;
      }
    }
    &__left {
      left: -8px;
    }
    &__right {
      right: 72px;
    }
  }
  &__categories {
    position: absolute;
    top: 100px;
    right: 0;
  }
}
@media screen and (max-width: 495px) {
  .categoriesCarousel {
    display: none;
  }
}
</style>

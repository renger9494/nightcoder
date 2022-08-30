<template>
  <div class="filterFeed">
    <div
      :class="{
        tagsCarousel__mobile: isShowAllCategories,
        isSliderInit,
      }"
      class="tagsCarousel"
      v-if="category"
    >
      <category
        :category="category"
        :categories="categories"
        :isMobileCategory="false"
      />
      <div class="tagsCarousel__row">
        <div
          v-if="isButtonsVisible"
          :class="{ tagsCarousel__nav__hidden: !isNavsLeftShown }"
          class="tagsCarousel__nav__arrow tagsCarousel__nav__left"
          @click="showPrevious"
        >
          <svg-icon width="16" height="16" color="#000" name="icon-left" />
        </div>
        <VueSlickCarousel
          v-if="tags && tags.length > 0"
          :dots="false"
          :arrows="false"
          :infinite="false"
          :speed="500"
          :slidesToScroll="1"
          :centerMode="false"
          :variableWidth="true"
          centerPadding="0px"
          :initialSlide="0"
          @beforeChange="beforeChange"
          @init="onSliderInit"
          ref="tagsCarousel"
        >
          <div
            v-for="tag in tags"
            :key="tag.id"
            class="tag"
            @click="searchByTag(tag)"
            :class="{
              tag_active: tag.isActive,
            }"
          >
            {{ tag.name }}
          </div>
        </VueSlickCarousel>
        <div
          v-if="isButtonsVisible"
          :class="{ tagsCarousel__nav__hidden: !isNavsRightShown }"
          class="tagsCarousel__nav__arrow tagsCarousel__nav__right"
          @click="showNext"
        >
          <svg-icon width="16" height="16" color="#000" name="icon-right" />
        </div>
      </div>
    </div>
    <div v-else>
      <categories-carousel
        class="filterFeed__categoriesCarousel"
        :categories="categories"
        :selectedCategoryId="0"
      />
      <category
        :category="categoryFirst"
        :categories="categories"
        :isMobileCategory="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import {
  ProjectTagDto,
  ProjectCategoriesDto,
  ProjectCategoryDto,
} from '@/utils/api'
import Category from '@/components/Discover/Category.vue'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

type ProjectTag = ProjectTagDto & { isActive: boolean }

export default Vue.extend({
  components: { Category, VueSlickCarousel },
  data() {
    return {
      isNavsRightShown: true,
      isNavsLeftShown: false,
      isButtonsVisible: false,
      isSliderInit: false,
    }
  },
  props: {
    categories: {
      type: Array as PropType<ProjectCategoriesDto[]>,
      required: true,
    },
    category: {
      type: Object as PropType<ProjectCategoryDto | null>,
      default: null,
    },
    tags: {
      type: [] as PropType<ProjectTag[] | undefined>,
      default: undefined,
    },
  },
  computed: {
    ...mapState({
      isShowAllCategories: (state: any) => state.ui.isAllCategories,
    }),
    categoryFirst(): ProjectCategoryDto {
      return <ProjectCategoryDto>this.categories[0]
    },
  },
  methods: {
    searchByTag(tag: ProjectTag) {
      this.$emit('searchByTag', tag)
    },
    showNext() {
      if (this.$refs.tagsCarousel) (this.$refs.tagsCarousel as any).next()
    },
    showPrevious() {
      if (this.$refs.tagsCarousel) (this.$refs.tagsCarousel as any).prev()
    },
    beforeChange(oldSlideIndex: Number, newSlideIndex: Number) {
      if (this.tags)
        this.isNavsRightShown = newSlideIndex < this.tags.length - 1
      this.isNavsLeftShown = newSlideIndex > 0
    },
    setButtonsCondition() {
      const sliderWrapper =
        document.querySelector('.slick-list')?.clientWidth ?? 0
      const sliderItems = document.querySelectorAll('.slick-slide')
      let slidesWidth = 0
      for (const slide of Array.from(sliderItems)) {
        slidesWidth += slide.clientWidth
      }
      this.isButtonsVisible = slidesWidth > sliderWrapper
    },
    onSliderInit() {
      this.isSliderInit = !this.isSliderInit
    },
  },
  mounted() {
    this.setButtonsCondition()
  },
})
</script>

<style lang="scss" scoped>
.filterFeed {
  margin-bottom: 40px;
  margin-top: 30px;
}
.tag {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  text-transform: lowercase;
  display: inline-block;
  color: $black;
  margin-right: 10px;
  padding: 11px 15px;
  background: #f3f3f3;
  border-radius: 100px;
  transition: 0.3s;
  cursor: pointer;
  text-decoration: none;
  width: auto !important;
  &::first-letter {
    text-transform: uppercase;
  }

  &:hover {
    background: rgba(243, 243, 243, 0.5);
  }
  &:active {
    color: #ffffff;
    background-color: #000000;
  }
  &_active {
    background-color: #000000 !important;
    color: #ffffff;
    &:hover {
      opacity: 0.8 !important;
    }
  }
}
.tagsCarousel {
  height: 35px;
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  transition: 0.3s;
  opacity: 0;

  &.isSliderInit {
    opacity: 1;
  }
  .slick-slide {
    height: 35px;
    margin-right: 10px;
  }
  .slick-slider {
    width: 100%;
  }
  &__row {
    width: calc(100% - 280px);
    display: flex;
    flex-direction: row;
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
      margin-top: 8px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 100%;
      background: #ffffff;
      cursor: pointer;
      position: absolute;
      z-index: 3;
      transition: 0.3s;
      div {
        width: 24px;
        height: 24px;
      }
      &:hover {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.2);
      }
    }
    &__left {
      left: 190px;
    }
    &__right {
      right: -12px;
    }
  }
}
@media screen and (max-width: 495px) {
  .filterFeed {
    margin-bottom: 40px;
    &__categoriesCarousel {
      display: none;
    }
  }
  .tagsCarousel {
    height: auto;
    margin: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    &__row {
      width: 100%;
      margin-top: 20px;
    }
    &__mobile {
      position: static;
    }
    &__nav {
      &__left {
        left: -12px;
      }
    }
  }
}
</style>

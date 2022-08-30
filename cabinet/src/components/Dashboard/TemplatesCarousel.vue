<template>
  <div class="templatesCarousel" v-if="!closedCarousel">
    <div class="templatesCarousel__header">
      <p class="templatesCarousel__header__title">
        Explore our popular templates
      </p>
      <div>
        <nuxt-link to="/templates">See all</nuxt-link>
        <button
          @click="closeTemplatesCarousel"
          class="templatesCarousel__close"
        >
          <svg-icon
            name="close"
            width="9"
            height="9"
            color="#000000"
          />
        </button>
      </div>
    </div>
    <div class="templatesList">
      <div
        :class="{ templatesList__nav__hidden: !isNavsShown }"
        class="templatesList__nav__arrow"
        @click="showPrevious"
      >
        <svg-icon width="16" height="16" name="icon-left" color="#000" />
      </div>
      <div class="templatesList__container">
        <VueSlickCarousel
          v-if="!isLoading"
          :dots="false"
          :arrows="false"
          :infinite="false"
          :speed="500"
          :slidesToShow="slidesToShow"
          :slidesToScroll="1"
          :autoplay="false"
          :autoplaySpeed="4000"
          :pauseOnDotsHover="true"
          :pauseOnFocus="true"
          :pauseOnHover="true"
          :initialSlide="0"
          @init="onInitCarousel"
          @reInit="onInitCarousel"
          @beforeChange="beforeChange"
          ref="carouselTemplates"
          lazyLoad="progressive"
        >
          <air-template
            v-for="template in templates"
            :key="template.id"
            :template="template"
            :carousel="true"
          />
        </VueSlickCarousel>

        <div v-else class="templatesList__skeleton">
          <div
            class="templatesList__skeleton-item"
            v-for="item in slidesToShow"
            :key="`${item}skeleton`"
          >
            <skeleton
              max-width="100%"
              height="128"
              width="100%"
              radius="5"
              style="margin-bottom: 8px"
            />
            <skeleton max-width="100%" height="16" width="100%" radius="5" />
          </div>
        </div>
      </div>
      <div
        :class="{ templatesList__nav__hidden: !isNavsShown }"
        class="templatesList__nav__arrow"
        @click="showNext"
      >
        <svg-icon width="16" height="16" color="#000" name="icon-right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import apiClient from '@/utils/apiClient'
import AirTemplate from '@/components/Templates/TemplatesList/Template.vue'
import { TemplateDto } from '@/utils/api'
export default Vue.extend({
  components: { VueSlickCarousel, AirTemplate },
  data() {
    return {
      pageNumber: 1,
      totalPages: 1,
      templates: [] as TemplateDto[],
      isLoading: true,
      slidesToShow: 3,
      closedCarousel: false,
      randomId: '' as string | undefined,
      isNavsShown: false,
    }
  },
  async mounted() {
    try {
      const { data } = await apiClient.templates.templatesGet({
        PageSize: 20,
        PageNumber: 1,
        IsOnlyPopular: true,
      })
      this.templates = data.items
      this.totalPages = data.pagination.totalPages
      this.pageNumber = data.pagination.pageNumber
      this.isLoading = false
      this.randomId = data.randomId
      this.$nextTick(() => {
        this.isNavsShown =
          (<any>this.$refs?.carouselTemplates)?.slidesToShow < data.items.length
      })
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    onInitCarousel() {
      if (window.outerWidth > 2000) this.slidesToShow = 9
      else if (window.outerWidth > 1840) this.slidesToShow = 8
      else if (window.outerWidth > 1570) this.slidesToShow = 7
      else if (window.outerWidth > 1344) this.slidesToShow = 6
      else if (window.outerWidth > 1170) this.slidesToShow = 5
      else if (window.outerWidth > 1000) this.slidesToShow = 4
      else if (window.outerWidth > 953) this.slidesToShow = 3
      else if (window.outerWidth > 768) this.slidesToShow = 2
      else if (window.outerWidth < 769 && window.outerWidth > 745)
        this.slidesToShow = 4
      else if (window.outerWidth < 746 && window.outerWidth > 591)
        this.slidesToShow = 3
      else if (window.outerWidth < 590) this.slidesToShow = 2
    },
    beforeChange() {
      if (this.pageNumber < this.totalPages) {
        apiClient.templates
          .templatesGet({
            PageSize: 20,
            PageNumber: this.pageNumber + 1,
            RandomId: this.randomId,
            IsOnlyPopular: true,
          })
          .then(({ data }) => {
            data.items.forEach((item) => {
              this.templates.push(item)
            })
            this.totalPages = data.pagination.totalPages
            this.pageNumber = data.pagination.pageNumber
            this.randomId = data.randomId
          })
          .catch((error) => {})
      }
    },
    closeTemplatesCarousel() {
      this.$cookies.set('templates-carousel', false)
      this.closedCarousel = true
    },
    showNext() {
      if (this.$refs.carouselTemplates)
        (this.$refs.carouselTemplates as any).next()
    },
    showPrevious() {
      if (this.$refs.carouselTemplates)
        (this.$refs.carouselTemplates as any).prev()
    },
  },
})
</script>
<style lang="scss">
.templatesCarousel {
  position: relative;

  padding: 30px 30px;
  border-radius: 4px;
  background: rgba(173, 187, 255, 0.2);
  margin-bottom: 30px;

  &__header {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    &__title {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
    }
    div {
      display: flex;
      flex-direction: row;
    }
    a {
      text-decoration: none;
      color: $black;
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
      padding-right: 16px;
      border-right: 1px solid rgba(173, 187, 255, 0.5);
      margin-right: 16px;
      &:hover {
        color: #173bef;
      }
    }
  }

  &__close {
    background: $white;
    border-radius: 100%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
      transition: 0.3s;
    }

    &:hover {
      background: #f3f3f3;
      svg {
        color: $black !important;
      }
    }
  }
}
.templatesList {
  margin: 20px -8px 0;
  display: flex;
  // align-items: center;
  flex-direction: row;
  height: 154px;
  &__container {
    height: 154px;
    margin: 0 -8px;
    width: calc(100% - 16px);
    .slick-slide {
      max-width: 190px;
      height: 154px;
    }
    .slick-track {
      min-width: 100%;
    }
  }
  &__skeleton {
    display: flex;
    flex-wrap: wrap;

    margin-right: -20px;
    margin-left: -20px;

    &-item {
      flex: 0 0 calc(20% - 40px);
      width: calc(20% - 40px);
      margin-right: 20px;
      margin-bottom: 5px;
      margin-left: 20px;
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
      width: 16px;
      height: 16px;
      margin-top: 56px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 100%;
      background: #ffffff;
      cursor: pointer;
      z-index: 3;
      div {
        width: 16px;
        height: 16px;
      }
      &:hover {
        background: #f3f3f3;
      }
    }
  }
}
@media screen and (max-width: 1728px) {
  .templatesList {
    &__nav__arrow {
      margin-top: 52px;
    }
    &__container {
      .slick-slide {
        max-width: 180px;
      }
    }
  }
}
@media screen and (max-width: 1000px) {
  .templatesList {
    &__nav__arrow {
      margin-top: 49px;
    }
  }
}
@media screen and (max-width: 475px) {
  .templatesCarousel {
    display: none;
  }
}
</style>

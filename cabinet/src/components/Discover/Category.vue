<template>
  <div
    :class="{
      'category-block__active': isShowAllCategories,
    }"
    class="category-block"
  >
    <div
      :class="{
        category__mobile: isMobileCategory,
        category__active: isShowAllCategories,
      }"
      class="category"
      v-if="category"
      @click="showAllCategories"
    >
      <div class="category__header">
        <picture v-if="category.icon">
          <source v-if="category.icon.fullPathWebP" type="image/webp" project />
          <source
            v-if="category.icon.fullPathJp2"
            type="image/jp2"
            :srcset="category.icon.fullPathJp2.replace(' ', '%20')"
          />
          <img v-if="category.icon.fullPath" :src="category.icon.fullPath" />
        </picture>
        <span>{{ category.name }}</span>
      </div>
      <div class="category__buttomAll">
        <svg-icon
          v-if="isShowAllCategories"
          width="8"
          height="5"
          color="#318BF5"
          name="vectorUp"
        />

        <svg-icon
          v-else
          width="8"
          height="5"
          color="#000"
          name="vectorDown"
        />
      </div>
    </div>
    <CategoriesProjects
      :class="{
        category__categories__mobile: isShowAllCategories && isMobileCategory,
      }"
      class="category__categories"
      v-if="isShowAllCategories"
      :categories="categories"
      :selectedCategoryId="category ? category.id : 0"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { ProjectCategoryDto, ProjectCategoriesDto } from '@/utils/api'
import CategoriesProjects from '@/components/Discover/CategoriesProjects.vue'
export default Vue.extend({
  components: { CategoriesProjects },
  props: {
    category: {
      type: Object as PropType<ProjectCategoryDto | null>,
      default: null,
    },
    categories: {
      type: Array as PropType<ProjectCategoriesDto[]>,
      required: true,
    },
    isMobileCategory: Boolean,
  },

  computed: {
    ...mapState({
      isShowAllCategories: (state: any) => state.ui.isAllCategories,
    }),
  },

  methods: {
    showAllCategories() {
      window.scrollTo(0, 0)
      if (this.isMobileCategory) document.body.style.overflow = 'hidden'
      this.$store.commit(
        'ui/changeAllCategoriesState',
        !this.isShowAllCategories
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.category-block {
  z-index: 1;
  &__active {
    z-index: 999;
  }
}
.category {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  padding: 12px 14px;
  margin-right: 30px;
  width: 250px;
  height: 37px;
  border: 1px solid #f3f3f3;
  background: #ffffff;
  border-radius: 4px;
  transition: 0.3s;
  cursor: pointer;
  &__mobile {
    display: none;
  }

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    picture {
      display: flex;
    }
    img {
      height: 18px;
      width: 18px;
    }
    span {
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
      margin-left: 3px;
      width: 185px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  &__buttomAll {
    height: 100%;
    width: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  &:hover,
  &__active {
    border: 1px solid #318bf5;
  }
  &__categories {
    position: absolute;
    top: 50px;
    left: 0px;
    &__mobile {
      display: none;
    }
  }
}
@media screen and (max-width: 495px) {
  .category-block {
    &__active {
      width: calc(100% - 30px);
      position: absolute;
      top: 70px;
      height: calc(100% - 90px);
    }
  }
  .category {
    width: 100%;
    &__mobile {
      display: flex;
    }

    &__header {
      width: calc(100% - 20px);
      span {
        width: calc(100% - 21px);
      }
    }
    &__categories {
      bottom: 10px;
      overflow-y: scroll;
      &__mobile {
        display: block;
      }
      &::-webkit-scrollbar {
        width: 3px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: #dadada;
        height: 30px;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-track-piece {
        display: none;
      }
    }
  }
}
</style>

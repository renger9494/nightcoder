<template>
  <div class="projectFilter">
    <div
      :class="{
        projectCategory__active: isShowAllCategories,
         'error': isSubmitting && !category
      }"
      class="projectCategory"
      @click="showAllCategories"
    >
      <div v-if="category" class="projectCategory__header">
        <picture v-if="category.icon" class="projectCategory__header__icon">
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
      <div v-else class="projectCategory__placeholder">Category</div>
      <div class="projectCategory__buttomAll">
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
    <div
      class="projectCategories"
      v-if="isShowAllCategories"
      :categories="categories"
       v-click-outside="() => (isShowAllCategories = false)"
    >
      <div
        v-for="category in categories"
        :key="category.id"
        class="projectCategories__category"
        @click="selectedCategory(category)"
      >
        <picture v-if="category.icon" class="projectCategories__category__icon">
          <source v-if="category.icon.fullPathWebP" type="image/webp" project />
          <source
            v-if="category.icon.fullPathJp2"
            type="image/jp2"
            :srcset="category.icon.fullPathJp2.replace(' ', '%20')"
          />
          <img v-if="category.icon.fullPath" :src="category.icon.fullPath" />
        </picture>
        <span class="projectCategories__category__name">{{
          category.name
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ProjectCategoryWithTagsDto } from '@/utils/api'

export default Vue.extend({
  components: {},

  props: {
    categories: {
      type: Array as PropType<ProjectCategoryWithTagsDto[]>,
      required: true,
    },
    category: {
      type: Object as PropType<ProjectCategoryWithTagsDto | null>,
      default: null,
    },
     isSubmitting: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      isShowAllCategories: false,
    }
  },
  methods: {
    showAllCategories() {
      this.isShowAllCategories = !this.isShowAllCategories
    },
    selectedCategory(category: ProjectCategoryWithTagsDto) {
      this.isShowAllCategories = !this.isShowAllCategories
      this.$emit('selectedCategory', category, false)
    },
  },
})
</script>

<style lang="scss" scoped>
.projectFilter {
  position: relative;
}
.projectCategory {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 9px 8px;
  margin-bottom: 20px;
  width: 100%;
  height: 37px;
  border: 1px solid #f3f3f3;
  background: #ffffff;
  border-radius: 4px;
  transition: 0.3s;
  cursor: pointer;

  &.error {
    border-color: $danger;
  }
  &__placeholder {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: #828282;
  }

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    &__icon {
      height: 18px;
    }
    img {
      height: 18px;
      width: 18px;
    }
    span {
      font-size: 13px;
      line-height: 21px;
      margin-left: 3px;
      width: 250px;
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
  }
}
.projectCategories {
  overflow-y: scroll;
  z-index: 999;
  top: 41px;

  position: absolute;
  display: flex;
  flex-direction: column;
  height: 212px;
  width: 100%;
  background: #ffffff;
  padding: 16px 8px;
  border: 1px solid #dadada;
  box-shadow: 0px 10px 20px rgba(9, 9, 9, 0.15);
  border-radius: 4px;
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

  &__category {
    width: 100%;
    padding: 5px 8px;
    align-items: center;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    flex-wrap: nowrap;
    &__icon {
      height: 18px;
    }
    img {
      height: 18px;
      width: 18px;
    }
    &__name {
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
      margin-left: 5px;
      max-width: calc(100% - 23px);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    &:hover,
    &__active {
      background: #f3f3f3;
    }
  }
}
</style>

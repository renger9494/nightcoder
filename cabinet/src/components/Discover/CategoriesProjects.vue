<template>
  <div class="categories-projects">
    <div class="categories">
      <div
        v-for="category in categories"
        :key="category.id"
        :class="{
          categories__category__isSelected: category.id == selectedCategoryId,
          categories__category__isOther: category.id != selectedCategoryId,
        }"
        class="categories__category"
        @click="goToCategory(category.name)"
      >
        <div class="categories__category__header">
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
            <img v-if="category.icon.fullPath" :src="category.icon.fullPath" />
          </picture>
          <span class="categories__category__name">{{ category.name }}</span>
          <span class="categories__category__count"
            >({{ category.projectsCount }})</span
          >
        </div>
        <div class="categories__category__description">
          {{ category.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import apiClient from '@/utils/apiClient'
import { ProjectCategoriesDto } from '@/utils/api'
export default Vue.extend({
  data() {
    return {}
  },
  props: {
    categories: {
      type: Array as PropType<ProjectCategoriesDto[]>,
    },
    selectedCategoryId: {
      type: Number,
    },
  },
  methods: {
    goToCategory(name: string | undefined) {
      const categoryName =
        name == '🔍 All' || name === undefined
          ? ''
          : `/${name.toLowerCase().replace(/ /g, '-')}`
      this.$store.commit('ui/changeAllCategoriesState', false)
      this.$router.push({
        path: `/feed${categoryName}`,
      })
    },
  },
})
</script>
<style lang="scss" scoped>
.categories-projects {
  position: absolute;
  width: 870px;
  height: 311px;
  background: #ffffff;
  border: 1px solid #dadada;
  box-shadow: 0 10px 20px rgba(9, 9, 9, 0.15);
  border-radius: 12px;
  padding: 0;
  overflow-y: auto;
  z-index: 999;
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
.categories {
  display: flex;
  flex-wrap: wrap;
  //height: 100%; scroll
  overflow: hidden;
  margin: 20px 15px;
  row-gap: 10px;
  &__category {
    flex: 0 0 calc(25% - 10px);
    width: calc(25% - 10px);
    margin-right: 5px;
    margin-bottom: 5px;
    margin-left: 5px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
    border: 1px solid #ebebeb;
    border-radius: 12px;
    color: #000000;
    cursor: pointer;
    height: 97px;
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
      margin-bottom: 6px;
      width: 100%;

      picture {
        display: flex;
      }
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
    &__isSelected {
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
}
@media screen and (max-width: 910px) {
  .categories-projects {
    width: 660px;
    height: 311px;
    .categories {
      &__category {
        flex: 0 0 calc(33.333% - 10px);
        width: calc(33.333% - 10px);
      }
    }
  }
}
@media screen and (max-width: 700px) {
  .categories-projects {
    width: 450px;
    height: 311px;
    .categories {
      &__category {
        flex: 0 0 calc(50% - 10px);
        width: calc(50% - 10px);
      }
    }
  }
}

@media screen and (max-width: 495px) {
  .categories-projects {
    width: 100%;
    height: auto;
    .categories {
      &__category {
        flex: 0 0 100%;
        width: 100%;
        margin-right: 0;
        margin-bottom: 10px;
        margin-left: 0;
        align-items: center;
        height: 79px;
        &__header {
          justify-content: center;
          margin-bottom: 6px;
        }
        &__description {
          width: 100%;
          text-align: center;
          -webkit-line-clamp: 1;
        }
      }
    }
  }
}
</style>

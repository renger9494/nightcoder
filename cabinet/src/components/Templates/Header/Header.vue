<template>
  <div class="header">
    <div class="header__inner" v-observe-visibility="visibilityChanged">
      <air-title :tagName="tagName" />
      <search
        class="header__searchDesktop"
        :value="searchValue"
        :onChange="onSearchChange"
      />

      <categories-list :categories="categories" />

      <!-- ************* hide for future releases ************* -->
      <!--      <div class="page-types">-->
      <!--        <div-->
      <!--          class="page-type"-->
      <!--          :class="{ active: pageType == currentPageType }"-->
      <!--          v-for="pageType in pageTypes"-->
      <!--          :key="pageType.id"-->
      <!--          @click="onPageTypeClick(pageType, $event)"-->
      <!--        >-->
      <!--          {{ pageType.name }} Pages-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <!--  <categories-list
      :categories="categories.slice(0, 7)"
      :isVisible="isVisible"
      v-if="!isVisible"
    /> -->
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import AirTitle from '@/components/Templates/Header/Title.vue'
import Search from '@/components/Templates/Header/Search.vue'
import CategoriesList from '@/components/Templates/Header/CategoriesList.vue'
import { BaseNameDtoOfInteger } from '@/utils/api'
import VueObserveVisibility from 'vue-observe-visibility'

Vue.use(VueObserveVisibility)
export default Vue.extend({
  props: {
    currentPageType: {
      type: Object as PropType<BaseNameDtoOfInteger>,
    },
    pageTypes: {
      type: Array as PropType<BaseNameDtoOfInteger[]>,
      required: true,
    },
    categories: {
      type: Array as PropType<BaseNameDtoOfInteger[]>,
      required: true,
    },
    searchValue: {
      type: String,
      required: true,
    },
    onPageTypeClick: {
      type: Function,
      required: true,
    },
    onSearchChange: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isVisible: true,
    }
  },
  components: {
    AirTitle,
    Search,
    CategoriesList,
  },
  computed: {
    tagName(): string {
      const { tagId } = this.$route.params
      const activeCategory = this.categories.find(
        (item) => item.name?.replace(' ', '-').toLowerCase() == tagId
      )
      return activeCategory && activeCategory.name
        ? activeCategory.name.toLowerCase()
        : ''
    },
  },
  methods: {
    visibilityChanged(isVisible: any, entry: any) {
      this.isVisible = isVisible
    },
  },
})
</script>

<style lang="scss" scoped>
.page-types {
  display: flex;

  .page-type {
    padding-bottom: 6px;
    cursor: pointer;
    font-size: 10px;
    line-height: 12px;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.3;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 2px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    &:not(:last-child) {
      margin-right: 40px;
    }

    &.active {
      color: #173bef;
      opacity: 1;

      &:after {
        background: #173bef;
      }
    }
  }
}

.header {
  background-color: #ffffff;
  padding-top: 60px;
  // padding-bottom: 40px;

  &__searchDesktop {
    display: flex;
  }
  &__inner {
    max-width: 1280px;
    padding-right: 20px;
    padding-left: 20px;
    margin-right: auto;
    margin-left: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
@media screen and (max-width: 768px) {
  .header {
    padding-top: 50px;

    &__inner {
      padding-right: 20px;
      padding-left: 20px;
    }
  }
}
@media screen and (max-width: 414px) {
  .header {
    &__inner {
      padding-right: 15px;
      padding-left: 15px;
    }
  }
}
</style>

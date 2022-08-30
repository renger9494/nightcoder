<template>
  <div class="templates-page">
    <div class="templates">
      <templates-header-component
        :currentPageType="currentPageType"
        :pageTypes="pageTypes"
        :categories="categories"
        :searchValue="searchString"
        :onPageTypeClick="setPageType"
        :onSearchChange="changeSearchStringValue"
      />
      <div class="templates__container">
        <templates-list :templates="templates" :categories="categories" />
      </div>
      <pagination
        v-if="totalPages > 1"
        :pageNumber="query.PageNumber"
        :totalPages="totalPages"
        @loadingList="loadingList"
      />
    </div>
    <mobile-alert-modal v-if="visibleModalName === VisibleModalType.MobileAlert" />
    <limit-modal
      v-if="visibleModalName === VisibleModalType.Limit"
      :isVisible="visibleModalName === VisibleModalType.Limit"
    />
    <modal-overlay :isVisible="visibleModalName !== null" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import apiClient, { TemplateQueryFilter } from '@/utils/apiClient'
import { VisibleModalType } from '@/store/ui'
import Pagination from '@/components/Shared/Pagination.vue'
import LimitModal from '@/components/Shared/LimitModal.vue'
//modals
import ModalOverlay from '@/components/Shared/Overlay.vue'
import MobileAlertModal from '@/components/Shared/MobileAlertModal.vue'
import { BaseNameDtoOfInteger, TemplateDto, PageType } from '@/utils/api'
import HTMLElementEvent from '@/utils/types/HTMLElementEvent'

import TemplatesHeaderComponent from '@/components/Templates/Header/Header.vue'
import TemplatesList from '@/components/Templates/TemplatesList/TemplatesList.vue'

let searchTimeout: any = undefined

export default Vue.extend({
  head() {
    return {
      title: 'Templates',
    }
  },
  layout: 'profile',
  components: {
    MobileAlertModal,
    ModalOverlay,
    TemplatesHeaderComponent,
    TemplatesList,
    Pagination,
    LimitModal,
  },
  async asyncData({ route, redirect }) {
    let query = {} as TemplateQueryFilter
    const { params, fullPath } = route
    let filter: any = {
      PageSize: 24,
      PageNumber: 1,
      ...route.query,
    }

    const { data: categories } =
      await apiClient.templates.templatesGetTemplateCategories()

    if (params.tagId) {
      const category = categories.filter(
        (item) => item.name === params.tagId.replace('-', ' ').toUpperCase()
      )[0]
      if (category?.id) {
        query.Categories = [category.id]
      } else {
        return redirect({ name: '404' })
      }
    }
    query.PageNumber = +filter.PageNumber
    query.PageSize = +filter.PageSize
    const { data: templates } = await apiClient.templates.templatesGet(query)
    const { data: pageTypes } =
      await apiClient.templates.templatesGetPageTypes()
    return {
      templates: templates.items,
      categories,
      pageTypes,
      currentPageType: pageTypes[0],
      query,
      totalPages: templates.pagination.totalPages,
    }
  },
  data() {
    return {
      templates: [] as TemplateDto[],
      pageTypes: [] as BaseNameDtoOfInteger[],
      categories: [] as BaseNameDtoOfInteger[],
      searchString: '',
      currentPageType: null as BaseNameDtoOfInteger | null,
      query: { PageNumber: 1 } as TemplateQueryFilter,
      totalPages: 1,
      VisibleModalType,
    }
  },
  computed: {
    ...mapState({
      visibleModalName: (state: any) =>
        <VisibleModalType | null>state.ui.visibleModalName,
    }),
  },
  methods: {
    changeSearchStringValue(event: HTMLElementEvent<HTMLInputElement>) {
      clearTimeout(searchTimeout)

      this.searchString = event.target.value

      searchTimeout = setTimeout(this.filterTemplates, 500)
    },
    setPageType(pageType: BaseNameDtoOfInteger, event: Event) {
      if (event) event.preventDefault()

      if (this.currentPageType == pageType) {
        this.currentPageType = null
      } else {
        this.currentPageType = pageType
      }

      this.filterTemplates()
    },
    filterTemplates() {
      const { tagId } = this.$route.params
      const query: TemplateQueryFilter = {
        PageTypes: this.currentPageType
          ? [<PageType>this.currentPageType.name]
          : [],
      }

      if (tagId) {
        query.Categories = [+tagId]
      }

      if (this.searchString) {
        query.Search = this.searchString
      }

      apiClient.templates
        .templatesGet(query)
        .then(({ data: templates }) => {
          this.templates = templates.items
        })
        .catch((error) => {
          console.error(error)
        })
    },
    loadingList(page: number) {
      this.query.PageNumber = page
      window.scrollTo(0, 0)
      this.changeRouteQuery()
      this.showTemplates()
    },
    changeRouteQuery() {
      if (this.query.PageNumber)
        this.$router.replace({
          query: {
            PageNumber: this.query.PageNumber.toString(),
          },
        })
    },
    showTemplates() {
      apiClient.templates
        .templatesGet(this.query)
        .then(({ data }) => {
          this.templates = data.items
          this.totalPages = data.pagination.totalPages
        })
        .catch((error) => {})
    },
  },
})
</script>

<style lang="scss" scoped>
.templates {
  flex-grow: 1;
  height: auto;
  margin-bottom: 100px;
  &__container {
    background-color: #ffffff;
    max-width: 1280px;
    padding: 0 $margin_page_desktop 50px;
    margin-right: auto;
    margin-left: auto;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      margin: 0 auto;
      height: 1px;
    }
  }
}
@media screen and (max-width: 768px) {
  .templates {
    &__container {
      padding: 0 $margin_page_tablet 40px;
    }
  }
}
@media screen and (max-width: 414px) {
  .templates {
    &__container {
      padding: 0 $margin_page_mobile 40px;
    }
  }
}
</style>

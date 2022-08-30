<template>
  <div class="submissions-table">
    <div class="submissions-table__top">
      <submissions-project-popup
        class="submissions-table__dropdown"
        :selected-projects="selectedProjects"
        :projects="projects"
        @selectedProjectsChange="selectedProjectsChange"
      />
      <submissions-actions-popup
        class="submissions-table__dropdown"
        :selected-action="selectedAction"
        :actions="EmailActions"
        @selectedActionChange="selectedActionChange"
      />
      <label
        class="submissions-table__field"
        :class="{ isInputEntered, isInputFocused }"
        @mouseenter="isInputEntered = true"
        @mouseleave="isInputEntered = false"
      >
        <svg-icon width="16" height="16" name="search" color="#BDC2C7" />
        <input
          @focus="isInputFocused = true"
          @blur="isInputFocused = false"
          class="submissions-table__input"
          v-model="nameToSearch"
          placeholder="Search"
          @input="doDelayedSearch"
        />
        <div
          class="submissions-table__input-clear"
          @click="nameToSearch = ''"
          v-if="nameToSearch.length > 0"
        >
          <svg-icon name="close" width="8" height="8" color="#BDBDBD" />
        </div>
      </label>
    </div>
    <div class="submissions-table__bottom sub-table">
      <div class="sub-table__wrap" v-if="isLoading || !isSearchResultEmpty">
        <div class="sub-table__head">
          <div class="sub-table__col sub-table__col--flex">
            <checkbox :input-value="isAllSelected" @change="allChange" />
            <p
              class="sub-table__head-text sub-table__head-text--first"
              :class="headTextActiveClass(SubmissionsSort.Name)"
              @click="
                setFilter(SubmissionsSort.Name, FilterType.ALPHABETICALLY)
              "
            >
              {{ SubmissionsSort.Name }}
              <svg-icon width="12" height="12" name="sort" color="#BDC2C7" />
            </p>
          </div>
          <div class="sub-table__col">
            <p
              class="sub-table__head-text"
              :class="headTextActiveClass(SubmissionsSort.Email)"
              @click="
                setFilter(SubmissionsSort.Email, FilterType.ALPHABETICALLY)
              "
            >
              {{ SubmissionsSort.Email }}
              <svg-icon width="12" height="12" name="sort" color="#BDC2C7" />
            </p>
          </div>
          <div class="sub-table__col">
            <p
              class="sub-table__head-text"
              :class="headTextActiveClass(SubmissionsSort.ProjectsName)"
              @click="
                setFilter(
                  SubmissionsSort.ProjectsName,
                  FilterType.ALPHABETICALLY
                )
              "
            >
              Projects
              <svg-icon width="12" height="12" name="sort" color="#BDC2C7" />
            </p>
          </div>
          <div class="sub-table__col">
            <p
              class="sub-table__head-text"
              :class="headTextActiveClass(SubmissionsSort.Action)"
              @click="
                setFilter(SubmissionsSort.Action, FilterType.ALPHABETICALLY)
              "
            >
              {{ SubmissionsSort.Action }}
              <svg-icon width="12" height="12" name="sort" color="#BDC2C7" />
            </p>
          </div>
          <div class="sub-table__col">
            <p
              class="sub-table__head-text"
              :class="headTextActiveClass(SubmissionsSort.DateAdded)"
              @click="setFilter(SubmissionsSort.DateAdded, FilterType.DATE)"
            >
              Date Added
              <svg-icon width="12" height="12" name="sort" color="#BDC2C7" />
            </p>
          </div>
          <div class="sub-table__col"></div>
        </div>
        <div class="sub-table__body">
          <template v-if="isLoading">
            <div class="skeleton" v-for="item in 8" :key="`${item}skeleton`">
              <skeleton max-width="100%" height="65" width="100%" radius="4" />
            </div>
          </template>
          <template v-else-if="!isSearchResultEmpty">
            <submissions-table-row
              v-for="(row, rowIndex) in tableData"
              :row-data="row"
              :key="`${rowIndex}_${row.subscriber.alias}`"
              :row-index="rowIndex"
              :id-row="row.id"
              :set-favorite="setFavorite"
              :change-selected="changeSelected"
              :open-row-popup="openRowPopup"
              :close-row-popup="closeRowPopup"
              :is-pro="isPro"
              :open-row-popup-index="openRowPopupIndex"
              :selected-rows="selectedRows"
              :openDeletePopup="openDeletePopup"
            />
          </template>
        </div>
      </div>
      <!--  TODO: setup pagination  -->
      <pagination
        class="sub-table__pagination"
        v-if="totalPages > 1"
        :page-number="pageNumber"
        :total-pages="totalPages"
        @loadingList="onPaginationChange"
      />
      <div
        class="sub-table__empty"
        v-if="!isLoading && (isSubmissionsEmpty || isSearchResultEmpty)"
      >
        <p v-if="isSubmissionsEmpty" class="sub-table__empty-title">
          There are no submissions on this list.
        </p>
        <template v-else-if="isSearchResultEmpty">
          <p class="sub-table__empty-title">
            Sorry, we could not find any results.
          </p>
          <p class="sub-table__empty-text">
            Try another search to find what you're looking for.
          </p>
        </template>
        <img
          class="sub-table__empty-img"
          src="/img/dashboard/empty_state.svg"
          alt="image empty airtap"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import apiClient from '@/utils/apiClient'
import Checkbox from '@/components/Shared/ui/Сheckbox.vue'
import SvgIcon from '@/components/Shared/SvgIcon.vue'
import SubmissionsProjectPopup from './SubmissionsProjectPopup.vue'
import SubmissionsActionsPopup from './SubmissionsActionsPopup.vue'
import Pagination from '@/components/Shared/Pagination.vue'
import SubmissionsTableRow from './SubmissionsTableRow.vue'
import Skeleton from '@/components/Shared/ui/skeleton.vue'
import {
  AccountDto,
  PlanCategory,
  SubmissionDto,
  SubmissionsSort,
  SortingDirection,
  PagedProjectDto,
} from '@/utils/api'

enum FilterType {
  ALPHABETICALLY = 'ALPHABETICALLY',
  DATE = 'DATE',
}

export enum EmailActions {
  FILE = 'File',
  FORM = 'Form',
  LINK = 'Link',
}

export default Vue.extend({
  name: 'SubmissionsTable',
  components: {
    SubmissionsTableRow,
    Pagination,
    SubmissionsProjectPopup,
    SubmissionsActionsPopup,
    SvgIcon,
    Checkbox,
    Skeleton,
  },
  props: {
    user: {
      type: Object as PropType<AccountDto>,
    },
    openDeletePopup: {
      required: true,
      type: Function,
    },
  },

  data() {
    return {
      SubmissionsSort,
      FilterType,
      SortingDirection,
      EmailActions,
      field: null as SubmissionsSort | null,
      direction: null as SortingDirection | null,
      type: null as FilterType | null,
      nameToSearch: '',
      selectedProjects: [] as Array<number>,
      selectedAction: null as EmailActions | null,
      selectedRows: [] as Array<number>,
      isInputEntered: false,
      isInputFocused: false,
      openRowPopupIndex: -1 as number | null,
      tableData: [] as SubmissionDto[],
      isLoading: true,
      pageNumber: 1,
      totalPages: 1,
      isSubmissionsEmpty: true,
      projects: [] as PagedProjectDto[],
      timeout: null as any,
    }
  },
  async mounted() {
    try {
      this.pageNumber = this.$route.query.PageNumber
        ? Number(this.$route.query.PageNumber)
        : 1
      let filter = {
        PageSize: 8,
        PageNumber: this.pageNumber,
      } as any
      if (this.field) {
        filter['Sorting.SortBy'] = this.field
        filter['Sorting.Direction'] = this.direction
      }
      if (this.nameToSearch) filter.Search = this.nameToSearch
      if (this.selectedProjects.length > 0)
        filter.Projects = this.selectedProjects
      const { data: submissions } = await apiClient.submissions.submissionsGet(
        filter
      )
      this.$emit('changeAll', submissions.all)
      this.tableData = submissions.items
      this.totalPages = submissions.pagination.totalPages
      this.isSubmissionsEmpty = this.tableData.length == 0
      const { data } = await apiClient.projects.projectsGetPaged({
        Type: 'Community',
      })
      this.projects = data.items
      this.isLoading = false
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapState({
      category: (state: any) => state.auth.user.plan.category,
      userisAdmin: (state: any) => state.auth.user.isAdmin,
    }),
    isSearchResultEmpty(): boolean {
      return this.tableData.length === 0
    },
    isPro(): boolean {
      return this.category == PlanCategory.Pro || this.userisAdmin
    },
    headTextActiveClass(): any {
      return (field: string) => ({
        active: this.field === field,
        descending:
          this.direction === SortingDirection.Desc && this.field === field,
      })
    },
    isAllSelected(): boolean {
      return this.selectedRows.length === this.tableData.length
    },
  },
  methods: {
    allChange() {
      if (this.selectedRows.length >= this.tableData.length) {
        this.selectedRows = []
      } else {
        this.selectedRows = []
        for (let i = 0; i < this.tableData.length; i++) {
          this.selectedRows.push(i)
        }
      }
      this.$emit('selectedChange', this.selectedRows)
    },
    doDelayedSearch() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.getSubmissions()
      }, 1000)
    },
    changeSelected(itemSelected: number) {
      let indexSelected = this.selectedRows.indexOf(itemSelected)
      indexSelected === -1
        ? this.selectedRows.push(itemSelected)
        : this.selectedRows.splice(indexSelected, 1)
      this.$emit('selectedChange', this.selectedRows)
    },
    setFilter(field: SubmissionsSort, type: FilterType) {
      this.pageNumber = 1
      this.type = type
      if (this.field !== field) {
        this.field = field
        this.direction = SortingDirection.Asc
      } else {
        this.field = field
        if (!this.direction) {
          this.direction = SortingDirection.Asc
        } else if (this.direction === SortingDirection.Asc) {
          this.direction = SortingDirection.Desc
        } else if (this.direction === SortingDirection.Desc) {
          this.direction = null
          this.type = null
          this.field = null
        }
      }
      this.getSubmissions()
    },
    selectedProjectsChange(selectedProjects: Array<number>) {
      this.pageNumber = 1
      this.selectedProjects = selectedProjects
      this.getSubmissions()
    },
    selectedActionChange(selectedAction: EmailActions | null) {
      this.pageNumber = 1
      this.selectedAction = selectedAction
      this.getSubmissions()
    },
    setFavorite(row: SubmissionDto) {
      apiClient.submissions
        .submissionsToggleFavorite(row.id, { isFavorite: !row.isFavorite })
        .then(({ data }) => {
          row.isFavorite = !row.isFavorite
        })
        .catch((error) => {})
      this.openRowPopupIndex = -1
    },
    openRowPopup(index: number) {
      this.openRowPopupIndex = this.openRowPopupIndex === index ? null : index
    },
    onPaginationChange(page: number) {
      this.pageNumber = page
      this.getSubmissions()
    },
    closeRowPopup() {
      this.openRowPopupIndex = -1
    },
    getSubmissions() {
      this.isLoading = true
      let filter = {
        PageSize: 8,
        PageNumber: this.pageNumber,
      } as any
      if (this.field) {
        filter['Sorting.SortBy'] = this.field
        filter['Sorting.Direction'] = this.direction
      }
      if (this.nameToSearch) filter.Search = this.nameToSearch
      if (this.selectedAction) filter.Action = this.selectedAction
      if (this.selectedProjects.length > 0)
        filter.Projects = this.selectedProjects
      apiClient.submissions
        .submissionsGet(filter)
        .then(({ data }) => {
          this.tableData = data.items
          this.totalPages = data.pagination.totalPages
          this.$emit('changeAll', data.all)
          this.isLoading = false
        })
        .catch((error) => {})
    },
  },
})
</script>

<style lang="scss" scoped>
.submissions-table {
  &__top {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 0 0 20px;

    @include bp($sm) {
      align-items: unset;
    }
  }

  &__dropdown {
    width: 250px;
    &:nth-child(1) {
      margin: 0 12px 0 0;
    }
    &:nth-child(2) {
      margin: 0 auto 0 0;
    }

    @include bp(1046px) {
      width: calc(50% - 6px);
    }

    @include bp($sm) {
      margin: 0 0 12px;
    }
  }

  &__field {
    width: 100%;
    max-width: 250px;
    position: relative;
    padding: 8px;
    border: 1px solid $color_input_border;
    border-radius: $shape_border_radius;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.3s;
    overflow: hidden;
    margin: 0 0 0 12px;

    @include bp(1046px) {
      margin: 12px 0 0;
      width: 100%;
      max-width: 100%;
    }

    svg {
      transition: 0.3s;
    }

    &.isInputEntered {
      border-color: $color_input_hover;

      & > svg:first-child {
        transform: translateX(-16px);
        opacity: 0;
      }

      .submissions-table__input {
        transform: translateX(-16px);
      }
    }

    &.isInputFocused {
      border-color: $color_input_focus;

      & > svg:first-child {
        transform: translateX(-16px);
        opacity: 0;
      }

      .submissions-table__input {
        transform: translateX(-16px);
      }
    }

    @include bp($sm) {
      max-width: 100%;
    }
  }

  &__input {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: $black;
    height: 100%;
    transition: 0.3s;

    &::placeholder {
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
      color: $gray700;
    }

    &-clear {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      svg {
        transition: 0.3s;
      }

      &:hover {
        svg {
          color: $black !important;
        }
      }
    }
  }
}

.sub-table {
  width: 100%;

  &__body {
    @include bp($md) {
      width: 1024px;
    }

    @include bp($sm) {
      width: 100%;
    }
  }

  &__pagination {
    margin: 30px 0 0;
  }

  &__empty {
    max-height: calc(100vh - 185px);
    min-height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &-title {
      margin: 0 0 8px;
      font-weight: 400;
      font-size: 25px;
      line-height: 38px;
      font-feature-settings: 'liga' off;
    }

    &-text {
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
    }

    &-img {
      margin: 30px 0 0;
    }
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include bp($md) {
      width: 1024px;
    }

    @include bp($sm) {
      display: none;
    }
  }

  &__wrap {
    &::-webkit-scrollbar {
      height: 4px;
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

    @include bp($md) {
      overflow-x: auto;
    }
  }

  &__head-text {
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: $gray400;
    align-items: center;
    gap: 2px;
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    transition: 0.3s;

    svg {
      transition: 0.3s;
    }

    &:hover {
      color: $gray600;

      svg {
        color: $gray600 !important;
      }
    }

    &.active {
      color: $black;

      svg {
        color: $black !important;
      }
    }

    &.descending {
      svg {
        transform: scale(-1);
      }
    }

    &--first {
      margin: 0 0 0 24px;
    }
  }

  &__col {
    &:nth-child(1) {
      flex: 0 0 calc(20% - 10px);
      max-width: calc(20% - 10px);
      user-select: none;
    }

    &:nth-child(2) {
      flex: 0 0 calc(30% - 10px);
      max-width: calc(30% - 10px);
    }

    &:nth-child(3) {
      flex: 0 0 calc(15% - 10px);
      max-width: calc(15% - 10px);
    }

    &:nth-child(4) {
      flex: 0 0 calc(15% - 10px);
      max-width: calc(15% - 10px);
    }

    &:nth-child(5) {
      flex: 0 0 calc(20% - 24px);
      max-width: calc(20% - 24px);
    }

    &:nth-child(6) {
      flex: 0 0 24px;
      max-width: 24px;
    }

    &--flex {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &--relative {
      position: relative;
    }
  }
}

.skeleton {
  display: flex;
  width: 100%;
  &:first-child {
    margin: 10px 0;
  }
  &:not(:last-child) {
    margin: 0 0 8px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

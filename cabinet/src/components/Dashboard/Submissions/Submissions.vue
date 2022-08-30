<template>
  <div class="submissions">
    <div class="submissions__top">
      <h2 class="submissions__title">Submissions</h2>
      <div class="submissions__action">
        <div class="submissions__info">
          <svg-icon width="16" height="16" name="Submission" color="#333" />
          <span>{{ totalSubmissions }}/{{ submissionsLimit }} Submissions</span>
          <svg-icon width="14" height="14" name="question" color="#000" />
          <submissions-info-dropdown class="submissions__info-popup" />
        </div>
        <div class="submissions__download-btn" @click="exportCSV">
          Download CSV
        </div>
        <submissions-delete-dropdown
          :count="selectedItems.length"
          :is-pro="isPro"
          :open-delete-popup="openDeletePopup"
        />
      </div>
    </div>
    <div class="submissions__bottom">
      <submissions-table
        :user="user"
        :open-delete-popup="openDeletePopup"
        @changeAll="changeAll"
        @selectedChange="selectedChange"
      />
    </div>
    <submissions-delete-popup
      :is-visible="visibleModalName === VisibleModalType.SubmissionsDelete"
      :count="submissionsDelete.length"
      :submissionsDelete="submissionsDelete"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import apiClient from '@/utils/apiClient'
import SubmissionsTable from './SubmissionsTable.vue'
import SubmissionsDeletePopup from './SubmissionsDeletePopup.vue'
import SubmissionsDeleteDropdown from './SubmissionsDeleteDropdown.vue'
import SubmissionsInfoDropdown from './SubmissionsInfoDropdown.vue'
import SvgIcon from '@/components/Shared/SvgIcon.vue'
import { AccountDto, PlanCategory, SubmissionDto } from '@/utils/api'
import { VisibleModalType } from '@/store/ui'
// import SubmissionsDownloadDropdown from './SubmissionsDownloadDropdown.vue';

export default Vue.extend({
  name: 'Submissions',
  components: {
    SubmissionsInfoDropdown,
    SubmissionsDeleteDropdown,
    SubmissionsDeletePopup,
    SvgIcon,
    SubmissionsTable,
    // SubmissionsDownloadDropdown,
  },
  props: {
    user: {
      type: Object as PropType<AccountDto>,
    },
  },
  data() {
    return {
      VisibleModalType,
      totalSubmissions: 0,
      selectedItems: [] as Array<number>,
      submissionsDelete: [] as Array<number>,
    }
  },

  methods: {
    openDeletePopup(isAll: boolean, row?: SubmissionDto) {
      this.submissionsDelete = []
      if (row) this.submissionsDelete.push(row.id)
      else if (!isAll) {
        if (this.selectedItems == []) return
        this.submissionsDelete = this.selectedItems
      }
      this.$store.commit(
        'ui/changeVisibleModalName',
        VisibleModalType.SubmissionsDelete
      )
    },
    selectedChange(items: Array<number>) {
      this.selectedItems = items
    },
    changeAll(count: number) {
      this.totalSubmissions = count
    },
    exportCSV() {
      // if (this.selectedItems == []) return
      let filter = {} as any
      if (this.selectedItems.length > 0) filter.submissions = this.selectedItems
      apiClient.submissions
        .submissionsExportToCsv(filter)
        .then((response) => {
          let blob = new Blob([response.data as any])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = response.headers['content-disposition']
            .split(';')[1]
            .split('filename=')[1]
          link.click()
        })
        .catch((error) => {})
    },
  },
  computed: {
    ...mapState({
      visibleModalName: (state: any) => state.ui.visibleModalName,
      category: (state: any) => state.auth.user.plan.category,
    }),
    isPro(): boolean {
      return this.category == PlanCategory.Pro
    },
    submissionsLimit(): string {
      return this.user.isAdmin
        ? '∞'
        : this.user.plan.features.submissions.toString()
    },
  },
})
</script>

<style lang="scss" scoped>
.submissions {
  padding: 30px 0;
  height: 100%;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin: 0 0 30px;

    @include bp($sm) {
      margin: 0 0 12px;
    }
  }

  &__title {
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
    font-feature-settings: 'liga' off;

    @include bp(920px) {
      width: 100%;
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      font-feature-settings: 'liga' off;
      margin: 0 0 12px;
    }
  }

  &__action,
  &__info {
    display: flex;
    align-items: center;
  }

  &__download-btn {
    padding: 7px 16px;
    border: 1px solid $gray200;
    border-radius: $shape_border_radius;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    font-feature-settings: 'liga' off;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      border-color: $gray400;
    }
  }

  &__action {
    gap: 12px;

    @include bp($sm) {
      gap: 10px;
    }
  }

  &__info {
    padding: 8px 16px;
    gap: 4px;
    color: $gray900;
    background: $gray100;
    border-radius: $shape_border_radius;
    position: relative;

    &-popup {
      opacity: 0;
      visibility: hidden;
      position: absolute;
      right: 0;
      bottom: -5px;
      z-index: 20;
      transform: translate(0, 100%);
      width: 347px;
      transition: 0.3s;
    }

    svg {
      transition: 0.3s;
    }

    &:hover {
      .submissions__info-popup {
        visibility: visible;
        opacity: 1;
      }
    }

    span {
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
    }

    @include bp($sm) {
      padding: 9px 12px;

      span {
        font-size: 10px;
        line-height: 16px;
      }
    }
  }
}
</style>

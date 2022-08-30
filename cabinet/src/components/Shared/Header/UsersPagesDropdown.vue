<template>
  <div class="edit-dropdown" v-if="isUsersPagesDropdownVisible">
    <div class="edit-dropdown__head">
      <div class="edit-dropdown__title">
        Pages<span class="edit-dropdown__count">{{ pagesCount }}</span>
      </div>
      <div class="edit-dropdown__close">
        <close-icon />
      </div>
    </div>
    <div class="edit-dropdown__content">
      <a class="edit-dropdown__add-btn" @click="redirectToTemplatesPage(projectPages[0])">
        <PlusIcon />
        <span>Add New Page</span>
      </a>
      <div
        class="edit-dropdown-item"
        v-for="(projectPage, index) in projectPages"
        :key="index"
        :class="isSelected(projectPage) ? 'selected' : 'not_selected'"
      >
        <div class="edit-dropdown-item__title">{{ projectPage.name }}</div>
        <div class="edit-dropdown-item__content">
          <a class="edit-dropdown-item__preview-wrap" :href="editorUrl(projectPage)">
            <picture v-if="projectPage.previewImage">
              <source
                v-if="projectPage.previewImage.fullPathWebP"
                type="image/webp"
                :srcset="projectPage.previewImage.fullPathWebP.replace(' ', '%20')"
              />
              <source
                v-if="projectPage.previewImage.fullPathJp2"
                type="image/jp2"
                :srcset="projectPage.previewImage.fullPathJp2.replace(' ', '%20')"
              />
              <img class="edit-dropdown-item__preview" :src="projectPage.previewImage.fullPath" alt="airtap" />
            </picture>
            <img class="edit-dropdown-item__preview" v-else src="/img/projects/placeholder.svg" alt="" />
            <project-frame />
          </a>
          <div class="edit-dropdown-item__toolbar">
            <a class="edit-dropdown-item__btn" href="#" @click="openSiteSettings(projectPage)">
              <gears />
            </a>
            <a class="edit-dropdown-item__btn" href="#" @click="dublicatePage(projectPage)">
              <duplicate />
            </a>
            <a
              class="edit-dropdown-item__btn"
              @click="deletePage(projectPage)"
              :class="projectPage.isHomePage ? 'disable' : ''"
              href="#"
            >
              <delete-icon />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { createEditorPageUrl, getCabinetUrl } from '@/utils/http'
import CloseIcon from '@/assets/icons/close.svg?inline'
import ProjectFrame from '@/assets/icons/project_frame.svg?inline'
import Duplicate from '@/assets/icons/duplicate.svg?inline'
import DeleteIcon from '@/assets/icons/delete_icon.svg?inline'
import Gears from '@/assets/icons/gears.svg?inline'
import PlusIcon from '@/components/Header/Svg/Plus.vue'
import { BaseProjectPageDto, AccountDto } from '@/utils/api'
import { VisibleModalType } from '@/store/ui'

export default Vue.extend({
  components: {
    CloseIcon,
    ProjectFrame,
    Duplicate,
    DeleteIcon,
    Gears,
    PlusIcon,
  },
  props: {
    isUsersSitesDropdownVisible: {
      type: Boolean,
    },
    isUsersPagesDropdownVisible: {
      type: Boolean,
    },
    projectPages: {
      type: Array as PropType<BaseProjectPageDto[]>,
    },
    hideEditDropdown: {
      type: Function,
    },
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
    }),
    isPagesLimit(): boolean {
      if (this.user.isAdmin) return false

      return this.projectPages.length >= this.user.plan.features.projectPages
    },
    pagesCount(): number {
      return this.projectPages ? this.projectPages.length : 0
    },
  },
  methods: {
    editorUrl(page: BaseProjectPageDto): string {
      const { projectId, id } = page
      return createEditorPageUrl(projectId, id)
    },
    dublicatePage(page: BaseProjectPageDto) {
      this.$store.dispatch('project/duplicatePage', page)
    },
    deletePage(page: BaseProjectPageDto) {
      this.$store.dispatch('project/deletePage', {
        pageId: page.id,
        projectId: page.projectId,
      })
    },
    openSiteSettings(page: BaseProjectPageDto) {
      const { dispatch } = this.$store
      const { projectId, id } = page

      dispatch('siteSettings/loadModalData', { projectId, pageId: id })

      dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: VisibleModalType.SiteSettings,
      })

      this.hideEditDropdown()
    },
    isSelected(page: BaseProjectPageDto): boolean {
      return +this.$route.params.pageId == page.id
    },
    redirectToTemplatesPage(page: BaseProjectPageDto) {
      const { projectId } = page
      if (!this.isPagesLimit) {
        window.location.href = `${getCabinetUrl()}/projects/${projectId}/templates`
        return
      }
      this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
    },
  },
})
</script>

<style lang="scss" scoped></style>

<template>
  <div class="edit-dropdown" v-if="isUsersSitesDropdownVisible">
    <div class="edit-dropdown__head">
      <div class="edit-dropdown__title">Your Sites</div>
      <div class="edit-dropdown__close">
        <CloseIcon />
      </div>
    </div>
    <div class="edit-dropdown__content">
      <a class="edit-dropdown__add-btn" @click="redirectToTemplatesPage">
        <PlusIcon />
        <span>Add New Site</span>
      </a>
      <div
        class="edit-dropdown-item"
        v-for="(project, index) in projects"
        :key="index"
        :class="isSelected(project) ? 'selected' : 'not_selected'"
      >
        <div class="edit-dropdown-item__title">{{ project.name }}</div>
        <div class="edit-dropdown-item__content">
          <div
            class="edit-dropdown-item__preview-wrap"
            @click="changeProjectToEdit(project)"
          >
            <picture v-if="project.previewImage">
              <source
                v-if="project.previewImage.fullPathWebP"
                type="image/webp"
                :srcset="project.previewImage.fullPathWebP.replace(' ', '%20')"
              />
              <source
                v-if="project.previewImage.fullPathJp2"
                type="image/jp2"
                :srcset="project.previewImage.fullPathJp2.replace(' ', '%20')"
              />
              <img
                class="edit-dropdown-item__preview"
                :src="project.previewImage.fullPath"
              />
            </picture>

            <img
              class="edit-dropdown-item__preview"
              v-else
              :src="getPlaceholderUrl()"
            />
            <ImageBorderIcon />
          </div>
          <div class="edit-dropdown-item__toolbar">
            <a
              class="edit-dropdown-item__btn settings"
              @click="openSiteSettings(project.id)"
            >
              <SettingsIcon />
            </a>
            <a
              class="edit-dropdown-item__btn"
              @click="duplicateProject(project.id)"
            >
              <DuplicateIcon />
            </a>
            <a
              class="edit-dropdown-item__btn"
              @click="openDeleteProjectConfirmation(project)"
            >
              <TrashIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { getCabinetUrl, createEditorPageUrl } from '@/utils/http'
import apiClient from '@/utils/apiClient'
import { mapState } from 'vuex'

import PlusIcon from '@/components/Header/Svg/Plus.vue'
import CloseIcon from '@/assets/icons/close.svg?inline'
import DuplicateIcon from '@/components/Header/Svg/Duplicate.vue'
import SettingsIcon from '@/components/Header/Svg/Settings.vue'
import TrashIcon from '@/components/Header/Svg/Trash.vue'
import ImageBorderIcon from '@/components/Header/Svg/ImageBorder.vue'
import { DeleteModalData, DeleteModalMode } from '@/store/project'
import { BaseProjectDto, AccountDto } from '@/utils/api'
import { VisibleModalType } from '@/store/ui'
import {getPlaceholderUrl} from '@/utils/images'
export default Vue.extend({
  components: {
    PlusIcon,
    CloseIcon,
    DuplicateIcon,
    SettingsIcon,
    TrashIcon,
    ImageBorderIcon,
  },
  props: {
    hideEditDropdown: {
      type: Function,
    },
    isUsersSitesDropdownVisible: {
      type: Boolean,
    },
    isUsersPagesDropdownVisible: {
      type: Boolean,
    },
    selectedProject: {
      type: Object,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      projects: (state: any) => <BaseProjectDto[]>state.project.projects,
    }),
    isProjectsLimit(): boolean {
      if (this.user.isAdmin) return false

      return this.projects.length >= this.user.plan.features.draftProjects
    },
    routeName(): string | null | undefined {
      return this.$route.name
    },
 
  },
  methods: {
   getPlaceholderUrl(){
      return getPlaceholderUrl()
    },
    changeProjectToEdit(project: { id: number }) {
      if (this.routeName == 'pages') {
        this.$router.push(`/project/${project.id}`)
        return
      }

      apiClient.projectPages
        .projectPagesGet(project.id)
        .then(({ data }) => {
          this.$store.commit('project/changeProjectPages', data)
          return data
        })
        .then((data) => {
          let currentPage = data.find((x) => x.isHomePage)
          if (!currentPage) currentPage = data[0]
          location.href = createEditorPageUrl(project.id, currentPage.id)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    redirectToTemplatesPage() {
      if (!this.isProjectsLimit) {
        window.location.href = `${getCabinetUrl()}/templates`
        return
      }
      this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
    },
    openSiteSettings(projectId: number) {
      const { dispatch } = this.$store

      dispatch('siteSettings/loadModalData', { projectId })

      dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: VisibleModalType.SiteSettings,
      })

      this.hideEditDropdown()
    },
    openDeleteProjectConfirmation(project: BaseProjectDto) {
      const deleteModalData: DeleteModalData = {
        type: DeleteModalMode.Project,
        projectId: project.id,
        name: project.name,
        actionAfterDelete: () => {
          if (+this.$route.params.projectId == project.id) {
            location.href = `${getCabinetUrl()}/projects`
            this.$store.commit('editor/SET_USER_CONFIG_FROM_LOCAL', null)
          }
        },
      }
      this.$store.commit('project/changeDeleteModalData', deleteModalData)

      this.$store.dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: VisibleModalType.DeleteProjectConfirmation,
      })
    },
    duplicateProject(projectId: number) {
      !this.isProjectsLimit
        ? this.$store.dispatch('project/duplicateProject', projectId)
        : this.$store.commit(
            'ui/changeVisibleModalName',
            VisibleModalType.Limit
          )
    },
    isSelected(project: { id: number }) {
      return +this.$route.params.projectId == project.id
    },
  },
})
</script>

<style lang="scss">
.edit-dropdown {
  position: absolute;
  width: 274px;
  left: -1px;
  top: calc(100% + 23px);
  background: #ffffff;
  box-shadow: $shadow_small;
  border-radius: 8px;
  overflow: hidden;
  cursor: default;
  &__head {
    width: 100%;
    border-bottom: 1px solid #f2f2f2;
    padding: 14px 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__title {
    font-size: 18px;
    line-height: 21px;
    color: #000000;
    display: flex;
    align-items: center;
  }
  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: #f2f2f2;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.3s ease;
    svg {
      top: 0;
    }
    &:hover {
      background: #828282;
      path {
        fill: #fff;
      }
    }
    &:active {
      background: #333333;
      path {
        fill: #fff;
      }
    }
  }
  & &__count {
    background: #4256be;
    border-radius: 8px;
    padding: 3px 6px 2px;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    color: #ffffff;
    margin-left: 14px;
  }
  &__content {
    padding: 20px 26px 26px;
    max-height: 483px;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 2px;
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
  }
  &__add-btn {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    svg {
      margin-right: 8px;
      path {
        transition: 0.3s;
      }
    }
    span {
      transition: 0.3s;
      font-size: 14px;
      line-height: 17px;
      color: #949cad;
      max-width: 94px;
    }
    &:hover {
      span {
        color: #4356be;
      }
      path {
        fill: #4356be;
      }
    }
  }
}

.edit-dropdown-item {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
  &__title {
    font-size: 13px;
    line-height: 15px;
    color: #af653d;
    margin-bottom: 8px;
  }
  &__preview-wrap {
    width: 120px;
    height: 70px;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    svg {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      path:not(.br) {
        opacity: 0;
      }
      path {
        transition: 0.3s ease;
      }
    }
    &:hover {
      svg {
        path.br {
          fill: #318bf5;
        }
        path:not(.br) {
          opacity: 1;
        }
      }
    }
  }
  &.selected {
    .edit-dropdown-item__preview-wrap {
      position: relative;
      cursor: auto;
      svg {
        path.br {
          fill: #318bf5;
        }
        path:not(.br) {
          opacity: 1;
        }
      }
    }
  }
  &__preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 130px);
  }
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid #bdc2c7;
    box-sizing: border-box;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s all ease;
    &.disable {
      opacity: 0.2;
      pointer-events: none;
    }
    path {
      transition: 0.3s all ease;
    }
    &:hover {
      border-color: #000;
      background: #f2f2f2;
      path {
        fill: #000;
      }
    }
    &:focus {
      background: #f2f2f2;
    }
  }
}
</style>

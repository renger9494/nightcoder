<template>
  <div class="edit-dropdown" v-if="isUsersPagesDropdownVisible">
    <div class="edit-dropdown__head">
      <div class="edit-dropdown__title">
        Pages<span class="edit-dropdown__count">{{ pagesCount }}</span>
      </div>
      <div class="edit-dropdown__close">
        <svg-icon name="close" width="8" height="8" color="#BDBDBD"/>
      </div>
    </div>
    <div class="edit-dropdown__content">
      <a class="edit-dropdown__add-btn" @click="redirectToTemplatesPage(projectPages[0])">
        <svg-icon name="plus-icon" width="24" height="24" color="#949CAD"/>
        <span>Add Page</span>
      </a>
      <div
        class="edit-dropdown-item"
        v-for="(projectPage, index) in projectPages"
        :key="index"
        :class="isSelected(projectPage) ? 'selected' : 'not_selected'"
      >
        <a class="edit-dropdown-item__content" :href="editorUrl(projectPage)">
          <div class="edit-dropdown-item__preview-wrap">
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
              <img class="edit-dropdown-item__preview" :src="projectPage.previewImage.fullPath"/>
            </picture>
            <img class="edit-dropdown-item__preview" v-else :src="placeholder" alt=""/>
          </div>
          <div class="edit-dropdown-item__right">
            <div class="edit-dropdown-item__title">
              <svg-icon v-if="projectPage.isHomePage" name="home-page-icon" width="16" height="16" color="#000"/>
              <span>{{ projectPage.name }}</span>
            </div>
            <a
              class="edit-dropdown-item__link"
              :class="{ published: projectPage.isPublished }"
              :href="projectPage.isPublished ? `//${pageLink(projectPage)}` : null"
              target="_blank"
            >
              {{ projectPage.isPublished ? pageLink(projectPage) : 'Not published' }}
            </a>
            <div class="edit-dropdown-item__toolbar">
              <a
                class="edit-dropdown-item__btn"
                href="#"
                @click.prevent.stop="openSiteSettings(projectPage)"
                v-tooltip="'Settings'"
              >
                <svg-icon name="setting-icon" width="12" height="12" color="#000"/>
              </a>
              <a
                class="edit-dropdown-item__btn"
                href="#"
                @click.prevent.stop="dublicatePage(projectPage)"
                v-tooltip="'Duplicate'"
              >
                <svg-icon name="duplicate" width="12" height="12" color="#000"/>
              </a>
              <a
                class="edit-dropdown-item__btn"
                @click.prevent.stop="deletePage(projectPage)"
                :class="projectPage.isHomePage ? 'disable' : ''"
                href="#"
                v-tooltip="'Delete'"
              >
                <svg-icon name="delete" width="12" height="14" color="#000"/>
              </a>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapState} from 'vuex';
import {createEditorPageUrl, getCabinetUrl} from '@/utils/http';
import {BaseProjectPageDto, AccountDto, BaseProjectDto, ProjectSettingsDto} from '@/utils/api';
import {VisibleModalType} from '@/store/ui';

export default Vue.extend({
  props: {
    isUsersSitesDropdownVisible: {
      type: Boolean
    },
    isUsersPagesDropdownVisible: {
      type: Boolean
    },
    projectPages: {
      type: Array as PropType<BaseProjectPageDto[]>
    },
    hideEditDropdown: {
      type: Function
    },
    selectedProject: {
      required: true,
      type: Object as PropType<BaseProjectDto>
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user
    }),
    isPagesLimit(): boolean {
      if (this.user.isAdmin) return false;

      return this.projectPages.length >= this.user.plan.features.projectPages;
    },
    pagesCount(): number {
      return this.projectPages ? this.projectPages.length : 0;
    },
    placeholder() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/placeholder.svg';
    },
    projectSettings(): ProjectSettingsDto {
      return this.selectedProject.settings
    },
    isCustomDomainSet(): boolean {
      return !!this.projectSettings.customDomain;
    }
  },
  methods: {
    editorUrl(page: BaseProjectPageDto): string {
      const {projectId, id} = page;
      return createEditorPageUrl(projectId, id);
    },
    dublicatePage(page: BaseProjectPageDto) {
      this.$store.dispatch('project/duplicatePage', page).then(() => {
        this.$emit('showNotification', 'Page');
      });
    },
    deletePage(page: BaseProjectPageDto) {
      const projectPages = this.projectPages.filter(item => item.id !== page.id);
      this.$store
        .dispatch('project/deletePage', {
          pageId: page.id,
          projectId: page.projectId
        })
        .then(() => {
          if (!projectPages.length) {
            location.href = `${getCabinetUrl()}/dashboard/projects/${page.projectId}/pages`;
          } else {
            location.href = createEditorPageUrl(projectPages[0].projectId, projectPages[0].id);
          }
        })
        .catch(() => {
          console.log('something went wrong');
        });
    },
    openSiteSettings(page: BaseProjectPageDto) {
      const {dispatch} = this.$store;
      const {projectId, id} = page;

      dispatch('siteSettings/loadModalData', {projectId, pageId: id});

      dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: VisibleModalType.SiteSettings
      });

      this.hideEditDropdown();
    },
    isSelected(page: BaseProjectPageDto): boolean {
      return +this.$route.params.pageId == page.id;
    },
    redirectToTemplatesPage(page: BaseProjectPageDto) {
      const {projectId} = page;
      if (!this.isPagesLimit) {
        window.location.href = `${getCabinetUrl()}/projects/${projectId}/templates`;
        return;
      }
      this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit);
    },
    isHomePage(projectPage: BaseProjectPageDto): boolean {
      return projectPage.isHomePage;
    },
    domain(): string {
      return process.env.VUE_APP_AIRTAP_DOMAIN;
    },
    airtapDomainUrl(projectPage: BaseProjectPageDto): string {
      if (this.isHomePage(projectPage)) return `${this.domain()}/w/${this.projectSettings.airtapDomain}`;
      return `${this.domain()}/w/${this.projectSettings.airtapDomain}/${projectPage.url}`;
    },
    customDomainUrl(projectPage: BaseProjectPageDto): string {
      if (this.isHomePage(projectPage)) return `${this.projectSettings.customDomain}`;
      return `${this.projectSettings.customDomain}/${projectPage.url}`;
    },
    pageLink(projectPage: BaseProjectPageDto): string {
      return this.isCustomDomainSet ? this.customDomainUrl(projectPage) : this.airtapDomainUrl(projectPage);
    }
  }
});
</script>

<style lang="scss" scoped>
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
    padding: 16px 16px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
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
      transition: 0.3s;
    }

    &:hover {
      svg {
        color: $black!important;
      }
    }
  }

  & &__count {
    background: #4256be;
    border-radius: 16px;
    padding: 4px 11px;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    color: #ffffff;
    margin-left: 8px;
  }

  &__content {
    padding: 16px 8px;
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
    margin: 0 8px 8px;
    cursor: pointer;
    padding: 5px;
    transition: all 0.3s ease;
    border-radius: $shape_border_radius;
    width: 138px;

    svg {
      margin-right: 8px;
      transition: 0.3s;
    }

    span {
      transition: 0.3s;
      font-size: 14px;
      line-height: 17px;
      color: #949cad;
      max-width: 100px;
    }

    &:hover {
      background: $gray100;

      span {
        color: #4356be;
      }

      svg {
        color: #4356be !important;
      }
    }
  }
}

.edit-dropdown-item {
  padding: 8px;
  border-radius: $shape_border_radius;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    background: rgba($gray100, 0.5);
  }

  &:last-child {
    margin-bottom: 0;
  }

  &.selected {
    background: $gray100;

    .edit-dropdown-item__preview-wrap {
      border-color: transparent;
      position: relative;
      cursor: auto;
    }
  }

  &__link {
    font-weight: 400;
    font-size: 10px;
    line-height: 10px;
    margin: 0 0 8px;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 129px;
    white-space: nowrap;
    color: $gray600;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: 0.3s;

    &.published {
      color: #173BEF;

      &:hover {
        border-bottom-color: #173BEF;
      }
    }
  }

  &__title {
    font-size: 15px;
    line-height: 18px;
    margin: 0 0 4px;
    width: 129px;
    display: flex;
    align-items: center;

    svg {
      margin: 0 4px 0 0;
      flex: 0 0 16px;
    }

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      flex: 0 0 calc(100% - 20px);
      color: $black;
      text-decoration: none !important;
    }
  }

  &__preview-wrap {
    width: 100px;
    height: 70px;
    flex: 0 0 100px;
    box-sizing: border-box;
    border: 1px solid #F3F3F3;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    background: $white;

    svg {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;

      path:not(.br) {
        opacity: 0;
      }

      path {
        transition: 0.3s ease;
      }
    }
  }

  &__right {
    flex: 0 0 calc(100% - 108px);
    display: flex;
    flex-direction: column;
  }

  &__preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
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
    background: $white;

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

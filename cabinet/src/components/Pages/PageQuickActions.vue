<template>
  <div
    class="quick-actions"
    :class="{ 'quick-actions_open-dropdown': isDropdownVisible }"
  >
    <span class="quick-actions__button" @click="toggleDropdown">
      <dots-icon class="quick-actions__button-icon" />
    </span>
    <div class="quick-actions__dropdown">
      <!-- <a
        class="quick-actions__dropdown-item"
        :href="page.isPublished ? pageLink : null"
        target="_blank"
        :class="{ 'quick-actions__dropdown-item--disabled': !page.isPublished }"
      >
        <EyeSvg />
        <span> View Live Page</span>
        <div class="quick-actions__dropdown-label" v-if="!page.isPublished">
          Page/Site not published yet
        </div>
      </a> -->
      <a
        class="quick-actions__dropdown-item"
        href="#"
        @click="openSiteSettings"
      >
        <SettingsSvg />
        <span> Page Settings</span>
      </a>
      <!--   Publish in cabinet is temporarily commented since it takes to much time and its related with global changes in
             case if we decide to implement publish functionality in cabinet we need to create separate store module to handle
             popup changes in both cabinet and editor -->
      <!--      <a class="quick-actions__dropdown-item" href="#" @click="publishPage">-->
      <!--        <PublishSvg />-->
      <!--        <span> Publish</span>-->
      <!--      </a>-->
      <a class="quick-actions__dropdown-item" href="#" @click="copyLink">
        <LinkSvg />
        <span> Copy Link</span>
      </a>
      <a class="quick-actions__dropdown-item" href="#" @click="editPageName">
        <pencil-icon />
        <span> Rename </span>
      </a>
      <a class="quick-actions__dropdown-item" href="#" @click="duplicate">
        <DuplicateSvg />
        <span> Duplicate Page </span>
      </a>
      <a
        class="quick-actions__dropdown-item"
        href="#"
        v-if="!isLastPage && !page.isHomePage"
        @click="deletePage"
      >
        <TrashSvg />
        <span> Delete Page </span>
      </a>
      <a class="quick-actions__dropdown-item" href="#" @click="unpublishPage">
        <svg-icon
          width="12"
          height="10"
          :name="isPublished ? 'icon-password' : 'icon-password-open'"
        />
        <span>{{ isPublished ? 'Unpublish' : 'Publish' }}</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import DotsIcon from '@/assets/icons/dots.svg?inline'
import PencilIcon from '@/assets/icons/pencil_rename.svg?inline'

import DuplicateSvg from '@/components/Pages/Svg/DuplicateSvg.vue'
import EyeSvg from '@/components/Pages/Svg/EyeSvg.vue'
import LinkSvg from '@/components/Pages/Svg/LinkSvg.vue'
import SettingsSvg from '@/components/Pages/Svg/SettingsSvg.vue'
import TrashSvg from '@/components/Pages/Svg/TrashSvg.vue'
import PublishSvg from '@/components/Pages/Svg/PublishSvg.vue'

import { BaseProjectPageDto } from '@/utils/api'
import { DeleteModalData, DeleteModalMode } from '@/store/project'
import { VisibleModalType } from '@/store/ui'

export default Vue.extend({
  props: {
    isPublished: {
      type: Boolean,
      default: false,
    },
    isDropdownVisible: Boolean,
    toggleDropdown: Function,
    openSiteSettings: Function,
    editPageName: Function,
    page: Object as PropType<BaseProjectPageDto>,
    copyLink: Function,
    pageLink: String,
    publishPage: Function,
    isLastPage: Boolean,
    unpublishPage: Function,
    duplicate: Function
  },
  components: {
    DotsIcon,
    PencilIcon,
    DuplicateSvg,
    EyeSvg,
    LinkSvg,
    SettingsSvg,
    TrashSvg,
    PublishSvg,
  },
  methods: {
    deletePage() {
      //TODO: if it is home page and not last page then disable button
      //and show message to user that they cannot delete home page and they should move to project settings
      //I just hide delete button for home page now
      const deleteModalData: DeleteModalData = {
        type: DeleteModalMode.Page,
        pageId: this.page.id,
        projectId: this.page.projectId,
        name: this.page.name,
        actionAfterDelete: () => {
          if (this.isLastPage) {
            location.href = '/dashboard'
            return
          }
        },
      }
      this.$store.commit('project/changeDeleteModalData', deleteModalData)
      this.$store.dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: VisibleModalType.DeleteProjectConfirmation,
      })
    }
  },
})
</script>

<style lang="scss" scoped>
.quick-actions {
  position: absolute;
  bottom: 20px;
  right: 20px;
  text-align: right;
  z-index: 3;

  &_open-dropdown {
    .quick-actions {
      &__button {
        transform: none;
        opacity: 1;
        visibility: visible;
        background: #ffffff;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
        border-radius: $shape_border_radius;
      }

      &__dropdown {
        transform: translateY(0) scale3d(1, 1, 1);
        opacity: 1;
        visibility: visible;
        z-index: 1;
      }
    }
  }

  &__button {
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 400;
    text-decoration: none;
    color: #000000;
    background: #ffffff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #ebebeb;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    padding-top: 4px;
    padding-right: 10px;
    padding-bottom: 4px;
    padding-left: 10px;
    transform: translateY(2px);
    opacity: 0;
    transition: background-color 0.3s, transform 0.2s ease, opacity 0.3s ease;
    cursor: pointer;

    &:hover {
      background: #ebebeb;
    }
  }

  &__button-icon {
    width: 10px;
    fill: #000;
  }

  &__dropdown {
    position: absolute;
    bottom: 40px;
    right: -15px;
    width: 150px;
    text-align: left;
    background-color: #ffffff;
    border-radius: $shape_border_radius;
    box-shadow: 0 10px 20px 0 rgba(9, 9, 9, 0.15);
    padding-top: 10px;
    padding-right: 5px;
    padding-bottom: 10px;
    padding-left: 5px;
    transform: translateY(-4px) scale3d(0.95, 0.95, 0.95);
    opacity: 0;
    transition: transform 0.2s, opacity 0.15s;
    visibility: hidden;
  }

  &__dropdown-label {
    position: absolute;
    top: -23px;
    right: -54px;
    padding: 4px 6px;
    background: #333333;
    box-shadow: 0 4px 20px rgba(130, 130, 130, 0.2);
    border-radius: 4px;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0;
    color: #ffffff;
    opacity: 0;
    transition: 0.3s;
  }

  &__dropdown-item {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: black;
    border-radius: $shape_border_radius;
    padding-top: 5px;
    padding-right: 10px;
    padding-bottom: 4px;
    padding-left: 10px;
    margin-bottom: 5px;
    transition: 0.3s;
    position: relative;

    &--disabled {
      cursor: not-allowed;

      svg,
      path,
      span {
        opacity: 0.5;
      }
    }

    &:hover {
      background-color: #f2f2f2;

      .quick-actions__dropdown-label {
        opacity: 1;
      }

      svg,
      path {
        fill: #000000;
      }

      span {
        color: #000000;
      }
    }

    &:active {
      background-color: #dadada;

      svg,
      path {
        fill: #000000;
      }

      span {
        color: #000000;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    svg {
      width: 12px;
      margin-right: 8px;
      transition: 0.3s;
    }

    span {
      font-size: 13px;
      font-weight: 400;
      color: #333333;
      transition: 0.3s;
    }
  }
}
</style>

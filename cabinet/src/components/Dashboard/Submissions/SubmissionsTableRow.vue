<template>
  <div class="submissions-row" :class="{ isRowOpen }" @click="openRow">
    <div class="submissions-row__col submissions-row__col--flex">
      <div
        class="submissions-row__mobile-btn"
        @click.stop="isRowOpen = !isRowOpen"
        :class="{ isRowOpen }"
      >
        <svg-icon name="vectorDown" width="8" height="5" color="#000" />
      </div>
      <checkbox
        :input-value="selectedRows.includes(idRow)"
        @change="changeSelected(idRow)"
      />
      <div class="submissions-row__star" @click="setFavorite(rowData)">
        <svg-icon
          v-if="!rowData.isFavorite"
          width="16"
          height="16"
          name="submissions_star"
          color="#dadada"
        />
        <svg-icon
          v-else
          width="16"
          height="16"
          name="submissions_star_filled"
          color="#FFC557"
        />
      </div>
      <p class="submissions-row__name-mob">Name</p>
      <div class="submissions-row__person-row">
        <a
          class="submissions-row__pp"
          :href="`/${rowData.subscriber.alias}`"
          target="_blank"
        >
          <picture v-if="rowData.subscriber.avatar">
            <source
              v-if="rowData.subscriber.avatar.fullPathWebP"
              type="image/webp"
              :srcset="
                rowData.subscriber.avatar.fullPathWebP.replace(' ', '%20')
              "
            />
            <source
              v-if="rowData.subscriber.avatar.fullPathJp2"
              type="image/jp2"
              :srcset="
                rowData.subscriber.avatar.fullPathJp2.replace(' ', '%20')
              "
            />
            <img
              class="submissions-row__pp__avatar"
              v-if="rowData.subscriber.avatar.fullPath"
              :src="rowData.subscriber.avatar.fullPath"
            />
          </picture>
          <avatar
            size="20"
            v-else
            :name="
              !!rowData.subscriber.fullName
                ? rowData.subscriber.fullName
                : 'itmeo'
            "
            class="submissions-row__pp__avatar"
          />
        </a>

        <a
          class="submissions-row__text submissions-row__name"
          v-tooltip="rowData.subscriber.fullName"
          :href="`/${rowData.subscriber.alias}`"
          target="_blank"
        >
          {{ rowData.subscriber.fullName }}
        </a>
      </div>
    </div>
    <div class="submissions-row__col">
      <p class="submissions-row__name-mob">Email</p>
      <p
        class="submissions-row__text submissions-row__text--bold"
        v-tooltip="rowData.subscriber.email"
      >
        {{ rowData.subscriber.email }}
      </p>
    </div>
    <div class="submissions-row__col submissions-row__col--flex">
      <p class="submissions-row__name-mob">Projects</p>
      <a
        :href="`/dashboard/projects/${rowData.project.id}/pages`"
        target="_blank"
        class="submissions-row__image"
      >
        <picture v-if="rowData.project.preview">
          <source
            v-if="rowData.project.preview.fullPathWebP"
            type="image/webp"
            :srcset="rowData.project.preview.fullPathWebP.replace(' ', '%20')"
          />
          <source
            v-if="rowData.project.preview.fullPathJp2"
            type="image/jp2"
            :srcset="rowData.project.preview.fullPathJp2.replace(' ', '%20')"
          />

          <img
            v-if="rowData.project.preview.fullPath"
            :src="rowData.project.preview.fullPath"
          />
        </picture>
        <img v-else :src="getPlaceholderUrl()" alt="" />
      </a>
      <a
        :href="`/dashboard/projects/${rowData.project.id}/pages`"
        target="_blank"
        class="submissions-row__text"
      >
        {{ rowData.project.name }}
      </a>
    </div>
    <div
      class="submissions-row__col submissions-row__col--flex"
      v-tooltip="rowData.fileName"
    >
      <p class="submissions-row__name-mob">Action</p>
      <svg-icon
        :width="actionsIcons[rowData.action].width"
        :height="actionsIcons[rowData.action].height"
        color="#000000"
        :name="actionsIcons[rowData.action].name"
      />
      <p class="submissions-row__text">
        {{ rowData.action }}
      </p>
    </div>
    <div class="submissions-row__col">
      <p class="submissions-row__name-mob">Date Added</p>
      <p class="submissions-row__text">
        {{ rowData.createdUtcDateTime | localFullFormatDate }}
      </p>
    </div>
    <div class="submissions-row__col submissions-row__col--relative">
      <div class="submissions-row__button" @click="openRowPopup(rowIndex)">
        ...
      </div>
      <transition name="fade">
        <div
          class="submissions-row__popup"
          v-if="openRowPopupIndex === rowIndex"
          v-click-outside="closeRowPopup"
        >
          <div
            class="submissions-row__popup-item"
            @click="setFavorite(rowData)"
          >
            Add to favorites
          </div>
          <div
            class="submissions-row__popup-item"
            :class="{ isNotPro: !isPro }"
          >
            Copy
            <span v-if="!isPro" class="submissions-row__badge">Pro</span>
          </div>
          <div
            class="submissions-row__popup-item submissions-row__popup-item--red"
            :class="{ isNotPro: !isPro }"
            @click="openDeletePopup(false, rowData)"
          >
            Delete
            <span v-if="!isPro" class="submissions-row__badge">Pro</span>
          </div>
        </div>
      </transition>
    </div>
    <div class="submissions-row__col submissions-row__col--mobile">
      <checkbox
        :input-value="selectedRows.includes(idRow)"
        @change="changeSelected(idRow)"
      />
      <p class="submissions-row__checkbox-text" @click="changeSelected(idRow)">
        Select
      </p>
      <div class="submissions-row__btn-fav" @click="setFavorite(rowData)">
        <svg-icon
          v-if="!rowData.isFavorite"
          width="16"
          height="16"
          name="submissions_star"
          color="#dadada"
        />
        <svg-icon
          v-else
          width="16"
          height="16"
          name="submissions_star_filled"
          color="#FFC557"
        />
        <span
          >{{ !rowData.isFavorite ? 'Add to favourites' : 'Remove favourite' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import SvgIcon from '@/components/Shared/SvgIcon.vue'
import Checkbox from '@/components/Shared/ui/Сheckbox.vue'
import Avatar from '~/components/Header/avatar/Avatar.vue'
import { SubmissionDto, CommunityActionButtonType } from '@/utils/api'
import { getPlaceholderUrl } from '@/utils/images'
export default Vue.extend({
  name: 'SubmissionsTableRow',
  components: {
    SvgIcon,
    Checkbox,
    Avatar,
  },
  props: {
    changeSelected: {
      required: true,
      type: Function,
    },
    setFavorite: {
      required: true,
      type: Function,
    },
    openDeletePopup: {
      required: true,
      type: Function,
    },
    openRowPopup: {
      required: true,
      type: Function,
    },
    closeRowPopup: {
      required: true,
      type: Function,
    },
    rowData: {
      required: true,
      type: Object as PropType<SubmissionDto>,
    },
    selectedRows: {
      required: true,
      type: Array,
    },
    rowIndex: {
      required: true,
      type: Number,
    },
    idRow: {
      required: true,
      type: Number,
    },
    openRowPopupIndex: {
      required: true,
      type: Number,
    },
    isPro: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      CommunityActionButtonType,
      isRowOpen: false,
      actionsIcons: {
        Form: {
          name: 'Form',
          width: '17',
          height: '17',
        },
        File: {
          name: 'File',
          width: '17',
          height: '17',
        },
        Link: {
          name: 'open-link',
          width: '24',
          height: '24',
        },
      },
    }
  },
  methods: {
    openRow() {
      if (window.innerWidth > 767) return
      this.isRowOpen = true
    },
    getPlaceholderUrl() {
      return getPlaceholderUrl()
    },
  },
})
</script>

<style lang="scss" scoped>
.submissions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid $gray200;
  position: relative;

  @include bp($sm) {
    display: block;
    height: 57px;
    overflow: hidden;
    transition: 0.3s;

    &.isRowOpen {
      height: 247px;
    }
  }

  &__mobile-btn {
    display: none;
    position: absolute;
    top: 18px;
    left: 0;

    @include bp($sm) {
      display: flex;
      align-items: center;
      justify-content: center;
      @include size(24px);
      border-radius: $shape_border_radius;
      transition: 0.3s;

      svg {
        transition: 0.3s;
      }

      &.isRowOpen {
        background: $gray100;
        svg {
          transform: rotate(-180deg);
        }
      }
    }
  }

  &__col {
    &:nth-child(1) {
      flex: 0 0 calc(20% - 10px);
      max-width: calc(20% - 10px);
      user-select: none;

      @include bp($sm) {
        ::v-deep {
          .check-box {
            display: none;
          }
        }
      }
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

    &--mobile {
      display: none;
    }

    @include bp($sm) {
      padding: 0 0 0 34px;
      display: flex;
      align-items: center;
      gap: 0 !important;
      flex: 0 0 calc(100% - 24px) !important;
      max-width: calc(100% - 24px) !important;

      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4),
      &:nth-child(5) {
        margin: 0 0 12px;
      }

      &:nth-child(6) {
        position: absolute;
        right: 0;
        top: 18px;
      }

      &--flex {
        ::v-deep {
          .svg-icon--File {
            flex: 0 0 20px;
            margin: 0 8px 0 0;
          }
        }
      }

      &--mobile {
        display: flex;
      }

      .submissions-row__image {
        margin: 0 8px 0 0;
      }
    }
  }

  &__name-mob {
    display: none;

    @include bp($sm) {
      display: block;
      width: 60px;
      flex: 0 0 60px;
      margin: 0 10px 0 0;
      font-weight: 400;
      font-size: 10px;
      line-height: 15px;
      color: $gray400;
    }
  }

  &__check {
    @include size(15px);
    flex: 0 0 15px;
  }

  &__star {
    @include size(16px);
    flex: 0 0 16px;
    display: flex;
    cursor: pointer;

    svg {
      transition: 0.3s;
    }

    &:hover {
      svg {
        color: $gray400 !important;
      }
    }

    @include bp($sm) {
      display: none;
    }
  }

  &__checkbox-text {
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    font-feature-settings: 'liga' off;
    margin: 0 0 0 4px;
  }

  &__btn-fav {
    padding: 9px 12px;
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    font-feature-settings: 'liga' off;
    color: #333333;
    margin: 0 0 0 13px;
    gap: 4px;
    border: 1px solid $gray100;
    border-radius: $shape_border_radius;
  }

  &__pp {
    @include size(20px);
    border-radius: 50%;
    flex: 0 0 20px;
    background-size: cover;
    background-position: 50%;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }
    &__avatar {
      width: 20px;
      height: 20px;
      border-radius: 20px;
      overflow: hidden;
    }
  }

  &__person-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    max-width: calc(100% - 47px);
  }

  &__image {
    border-radius: $shape_border_radius;
    height: 24px;
    width: 30px;

    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: $shape_border_radius;
      transition: 0.3s;
      opacity: 0;
      background: rgba($black, 0.4);
    }

    &:hover {
      &:before {
        opacity: 1;
      }
    }

    img {
      width: 30px;
      height: 24px;
      border-radius: $shape_border_radius;
      background-color: white;
    }
  }

  &__text {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 55px);
    white-space: nowrap;
    color: #000;
    text-decoration: none;
    &--bold {
      font-size: 14px;
      font-weight: 500;
    }
  }

  &__name {
    cursor: pointer;
    transition: 0.3s;
    border-bottom: 1px solid transparent;
    display: inline-block;

    &:hover {
      border-bottom-color: $black;
    }
  }

  &__button {
    @include size(24px);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $gray100;
    border-radius: $shape_border_radius;
    cursor: pointer;
    padding: 0 0 9px;
    transition: 0.3s;
    user-select: none;

    svg {
      transition: 0.3s;
    }

    &:hover {
      border-color: $gray400;
    }

    &:active {
      background: $gray100;
      border-color: $gray100;
    }
  }

  &__popup {
    position: absolute;
    right: 0;
    bottom: -4px;
    transform: translateY(100%);
    padding: 8px;
    background: $white;
    box-shadow: $shadow_small;
    border-radius: 4px;
    width: 150px;
    z-index: 20;

    &-item {
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: 0.3s;
      border-radius: $shape_border_radius;

      &:hover {
        background: $gray100;
      }

      &:not(:last-child) {
        margin: 0 0 8px;
      }

      &.isNotPro {
        pointer-events: none;
        color: rgba($black, 0.5);
      }

      &--red {
        color: $danger;

        &.isNotPro {
          color: rgba($danger, 0.5);
        }
      }
    }
  }

  &__badge {
    padding: 2px 4px;
    background: $black;
    border-radius: 4px;
    font-weight: 600;
    font-size: 13px;
    line-height: 20px;
    color: #ffc557;
  }
}
</style>

<template>
  <!-- TODO: hide all svg to files or components -->
  <div
    class="quick-actions"
    :class="{ 'quick-actions_open-dropdown': isDropdownVisible }"
  >
    <a class="quick-actions__button" href="#" @click="toggleDropdown">
      <dots-icon class="quick-actions__button-icon"> </dots-icon
    ></a>
    <transition name="popup-layer" mode="out-in">
      <div v-if="isDropdownVisible" class="quick-actions__dropdown">
        <!--  <a
          class="quick-actions__dropdown-item"
          href="#"
          @click="openWebsite"
          v-if="isPublished"
        >
          <svg
            width="12"
            height="8"
            viewbox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9237 3.75587C11.8165 3.60247 9.26225 0 5.99995 0C2.73765 0 0.183235 3.60247 0.0761487 3.75572C-0.0253829 3.90124 -0.0253829 4.09861 0.0761487 4.24413C0.183235 4.39753 2.73765 8 5.99995 8C9.26225 8 11.8165 4.3975 11.9237 4.24426C12.0254 4.09876 12.0254 3.90124 11.9237 3.75587ZM5.99995 7.17242C3.59692 7.17242 1.51564 4.78138 0.899534 3.99972C1.51484 3.21737 3.59176 0.827582 5.99995 0.827582C8.40286 0.827582 10.484 3.2182 11.1004 4.00028C10.4851 4.78261 8.40813 7.17242 5.99995 7.17242Z"
              fill="black"
            ></path>
            <path
              d="M5.99985 1.51707C4.69106 1.51707 3.62622 2.63087 3.62622 3.99984C3.62622 5.36881 4.69106 6.48261 5.99985 6.48261C7.30865 6.48261 8.37349 5.36881 8.37349 3.99984C8.37349 2.63087 7.30865 1.51707 5.99985 1.51707ZM5.99985 5.655C5.12728 5.655 4.41745 4.91251 4.41745 3.99984C4.41745 3.08717 5.1273 2.34468 5.99985 2.34468C6.87241 2.34468 7.58226 3.08717 7.58226 3.99984C7.58226 4.91251 6.87243 5.655 5.99985 5.655Z"
              fill="black"
            ></path>
          </svg>
          <span>View Live Site</span>
        </a> -->
        <a
          v-if="!isMobile"
          class="quick-actions__dropdown-item"
          href="#"
          @click="openSiteSettings"
        >
          <svg
            width="12"
            height="12"
            viewbox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 4.1875C5.483 4.1875 5.0625 3.767 5.0625 3.25C5.0625 2.73325 5.483 2.3125 6 2.3125C6.517 2.3125 6.9375 2.73325 6.9375 3.25C6.9375 3.767 6.517 4.1875 6 4.1875ZM7.6875 3.25C7.6875 2.4935 7.187 1.85175 6.5 1.63825V0.5C6.5 0.224 6.276 0 6 0C5.72375 0 5.5 0.224 5.5 0.5V1.63825C4.813 1.85175 4.3125 2.4935 4.3125 3.25C4.3125 4.00675 4.813 4.6485 5.5 4.862V11.5C5.5 11.7762 5.72375 12 6 12C6.276 12 6.5 11.7762 6.5 11.5V4.862C7.187 4.6485 7.6875 4.00675 7.6875 3.25Z"
              fill="#333333"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.6875 9.1875C1.1705 9.1875 0.75 8.767 0.75 8.25C0.75 7.73325 1.1705 7.3125 1.6875 7.3125C2.2045 7.3125 2.625 7.73325 2.625 8.25C2.625 8.767 2.2045 9.1875 1.6875 9.1875ZM3.375 8.25C3.375 7.49375 2.8745 6.85175 2.1875 6.63825V0.5C2.1875 0.224 1.9635 0 1.6875 0C1.4115 0 1.1875 0.224 1.1875 0.5V6.63825C0.50025 6.85175 0 7.49375 0 8.25C0 9.00675 0.50025 9.6485 1.1875 9.862V11.5C1.1875 11.7762 1.4115 12 1.6875 12C1.9635 12 2.1875 11.7762 2.1875 11.5V9.862C2.8745 9.6485 3.375 9.00675 3.375 8.25Z"
              fill="#333333"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.3125 6.9375C9.7955 6.9375 9.375 6.517 9.375 6C9.375 5.48325 9.7955 5.0625 10.3125 5.0625C10.8295 5.0625 11.25 5.48325 11.25 6C11.25 6.517 10.8295 6.9375 10.3125 6.9375ZM12 6C12 5.24375 11.4995 4.60175 10.8125 4.38825V0.5C10.8125 0.224 10.5885 0 10.3125 0C10.0363 0 9.8125 0.224 9.8125 0.5V4.38825C9.1255 4.60175 8.625 5.24375 8.625 6C8.625 6.75675 9.1255 7.3985 9.8125 7.612V11.5C9.8125 11.7762 10.0363 12 10.3125 12C10.5885 12 10.8125 11.7762 10.8125 11.5V7.612C11.4995 7.3985 12 6.75675 12 6Z"
              fill="#333333"
            ></path>
          </svg>
          <span>Site Settings</span>
        </a>
        <a v-if="!isProject" class="quick-actions__dropdown-item" href="#">
          <svg
            width="12"
            height="12"
            viewbox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.99962 0C2.6865 0.00075 0.00075 2.6865 0 5.99962C0.00075 9.31388 2.6865 11.9996 5.99962 12C9.31388 11.9993 11.9996 9.31388 12 5.99962C11.9996 2.6865 9.31388 0.00075 5.99962 0ZM4.32413 1.02975C3.91988 1.49625 3.486 2.14575 3.156 3.00038H1.69762C2.334 2.08988 3.25087 1.39237 4.32413 1.02975ZM1.26412 3.75H2.91C2.76225 4.30237 2.66663 4.92825 2.64 5.625H0.7695C0.817875 4.95713 0.99 4.32525 1.26412 3.75ZM0.7695 6.37537H2.64C2.66663 7.07212 2.76225 7.69763 2.91 8.25H1.26487C0.99075 7.67475 0.81825 7.04362 0.7695 6.37537ZM1.69875 9H3.15637C3.486 9.85312 3.91913 10.5026 4.32338 10.9688C3.25088 10.6065 2.33475 9.90975 1.69875 9ZM5.625 11.1709C5.2725 10.9069 4.50338 10.2338 3.96263 9H5.625V11.1709ZM5.625 8.24963H3.68625C3.52575 7.71075 3.4185 7.08563 3.38812 6.375H5.625V8.24963ZM5.625 5.625H3.39C3.42037 4.911 3.53025 4.28888 3.69187 3.75H5.625V5.625ZM5.625 3.00038H3.96075C4.15875 2.54925 4.38713 2.17237 4.61438 1.863C4.92188 1.44525 5.22862 1.15013 5.45475 0.9615C5.52 0.9075 5.5755 0.86475 5.625 0.828V3.00038ZM11.2294 5.625H9.36C9.33337 4.92788 9.23775 4.30237 9.08925 3.75H10.7351C11.0089 4.32525 11.1818 4.95713 11.2294 5.625ZM10.3024 3.00038H8.844C8.51363 2.14538 8.08012 1.49588 7.6755 1.02975C8.7495 1.39237 9.66638 2.08988 10.3024 3.00038ZM6.375 3.00075V0.8295C6.72787 1.09387 7.49662 1.76738 8.03775 3.00113L6.375 3.00075ZM6.375 3.75H8.31338C8.47425 4.28888 8.58113 4.91437 8.6115 5.625H6.375V3.75ZM6.375 6.375H8.60962C8.57925 7.08825 8.46937 7.71075 8.30775 8.24963H6.375V6.375ZM6.54487 11.0385C6.47962 11.0925 6.42413 11.1345 6.375 11.1716V9.00037H8.03925C7.84162 9.45113 7.6125 9.82763 7.38525 10.137C7.07812 10.5544 6.77137 10.8503 6.54487 11.0385ZM7.67663 10.9688C8.0805 10.5026 8.51363 9.85312 8.84363 9H10.3016C9.66488 9.90975 8.74913 10.6065 7.67663 10.9688ZM10.7347 8.24963H9.09C9.23738 7.69763 9.333 7.07212 9.36 6.375H11.2294C11.181 7.04287 11.0089 7.67438 10.7347 8.24963Z"
              fill="#333333"
            ></path>
          </svg>
          <span>Publish</span>
        </a>
        <a
          class="quick-actions__dropdown-item"
          href="#"
          @click="copyWebsiteLink"
        >
          <svg
            width="12"
            height="12"
            viewbox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.39469 9.52066L3.78749 10.1237C3.26114 10.6454 2.40509 10.6458 1.87904 10.1237C1.62615 9.87271 1.48725 9.53941 1.48725 9.18511C1.48725 8.83081 1.6263 8.49736 1.87889 8.24641L4.11389 6.02897C4.57709 5.56967 5.44843 4.89332 6.08353 5.52317C6.37498 5.81267 6.84568 5.81072 7.13503 5.51942C7.42453 5.22812 7.42273 4.75727 7.13128 4.46807C6.05173 3.39677 4.45619 3.59477 3.06659 4.97357L0.831448 7.19116C0.295199 7.72351 0 8.43151 0 9.18511C0 9.93871 0.295199 10.6466 0.831598 11.1789C1.38345 11.7264 2.10809 12 2.83304 12C3.55814 12 4.28309 11.7264 4.83524 11.1786L5.44288 10.5755C5.73418 10.2863 5.73583 9.81556 5.44633 9.52411C5.15729 9.23296 4.68614 9.23131 4.39469 9.52066ZM11.1681 0.906631C10.0086 -0.243866 8.38738 -0.306266 7.31398 0.758731L6.55708 1.51008C6.26563 1.79943 6.26383 2.26998 6.55333 2.56143C6.84283 2.85288 7.31353 2.85453 7.60498 2.56518L8.36158 1.81428C8.91763 1.26213 9.64572 1.49103 10.1206 1.96218C10.3738 2.21313 10.5129 2.54658 10.5129 2.90088C10.5129 3.25532 10.3737 3.58877 10.1209 3.83972L7.73638 6.20522C6.64603 7.28701 6.13453 6.77926 5.91628 6.56266C5.62484 6.27332 5.15429 6.27512 4.86479 6.56642C4.57529 6.85771 4.57709 7.32856 4.86854 7.61776C5.36909 8.11456 5.94043 8.36086 6.53938 8.36086C7.27273 8.36086 8.04733 7.99156 8.78383 7.26031L11.1684 4.89482C11.7045 4.36247 12 3.65432 12 2.90073C12 2.14743 11.7045 1.43928 11.1681 0.906631Z"
              fill="#333333"
            ></path>
          </svg>
          <span>Copy Link</span>
        </a>
        <a
          class="quick-actions__dropdown-item"
          href="#"
          @click="editProjectName"
        >
          <pencil-icon />
          <span>Rename</span>
        </a>
        <a
          class="quick-actions__dropdown-item"
          href="#"
          @click="duplicateProject"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.64 0H0.48C0.215039 0 0 0.215039 0 0.48V8.64C0 8.90496 0.215039 9.12 0.48 9.12H8.64C8.90496 9.12 9.12 8.90496 9.12 8.64V0.48C9.12 0.215039 8.90496 0 8.64 0ZM8.16 8.16H0.96V0.96H8.16V8.16Z"
              fill="#333333"
            ></path>
            <path
              d="M11.0398 9.83984V11.0398H9.83984V11.9998H11.5198C11.7848 11.9998 11.9998 11.7848 11.9998 11.5198V9.83984H11.0398Z"
              fill="#333333"
            ></path>
            <path
              d="M8.7318 11.04H6.14941V12.0001H8.7318V11.04Z"
              fill="#333333"
            ></path>
            <path
              d="M3.83988 11.0398V9.83984H2.87988V11.5198C2.87988 11.7848 3.09492 11.9998 3.35988 11.9998H5.03988V11.0398H3.83988Z"
              fill="#333333"
            ></path>
            <path
              d="M11.5198 2.88013H9.83984V3.84012H11.0398V5.04012H11.9998V3.36013C11.9998 3.09517 11.7848 2.88013 11.5198 2.88013Z"
              fill="#333333"
            ></path>
            <path
              d="M12.0001 6.14868H11.04V8.73107H12.0001V6.14868Z"
              fill="#333333"
            ></path>
          </svg>
          <span>Duplicate Site</span>
        </a>
        <a
          class="quick-actions__dropdown-item"
          href="#"
          @click="openDeleteProjectConfirmation"
        >
          <svg
            width="12"
            height="13"
            viewbox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.8 1.52344H8.4V1.14258C8.4 0.512561 7.86168 0 7.2 0H4.8C4.13832 0 3.6 0.512561 3.6 1.14258V1.52344H1.2C0.53832 1.52344 0 2.036 0 2.66602V3.42773C0 3.63807 0.179093 3.80859 0.4 3.80859H0.831547L1.5352 11.9576L1.53549 11.9609C1.59208 12.5533 2.10587 13 2.73056 13H9.26941C9.89413 13 10.4079 12.5533 10.4645 11.9609L10.4648 11.9576L11.1685 3.80859H11.6C11.8209 3.80859 12 3.63807 12 3.42773V2.66602C12 2.036 11.4617 1.52344 10.8 1.52344ZM4.4 1.14258C4.4 0.932572 4.57944 0.761719 4.8 0.761719H7.2C7.42056 0.761719 7.6 0.932572 7.6 1.14258V1.52344H4.4V1.14258ZM9.66765 11.8932C9.64821 12.09 9.4772 12.2383 9.26941 12.2383H2.73056C2.52277 12.2383 2.35179 12.09 2.33232 11.8932L1.63424 3.80859H10.3658L9.66765 11.8932ZM11.2 3.04688H0.8V2.66602C0.8 2.45601 0.97944 2.28516 1.2 2.28516H10.8C11.0206 2.28516 11.2 2.45601 11.2 2.66602V3.04688Z"
              fill="#333333"
            ></path>
            <path
              d="M6.0001 4.57031C5.77919 4.57031 5.6001 4.74084 5.6001 4.95117V10.334C5.6001 10.5443 5.77919 10.7148 6.0001 10.7148C6.221 10.7148 6.4001 10.5443 6.4001 10.334V4.95117C6.4001 4.74084 6.221 4.57031 6.0001 4.57031Z"
              fill="#333333"
            ></path>
            <path
              d="M8.62501 4.57856C8.40469 4.56238 8.21359 4.71933 8.19819 4.9291L7.80396 10.2975C7.78856 10.5072 7.95468 10.6904 8.17499 10.7066C8.39531 10.7228 8.58641 10.5658 8.60181 10.3561L8.99604 4.98769C9.01145 4.77792 8.84532 4.59474 8.62501 4.57856Z"
              fill="#333333"
            ></path>
            <path
              d="M3.37513 4.57855C3.15482 4.59471 2.98868 4.77789 3.00408 4.98766L3.39797 10.356C3.41336 10.5658 3.60445 10.7228 3.82477 10.7066C4.04508 10.6904 4.21122 10.5073 4.19583 10.2975L3.80193 4.92912C3.78654 4.71935 3.59545 4.56238 3.37513 4.57855Z"
              fill="#333333"
            ></path>
          </svg>
          <span>Delete Site</span>
        </a>
        <a
          class="quick-actions__dropdown-item"
          href="#"
          @click="unpublishProject"
        >
          <svg-icon
            width="12"
            height="10"
            :name="isPublished ? 'icon-password' : 'icon-password-open'"
          />
          <span>{{ isPublished ? 'Unpublish' : 'Publish' }}</span>
        </a>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DotsIcon from '@/assets/icons/dots.svg?inline'
import PencilIcon from '@/assets/icons/pencil_rename.svg?inline'
export default Vue.extend({
  props: {
    isDropdownVisible: Boolean,
    isProject: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    openWebsite: Function,
    openSiteSettings: Function,
    copyWebsiteLink: Function,
    editProjectName: Function,
    duplicateProject: Function,
    openDeleteProjectConfirmation: Function,
    toggleDropdown: Function,
    unpublishProject: Function,
  },
  components: {
    DotsIcon,
    PencilIcon,
  },
  computed: {
    isMobile(): boolean {
      return window.innerWidth < 1200
    },
  },
})
</script>

<style lang="scss" scoped>
.quick-actions {
  display: flex;
  flex-direction: row;
  align-items: center;

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
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 400;
    text-decoration: none;
    color: #000000;
    background: #ffffff;
    border: 1px solid #ebebeb;
    box-sizing: border-box;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    border-radius: $shape_border_radius;
    transform: translateY(2px);
    opacity: 0;
    transition: background-color 0.3s, transform 0.2s ease, opacity 0.3s ease;
    width: 24px;
    height: 24px;
    &:hover {
      background: #ebebeb;
    }
  }

  &__button-icon {
    width: 10px;
    fill: #000;
    margin-left: 0px;
  }

  &__dropdown {
    position: absolute;
    bottom: 60px;
    right: 5px;
    z-index: 20;
    width: 148px;
    text-align: left;
    background-color: #ffffff;
    border-radius: $shape_border_radius;
    box-shadow: 0 10px 20px 0 rgba(9, 9, 9, 0.15);
    padding-top: 10px;
    padding-right: 5px;
    padding-bottom: 10px;
    padding-left: 5px;
  }

  &__dropdown-item {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: $black;
    border-radius: $shape_border_radius;
    padding-top: 5px;
    padding-right: 11px;
    padding-bottom: 4px;
    padding-left: 11px;
    margin-bottom: 5px;
    transition: 0.3s;
    position: relative;

    &--disabled {
      display: none;
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
      margin-right: 10px;
      transition: 0.3s;
    }

    span {
      font-size: 13px;
      font-weight: 400;
      color: #333333;
      transition: 0.3s;
    }
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
}
@media screen and (max-width: 1866px) {
  .quick-actions__dropdown {
    bottom: 50px;
  }
}
@media screen and (max-width: 1620px) {
  .quick-actions__dropdown {
    bottom: 60px;
  }
}
@media screen and (max-width: 1320px) {
  .quick-actions__dropdown {
    bottom: 50px;
  }
}
@media screen and (max-width: 1000px) {
  .quick-actions__dropdown {
    bottom: 60px;
  }
}
@media screen and (max-width: 625px) {
  .quick-actions__dropdown {
    bottom: 50px;
  }
}
@media screen and (max-width: 475px) {
  .quick-actions__dropdown {
    bottom: 45px;
  }
}
</style>

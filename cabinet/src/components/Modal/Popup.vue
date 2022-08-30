<template>
  <div
    :class="['sidebar-popup', `sidebar-popup_${popupClassName}`]"
    :style="[backgroundImage]"
  >
    <div
      :class="[
        'sidebar-popup-container',
        `sidebar-popup-container-${popupSettings.container}`,
      ]"
    >
      <div
        v-if="popupSettings.header || popupSettings.closeButton"
        class="sidebar-popup-header"
      >
        <div class="sidebar-popup-header-column">
          <h3
            :class="{ isWhite: popupSettings.background }"
            v-if="popupSettings.header"
          >
            {{ popupSettings.header }}
          </h3>
          <p
            :class="{ isWhite: popupSettings.background }"
            v-if="popupSettings.description"
          >
            {{ popupSettings.description }}
          </p>
        </div>
        <button
          v-if="popupSettings.closeButton"
          @click="closeModal"
          :class="{ 'sidebar-popup__close_white': popupSettings.background }"
          class="sidebar-popup__close"
        >
          <svg-icon
            name="close"
            width="8"
            height="8"
            :color="popupSettings.background ? '#ffffff' : '#BDBDBD'"
          />
        </button>
      </div>

      <component :is="`${popupSettings.content}Popup`" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import PublishPopup from '@/components/Modal/Publish/PublishPopup.vue'
import ChangedAccountSettingsPopup from '@/components/Modal/Changed/AccountSettingsPopup.vue'
import LimitProjectPopup from '@/components/Modal/LimitProjectPopup.vue'
import PublishInCommunityPopup from '@/components/Modal/PublishInCommunity/PublishInCommunityPopup.vue'
import { BasePopupData, PopupSettings, PopupType } from './types'

export default Vue.extend({
  name: 'Popup',
  components: {
    PublishPopup,
    ChangedAccountSettingsPopup,
    LimitProjectPopup,
    PublishInCommunityPopup,
  },
  data() {
    return {
      top: null as number | null,
      left: null as number | null,
      popupHeight: null as string | null,
    }
  },

  computed: {
    ...mapState({
      popupSettings: (state: any) =>
        <PopupSettings<BasePopupData>>state.ui.popupSettings,
    }),
    popupClassName(): string {
      return this.camelToNormal(this.popupSettings.content)
    },
    backgroundImage(): any {
      return {
        ...(this.popupSettings.background
          ? {
              'background-image': `url(${this.popupSettings.background})`,
              'background-size': 'cover',
              'border-color': 'transparent',
            }
          : {}),
      }
    },
  },
  mounted() {
    const body = document.querySelector('body')
    if (body) {
      ;(<any>window).lastScrollPos = window.scrollY
      body.style.top = `-${window.scrollY}px`
      body.style.position = 'fixed'
      body.style.width = '100%'
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('ui/SET_POPUP_SETTINGS', {
        active: false,
      })
      const body = document.querySelector('body')
      if (body) {
        body.style.top = ''
        body.style.position = ''
        const lastScroll = (<any>window).lastScrollPos ?? 0
        window.scrollTo({
          top: lastScroll,
          left: 0,
        })
      }
    },
    camelToNormal(str: string) {
      return str
        .replace(/[\w]([A-Z])/g, function (m) {
          return `${m[0]}-${m[1]}`
        })
        .toLowerCase()
    },
  },
})
</script>

<style lang="scss">
// anim
.popup-layer-enter-active {
  transition: transform 0.5s cubic-bezier(0.8, -0.5, 0.2, 1.4),
    opacity 0.5s cubic-bezier(0.8, -0.5, 0.2, 1.4);
}
.popup-layer-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.popup-layer-enter,
.popup-layer-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.sidebar-popup__close {
  cursor: pointer;
}

// global
.sidebar-popup {
  box-shadow: $shadow_popup;
  border-radius: $shape_border_radius;
  background: #ffffff;
  border: 1px solid #dadada;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
  z-index: 9999;
  overflow-y: auto;
  position: fixed;

  &::-webkit-scrollbar {
    margin-top: 8px;
    width: 2px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 30px;
    background: #bdc2c7;
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-column {
      display: flex;
      flex-direction: column;
      p {
        font-size: 10px;
        line-height: 15px;
        color: #949cad;
      }
    }
  }

  &-container {
    &-small {
      padding: 14px 6px;
    }

    &-small-context {
      padding: 7px 6px;
    }

    &-medium {
      width: 260px;
      padding: 18px $margin_xl;
    }

    &-large {
      width: 312px;
      padding: 18px $margin_xl;
      &-paddings {
        max-height: 540px;
        padding: 20px;
      }
    }

    /*  &-publish {
      width: 400px;
      padding: 24px 20px 20px;
    } */
    &-publish {
      width: 732px;
      padding: 30px;
    }
    &-changed-account-settings {
      width: 360px;
      padding: 0px;
    }
    &-limit-project {
      width: 320px;
      padding: 0px;
    }
    &-flex {
      padding: 18px $margin_xl;
    }
  }

  &__close {
    background: #f2f2f2;
    border-radius: 100%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    &_white {
      background-color: rgba(242, 242, 242, 0.3);
    }
    svg {
      transition: 0.3s;
    }

    &:hover {
      svg {
        color: $black !important;
      }
    }
  }

  &_add-element {
    width: 200px;

    .sidebar-popup-header {
      padding-left: 6px;
      margin-bottom: 8px;
    }
  }

  &_context {
    width: 130px;
  }

  &_add-new-block-or-element {
    width: 619px;
    max-height: 590px;
    height: 100%;
    background-color: #fff;
    .sidebar-popup-container {
      height: 100%;
    }
    .sidebar-popup-header {
      top: 12px;
      right: 16px;
      position: absolute;
    }
  }

  &_link {
    overflow: visible;
  }

  &_shape {
    max-width: 208px;
    width: 100%;
    .sidebar-popup-header {
      margin: 0 0 16px;
    }
  }

  &_block-collection {
    max-width: 360px;
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 91px);

    .sidebar-popup-container-large-paddings {
      max-height: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    & .sidebar-popup-header h3 {
      font-weight: 500;
    }
  }
&_publish-in-community {
    font-family: 'Poppins', sans-serif;
    * {
      font-family: 'Poppins', sans-serif;
    }
  }
  h3 {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
  }

  &-list-item {
    display: flex;
    align-items: center;
    padding: 6px;
    cursor: pointer;
    border-radius: $shape_border_radius;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f3f3f3;
    }

    &:active,
    &:focus {
      h4 {
        color: #318bf5;
      }

      .layer-popup-list__icon {
        path {
          fill: #318bf5;
        }

        &_stroke {
          path,
          circle {
            stroke: #318bf5;
            fill: transparent;
          }
        }
      }
    }

    &_not-important {
      margin-top: 14px;
      position: relative;
      pointer-events: none;

      &::before {
        content: '';
        position: absolute;
        top: -7px;
        left: 50%;
        transform: translateX(-50%);
        width: 122px;
        height: 1px;
        background-color: #f2f2f2;
      }
    }

    &_disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    & + &_id {
      color: $gray600;
      h4 {
        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          font-size: 9px;
        }
      }
    }
  }

  &-contextmenu-item {
    padding: 3px 8px 3px 2px;

    h4 {
      font-weight: normal;
      font-size: 12px;
      line-height: 16px;
      margin-left: 2px;
      transition: color 0.2s ease;
    }
  }

  &-list {
    &-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__icon-wrapper {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;
      border: 1px solid #e6e6e6;
      border-radius: $shape_border_radius;
    }

    &__content {
      margin-left: 15px;

      h4 {
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
        transition: color 0.2s ease;
      }

      p {
        margin-top: 4px;
        font-size: 12px;
        line-height: 16px;
        color: #949cad;
        display: flex;
        align-items: center;

        span {
          margin-right: 7px;
        }

        svg path {
          fill: currentColor;
        }
      }
    }
  }

  &-align {
    &-y {
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.isWhite {
  color: #ffffff;
}
.sidebar-popup_publish {
  width: 420px;
  padding: 24px 20px 80px;
  min-height: 426px;
  .sidebar-popup-container-large {
    padding: 0;
    width: 100%;
    height: 100%;
  }
  .sidebar-popup-header {
    margin-bottom: 20px;

    h3 {
      font-style: normal;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
    }
  }
}
.sidebar-popup_publish-in-community {
  width: 876px;
  padding: 20px;
  min-height: fit-content;
  .sidebar-popup-container-large {
    padding: 0;
    width: 100%;
    height: 100%;
  }
  .sidebar-popup-header {
    margin-bottom: 20px;

    h3 {
      color: #000000;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
    }
  }
}
.sidebar-popup_changed-account-settings {
  width: 420px;
  padding: 30px;
  min-height: 365px;
  .sidebar-popup-container-large {
    padding: 0;
    width: 100%;
    height: 100%;
  }
  .sidebar-popup-header {
    margin-bottom: 20px;

    h3 {
      color: #000000;
      font-style: normal;
      font-weight: 400;
      font-size: 25px;
      line-height: 38px;
    }
  }
}
.sidebar-popup_limit-project {
  width: 420px;
  padding: 30px;
  min-height: 365px;
}

@media screen and (max-width: 450px) {
  .sidebar-popup {
    &_publish {
      width: calc(100% - 30px);
    }
    &_changed-account-settings,
    &_limit-project {
      width: calc(100% - 30px);
      padding: 30px 20px;
      min-height: 300px;
      .sidebar-popup-container-large {
        padding: 0;
        width: 100%;
        height: 100%;
      }
      .sidebar-popup-header {
        margin-bottom: 20px;
      }
    }
  }
}
</style>

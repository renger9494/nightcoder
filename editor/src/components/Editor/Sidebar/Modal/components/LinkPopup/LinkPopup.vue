<template>
  <div class="link-popup">
    <div class="link-type-popup">
      <div v-if="!this.isLinkTypeNone" @click="openTypePopup" class="link-type-popup__head">
        <svg-icon
          :name="`${linkType.toLowerCase()}-icon`"
          :width="iconSizeSettings[linkType].width"
          :height="iconSizeSettings[linkType].height"
          color="#4356BE"
        />
        <span :style="linkType === LinkType.URL ? { textTransform: 'uppercase' } : {}">
            {{ linkType }}
          </span>
        <svg-icon name="arrow-down-icon" width="9" height="5" color="#4356be" />
      </div>
      <transition name="popup-layer">
        <link-type-popup
          v-if="linkTypePopup"
          v-click-outside="() => (linkTypePopup = false)"
          @chooseType="chooseType"
          :active-type="linkType"
          :icons="iconSizeSettings"
        />
      </transition>
    </div>
    <label v-if="isSimpleLinks" class="link-popup__field">
      <span v-if="linkType === LinkType.URL || linkType === LinkType.Download" :class="{ isError }" class="link-popup__field-error" >
        Invalid URL
      </span>
      <span v-if="linkType === LinkType.Email" :class="{ isError }" class="link-popup__field-error">
          Invalid email
      </span>
      <input
        ref="url"
        v-model="inputValue"
        @keydown.enter="changeValue"
        @keydown="isError = false"
        @blur="changeValue"
        :class="{ isError }"
        class="dte-input"
        type="text"
        :placeholder="inputPlaceholder[linkType]"
      />
      <svg-icon
        name="check-mark-icon"
        width="10"
        height="8"
        color="#53B71B"
        :class="{ active: linkSaved }"
        class="link-popup__field-icon"
      />
    </label>
    <div class="popup-dropdown" v-else>
      <div class="popup-dropdown__head link-dropdown" @click="openPopup">
        <div class="link-dropdown_wrap">
          <p class="link-dropdown_text">{{ isPage ? 'Page ID:' : 'Block ID:' }}</p>
          <p class="link-dropdown_text link-dropdown_text--gray">{{ activePage }}</p>
        </div>
        <svg-icon name="arrow-down" width="16" height="16" color="#000" />
      </div>
      <transition name="popup-layer">
        <link-popup-list
          v-if="isDropdownOpen"
          v-click-outside="() => (isDropdownOpen = false)"
          class="popup-dropdown__body"
          :pages="popupData.pages"
          :blocks="popupData.blocks"
          :is-page="isPage"
          :active-id="inputValue"
          @setActiveItem="setActiveItem"
        />
      </transition>
    </div>
    <switcher :switcher-items="switcherItems" @filterName="changeLinkOpenType" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import LinkTypePopup from './LinkTypePopup.vue';
import TogglePanelIcon from '@/components/Editor/Sidebar/DesignType/Sections/TogglePanelIcon.vue';
import Switcher from '@/components/Editor/Sidebar/Switcher.vue';

import {mapGetters, mapState} from 'vuex';
import ObjectKeys from '@/utils/types/ObjectKeys';
import {formatLink} from '@/helpers/formatLink';
import {LinkType, OpenLinkType} from '@/constants/link';
import {BaseProjectPageDto} from '@/utils/api';
import {LinkPopupData} from "@/components/Editor/Sidebar/Modal/types";
import LinkPopupList from "@/components/Editor/Sidebar/Modal/components/LinkPopup/LinkPopupList.vue";

const linkReg = new RegExp(
  /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
);

const regexValidation: ObjectKeys<RegExp> = {
  [LinkType.URL]: linkReg,
  [LinkType.Email]: new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ),
  [LinkType.Download]: linkReg,
  [LinkType.Phone]: new RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
};

const iconSizeSettings: ObjectKeys<ObjectKeys<string | number>> = {
  [LinkType.URL]: {
    width: 12,
    height: 12,
    color: '#333'
  },
  [LinkType.Block]: {
    width: 12,
    height: 12,
    color: '#333'
  },
  [LinkType.Page]: {
    width: 12,
    height: 12,
    color: '#333'
  },
  [LinkType.Email]: {
    width: 12,
    height: 12,
    color: '#333'
  },
  [LinkType.Phone]: {
    width: 12,
    height: 13,
    color: '#333'
  },
  [LinkType.Download]: {
    width: 12,
    height: 15,
    color: '#333'
  }
}

export default Vue.extend({
  components: {
    LinkPopupList,
    LinkTypePopup,
    TogglePanelIcon,
    Switcher,
  },
  data() {
    return {
      LinkType,
      linkType: '' as LinkType,
      linkOpenType: null as string | null,
      activeId: '',
      linkTypePopup: false,
      linkSaved: false,
      inputValue: '',
      isError: false,
      isDropdownOpen: false,
      inputPlaceholder: {
        [LinkType.URL]: 'URL address',
        [LinkType.Block]: 'Block id',
        [LinkType.Page]: 'Page id',
        [LinkType.Email]: 'Email address',
        [LinkType.Phone]: 'Phone number',
        [LinkType.Download]: 'Download link'
      } as ObjectKeys<string>,
      iconSizeSettings,
    };
  },
  created() {
    this.linkType = this.popupData.linkType;
    this.inputValue = this.popupData.inputValue;
    this.activeId = this.popupData.activeId;
    this.linkOpenType = this.popupData.openType;
    if(this.isLinkTypeNone) this.chooseType(LinkType.URL)
    if (this.popupData.openType == 'new') this.popupData.changeLinkParams('openType', null);
  },
  computed: {
    ...mapState({
      projectPages: (state: any) => <BaseProjectPageDto[]>state.project.projectPages,
      popupData: (state: any) => <LinkPopupData>state.editor.popupSettings.data,
      userConfig: (state: any) => state.editor.userConfig
    }),
    ...mapGetters({
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    }),
    activePage(): string {
      return !this.inputValue ? 'Unset' : this.inputValue;
    },
    isPage(): boolean {
      return this.linkType === LinkType.Page;
    },
    isSimpleLinks(): boolean {
      return (
        this.linkType === LinkType.Email ||
        this.linkType === LinkType.URL ||
        this.linkType === LinkType.Phone ||
        this.linkType === LinkType.Download
      );
    },
    isLinkTypeNone(): boolean {
      return this.linkType == LinkType.None;
    },
    switcherItems(): any {
      return [
        {
          name: 'Current Tab',
          icon: 'current-page-icon',
          iconWidth: 13,
          iconHeight: 12,
          iconColor: '#000',
          isActive: this.linkOpenType === null
        },
        {
          name: 'New Tab',
          icon: 'new-tab-icon',
          iconWidth: 12,
          iconHeight: 13,
          iconColor: '#000',
          isActive: this.linkOpenType === '_blank'
        }
      ];
    }
  },
  methods: {
    openPopup() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    openTypePopup() {
      this.linkTypePopup = !this.linkTypePopup;
    },
    changeLinkInput() {
      this.linkSaved = true;
      setTimeout(() => {
        this.linkSaved = false;
      }, 2000);
    },
    changeLink(value: string) {
      this.popupData.setLinkValue(value);
    },
    changeLinkOpenType(name: string) {
      const type = name === 'New Tab' ? OpenLinkType.Blank : null;
      this.popupData.changeLinkParams('openType', type);
    },
    changeValue() {
      const expression = regexValidation[this.linkType];
      const regex = new RegExp(expression);
      if (!regex.test(this.inputValue) && !!this.inputValue.length) {
        this.isError = true;
        return;
      }
      this.changeLink(this.inputValue);
      this.changeLinkInput();
    },
    chooseType(type: LinkType) {
      this.$nextTick(() => {
        this.linkTypePopup = false;
        if (this.linkType === type) return;
        this.linkType = type;
        this.popupData.setLinkType(type);
        this.inputValue = '';
      });
    },
    setActiveItem(item: any) {
      this.popupData.setActive(item);
    }
  }
});
</script>

<style lang="scss">
.link-popup {
  width: 240px;

  &__field {
    position: relative;
    display: block;
    &-icon {
      position: absolute;
      z-index: 9999;
      right: 7px;
      top: 13px;
      opacity: 0;
      transition: all 0.3s ease;
      &.active {
        opacity: 1;
      }
    }

    &-error {
      position: absolute;
      right: 0;
      top: -5px;
      transform: translate(0, -100%);
      font-size: 10px;
      line-height: 1;
      color: $danger;
      opacity: 0;
      visibility: hidden;
      transition: 0.3s;

      &.isError {
        opacity: 1;
        visibility: visible;
      }
    }
  }
}

.link-type-popup {
  position: relative;
  &__head {
    width: 136px;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 20px 0;
    position: relative;

    &--auto-width {
      width: auto;
    }

    &:after {
      content: '';
      left: -14px;
      top: -11px;
      position: absolute;
      background: $gray100;
      border-radius: $shape_border_radius;
      width: 100%;
      height: 100%;
      padding: 11px 14px;
      opacity: 0;
      visibility: hidden;
      transition: 0.3s;
    }

    span {
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: #4356be;
      margin: 0 15px 0 10px;
      text-transform: capitalize;
      position: relative;
      z-index: 2;
    }

    svg {
      position: relative;
      z-index: 2;

      &:nth-child(3) {
        margin: 0 0 0 auto;
      }

      path {
        fill: $color_drop_active_item_text;
      }
    }

    &:hover {
      &:after {
        opacity: 1;
        visibility: visible;
      }
    }
  }
}
.dte-input {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  padding: 0 8px;
  max-width: 240px;
  width: 100%;
  height: 34px;
  background: $white;
  border: 1px solid $gray100;
  box-sizing: border-box;
  border-radius: 4px;
  color: $black;
  margin-bottom: 12px;
  transition: 0.3s;

  &:hover {
    border-color: $gray400;
  }

  &:focus {
    border-color: $blue200;
  }

  &.isError {
    border-color: $danger;
  }
}
.dte-input::placeholder {
  color: #bdc2c7;
}
.link-dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 6px 9px;
  margin: 0 0 12px;
  border: 1px solid $gray100;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    border-color: $gray400;
  }

  &_wrap {
    display: flex;
    align-items: center;
  }

  &_text {
    font-size: 13px;
    line-height: 15px;

    &--gray {
      margin: 0 0 0 6px;
      opacity: 0.4;
    }
  }
}
.popup-dropdown {
  position: relative;
  &__body {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    width: 100%;
    max-height: 300px;
  }
}
</style>

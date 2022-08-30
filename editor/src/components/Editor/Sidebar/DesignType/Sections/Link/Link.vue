<!--<template>-->
<!--  <div-->
<!--    class="design-text-editor__section design-text-editor__collapse dte-link"-->
<!--    :class="{ 'design-text-editor__collapse_opened': !isLinkTypeNone }"-->
<!--    ref="popupButton"-->
<!--  >-->
<!--    <div-->
<!--      :class="{ disable: isLinkTypeNone }"-->
<!--      class="design-text-editor__head"-->
<!--      @click.stop="chooseType(isLinkTypeNone ? LinkType.URL : LinkType.None)"-->
<!--    >-->
<!--      <span>Link</span>-->

<!--      <button class="design-text-editor__button">-->
<!--        <TogglePanelIcon :isPanelActive="!isLinkTypeNone" />-->
<!--      </button>-->
<!--    </div>-->
<!--    <div v-if="!isLinkTypeNone" class="design-text-editor__content">-->
<!--      <div class="link-type-popup-wrap">-->
<!--        <div @click="linkTypePopup = true" class="lint-type-popup__head">-->
<!--          <svg-icon-->
<!--            :name="`${linkType.toLowerCase()}-icon`"-->
<!--            :width="iconSizeSettings[linkType].width"-->
<!--            :height="iconSizeSettings[linkType].height"-->
<!--            color="#4356BE"-->
<!--          />-->
<!--          <span :style="linkType === LinkType.URL ? { textTransform: 'uppercase' } : {}">-->
<!--            {{ linkType }}-->
<!--          </span>-->
<!--          <svg-icon name="arrow-down-icon" width="9" height="5" color="#4356be" />-->
<!--        </div>-->
<!--      </div>-->
<!--      <transition name="popup-layer">-->
<!--        <link-type-popup-->
<!--          v-click-outside="() => (linkTypePopup = false)"-->
<!--          @chooseType="chooseType"-->
<!--          v-if="linkTypePopup"-->
<!--          :active-type="linkType"-->
<!--          :icons="iconSizeSettings"-->
<!--        />-->
<!--      </transition>-->
<!--      <label v-if="isSimpleLinks" class="link-input-wrap">-->
<!--        <span-->
<!--          v-if="linkType === LinkType.URL || linkType === LinkType.Download"-->
<!--          :class="{ isError }"-->
<!--          class="link-input-wrap__error"-->
<!--        >-->
<!--          Invalid URL-->
<!--        </span>-->
<!--        <span-->
<!--          v-if="linkType === LinkType.Email"-->
<!--          :class="{ isError }"-->
<!--          class="link-input-wrap__error"-->
<!--        >-->
<!--          Invalid email-->
<!--        </span>-->
<!--        <input-->
<!--          ref="url"-->
<!--          v-model="inputValue"-->
<!--          @keydown.enter="changeValue"-->
<!--          @keydown="isError = false"-->
<!--          @blur="changeValue"-->
<!--          :class="{ isError }"-->
<!--          class="dte-input"-->
<!--          type="text"-->
<!--          :placeholder="inputPlaceholder[linkType]"-->
<!--        />-->
<!--        <svg-icon-->
<!--          name="check-mark-icon"-->
<!--          width="10"-->
<!--          height="8"-->
<!--          color="#53B71B"-->
<!--          :class="{ active: linkSaved }"-->
<!--          class="link-input-icon"-->
<!--        />-->
<!--      </label>-->
<!--&lt;!&ndash;      <div v-else class="link-dropdown" @click="openPopup">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="link-dropdown_wrap">&ndash;&gt;-->
<!--&lt;!&ndash;          <p class="link-dropdown_text">{{ isPage ? 'Page ID:' : 'Block ID:' }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;          <p class="link-dropdown_text link-dropdown_text&#45;&#45;gray">{{ activePage }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <svg-icon name="chevron-down" width="7" height="5" color="#000" />&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--      <switcher :switcher-items="switcherItems" @filterName="changeLinkOpenType" />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import Vue from 'vue';-->

<!--import LinkTypePopup from '../../../Modal/components/LinkPopup/LinkTypePopup.vue';-->
<!--import TogglePanelIcon from '@/components/Editor/Sidebar/DesignType/Sections/TogglePanelIcon.vue';-->
<!--import Switcher from '@/components/Editor/Sidebar/Switcher.vue';-->

<!--import { mapGetters, mapState } from 'vuex';-->
<!--import ObjectKeys from '@/utils/types/ObjectKeys';-->
<!--import { formatLink } from '@/helpers/formatLink';-->
<!--import { LinkType, OpenLinkType, PayloadLink } from '@/constants/link';-->
<!--import { LinkPopupData, PopupContainerType, PopupSettings, PopupType } from '../../../Modal/types';-->
<!--import { BaseProjectPageDto } from '@/utils/api';-->

<!--const linkReg = new RegExp(-->
<!--  /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi-->
<!--);-->

<!--const regexValidation: ObjectKeys<RegExp> = {-->
<!--  [LinkType.URL]: linkReg,-->
<!--  [LinkType.Email]: new RegExp(-->
<!--    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/-->
<!--  ),-->
<!--  [LinkType.Download]: linkReg,-->
<!--  [LinkType.Phone]: new RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)-->
<!--};-->

<!--const iconSizeSettings: ObjectKeys<ObjectKeys<string | number>> = {-->
<!--  [LinkType.URL]: {-->
<!--    width: 12,-->
<!--    height: 12,-->
<!--    color: '#333'-->
<!--  },-->
<!--  [LinkType.Block]: {-->
<!--    width: 12,-->
<!--    height: 12,-->
<!--    color: '#333'-->
<!--  },-->
<!--  [LinkType.Page]: {-->
<!--    width: 12,-->
<!--    height: 12,-->
<!--    color: '#333'-->
<!--  },-->
<!--  [LinkType.Email]: {-->
<!--    width: 12,-->
<!--    height: 12,-->
<!--    color: '#333'-->
<!--  },-->
<!--  [LinkType.Phone]: {-->
<!--    width: 12,-->
<!--    height: 13,-->
<!--    color: '#333'-->
<!--  },-->
<!--  [LinkType.Download]: {-->
<!--    width: 12,-->
<!--    height: 15,-->
<!--    color: '#333'-->
<!--  }-->
<!--}-->

<!--export default Vue.extend({-->
<!--  components: {-->
<!--    LinkTypePopup,-->
<!--    TogglePanelIcon,-->
<!--    Switcher,-->
<!--  },-->
<!--  props: {-->
<!--    value: {-->
<!--      type: Object,-->
<!--      default: () => ({})-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      LinkType,-->
<!--      linkTypePopup: false,-->
<!--      linkSaved: false,-->
<!--      inputValue: this.value.payload.link.value ?? '',-->
<!--      isError: false,-->
<!--      switcherItems: [-->
<!--        {-->
<!--          name: 'Current Tab',-->
<!--          icon: 'current-page-icon',-->
<!--          iconWidth: 13,-->
<!--          iconHeight: 12,-->
<!--          iconColor: '#000'-->
<!--        },-->
<!--        {-->
<!--          name: 'New Tab',-->
<!--          icon: 'new-tab-icon',-->
<!--          iconWidth: 12,-->
<!--          iconHeight: 13,-->
<!--          iconColor: '#000'-->
<!--        }-->
<!--      ],-->
<!--      inputPlaceholder: {-->
<!--        [LinkType.URL]: 'URL address',-->
<!--        [LinkType.Block]: 'Block id',-->
<!--        [LinkType.Page]: 'Page id',-->
<!--        [LinkType.Email]: 'Email address',-->
<!--        [LinkType.Phone]: 'Phone number',-->
<!--        [LinkType.Download]: 'Download link'-->
<!--      } as ObjectKeys<string>,-->
<!--      iconSizeSettings-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    //support for old components-->
<!--    if (this.value.payload.link.openType == 'new') this.changeLinkParams('openType', null);-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapState({-->
<!--      projectPages: (state: any) => <BaseProjectPageDto[]>state.project.projectPages,-->
<!--      userConfig: (state: any) => state.editor.userConfig-->
<!--    }),-->
<!--    ...mapGetters({-->
<!--      blocksSortedBySortId: 'editor/blocksSortedBySortId'-->
<!--    }),-->
<!--    linkType(): LinkType {-->
<!--      const { type } = this.value.payload.link;-->
<!--      if (type == 'url') return LinkType.URL;-->

<!--      return type;-->
<!--    },-->
<!--    isLinkTypeNone(): boolean {-->
<!--      return this.linkType == LinkType.None;-->
<!--    },-->
<!--    isSimpleLinks(): boolean {-->
<!--      return (-->
<!--        this.linkType === LinkType.Email ||-->
<!--        this.linkType === LinkType.URL ||-->
<!--        this.linkType === LinkType.Phone ||-->
<!--        this.linkType === LinkType.Download-->
<!--      );-->
<!--    },-->
<!--    isPage(): boolean {-->
<!--      return this.linkType === LinkType.Page;-->
<!--    },-->
<!--    activePage(): string {-->
<!--      return !this.inputValue ? 'Unset' : this.inputValue;-->
<!--    },-->
<!--  },-->
<!--  methods: {-->
<!--    changeLinkInput() {-->
<!--      this.linkSaved = true;-->
<!--      setTimeout(() => {-->
<!--        this.linkSaved = false;-->
<!--      }, 2000);-->
<!--    },-->
<!--    changeLinkParams(path: keyof PayloadLink, data: any) {-->
<!--      this.$store.commit('editor/changeElementsLinkParams', {-->
<!--        id: this.value.id,-->
<!--        path,-->
<!--        value: data-->
<!--      });-->
<!--    },-->
<!--    changeLink(value: string, url?: string) {-->
<!--      this.changeLinkParams('value', value);-->
<!--      this.changeLinkParams('url', formatLink(url ?? value, this.linkType));-->
<!--    },-->
<!--    changeLinkOpenType(name: string) {-->
<!--      const type = name === 'New Tab' ? OpenLinkType.Blank : null;-->
<!--      this.changeLinkParams('openType', type);-->
<!--    },-->
<!--    changeValue() {-->
<!--      const expression = regexValidation[this.linkType];-->
<!--      const regex = new RegExp(expression);-->
<!--      if (!regex.test(this.inputValue) && !!this.inputValue.length) {-->
<!--        this.isError = true;-->
<!--        return;-->
<!--      }-->
<!--      this.changeLink(this.inputValue);-->
<!--      this.changeLinkInput();-->
<!--    },-->
<!--    chooseType(type: LinkType) {-->
<!--      this.linkTypePopup = false;-->
<!--      if (this.linkType === type) return;-->
<!--      this.changeLink('');-->
<!--      this.changeLinkParams('type', type);-->
<!--      this.inputValue = '';-->
<!--    }-->
<!--  }-->
<!--});-->
<!--</script>-->

<!--<style lang="scss">-->
<!--.link-type-popup-wrap {-->
<!--  display: table;-->
<!--}-->
<!--.link-input-wrap {-->
<!--  position: relative;-->
<!--  display: block;-->
<!--  .link-input-icon {-->
<!--    position: absolute;-->
<!--    z-index: 9999;-->
<!--    right: 7px;-->
<!--    top: 13px;-->
<!--    opacity: 0;-->
<!--    transition: all 0.3s ease;-->
<!--    &.active {-->
<!--      opacity: 1;-->
<!--    }-->
<!--  }-->

<!--  &__error {-->
<!--    position: absolute;-->
<!--    right: 0;-->
<!--    top: -5px;-->
<!--    transform: translate(0, -100%);-->
<!--    font-size: 10px;-->
<!--    line-height: 1;-->
<!--    color: $danger;-->
<!--    opacity: 0;-->
<!--    visibility: hidden;-->
<!--    transition: 0.3s;-->

<!--    &.isError {-->
<!--      opacity: 1;-->
<!--      visibility: visible;-->
<!--    }-->
<!--  }-->
<!--}-->
<!--.dte-link .design-text-editor__content {-->
<!--  position: relative;-->
<!--}-->
<!--.dte-link .design-text-editor__head {-->
<!--  position: unset !important;-->
<!--}-->
<!--.dte-link__add {-->
<!--  position: absolute;-->
<!--  right: 28px;-->
<!--  display: flex;-->
<!--  svg {-->
<!--    position: unset !important;-->
<!--  }-->
<!--}-->
<!--.design-text-editor__head.disable {-->
<!--  .design-text-editor__head-icon {-->
<!--    transform: rotate(-90deg);-->
<!--  }-->
<!--}-->
<!--.lint-type-popup {-->
<!--  &__head {-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--    cursor: pointer;-->
<!--    margin: 20px 0;-->
<!--    position: relative;-->

<!--    &:after {-->
<!--      content: '';-->
<!--      left: -14px;-->
<!--      top: -11px;-->
<!--      position: absolute;-->
<!--      background: $gray100;-->
<!--      border-radius: $shape_border_radius;-->
<!--      width: 100%;-->
<!--      height: 100%;-->
<!--      padding: 11px 14px;-->
<!--      opacity: 0;-->
<!--      visibility: hidden;-->
<!--      transition: 0.3s;-->
<!--    }-->

<!--    span {-->
<!--      font-style: normal;-->
<!--      font-weight: normal;-->
<!--      font-size: 12px;-->
<!--      line-height: 14px;-->
<!--      color: #4356be;-->
<!--      margin: 0 15px 0 10px;-->
<!--      text-transform: capitalize;-->
<!--      position: relative;-->
<!--      z-index: 2;-->
<!--    }-->

<!--    svg {-->
<!--      position: relative;-->
<!--      z-index: 2;-->
<!--      path {-->
<!--        fill: $color_drop_active_item_text;-->
<!--      }-->
<!--    }-->

<!--    &:hover {-->
<!--      &:after {-->
<!--        opacity: 1;-->
<!--        visibility: visible;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--.dte-input {-->
<!--  font-style: normal;-->
<!--  font-weight: normal;-->
<!--  font-size: 12px;-->
<!--  line-height: 14px;-->
<!--  padding: 0 8px;-->
<!--  max-width: 240px;-->
<!--  width: 100%;-->
<!--  height: 34px;-->
<!--  background: $white;-->
<!--  border: 1px solid $gray100;-->
<!--  box-sizing: border-box;-->
<!--  border-radius: 4px;-->
<!--  color: $black;-->
<!--  margin-bottom: 12px;-->
<!--  transition: 0.3s;-->

<!--  &:hover {-->
<!--    border-color: $gray400;-->
<!--  }-->

<!--  &:focus {-->
<!--    border-color: $blue200;-->
<!--  }-->

<!--  &.isError {-->
<!--    border-color: $danger;-->
<!--  }-->
<!--}-->
<!--.dte-input::placeholder {-->
<!--  color: #bdc2c7;-->
<!--}-->
<!--.link-dropdown {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: space-between;-->
<!--  padding: 8px 14px 9px 6px;-->
<!--  margin: 0 0 12px;-->
<!--  border: 1px solid $gray100;-->
<!--  border-radius: 4px;-->
<!--  cursor: pointer;-->
<!--  transition: 0.3s;-->

<!--  &:hover {-->
<!--    border-color: $gray400;-->
<!--  }-->

<!--  &_wrap {-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--  }-->

<!--  &_text {-->
<!--    font-size: 13px;-->
<!--    line-height: 15px;-->

<!--    &&#45;&#45;gray {-->
<!--      margin: 0 0 0 6px;-->
<!--      opacity: 0.4;-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->

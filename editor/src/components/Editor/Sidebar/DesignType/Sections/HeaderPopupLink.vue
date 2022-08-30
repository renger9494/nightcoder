<template>
  <div ref="popupButton" class="header-popup-link" @click="openPopup">
    <p class="header-popup-link__text">{{ !!inputValue ? 'Linked' : 'Add Link' }}</p>
    <svg-icon name="link" width="24" height="24" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {BaseProjectPageDto} from "@/utils/api";
import {LinkPopupData, PopupContainerType, PopupSettings, PopupType} from "@/components/Editor/Sidebar/Modal/types";
import {LinkType, PayloadLink} from "@/constants/link";
import {formatLink} from "@/helpers/formatLink";
import {mapGetters, mapState} from "vuex";

export default Vue.extend({
  name: 'HeaderPopupLink',
  data() {
    return {
      LinkType,
    }
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState({
      projectPages: (state: any) => <BaseProjectPageDto[]>state.project.projectPages
    }),
    ...mapGetters({
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    }),
    isPage(): boolean {
      return this.linkType === LinkType.Page;
    },
    linkType(): LinkType {
      const { type } = this.value.payload.link;
      if (type == 'url') return LinkType.URL;
      if (!type) return LinkType.None;

      return type;
    },
    inputValue(): string {
      return this.value.payload.link.value ?? ''
    }
  },
  methods: {
    changeLinkParams(path: keyof PayloadLink, value: any, isSaveHistory: boolean = true) {
      this.$store.commit('editor/changeElementsLinkParams', {
        id: this.value.id,
        path,
        value,
        isSaveHistory
      });
    },
    setLinkType(value: string) {
      this.changeLinkParams('type', value);
      this.changeLinkParams('value', '', false);
      this.changeLinkParams('url', '', false);
    },
    setLinkValue(url: string) {
      this.changeLinkParams('value', url, false);
      this.changeLinkParams('url', formatLink(url, this.linkType), false);
    },
    changeLink(value: string, url?: string) {
      this.changeLinkParams('value', value);
      this.changeLinkParams('url', formatLink(url === undefined ? value : url, this.linkType), false);
    },
    openPopup() {
      const { commit } = this.$store;
      const popupButton = this.$refs.popupButton as HTMLButtonElement | null;
      const setActive = (element: BaseProjectPageDto | { id: string }) => {
        commit('editor/SET_POPUP_SETTINGS', { active: false });
        let url: string | undefined = undefined;
        if (this.isPage) {
          const page = <BaseProjectPageDto>element;
          url = page.isHomePage ? '/' : `/${page.url}`;
        }
        const id = element.id.toString();
        this.changeLink(id, url);
      };
      const { pageId } = this.$route.params;
      const projectPagesExcludedCurrentPage =  this.projectPages.filter(item => `${item.id}` !== pageId);
      const popupSettings: PopupSettings<LinkPopupData> = {
        active: true,
        closeButton: true,
        header: this.isPage ? 'Pages' : 'Blocks',
        content: PopupType.Link,
        container: PopupContainerType.LargePaddings,
        location: popupButton?.getBoundingClientRect(),
        data: {
          isUnderHeader: false,
          isNextToSidebar: true,
          pages: projectPagesExcludedCurrentPage,
          blocks: this.blocksSortedBySortId,
          activeId: this.inputValue,
          setActive: setActive,
          changeLinkParams: this.changeLinkParams,
          setLinkType: this.setLinkType,
          setLinkValue: this.setLinkValue,
          linkType: this.linkType,
          openType: this.value.payload.link.openType,
          inputValue: this.inputValue
        }
      };
      commit('editor/SET_POPUP_SETTINGS', popupSettings);
    }
  }
});
</script>

<style lang="scss" scoped>
.header-popup-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 0 0 8px;
  border-radius: $shape_border_radius;
  transition: 0.3s;

  &:hover {
    background: $gray100;
  }

  &__text {
    font-size: 12px;
    line-height: 16px;
    margin: 0 5px 0 0;
  }
}
</style>

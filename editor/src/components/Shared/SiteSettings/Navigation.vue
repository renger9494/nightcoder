<template>
  <aside class="navigation">
    <div class="navigation__select">
      <div class="navigation__select-title" @click.prevent="toggleDropdown" v-click-outside="() => (dropDown = false)">
        <span>{{ pages.length }} {{ pages.length === 1 ? 'page:' : 'pages:' }}</span>
        <span v-if="mode === 'site'">Choose</span>
        <span v-else style="color: #000" class="page-name">{{ currentPage.name }}</span>
        <svg-icon
          class="navigation__select-icon"
          :class="{ 'navigation__select-icon--open': dropDown }"
          name="arrow-down-icon"
          width="9"
          height="5"
          color="#333"
        />
        <ul class="navigation__select-list" :class="{ 'navigation__select-list--open': dropDown }">
          <li v-for="page in pages" :key="page.id" class="navigation__select-item">
            <a
              class="navigation__link"
              href="#"
              :class="currentPage && currentPage.id == page.id && mode === 'page' ? 'selected' : ''"
              @click.prevent="setPageMode(page, page.name)"
            >
              <svg-icon v-if="page.isHomePage" name="home-page-icon" width="12" height="12" color="#333" />
              <span>{{ page.name || 'Unnamed Page' }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="navigation__menu" v-if="mode === 'site'">
      <a
        class="navigation__link"
        :class="{ navigation__link_active: activeSection === SectionType.GENERAL }"
        @click="changeActiveSection(SectionType.GENERAL, $event)"
      >
        <div class="navigation__link-icon-wrapper">
          <svg-icon name="start-stroke-icon" width="15" height="14" color="#333" />
        </div>
        <span>General</span>
      </a>
      <a
        class="navigation__link"
        :class="{ navigation__link_active: activeSection === SectionType.FAVICON }"
        @click="changeActiveSection(SectionType.FAVICON, $event)"
      >
        <div class="navigation__link-icon-wrapper">
          <svg-icon name="circle" width="14" height="14" color="#333" />
        </div>
        <span>Favicon</span>
      </a>
      <a
        class="navigation__link"
        :class="{ navigation__link_active: activeSection === SectionType.DOMAIN }"
        @click="changeActiveSection(SectionType.DOMAIN, $event)"
      >
        <div class="navigation__link-icon-wrapper">
          <svg-icon name="publish-icon" width="14" height="14" color="#333" />
        </div>
        <span>Domain</span>
      </a>
      <a
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === SectionType.INTEGRATIONS
        }"
        @click="changeActiveSection(SectionType.INTEGRATIONS, $event)"
      >
        <div class="navigation__link-icon-wrapper">
          <svg-icon name="integration-icon" width="15" height="14" color="#333" />
        </div>
        <span>Analytics</span>
      </a>
      <a
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === SectionType.BRANDING
        }"
        @click="changeActiveSection(SectionType.BRANDING, $event)"
      >
        <div class="navigation__link-icon-wrapper">
          <svg-icon name="branding-icon" width="18" height="14" color="#333" />
        </div>
        <span>Airtap Branding</span>
      </a>
      <a
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === SectionType.TRANSFER
        }"
        @click="changeActiveSection(SectionType.TRANSFER, $event)"
      >
        <div class="navigation__link-icon-wrapper">
          <svg-icon width="20" height="20" color="#000" name="transfer" />
        </div>
        <span>Project action</span>
      </a>
      <a
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === SectionType.HOME_PAGE
        }"
        @click="changeActiveSection(SectionType.HOME_PAGE, $event)"
      >
        <div class="navigation__link-icon-wrapper">
          <svg-icon name="home-page-icon" width="12" height="12" color="#333" />
        </div>
        <span>Home Page</span>
      </a>
    </div>
    <div class="navigation__menu" v-else>
      <a
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === SectionType.PAGE_GENERAL
        }"
        @click="changeActiveSection(SectionType.PAGE_GENERAL, $event)"
      >
        <div class="navigation__link-icon-wrapper">
          <svg-icon name="start-stroke-icon" width="15" height="14" color="#333" />
        </div>
        <span>General</span>
      </a>
      <a
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === SectionType.PAGE_SEO
        }"
        @click="changeActiveSection(SectionType.PAGE_SEO, $event)"
      >
        <div class="navigation__link-icon-wrapper">
          <svg-icon name="seo-icon" width="11" height="14" color="#333" />
        </div>
        <span>SEO</span>
      </a>
      <a
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === SectionType.PAGE_SSI
        }"
        @click="changeActiveSection(SectionType.PAGE_SSI, $event)"
      >
        <div class="navigation__link-icon-wrapper">
          <svg-icon name="ssi-icon" width="14" height="11" color="#333" />
        </div>
        <span>Open graph</span>
      </a>
      <!--      <a-->
      <!--        class="navigation__link"-->
      <!--        :class="{-->
      <!--          navigation__link_active: activeSection === SectionType.BRANDING,-->
      <!--        }"-->
      <!--        @click="changeActiveSection(SectionType.BRANDING, $event)"-->
      <!--      >-->
      <!--        <div class="navigation__link-icon-wrapper">-->
      <!--          <branding-icon />-->
      <!--        </div>-->
      <!--        <span>Airtap Branding</span>-->
      <!--      </a>-->
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { SectionType, SiteSettingsState } from '@/store/siteSettings';

export default Vue.extend({
  data() {
    return {
      SectionType,
      dropDown: false,
      activePage: ''
    };
  },
  props: {
    activeSection: {
      type: Number,
      required: true
    },
    changeActiveSection: {
      type: Function,
      required: true
    },
    currentPage: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      pages: (state: any) => (<SiteSettingsState>state.siteSettings).projectPages,
      mode: (state: any) => (<SiteSettingsState>state.siteSettings).mode
    })
  },
  methods: {
    setPageMode(page: { projectId: number; id: number }, name: string | undefined) {
      this.activePage = name || '';
      this.$store.dispatch('siteSettings/setPage', { page });
    },
    toggleDropdown(): any {
      this.dropDown = !this.dropDown;
    }
  }
});
</script>

<style lang="scss" scoped>
.navigation {
  padding: 0 10px 36px 30px;
  align-self: flex-start;
  position: sticky;
  top: 0;
  &__title {
    font-size: 12px;
    line-height: 14px;
    color: #61657e;
    padding-left: 10px;
    margin-bottom: 20px;
  }
  @include sm-down {
    border-right: none;
    border-bottom: 1px solid #dadada;
    padding-top: 16px;
    padding-bottom: 20px;
  }

  &__menu {
    margin-bottom: 16px;

    @include sm-down {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 13px;
    }
  }

  &__link {
    min-width: 190px;
    display: flex;
    align-items: center;
    text-decoration: none;
    border-radius: $shape_border_radius;
    padding: 7px 14px;
    margin-bottom: 10px;
    transition: 0.3s;
    box-sizing: border-box;
    cursor: pointer;

    @include sm-down {
      min-width: initial;
      max-width: 171px;
    }

    &:hover {
      background-color: #f2f2f2;

      span {
        color: #000000 !important;
      }

      svg path {
        fill: #000000;
      }
      svg circle {
        stroke: #000000;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    &_active {
      background-color: #f2f2f2;

      span {
        color: #000000;
      }

      svg path {
        fill: #000000;
      }
      svg circle {
        stroke: #000000;
      }
    }

    &.selected {
      background-color: #f2f2f2;
      span {
        color: $lilac !important;
      }
      svg {
        path {
          fill: $lilac;
        }
      }
    }

    span {
      color: #333333;
      transition: 0.3s;
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
    }

    svg path {
      fill: #333;
    }

    svg {
      margin: 0 11px 0 0;
      height: 15px;
      width: 15px;
      transition: 0.3s;
    }
  }

  &__link-icon-wrapper {
    display: flex;
    align-items: center;
    min-width: 26px;
  }

  &__select {
    border: 1px solid $gray100;
    box-shadow: 0 2px 4px rgba(57, 61, 69, 0.06);
    border-radius: 6px;
    position: relative;
    margin: 0 0 20px;
    transition: 0.3s;

    &:hover {
      border-color: $gray400;
    }

    &-list {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background: $white;
      border: 1px solid #ebebeb;
      box-shadow: 0 8px 18px -6px rgba(24, 39, 75, 0.12), 0 12px 42px -4px rgba(24, 39, 75, 0.12);
      border-radius: 6px;
      padding: 6px;
      box-sizing: border-box;
      transition: 0.3s;
      visibility: hidden;
      opacity: 0;
      max-height: 200px;
      overflow-y: scroll;
      transform: translate(0, calc(100% + 6px));

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

      .navigation__link {
        margin: 0;
        width: 100%;
        min-width: unset;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        svg {
          vertical-align: sub;
        }

        span {
          color: #000;
        }
      }

      &--open {
        visibility: visible;
        opacity: 1;
      }
    }

    &-item {
      &:not(:last-child) {
        margin: 0 0 1px;
      }
      .navigation__link {
        padding: 8px 16px;
      }
    }

    &-title {
      display: flex;
      align-items: center;
      padding: 9px 14px 10px;
      cursor: pointer;
      transition: 0.3s;
      box-shadow: 0 2px 4px rgba(57, 61, 69, 0.06);

      & > span {
        font-weight: 500;
        font-size: 13px;
        line-height: 15px;
        display: inline-block;
        &:first-child {
          color: $black;
          margin: 0 6px 0 0;
        }
        &:nth-child(2) {
          color: $gray400;
        }
      }

      &:hover {
        box-shadow: 0 2px 6px rgba(57, 61, 69, 0.16);
      }

      .page-name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 90px;
      }
    }

    &-icon {
      position: absolute;
      right: 14px;
      top: 0;
      bottom: 0;
      margin: auto 0;
      width: 10px;
      height: 5px;
      transition: 0.3s;

      &--open {
        transform: scaleY(-1);
      }
    }
  }
}
</style>

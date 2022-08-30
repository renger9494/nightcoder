<template>
  <div class="selectedPages">
    <div
      :class="{
        projectCategory__active: isShowAllPages
      }"
      class="selectedPage"
      @click="showAllPages"
    >
      <div class="selectedPage__header">
        <span>{{ choosedPages }}</span>
        /{{ pages.length }} page{{ pages.length > 1 ? 's' : '' }} selected
      </div>
      <div class="selectedPages__buttomAll">
        <svg-icon v-if="isShowAllPages" width="8" height="5" color="#318BF5" name="vectorUp" />

        <svg-icon v-else width="8" height="5" color="#000" name="vectorDown" />
      </div>
    </div>
    <div class="projectPages" v-if="isShowAllPages" v-click-outside="() => (isShowAllPages = false)">
      <div
        v-for="(page, index) in pages"
        :key="`projectpage_${page.id}`"
        :class="{ projectPages__page__isHome: page.isHomePage }"
        class="projectPages__page"
        @click="selectedPage($event, index)"
      >
        <div class="projectPages__page__checkbox">
          <input type="checkbox" :id="'page__' + page.id" :name="'page__' + page.id" :checked="page.numberPage" />
          <label :for="'page__' + page.id"></label>
          <span class="projectPages__page__numberPage">{{ page.numberPage }}</span>
        </div>
        <picture v-if="page.previewImage">
          <source
            v-if="page.previewImage.fullPathWebP"
            type="image/webp"
            :srcset="page.previewImage.fullPathWebP.replace(' ', '%20')"
          />
          <source
            v-if="page.previewImage.fullPathJp2"
            type="image/jp2"
            :srcset="page.previewImage.fullPathJp2.replace(' ', '%20')"
          />
          <img class="projectPages__page__preview" :src="page.previewImage.fullPath" />
        </picture>

        <img class="projectPages__page__preview" v-else :src="getPlaceholderUrl()" />

        <svg-icon
          class="projectPages__page__home"
          v-if="page.isHomePage"
          width="16"
          height="16"
          color="#000000"
          name="home-page-icon"
        />
        <span class="projectPages__page-text" for="community"> {{ page.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BaseProjectPageDto } from '@/utils/api';
import { getPlaceholderUrl } from '@/utils/images';
type ProjectPage = BaseProjectPageDto & { numberPage: number | undefined };

export default Vue.extend({
  components: {},

  props: {
    pages: {
      type: Array as PropType<ProjectPage[]>,
      required: true
    },
    choosedPages: Number
  },
  data() {
    return {
      isShowAllPages: false
    };
  },
  computed: {
    placeholder() {
      return process.env.VUE_APP_BUCKET_NAME + '/Defaults/placeholder.svg';
    }
  },
  methods: {
    getPlaceholderUrl() {
      return getPlaceholderUrl();
    },
    showAllPages() {
      this.isShowAllPages = !this.isShowAllPages;
    },
    selectedPage($event: Event, index: number) {
      this.$emit('changedPublished', index);
      $event.stopPropagation();
      $event.preventDefault();
    }
  }
});
</script>

<style lang="scss" scoped>
.selectedPages {
  position: relative;
  cursor: pointer;
  &__buttomAll {
    height: 100%;
    width: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
.selectedPage {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 9px 8px;
  margin-bottom: 20px;
  width: 100%;
  height: 37px;
  border: 1px solid #f3f3f3;
  background: #ffffff;
  border-radius: 4px;
  transition: 0.3s;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: #828282;
    span {
      color: #000000;
    }
  }

  &:hover,
  &__active {
    border: 1px solid #318bf5;
  }
}
.projectPages {
  overflow-y: scroll;
  z-index: 999;
  top: 41px;

  position: absolute;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 212px;
  width: 100%;
  background: #ffffff;
  padding: 9px;
  border: 1px solid #dadada;
  box-shadow: 0px 10px 20px rgba(9, 9, 9, 0.15);
  border-radius: 4px;
  &::-webkit-scrollbar {
    width: 3px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #dadada;
    height: 30px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track-piece {
    display: none;
  }

  &__page {
    width: 100%;
    padding: 6px;
    align-items: center;
    height: 36px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    flex-wrap: nowrap;
    position: relative;
    &__isHome {
      pointer-events: none;
    }
    &__name {
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      max-width: calc(100% - 73px);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    &:hover {
      background: #f3f3f3;
    }
    &__preview {
      width: 30px;
      height: 24px;
      border-radius: 6px;
      object-fit: cover;
      margin-right: 8px;
      margin-left: 8px;
    }
    &__home {
      margin-right: 5px;
    }
    &-text {
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
    }
    &__checkbox {
      width: 15px;
      height: 15px;
      position: relative;
      margin-right: 10px;
      display: flex;

      label {
        display: none;
      }
    }
    &__numberPage {
      position: absolute;
      color: #ffffff;
      font-size: 10px;
      top: 0;
      width: 17px;
      text-align: center;
    }
    input {
      position: absolute;
      z-index: -1;
      opacity: 0;

      & + label {
        display: inline-flex;
        align-items: center;
        user-select: none;
      }
      & + label::before {
        content: '';
        display: inline-block;
        width: 15px;
        height: 15px;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1px solid #dadada;
        border-radius: 2px;

        color: #ffffff;
      }
      &:checked + label::before {
        border-color: #000000;
        background-color: #000000;
        color: #ffffff;
      }
      & + label:hover::before {
        cursor: pointer;
      }
    }
  }
}
</style>

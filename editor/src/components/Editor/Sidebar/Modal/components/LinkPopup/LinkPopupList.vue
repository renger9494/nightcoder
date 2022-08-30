<template>
  <div class="link-popup-list">
    <div
      class="link-popup-list__item"
      :class="{ 'link-popup-list__item--block': !isPage, active: item.id === activeId }"
      v-for="(item, index) in list"
      :key="index"
      @click="setActive(item)"
    >
      <div class="link-popup-list__item-top">
        <p class="link-popup-list__item-text">{{ item.name }}</p>
        <p class="link-popup-list__item-id">{{ item.id }}</p>
      </div>
      <div class="link-popup-list__item-img" v-if="isPage" :class="{ active: item.id == activeId }">
        <picture v-if="item.previewImage">
          <source
            v-if="item.previewImage.fullPathWebP"
            type="image/webp"
            :srcset="item.previewImage.fullPathWebP.replace(' ', '%20')"
          />
          <source
            v-if="item.previewImage.fullPathJp2"
            type="image/jp2"
            :srcset="item.previewImage.fullPathJp2.replace(' ', '%20')"
          />
          <img :src="item.previewImage.fullPath" alt="img" />
        </picture>

        <img alt="img" v-else src="/img/projects/placeholder.svg" />
      </div>
    </div>
    <div class="link-popup-list__empty" v-if="!list.length">You don't have published pages</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LinkPopupList',
  props: {
    isPage: {
      required: true,
      type: Boolean
    },
    pages: {
      required: true,
      type: Array
    },
    blocks: {
      required: true,
      type: Array
    },
    activeId: {
      required: true,
      type: String
    }
  },
  computed: {
    list(): any[] {
      return this.isPage ? this.pages.filter((item: any) => item.isPublished) : this.blocks;
    }
  },
  methods: {
    setActive(item: any) {
      this.$emit('setActiveItem', item);
    }
  }
});
</script>

<style lang="scss" scoped>
.link-popup-list {
  padding: 8px $padding_xl;
  background: $white;
  border: 1px solid $gray100;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  overflow: auto;

  &::-webkit-scrollbar {
    width: 2px;
    height: 7px;
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

  &__item {
    cursor: pointer;
    &:not(:last-child) {
      margin: 0 0 18px;
    }
    &--block {
      padding: 10px;
      margin: 0 -10px !important;
      border-radius: $shape_border_radius;
      transition: 0.3s;

      &:hover {
        background: $gray100;
      }

      &.active {
        .link-popup-list__item-text,
        .link-popup-list__item-id {
          color: $blue200;
        }
      }
      .link-popup-list__item-text {
        color: $black;
      }
      .link-popup-list__item-top {
        margin: 0;
      }
    }
    &-top {
      margin: 0 0 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &-text {
      font-size: 12px;
      line-height: 16px;
      text-transform: capitalize;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 85%;
    }
    &-id {
      font-size: 10px;
      line-height: 12px;
      color: $gray400;
    }
    &-img {
      width: 120px;
      height: 70px;
      border: 1px solid $gray400;
      border-radius: $shape_border_radius;
      position: relative;
      overflow: hidden;

      img {
        max-width: 100%;
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &.active {
        border-color: $blue200;
        &:after {
          content: '';
          position: absolute;
          right: -7px;
          top: -8px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: $blue200;
        }
      }
    }
  }
  &__empty {
    font-weight: 500;
    font-size: 16px;
    line-height: 25px;
    color: $black;
  }
}
</style>

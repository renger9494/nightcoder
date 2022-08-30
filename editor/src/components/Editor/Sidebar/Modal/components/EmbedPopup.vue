<template>
  <div class="embed-popup">
    <ul class="embed-popup__list">
      <li
        v-for="(item, index) in embedList"
        :key="index"
        class="embed-popup__list-item"
        @click="selectEmbedType(item)"
      >
        <svg-icon class="embed-popup__list-icon" :name="item.iconName" width="24" height="24" />
        <p class="embed-popup__list-title">{{ item.title }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { EmbedPopupData, PopupSettings } from '@/components/Editor/Sidebar/Modal/types';
import { embedList } from '@/constants/embed';

export default Vue.extend({
  name: 'EmbedPopup',
  data() {
    return {
      embedList
    };
  },
  computed: {
    ...mapState({
      popupSettings: (state: any) => <PopupSettings<EmbedPopupData>>state.editor.popupSettings
    }),
  },
  methods: {
    selectEmbedType(item: any) {
      const { code, type } = item
      this.popupSettings.data.setEmbedType({ code, type });
    }
  }
});
</script>

<style lang="scss" scoped>
.embed-popup {
  padding: $padding_l 0 0;
  &__list {
    list-style: none;
    &-item {
      padding: 2px;
      display: flex;
      align-items: center;
      border-radius: $shape_border_radius;
      transition: 0.3s;
      width: 150px;
      cursor: pointer;

      &:hover {
        background: $gray100;
      }
    }
    &-title {
      font-size: 12px;
      line-height: 16px;
    }
    &-icon {
      width: 24px;
      height: 24px;
      margin: 0 2px 0 0;
    }
  }
}
</style>

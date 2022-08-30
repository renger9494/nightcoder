<template>
  <div class="type-link-popup">
    <template v-for="(type, index) in Object.keys(LinkType).filter(x => x != _startCase(LinkType.None))">
      <span class="type-link-popup__sep" :key="`${index}_sep`" v-if="index == 3" />
      <div
        :key="index"
        @click="changeType(type, index)"
        :class="['type-link-popup__item', { 'type-link-popup__item--active': activeType === type }]"
      >
        <svg-icon
          :name="`${type.toLowerCase()}-icon`"
          :width="icons[type].width"
          :height="icons[type].height"
          :color="activeType === type ? '#4356BE' : icons[type].color"
        />
        {{ type }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { LinkType } from '@/constants/link';
import { startCase as _startCase } from 'lodash';

export default Vue.extend({
  props: {
    activeType: {
      required: true,
      type: String as PropType<LinkType>
    },
    icons: {
      required: true,
      type: Object
    }
  },
  data: () => ({
    LinkType
  }),
  methods: {
    _startCase,
    changeType(type: string, index: number) {
      this.$emit('chooseType', type, index);
    }
  }
});
</script>

<style lang="scss">
.type-link-popup {
  background: #ffffff;
  border: 1px solid #dadada;
  box-sizing: border-box;
  box-shadow: $shadow_popup;
  border-radius: $shape_border_radius;
  padding: 6px;
  width: 130px;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(0);
  z-index: 999;
  &__item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 30px;
    padding: 0 8px;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: $color_drop_item_text;
    border-radius: $shape_border_radius;
    cursor: pointer;
    transition: 0.3s ease;
    &:hover {
      background: $color_drop_item_bg_hover;
    }
    &:active {
      background: $color_drop_item_bg_focus;
    }
    &--active {
      color: $color_drop_active_item_text;

      svg {
        path {
          fill: $color_drop_active_item_text;
        }
      }
    }
    svg {
      margin-right: 10px;
    }
  }
  &__sep {
    display: block;
    margin: 7px 0;
    background: #f2f2f2;
    width: 100%;
    height: 1px;
  }
}
</style>

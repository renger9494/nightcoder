<template>
  <div class="select-position" v-click-outside="() => (isShowPopup = false)">
    <div class="select-position__active_item" @click="isShowPopup = !isShowPopup">
      <svg-icon
        :name="`${iconName}-position-icon`"
        :width="iconSizes[`${iconName}-position-icon`].width"
        :height="iconSizes[`${iconName}-position-icon`].height"
        :color="iconSizes[`${iconName}-position-icon`].color"
      />
      <span>{{ activeItem.name }}</span>
      <svg-icon name="arrow-down-icon" width="9" height="5" color="#7F7F7F" />
    </div>
    <div v-if="isShowPopup" class="select-position__options">
      <div
        class="select-position__options_item"
        :class="{ active: item == activeItem }"
        v-for="item in items"
        @click="changeItem(item)"
        :key="item.id"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    type: {
      type: String,
      default: 'Horizontal'
    },
    /**
     * object - { id, name }
     */
    activeItem: {
      type: Object,
      required: true,
      default: { name: 'default' }
    },
    /**
     * array of object - [{ id, name }]
     */
    items: {
      type: Array as PropType<{ id: number; name: string }[]>,
      required: true,
      default: []
    }
  },
  data() {
    return {
      isShowPopup: false,
      iconSizes: {
        'horizontal-position-icon': {
          width: 11,
          height: 6,
          color: '#828282'
        },
        'vertical-position-icon': {
          width: 16,
          height: 11,
          color: '#828282'
        }
      }
    };
  },
  computed: {
    iconName(): string {
      return this.type.toLowerCase();
    }
  },
  methods: {
    changeItem(item: { id: number; name: string }) {
      this.$emit('changeItem', item);
    }
  }
});
</script>

<style lang="scss" scoped>
.select-position {
  position: relative;
  &__active_item {
    display: flex;
    align-items: center;
    border-radius: 4px;
    width: 150px;
    height: 30px;
    padding-left: 5px;
    & > * {
      margin-right: 10px;
    }
    & span {
      margin-right: 10px;

      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 16px;
      display: flex;
      align-items: center;
      text-align: center;

      color: #000000;
    }
    &:hover {
      cursor: pointer;
      background: #f3f3f3;
      box-sizing: border-box;
    }
  }

  &__options {
    cursor: pointer;
    top: 32px;
    position: absolute;
    width: 150px;
    background: #ffffff;
    border: 1px solid #dadada;
    box-sizing: border-box;
    box-shadow: 0 10px 20px rgba(9, 9, 9, 0.15);
    border-radius: 4px;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    z-index: 5;

    &_item {
      padding-bottom: 7px;
      padding-left: 24px;
      padding-top: 7px;

      &:first-child {
        padding-top: 13px;
      }

      &:last-child {
        padding-bottom: 13px;
      }

      &:hover {
        background: #f3f3f3;
      }

      &.active {
        color: #4356be;
      }
    }
  }
}
</style>

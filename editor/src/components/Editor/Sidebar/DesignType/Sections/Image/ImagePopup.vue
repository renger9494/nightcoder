<template>
  <div class="image-popup">
    <div class="image-popup__head" @click="changeMenuState(!isMenuOpen)">
      <div class="image-popup__head-icon">
        <svg-icon
          :name="activeItem.icon"
          :width="activeItem.iconWidth"
          :height="activeItem.iconHeight"
          color="#318BF5"
        />
      </div>
      <p>{{ activeItem.name }}</p>
      <svg-icon name="arrow-down-icon" width="9" height="5" color="#318BF5" />
    </div>
    <ul v-if="isMenuOpen" v-click-outside="() => changeMenuState(false)" class="image-popup__list">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="image-popup__list-item"
        :class="{ disabled: item.tooltip, active: activeItem.name === item.name }"
        v-tooltip="item.tooltip"
        @click="chooseType(item)"
      >
        <div class="image-popup__list-icon">
          <svg-icon :name="item.icon" :width="item.iconWidth" :height="item.iconHeight" />
        </div>
        <p class="image-popup__list-text">{{ item.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'ImagePopup',
  props: {
    activeType: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      required: true
    }
  },
  setup(props, { emit }) {
    const isMenuOpen = ref(false as boolean);

    const changeMenuState = (state: boolean) => {
      isMenuOpen.value = state;
    };

    const activeItem = computed(() => props.list.find((item: any) => item.name === props.activeType));

    const chooseType = (type: any) => {
      if (type.tooltip === 'Coming soon') return;
      changeMenuState(false);
      emit('onChange', type);
    };

    return {
      isMenuOpen,
      activeItem,
      chooseType,
      changeMenuState
    };
  }
});
</script>

<style lang="scss" scoped>
.image-popup {
  position: relative;
  &__head {
    display: flex;
    align-items: center;
    height: 32px;
    border-radius: $shape_border_radius;
    font-size: 13px;
    line-height: 15px;
    width: 100%;
    color: $blue200;
    cursor: pointer;
    padding: 2px;
    transition: 0.3s;

    &:hover {
      background: $gray100;
    }

    &-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 2px;
    }

    & > svg {
      &:last-child {
        margin: 0 6px 0 auto;
      }
    }
  }
  &__list {
    padding: 8px;
    list-style: none;
    background: $white;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 200;
    border: 1px solid $gray100;
    box-sizing: border-box;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    border-radius: $shape_border_radius;
    min-width: 154px;
    &-item {
      height: 28px;
      display: flex;
      align-items: center;
      transition: 0.3s;
      cursor: pointer;
      border-radius: $shape_border_radius;

      &:not(:last-child) {
        margin: 0 0 2px;
      }

      &:hover {
        background: $gray100;
      }

      &.disabled {
        opacity: 0.5;
      }
      &.active {
        color: $blue200;

        svg {
          color: $blue200 !important;
        }
      }
    }
    &-icon {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 2px 0 0;
    }

    &-text {
      font-size: 12px;
      line-height: 16px;
    }
  }
}
</style>

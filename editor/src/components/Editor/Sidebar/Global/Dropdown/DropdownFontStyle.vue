<template>
  <div class="sidebar-select">
    <div
      class="sidebar-select__header"
      :class="{ 'sidebar-select__header--disabled': fontVariants.length === 1 }"
      @click="show = !show"
      @keydown.esc.stop.prevent.exact="hideModal"
      tabindex="0"
    >
      <span>{{ isMixed ? 'Mixed' : currentVariantDisplayName }}</span>
      <square-icon-btn
        :icon-settings="{ name: 'arrow-down', width: 20, height: 20 }"
        :size="{ width: 20, height: 20 }"
      />
    </div>
    <transition name="popup-layer" mode="out-in">
      <div v-if="show" v-click-outside="hideModal" class="sidebar-select__body">
        <div
          v-for="(item, i) in filteredVariantsNormal"
          :key="item.font + i"
          :class="['sidebar-select__item', { 'sidebar-select__item--active': variantClass(item) === currentVariant }]"
          @click="chooseStyle(item, i)"
          :style="`font-weight: ${item.name};`"
        >
          {{ item.font }}
        </div>
        <div v-if="filteredVariantsItalic.length" class="sidebar-select__divider" />
        <div
          v-for="(item, i) in filteredVariantsItalic"
          :key="item.font + i"
          :class="['sidebar-select__item', { 'sidebar-select__item--active': variantClass(item) === currentVariant }]"
          @click="chooseStyle(item, i)"
          :style="`font-weight: ${item.name}; font-style: italic;`"
        >
          {{ item.font }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn';

export default {
  name: 'DropdownFontStyle',
  components: { SquareIconBtn },
  props: {
    textStyles: Object,
    fontVariants: {
      type: Array,
      default: () => []
    },
    isMixed: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    show: false,
    activeItem: 0,
    keys: {
      100: 'thin',
      200: 'extra light',
      300: 'light',
      400: 'regular',
      normal: 'normal',
      italic: 'normal',
      regular: 'regular',
      500: 'medium',
      600: 'bold',
      700: 'extra bold',
      bold: 'bold',
      800: 'heavy',
      900: 'black'
    }
  }),
  computed: {
    list() {
      return [];
    },
    currentVariant() {
      const textWeight = this.textStyles.fontWeight;
      return `${this.keys[textWeight === 'normal' ? 'regular' : textWeight]} ${this.textStyles.fontStyle}`;
    },
    currentVariantDisplayName() {
      const textWeight = this.textStyles.fontWeight;
      const textStyle = this.textStyles.fontStyle;
      return `${this.keys[textWeight === 'normal' ? 'regular' : textWeight]} ${
        textStyle === 'normal' ? '' : textStyle
      }`;
    },
    filteredVariantsNormal() {
      return this.fontVariants
        .filter(el => el.style === 'normal' && el.name !== 'italic')
        .map(el => {
          return {
            font: `${this.keys[el.name]} `,
            ...el
          };
        });
    },
    filteredVariantsItalic() {
      return this.fontVariants
        .filter(el => el.style === 'italic' || el.name === 'italic')
        .map(el => {
          return {
            font: `${this.keys[el.name]} italic`,
            ...el
          };
        });
    }
  },
  methods: {
    variantClass(fontItem) {
      return `${this.keys[fontItem.name]} ${fontItem.style}`;
    },
    chooseStyle(style) {
      this.show = !this.show;
      this.$emit('changeStyle', {
        fontStyle: style.style,
        fontWeight: style.name === 'regular' ? 'normal' : style.name
      });
    },
    hideModal() {
      this.show = false;
    }
  }
};
</script>

<style lang="scss">
.sidebar-select {
  position: relative;
  z-index: 20;
  width: 100%;

  &--form {
    width: 100%;

    .sidebar-select {
      &__body,
      &__header {
        width: 100%;
      }
    }
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border: 1px solid #ebebeb;
    height: 32px;
    padding: 0 5px 0 6px;
    border-radius: 4px;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    color: #000000;
    text-transform: capitalize;
    transition: border-color 0.2s ease, opacity 0.2s ease;
    outline: none;

    &:hover {
      border-color: #bdc2c7;
    }

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 73px;
      white-space: nowrap;
    }

    &--disabled {
      pointer-events: none;
      border-color: #f3f3f3;
      color: #bdbdbd;
      svg path {
        fill: #bdbdbd;
      }
    }
  }
  &__body {
    position: absolute;
    top: -6px;
    right: 0;
    width: 157px;
    max-height: 200px;
    background: #ffffff;
    border: 1px solid #dadada;
    box-sizing: border-box;
    padding: 6px 6px;
    box-shadow: 0 10px 20px rgba(9, 9, 9, 0.15);
    border-radius: 4px;
    z-index: 999;
    overflow-x: hidden;
    overflow-y: auto;
    transform: translate(0, -50%);

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
  }
  &__divider {
    margin: 6px 0;
    border-bottom: 1px solid #f2f2f2;
  }
  &__item {
    cursor: pointer;
    padding: 7px 10px 5px;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: #000000;
    border-radius: 4px;
    transition: 0.3s ease;
    text-transform: capitalize;

    &:hover {
      background: #f3f3f3;
    }

    &--active {
      color: #4356be;
    }
  }
}
</style>

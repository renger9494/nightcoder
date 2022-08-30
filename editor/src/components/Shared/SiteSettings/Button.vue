<template>
  <component
    class="button"
    :class="[classesButton]"
    :disabled="isDisabled"
    :href="tag === 'a' && '#'"
    :is="tag"
    @click="onClick"
  >
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false
    },
    tag: {
      type: String,
      required: true
    },
    theme: {
      validator: function (value) {
        // The value must match one of these strings
        return ['transparent', 'blue', 'white', 'green', 'black'].indexOf(value) !== -1;
      }
    },
    isSmall: {
      type: Boolean,
      required: false,
      default: () => false
    },
    onClick: Function
  },
  computed: {
    classesButton() {
      return {
        button_blue: this.theme === 'blue',
        button_white: this.theme === 'white',
        button_green: this.theme === 'green',
        button_black: this.theme === 'black',
        button_small: this.isSmall
      };
    }
  }
};
</script>

<style lang="scss" scoped>

.button {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  min-width: unset;
  text-align: center;
  color: $white;
  background: $black;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  padding: 9px 24px;
  transition: 0.3s;
  border: none;
  border-radius: $shape_border_radius;
  outline: none;
  cursor: pointer;

  &:hover {
    opacity: .6;
  }

  &:active {
    opacity: 1;
  }

  @include sm-down {
    min-width: 103px;
    padding-right: 15px;
    padding-left: 15px;
  }

  &_small {
    font-size: 12px;
    line-height: 16px;
    padding: 8px 10px;
  }

  &_blue {
    min-width: initial;
    color: #ffffff;
    background-color: #4256be;
    border: none;
  }

  &_primary {
    background: #fff;
    padding: 9px 24px;
    font-weight: 500;
    font-size: 13px;
    line-height: 14px;
    color: #333;
    border-radius: $shape_border_radius;
    min-width: auto;
    text-transform: capitalize;
  }

  &_blue {
    @extend .button_primary;

    color: $blue200;
    border: 1px solid $blue200;

    &:active {
      border-color: $blue200;
      color: $blue200;
    }
  }

  &_green {
    @extend .button_primary;

    border: 1px solid $success;
    color: $success;

    &:hover,
    &:active {
      border-color: $success;
    }
  }

  &_black {
    @extend .button_primary;

    background: #000000;
    border: 1px solid #000000;
    color: #ffc557;

    &:hover,
    &:active {
      background-color: #000000;
      border-color: #000000;
    }
  }
}
</style>

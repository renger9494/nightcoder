<template>
  <label class="check-box" :class="{ 'check-box--checked': inputValue }">
    <input type="checkbox" class="check-box__input" v-model="value" />
    <span class="check-box__checkmark">
      <CheckboxCheckedIcon />
    </span>
  </label>
</template>

<script>
import CheckboxCheckedIcon from '@/assets/icons/editor/checkbox-checked.svg?inline';

export default {
  name: 'CustomCheckbox',
  components: {
    CheckboxCheckedIcon
  },
  props: {
    inputValue: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    value: {
      get() {
        return this.inputValue;
      },
      set(value) {
        this.$emit('change', value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.check-box {
  position: relative;
  user-select: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  min-height: 15px;
  min-width: 15px;
  transition: 0.5s;

  &:hover {
    .check-box__checkmark {
      border-color: $gray400;
    }
  }

  &--checked {
    .check-box__checkmark {
      background: $gray900;
      border-color: $gray900!important;
      span::after,
      span::before {
        opacity: 1;
      }
    }
  }

  &__input {
    position: absolute;
    cursor: pointer;
    opacity: 0;
  }

  &__checkmark {
    position: absolute;
    top: 0;
    left: 0;
    width: 15px;
    height: 15px;
    text-align: center;
    border: 1px solid $gray300;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;

    span {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      height: 10px;
      width: 10px;
      &::before {
        position: absolute;
        left: 0;
        top: 50%;
        height: 50%;
        width: 2px;
        content: '';
        transform: translateX(4px) rotate(-45deg);
        transform-origin: left bottom;
        opacity: 0;
        transition: 0.3s;
      }

      &::after {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 2px;
        width: 100%;
        content: '';
        transform: translateX(4px) rotate(-45deg);
        transform-origin: left bottom;
        opacity: 0;
        transition: 0.3s;
      }
    }
  }
}
</style>

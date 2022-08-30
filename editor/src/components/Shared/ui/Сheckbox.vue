<template>
  <label class="check-box" :class="{ 'check-box--checked': value }">
    <span class="check-box__text">{{ text }}</span>
    <input type="checkbox" class="check-box__input" v-model="value" />
    <span class="check-box__checkmark">
      <span></span>
    </span>
  </label>
</template>

<script>
export default {
  name: 'CustomCheckbox',
  props: {
    text: {
      type: String,
      required: true
    },
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

<style lang="scss">
.check-box {
  position: relative;
  padding: 0 0 0 22px;
  user-select: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  min-height: 16px;
  transition: 0.5s;

  &:hover {
    opacity: 0.8;
  }

  &--checked {
    .check-box__checkmark {
      background: $blue200;
      border-color: $blue200;
      box-shadow: 0 2px 7px rgba(0, 101, 255, 0.25);
      span::after,
      span::before {
        opacity: 1;
      }
    }
  }

  &__text {
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
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
    width: 16px;
    height: 16px;
    text-align: center;
    border: 1px solid $gray300;
    border-radius: $shape_border_radius;

    span {
      position: absolute;
      left: 0;
      top: -2px;
      right: 0;
      bottom: 0;
      margin: auto;
      height: 10px;
      width: 10px;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        height: 50%;
        width: 2px;
        transform: translateX(4px) rotate(-45deg);
        transform-origin: left bottom;
        opacity: 0;
        transition: 0.3s;
        background: $white;
      }

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 2px;
        width: 80%;
        transform: translateX(4px) rotate(-45deg);
        transform-origin: left bottom;
        opacity: 0;
        transition: 0.3s;
        background: $white;
      }
    }
  }
}
</style>

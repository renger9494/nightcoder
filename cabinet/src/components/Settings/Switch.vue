<template>
  <div class="switch" @click="isDisabled ? null : onClick">
    <input
      class="switch__input"
      :type="'checkbox'"
      :checked="isActive"
      :id="id"
    />
    <div class="switch__label" :class="classesSwitch"></div>
    <div
      class="switch__status-text"
      :style="stylesStatusText"
      v-if="showStatus"
    >
      {{ textStatus }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    name: {
      type: String,
    },
    statusText: {
      type: Object,
      default: () => ({
        on: 'On',
        off: 'Off',
      }),
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    onClick: {
      type: Function,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    showStatus(): any {
      if (this.name == 'right' || this.name == 'left') {
        return false
      }
      return true
    },
    textStatus(): any {
      return this.isActive ? this.statusText.on : this.statusText.off
    },
    classesSwitch(): any {
      return {
        switch__label_disabled: this.isDisabled,
      }
    },
    stylesStatusText(): any {
      return {
        color: this.isActive ? '#000000' : '#bdbdbd',
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.switch {
  display: flex;
  align-items: center;
  cursor: default;
  user-select: none;

  &__input {
    position: absolute;
    width: 0;
    height: 0;
    visibility: hidden;

    &:checked {
      + .switch__label {
        background-color: $blue200;
        border-color: transparent;

        &:after {
          left: 13px;
          transform: none;
        }
      }
    }
  }

  &__label {
    position: relative;
    display: block;
    width: 30px;
    height: 18px;
    background-color: $gray300;
    text-indent: -9999px;
    border-radius: 18px;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-sizing: content-box;

    &:after {
      content: '';
      position: absolute;
      top: 1px;
      left: 17px;
      width: 16px;
      height: 16px;
      background-color: #ffffff;
      border-radius: 18px;
      transition: 0.3s;
      transform: translateX(-100%);
      box-shadow: 0 3px 1px rgba(0, 0, 0, 0.0510643),
        0 2px 2px rgba(0, 0, 0, 0.1);
    }

    &_disabled {
      cursor: not-allowed;
    }
  }

  &__status-text {
    margin-left: 10px;
    font-weight: 500;
    font-size: 12px;
  }
}
</style>

<template>
  <div :class="[classes, { 'prefix-input--dropdown': isDropdown }]" class="prefix-input">
    <prefix-input-icon v-if="!isDropdown" :type="type" class="prefix-input__icon" />
    <input
      ref="prefixInput"
      v-model="inputValue"
      type="text"
      @focus="onFocus"
      @blur="onBlur"
      class="prefix-input__input"
      :placeholder="placeholder"
      :tabindex="tabindex"
      @keydown.shift.38.exact="onKeydown($event, 10)"
      @keydown.38.exact="onKeydown($event, 1)"
      @keydown.shift.40.exact="onKeydown($event, 10)"
      @keydown.40.exact="onKeydown($event, 1)"
      @keydown.27.13="onKeydown($event)"
      @keydown="preventLetters($event)"
    />
    <span
      v-if="unit && !isAuto && !isDropdown"
      v-html="unit"
      class="prefix-input__unit"
      :class="{ 'prefix-input__unit_big': isUnitBig }"
    />
    <div v-if="isDropdown" class="prefix-input__arrow" @click="openDropdown">
      <svg-icon name="arrow-down-icon" width="9" height="5" color="#000" />
    </div>
    <transition name="popup-layer" mode="out-in">
      <ul
        class="prefix-input__dropdown"
        v-click-outside="() => (isDropdownOpen = false)" v-if="isDropdown && isDropdownOpen"
        @keydown.esc.stop.prevent.exact="openDropdown"
        tabindex="0"
      >
        <li
          v-for="(number, index) in dropdownList"
          :key="index"
          class="prefix-input__dropdown-item"
          @click="dropdownSelect(number)"
        >
          {{number}}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PrefixInputIcon from './PrefixInputIcon.vue';
import { throttle as _throttle } from 'lodash';

export default Vue.extend({
  components: {
    PrefixInputIcon
  },
  props: {
    type: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      default: null
    },
    isUnitBig: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String],
      required: true
    },
    placeholder: {
      type: [Number, String],
      default: () => null
    },
    isDropdown: {
      type: Boolean,
      default: () => false
    },
    dropdownList: {
      type: Array,
      default: () => []
    },
    tabindex: {
      type: String,
      default: () => '0'
    },
    isDecimal: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    const inputValue = this.type === 'fontLineHeight' && this.value === 'normal' ? 'Auto' : this.value;
    return {
      inputValue,
      throttleEmitInputHandler: _throttle((<any>this).emitInputHandler, 150),
      isDropdownOpen: false
    };
  },
  watch: {
    value: {
      handler: function(n, o) {
        this.inputValue = this.type === 'fontLineHeight' && n == 'normal' ? 'Auto' : n;
      }
    }
  },
  computed: {
    classes(): any {
      return {
        [`prefix-input--${this.type.toLowerCase()}`]: true,
        'prefix-input--without-unit': !this.unit
      };
    },
    isAuto: {
      get(): boolean {
        return this.type === 'fontLineHeight' && this.value === 'normal';
      }
    }
  },
  methods: {
    emitInputHandler(data: any) {
      this.$emit('inputHandler', {
        type: this.type,
        data: data ? data : Number(this.inputValue)
      });
    },
    onBlur() {
      const isAuto = this.type === 'fontLineHeight' && this.inputValue == '';
      const data = isAuto ? 'normal' : '';
      this.emitInputHandler(data);
      if (isAuto) this.inputValue = 'Auto';
      this.$emit('blur');
    },
    onFocus() {
      (<HTMLInputElement>this.$refs.prefixInput).select();
      if (this.value === '' || this.value == 'normal') {
        this.inputValue = '';
      }
      this.$emit('focus');
    },
    onKeydown(event: any, incrementCount?: any) {
      const input = <HTMLInputElement>this.$refs.prefixInput;
      if (!input.value && this.type !== 'fontLineHeight') return
      if (event && (event.key === 'Enter' || event.key === 'Escape')) input.blur();
      if (event && (event.key == 'ArrowUp' || event.key == 'ArrowDown')) {
        const increment = event.key == 'ArrowUp' ? incrementCount : -incrementCount;
        if (this.inputValue == '') {
          this.inputValue = +this.placeholder;
        }

        this.inputValue = +this.inputValue + increment;
        this.throttleEmitInputHandler();

        this.$emit('inputKeydown', event);
      }
    },
    dropdownSelect(number: number) {
      this.isDropdownOpen = false;
      this.$emit('inputHandler', {
        type: this.type,
        data: number
      });
    },
    preventLetters(e: KeyboardEvent) {
      const {keyCode, ctrlKey, metaKey} = e;
      let exclusion = [27, 13, 8, 17, 18, 46, 39, 37, 9, 109, 189];
      const shortcuts = [65, 67, 86, 88];
      if(this.isDecimal) {
        exclusion = [...exclusion, 110, 190];
      }
      if (!((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || exclusion.includes(keyCode) || (shortcuts.includes(keyCode) && (ctrlKey || metaKey)))) {
        e.preventDefault();
      }
    },
    openDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
      if (!this.isDropdownOpen) return;
      setTimeout(() => {
        const popup = document.querySelector('.prefix-input__dropdown');
        if (popup) {
          (popup as HTMLElement).focus();
        }
      },300);
    }
  }
});
</script>

<style lang="scss">
.prefix-input {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 32px;
  width: 86px;
  outline: none;

  &__input {
    position: absolute;
    padding: 0 22px 0 28px;
    height: 100%;
    width: 100%;
    align-items: center;
    background-color: inherit;
    border: 1px solid $color_input_border;
    border-radius: $shape_border_radius;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    color: $black;
    transition: 0.3s;

    &:hover {
      border-color: $color_input_hover;
    }

    &:focus {
      border-color: $color_input_focus!important;
    }
  }

  &__icon {
    cursor: default;
    margin-left: 8px;
    margin-top: 2px;
  }

  &__unit {
    cursor: default;
    padding-right: 8px;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    color: $gray400;
  }

  &__unit_big {
    font-size: 21px;
  }

  &__arrow {
    position: absolute;
    right: 5px;
    bottom: 0;
    top: 0;
    margin: auto 0;
    width: 21px;
    height: 24px;
    transition: all 0.3s ease;
    border-radius: $shape_border_radius;
    text-align: center;
    cursor: pointer;

    &:hover {
      background: $gray100;
    }

    svg {
      width: 9px;
      height: 5px;
      path {
        fill: $black;
      }
    }
  }

  &__dropdown {
    position: absolute;
    top: 0;
    right: 0;
    list-style: none;
    max-width: 73px;
    width: 100%;
    padding: 5px 6px;
    border: 1px solid #F1F1F1;
    background: $white;
    z-index: 20;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    border-radius: $shape_border_radius;
    transform: translateY(-50%);
    outline: none;

    &--letter {
      max-width: 92px;
    }

    &-item {
      width: 100%;
      padding: 7px 10px 5px 10px;
      transition: 0.3s;
      font-size: 12px;
      line-height: 14px;
      color: $black;
      cursor: pointer;
      border-radius: $shape_border_radius;

      &:hover {
        background: $gray100;
      }

      &--switch {
        display: flex;
        align-items: center;
        position: relative;
        padding: 4px;
        background: $gray100;
        margin: 0 0 5px;

        &:after {
          content: '';
          position: absolute;
          left: 4px;
          top: 4px;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          background: $white;
          border-radius: $shape_border_radius;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          transition: 0.3s;
        }
      }

      &--right {
        &:after {
          transform: translate(100%, 0);
        }
      }
    }

    &-unit {
      flex: 0 0 calc(50%);
      padding: 5px 10px;
      text-align: center;
      font-size: 12px;
      line-height: 16px;
      z-index: 2;
      position: relative;
    }
  }

  &:hover {
    .prefix-input__input {
      border-color: #BDC2C7;
    }
  }

  &--dropdown {
    width: 73px;
    .prefix-input__input {
      padding: 0 26px 0 8px;
    }
  }
  &--dropdown.prefix-input--letterSpacing {
    .prefix-input__input {
      padding: 0 40px 0 28px;
    }
    .prefix-input__unit {
      padding-right: 30px;
    }
  }
}

.prefix-input--without-unit {
  .prefix-input__input {
    padding-right: 10px;
  }
}

.prefix-input--shadowblur,
.prefix-input--shadowspread {
  .prefix-input__input {
    padding-left: 55px;
  }
}

.popup-layer-enter-active {
  transition: transform 0.5s cubic-bezier(0.8, -0.5, 0.2, 1.4), opacity 0.5s cubic-bezier(0.8, -0.5, 0.2, 1.4);
  transform-origin: 50% -100%;
}
.popup-layer-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
  transform-origin: 50% -100%;
}
.popup-layer-enter,
.popup-layer-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

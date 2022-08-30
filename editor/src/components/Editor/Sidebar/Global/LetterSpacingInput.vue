<template>
  <div class="prefix-input--letterSpacing prefix-input--dropdown prefix-input">
    <prefix-input-icon type="letterSpacing" class="prefix-input__icon" v-tooltip="'Letter spacing'" />
    <input
      ref="prefixInput"
      v-model="inputValue"
      :tabindex="0"
      class="prefix-input__input"
      type="text"
      @blur="onBlur"
      @focus="onFocus"
      @keydown.exact="preventLetters($event)"
      @keydown.shift.38.exact="onKeydown($event, 10)"
      @keydown.38.exact="onKeydown($event, 1)"
      @keydown.shift.40.exact="onKeydown($event, 10)"
      @keydown.40.exact="onKeydown($event, 1)"
      @keydown.27.13="onKeydown($event)"
    />
    <span v-if="unit" class="prefix-input__unit" v-tooltip="'Letter spacing'">{{ displayUnit }}</span>
    <div class="prefix-input__arrow" @click="openDropdown" v-tooltip="'Letter spacing'">
      <svg-icon name="arrow-down-icon" width="9" height="5" color="#000" />
    </div>
    <transition name="popup-layer" mode="out-in">
      <ul
        v-if="isDropdownOpen"
        v-click-outside="() => (isDropdownOpen = false)"
        @keydown.esc.stop.prevent.exact="openDropdown"
        class="prefix-input__dropdown prefix-input__dropdown--letter"
        tabindex="0"
      >
        <li
          class="prefix-input__dropdown-item prefix-input__dropdown-item--switch"
          :class="{ 'prefix-input__dropdown-item--right': !isPercent }"
        >
          <div class="prefix-input__dropdown-unit" @click="changeUnit('em')">%</div>
          <div class="prefix-input__dropdown-unit" @click="changeUnit('px')">Px</div>
        </li>
        <li
          v-for="(number, index) in dropdownList"
          :key="index"
          class="prefix-input__dropdown-item"
          @click="dropdownSelect(number)"
        >
          {{ number }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PrefixInputIcon from '@/components/Editor/Sidebar/Global/PrefixInput/PrefixInputIcon.vue';
import { throttle as _throttle } from 'lodash';

export default Vue.extend({
  name: 'LetterSpacingInput',
  components: { PrefixInputIcon },
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      inputValue: this.value,
      isDropdownOpen: false,
      throttleEmitInputHandler: _throttle((this as any).emitInputHandler, 150)
    };
  },
  watch: {
    value(val: string | number) {
      this.inputValue = val;
    }
  },
  computed: {
    isPercent(): boolean {
      return this.unit === 'em';
    },
    dropdownList(): Array<number> {
      return this.isPercent ? [7.5, 5, 2.5, 0, -2.5, -5, -7.5] : [0.2, 0.1, 0.05, 0, -0.05, -0.1, -0.2];
    },
    displayUnit(): string {
      return this.isPercent ? '%' : 'px';
    }
  },
  methods: {
    emitInputHandler(data?: any) {
      this.$emit('inputHandler', {
        type: 'letterSpacing',
        data: data ? data : Number(this.inputValue)
      });
    },
    onFocus() {
      (this.$refs.prefixInput as HTMLInputElement).select();
      if (this.value === '') {
        this.inputValue = '';
      }
      this.$emit('focus');
    },
    onBlur() {
      this.emitInputHandler();
      this.$emit('blur');
    },
    onKeydown(event: any, incrementCount?: any) {
      const input = this.$refs.prefixInput as HTMLInputElement;
      if (!input.value) return;
      if (event && (event.key === 'Enter' || event.key === 'Escape')) input.blur();
      if (event && (event.key == 'ArrowUp' || event.key == 'ArrowDown')) {
        const increment = event.key == 'ArrowUp' ? incrementCount : -incrementCount;
        if (this.inputValue == '') {
          this.inputValue = 0;
        }

        this.inputValue = +this.inputValue + increment;
        this.throttleEmitInputHandler();

        this.$emit('inputKeydown', event);
      }
    },
    preventLetters(e: KeyboardEvent) {
      const { keyCode, ctrlKey, metaKey } = e;
      const exclusion = [27, 13, 8, 17, 18, 46, 39, 37, 9, 109, 189, 110, 190];
      const shortcuts = [65, 67, 86, 88];
      if (
        !(
          (keyCode >= 48 && keyCode <= 57) ||
          (keyCode >= 96 && keyCode <= 105) ||
          exclusion.includes(keyCode) ||
          (shortcuts.includes(keyCode) && (ctrlKey || metaKey))
        )
      ) {
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
      }, 300);
    },
    dropdownSelect(number: number) {
      this.isDropdownOpen = false;
      this.inputValue = number;
      this.$emit('inputHandler', {
        type: 'letterSpacing',
        data: number
      });
    },
    changeUnit(unit: string) {
      this.isDropdownOpen = false;
      this.$emit('onUnitChange', unit);
    }
  }
});
</script>

<style lang="scss" scoped></style>

<template>
  <div class="selected-preview">
    <div class="selected-preview-label">{{ label }}</div>
    <div class="selected-preview-wrapper" @click="$emit('select-clicked')">
      <div class="selected-value-preview">
        <slot />
      </div>
      <button>
        <svg
          v-if="buttonIcon === 'refresh'"
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5 0C11.2238 0 11 0.223857 11 0.500009V2.32649C8.42578 -0.165703 4.31869 -0.0991992 1.82649 2.47497C0.651984 3.68812 -0.0032399 5.31143 1.20472e-05 6.99998C1.20472e-05 7.27614 0.223869 7.49999 0.500021 7.49999C0.776173 7.49999 1 7.27614 1 6.99998C1.00062 3.96243 3.46351 1.50047 6.5011 1.50108C8.04378 1.50138 9.51539 2.14957 10.557 3.28749L8.34202 4.02597C8.0797 4.11325 7.93776 4.39664 8.02503 4.65896C8.11231 4.92128 8.39569 5.06323 8.65802 4.97595L11.658 3.97596C11.8628 3.90776 12.0007 3.71581 12 3.49998V0.49998C12 0.223857 11.7761 0 11.5 0Z"
            fill="#455670"
          />
          <path
            d="M12.5 6.50001C12.2238 6.50001 11.9999 6.72386 11.9999 7.00001C11.9993 10.0376 9.53643 12.4995 6.49884 12.4989C4.95616 12.4986 3.48455 11.8504 2.44293 10.7125L4.65792 9.97401C4.92024 9.88673 5.06218 9.60335 4.97491 9.34102C4.88763 9.0787 4.60425 8.93676 4.34192 9.02403L1.34193 10.024C1.13714 10.0922 0.99924 10.2842 0.999914 10.5V13.5C0.999914 13.7761 1.22377 14 1.49992 14C1.77607 14 1.99993 13.7761 1.99993 13.5V11.6735C4.57413 14.1657 8.68125 14.0992 11.1734 11.525C12.3479 10.3119 13.0032 8.68856 12.9999 7.00001C13 6.72386 12.7761 6.50001 12.5 6.50001Z"
            fill="#455670"
          />
        </svg>
        <svg
          v-if="buttonIcon === 'arrow'"
          width="8"
          height="6"
          viewBox="0 0 8 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.77032 5.61706L7.84061 1.36366C8.03105 1.09643 8.05427 0.7506 7.8917 0.464595C7.72913 0.179026 7.41328 -2.56465e-08 7.06955 -4.06711e-08L0.928982 -3.09084e-07C0.585259 -3.24109e-07 0.269405 0.179026 0.106833 0.464595C0.0371594 0.59297 -3.20654e-08 0.733571 -3.81731e-08 0.873299C-4.56932e-08 1.04534 0.0557393 1.2165 0.162572 1.36366L3.23286 5.61706C3.40472 5.85678 3.6927 6 3.99927 6C4.30583 6 4.59382 5.85678 4.77032 5.61706Z"
            fill="#333333"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    buttonIcon: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Default Label'
    }
  },
  data() {
    return {
      //
    };
  },
  methods: {
    //
  }
});
</script>

<style lang="scss" scoped>
.selected-preview-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: $shadow_button;
  border-radius: $shape_border_radius;
  margin-bottom: 14px;
  cursor: pointer;
}
.selected-preview-wrapper:hover {
  box-shadow: 0px 2px 4px rgba(130, 130, 130, 0.3);
}
.sidebar-link-item.dashed .selected-preview-wrapper {
  margin-bottom: 10px;
}

.selected-value-preview {
  width: calc(100% - 32px);
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding: 10px;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  // line-height: 14px;
  max-width: 100%;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
}

button {
  width: 32px;
  height: 34px;
  padding: 10px;
  background: rgba(69, 86, 112, 0.05);
  border-radius: 0px 4px 4px 0px;
  cursor: pointer;
}
button:hover {
  background: rgba(69, 86, 112, 0.15);
}

.selected-preview-label {
  display: inline-block;

  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}
</style>

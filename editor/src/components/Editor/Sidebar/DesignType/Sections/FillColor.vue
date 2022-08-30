<template>
  <div
    class="design-text-editor__section design-text-editor__collapse dte-border"
    :class="{ 'design-text-editor__collapse_opened': show }"
  >
    <div class="design-text-editor__head">
      <span>Fill color</span>
      <button @click="addBorder(!show)" class="design-text-editor__button">
        <svg v-if="!show" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.37498 4.37498H5.62498V0.624983C5.62498 0.279807 5.34518 0 5 0C4.65482 0 4.37502 0.279807 4.37502 0.624983V4.37495H0.625052C0.279877 4.37495 0 4.65475 0 4.99993C0 5.34511 0.279877 5.62491 0.625052 5.62491H4.37502V9.37488C4.37502 9.72005 4.65482 9.99986 5 9.99986C5.34518 9.99986 5.62498 9.72005 5.62498 9.37488V5.62491H9.37498C9.72016 5.62491 9.99997 5.34507 9.99997 4.99993C10 4.65479 9.72016 4.37498 9.37498 4.37498Z"
            fill="black"
          />
        </svg>
        <svg v-if="show" width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.37498 0.375035L0.625052 0.375C0.279877 0.375 0 0.654807 0 0.999982C0 1.34516 0.279877 1.62497 0.625052 1.62497H9.37498C9.72016 1.62497 9.99997 1.34512 9.99997 0.999982C10 0.654842 9.72016 0.375035 9.37498 0.375035Z"
            stroke="#000000"
          />
        </svg>
      </button>
    </div>
    <div v-if="show" class="design-text-editor__content">
      <color-item
        @openColorPicker="openColorPicker"
        @changeColor="changeColor"
        @textOpacity="changeOpacity"
        @hide="hideColor"
        :hide="displayConditions.hideBackgroundColor"
        :bg-color="value.styles[previewMode].fillColor"
        :hex="value.styles[previewMode].fillColor"
        :opacity="value.styles[previewMode].fillOpacity * 100"
        :block-info="{
          colorTypePath: 'fillColor',
          opacityTypePath: 'fillOpacity',
          block,
          hex: value.styles[previewMode].fillColor,
          opacity: value.styles[previewMode].fillOpacity
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import ColorItem from '../Sections/Color/ColorItem.vue';

/*
 * @deprecated
 * */
export default Vue.extend({
  name: 'FillColorSection',
  components: {
    ColorItem
  },
  props: {
    block: {
      type: [String, Number],
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      show: false,
      showBorderTypes: false,

      strokeWidth: 4,
      dashArray: 8,
      dashOffset: 0,
      borderRadius: 0,
      lineCap: 'square',
      curBorderType: null
    };
  },
  computed: {
    ...mapState({
      previewMode: (state: any) => state.editor.previewMode,
      displayConditions(state: any) {
        return state.editor.displayConditions[this.value.id];
      }
    }),
    isFillActive(): any {
      return this.value.styles[this.previewMode].fill !== null;
    }
  },
  mounted() {
    this.show = this.isFillActive;
  },
  methods: {
    hideColor(e: any) {
      this.$store.commit('editor/setDisplayCondition', {
        id: this.value.id,
        condition: 'hideBackgroundColor',
        value: e
      });
    },
    changeOpacity(e: any) {
      if (Number(e) > 100) {
        e.value = 100;
      } else if (Number(e) < 0) {
        e.value = 0;
      }

      this.$store.commit('editor/changeSelectedElementsStyle', {
        fillOpacity: e / 100
      });
    },
    changeColor(e: any) {
      this.$store.commit('editor/changeSelectedElementsStyle', {
        fillColor: `${e}`
      });
    },
    openColorPicker(picker: any) {
      picker.focus();
      picker.click();
    },
    addBorder(val: any) {
      this.show = val;
      if (val) {
        this.$store.commit('editor/changeSelectedElementsStyle', {
          borderType: 'solid',
          borderWidth: 1,
          borderOpacity: 1,
          borderColor: '#000000'
        });
      } else {
        this.$store.commit('editor/changeSelectedElementsStyle', {
          borderType: null
        });
      }
    }
  }
});
</script>

<style lang="scss">
.border-params {
  display: flex;
  align-items: center;
  &__field {
    position: relative;
    background: #ffffff;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: $color_input_text;
    &_sm {
      width: 40px;
      height: 34px;
      margin-right: 2px;
      input {
        width: 100%;
        text-align: center;
        height: 100%;
      }
    }
  }
}
.border-field {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  align-items: center;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: #000000;
  border: 1px solid #f3f3f3;
  box-sizing: border-box;
  border-radius: $shape_border_radius;
}
.dte-border {
  .dte-link__add {
    right: 8px;
  }
}
</style>

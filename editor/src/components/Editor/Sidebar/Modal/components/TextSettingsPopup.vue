<template>
  <div class="text-settings-popup">
    <div class="text-settings-block" v-if="!popupSettings.data.isButton">
      <div class="text-settings-block__header">Text headers</div>
      <div class="text-settings-block__btns">
        <button
          :class="{ active: elementType === ElementType.h1 }"
          class="text-settings-block__btn"
          @click="changeType(ElementType.h1)"
        >
          <svg-icon name="h1-icon" width="12" height="9" color="#000" />
        </button>
        <button
          :class="{ active: elementType === ElementType.h2 }"
          class="text-settings-block__btn"
          @click="changeType(ElementType.h2)"
        >
          <svg-icon name="h2-icon" width="15" height="9" color="#000" />
        </button>
        <button
          :class="{ active: elementType === ElementType.h3 }"
          class="text-settings-block__btn"
          @click="changeType(ElementType.h3)"
        >
          <svg-icon name="h3-icon" width="15" height="10" color="#000" />
        </button>
        <button
          :class="{ active: elementType === ElementType.p }"
          class="text-settings-block__btn"
          @click="changeType(ElementType.p)"
        >
          <svg-icon name="p-icon" width="20" height="9" color="#000" />
        </button>
      </div>
    </div>
    <div class="text-settings-block">
      <div class="text-settings-block__header">Letter case</div>
      <div class="text-settings-block__btns">
        <button
          :class="{ active: elementStyles.textTransform === TextTransform.none }"
          class="text-settings-block__btn"
          @click="changeStyle('textTransform', TextTransform.none)"
        >
          <svg-icon name="none-icon" width="8" height="2" color="#000" />
        </button>
        <button
          :class="{ active: elementStyles.textTransform === TextTransform.uppercase }"
          class="text-settings-block__btn"
          @click="changeStyle('textTransform', TextTransform.uppercase)"
        >
          <svg-icon name="uppercase-icon" width="14" height="8" color="#000" />
        </button>
        <button
          :class="{ active: elementStyles.textTransform === TextTransform.lowercase }"
          class="text-settings-block__btn"
          @click="changeStyle('textTransform', TextTransform.lowercase)"
        >
          <svg-icon name="lowercase-icon" width="12" height="7" color="#000" />
        </button>
        <button
          :class="{ active: elementStyles.textTransform === TextTransform.capitalize }"
          class="text-settings-block__btn"
          @click="changeStyle('textTransform', TextTransform.capitalize)"
        >
          <svg-icon name="capitalize-icon" width="14" height="9" color="#000" />
        </button>
      </div>
    </div>
    <div class="text-settings-block">
      <div class="text-settings-block__header">Decoration</div>
      <div class="text-settings-block__btns">
        <button
          :class="{ active: elementStyles.textDecoration === TextDecoration.none }"
          class="text-settings-block__btn"
          @click="changeStyle('textDecoration', TextDecoration.none)"
        >
          <svg-icon name="none-icon" width="8" height="2" color="#000" />
        </button>
        <button
          :class="{ active: elementStyles.textDecoration === TextDecoration.underline }"
          class="text-settings-block__btn"
          @click="changeStyle('textDecoration', TextDecoration.underline)"
        >
          <svg-icon name="underline-icon" width="8" height="12" color="#000" />
        </button>
        <button
          :class="{ active: elementStyles.textDecoration === TextDecoration['line-through'] }"
          class="text-settings-block__btn"
          @click="changeStyle('textDecoration', TextDecoration['line-through'])"
        >
          <svg-icon name="line-through-icon" width="13" height="12" color="#000" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @deprecated
 */
import Vue from 'vue';
import { mapState } from 'vuex';
import { PopupSettings, TextSettingsPopupData } from '../types';

const ElementType = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  p: 'p'
};

const TextTransform = {
  none: 'none',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize'
};

const TextDecoration = {
  none: 'none',
  underline: 'underline',
  'line-through': 'line-through'
};

const AlignItems = {
  'flex-start': 'flex-start',
  'flex-end': 'flex-end',
  center: 'center'
};

export default Vue.extend({
  data() {
    return {
      ElementType,
      TextTransform,
      TextDecoration,
      AlignItems
    };
  },
  computed: {
    ...mapState({
      popupSettings: (state: any) => <PopupSettings<TextSettingsPopupData>>state.editor.popupSettings,
      previewMode: (state: any) => state.editor.previewMode,
      userConfig: (state: any) => state.editor.userConfig
    }),
    element(): any {
      return this.userConfig.allComponents[this.popupSettings.data.elementId];
    },
    elementStyles(): any {
      return this.element.styles[this.previewMode];
    },
    elementType(): any {
      return this.element.payload.type;
    }
  },
  methods: {
    changeStyle(path: any, data: any) {
      this.popupSettings.data.changeStyleHandler({ [path]: data });
    },
    changeType(value: any) {
      this.popupSettings.data.changeTypeHandler({ type: value });
    }
  }
});
</script>

<style lang="scss" scoped>
.sidebar-popup-container-medium {
  width: 155px;
}
.text-settings-popup {
}
.text-settings-block {
  & + & {
    margin-top: 20px;
  }
  &__header {
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: -0.01em;
    color: #828282;
    margin-bottom: 6px;
  }
  &__btns {
    display: flex;
    align-items: center;
  }
  &__btn {
    & + & {
      margin-left: 6px;
    }
    display: inline-flex;
    width: 24px;
    height: 24px;
    align-items: center;
    justify-content: center;
    border-radius: $shape_border_radius;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      background: $color_btn_hover_bg;
    }
    &.active {
      background: $color_btn_hover_bg;
    }
    &:active {
      background: $color_btn_focus_bg;
    }
  }
}
</style>

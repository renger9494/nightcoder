<template>
  <div class="design-text-editor">
    <head-section :value="value" />
    <dimension-section :value="value" :block="block" :isHideBorderRadius="true" />

    <font-section :value="value" :block="block" />

    <text-color :value="value" header="Text color" :isTextColor="true" />

    <text-stroke-section :value="value" :block="block" />

    <!--<position-section />-->

    <!--<arrange-section />-->

    <seo-tag :value="value" />

    <text-effects-section :value="value" :elementType="'text'" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import ArrangeSection from '@/components/Editor/Sidebar/DesignType/Sections/Arrange.vue';
// import PositionSection from '@/components/Editor/Sidebar/DesignType/Sections/Position/index.vue';
import TextStrokeSection from '@/components/Editor/Sidebar/DesignType/Sections/TextStroke.vue';
import DimensionSection from '@/components/Editor/Sidebar/DesignType/Sections/Dimension.vue';
import FontSection from '@/components/Editor/Sidebar/DesignType/Sections/Font.vue';
import TextColor from '@/components/Editor/Sidebar/DesignType/Sections/Color/TextColor.vue';
import HeadSection from '@/components/Editor/Sidebar/DesignType/Sections/Head.vue';
import TextEffectsSection from '@/components/Editor/Sidebar/DesignType/Sections/Effects/TextEffects.vue';
import SeoTag from '@/components/Editor/Sidebar/DesignType/Sections/SeoTag.vue';

export default Vue.extend({
  components: {
    SeoTag,
    // PositionSection,
    // ArrangeSection,
    TextStrokeSection,
    DimensionSection,
    FontSection,
    HeadSection,
    TextColor,
    TextEffectsSection
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

  computed: {
    userConfig(): any {
      return this.$store.state.editor.userConfig;
    }
  },
  methods: {
    //
  }
});
</script>

<style lang="scss">
.text-type {
  cursor: pointer;
  &.active {
    color: blue;
  }
}
.design-text-editor {
  &__section {
    margin-left: 0;
    padding: 0 20px 20px;
    border-bottom: 1px solid #f3f3f3;
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    span {
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 15px;
      color: #af653d;
      text-transform: capitalize;
    }

    & > svg {
      position: absolute;
      left: -18px;

      path {
        transition: fill 0.2s ease, opacity 0.2s ease;
      }
    }

    &:hover {
      & > svg {
        path {
          opacity: 1;
          fill: #000;
        }
      }
    }

    &:active {
      & > svg {
        path {
          fill: #318bf5;
        }
      }
    }
  }

  &__collapse {
    .design-text-editor__head {
      span {
        color: #000;
        opacity: 0.4;
        transition: 0.3s ease-in-out;
      }

      svg {
        opacity: 0.4;
      }

      &:hover {
        span,
        svg {
          opacity: 1;
        }
      }
    }

    &_opened {
      .design-text-editor__head {
        span {
          color: #af653d;
          opacity: 1;
        }

        svg {
          opacity: 1;
        }
      }
    }

    &_hidden {
      opacity: 0.4;
    }
  }

  &__head-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: $shape_border_radius;
    transition: background-color 0.2s ease;
    cursor: pointer;
    background: $color_btn_bg;
    &:hover {
      background: $color_btn_hover_bg;
    }

    &:active {
      background: $color_btn_focus_bg;
    }

    svg {
      transition: opacity 0.2s ease;

      path {
        transition: fill 0.2s ease;
      }
    }

    &:active {
      svg {
        opacity: 1;

        path {
          fill: #318bf5;
        }
      }
    }
  }

  &__head-section {
    .dte-type,
    .dte-align {
      padding-bottom: 0;
      margin-bottom: 16px;
      border-bottom: none;
    }
  }

  &__color {
    margin: 0 0 16px;
  }
}
.dte-type {
  padding-top: 20px;
  &__prev {
    margin-bottom: 3.5px;
  }
  &__icon {
    margin-right: 10px;
  }
  &__btn {
    display: flex;
    align-items: center;
    margin-left: 28px;
    margin-top: 12.5px;
    span {
      font-size: 13px;
      line-height: 15px;
      color: #828282;
    }
  }
  &__switches {
    display: flex;
    flex-direction: column;
    margin-left: 13px;
    span {
      display: flex;
      cursor: pointer;
    }
  }
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    color: #af653d;
    & > div {
      display: flex;
      align-items: center;

      & > svg {
        circle,
        rect {
          stroke: $ocher;
        }
        path {
          fill: $ocher;
        }
      }
    }
    span {
      text-transform: capitalize;
      margin-left: 10px;
    }
  }
}
// old styles
//.dte-align {
//  display: flex;
//  align-items: center;
//  &.disabled {
//    .dte-align__btn {
//      pointer-events: none;
//      cursor: auto;
//      path {
//        fill: #b3b3b3;
//        stroke: #b3b3b3;
//      }
//    }
//  }
//  &__btn {
//    display: flex;
//    align-items: center;
//    justify-content: center;
//    width: 32px;
//    height: 31px;
//    cursor: pointer;
//    border-radius: 2px;
//    transition: all 0.3s ease;
//    background: $color_btn_bg;
//
//    path {
//      transition: all 0.3s ease;
//    }
//
//    &:not(:last-of-type) {
//      margin-right: 4px;
//    }
//
//    &:hover {
//      background: $color_btn_hover_bg;
//    }
//
//    &:active {
//      background: $color_btn_focus_bg;
//    }
//  }
//}
.dte-dimension {
  &__x {
    margin-right: 40px;
  }
  &__y {
    margin-right: 35px;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 -5px;
  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    div {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      svg {
        margin-right: 12px;
      }
    }
    input {
      width: 25px;
      height: 15px;
      width: 22px;
      height: 15px;

      font-style: normal;
      font-weight: 300;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
      color: #000000;
      margin-bottom: 6px;
    }
    span {
      font-style: normal;
      font-weight: normal;
      font-size: 10px;
      line-height: 12px;
      text-align: center;
      letter-spacing: -0.01em;
      color: #828282;
      text-transform: uppercase;
    }
  }
  &__s,
  &__a,
  &__r {
    align-items: flex-start;
    span {
      width: 14px;
      text-align: center;
    }
    input {
      margin-bottom: 0;
      text-align: left;
    }
  }
  &__a {
    margin-right: 20px;
    span {
      width: 10px;
    }
  }
  &__r {
    span {
      text-align: left;
    }
  }
  &__wh {
    display: flex;
    margin-right: 37px;
  }
  &__wh-lock {
    margin: 0 12.5px;
  }
}
.dte-position {
  &__nav {
    display: flex;
    align-items: center;
  }
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    width: 32px;
    height: 32px;
    border: 1px solid transparent;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    &.active {
      border: 1px solid #bdc2c7;
    }
  }
  &__check {
    display: flex;
    align-items: center;
    margin-right: 30px;
    span {
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      letter-spacing: -0.01em;
      color: #828282;
    }
    div {
      width: 14px;
      height: 14px;
      background: #ffffff;
      border: 0.5px solid #bdc2c7;
      box-sizing: border-box;
      border-radius: $shape_border_radius;
      margin-right: 7px;
    }
  }
}
.dte-font {
  &__param {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 0.5px solid transparent;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;

    &:not(:first-of-type) {
      margin-left: 4px;
    }

    &:hover {
      background-color: $color_btn_hover_bg;
    }

    &.active {
      background-color: $color_btn_hover_bg;
    }

    &:active {
      background-color: $color_btn_focus_bg;
    }
  }
  &__row {
    display: flex;
    align-items: center;
    & > div:not(.dte-font__param) {
      display: flex;
      align-items: center;
      margin-right: 17px;
    }
  }
  &__style-selector {
    display: flex;
    align-items: center;
    margin: 18px 0;
    & > span {
      font-weight: normal;
      font-size: 13px;
      line-height: 15px;
      color: #4356be;
      margin-right: 7px;
    }
    .dte-type__switches {
      margin-right: 7px;
      margin-left: 0;
      path {
        fill: #4356be;
      }
    }
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>

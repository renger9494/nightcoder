<template>
  <div class="field" :class="classesField">
    <div
      class="field__input"
      :class="{
        'field__input--focus': isFieldFocused,
        'field__input--home': isInputLocked
      }"
      v-if="tag === 'input'"
    >
      <svg-icon v-if="iconName" :name="`int-${iconName}`" width="20" height="20" />
      <input
        v-if="!isInputLocked"
        v-mask="mask ? mask : null"
        :type="type"
        :name="name"
        :value="value"
        :readonly="isReadonly"
        :placeholder="placeholder"
        @focus="isFieldFocused = true"
        @blur="isFieldFocused = false"
        @click="onClick ? onClick(name, value) : false"
        @keyup="isReadonly ? false : onChange(name, $event)"
      />
      <p class="field__locked-text" v-if="isLockedTextVisible" :title="lockedText">
        {{ lockedText }}
      </p>
    </div>
    <textarea
      class="field__textarea"
      v-if="tag === 'textarea'"
      :name="name"
      :rows="rows"
      :value="value"
      :readonly="isReadonly"
      @click="onClick ? onClick(name, value) : false"
      @keyup="isReadonly ? false : onChange(name, $event)"
    >
    </textarea>
    <div class="field__error" v-html="error"></div>
    <a href="/dashboard/plans" v-if="isUserFree" class="field__pro-tag">Go PRO to edit</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    tag: String,
    name: String,
    type: String,
    isReadonly: Boolean,
    placeholder: String,
    rows: Number,
    mask: {
      type: [String, Function],
      default: ''
    },
    value: {
      type: String,
      default: '',
      required: true
    },
    error: String,
    lockedText: String,
    isLockedTextCombined: Boolean,
    lockedTextAlign: {
      type: String,
      default: 'right'
    },
    isUserFree: {
      type: Boolean,
      default: false
    },
    iconName: String,
    isInputLocked: {
      type: Boolean,
      default: false
    },
    onChange: Function,
    onClick: Function
  },
  data() {
    return {
      isFieldFocused: false
    };
  },
  computed: {
    isLockedTextVisible(): boolean {
      return this.tag === 'input' && !!this.lockedText;
    },
    classesField(): any {
      return {
        'field_is-readonly': this.isReadonly,
        'field_is-clickable': !!this.onClick,
        'field_locked-combined': this.isLockedTextCombined,
        field_locked: !!this.lockedText,
        'field_locked-left': !!this.lockedText && this.lockedTextAlign === 'left',
        field_error: !!this.error,
        'field_only-pro': this.isUserFree,
        field_icon: this.iconName
      };
    }
  }
});
</script>

<style lang="scss" scoped>
.field {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;

  &__input {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    overflow: hidden;
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    background-color: #ffffff;
    border: 1px solid #dadada;
    border-radius: $shape_border_radius;
    outline: none;
    transition: 0.3s;
    -webkit-appearance: none;

    &:hover {
      border-color: $color_input_overlay_border_focus;
    }

    &--focus {
      border-color: $color_input_overlay_border_focus;
    }

    &:active,
    &:focus {
      border-color: $color_input_overlay_border_focus;
    }
  }

  &_error {
    .field__error {
      opacity: 1;
      visibility: visible;
    }
  }

  &_icon {
    .field__input {
      padding: 0 0 0 24px;
      width: calc(100% - 24px);
      svg {
        position: absolute;
        left: 7px;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
  }

  &__input input,
  &__textarea {
    width: 100%;
    font-size: 13px;
    line-height: 15px;
    color: $black;
    padding: 9px 12px;
    outline: none;
    transition: 0.3s;
    -webkit-appearance: none;
    border: none;
    box-sizing: border-box;
    font-family: inherit;

    &::placeholder {
      color: $gray500;
      font-size: 12px;
      line-height: 16px;
    }

    @include sm-down {
      width: 100%;
    }

    &:hover {
      border-color: $color_input_overlay_border_focus;
    }

    &:active,
    &:focus {
      border-color: $color_input_overlay_border_focus;
    }
  }

  &__textarea {
    resize: none;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: $shape_border_radius;
    min-height: 80px;
    border: 1px solid $gray300;
  }

  &__locked-text {
    font-size: 13px;
    line-height: 15px;
    color: $gray700;
    background: #f3f3f3;
    padding: 9px 12px;
    max-width: 258px;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &__error {
    position: absolute;
    bottom: -4px;
    left: 0;
    font-size: 10px;
    font-weight: 400;
    line-height: normal;
    color: #f26b60;
    transform: translateY(100%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
  }

  &__pro-tag {
    padding: 4px 6px;
    color: #ffc557;
    font-size: 10px;
    line-height: 14px;
    background: $black;
    border-radius: $shape_border_radius;
    position: absolute;
    bottom: 4px;
    right: 4px;
    transition: 0.5s;
    text-decoration: none;

    &:hover {
      opacity: 0.6;
    }
  }

  &_is-readonly {
    .field__input input {
      color: #bdbdbd;
      cursor: not-allowed;
    }
  }

  &_is-clickable {
    .field__input input {
      color: #bdbdbd;
      cursor: pointer;

      &:active,
      &:focus,
      &:hover {
        color: #bdbdbd;
        border: 1px solid #c4c4c4;
        background: #f2f2f2;
      }
    }
  }

  &_locked {
    .field__input input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .field__locked-text {
      &:first-child {
        max-width: unset;
      }
    }
  }

  &_locked-left {
    .field__input {
      flex-direction: row-reverse;
      &--home {
        flex-direction: row;
      }
    }

    .field__input input {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .field__locked-text {
      border: 1px solid transparent;
      border-right-style: none;
      border-radius: 4px 0 0 4px;
      padding: 7px 13px 8px 9px;
    }
  }

  &_locked-combined {
    border-radius: $shape_border_radius;
    padding: 4px 4px 4px 12px;
    background: #f2f2f2;

    .field__input {
      align-items: center;
      width: 100%;
      flex-direction: row-reverse;
      border: none;
      background: #f2f2f2;
      flex: 1 0 45%;

      &--home {
        flex-direction: row;
      }

      .field__locked-text {
        border: 0;
        border-radius: 0;
        padding: 9px 0;
        width: auto;
      }

      input {
        flex: 1;
        border-radius: $shape_border_radius;
        border: 1px solid $gray300;
        background-color: $white;
        height: 33px;
        margin: 0 0 0 4px;
        padding: 2px 0 3px 6px;

        &:hover,
        &:focus {
          border-color: $color_input_overlay_border_focus;
        }
      }
    }
  }

  &_only-pro {
    textarea {
      background: #f3f3f3;
      border: 1px solid #dadada;
      pointer-events: none;
      color: $gray700;
      cursor: not-allowed;
    }
  }
}
</style>

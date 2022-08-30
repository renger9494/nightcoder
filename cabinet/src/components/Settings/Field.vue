<template>
  <div
    class="field field--profile"
    :class="{ 'field_read-only': isReadOnly, field_error: !!error }"
  >
    <label class="field__label" v-if="label" :for="name">{{ label }}</label>
    <input
      :class="{
        'field__input-error': error,
      }"
      class="field__input"
      :id="name"
      :type="type"
      :value="value"
      :readonly="isReadOnly"
      @keyup="onChange(name, $event)"
    />
    <div class="field__error">{{ error }}</div>
  </div>
</template>

<style lang="scss">
.field {
  position: relative;
  display: flex;
  flex-direction: column;
  //width: 320px;

  @include sm-down {
    width: 100%;
  }

  &_read-only {
    .field__input {
      background-color: #f2f2f2;

      &:hover {
        border-color: #dadada;
      }

      &:focus {
        border-color: #dadada;
      }
    }
  }

  &_error {
    .field__error {
      opacity: 1;
      visibility: visible;
    }
  }

  &__label {
    font-size: 10px;
    font-weight: 400;
    color: #828282;
    margin-bottom: 3px;
  }

  &__input {
    width: 100%;
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    background-color: #ffffff;
    border: 1px solid #dadada;
    border-radius: $shape_border_radius;
    outline: none;
    transition: 0.3s;
    -webkit-appearance: none;
    &:-webkit-autofill {
      box-shadow: 0 0 0 50px white inset;
    }

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
  &__input-error {
    border-color: #f46363;
  }

  &--profile {
    .field {
      &__input {
        font-size: 13px;
        line-height: 14px;
        padding: 10px 6px;
      }
      &__label {
        font-size: 13px;
        line-height: 14px;
        color: #000;
        margin-bottom: 4px;
      }
    }
  }

  &__error {
    position: absolute;
    bottom: -3px;
    left: 0;
    font-size: 10px;
    font-weight: 400;
    line-height: normal;
    color: #f26b60;
    transform: translateY(100%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;

    @include sm-down {
      bottom: -8px;
      font-size: 10px;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    label: String,
    name: String,
    type: String,
    value: {
      type: String,
      required: true,
      default: '',
    },
    error: String,
    isReadOnly: Boolean,
    onChange: Function,
  },
})
</script>

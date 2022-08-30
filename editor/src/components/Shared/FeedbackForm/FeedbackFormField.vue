<template>
  <label class="feedback-form-field" :class="{ error_form_feedback: isValid }">
    <span class="feedback-form-field__label">{{ label }}</span>
    <span class="feedback-form-field__error" v-if="isValid">{{ errorText }}</span>
    <input v-if="type === 'input'" class="feedback-form-field__input" v-model="inputValue" type="text" />
    <textarea v-else v-model="inputValue" class="feedback-form-field__input"></textarea>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FeedbackFormField',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    type: {
      type: String,
      required: true
    },
    errorText: {
      type: String,
      required: true
    },
    isValid: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    inputValue: {
      get(): string | number {
        return this.value;
      },
      set(val: string | number): void {
        this.$emit('input', val);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.feedback-form-field {
  display: block;
  position: relative;

  &__label {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    display: block;
  }

  &__input {
    display: block;
    transition: 0.3s;
    border: 1px solid $gray300;
    box-sizing: border-box;
    border-radius: 4px;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    padding: 8px 6px;
    width: 100%;
    font-family: inherit;

    &:hover {
      border-color: $color_input_hover;
    }

    &:focus {
      border-color: $color_input_focus;
    }
  }

  textarea {
    max-width: 400px;
    min-height: 70px;
  }

  &__error {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 10px;
    line-height: 20px;
    color: $danger;
  }

  &.error_form_feedback {
    .feedback-form-field__input {
      border-color: $danger;
    }
  }
}
</style>

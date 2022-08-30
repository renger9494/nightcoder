<template>
  <div :class="`input-field ${classes}`">
    <div class="label">
      {{ label }}
    </div>
    <div class="input-container">
      <input
        ref="input"
        :class="`${type}-input input`"
        @focus="onFocus"
        @blur="onBlur"
        :value="formatValue"
        @input="$emit('input', $event)"
        @keydown.esc="$refs.input.blur()"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Input',

  props: {
    value: {
      type: String | Number,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    classes: {
      type: String,
      default: ''
    },
    onFocus: {
      type: Function,
      default: () => {}
    },
    onBlur: {
      type: Function,
      default: () => {}
    },
    isFocus: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    formatValue() {
      return `#${this.value}`;
    }
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  mounted() {
    this.$refs.input.select();
    this.$refs.input.focus();
  }
};
</script>

<style lang="scss">
.input-field {
  display: flex;
  align-items: center;

  .label {
    margin-top: 0;
    font-size: 10px;
    line-height: 12px;
    margin-right: 12px;
    letter-spacing: 0.05em;
    color: #777777;
    text-transform: uppercase;
  }

  .input-container {
    .input {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #000;
      width: 100%;
      max-width: 135px;
      border-radius: 4px 0 0 4px;
      border: 1px solid #f3f3f3;
      height: 32px;
      padding: 8px;
      margin: 0 -1px 0 0;
      position: relative;
      transition: 0.3s;
      text-transform: uppercase;

      &:hover {
        border-color: $color_input_hover;
      }

      &:focus {
        border-color: $color_input_focus;
      }
    }
  }
}
</style>

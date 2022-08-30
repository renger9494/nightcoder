<template>
  <div class="color-preview-area">
    <div class="input-group">
      <Hex :red="red" :green="green" :blue="blue" :updateColor="updateColor" />

      <div class="alpha-box">
        <input id="alpha" class="alpha-box__input" type="number" v-model="alphaValue" min="0" max="100" />
        <label for="alpha" class="alpha-box__label">%</label>
      </div>
    </div>
  </div>
</template>

<script>
import Hex from './Hex';

export default {
  name: 'Preview',

  props: {
    red: Number,
    green: Number,
    blue: Number,
    alpha: Number,
    updateColor: Function
  },

  components: {
    Hex
  },

  computed: {
    alphaValue: {
      get() {
        return Math.round(this.alpha * 100);
      },
      set(val) {
        console.log(val);
        this.updateColor({ alpha: val / 100 }, 'onChange');
      }
    }
  }
};
</script>

<style lang="scss">
.alpha-box {
  position: relative;
  &__input {
    font-size: 12px;
    line-height: 14px;
    outline: 0;
    width: 53px;
    padding: 8px 5px 8px 8px;
    border: 1px solid $color_input_border;
    border-radius: 0 4px 4px 0;
    transition: border-color 0.2s ease, opacity 0.2s ease;

    &:hover {
      border-color: $color_input_hover;
    }

    &:focus {
      border-color: $color_input_focus;
    }
  }
  &__label {
    position: absolute;
    display: table;
    right: 5px;
    top: 0;
    bottom: 0;
    font-size: 12px;
    line-height: 32px;
  }
}
</style>

<template>
  <div>
    <Input
      :value="hexValue"
      label="hex"
      @input="changeHex"
      :onFocus="() => (inProgress = true)"
      :onBlur="() => (inProgress = false)"
      :inProgress="inProgress"
      :isFocuse="true"
      classes="hex"
    />
  </div>
</template>

<script>
import { Input } from '../../../../components/UI';

import { rgbToHex, hexToRgb } from '../../../../helpers';

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
    Input
  },

  data() {
    return {
      inProgress: false,
      hexValue: rgbToHex(this.red, this.green, this.blue)
    };
  },

  computed: {
    hex() {
      return rgbToHex(this.red, this.green, this.blue);
    }
  },

  watch: {
    inProgress: 'setHex',
    red: 'setHex',
    green: 'setHex',
    blue: 'setHex'
  },

  methods: {
    setHex() {
      if (this.inProgress) {
        return;
      }

      this.hexValue = this.hex;
    },

    changeHex(event) {
      const color = hexToRgb(event.target.value.slice(1));

      if (color) {
        this.updateColor(color);
      }
    }
  }
};
</script>

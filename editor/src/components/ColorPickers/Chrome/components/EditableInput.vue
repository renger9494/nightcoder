<template>
  <div class="vc-editable-input">
    <span :for="label" class="vc-input__label">{{ labelSpanText }}</span>
    <input
      ref="input"
      v-model="val"
      class="vc-input__input"
      @keydown="handleKeyDown"
      @keydown.esc="$refs.input.blur()"
      @input="update"
    />
    <div class="alpha-box">
      <input
        id="alpha"
        class="alpha-box__input"
        type="number"
        v-model="opacityInput"
        @input="updateOpacity"
        min="0"
        max="100"
      />
      <label for="alpha" class="alpha-box__label">%</label>
    </div>
  </div>
</template>

<script>
import hexToRgb from '@/helpers/hexToRgb';

export default {
  name: 'EditableInput',
  props: {
    label: String,
    labelText: String,
    desc: String,
    value: [String, Number],
    max: Number,
    min: Number,
    opacity: Number,
    arrowOffset: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      localColor: null
    };
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(v) {
        if (!(this.max === undefined) && +v > this.max) {
          this.$refs.input.value = this.max;
        } else {
          return v;
        }
      }
    },
    opacityInput: {
      get() {
        return Math.round(this.opacity * 100);
      },

      set(v) {
        return v;
      }
    },
    labelSpanText() {
      return this.labelText || this.label;
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.localColor = val;
      }
    }
  },
  mounted() {
    this.localColor = this.value;
    this.$refs.input.select();
  },
  methods: {
    update(e) {
      this.handleChange(e.target.value);
    },
    updateOpacity(e) {
      const rgb = hexToRgb(this.localColor);
      this.$emit('changeOpacity', {
        ...rgb,
        a: parseInt(e.target.value) / 100
      });
    },
    handleChange(newVal) {
      const data = {};

      data[this.label] = newVal;
      if (data.hex === undefined && data['#'] === undefined) {
        this.$emit('change', data);
      } else if (newVal.length > 5) {
        this.$emit('change', data);
      }
    },

    pickShortcut(e) {
      const { value } = this.$refs.input;

      const colorShortCut = [
        {
          regex: /[0]{1,3}/m,
          hex: '000000'
        },
        {
          regex: /[f]{1,3}/m,
          hex: 'ffffff'
        }
      ];

      const findColor = colorShortCut.find(el => el.regex.test(value));

      this.handleChange(findColor);
    },

    // **** unused
    // handleBlur (e) {
    //   console.log(e)
    // },
    handleKeyDown(e) {
      let val = this.val;
      const number = Number(val);

      if (number) {
        const amount = this.arrowOffset || 1;
        // Up
        if (e.keyCode === 38) {
          val = number + amount;
          this.handleChange(val);
          e.preventDefault();
        }

        // Down
        if (e.keyCode === 40) {
          val = number - amount;
          this.handleChange(val);
          e.preventDefault();
        }
      }

      if (e.keyCode === 13) {
        this.pickShortcut(val);
        e.preventDefault();
      }
    }
    // **** unused
    // handleDrag (e) {
    //   console.log(e)
    // },
    // handleMouseDown (e) {
    //   console.log(e)
    // }
  }
};
</script>

<style lang="scss">
.vc-editable-input {
  position: relative;

  .alpha-box {
    height: 32px;
  }
}
.vc-input__input {
  width: 94px;
}
.vc-input__label {
  text-transform: capitalize;
}
</style>

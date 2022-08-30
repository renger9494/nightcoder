<template>
  <div class="ui-color-picker">
    <Gradient
      v-if="isGradient"
      :points="gradient.points"
      :type="gradient.type"
      :degree="gradient.degree"
      :onChange="onChange"
      :onStartChange="onStartChange"
      :onEndChange="onEndChange"
    />

    <Solid
      v-else
      :red="color.red"
      :green="color.green"
      :blue="color.blue"
      :alpha="color.alpha"
      :hue="color.hue"
      :saturation="color.saturation"
      :value="color.value"
      :onChange="onChange"
      :onStartChange="onStartChange"
      :onEndChange="onEndChange"
    />
  </div>
</template>

<script>
import Solid from './Solid';
import Gradient from './Gradient';

export default {
  name: 'ColorPicker',

  props: {
    isGradient: {
      type: Boolean,
      default: false
    },
    color: {
      type: Object,
      default: () => ({
        red: 255,
        green: 0,
        blue: 0,
        alpha: 1,
        hue: 0,
        saturation: 100,
        value: 100
      })
    },

    gradient: {
      type: Object,
      default: () => ({
        type: 'linear',
        degree: 0,
        points: [
          {
            left: 0,
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1
          },
          {
            left: 100,
            red: 255,
            green: 0,
            blue: 0,
            alpha: 1
          }
        ]
      })
    },

    onStartChange: {
      type: Function,
      default: () => {
      }
    },
    onChange: {
      type: Function,
      default: () => {
      }
    },
    onEndChange: {
      type: Function,
      default: () => {
      }
    }
  },

  components: {
    Solid,
    Gradient
  }
};
</script>

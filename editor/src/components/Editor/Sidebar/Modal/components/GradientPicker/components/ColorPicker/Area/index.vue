<template>
  <div class="picker-area">
    <GradientPoints
      v-if="isGradient"
      :type="type"
      :degree="degree"
      :points="points"
      :activePointIndex="activePointIndex"
      :changeActivePointIndex="changeActivePointIndex"
      :updateGradientLeft="updateGradientLeft"
      :addPoint="addPoint"
      :removePoint="removePoint"
    />

    <Picker
      :red="red"
      :green="green"
      :blue="blue"
      :hue="hue"
      :saturation="saturation"
      :value="value"
      :updateColor="updateColor"
    />

    <div class="preview">
      <div class="color-hue-alpha">
        <Hue
          :hue="hue"
          :saturation="saturation"
          :value="value"
          :updateColor="updateColor"
        />
        <Alpha
          :alpha="alpha"
          :red="red"
          :green="green"
          :blue="blue"
          :updateColor="updateColor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Picker from './Picker';
import Preview from './Preview';
import Hue from './Hue';
import Alpha from './Alpha';
import GradientPoints from './GradientPoints';

export default {
  name: 'Area',

  props: {
    isGradient: Boolean,
    red: Number,
    green: Number,
    blue: Number,
    alpha: Number,
    hue: Number,
    saturation: Number,
    value: Number,
    updateColor: Function,
    points: Array,
    degree: Number,
    type: String,
    activePointIndex: Number,
    changeGradientControl: Function,
    changeActivePointIndex: Function,
    updateGradientLeft: Function,
    addPoint: Function,
    removePoint: Function
  },

  components: {
    Picker,
    GradientPoints,
    Preview,
    Hue,
    Alpha
  }
};
</script>

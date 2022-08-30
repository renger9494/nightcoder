<template>
  <div class="gradient" :style="pointsStyle" @click="pointsContainerClick">
    <div class="gradient-slider-container" ref="pointsContainerRef">
      <GradientPoint
        v-for="(point, index) in points"
        :key="index"
        :activePointIndex="activePointIndex"
        :index="index"
        :point="point"
        :width="width"
        :positions="positions"
        :changeActivePointIndex="changeActivePointIndex"
        :updateGradientLeft="updateGradientLeft"
        :removePoint="removePoint"
      />
    </div>
  </div>
</template>

<script>
import GradientPoint from './GradientPoint';

import { generateGradientStyle, updateGradientActivePercent } from '../../../../helpers';

export default {
  name: 'index',

  props: {
    points: Array,
    activePointIndex: Number,
    changeActivePointIndex: Function,
    updateGradientLeft: Function,
    addPoint: Function,
    removePoint: Function
  },

  data() {
    return {
      width: 0,
      positions: { x: 0, y: 0 }
    };
  },

  components: {
    GradientPoint
  },

  mounted() {
    setTimeout(() => {
      const pointer = this.$refs.pointsContainerRef;

      if (pointer) {
        this.width = pointer.clientWidth;

        const pointerPos = pointer.getBoundingClientRect();

        this.positions = { x: pointerPos.x, y: pointerPos.y };
      }
    }, 500);
  },

  computed: {
    pointsStyle() {
      const style = generateGradientStyle(this.points, 'linear', 90);

      return { background: style };
    }
  },

  methods: {
    pointsContainerClick(event) {
      const left = updateGradientActivePercent(event.pageX - this.positions.x, this.width);

      this.addPoint(left);
    }
  }
};
</script>

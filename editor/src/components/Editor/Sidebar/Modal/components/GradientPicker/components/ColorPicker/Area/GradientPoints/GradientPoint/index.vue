<template>
  <div
    :class="`picker-pointer${activeClassName}`"
    :style="pointStyle"
    @mousedown="mouseEvents"
    @dblclick="() => removePoint(index)"
    @keyup.stop.prevent.delete="deletePoint(index)"
    @click.stop
  >
    <span :class="`child-point${activeClassName}`" />
    <span class="picker-pointer-color">
      <span :style="backgroundColor"></span>
    </span>
  </div>
</template>

<script>
import { useMouseEvents } from '../../../../../hooks';
import { updateGradientActivePercent } from '../../../../../helpers';

export default {
  name: 'GradientPoint',

  props: {
    point: Object,
    activePointIndex: Number,
    index: Number,
    width: Number,
    positions: Object,
    changeActivePointIndex: Function,
    updateGradientLeft: Function,
    removePoint: Function
  },

  data() {
    return {
      mouseEvents: () => {}
    };
  },

  mounted() {
    this.mouseEvents = useMouseEvents(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
  },

  computed: {
    activeClassName() {
      return this.activePointIndex === this.index ? ' active' : '';
    },

    pointStyle() {
      return { left: `${this.point.left * (this.width / 100) - 6}px` };
    },

    backgroundColor() {
      return { background: `rgba(${this.point.red}, ${this.point.green}, ${this.point.blue}, ${this.point.alpha})` };
    }
  },

  methods: {
    mouseDownHandler(event) {
      this.changeActivePointIndex(this.index);

      const startX = event.pageX;
      const startY = event.pageY;
      const offsetX = startX - this.positions.x;

      this.updateGradientLeft(this.point.left, this.index, 'onStartChange');

      return {
        startX,
        startY,
        offsetX
      };
    },

    deletePoint(index) {
      if (this.activePointIndex) this.removePoint(index);
    },

    changeObjectPositions(event, { startX, offsetX }) {
      const moveX = event.pageX - startX;
      offsetX += moveX;
      // update point percent
      const left = updateGradientActivePercent(offsetX, this.width);

      return {
        positions: {
          offsetX,
          startX: event.pageX
        },
        left
      };
    },

    mouseMoveHandler(event, { startX, offsetX }) {
      const { positions, left } = this.changeObjectPositions(event, { startX, offsetX });

      this.updateGradientLeft(left, this.index, 'onChange');

      return positions;
    },

    mouseUpHandler(event, { startX, offsetX }) {
      const { positions, left } = this.changeObjectPositions(event, { startX, offsetX });

      this.updateGradientLeft(left, this.index, 'onEndChange');

      return positions;
    }
  }
};
</script>

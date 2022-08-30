<template>
  <div class="gradient-controls">
    <div @click="gradientTypePopup = true" class="link-type-popup__head link-type-popup__head--auto-width">
      <span style="margin-left: 0;">{{ type === 'linear' ? 'Linear gradient' : 'Radial gradient' }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5" fill="none">
        <path
          d="M3.99999 4.56024C3.85661 4.56024 3.71325 4.50549 3.60394 4.39623L0.164113 0.95637C-0.0547045 0.737552 -0.0547045 0.382776 0.164113 0.164047C0.382843 -0.0546824 0.737548 -0.0546824 0.956383 0.164047L3.99999 3.20783L7.04361 0.164153C7.26243 -0.054576 7.61709 -0.054576 7.83581 0.164153C8.05473 0.382883 8.05473 0.737658 7.83581 0.956476L4.39603 4.39634C4.28667 4.50561 4.14331 4.56024 3.99999 4.56024Z"
          fill="#4356BE"
        />
      </svg>
      <transition name="popup-layer" mode="out-in">
        <div class="type-link-popup" v-if="gradientTypePopup" v-click-outside="() => (gradientTypePopup = false)">
          <div
            :class="`type-link-popup__item ${type === 'linear' ? 'type-link-popup__item--active' : ''}`"
            @click.stop="
              () => {
                changeGradientControl({ type: 'linear' });
                gradientTypePopup = false;
              }
            "
          >
            Linear gradient
          </div>
          <div
            :class="`type-link-popup__item ${type === 'radial' ? 'type-link-popup__item--active' : ''}`"
            @click.stop="
              () => {
                changeGradientControl({ type: 'radial' });
                gradientTypePopup = false;
              }
            "
          >
            Radial gradient
          </div>
        </div>
      </transition>
    </div>

    <div class="gradient-degrees-btn" v-if="type === 'linear'" @click="isGradientDegreeOpen = true">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.9375 6.5625H8.56887L6.7655 4.76C6.59487 4.58938 6.59487 4.31373 6.7655 4.13873C6.93656 3.96811 7.2135 3.96811 7.38456 4.13873L9.8595 6.615C9.96407 6.72 9.99688 6.86438 9.97282 7C9.99688 7.13562 9.96407 7.28 9.8595 7.385L7.38456 9.86127C7.2135 10.0319 6.93656 10.0319 6.7655 9.86127C6.59487 9.69064 6.59487 9.41062 6.7655 9.24L8.56887 7.4375H3.9375C3.696 7.4375 3.5 7.24062 3.5 7C3.5 6.75938 3.696 6.5625 3.9375 6.5625ZM7 13.125C10.3828 13.125 13.125 10.3819 13.125 7C13.125 3.61812 10.3828 0.875 7 0.875C3.61725 0.875 0.875 3.61812 0.875 7C0.875 10.3819 3.61725 13.125 7 13.125ZM7 0C10.8658 0 14 3.1325 14 7C14 10.8675 10.8658 14 7 14C3.13425 14 0 10.8675 0 7C0 3.1325 3.13425 0 7 0Z"
          fill="black"
        />
      </svg>
      <span>{{ degree }}</span>
      <span>deg</span>
      <transition name="popup-layer" mode="out-in">
        <div
          class="gradient-degrees-options"
          v-click-outside="
            () => {
              isGradientDegreeOpen = false;
            }
          "
          v-if="isGradientDegreeOpen"
          @mousedown="mouseEvents"
          @click="onClickGradientDegree"
        >
          <div class="gradient-degrees-options-box">
            <div class="gradient-degrees">
              <div class="gradient-degree-center" :style="degreesStyle">
                <div class="gradient-degree-pointer" />
              </div>
            </div>
            <div
              v-for="item in btnData"
              class="gradient-degrees-options__item"
              :style="`transform: rotate(${item}deg) translate(0, -16px)`"
              :class="{ active: degree == item }"
              @click.stop="setGradientDegree(item)"
            ></div>
          </div>
          <div class="gradient-degree-value">
            <input
              ref="input"
              min="0"
              max="365"
              type="number"
              @focus="$refs.input.select()"
              @click.stop="e => e.preventDefault()"
              v-model="gradientDegree"
            />
            <p>&#176;</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { useMouseEvents } from '../../../../hooks';
import { calculateDegree } from '../../../../helpers';

export default {
  name: 'GradientControls',

  props: {
    type: String,
    degree: Number,
    changeGradientControl: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      disableClick: false,
      mouseEvents: () => {},
      gradientTypePopup: false,
      isGradientDegreeOpen: false,
      btnData: ['0', '45', '90', '135', '180', '225', '270', '315']
    };
  },

  mounted() {
    this.mouseEvents = useMouseEvents(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    this.changeGradientControl({ degree: this.degree });
  },

  computed: {
    degreesStyle() {
      return { transform: `rotate(${this.degree}deg)` };
    },
    gradientDegree: {
      get() {
        if (this.degree === '' || this.degree >= 365) return 0;
        return this.degree;
      },
      set(val) {
        if (val === '' || val >= 365) {
          this.changeGradientControl({ degree: 0 });
          return;
        }
        this.changeGradientControl({ degree: parseInt(val, 10) });
      }
    }
  },

  methods: {
    mouseDownHandler(event) {
      const pointer = event.target;
      const pointerBox = pointer.getBoundingClientRect();
      const centerY = pointerBox.top + parseInt(8 - window.pageYOffset, 10);
      const centerX = pointerBox.left + parseInt(8 - window.pageXOffset, 10);

      return {
        centerY,
        centerX
      };
    },

    mouseMoveHandler(event, { centerX, centerY }) {
      this.disableClick = true;

      const newDegree = calculateDegree(event.clientX, event.clientY, centerX, centerY);

      this.changeGradientControl({ degree: parseInt(newDegree, 10) });
    },

    mouseUpHandler(event) {
      const targetClasses = event.target.classList;

      if (targetClasses.contains('gradient-degrees') || targetClasses.contains('icon-rotate')) {
        return;
      }

      this.disableClick = false;
    },

    onClickGradientDegree() {
      if (this.disableClick) {
        this.disableClick = false;
        return;
      }

      let gradientDegree = this.degree + 45;

      if (gradientDegree >= 360) {
        gradientDegree = 0;
      }

      this.changeGradientControl({ degree: parseInt(gradientDegree, 10) });
    },

    setGradientDegree(val) {
      this.gradientDegree = parseInt(val);
    }
  }
};
</script>

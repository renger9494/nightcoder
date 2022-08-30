<template>
  <div
    :class="['vc-chrome', disableAlpha ? 'vc-chrome__disable-alpha' : '']"
    role="application"
    aria-label="Chrome color picker"
  >
    <div class="vc-chrome-saturation-wrap">
      <saturation v-model="colors" @change="childChange" />
    </div>
    <div class="vc-chrome-body">
      <div class="vc-chrome-controls">
<!--        <div class="vc-chrome-color-wrap">-->
<!--          <button class="design-text-editor__button">-->
<!--            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--              <path-->
<!--                d="M13.5116 2.87496C14.1628 2.22402 14.1628 1.13913 13.5116 0.4882C12.8605 -0.162733 11.7752 -0.162733 11.124 0.4882L9.01268 2.5988C8.99295 2.61853 8.99295 2.61853 8.99295 2.63825L7.67089 1.31666L5.30303 3.68369L6.3291 4.7094L0.606765 10.4297C-0.202255 11.2385 -0.202255 12.5798 0.606765 13.3885C1.00141 13.783 1.53418 14 2.08668 14C2.63918 14 3.17195 13.783 3.5666 13.3885L9.28894 7.66819L10.315 8.69391L12.6829 6.32688L11.3805 5.02501C11.4003 5.00528 11.4003 5.00528 11.42 5.00528L13.5116 2.87496ZM2.99436 12.8165C2.50106 13.3096 1.65257 13.3096 1.179 12.8165C0.685694 12.3234 0.685694 11.4949 1.179 11.0018L6.90134 5.28144L8.7167 7.09616L2.99436 12.8165Z"-->
<!--                fill="black"-->
<!--              />-->
<!--            </svg>-->
<!--          </button>-->
<!--        </div>-->

        <div class="vc-chrome-sliders">
          <div class="vc-chrome-hue-wrap">
            <hue v-model="colors" @change="childChange" />
          </div>
          <div v-if="!disableAlpha" class="vc-chrome-alpha-wrap">
            <!-- @fixme fix pointer -->
            <alpha v-model="colors" @change="childChange" />
          </div>
        </div>
      </div>

      <div v-if="!disableFields" class="vc-chrome-fields-wrap">
        <div v-show="fieldsIndex === 0" class="vc-chrome-fields">
          <!-- hex -->
          <div class="vc-chrome-field vc-chrome-field-line">
            <ed-in
              :value="colors.hex"
              :opacity="parseFloat(colors.a)"
              @change="inputChange"
              @changeOpacity="changeOpacity"
              label="hex"
            />
          </div>
        </div>
        <!-- btn
				<div class="vc-chrome-toggle-btn" role="button" aria-label="Change another color definition" @click="toggleViews">
					<div class="vc-chrome-toggle-icon">
						<svg style="width:24px; height:24px" viewBox="0 0 24 24"
								@mouseover="showHighlight"
								@mouseenter="showHighlight"
								@mouseout="hideHighlight">
							<path fill="#333" d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />
						</svg>
					</div>
					<div class="vc-chrome-toggle-icon-highlight" v-show="highlight"></div>
				</div>
				btn -->
      </div>
    </div>
  </div>
</template>

<script>
import colorMixin from './mixin/color';
import editableInput from './components/EditableInput.vue';
import saturation from './components/Saturation.vue';
import hue from './components/Hue.vue';
import alpha from './components/Alpha.vue';
import checkboard from './components/Checkboard.vue';

export default {
  name: 'Chrome',
  components: {
    saturation,
    hue,
    alpha,
    'ed-in': editableInput,
    // eslint-disable-next-line vue/no-unused-components
    checkboard
  },
  mixins: [colorMixin],
  props: {
    disableAlpha: {
      type: Boolean,
      default: false
    },
    disableFields: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fieldsIndex: 0,
      highlight: false
    };
  },
  computed: {
    hsl() {
      const { h, s, l } = this.colors.hsl;
      return {
        h: h.toFixed(),
        s: `${(s * 100).toFixed()}%`,
        l: `${(l * 100).toFixed()}%`
      };
    },
    activeColor() {
      const rgba = this.colors.rgba;
      return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')';
    },
    hasAlpha() {
      return this.colors.a < 1;
    }
  },
  mounted() {
    this.$emit('pickerChange', this.colors);
  },
  methods: {
    childChange(data) {
      this.colorChange(data);

      this.$emit('pickerChange', this.colors);
    },
    changeOpacity(data) {
      this.colors.a = data.a;
      this.$emit('pickerChange', this.colors);
    },
    inputChange(data) {
      if (!data) {
        return;
      }
      if (data.hex) {
        this.isValidHex(data.hex) &&
          this.colorChange({
            hex: data.hex,
            source: 'hex'
          });
        this.$emit('pickerChange', this.colors);
      } else if (data.r || data.g || data.b || data.a) {
        this.colors.rgba = { ...data };
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: 'rgba'
        });
        this.$emit('pickerChange', this.colors);
      } else if (data.h || data.s || data.l) {
        const s = data.s ? data.s.replace('%', '') / 100 : this.colors.hsl.s;
        const l = data.l ? data.l.replace('%', '') / 100 : this.colors.hsl.l;
        this.colorChange({
          h: data.h || this.colors.hsl.h,
          s,
          l,
          source: 'hsl'
        });
        this.$emit('pickerChange', this.colors);
      }
    }
  }
};
</script>

<style lang="scss">
.vc-chrome {
  background: #fff;
  box-sizing: initial;
  width: 100%;

  .design-text-editor__button {
    width: 34px;
    height: 34px;
  }
}
.vc-chrome-controls {
  display: flex;
  align-items: center;
  padding: 16px 0;
}
.vc-chrome-color-wrap {
  position: relative;
  margin-right: 8px;
}
.vc-chrome-active-color {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
  z-index: 1;
}
.vc-chrome-color-wrap .vc-checkerboard {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-size: auto;
}
.vc-chrome-sliders {
  flex: 1;
}
.vc-chrome-fields-wrap {
  display: flex;
  padding-top: 16px;
}

.vc-chrome-field-line .vc-editable-input {
  display: flex;
  align-items: center;

  .vc-input__label {
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    margin-top: 0;
    margin-right: auto;
    color: #777777;
  }
}

.vc-chrome-fields {
  display: flex;
  flex: 1;
}
.vc-chrome-field {
  width: 100%;
}
.vc-chrome-toggle-btn {
  width: 32px;
  text-align: right;
  position: relative;
}
.vc-chrome-toggle-icon {
  margin-right: -4px;
  margin-top: 12px;
  cursor: pointer;
  position: relative;
  z-index: 2;
}
.vc-chrome-toggle-icon-highlight {
  position: absolute;
  width: 24px;
  height: 28px;
  background: #eee;
  border-radius: $shape_border_radius;
  top: 10px;
  left: 12px;
}
.vc-chrome-hue-wrap {
  position: relative;
  height: 12px;
  margin-bottom: 8px;
}
.vc-chrome-alpha-wrap {
  position: relative;
  height: 12px;
}
.vc-chrome-hue-wrap .vc-hue {
  border-radius: $shape_border_radius;
}
.vc-chrome-alpha-wrap .vc-alpha-gradient {
  border-radius: $shape_border_radius;
}
.vc-chrome-hue-wrap .vc-hue-picker,
.vc-chrome-alpha-wrap .vc-alpha-picker {
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background-color: rgb(248, 248, 248);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
.vc-chrome-saturation-wrap {
  width: 100%;
  padding-bottom: 55%;
  position: relative;
  border-radius: $shape_border_radius;
  overflow: hidden;
}
.vc-chrome-saturation-wrap .vc-saturation-circle {
  width: 10px;
  height: 10px;
}
.vc-chrome-fields .vc-input__input {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: $black;
  width: 100%;
  max-width: 135px;
  border-radius: 4px 0 0 4px;
  border: 1px solid $color_input_border;
  height: 32px;
  padding: 8px;
  margin: 0 -1px 0 0;
  position: relative;
  transition: 0.3s;

  &:hover {
    border-color: $color_input_hover;
    z-index: 2;
  }

  &:focus {
    border-color: $color_input_focus;
    z-index: 2;
  }
}
.vc-chrome-fields .vc-input__label {
  text-transform: uppercase;
  font-size: 11px;
  line-height: 11px;
  color: #969696;
  text-align: center;
  display: block;
  margin-top: 12px;
}
.vc-chrome__disable-alpha .vc-chrome-active-color {
  width: 18px;
  height: 18px;
}
.vc-chrome__disable-alpha .vc-chrome-color-wrap {
  width: 30px;
}
.vc-chrome__disable-alpha .vc-chrome-hue-wrap {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>

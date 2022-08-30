<template>
  <svg
    :class="className"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="width"
    :height="height"
    :style="`color: ${color};`"
  >
    <title v-if="title">{{ title }}</title>
    <use :xlink:href="iconPath" :href="iconPath" x="0" y="0" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
      default: 'close'
    },
    title: {
      type: String,
      default: null
    },
    width: {
      type: [Number, String],
      default: 24
    },
    height: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: '#000'
    }
  },
  methods: {
    getIconUrl(name) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      let icon = require(`@/assets/icons-sprite/${name}.svg`);

      if (Object.prototype.hasOwnProperty.call(icon, 'default')) {
        icon = icon.default;
      }

      return icon;
    }
  },
  computed: {
    iconPath() {
      try {
        return this.getIconUrl(this.name);
      } catch (e) {
        return this.getIconUrl('stub');
      }
    },
    className() {
      return `svg-icon svg-icon--${this.name}`;
    }
  }
};
</script>

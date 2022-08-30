<template>
  <div class="button" :class="theme" @click="handleButtonClick">
    <svg-icon
      :name="iconName"
      :width="iconConfig[iconName].width"
      :height="iconConfig[iconName].height"
      :color="iconConfig[iconName].color"
    />
    <span>{{ name }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    theme: {
      type: String,
      default: 'white'
    },
    iconName: {
      type: String
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      iconConfig: {
        pencil: {
          width: 9,
          height: 12
        },
        hide: {
          width: 12,
          height: 8
        },
        'plus-icon': {
          width: 10,
          height: 10
        },
        'save-icon': {
          width: 12,
          height: 12
        }
      }
    };
  },
  methods: {
    handleButtonClick(event: Event) {
      this.$emit('click', event);
    }
  }
});
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;

  box-sizing: border-box;
  border-radius: $shape_border_radius;

  padding: 0 24px;
  transition: all 0.3s ease;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;

  cursor: pointer;

  svg {
    margin-right: 13px;
    height: 12px;
    width: 12px;
  }

  &.white {
    background: #ffffff;
    border: 1px solid #000;
    color: #000000;

    rect,
    path {
      fill: #000;
    }
    &:hover {
      background: #000;
      color: #fff;
      box-shadow: 0 14px 18px rgba(152, 152, 152, 0.25);
      rect,
      path {
        fill: #fff;
      }
    }
  }

  &.black {
    background: #000;
    border: 1px solid #000;
    color: #fff;

    rect,
    path {
      fill: #fff;
    }
    &:hover {
      background: #fff;
      color: #000;
      box-shadow: 0 14px 18px rgba(152, 152, 152, 0.25);
      rect,
      path {
        fill: #000;
      }
    }
  }

  &.red {
    background: #f46363;
    border: 1px solid #f46363;
    color: #fff;

    rect,
    path {
      fill: #fff;
    }
    &:hover {
      background: #fff;
      color: #f46363;
      box-shadow: 0 14px 18px rgba(152, 152, 152, 0.25);
      rect,
      path {
        fill: #f46363;
      }
    }
  }
}
</style>

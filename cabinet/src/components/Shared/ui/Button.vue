<template>
  <div class="button" :class="theme" @click="handleButtonClick">
    <component v-if="iconName" :is="`${startCaseIcon()}Icon`" />
    <span>{{ name }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { startCase as _startCase } from 'lodash'

import PencilIcon from '@/assets/icons/pencil.svg?inline'
import EyeIcon from '@/assets/icons/eye.svg?inline'
import PlusIcon from '@/assets/icons/plus.svg?inline'
import SaveIcon from '@/assets/icons/save.svg?inline'

export default Vue.extend({
  components: {
    PlusIcon,
    PencilIcon,
    EyeIcon,
    SaveIcon,
  },
  props: {
    theme: {
      type: String,
      default: 'white',
    },
    iconName: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    startCaseIcon() {
      return _startCase(this.iconName)
    },
    handleButtonClick(event: Event) {
      this.$emit('click', event)
    },
  },
})
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
      box-shadow: 0px 14px 18px rgba(152, 152, 152, 0.25);
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
      box-shadow: 0px 14px 18px rgba(152, 152, 152, 0.25);
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
      box-shadow: 0px 14px 18px rgba(152, 152, 152, 0.25);
      rect,
      path {
        fill: #f46363;
      }
    }
  }
}
</style>
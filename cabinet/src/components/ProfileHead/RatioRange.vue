<template>
  <div class="ratio-range">
    <div class="ratio-range__titles">
      <span class="ratio-range__item ratio-range__item_active">
        <span>{{ current }} {{ countName }}</span>
      </span>
      <span class="ratio-range__item">
        <span>{{ limit }} {{ countName }}</span>
      </span>
    </div>
    <div class="ratio-range__line">
      <span :style="`width:${ratioRangePercent}%;`"></span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    limit: {
      type: [Number, String],
      default: () => 1,
    },
    current: {
      type: Number,
      default: () => 0,
    },
    countName: String,
  },
  computed: {
    ratioRangePercent(): number {
      if(typeof this.limit == 'string')
        return 0;
      return (this.current / this.limit) * 100;
    }
  }
})
</script>

<style lang="scss">
.ratio-range {
  width: 150px;
  margin-bottom: 68px;
  &__titles {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__line {
    width: 100%;
    height: 4px;
    background: #f2f2f2;
    border-radius: $shape_border_radius;
    overflow: hidden;
    position: relative;
    span {
      display: inline-block;
      position: absolute;
      background: #000000;
      box-shadow: 0 4px 16px rgba(126, 133, 142, 0.16);
      border-radius: $shape_border_radius;
      height: 100%;
      transition: all 0.3s ease;
    }
  }
  &__item {
    transition: all 0.3s ease;
    text-decoration: none;
    position: relative;
    span {
      letter-spacing: 0.03em;
      text-transform: capitalize;
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      color: #85827f;
    }
    &_active {
      span {
        color: #000000;
      }
    }
    &:hover {
      .ratio-range__label {
        top: -21px;
        opacity: 1;
        visibility: visible;
      }
    }
  }
  &__label {
    position: absolute;
    width: max-content;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: #ffffff;
    padding: 3px 6px;
    background: #333333;
    border-radius: $shape_border_radius;
    top: -16px;
    opacity: 0;
    right: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
}
</style>

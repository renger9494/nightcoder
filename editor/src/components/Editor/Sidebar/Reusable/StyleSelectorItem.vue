<template>
  <div class="style-selector-wrapper" :class="[name === selectedStyle ? 'selected' : '']">
    <div class="style-selector-border">
      <slot />
    </div>
    <div class="style-name">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  // filters: {
  //   formatName: function (value) {
  //     if (!value) return ''
  //     value = value.toString().split('-').filter(w => w !== 'gradient').join(' ')
  //     return value
  //   }
  // },
  props: {
    name: {
      type: String,
      default: ''
    },
    selectedStyle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      //
    };
  },
  methods: {
    //
  }
});
</script>

<style lang="scss" scoped>
.style-selector-wrapper {
  width: 40px;
  margin-right: 10px;
  margin-bottom: 14px;
  cursor: pointer;
}
.style-selector-wrapper:nth-child(5) {
  margin-right: 0;
}
.style-selector-border {
  position: relative;
  width: 40px;
  height: 34px;
  border: 1px solid #bdc2c7;
  border-radius: $shape_border_radius;
  // padding: 7px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  // margin-bottom: 6px;
}
.selected .style-selector-border {
  border: 1px solid #318bf5;
}
.selected .style-selector-border:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  background-color: #318bf5;
  border-bottom-left-radius: 100%;
  width: 4px;
  height: 4px;
}
.style-name {
  font-style: normal;
  font-weight: normal;
  font-size: 8px;
  text-align: center;
  color: #828282;
  text-transform: capitalize;
  margin-top: 6px;
}
</style>

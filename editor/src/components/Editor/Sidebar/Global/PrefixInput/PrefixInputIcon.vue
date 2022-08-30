<template>
  <span>
    <svg-icon v-if="type === 'fontSize'" name="font-size" width="13" height="11" :color="color" />
    <svg-icon v-if="type === 'fontLineHeight'" name="font-line-height" width="16" height="16" :color="color" />
    <svg-icon v-if="type === 'letterSpacing'" name="letter-spacing" width="16" height="16" :color="color" />
    <svg-icon v-if="type === 'borderWidth'" name="border-width" width="13" height="11" :color="color" />
    <span v-else-if="type === 'x' || type === 'shadowX'">X</span>
    <span v-else-if="type === 'y' || type === 'shadowY'">Y</span>
    <span v-else-if="type === 'w'">W</span>
    <span v-else-if="type === 'h'">H</span>
    <svg-icon v-else-if="type === 'a'" name="angle-icon" width="10" height="10" :color="color" />
    <svg-icon v-else-if="type === 'borderRadius'" name="border-radius" width="10" height="10" :color="color" />
    <span v-else-if="type === 'shadowBlur'">Blur</span>
    <span v-else-if="type === 'shadowSpread'">Spread</span>
    <svg-icon v-else-if="type === 'gridGap'" name="grid-gap" width="6" height="13" :color="color" />
    <svg-icon v-else-if="type === 'iconSize'" name="icon-size" width="12" height="12" :color="color" />
    <svg-icon v-else-if="type === 'gridGapBtn'" name="grid-gap-btn" width="12" height="12" :color="color" />
    <svg-icon v-else-if="type === 'textStrokeWidth'" name="stroke-width" width="13" height="11" :color="color" />
  </span>
</template>

<script>
export default {
  props: ['type'],
  data() {
    return {
      color: '#B3B3B3'
    };
  }
};
</script>

<style lang="scss" scoped>
span {
  width: 16px;
  height: 16px;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  letter-spacing: -0.01em;
  color: $gray200;
}
</style>

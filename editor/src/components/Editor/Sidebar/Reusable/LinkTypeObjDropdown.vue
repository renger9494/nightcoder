<template>
  <div class="page-type-button">
    <selected-preview :label="label" button-icon="arrow" @select-clicked="show = !show">
      {{ value }}
    </selected-preview>
    <dropdown-obj-selector
      v-if="show"
      v-click-outside="() => (show = false)"
      :label="dropdownLabel"
      :value="value"
      :choices="choices"
      :path="path"
      @click.native="show = false"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
export default Vue.extend({
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Default Label'
    },
    dropdownLabel: {
      type: String,
      default: 'Default Label'
    },
    choices: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    path: {
      type: String
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    //
  }
});
</script>

<style lang="scss" scoped>
.page-type-button {
  display: inline-block;
  width: 100%;
}
</style>

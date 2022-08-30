<template>
  <div class="sidebar-editor-switcher-wrapper">
    <div
      v-for="choice in choices"
      :key="choice"
      class="sidebar-editor-switcher"
      :class="[value === choice ? 'selected' : '']"
      @click="selectChoice(choice)"
    >
      {{ choice }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    choices: {
      type: Array,
      default: () => []
    },
    value: {
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
    selectChoice(type: any) {
      this.$emit('input', type);
    }
  }
});
</script>

<style lang="scss" scoped>
.sidebar-editor-switcher-wrapper {
  border: 1px solid #bdc2c7;
  border-radius: 20px;
  padding: 3px 4px;
  display: inline-flex;
  margin-bottom: 14px;
}
.sidebar-editor-switcher {
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  padding: 2px 8px;
  border: 1px solid transparent;
  border-radius: 20px;
  cursor: pointer;
}
.sidebar-editor-switcher.selected {
  border: 1px solid #949cad;
  box-shadow: $shadow_small;
}
</style>

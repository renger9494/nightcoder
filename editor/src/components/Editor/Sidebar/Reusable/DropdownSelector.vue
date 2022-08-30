<template>
  <div class="dropdown-selector-wrapper">
    <div class="dropdown-label">{{ label }}</div>
    <div class="dropdown-choices">
      <div
        v-for="choice in choices"
        :key="choice"
        class="dropdown-choice"
        :class="[choice === value ? 'selected' : '']"
        @click="$emit('input', choice)"
      >
        {{ choice }}
      </div>
    </div>
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
      default: 'Make a choice'
    },
    choices: {
      type: Array as PropType<any[]>,
      default: () => []
    }
  },
  data() {
    return {
      top: null
    };
  },
  methods: {
    //
  }
});
</script>

<style lang="scss" scoped>
.dropdown-selector-wrapper {
  width: 240px;
  height: 142px;
  background: #ffffff;
  // border: 1px solid #BDC2C7;
  box-shadow: $shadow_small;
  border-radius: $shape_border_radius;
  margin-top: 10px;
  margin-bottom: 14px;
  overflow: hidden;
}
.dropdown-selector-wrapper:hover {
  overflow-y: overlay;
}
.dropdown-selector-wrapper::-webkit-scrollbar {
  width: 5px;
  background: transparent;
}
.dropdown-selector-wrapper::-webkit-scrollbar-thumb {
  background: #bdc2c7;
  height: 30px;
  border-radius: 10px;
}
.dropdown-selector-wrapper::-webkit-scrollbar-track-piece {
  display: none;
}

.sidebar-link-item.dashed .dropdown-selector-wrapper {
  margin-bottom: 10px;
}

.dropdown-label {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  padding: 14px 8px;
}
.dropdown-choices {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #828282;
}
.dropdown-choice {
  padding: 5px 7px;
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dropdown-choice:hover {
  background: #4356be;
  color: white !important;
}
.dropdown-choice.selected {
  color: #4356be;
}
</style>

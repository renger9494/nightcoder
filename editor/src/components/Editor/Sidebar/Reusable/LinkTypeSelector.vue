<template>
  <div class="link-type-selector-wrapper">
    <div class="selected-link-item" @click="show = true">
      <div class="link-item-name">
        {{ value }}
      </div>
      <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.79711 2.94947C2.91185 3.05483 3.08815 3.05483 3.20289 2.94947L4.97086 1.32625C5.06608 1.23883 5.06608 1.08865 4.97086 1.00123C4.88648 0.923758 4.75683 0.923758 4.67245 1.00123L3.06763 2.47467C3.02938 2.50978 2.97062 2.50978 2.93237 2.47467L1.32755 1.00123C1.24317 0.923758 1.11352 0.923758 1.02914 1.00123C0.933925 1.08865 0.933924 1.23883 1.02914 1.32625L2.79711 2.94947Z"
          fill="black"
          stroke="black"
          stroke-width="0.2"
        />
      </svg>
    </div>
    <div v-if="show" v-click-outside="close" class="link-items-dropdown">
      <div
        v-for="type in linkTypes"
        :key="type"
        :value="type"
        class="dropdown-link-item"
        :class="[type === value ? 'selected' : '']"
        @click="selectType(type)"
      >
        {{ type }}
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
    linkTypes: {
      type: Array as PropType<any[]>,
      default: () => []
    }
  },
  data() {
    return {
      // linkTypes: ['url', 'block', 'page', 'email'],
      show: false
    };
  },
  methods: {
    selectType(type: string) {
      this.$emit('input', type);
      this.show = false;
    },
    close() {
      this.show = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.link-type-selector-wrapper {
  position: relative;

  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  user-select: none;
  color: #000000;
}

// .link-item {
//   border: 1px solid transparent;
//
//   padding: 2px 8px;
//   text-align: center;
//   cursor: pointer;
//   margin: 3px;
// }
// .link-item:hover {
//   border-color: #949CAD;
//   box-shadow: $shadow_small;
// }

.selected-link-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border: 1px solid #949cad;
  border-radius: 20px;
  box-shadow: $shadow_small;
  cursor: pointer;
}
.selected-link-item:hover {
  border-color: #4356be;
}
.link-item-name {
  margin-right: 4px;
}

.link-items-dropdown {
  position: absolute;
  top: -1px;
  right: 0;
  // width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  box-shadow: $shadow_small;
  border-radius: 8px;
  padding: 7px 0;
}

.dropdown-link-item {
  position: relative;
  padding: 3px 10px 3px 17px;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
.dropdown-link-item:hover {
  color: #ffffff;
  background: #4356be;
}
.selected.dropdown-link-item {
  background: #ffffff;
  color: #000000;
  cursor: default;
}
.selected.dropdown-link-item:before {
  content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgOCA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuODI4NTUgMC4xNzU3MzZDOC4wNTcxNSAwLjQxMDA1MSA4LjA1NzE1IDAuNzg5OTUgNy44Mjg1NSAxLjAyNDI2TDMuNDM4MzEgNS41MjQyNkMzLjIwOTcxIDUuNzU4NTggMi44MzkwNyA1Ljc1ODU4IDIuNjEwNDcgNS41MjQyNkwwLjE3MTQ1IDMuMDI0MjZDLTAuMDU3MTQ5OSAyLjc4OTk1IC0wLjA1NzE0OTkgMi40MTAwNSAwLjE3MTQ1IDIuMTc1NzRDMC40MDAwNDkgMS45NDE0MiAwLjc3MDY4MiAxLjk0MTQyIDAuOTk5MjgyIDIuMTc1NzRMMy4wMjQzOSA0LjI1MTQ3TDcuMDAwNzIgMC4xNzU3MzZDNy4yMjkzMiAtMC4wNTg1Nzg3IDcuNTk5OTUgLTAuMDU4NTc4NyA3LjgyODU1IDAuMTc1NzM2WiIgZmlsbD0iIzQzNTZCRSIvPgo8L3N2Zz4K');
  position: absolute;
  top: 4px;
  left: 5px;
}
</style>

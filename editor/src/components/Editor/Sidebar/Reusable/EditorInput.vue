<template>
  <div class="editor-input-wrapper">
    <label :for="id">{{ label }}</label>
    <input :id="id" type="text" :value="value" :placeholder="placeholder" @input="processInput" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { nanoid } from 'nanoid';

export default Vue.extend({
  props: {
    placeholder: {
      type: String,
      default: 'Default Placeholder'
    },
    label: {
      type: String,
      default: 'Default Label'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      id: `id-${nanoid(10)}`
    };
  },
  methods: {
    processInput(v: any) {
      this.$emit('input', v.target.value);
    }
  }
});
</script>

<style lang="scss" scoped>
.editor-input-wrapper {
  display: inline-block;
  width: 100%;
  margin-bottom: 14px;
}
.sidebar-link-item.dashed .editor-input-wrapper {
  margin-bottom: 10px;
}

input {
  width: 100%;
  padding: 9px;
  border: 1px solid #bdc2c7;
  border-radius: $shape_border_radius;
  // margin-bottom: 14px;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
}

input:focus,
input:hover {
  border-color: #318bf5;
}

input::placeholder {
  color: rgba(189, 189, 189, 0.5);
}

label {
  display: inline-block;

  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}
</style>

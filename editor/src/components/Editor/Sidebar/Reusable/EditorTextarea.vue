<template>
  <div class="editor-textarea-wrapper">
    <label :for="id">{{ label }}</label>
    <textarea
      :id="id"
      ref="textarea"
      autocomplete="off"
      spellcheck="false"
      rows="1"
      :value="value"
      :placeholder="placeholder"
      @input="processTextarea"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import autosize from 'autosize';
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
  mounted() {
    const textarea: any = this.$refs.textarea;
    autosize(textarea);
    document.fonts.ready.then(() => {
      autosize.update(textarea);
    });
  },
  methods: {
    processTextarea(v: any) {
      this.$emit('input', v.target.value);
    }
  }
});
</script>

<style lang="scss" scoped>
textarea {
  width: 100%;
  padding: 9px;
  border: 1px solid #bdc2c7;
  border-radius: $shape_border_radius;
  margin-bottom: 14px;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  resize: vertical;
}

textarea:focus,
textarea:hover {
  border-color: #318bf5;
}

textarea::placeholder {
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

<template>
  <input :placeholder="placeholder" class="form-input-element" :id="element.id" :class="element.id"/>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { MetaInfo } from 'vue-meta';
import useInjectStylesPublishVdr from "../../hooks/publish/injectStylesPublishVdr.hook";

export default defineComponent({
  name: 'FormElementInputPublish',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  metaInfo(): MetaInfo {
    return {
      style: [{ type: 'text/css', cssText: this.stylesToHead }],
      __dangerouslyDisableSanitizers: ['style']
    };
  },
  setup(props, { root }) {
    const stylesToHead = useInjectStylesPublishVdr(props.value);

    return {
      stylesToHead,
      element: props.value,
      placeholder: props.value.payload.text
    };
  }
});
</script>

<style lang="scss">
.form-input-element {
  width: 100%;
  height: 100%;
  outline: none;
  display: block;
  transition: 0.3s;
  -webkit-appearance: none;

  &::placeholder {
    color: inherit;
    font: inherit;
    opacity: 0.7;
  }

  &:focus {
    border-color: #318BF5 !important;
  }
}
</style>

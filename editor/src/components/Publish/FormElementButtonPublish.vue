<template>
  <button class="form-button-element" :id="element.id" :class="element.id">
    <span>{{ text }}</span>
  </button>
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
      text: props.value.payload.text
    };
  }
});
</script>

<style lang="scss" scoped>
.form-button-element {
  width: 100%;
  height: 100%;
  cursor: pointer;
  border: unset;
  transition: 0.3s;

  &:hover {
    opacity: 0.6;
  }

  span {
    font: inherit;
    width: 100%;
    display: block;
  }
}
</style>

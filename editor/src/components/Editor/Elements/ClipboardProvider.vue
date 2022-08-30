<template></template>

<script lang="ts">
import useClipboardToStore from '@/hooks/editor/utils/clipboardToStore.hook';
import { watch, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ClipboardProvider',
  props: {
    element: {
      type: Element,
      default: () => document.body,
      required: false
    }
  },
  setup(props, { root }) {
    watch(
      () => props.element,
      () => useClipboardToStore({ store: root.$store, element: props.element }),
      { immediate: true }
    );
  }
});
</script>

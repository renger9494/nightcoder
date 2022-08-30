<template>
  <iframe :class="value.id" :style="computedStyle" ref="iframe" :width="iframeWidth" :height="iframeHeight"></iframe>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import useEmbedElementCommonEditorFunctionality from '@/components/Editor/Elements/embedElementCommonEditorFunctionality.hook';

export default defineComponent({
  props: {
    value: {
      type: Object
    },
    previewMode: {
      type: String,
      default: 'laptop'
    }
  },
  setup(props, { root }) {
    const embedElementCommonEditorFunctionality = useEmbedElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      ...embedElementCommonEditorFunctionality
    };
  }
});
</script>

<style>
.iframe-cover {
  width: 100%;
  height: 100%;
}

iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
/* 
.iframe-cover:after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
} */
</style>

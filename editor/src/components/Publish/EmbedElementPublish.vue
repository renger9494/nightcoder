<template>
  <iframe
    :id="value.id"
    ref="iframe"
    :srcdoc="iframeHtml"
    sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-pointer-lock"
  ></iframe>
</template>

<script lang="ts">
import Vue from 'vue';
import { MetaInfo } from 'vue-meta';
import useInjectStylesPublishVdr from '../../hooks/publish/injectStylesPublishVdr.hook';
import { breakpointsWidths } from '../../constants/breakpoints';

export default Vue.extend({
  name: 'EmbedElementPublish',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  metaInfo(): MetaInfo {
    const stylesToHead = useInjectStylesPublishVdr(this.value);
    return {
      style: [{ type: 'text/css', cssText: stylesToHead }],
      __dangerouslyDisableSanitizers: ['style']
    };
  },
  mounted() {
    const $value = this.value;
    const iframe = this.$refs.iframe as HTMLIFrameElement;

    function resizeIframe() {
      const width = window.innerWidth;
      const breakpoint = Object.keys(breakpointsWidths).find(key => breakpointsWidths[key] < width);

      if (breakpoint && iframe) {
        iframe.width = $value.location[breakpoint].w;
        iframe.height = $value.location[breakpoint].h;
      }
    }

    window.addEventListener('resize', () => {
      resizeIframe();
    });

    resizeIframe();
  },
  computed: {
    iframeHtml(): string {
      const payload = this.value.payload;
      if (payload && payload.code) {
        return `<!DOCTYPE html><html style="height: 100%"><head><style>iframe{display:block;}</style></head><body style="margin:0; padding: 0; height: 100%; box-sizing: border-box;">${payload.code}</body></html>`;
      }
      return '';
    }
  }
});
</script>

<style lang="scss">
iframe {
  border: 0;
}
</style>

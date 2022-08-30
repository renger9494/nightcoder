<template>
  <div :id="element.id" class="video">
    <youtube :video-id="src" :player-vars="playerVars" ref="youtube" />
  </div>
</template>

<script lang="ts">
import useInjectStylesPublishVdr from '../../hooks/publish/injectStylesPublishVdr.hook';
import { computed, defineComponent } from '@vue/composition-api';
import { MetaInfo } from 'vue-meta';
import { youtubeLinkParser } from '../../constants/youtubeLinkParser';

const DEFAULT_LINK = 'n3Dru5y3ROc';

export default defineComponent({
  name: 'VideoElementPublish',
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
  setup(props) {
    const stylesToHead = useInjectStylesPublishVdr(props.value);
    const payloadLink = computed(() => props.value.payload.url);
    const isAutoplay = computed(() => props.value.payload.isAutoplay);
    const isLoop = computed(() => props.value.payload.isLoop);
    const isMute = computed(() => props.value.payload.isMute);
    const src = computed(() => {
      if (!payloadLink.value || payloadLink.value === DEFAULT_LINK) return DEFAULT_LINK;
      return youtubeLinkParser(payloadLink.value);
    });
    const playerVars = computed(() => ({
      autoplay: isAutoplay.value,
      loop: isLoop.value,
      mute: isMute.value,
      // eslint-disable-next-line @typescript-eslint/camelcase
      cc_load_policy: 0,
      controls: 0,
      fs: 0,
      showinfo: 0,
      // eslint-disable-next-line @typescript-eslint/camelcase
      iv_load_policy: 3,
      modestbranding: 1,
      ps: 'docs',
      autohide: 1
    }));

    return {
      src,
      playerVars,
      stylesToHead,
      element: props.value
    };
  }
});
</script>

<style lang="scss">
.video {
  width: 100%;
  height: 100%;
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>

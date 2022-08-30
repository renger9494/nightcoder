<template>
  <div class="video" :id="value.id" :class="value.id" :style="computedStyle">
    <youtube :video-id="src" :player-vars="playerVars" ref="youtube" />
  </div>
</template>

<script lang="ts">
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { useAnchorPointsByLocation } from '@/hooks/editor/anchorPoints.hook';
import { useVideoElementCommonEditorFunctionality } from '@/components/Editor/Elements/videoElementCommonEditorFunctionality.hook';
import { computed, defineComponent, ref } from '@vue/composition-api';
import { youtubeLinkParser } from '@/constants/youtubeLinkParser';

const DEFAULT_LINK = 'n3Dru5y3ROc';

export default defineComponent({
  name: 'VideoElementPreview',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    previewMode: {
      type: String,
      default: 'laptop'
    }
  },
  setup(props, { root }) {
    const youtube = ref(null as any);
    // Editor functionality
    useDisplayConditions({
      element: { value: props.value },
      conditions: [{ condition: 'hideBoxShadow', value: false }],
      store: root.$store
    });

    useAnchorPointsByLocation({
      element: props.value,
      location: computed(() => props.value.location[props.previewMode]),
      store: root.$store
    });

    // Common editor functionality
    const videoCommonEditorFunctionality = useVideoElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

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
      // Common editor functionality
      ...videoCommonEditorFunctionality,
      playerVars,
      youtube,
      src
    };
  }
});
</script>

<style lang="scss" scoped>
.video {
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>

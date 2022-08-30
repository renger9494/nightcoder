<template>
  <div class="video" :id="value.id" :class="value.id" :style="computedStyle">
    <iframe width="500" height="300" title="YouTube video player" frameborder="0" :src="src"></iframe>
  </div>
</template>

<script lang="ts">
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { useAnchorPointsByLocation } from '@/hooks/editor/anchorPoints.hook';
import { useVideoElementCommonEditorFunctionality } from '@/components/Editor/Elements/videoElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';
import { youtubeLinkParser } from '@/constants/youtubeLinkParser';

const DEFAULT_LINK = 'n3Dru5y3ROc';

export default defineComponent({
  name: 'VideoElementEditor',
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

    const src = computed(() => {
      if (!payloadLink.value || payloadLink.value === DEFAULT_LINK)
        return `https://www.youtube.com/embed/${DEFAULT_LINK}`;
      return `https://www.youtube.com/embed/${youtubeLinkParser(payloadLink.value)}`;
    });

    return {
      // Common editor functionality
      ...videoCommonEditorFunctionality,
      src
    };
  }
});
</script>

<style lang="scss" scoped>
.video {
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
}
</style>

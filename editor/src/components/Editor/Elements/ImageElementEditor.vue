<template>
  <div
    v-if="value.payload.src || value.payload.image"
    :id="value.id"
    :target="value.payload.link.openType === 'new' ? '_blank' : ''"
    :class="value.id"
    class="content-image-wrapper"
  >
    <div :style="outlineStyle">
      <div v-if="isOverlayActive && !displayConditions.hideOverlay" :style="overlayStyle" class="image-overlay" />
      <picture :id="value.id">
        <source
          v-if="value.payload.image && value.payload.image.fullPathWebP && !isImgSvg"
          type="image/webp"
          :srcset="value.payload.image.fullPathWebP.replace(' ', '%20')"
        />
        <source
          v-if="value.payload.image && value.payload.image.fullPathJp2 && !isImgSvg"
          type="image/jp2"
          :srcset="value.payload.image.fullPathJp2.replace(' ', '%20')"
        />
        <img v-if="value.payload.image" :src="value.payload.image.fullPath" :style="imgStyle" />
        <img v-else-if="value.payload.src.indexOf(' 2x') !== -1" :srcset="value.payload.src" :style="imgStyle" />
        <img v-else :src="value.payload.src" :style="imgStyle" />
      </picture>
    </div>
  </div>
</template>

<script lang="ts">
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { useAnchorPointsByLocation } from '@/hooks/editor/anchorPoints.hook';
import { useImageElementCommonEditorFunctionality } from '@/components/Editor/Elements/imageElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'ImageElementEditor',
  components: {},
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    isGallery: {
      type: Boolean,
      default: false
    },
    editunable: {
      type: Boolean,
      default: false
    },
    typeOfClick: {
      type: String,
      default: null
    },
    previewMode: {
      type: String,
      default: 'laptop'
    }
  },
  setup(props, { root }) {
    // Editor functionality

    const { displayConditions } = useDisplayConditions({
      element: { value: props.value },
      conditions: [
        { condition: 'boxShadow', value: false },
        { condition: 'hideBorder', value: false },
        { condition: 'hideOverlay', value: false }
      ],
      store: root.$store
    });

    useAnchorPointsByLocation({
      element: props.value,
      location: computed(() => props.value.location[props.previewMode]),
      store: root.$store
    });

    // Common editor functionality

    const imageCommonEditorFunctionality = useImageElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      // Editor functionality
      displayConditions,

      // Common editor functionality
      ...imageCommonEditorFunctionality
    };
  }
});
</script>

<style lang="scss" scoped>
.content-image-wrapper {
  height: 100%;
  position: relative;
}

.content-image-wrapper > span {
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.content-image-wrapper span {
  height: 100%;
  display: block;
}

.content-image-wrapper img {
  width: 100%;
  height: 100%;
}

.image-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>

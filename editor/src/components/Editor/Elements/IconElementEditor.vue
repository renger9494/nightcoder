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
      <picture>
        <img v-if="value.payload.image" :src="value.payload.image.fullPath" :style="imgStyle" />
        <!--1-->
        <img v-else-if="value.payload.src.indexOf(' 2x') !== -1" :srcset="value.payload.src" :style="imgStyle" />
        <!--2-->
        <img v-else :src="value.payload.src" :style="imgStyle" />
        <!--3-->
      </picture>
    </div>
  </div>
</template>

<script lang="ts">
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { useAnchorPointsByLocation } from '@/hooks/editor/anchorPoints.hook';
import { useIconElementCommonEditorFunctionality } from '@/components/Editor/Elements/iconElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'IconElementEditor',
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
    const iconCommonEditorFunctionality = useIconElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      // Editor functionality
      displayConditions,

      // Common editor functionality
      ...iconCommonEditorFunctionality
    };
  }
});
</script>

<style lang="scss" scoped>
.content-image-wrapper {
  height: 100%;
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
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>

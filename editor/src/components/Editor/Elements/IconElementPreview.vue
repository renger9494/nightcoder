<template>
  <component
    :is="hrefValue !== '' ? 'a' : 'div'"
    :href="hrefValue ? hrefValue : null"
    :target="openType"
    :download="isDownload ? 'airtap.io' : null"
    v-if="value.payload.src || value.payload.image"
    :class="value.id"
    class="content-image-wrapper"
  >
    <div :style="outlineStyle">
      <div class="image-overlay" :style="overlayStyle" />
      <picture>
        <img v-if="value.payload.image" :src="value.payload.image.fullPath" :style="imgStyle" />
        <img v-else-if="value.payload.src.indexOf(' 2x') !== -1" :srcset="value.payload.src" :style="imgStyle" />
        <img v-else :src="value.payload.src" :style="imgStyle" />
      </picture>
    </div>
  </component>
</template>

<script lang="ts">
import { useIconElementCommonEditorFunctionality } from '@/components/Editor/Elements/iconElementCommonEditorFunctionality.hook';
import { computed, defineComponent } from '@vue/composition-api';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';

export default defineComponent({
  name: 'IconElementPreview',
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
    useDisplayConditions({
      element: { value: props.value },
      conditions: [
        { condition: 'boxShadow', value: false },
        { condition: 'hideBorder', value: false },
        { condition: 'hideOverlay', value: false }
      ],
      store: root.$store
    });

    const iconCommonEditorFunctionality = useIconElementCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      computed(() => props.previewMode)
    );

    return {
      ...iconCommonEditorFunctionality
    };
  }
});
</script>

<style lang="scss" scoped>
.content-image-wrapper {
  height: 100%;
  transition: opacity 0.3s linear;
  display: block;
}

.content-image-wrapper > div {
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

a.content-image-wrapper {
  &:hover {
    opacity: 0.5;
  }
}
</style>

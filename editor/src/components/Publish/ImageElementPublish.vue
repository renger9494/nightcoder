<template>
  <component
    :is="hrefValue ? 'a' : 'div'"
    v-if="element.payload.src || element.payload.image"
    :target="element.payload.link.openType"
    :download="element.payload.link.type === LinkType.Download ? 'airtap.io' : null"
    :href="hrefValue"
    :id="element.id"
    class="content-image-wrapper"
  >
    <div>
      <div class="image-overlay" :id="`${element.id}__overlay`" />
      <picture>
        <source
          v-if="element.payload.image && element.payload.image.fullPathWebP"
          type="image/webp"
          :srcset="element.payload.image.fullPathWebP.replace(' ', '%20')"
        />
        <source
          v-if="element.payload.image && element.payload.image.fullPathJp2"
          type="image/jp2"
          :srcset="element.payload.image.fullPathJp2.replace(' ', '%20')"
        />
        <img v-if="element.payload.image" :src="element.payload.image.fullPath" />
        <img v-else-if="element.payload.src.indexOf(' 2x') !== -1" :srcset="element.payload.src" />
        <img v-else :src="element.payload.src" />
      </picture>
    </div>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import useInjectSeparateBlocksStyles from '../../hooks/publish/injectSeparateBlocksStyles.hook';
import { MetaInfo } from 'vue-meta';

import { formatLocalUrl, LinkType } from '../../constants/link';

export default defineComponent({
  name: 'ImageElementPublish',
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
    const dynamicBlockStyleCollection = [
      {
        idName: `#${props.value.id}`,
        stylesToSplit: ['display', 'borderRadius', 'opacity', 'objectFit', 'boxShadow', 'border']
      },
      {
        idName: `#${props.value.id}__overlay`,
        stylesToSplit: ['overlay', 'borderRadius', 'displayOverlay']
      }
    ];
    const stylesToHead = useInjectSeparateBlocksStyles(props.value, dynamicBlockStyleCollection);

    const hrefValue = formatLocalUrl(root.$store.state, props.value.payload.link);

    return {
      LinkType,
      stylesToHead,
      hrefValue,
      element: props.value
    };
  }
});
</script>

<style lang="scss">
.content-image-wrapper {
  height: 100%;
  display: block;
  position: relative;
  transition: opacity 0.3s linear;

  & > div {
    display: block;
    overflow: hidden;
    width: 100%;
    border-radius: inherit;
    height: 100%;
    object-fit: inherit;
    opacity: inherit;
    box-shadow: inherit;
  }
  & div {
    height: 100%;
    display: block;
  }

  & picture {
    object-fit: inherit;
    opacity: inherit;
  }

  & img {
    width: 100%;
    height: 100%;
    object-fit: inherit;
    opacity: inherit;
  }
}

.image-overlay {
  position: absolute;
  left: 0;
  top: 0;
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

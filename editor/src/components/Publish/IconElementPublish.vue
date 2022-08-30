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
      <div v-if="overlayStyle" class="image-overlay" :style="overlayStyle" />
      <picture>
        <img v-if="element.payload.image" :src="element.payload.image.fullPath" />
        <img v-else-if="element.payload.src.indexOf(' 2x') !== -1" :srcset="element.payload.src" />
        <img v-else :src="element.payload.src" />
      </picture>
    </div>
  </component>
</template>

<script lang="ts">
import useInjectStylesPublishVdr from '../../hooks/publish/injectStylesPublishVdr.hook';
import { computed, defineComponent } from '@vue/composition-api';
import { MetaInfo } from 'vue-meta';

import { formatLocalUrl, LinkType } from '../../constants/link';

export default defineComponent({
  name: 'IconElementPublish',
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
    const stylesToHead = useInjectStylesPublishVdr(props.value);
    const overlay = props.value.styles.laptop['overlay'];

    const overlayStyle = computed(() => {
      if (!overlay) return null;
      return {
        borderRadius: props.value.styles.laptop['borderRadius'],
        backgroundColor: overlay
      };
    });

    const hrefValue = formatLocalUrl(root.$store.state, props.value.payload.link);

    return {
      LinkType,
      overlayStyle,
      stylesToHead,
      hrefValue,
      element: props.value
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
  object-fit: inherit;
  opacity: inherit;
  box-shadow: inherit;
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

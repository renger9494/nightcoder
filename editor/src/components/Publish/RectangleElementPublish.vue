<template>
  <component
    :is="hrefValue ? 'a' : 'div'"
    :href="hrefValue"
    :target="element.payload.link.openType"
    :download="element.payload.link.type === LinkType.Download ? 'airtap.io' : null"
    :id="element.id"
    class="rectangle"
  />
</template>

<script lang="ts">
import useInjectStylesPublishVdr from '../../hooks/publish/injectStylesPublishVdr.hook';
import { defineComponent } from '@vue/composition-api';
import { MetaInfo } from 'vue-meta';
import { formatLocalUrl, LinkType } from '../../constants/link';

export default defineComponent({
  name: 'RectangleElementPublish',
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
.rectangle {
  width: 100%;
  height: 100%;
  display: block;
  transition: opacity 0.3s linear;
}

a.rectangle {
  &:hover {
    opacity: 0.5;
  }
}
</style>

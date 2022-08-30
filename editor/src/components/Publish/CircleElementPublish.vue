<template>
  <component
    :is="hrefValue ? 'a' : 'div'"
    :href="hrefValue"
    :target="element.payload.link.openType"
    :download="element.payload.link.type === LinkType.Download ? 'airtap.io' : null"
    :id="element.id"
    class="circle"
  />
</template>

<script lang="ts">
import useInjectStylesPublishVdr from '../../hooks/publish/injectStylesPublishVdr.hook';
import { defineComponent } from '@vue/composition-api';
import { MetaInfo } from 'vue-meta';

import { formatLocalUrl, LinkType } from '../../constants/link';

export default defineComponent({
  name: 'CircleElementPublish',
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
.circle {
  width: 100%;
  height: 100%;
  display: block;
  transition: opacity 0.3s linear;
}

a.circle {
  &:hover {
    opacity: 0.5;
  }
}
</style>

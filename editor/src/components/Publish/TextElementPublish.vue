<template>
  <component
    :is="tag"
    :id="value.id"
    :href="hrefValue"
    :target="value.payload.link.openType"
    :download="value.payload.link.type === LinkType.Download ? 'airtap.io' : null"
    class="text-element"
  >
    <span v-html="value.payload.content"></span>
  </component>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import useInjectStylesPublishVdr from '../../hooks/publish/injectStylesPublishVdr.hook';
import useInjectCustomBrakePointForStyleEntity from '../../hooks/publish/injectCustomBrakePointForStyleEntity.hook';
import { customQueries } from '../../constants/breakpoints';
import { MetaInfo } from 'vue-meta';

import { LinkType, formatLocalUrl } from '../../constants/link';

export default defineComponent({
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
    let stylesToHead = useInjectStylesPublishVdr(props.value);
    stylesToHead += useInjectCustomBrakePointForStyleEntity('fontSize', customQueries, props.value);

    const hrefValue = formatLocalUrl(root.$store.state, props.value.payload.link);

    return {
      LinkType,
      stylesToHead,
      hrefValue,
      tag: hrefValue ? 'a' : props.value.payload.type
    };
  }
});
</script>

<style lang="scss">
.text-element {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  word-break: break-word;
  transition: opacity 0.3s linear;
}
a.text-element {
  display: block;

  &:hover {
    opacity: 0.5;
  }
}
</style>

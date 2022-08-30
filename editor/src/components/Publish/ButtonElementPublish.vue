<template>
  <component
    :is="hrefValue ? 'a' : 'div'"
    :href="hrefValue"
    :target="element.payload.link.openType"
    :download="element.payload.link.type === LinkType.Download ? 'airtap.io' : null"
    :id="element.id"
    class="button-element"
  >
    <img
      v-if="!isIconHidden && isIconLeft && iconSrc"
      :src="iconSrc"
      alt="button icon"
      :id="`${value.id}-icon`"
      class="button-element__icon"
    />
    <span v-html="element.payload.content"></span>
    <img
      v-if="!isIconHidden && !isIconLeft && iconSrc"
      :src="iconSrc"
      alt="button icon"
      :id="`${value.id}-icon`"
      class="button-element__icon"
    />
  </component>
</template>

<script lang="ts">
import useInjectSeparateBlocksStyles from '../../hooks/publish/injectSeparateBlocksStyles.hook';
import { computed, defineComponent } from '@vue/composition-api';
import { MetaInfo } from 'vue-meta';

import { formatLocalUrl, LinkType } from '../../constants/link';

export default defineComponent({
  name: 'ButtonElementPublish',
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
        stylesToSplit: [
          'textAlign',
          'textDecoration',
          'textTransform',
          'letterSpacing',
          'font',
          'fontSize',
          'color',
          'borderRadius',
          'border',
          'background',
          'boxShadow',
          'display',
          'justifyContent',
          'alignItems',
          'gridGap'
        ]
      },
      {
        idName: `#${props.value.id}-icon`,
        stylesToSplit: ['width']
      }
    ];
    const stylesToHead = useInjectSeparateBlocksStyles(props.value, dynamicBlockStyleCollection);

    const iconSrc = computed(() => {
      if (!props.value.payload.image.fullPath) return '';
      return props.value.payload.image.fullPath;
    });
    const isIconHidden = computed(() => {
      if (props.value.payload.isIconHidden === undefined) return true;
      return props.value.payload.isIconHidden;
    });
    const isIconLeft = computed(() => {
      if (props.value.payload.iconPosition === undefined) return 'left';
      return props.value.payload.iconPosition === 'left';
    });

    const hrefValue = formatLocalUrl(root.$store.state, props.value.payload.link);

    return {
      LinkType,
      stylesToHead,
      hrefValue,
      element: props.value,
      iconSrc,
      isIconHidden,
      isIconLeft
    };
  }
});
</script>

<style lang="scss">
.button-element {
  display: flex;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  transition: opacity 0.3s linear;

  &__icon {
    height: auto;
  }
}

a.button-element {
  &:hover {
    opacity: 0.5;
  }
}
</style>

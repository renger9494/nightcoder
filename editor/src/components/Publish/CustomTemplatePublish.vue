<template>
  <div ref="el" class="template-wrapper laptop">
    <branding-tag v-if="value.info.branding.isEnabled && !isCommunity" :value="value.info.branding" />

    <dynamic-block
      v-for="(block, index) in blocksSortedBySortId"
      :block="index"
      :value="block"
      :key="index"
      :root="value.settings.root"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

import BrandingTag from './Elements/Branding.vue';
import DynamicBlock from './DynamicBlockPublish.vue';
import { publishCssBrakePoints } from '../../constants/breakpoints';
import { MetaInfo } from 'vue-meta';

export default defineComponent({
  name: 'CustomTemplatePublish',
  components: {
    DynamicBlock,
    BrandingTag
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    isCommunity: {
      type: Boolean,
      default: true
    }
  },
  metaInfo(): MetaInfo {
    return {
      style: [{ type: 'text/css', cssText: this.stylesToHead }],
      __dangerouslyDisableSanitizers: ['style']
    };
  },
  setup(props: any) {
    const blocksSortedBySortId = computed(() => {
      return [...props.value.settings.components].sort((a, b) => {
        return a.sortId - b.sortId;
      });
    });

    const stylesToHead = computed(() => {
      let vdrStyles = '';
      const createVdrStyles = (element: any) => {
        let styles = '';
        publishCssBrakePoints.forEach(breakpoint => {
          const { y, x, w, h, a, xInPercent, wInPercent } = element.location[breakpoint.name];
          let result = `
            .vdr_${element.id} {
              position: absolute;
              top: ${y}px;
              left: ${xInPercent ? xInPercent : x}${xInPercent ? '%' : 'px'};
              width: ${wInPercent ? wInPercent : w}${wInPercent ? '%' : 'px'};
              height: ${h}px;
              transform: rotate(${a}deg);
              z-index: ${element.payload.zIndex};
            }`;
          if (breakpoint.width) result = `@media only screen and (max-width: ${breakpoint.width}px) { ${result} }`;
          styles += result;
        });
        return styles;
      };

      props.value.settings.components.forEach((block: any) => {
        let styles = '';
        block.elements.forEach((el: any) => {
          if (!el.location) return;
          styles += createVdrStyles(el);
        });
        if (!block.location) {
          vdrStyles += styles;
          return;
        }
        vdrStyles += `${createVdrStyles(block)} ${styles}`;
      });

      return vdrStyles;
    });

    return {
      stylesToHead: stylesToHead.value,
      blocksSortedBySortId
    };
  }
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.template-wrapper {
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
</style>

<template>
  <section
    :label="value.name"
    :class="[value.id]"
    :data-id="value.id"
    @dragover="showFileLoader = true"
    class="templates-block"
    :id="value.id"
  >
    <multi-layer-background-publish
      :value="value"
      :background-id="`${value.id}-bg`"
      :image-id="`${value.id}-bg__image`"
      :overlay-id="`${value.id}-bg__overlay`"
      :image-path="value.payload.image"
    />
    <div :class="`${value.id}_container`">
      <div v-for="(el, index) in value.elements" :key="index" :class="[`vdr_${el.id}`]">
        <component :is="`${_startCase(el.type)}ElementPublish`" v-model="value.elements[index]" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

import ImageElementPublish from './ImageElementPublish.vue';
import TextElementPublish from './TextElementPublish.vue';
import ButtonElementPublish from './ButtonElementPublish.vue';
import EmbedElementPublish from './EmbedElementPublish.vue';
import RectangleElementPublish from './RectangleElementPublish.vue';
import CircleElementPublish from './CircleElementPublish.vue';
import IconElementPublish from './IconElementPublish.vue';
import FormElementPublish from './FormElementPublish.vue';
import VideoElementPublish from './VideoElementPublish.vue';
import MultiLayerBackgroundPublish from './MultiLayerBackgroundPublish.vue';

import { startCase as _startCase } from 'lodash';
import useInjectSeparateBlocksStyles from '../../hooks/publish/injectSeparateBlocksStyles.hook';
import { publishCssBrakePoints, breakpointsWidths } from '../../constants/breakpoints';
import { MetaInfo } from 'vue-meta';

interface IValue {
  elements: any[];
  id: string;
  name: string;
  payload: any;
}

export default defineComponent({
  name: 'DynamicBlockPublish',
  components: {
    ButtonElementPublish,
    ImageElementPublish,
    RectangleElementPublish,
    TextElementPublish,
    CircleElementPublish,
    IconElementPublish,
    EmbedElementPublish,
    FormElementPublish,
    VideoElementPublish,
    MultiLayerBackgroundPublish,
  },
  props: {
    value: {
      type: Object as PropType<IValue>,
      default: () => ({})
    },
    root: {
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
  setup(props) {
    const dynamicBlockStyleCollection = [
      {
        idName: `#${props.value.id}`,
        stylesToSplit: ['height', 'display', 'overflow']
      },
      {
        idName: `#${props.value.id}-bg`,
        stylesToSplit: ['background']
      },
      {
        idName: `#${props.value.id}-bg__image`,
        stylesToSplit: ['objectFit', 'opacity', 'displayBackgroundImage']
      },
      {
        idName: `#${props.value.id}-bg__overlay`,
        stylesToSplit: ['overlay', 'displayOverlay']
      }
    ];
    let stylesToHead = useInjectSeparateBlocksStyles(props.value, dynamicBlockStyleCollection);

    // TODO: create separate hook to form styles for block wrapper
    publishCssBrakePoints.forEach(item => {
      let containerStyle = `.${props.value.id}_container{
        max-width: ${breakpointsWidths[item.name]}px;
        width: 100%;
        height: 100%;
        position: relative;
        margin: 0 auto;
      }`;
      if (item.width) containerStyle = `@media only screen and (max-width: ${item.width}px) { ${containerStyle} }`;
      stylesToHead += containerStyle;
    });

    return {
      stylesToHead,
      _startCase
    };
  }
});
</script>

<style lang="scss" scoped>
.container-element {
  height: 100%;
}

.templates-block {
  position: relative;
}
</style>

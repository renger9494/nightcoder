<template>
  <section
    :label="value.name"
    :class="[value.id]"
    :data-id="value.id"
    :id="value.id"
    :style="{ ...blockStyle, ...blockOverflowStyle }"
  >
    <multi-layer-background
      :value="value"
      :background-color="backgroundColor"
      :background-image="backgroundImage"
      :background-overlay="backgroundOverlay"
      :image-path="value.payload.image"
      :is-background-image-hidden="isBackgroundImageHidden"
    />
    <div :style="containerStyle">
      <div v-for="(el, index) in value.elements" :key="index" :style="locationCss(el)">
        <component
          :is="`${_startCase(el.type)}ElementPreview`"
          v-model="value.elements[index]"
          :previewMode="previewMode"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import ImageElementPreview from '@/components/Editor/Elements/ImageElementPreview.vue';
import IconElementPreview from '@/components/Editor/Elements/IconElementPreview.vue';
import TextElementPreview from '@/components/Editor/Elements/TextElementPreview.vue';
import ButtonElementPreview from '@/components/Editor/Elements/ButtonElementPreview.vue';
import RectangleElementPreview from '@/components/Editor/Elements/RectangleElementPreview.vue';
import EmbedElementPreview from '@/components/Editor/Elements/EmbedElementPreview.vue';
import CircleElementPreview from '@/components/Editor/Elements/CircleElementPreview.vue';
import FormElementPreview from '@/components/Editor/Elements/FormElementPreview.vue';
import VideoElementPreview from '@/components/Editor/Elements/VideoElementPreview.vue';

import { startCase as _startCase } from 'lodash';
import useDisplayConditions from '@/hooks/editor/displayConditions.hook';
import { computed, defineComponent, PropType, watch } from '@vue/composition-api';
import { useDynamicBlockCommonEditorFunctionality } from '@/components/Editor/Elements/dynamicBlockCommonEditorFunctionality.hook';
import MultiLayerBackground from '@/components/Shared/MultiLayerBackground.vue';

type Value = { elements: any[]; styles: any; id: string; payload: any; name: string };

export default defineComponent({
  name: 'DynamicBlockPreview',
  components: {
    ButtonElementPreview,
    ImageElementPreview,
    IconElementPreview,
    RectangleElementPreview,
    CircleElementPreview,
    TextElementPreview,
    EmbedElementPreview,
    MultiLayerBackground,
    FormElementPreview,
    VideoElementPreview
  },
  props: {
    value: {
      type: Object as PropType<Value>,
      default: (): Value => ({ elements: [], styles: {}, id: '', payload: {}, name: '' })
    },
    root: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root }) {
    //TODO: overlay is not used here, need to check
    // const { css: overlay } = useOverlay({ value: props.value.styles.laptop });
    const previewMode = computed(() => root.$store.state.editor.previewMode);

    function locationCss(element: any) {
      const location = element.location[previewMode.value];

      const styles: any = {
        position: 'absolute',
        width: `${location.w}px`,
        height: `${location.h}px`,
        top: `${location.y}px`,
        left: `${location.x}px`,
        zIndex: element.payload.zIndex
      };

      if (location.a) {
        styles.transform = `rotate(${location.a}deg)`;
      }

      return styles;
    }

    const { displayConditions: blockBackgroundImageCondition } = useDisplayConditions({
      element: { value: props.value },
      conditions: [{ condition: 'hideBackgroundImage' }],
      store: root.$store
    });

    function initiateDisplayConditions() {
      useDisplayConditions({
        element: { value: props.value },
        conditions: [{ condition: 'hideBackgroundColor', value: false }],
        store: root.$store
      });

      for (const element of props.value.elements) {
        useDisplayConditions({
          element: { value: element },
          conditions: [{ condition: 'hideElement', value: false }],
          store: root.$store
        });
      }
    }

    const isBackgroundImageHidden = computed(() => {
      return blockBackgroundImageCondition.value.hideBackgroundImage;
    });

    const {
      blockStyle,
      blockOverflowStyle,
      backgroundColor,
      backgroundImage,
      backgroundOverlay
    } = useDynamicBlockCommonEditorFunctionality(
      computed(() => props.value),
      root.$store,
      previewMode
    );

    const containerStyle = {
      //TODO: change maxWidth var name to containerWidth but in that case you should change all projects configs
      maxWidth: `${props.root.containerWidtheight ? props.root.containerWidtheight : props.root.containerWidth}px`,
      width: '100%',
      height: '100%',
      position: 'relative',
      margin: '0 auto'
    };

    initiateDisplayConditions();

    watch(
      () => props.value,
      () => initiateDisplayConditions()
    );

    return {
      blockStyle,
      blockOverflowStyle,
      backgroundColor,
      backgroundImage,
      backgroundOverlay,
      isBackgroundImageHidden,
      previewMode,
      containerStyle,
      _startCase,
      locationCss
    };
  }
});
</script>

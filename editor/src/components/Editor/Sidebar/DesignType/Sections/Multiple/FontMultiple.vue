<template>
  <div class="sidebar-block">
    <p class="sidebar-block__title">Text</p>
    <text-style-editor-multiple
      class="sidebar-block__container"
      :is-form="isForm"
      :value="value"
      :elements-to-resize="elementsToResize"
    />
    <div class="sidebar-block__row sidebar-block__row--sb">
      <div class="sidebar-block__col sidebar-block__col--flex">
        <square-icon-btn
          class="sidebar-block__item sidebar-block__item--xs"
          :icon-settings="{ name: 'align-left-text-icon', ...iconSize }"
          :is-active="styles.textAlign === 'left'"
          @click.native.stop="changeTextAlign('left')"
          v-tooltip="'Text align left'"
        />
        <square-icon-btn
          class="sidebar-block__item sidebar-block__item--xs"
          :icon-settings="{ name: 'align-center-text-icon', ...iconSize }"
          :is-active="styles.textAlign === 'center'"
          @click.native.stop="changeTextAlign('center')"
          v-tooltip="'Text align center'"
        />
        <square-icon-btn
          class="sidebar-block__item sidebar-block__item--xs"
          :icon-settings="{ name: 'align-right-text-icon', ...iconSize }"
          :is-active="styles.textAlign === 'right'"
          @click.native.stop="changeTextAlign('right')"
          v-tooltip="'Text align right'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import useCssMultipleStylesEditor from '@/hooks/editor/visual/multiple/cssMultipleStyle.editor.hook';

import TextStyleEditorMultiple from '@/components/Editor/Sidebar/DesignType/Sections/Multiple/TextStyleEditorMultiple.vue';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';

export default defineComponent({
  components: {
    TextStyleEditorMultiple,
    SquareIconBtn
  },
  props: {
    elementsToResize: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      default: () => []
    },
    isForm: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { root }) {
    const previewMode = computed(() => root.$store.state.editor.previewMode);
    const iconSize = { width: 24, height: 24 };

    const styles = computed(() => {
      return (props.value as Array<any>)[0]?.styles[previewMode.value];
    });

    const { setCssProperty: setTextAlign } = useCssMultipleStylesEditor({
      elements: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'textAlign'
    });

    function changeTextAlign(align: any) {
      setTextAlign(align);
    }

    return {
      styles,
      iconSize,
      previewMode,
      changeTextAlign
    };
  }
});
</script>

<template>
  <div class="sidebar-block">
    <div class="sidebar-block__head sidebar-block__head--interactive" @click="addTextStroke(true)">
      <p
        class="sidebar-block__title sidebar-block__title--no-gutter"
        :class="{ 'sidebar-block__title--inactive': !isTextStrokeActive }"
      >
        Text stroke
      </p>
      <square-icon-btn
        @click.native.stop="addTextStroke(isTextStrokeActive ? false : true)"
        :icon-settings="{ name: !isTextStrokeActive ? 'plus-icon' : 'minus-icon', ...iconSize }"
        :icon-color="!isTextStrokeActive ? '#828282' : '#000'"
      />
    </div>
    <div class="sidebar-block__body" v-if="isTextStrokeActive">
      <div class="sidebar-block__row">
        <color-item
          :color-picker-data="{
            colorPickHandler: onColorPick,
            hex: textStrokeProps.textStrokeColor,
            opacity: textStrokeProps.textStrokeOpacity,
            isNextToSidebar: true,
            isOnlyColor: true,
            activeTab: 'color',
            styleProperty: 'textColor'
          }"
          :hex="textStrokeProps.textStrokeColor"
          :hide="isTextStrokeHidden"
          :opacity="Math.round((textStrokeProps.textStrokeOpacity ? textStrokeProps.textStrokeOpacity : 0) * 100)"
          @changeColor="changeTextStrokeColor"
          @hide="proceedHide(!isTextStrokeHidden)"
          @openColorPicker="openColorPicker"
          @changeOpacity="changeTextStrokeOpacity"
        />
      </div>

      <div class="sidebar-block__row">
        <prefix-input
          :type="'textStrokeWidth'"
          :unit="'px'"
          @inputHandler="changeTextStrokeWidth"
          :value="textStrokeProps.textStrokeWidth"
          v-tooltip="'Border width'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from '@vue/composition-api';
import useTextStrokeEditor from '@/hooks/editor/visual/textStroke.editor.hook';
import { prepareOpacity } from '@/helpers/hexToRgb';

import ColorItem from '@/components/Editor/Sidebar/DesignType/Sections/ColorItem.vue';
import TogglePanelIcon from '@/components/Editor/Sidebar/DesignType/Sections/TogglePanelIcon.vue';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';

export default defineComponent({
  name: 'TextStroke',
  components: {
    SquareIconBtn,
    ColorItem,
    TogglePanelIcon
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root }) {
    const strokeWidth = ref(4);
    const textStrokeWidth = ref(null as null | HTMLInputElement);

    const previewMode = computed(() => root.$store.state.editor.previewMode);

    const styles = computed(() => {
      return props.value.styles[previewMode.value];
    });

    const {
      setHideCssProperty: setHideTextStroke,
      setCssProperty: setTextStroke,
      cssPropertyProps: textStrokeProps,
      deleteCssProperty: deleteTextStroke,
      isCssPropertyActive: isTextStrokeActive,
      isCssPropertyHidden: isTextStrokeHidden
    } = useTextStrokeEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const proceedHide = (val: boolean) => {
      setHideTextStroke(val);
    };

    function changeTextStrokeColor(color: string) {
      setTextStroke({
        textStrokeColor: color,
        textStrokeOpacity: textStrokeProps.value.textStrokeOpacity,
        textStrokeWidth: textStrokeProps.value.textStrokeWidth
      });
    }

    function changeTextStrokeOpacity(opacity: string) {
      setTextStroke({
        textStrokeColor: textStrokeProps.value.textStrokeColor,
        textStrokeOpacity: prepareOpacity(opacity) / 100,
        textStrokeWidth: textStrokeProps.value.textStrokeWidth
      });
    }

    function openColorPicker(picker: HTMLDivElement) {
      picker.focus();
      picker.click();
    }

    function addTextStroke(val: boolean) {
      console.warn('addTextStroke');
      if (val)
        setTextStroke({
          textStrokeColor: '#000000',
          textStrokeOpacity: 1,
          textStrokeWidth: 1
        });
      else deleteTextStroke();
    }

    function changeTextStrokeWidth(val: { data: string | number; type: string }) {
      setTextStroke({
        textStrokeColor: textStrokeProps.value.textStrokeColor,
        textStrokeOpacity: textStrokeProps.value.textStrokeOpacity,
        textStrokeWidth: +val.data
      });
    }

    function onColorPick(colorObject: { hex: string; a: number }) {
      setTextStroke({
        textStrokeColor: colorObject.hex,
        textStrokeOpacity: colorObject.a,
        textStrokeWidth: textStrokeProps.value.textStrokeWidth
      });
    }

    return {
      textStrokeProps,
      isTextStrokeActive,
      strokeWidth,
      previewMode,
      isTextStrokeHidden,
      textStrokeWidth,
      iconSize: { width: 24, height: 24 },
      proceedHide,
      changeTextStrokeWidth,
      changeTextStrokeColor,
      changeTextStrokeOpacity,
      openColorPicker,
      addTextStroke,
      onColorPick
    };
  }
});
</script>

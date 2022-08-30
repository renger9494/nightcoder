<template>
  <div class="sidebar-block">
    <p class="sidebar-block__title">Text</p>
    <text-style-editor class="sidebar-block__container" :value="value" :is-button="isButton" />
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
      <div class="sidebar-block__col sidebar-block__col--flex">
        <square-icon-btn
          class="sidebar-block__item sidebar-block__item--xs"
          :icon-settings="{ name: 'none-icon', ...iconSize }"
          :is-active="styles.textTransform === TextTransform.NONE"
          @click.native.stop="changeStyleHandler({ textTransform: TextTransform.NONE })"
          v-tooltip="'Not set'"
        />
        <square-icon-btn
          class="sidebar-block__item sidebar-block__item--xs"
          :icon-settings="{ name: 'uppercase-icon', ...iconSize }"
          :is-active="styles.textTransform === TextTransform.UPPERCASE"
          @click.native.stop="changeStyleHandler({ textTransform: TextTransform.UPPERCASE })"
          v-tooltip="'Uppercase'"
        />
        <square-icon-btn
          class="sidebar-block__item sidebar-block__item--xs"
          :icon-settings="{ name: 'lowercase-icon', ...iconSize }"
          :is-active="styles.textTransform === TextTransform.LOWERCASE"
          @click.native.stop="changeStyleHandler({ textTransform: TextTransform.LOWERCASE })"
          v-tooltip="'Lowercase'"
        />
        <square-icon-btn
          class="sidebar-block__item sidebar-block__item--xs"
          :icon-settings="{ name: 'capitalize-icon', ...iconSize }"
          :is-active="styles.textTransform === TextTransform.CAPITALIZE"
          @click.native.stop="changeStyleHandler({ textTransform: TextTransform.CAPITALIZE })"
          v-tooltip="'Title case'"
        />
      </div>
    </div>
    <div class="sidebar-block__row sidebar-block__row--sb">
      <div class="sidebar-block__col sidebar-block__col--flex">
        <square-icon-btn
          class="sidebar-block__item sidebar-block__item--xs"
          :icon-settings="{ name: 'none-icon', ...iconSize }"
          :is-active="styles.textDecoration === TextDecoration.NONE"
          @click.native.stop="changeStyleHandler({ textDecoration: TextDecoration.NONE })"
          v-tooltip="'Not set'"
        />
        <square-icon-btn
          class="sidebar-block__item sidebar-block__item--xs"
          :icon-settings="{ name: 'underline-icon', ...iconSize }"
          :is-active="styles.textDecoration === TextDecoration.UNDERLINE"
          @click.native.stop="changeStyleHandler({ textDecoration: TextDecoration.UNDERLINE })"
          v-tooltip="'Underline'"
        />
        <square-icon-btn
          class="sidebar-block__item sidebar-block__item--xs"
          :icon-settings="{ name: 'line-through-icon', ...iconSize }"
          :is-active="styles.textDecoration === TextDecoration.LINE_THROUGH"
          @click.native.stop="changeStyleHandler({ textDecoration: TextDecoration.LINE_THROUGH })"
          v-tooltip="'Strikethrough'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import { TextTransform } from '@/constants/textTransform';
import { TextDecoration } from '@/constants/textDecoration';

import {
  PopupContainerType,
  PopupSettings,
  PopupType,
  TextSettingsPopupData
} from '@/components/Editor/Sidebar/Modal/types';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';

export default defineComponent({
  components: { SquareIconBtn },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    block: {
      type: [String, Number],
      required: true
    },
    isButton: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root }) {
    const textSettingsBtn = ref(null as null | HTMLButtonElement);
    const previewMode = computed(() => root.$store.state.editor.previewMode);
    const popupSettings = computed(() => root.$store.state.editor.popupSettings);
    const iconSize = { width: 24, height: 24 };

    const styles = computed(() => {
      return props.value.styles[previewMode.value];
    });

    const location = computed(() => {
      return props.value.location[previewMode.value];
    });

    const isPopupOpen = computed(() => {
      return popupSettings.value.active && popupSettings.value.content === 'TextSettings';
    });

    const { compiledCssObject: textTransform, setCssProperty: setTextTransform } = useCssStyleEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'textTransform'
    });

    const { compiledCssObject: textDecoration, setCssProperty: setTextDecoration } = useCssStyleEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'textDecoration'
    });

    function changeStyleHandler(value: any) {
      switch (Object.entries(value)[0][0]) {
        case 'textTransform':
          setTextTransform(value.textTransform);
          root.$store.commit('editor/changeElementLocation', {
            element: props.value,
            data: { resizeImmediately: true },
            isSaveHistory: false
          });
          return;
        case 'textDecoration':
          setTextDecoration(value.textDecoration);
          return;
      }
    }

    const { compiledCssObject: textAlign, setCssProperty: setTextAlign } = useCssStyleEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'textAlign'
    });

    function changeTextAlign(align: any) {
      setTextAlign(align);
    }

    function changeTextTransformStyle(type: any) {
      root.$store.commit('editor/changeSelectedElementsStyle', {
        textTransform: type
      });
    }

    function changeTextDecorationStyle(type: any) {
      root.$store.commit('editor/changeSelectedElementsStyle', {
        textDecoration: type
      });
    }

    return {
      styles,
      location,
      previewMode,
      textSettingsBtn,
      isPopupOpen,
      iconSize,
      TextTransform,
      TextDecoration,
      changeStyleHandler,
      changeTextAlign,
      changeTextTransformStyle,
      changeTextDecorationStyle
    };
  }
});
</script>


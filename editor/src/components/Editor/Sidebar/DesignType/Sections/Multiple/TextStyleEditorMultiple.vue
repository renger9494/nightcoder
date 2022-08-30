<template>
  <div class="text-style-editor-wrapper">
    <label class="text-style-font" @click="focusInput">
      <span
        class="text-style-editor__text text-style-editor__text--dropdown"
        v-if="isFontMixed('fontFamily') && !data.isFocused.fontFamily"
      >
        Mixed
      </span>
      <input
        ref="currentFontRef"
        :value="formatFontDisplayType(fontProps.fontFamily)"
        @input="debounceChangeFontStyle"
        type="text"
        @keydown.enter="selectFontFromInput"
        @keydown.40="changeInputFontByArrowButtons('down')"
        @keydown.38="changeInputFontByArrowButtons('up')"
        @focus="data.isFocused.fontFamily = true"
        @blur="selectFontFromInput"
      />
      <span class="text-style-font__autocomplete">{{
        data.searchAutocomplete ? data.searchAutocomplete.family : ''
      }}</span>
      <square-icon-btn
        :icon-settings="{ name: 'arrow-down', width: 20, height: 20 }"
        :size="{ width: 20, height: 20 }"
        :is-active="isPopupOpen"
        @click.native.stop="openFontPopup"
      />
    </label>
    <div class="text-style-editor">
      <div class="text-style-editor__row">
        <div class="text-style-editor__font-size">
          <div class="text-style-editor__input">
            <span
              class="text-style-editor__text"
              v-if="isFontMixed('fontSize') && !data.isFocused.fontSize"
            >
              Mixed
            </span>
            <prefix-input
              :type="'fontSize'"
              :unit="'px'"
              @inputHandler="changeFontStyle"
              :value="fontSize"
              :is-dropdown="true"
              :dropdown-list="defaultFonts"
              @blur="data.isFocused.fontSize = false"
              @focus="data.isFocused.fontSize = true"
            />
          </div>
        </div>
        <dropdown-font-style
          class="text-style-editor__font-style"
          :textStyles="fontProps"
          :fontVariants="fontVariants"
          :is-mixed="isFontMixed('fontWeight') || isFontMixed('fontStyle')"
          @changeStyle="setFontType"
        />
      </div>
      <div class="text-style-editor__row">
        <div v-if="!isForm" class="text-style-editor__line-height">
          <div class="text-style-editor__input">
            <span
              class="text-style-editor__text"
              v-if="isFontMixed('fontLineHeight') && !data.isFocused.lineHeight"
            >
              Mixed
            </span>
            <prefix-input
              class="text-style-editor__multiple-input"
              :type="'fontLineHeight'"
              :unit="'px'"
              @inputHandler="changeFontStyle"
              :value="fontLineHeight"
              :placeholder="Math.round((fontProps.fontSize ? +fontProps.fontSize : 0) * 1.1785)"
              @blur="data.isFocused.lineHeight = false"
              @focus="data.isFocused.lineHeight = true"
              v-tooltip="'Line height'"
            />
          </div>
        </div>
        <div class="text-style-editor__letter-spacing">
          <div class="text-style-editor__input">
            <span
              class="text-style-editor__text"
              v-if="isValueMixed('letterSpacing') && !data.isFocused.letterSpacing"
            >
              Mix
            </span>
            <letter-spacing-input
              class="text-style-editor__multiple-input"
              @inputHandler="changeLetterSpacing"
              @onUnitChange="changeLetterSpacingUnit"
              :unit="letterSpacingUnit"
              :value="letterSpacingMixed"
              @blur="data.isFocused.letterSpacing = false"
              @focus="data.isFocused.letterSpacing = true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DropdownFontStyle from '@/components/Editor/Sidebar/Global/Dropdown/DropdownFontStyle.vue';
import { computed, reactive, ref, onBeforeUnmount, onMounted, nextTick, defineComponent } from '@vue/composition-api';
import { debounce, cloneDeep as _cloneDeep } from 'lodash';
import { FontPopupData, PopupContainerType, PopupSettings, PopupType } from '@/components/Editor/Sidebar/Modal/types';
import useCssMultipleStylesEditor from "@/hooks/editor/visual/multiple/cssMultipleStyle.editor.hook";
import useFontMultipleEditor from "@/hooks/editor/visual/multiple/fontMultiple.editor.hook";
import SquareIconBtn from "@/components/Shared/ui/SquareIconBtn.vue";
import WebFont from "webfontloader";
import LetterSpacingInput from "@/components/Editor/Sidebar/Global/LetterSpacingInput.vue";

interface FontObj {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  googleFontFamily?: string;
}

const defaultFonts: Array<number> = [14,18,24,36,48,64,72,96,120];

export default defineComponent({
  name: 'TextStyleEditorMultiple',
  components: {
    LetterSpacingInput,
    DropdownFontStyle,
    SquareIconBtn,
  },
  props: {
    elementsToResize: {
      type: Array,
      default: () => {}
    },
    value: {
      type: Array,
      required: true
    },
    isForm: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { root }) {
    const currentFontRef = ref(null as null | HTMLInputElement);

    const data = reactive({
      show: false,
      showAlignPopup: false,
      showTextAlignPopup: false,
      locked: true,
      searchFont: '',
      searchAutocomplete: null as any,
      inputFontIndex: null as null | number,
      isFontsFromInput: false,
      isFocused: {
        fontSize: false,
        fontWeight: false,
        fontFamily: false,
        lineHeight: false,
        letterSpacing: false
      }
    });

    const previewMode = computed(() => root.$store.state.editor.previewMode);
    const fonts = computed((): any[] => root.$store.state.editor.editorFonts);
    const popupSettings = computed(() => root.$store.state.editor.popupSettings);

    const styles = computed(() => {
      return (props.value as Array<any>)[0]?.styles[previewMode.value];
    });

    const isPopupOpen = computed(() => {
      return popupSettings.value.active && popupSettings.value.content === 'Font';
    });

    const fontsFilteredByAlphabet = computed(() => {
      const fontsToAlphabet = _cloneDeep(fonts.value);
      return fontsToAlphabet.sort((a, b) => {
        if (a.family < b.family) {
          return -1;
        }
        if (a.family > b.family) {
          return 1;
        }
        return 0;
      });
    });

    const fontVariants = computed(() => {
      const font = fonts.value.find(el => {
        return `"${el.family}", ${el.category}` == fontProps.value.fontFamily;
      });
      return font ? font.variants : null;
    });

    const { cssPropertyProps: fontProps, setCssProperty: setFont } = useFontMultipleEditor({
      elements: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const {
      numberValue: letterSpacing,
      setCssProperty: setLetterSpacing,
      cssPropertyStyle: letterSpacingCss
    } = useCssMultipleStylesEditor({
      elements: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'letterSpacing'
    });

    const letterSpacingUnit = computed(() => letterSpacingCss.value['letterSpacing'].replace(/[^a-zA-Z%]+/g, ''));
    const isLetterSpacingPercent = computed(() => letterSpacingUnit.value === 'em');
    const letterSpacingDisplay = computed(() => isLetterSpacingPercent.value ? +letterSpacing.value * 100 : letterSpacing.value)

    function changeLetterSpacing({ data }: { data: string }) {
      if(data === '') return
      const unit = letterSpacingUnit.value;
      const newVal = isLetterSpacingPercent.value ? +data / 100 : data;
      setLetterSpacing(`${newVal}${unit}`);
      for(const element of props.elementsToResize) {
        root.$store.commit('editor/changeElementLocation', {
          element: element,
          data: { resizeImmediately: true },
          isSaveHistory: false
        });
      }
    }

    function changeLetterSpacingUnit(unit: string) {
      setLetterSpacing(`0${unit}`);
      for(const element of props.elementsToResize) {
        root.$store.commit('editor/changeElementLocation', {
          element: element,
          data: { resizeImmediately: true },
          isSaveHistory: false
        });
      }
    }

    const textStyles = computed(() => {
      return {
        letterSpacing: styles.value.letterSpacing,
        justifyContent: styles.value.justifyContent,
        color: styles.value.color,
        alignItems: styles.value.alignItems
      };
    });

    function findInputFontIndex() {
      if (!currentFontRef.value) return -1;
      const queryInLowCase = currentFontRef.value.value.toLowerCase();
      const { length: queryLength } = currentFontRef.value.value;

      return fontsFilteredByAlphabet.value.findIndex(({ family }) => {
        const formattedFamilyName = family.slice(0, queryLength).toLowerCase();
        return formattedFamilyName.includes(queryInLowCase);
      });
    }

    function inputFontFinder() {
      if (!currentFontRef.value?.value) return false;
      const { length: queryLength } = currentFontRef.value.value;

      const fontIndex = findInputFontIndex();

      if (fontIndex >= 0) {
        const { family } = fontsFilteredByAlphabet.value[fontIndex];
        currentFontRef.value.value = family;
        currentFontRef.value.setSelectionRange(queryLength, family.length);
        data.inputFontIndex = fontIndex;
      }
    }

    function changeInputFontByArrowButtons(direction: 'up' | 'down') {
      if (data.inputFontIndex === null) return false;
      data.isFontsFromInput = false;
      const fonts = fontsFilteredByAlphabet.value;
      if (direction === 'up') {
        data.inputFontIndex = data.inputFontIndex <= 0 ? fonts.length - 1 : data.inputFontIndex - 1;
      } else if (direction === 'down') {
        data.inputFontIndex = data.inputFontIndex >= fonts.length - 1 ? 0 : data.inputFontIndex + 1;
      }
      const { family } = fonts[data.inputFontIndex];
      //TODO: check this => left-hand is readonly!
      (<any>currentFontRef.value).value = family;
      setTimeout(() => {
        currentFontRef.value?.select();
      });
    }

    function changeFontStyle(styleObj: { data: string; type: string }) {
      if(!styleObj.data || (isFontMixed('fontLineHeight') && styleObj.data === 'normal') || !styleObj.type) return
      setFont({
        [`${styleObj.type}New`]: styleObj.data
      }, styleObj.type);
    }

    function setFontType({ fontWeight, fontStyle }: { fontWeight: string; fontStyle: string }) {
      setFont({
        fontWeightNew: fontWeight,
        fontStyleNew: fontStyle
      }, 'fontWeight');
    }

    function selectFontHandler({ fontFamily, fontWeight, fontStyle, googleFontFamily }: FontObj) {
      const font = {
        fontFamilyNew: fontFamily,
        fontWeightNew: fontWeight,
        fontStyleNew: fontStyle,
        ...(googleFontFamily ? { googleFontFamily } :  {} )
      };
      setFont(font, 'fontFamily');
    }

    function selectFontFromInput() {
      data.isFocused.fontFamily = false;
      if (!currentFontRef.value?.value || data.inputFontIndex === null) return;

      const selectedFont: any = fontsFilteredByAlphabet.value[data.inputFontIndex];

      let googleFontFamily = `${selectedFont.family}:`;
      const filteredVariants = selectedFont.variants.filter((el: any) => el.style === 'normal' && el.name !== 'italic');
      filteredVariants.forEach((variant: any, index: number) => {
        googleFontFamily += filteredVariants.length - 1 === index ? `${variant.name}` : `${variant.name},`;
      });

      //Load new google Font
      loadFont(googleFontFamily)

      const { fontStyle, fontWeight } = fontProps.value;

      const isOldFontWeightExist = selectedFont.variants.some(
        (item: any) => item.name === fontWeight && item.style === fontStyle
      );

      const newFontWeight = selectedFont.variants.some((item: any) => item.name === '400' && item.style === 'normal')
        ? '400'
        : selectedFont.variants[0].name;
      selectFontHandler({
        fontFamily: `"${selectedFont.family}", ${selectedFont.category}`,
        fontWeight: isOldFontWeightExist ? fontWeight : newFontWeight,
        fontStyle: isOldFontWeightExist ? fontStyle : selectedFont.variants[0].style,
        googleFontFamily
      });
      nextTick(() => {
        currentFontRef.value?.blur();
      });
    }

    function selectFontFromPopup(fontObj: FontObj) {
      data.isFontsFromInput = true;
      selectFontHandler(fontObj);
    }

    function openFontPopup() {
      if (!props.value?.length) return
      const popupSettings: PopupSettings<FontPopupData> = {
        active: true,
        closeButton: true,
        header: 'Change Font',
        content: PopupType.Font,
        container: PopupContainerType.Large,
        location: currentFontRef.value?.getBoundingClientRect(),
        data: {
          // el: 'elements',
          element: props.value[0],
          isNextToSidebar: true,
          selectFontHandler: selectFontFromPopup,
          isSearchFieldActive: true,
          activeFontFamily: fontProps.value
        }
      };
      root.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings);
    }

    function formatFontDisplayType(fontFamily?: string | undefined) {
      return fontFamily?.replaceAll('"', '').split(',')[0];
    }

    function focusInput() {
      currentFontRef.value?.select();
      data.inputFontIndex = findInputFontIndex();
    }

    function formFontStyleObject(font: string): any {
      const params = font.split(' ');
      const fontStyle = params[0];
      const fontWeight = params[1];
      const [fontSize, fontLineHeight] = params[2].split('/');

      function getFontFamilyIndex() {
        return params[0].length + params[1].length + params[2].length + 3;
      }

      const fontFamily = font.substr(getFontFamilyIndex());
      return { fontStyle, fontWeight, fontSize, fontLineHeight, fontFamily };
    }

    function isFontMixed(path: string) {
      const firstElementPathValue = formFontStyleObject((props.value as Array<any>)[0]?.styles[previewMode.value].font)[path];
      return props.value.reduce(
        (_: any, el: any) => firstElementPathValue !== formFontStyleObject(el.styles[previewMode.value].font)[path],
        false
      );
    }

    function isValueMixed(path: string) {
      const firstElementPathValue = (props.value as Array<any>)[0]?.styles[previewMode.value][path];
      return props.value.reduce(
        (_: any, el: any) => firstElementPathValue !== el.styles[previewMode.value][path],
        false
      );
    }

    const fontSize = computed(() => {
      if (isFontMixed('fontSize')) return ''

      return fontProps.value.fontSize
    });

    const fontLineHeight = computed(() => {
      if (isFontMixed('fontLineHeight')) return ''

      return fontProps.value.fontLineHeight
    });

    const letterSpacingMixed = computed(() => {
      if (isValueMixed('letterSpacing')) return ''

      return letterSpacingDisplay.value
    })

    function loadFont(fontFamily: string): void {
      WebFont.load({
        google: {
          families: [fontFamily]
        },
        active: () => {
          root.$store.commit('editor/setIsFontRendered', true);
        }
      });
    }

    onBeforeUnmount(() => {
      root.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
      if (data.isFontsFromInput) return;
      // selectFontFromInput();
    });

    onMounted(() => {
      data.inputFontIndex = findInputFontIndex();
    });

    return {
      currentFontRef,
      fontProps,
      data,
      textStyles,
      fontVariants,
      letterSpacingMixed,
      letterSpacingUnit,
      // searchFonts,
      isPopupOpen,
      fontSize,
      fontLineHeight,
      defaultFonts,
      focusInput,
      openFontPopup,
      changeFontStyle,
      setFontType,
      debounceChangeFontStyle: debounce(inputFontFinder, 100),
      selectFontFromInput,
      changeInputFontByArrowButtons,
      changeLetterSpacing,
      changeLetterSpacingUnit,
      formatFontDisplayType,
      isValueMixed,
      isFontMixed
    };
  }
});
</script>

<style lang="scss">
.text-style-editor {
  &__input {
    position: relative;
  }
  &__text {
    position: absolute;
    top: 10px;
    left: 26px;
    z-index: 2;
    font-size: 12px;
    line-height: 14px;
    color: #000;
    background: $white;
    pointer-events: none;

    &--dropdown {
      left: 6px;
      width: calc(100% - 30px);
      z-index: 1;
    }
  }

  & &__multiple-input {
    width: 100%;
  }
}
</style>

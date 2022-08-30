<template>
  <div class="text-style-editor-wrapper">
    <label class="text-style-font" @click="focusInput">
      <input
        ref="currentFontRef"
        :value="formatFontDisplayType(fontProps.fontFamily)"
        @input="debounceChangeFontStyle"
        type="text"
        @keydown.enter="selectFontFromInput"
        @keydown.40="changeInputFontByArrowButtons('down')"
        @keydown.38="changeInputFontByArrowButtons('up')"
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
        <prefix-input
          class="text-style-editor__font-size"
          :type="'fontSize'"
          :unit="'px'"
          :value="fontProps.fontSize"
          :is-dropdown="true"
          :dropdown-list="defaultFonts"
          @inputHandler="changeFontStyle"
        />

        <dropdown-font-style
          class="text-style-editor__font-style"
          :textStyles="fontProps"
          :fontVariants="fontVariants"
          @changeStyle="setFontType"
        />
      </div>

      <div class="text-style-editor__row">
        <prefix-input
          v-if="!isButton"
          class="text-style-editor__line-height"
          :type="'fontLineHeight'"
          :unit="'px'"
          @inputHandler="changeFontStyle"
          :value="fontProps.fontLineHeight"
          :placeholder="Math.round((fontProps.fontSize ? +fontProps.fontSize : 0) * 1.1785)"
          v-tooltip="'Line height'"
        />
        <letter-spacing-input
          class="text-style-editor__letter-spacing"
          :value="letterSpacingDisplay"
          :unit="letterSpacingUnit"
          @inputHandler="changeLetterSpacing"
          @onUnitChange="changeLetterSpacingUnit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import fontDetectWeight from '../../../../../helpers/font/fontDetectWeight';
import DropdownFontStyle from '@/components/Editor/Sidebar/Global/Dropdown/DropdownFontStyle.vue';
import { computed, reactive, ref, onBeforeUnmount, onMounted, nextTick, defineComponent } from '@vue/composition-api';
import { debounce, cloneDeep as _cloneDeep } from 'lodash';
import useFontEditor from '@/hooks/editor/visual/font.editor.hook';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import { FontPopupData, PopupContainerType, PopupSettings, PopupType } from '../../Modal/types';
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
  name: 'TextStyleEditor',
  components: {
    LetterSpacingInput,
    SquareIconBtn,
    DropdownFontStyle
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    isButton: {
      type: Boolean,
      default: false
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
      isFontsFromInput: false
    });

    const previewMode = computed(() => root.$store.state.editor.previewMode);
    const fonts = computed((): any[] => root.$store.state.editor.editorFonts);
    const popupSettings = computed(() => root.$store.state.editor.popupSettings);
    const styles = computed(() => props.value.styles[previewMode.value]);

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

    const { cssPropertyProps: fontProps, setCssProperty: setFont } = useFontEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store
    });

    const {
      numberValue: letterSpacing,
      setCssProperty: setLetterSpacing,
      cssPropertyStyle: letterSpacingCss
    } = useCssStyleEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'letterSpacing'
    });

    const letterSpacingUnit = computed(() => letterSpacingCss.value['letterSpacing'].replace(/[^a-zA-Z%]+/g, ''));
    const isLetterSpacingPercent = computed(() => letterSpacingUnit.value === 'em');
    const letterSpacingDisplay = computed(() => isLetterSpacingPercent.value ? +letterSpacing.value * 100 : letterSpacing.value)

    function changeLetterSpacing({ data }: { data: number }) {
      const newVal = isLetterSpacingPercent.value ? data / 100 : data;
      setLetterSpacing(`${newVal}${letterSpacingUnit.value}`);
      root.$store.commit('editor/changeElementLocation', {
        element: props.value,
        data: { resizeImmediately: true },
        isSaveHistory: false
      });
    }

    function changeLetterSpacingUnit(unit: string) {
      setLetterSpacing(`0${unit}`);
      root.$store.commit('editor/changeElementLocation', {
        element: props.value,
        data: { resizeImmediately: true },
        isSaveHistory: false
      });
    }

    const textStyles = computed(() => {
      return {
        letterSpacing: styles.value.letterSpacing,
        justifyContent: styles.value.justifyContent,
        color: styles.value.color,
        alignItems: styles.value.alignItems
      };
    });

    // function searchFonts(e) {
    // const searchResult = fonts.value.filter(el => {
    //   if (e.target.value.length) {
    //     return el.family.toLowerCase().indexOf(e.target.value.toLowerCase()) + 1;
    //   }
    // });
    // if (searchResult.length) {
    //   console.log(searchResult[0]);
    //   this.searchAutocomplete = searchResult[0];
    // } else {
    //   this.searchAutocomplete = null;
    // }
    // }
    // function changeFontBySearchResult(f) {
    //   const font = `${f.family}:${computedFontWeight.value(f.name)}`;

    //   root.$store.commit('editor/changeConfigFonts', font);

    //   root.$store.commit('editor/changeSelectedElementsStyle', {
    //     fontFamily: f.family
    //   });
    // }
    function computedFontWeight(type: any) {
      return fontDetectWeight(type);
    }

    function isValid(e: any) {
      if (e.which != 8 && e.which != 37 && e.which != 39 && e.which != 190 && isNaN(+String.fromCharCode(e.which))) {
        e.preventDefault();
      }
    }

    function changeTextAlign(align: any) {
      root.$store.commit('editor/changeSelectedElementsStyle', {
        justifyContent: align
      });

      data.showAlignPopup = false;
    }

    function changealignItems(align: any) {
      root.$store.commit('editor/changeSelectedElementsStyle', {
        alignItems: align
      });

      data.showTextAlignPopup = false;
    }

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

    async function changeInputFontByArrowButtons(direction: 'up' | 'down') {
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
      setFont({
        ...fontProps.value,
        ...{ [styleObj.type]: styleObj.data }
      });
    }

    function setFontType({ fontWeight, fontStyle }: { fontWeight: string; fontStyle: string }) {
      setFont({
        ...fontProps.value,
        fontWeight,
        fontStyle
      });
    }

    function changeTextStyleColor(e: any) {
      root.$store.commit('editor/changeSelectedElementsStyle', {
        color: e.target.value
      });
    }

    function selectFontHandler({ fontFamily, fontWeight, fontStyle, googleFontFamily }: FontObj) {
      const font = {
        ...fontProps.value,
        fontFamily,
        fontWeight,
        fontStyle,
        ...(googleFontFamily ? { googleFontFamily } :  {} )
      };
      setFont(font);
    }

    function selectFontFromInput() {
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
      const popupSettings: PopupSettings<FontPopupData> = {
        active: true,
        closeButton: true,
        header: 'Change Font',
        content: PopupType.Font,
        container: PopupContainerType.Large,
        location: currentFontRef.value?.getBoundingClientRect(),
        data: {
          element: props.value,
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

    onBeforeUnmount(() => {
      root.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
      const oldFontFamily = formatFontDisplayType(fontProps.value.fontFamily)
      if (data.isFontsFromInput || oldFontFamily === currentFontRef?.value?.value) return;
      selectFontFromInput();
    });

    onMounted(() => {
      data.inputFontIndex = findInputFontIndex();
    });

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

    return {
      currentFontRef,
      fontProps,
      data,
      textStyles,
      fontVariants,
      letterSpacingDisplay,
      letterSpacingUnit,
      // searchFonts,
      isPopupOpen,
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
      formatFontDisplayType
    };
  }
});
</script>

<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
.text-style-font {
  max-width: 240px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: #000000;
  border: 1px solid #ebebeb;
  box-sizing: border-box;
  border-radius: 4px;
  height: 32px;
  padding: 0 5px 0 6px;
  margin-bottom: 10px;
  position: relative;
  transition: border-color 0.2s ease, opacity 0.2s ease;
  cursor: pointer;
  &__autocomplete {
    position: absolute;
    color: #318bf5;
    z-index: -1;
    opacity: 0.5;
  }
  &:hover {
    border-color: #bdc2c7;
  }

  input {
    width: 100%;
  }
}
.text-style-editor {
  &__row {
    display: flex;
    flex-wrap: wrap;
    &:not(:last-child) {
      margin: 0 0 $margin_s;
    }
  }
  &__title {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    text-transform: capitalize;
    color: #4356be;
    margin-bottom: 14px;
  }
  &__font {
    &-size {
      flex: 0 0 73px;
      margin: 0 $margin_s 0 0;
    }
    &-style {
      flex: 1;
      max-width: 119px;
    }
  }
  &__line-height, &__letter-spacing {
    flex: 1;
    &:only-child {
      flex: 0 0 96px;
    }
    &:not(:last-child) {
      margin: 0 $margin_s 0 0;
    }
  }
}
</style>

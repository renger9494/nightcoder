<template>
  <div class="dte-image sidebar-block">
    <div class="sidebar-block__head">
      <p class="dte-image__title sidebar-block__title sidebar-block__title--no-gutter">{{ blockTitle }}</p>
      <square-icon-btn
        v-if="loadedImage"
        @click="deleteImage"
        :icon-settings="{ name: 'minus-icon', ...iconSize }"
        icon-color="#000"
      />
    </div>

    <div class="image-upload-controls" :class="{ 'image-upload-controls--hidden': isElementHidden }">
      <div class="image-upload-controls__row">
        <image-popup
          class="image-upload-controls__type"
          :active-type="uploadType"
          :list="imageTypeList"
          @onChange="chooseUploadType"
        />
        <div class="dte-image__input-container">
          <input
            ref="opacityInput"
            @click="opacityInput.select()"
            @change="changeOpacity(opacityInput.value ? opacityInput.value : '')"
            :value="opacity.opacity * 100"
            type="number"
            class="dte-image__input dte-image__input_opacity dte-image__input_icon"
            max="100"
          />
          <span class="dte-image__input-icon">%</span>
        </div>

        <square-icon-btn
          @click="hideElement"
          :icon-settings="{ name: !isElementHidden ? 'hide' : 'unhide', ...iconSize }"
          icon-color="#000"
        />
        <input
          v-if="uploadType === 'Url'"
          v-model="imageUrl"
          :class="{ error: isImageUrlValid }"
          @blur="setImageUrl"
          @keydown.enter="setImageUrl"
          @keydown.esc="imageUrlCancel"
          placeholder="Paste an image by URL"
          type="text"
          class="image-upload-controls__input"
        />
      </div>

      <image-input :is-icon="isIcon" v-model="loadedImage" :uploadImage="saveImage" />
    </div>

    <switcher
      class="dte-image__switch"
      :class="{ 'dte-image__switch--hidden': isElementHidden }"
      v-if="!isIcon"
      :switcher-items="switcherItems"
      @filterName="changeFillType"
    />

    <hidden-param :title="'Fill Color'" :active="isOverlayActive" @changeActivity="toggleOverlay">
      <color-item
        v-if="!isGradient"
        :color-picker-data="{
          colorPickHandler: changeOverlay,
          hex: overlayColor,
          opacity: overlayOpacity,
          activeTab: 'color',
          isNextToSidebar: true,
          styleProperty: 'fillColor'
        }"
        :hex="overlayColor"
        :opacity="Math.round(overlayOpacity * 100)"
        :hide="isOverlayHidden"
        @changeColor="changeOverlayColor"
        @hide="onHideOverlay"
        @changeOpacity="changeOverlayOpacity"
      />
      <gradient-item
        v-else
        :color-picker-data="{
          colorPickHandler: changeOverlay,
          gradient: overlayProps,
          activeTab: 'gradient',
          isNextToSidebar: true,
          styleProperty: 'fillColor'
        }"
        :hide="isOverlayHidden"
        :gradient-color="gradientColor.overlay"
        @changeColor="changeOverlayColor"
        @hide="onHideOverlay"
        @changeOpacity="changeOverlayOpacity"
      />
    </hidden-param>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { computed, defineComponent, ref, onBeforeUnmount } from '@vue/composition-api';
import http from '@/utils/http';
import ToggleDisplayIcon from '@/components/Editor/Sidebar/DesignType/Sections/ToggleDisplayIcon.vue';
import ImageInput from '@/components/Editor/Sidebar/Reusable/ImageInput.vue';
import Switcher from '@/components/Editor/Sidebar/Switcher.vue';
import ColorItem from '@/components/Editor/Sidebar/DesignType/Sections/Color/ColorItem.vue';
import GradientItem from '@/components/Editor/Sidebar/DesignType/Sections/Color/GradientItem.vue';
import ColorSection from '@/components/Editor/Sidebar/DesignType/Sections/Color/Color.vue';
import HiddenParam from '@/components/Editor/Sidebar/Reusable/HiddenParam.vue';
import { prepareOpacity } from '@/helpers/hexToRgb';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import useBackgroundEditor from '@/hooks/editor/visual/background.editor.hook';
import { FileDto } from '@/utils/api';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
import ImagePopup from '@/components/Editor/Sidebar/DesignType/Sections/Image/ImagePopup.vue';

const linkReg = new RegExp(
  /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
);

export default defineComponent({
  name: 'Image',
  components: {
    ImagePopup,
    SquareIconBtn,
    HiddenParam,
    Switcher,
    ColorSection,
    ColorItem,
    GradientItem,
    ToggleDisplayIcon,
    ImageInput
  },
  props: {
    block: {
      type: [String, Number],
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    },
    elementType: {
      type: String,
      default: ''
    },
    isIcon: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root }) {
    const userConfig = computed(() => root.$store.state.editor.userConfig);
    const previewMode = computed(() => root.$store.state.editor.previewMode);
    const styles = computed(() => props.value.styles[previewMode.value]);
    const isElementHidden = computed(() => {
      return (
        props.value.styles[previewMode.value][props.elementType === 'block' ? 'displayBackgroundImage' : 'display'] ===
        'none'
      );
    });
    const isOverlayHidden = computed(() => props.value.styles[previewMode.value].displayOverlay === 'none');
    const elementName = computed(() => props.value.name);
    const imageUploadType = computed(() => props.value.payload?.image?.uploadType ?? 'Upload');
    const imageUrlPayload = computed(() =>
      imageUploadType.value === 'Upload' ? '' : props.value.payload?.image?.fullPath ?? ''
    );
    const imageUrl = ref(imageUrlPayload.value as string);
    const opacityInput = ref(null as null | HTMLInputElement);
    const isImageUrlValid = ref(false as boolean);
    const uploadType = ref(imageUploadType.value as any);

    function changeImage(value?: FileDto) {
      root.$store.commit('editor/changeElementPayload', {
        id: props.value.id,
        path: 'image',
        value: !value ? value : { ...value, uploadType: 'Upload' }
      });
      //TODO: src is for compatibility, remove src in future
      root.$store.commit('editor/changeElementPayload', {
        id: props.value.id,
        path: 'src',
        value: null
      });
    }

    //TODO: remove this and use value instead
    const loadedImage = computed({
      get() {
        const payload = userConfig.value?.allComponents[props.value.id]?.payload ?? '';

        //TODO: src is for compatibility, remove src in future
        return payload.image ? payload.image : payload.src;
      },
      set(value: FileDto) {}
    });

    function deleteImage() {
      changeImage();
      uploadType.value = 'Upload';
    }

    const {
      cssPropertyProps: overlayProps,
      setCssProperty: setOverlay,
      deleteCssProperty: deleteOverlay,
      isCssPropertyActive: isOverlayActive,
      cssPropertyStyle: gradientColor,
      isBackgroundPropertyGradient: isGradient
    } = useBackgroundEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'overlay'
    });

    const overlayColor = computed(() => {
      const { color } = <any>overlayProps.value;
      return color;
    });

    const overlayOpacity = computed(() => {
      const { opacity } = <any>overlayProps.value;
      return opacity;
    });

    function toggleOverlay() {
      if (isOverlayActive.value) deleteOverlay();
      else setOverlay({ color: '000000', opacity: 0.3 });
    }

    const { cssPropertyStyle: objectFit, setCssProperty: setObjectFit } = useCssStyleEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'objectFit'
    });

    const { cssPropertyStyle: opacity, setCssProperty: setOpacity } = useCssStyleEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'opacity'
    });

    const { setCssProperty: setDisplayOverlay } = useCssStyleEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'displayOverlay'
    });

    const onHideOverlay = function (hide: boolean) {
      setDisplayOverlay(!hide ? 'flex' : 'none');
    };

    function changeOverlayColor(color: string) {
      setOverlay({ color, opacity: overlayOpacity.value });
    }

    function changeOverlayOpacity(opacity: string) {
      setOverlay({ color: overlayColor.value, opacity: prepareOpacity(opacity) });
    }

    function changeOverlay(colorObj: { hex?: string; a: number } | any) {
      setOverlay(colorObj.hex ? { color: colorObj.hex, opacity: colorObj.a } : colorObj);
    }

    function changeFillType(type: string) {
      setObjectFit(type.toLowerCase() === 'fill' ? 'cover' : 'contain');
    }

    function changeOpacity(opacity: string) {
      setOpacity(prepareOpacity(opacity));
    }

    function hideElement() {
      root.$store.commit('editor/changeComponentStyle', {
        component: props.value,
        data:
          props.elementType === 'block'
            ? { displayBackgroundImage: !isElementHidden.value ? 'none' : 'flex' }
            : { display: !isElementHidden.value ? 'none' : 'block' }
      });
    }

    function chooseUploadType(type: any) {
      uploadType.value = type.name;
    }

    function isValidURL(string: string) {
      const res = string.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      return res !== null;
    }

    function setImageUrl() {
      isImageUrlValid.value = false;
      if (!imageUrl.value.length || imageUrl.value === imageUrlPayload.value) return;
      if (!isValidURL(imageUrl.value)) {
        isImageUrlValid.value = true;
        return;
      }
      root.$store.commit('editor/changeElementPayload', {
        id: props.value.id,
        path: 'image',
        value: {
          fullPath: imageUrl.value,
          fullPathWebP: null,
          fullPathJp2: null,
          uploadType: 'Url'
        }
      });
    }

    function imageUrlCancel() {
      imageUrl.value = imageUrlPayload.value;
      isImageUrlValid.value = false;
    }

    const saveImage = (fd: FormData) => {
      const { templateId, blockId, pageId, projectId } = root.$route.params;
      let url = '';
      if (templateId) url = `/api/templates/${templateId}/elementImage`;
      else if (blockId) url = `/api/interface/Block/${blockId}/elementImage`;
      else url = `/api/projects/${projectId}/pages/${pageId}/elementImage`;

      return http.put(url, fd).then(({ data: elementImage }) => {
        const image = elementImage;
        changeImage(image);
        uploadType.value = 'Upload';

        return <FileDto>image;
      });
    };

    return {
      saveImage,
      previewMode,
      elementName,
      loadedImage,
      isGradient,
      isOverlayHidden,
      isOverlayActive,
      imageUploadType,
      gradientColor,
      opacityInput,
      iconSize: { width: 24, height: 24 },
      blockTitle: props.elementType === 'block' ? 'Background image' : props.isIcon ? 'Icon' : 'Image',
      deleteImage,
      onHideOverlay,
      changeFillType,
      changeOverlayColor,
      changeOverlayOpacity,
      chooseUploadType,
      changeOverlay,
      toggleOverlay,
      changeOpacity,
      hideElement,
      setImageUrl,
      imageUrlCancel,

      isElementHidden,
      showSettings: false,
      fillType: opacity,
      imageUrl,
      isImageUrlValid,
      switcherItems: [
        {
          name: 'fill',
          icon: 'fill-icon',
          iconWidth: 14,
          iconHeight: 14,
          iconColor: '#000',
          isActive: objectFit.value.objectFit == 'cover'
        },
        {
          name: 'fit',
          icon: 'fit-icon',
          iconWidth: 14,
          iconHeight: 14,
          iconColor: '#000',
          isActive: objectFit.value.objectFit == 'contain'
        }
      ],
      opacity: <any>opacity,
      imageTypeList: [
        { name: 'Upload', icon: 'upload-icon', iconWidth: '13', iconHeight: '13', tooltip: null },
        { name: 'Url', icon: 'url-icon', iconWidth: '12', iconHeight: '12', tooltip: null },
        { name: 'Unsplash', icon: 'unsplash-icon', iconWidth: '12', iconHeight: '12', tooltip: 'Coming soon' }
      ],
      uploadType,
      overlayProps,
      overlayColor,
      overlayOpacity
    };
  }
});
</script>

<style lang="scss" scoped>
.dte-image {
  &__input-container {
    position: relative;
    height: 32px;
    width: 66px;
    margin-right: 2px;
    margin-left: 8px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &__input-icon {
    cursor: default;
    padding-right: 8px;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    color: #828282;
  }

  &__input {
    padding: 7px 5px;
    border: 1px solid $color_input_border;
    border-radius: 4px;
    transition: border-color 0.2s ease, opacity 0.2s ease;
    width: 100%;

    &:hover {
      border-color: $color_input_hover;
    }

    &:focus {
      border-color: $color_input_focus;
    }

    &_icon {
      position: absolute;
      top: 0;
      left: 0;
      padding-right: 15px;
    }

    &_hex {
      max-width: 89px;
      margin-right: 2px;
    }
  }

  &__switch {
    margin-bottom: $margin_l;

    &--hidden {
      opacity: 0.4;
    }
  }

  &__title {
    line-height: 24px;
    height: 24px;
  }
}

.image-upload-controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: $margin_l 0 $margin_s;
  flex-wrap: wrap;

  &--hidden {
    opacity: 0.4;
  }

  &__type {
    flex: 1;
  }

  &__input {
    margin: $margin_s 0 0;
    height: 32px;
    width: 100%;
    border: 1px solid $color_input_border;
    border-radius: $shape_border_radius;
    transition: 0.3s;
    padding: 8px;
    font-size: 12px;
    line-height: 16px;

    &::placeholder {
      color: $gray200;
    }

    &:hover {
      border-color: $color_input_hover;
    }

    &:focus {
      border-color: $color_input_focus;
    }

    &.error {
      border-color: $danger;
    }
  }

  &__row {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: $margin_s;
  }
}
</style>

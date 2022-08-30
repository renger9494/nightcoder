<template>
  <div class="dte-icon sidebar-block">
    <div class="sidebar-block__head sidebar-block__head--interactive" @click="addBorder">
      <p
        class="dte-icon__title sidebar-block__title sidebar-block__title--no-gutter"
        :class="{ 'sidebar-block__title--inactive': isIconHidden }"
      >
        Icon
      </p>
      <square-icon-btn
        @click.native.stop="addBorder"
        :icon-settings="{ name: isIconHidden ? 'plus-icon' : 'minus-icon', width: 24, height: 24 }"
        :icon-color="isIconHidden ? '#828282' : '#000'"
      />
    </div>
    <div v-if="!isIconHidden" class="dte-icon__controls">
      <div class="sidebar-block__row">
        <image-input :is-icon="true" :value="loadedImage" :uploadImage="saveImage" />
      </div>
      <switcher class="dte-icon__switch" :switcher-items="switcherItems" @filterName="setActiveTab" />
      <div class="sidebar-block__row sidebar-block__row--sb">
        <prefix-input
          class="dte-icon__input sidebar-block__item sidebar-block__item--s"
          :type="'iconSize'"
          :unit="'px'"
          :value="iconSize"
          @inputHandler="changeStyle"
        />
        <prefix-input
          class="dte-icon__input sidebar-block__item"
          :type="'gridGapBtn'"
          :unit="'px'"
          :value="gridGap"
          @inputHandler="changeStyle"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import { upperFirst as _upperFirst } from 'lodash';
import TogglePanelIcon from '@/components/Editor/Sidebar/DesignType/Sections/TogglePanelIcon.vue';
import ImageInput from '@/components/Editor/Sidebar/Reusable/ImageInput.vue';
import http from '@/utils/http';
import { FileDto } from '@/utils/api';
import Switcher from '@/components/Editor/Sidebar/Switcher.vue';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';

export default defineComponent({
  name: 'ButtonIcon',
  components: {
    SquareIconBtn,
    Switcher,
    TogglePanelIcon,
    ImageInput
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root }) {
    const previewMode = computed(() => root.$store.state.editor.previewMode);
    const styles = computed(() => props.value.styles[previewMode.value]);
    const iconPosition = computed(() => props.value.payload.iconPosition ?? 'left');
    const isIconHidden = computed(() => props.value.payload.isIconHidden ?? true);
    const switcherItems = computed(() => [
      { name: 'Left', isActive: iconPosition.value === 'left' },
      { name: 'Right', isActive: iconPosition.value === 'right' }
    ]);

    function addIcon() {
      root.$store.commit('editor/changeElementPayload', {
        id: props.value.id,
        path: 'isIconHidden',
        value: !isIconHidden.value
      });
    }

    function changeImage(value?: FileDto | { fullPath: string }) {
      root.$store.commit('editor/changeElementPayload', {
        id: props.value.id,
        path: 'image',
        value
      });
    }

    function setActiveTab(val: string) {
      root.$store.commit('editor/changeElementPayload', {
        id: props.value.id,
        path: 'iconPosition',
        value: val.toLowerCase()
      });
    }

    const saveImage = (fd: FormData) => {
      const { templateId, blockId, pageId, projectId } = root.$route.params;
      let url = '';
      if (templateId) url = `/api/templates/${templateId}/elementImage`;
      else if (blockId) url = `/api/interface/Block/${blockId}/elementImage`;
      else url = `/api/projects/${projectId}/pages/${pageId}/elementImage`;

      return http.post(url, fd).then(({ data: elementImage }) => {
        const image = elementImage;
        delete image.fullPathJp2;
        delete image.fullPathWebP;
        image.fullPathWebP = false;
        image.isHasWebP = false;
        changeImage(image);

        return image as FileDto;
      });
    };

    const loadedImage = computed(() => props.value.payload.image ?? '');

    const { numberValue: iconSize, setCssProperty: setIconSize } = useCssStyleEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'width'
    });

    const { numberValue: gridGap, setCssProperty: setGridGapBtn } = useCssStyleEditor({
      element: computed(() => props.value),
      style: styles,
      store: root.$store,
      cssProperty: 'gridGap'
    });

    const setCssProperty: any = {
      setIconSize,
      setGridGapBtn
    };

    function changeStyle(val: { type: string; data: string }) {
      setCssProperty[`set${_upperFirst(val.type)}`](`${val.data}px`);
    }

    if (!styles.value?.gridGap) {
      setGridGapBtn('10px');
    }

    if (!styles.value?.iconSize) {
      setIconSize('14px');
    }

    if (!loadedImage.value) {
      changeImage({ fullPath: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/btn_icon.svg` });
    }

    return {
      isIconHidden,
      switcherItems,
      gridGap,
      loadedImage,
      iconSize,
      changeStyle,
      setActiveTab,
      saveImage,
      addBorder: addIcon
    };
  }
});
</script>

<style scoped lang="scss">
.dte-icon {
  &__title {
    line-height: 24px;
    height: 24px;
  }
  &__controls {
    margin: $margin_l 0 $margin_s;
  }
  &__switch {
    margin: 0 0 $margin_s;
  }
  &__input {
    flex: 1 0 0;
  }
}
</style>

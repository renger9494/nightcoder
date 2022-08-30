<template>
  <div class="add-block-popup">
    <div class="popup-field">
      <span class="popup-field__label">Name*</span>
      <div class="popup-field__content">
        <input :value="block.name" class="field__input" type="text" @input="changeBlockName" />
      </div>
    </div>
    <div class="popup-field">
      <span class="popup-field__label">Category*</span>
      <items-selector :items="blockCategories" :currentItem="currentCategory" @itemChanged="changeCurrentCategory" />
    </div>
    <div class="popup-field">
      <div class="popup-field__text-with-button">
        <span class="popup-field__label">Thumbnail*</span>
      </div>
      <div class="popup-field__content">
        <div class="image-upload-controls image-input" @click="blockImageInput.click()">
          <input
            :ref="`block-image-input`"
            type="file"
            accept="image/jpeg,image/png"
            multiple
            @change="setBlockImage($event)"
          />
          <div class="image-input__upload-icon" v-tooltip="'Upload image'">
            <svg-icon name="upload-icon" width="13" height="13" color="#000" />
          </div>
          <image-loader v-if="loadingImage" class="image-input__loader" />
          <picture class="image-input__image-preview" v-else-if="BlockImage.path">
            <img
              :src="BlockImage.path"
              :style="{ opacity: loadingImage ? 0.2 : 1 }"
              fluid
              alt="Preview image"
              class="pointer"
            />
          </picture>
          <svg-icon
            v-else
            class="image-input__default-icon"
            name="preview-image-icon"
            width="49"
            height="40"
            color="#949CAD"
          />
        </div>
      </div>
    </div>
    <div v-if="history.length" class="popup-field">
      <div class="block-history">
        <div class="block-history__header">
          <span class="block-history__label">History</span>
          <span @click="showHistory = !showHistory" class="block-history__toggler">
            <svg width="8" height="8" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                :transform="`rotate(${showHistory ? 0 : -90}, 4, 2.5)`"
                style="transition: all 0.1s"
                d="M3.99999 4.56024C3.85661 4.56024 3.71325 4.50549 3.60394 4.39623L0.164113 0.95637C-0.0547045 0.737552 -0.0547045 0.382776 0.164113 0.164047C0.382843 -0.0546824 0.737548 -0.0546824 0.956383 0.164047L3.99999 3.20783L7.04361 0.164153C7.26243 -0.054576 7.61709 -0.054576 7.83581 0.164153C8.05473 0.382883 8.05473 0.737658 7.83581 0.956476L4.39603 4.39634C4.28667 4.50561 4.14331 4.56024 3.99999 4.56024Z"
                fill="black"
              />
            </svg>
          </span>
        </div>
        <div v-if="showHistory" class="block-history__list">
          <div
            @click="replaceBlockConfigWith(historyItem)"
            v-for="(historyItem, index) in history"
            :key="index"
            class="block-history__item"
          >
            {{ toLocalDate(historyItem.createdUtcDateTime) }} {{ historyItem.whoCreated }}
          </div>
        </div>
      </div>
    </div>
    <div class="popup-field">
      <span v-if="alertShow" :class="{ 'popup-alert-red': alertError }" class="popup-alert">{{ alertText }}</span>
    </div>
    <div class="popup-bottom-wrap popup-bottom-wrap_end">
      <button v-if="isBlockSaved" @click="saveBlock(true)" class="add-block-btn add-block-btn--secondary">
        Save as new
      </button>
      <button @click="saveBlock(!isBlockSaved)" class="add-block-btn">
        {{ isBlockSaved ? 'Update' : 'Save' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import apiClient from '@/utils/apiClient';
import http from '@/utils/http';

import { mapGetters, mapMutations, mapState } from 'vuex';
import ItemsSelector from '@/components/Editor/Sidebar/Reusable/ItemsSelector.vue';
import { Converter } from '@/utils/converter';
import { toLocalDate } from '@/plugins/filters';
import { BaseNameDtoOfInteger, FileDto, InterfaceElementHistoryItemDto, InterfaceElementType } from '@/utils/api';
import { AddBlockPopupData, PopupSettings } from '../types';
import HTMLElementEvent from '@/utils/types/HTMLElementEvent';
interface Preview {
  id: undefined | string;
  file: null | File | Blob;
  path: string | ArrayBuffer | null;
}
function createPayload(
  block: any,
  popupSettingsData: AddBlockPopupData,
  img: Preview,
  currentCategory: BaseNameDtoOfInteger | null | undefined,
  isNewBlock: boolean
): any {
  const { name } = block;
  const { blockConfig, googleFonts } = popupSettingsData;
  const config = JSON.stringify({
    googleFonts,
    blockConfig
  });
  const payload = {
    Name: name,
    Parents: currentCategory ? [{ id: currentCategory.id, type: InterfaceElementType.BlockCategory }] : undefined,
    Config: config,
    PrderNumber: 0
  } as any;
  if (img.id) payload.PreviewImageId = img.id;
  else if (img.file) payload.PreviewImage = img.file;
  return payload;
}

export default Vue.extend({
  name: 'AddBlockPopup',
  components: {
    ItemsSelector
  },
  data: () => ({
    alertShow: false,
    alertError: false,
    alertText: null as string | null,
    currentCategory: null as BaseNameDtoOfInteger | undefined | null,
    BlockImage: {
      id: undefined,
      file: null,
      path: null
    } as Preview,

    history: [] as InterfaceElementHistoryItemDto[],
    showHistory: false,
    block: {
      id: null,
      name: ''
    } as { id: number | null; name: string | undefined },
    blockCategories: [] as BaseNameDtoOfInteger[],
    loadingImage: false
  }),
  computed: {
    ...mapState({
      selectedBlocks: (state: any) => state.editor.selectedBlocks,
      userConfig: (state: any) => state.editor.userConfig,
      popupSettings: (state: any) => <PopupSettings<AddBlockPopupData>>state.editor.popupSettings
    }),
    blockId(): number {
      const { blockId } = this.$route.params;
      if (!blockId) return 0;
      return +blockId;
    },
    isBlockSaved(): boolean {
      return this.block.id != null && this.block.id > 0;
    },
    blockImageInput(): HTMLInputElement {
      return <HTMLInputElement>(<any>this.$refs['block-image-input']);
    }
  },
  async mounted() {
    const { data: blockCategories } = await apiClient.interfaceElements.interfaceElementsGetSimplied(
      InterfaceElementType.BlockCategory,
      {
        isOrderByNumber: true
      }
    );
    this.blockCategories = blockCategories;
    const { dbId, name } = this.popupSettings.data.blockConfig;
    const blockId = this.blockId > 0 ? this.blockId : dbId;

    if (!blockId || !(blockId > 0) || blockId == -1) {
      this.block.name = name;
      this.block.id = blockId || null;
      return;
    }
    try {
      const { data: block } = await apiClient.interfaceElements.interfaceElementsGetById(
        InterfaceElementType.Block,
        blockId
      );
      this.block.id = block.id;
      this.block.name = block.name;
      const file = block.files[0];
      if (file) {
        this.BlockImage.path = file.fullPath || null;
        this.BlockImage.id = file.id;
      }

      const category = block.parents.find(x => x.type == InterfaceElementType.BlockCategory);
      if (category) {
        this.currentCategory = this.blockCategories.find(x => x.id == category.id);
      }
      const { data: history } = await apiClient.interfaceElements.interfaceElementsGetHistories(
        InterfaceElementType.Block,
        blockId
      );
      history.forEach(h => {
        if (h.config) h.config = JSON.parse(h.config);
      });
      this.history = history;
    } catch (error) {
      if (error.response && error.response.status == 404) {
        this.block.name = name;
        this.popupSettings.data.blockConfig.dbId = -1;
        return;
      }

      console.error(`[AddBlockPopup]: Can't found block by id ${dbId}`, error);
    }
  },
  methods: {
    ...mapMutations({
      replaceBlockConfig: 'editor/replaceBlockConfig'
    }),
    toLocalDate,
    replaceBlockConfigWith(historyItem: any) {
      this.replaceBlockConfig({ blockConfig: historyItem.config.blockConfig, id: this.block.id });
    },
    setBlockImage(event: HTMLElementEvent<HTMLInputElement>) {
      if (event.target?.files == null || !event.target.files[0]) return;
      const file = event.target.files[0];
      this.loadingImage = true;
      const preview = this.BlockImage;

      var reader = new FileReader();
      reader.onload = function () {
        preview.path = reader.result;
        preview.file = file;
        preview.id = undefined;
      };
      reader.readAsDataURL(file);
      this.loadingImage = false;
    },
    changeBlockName(e: HTMLElementEvent<HTMLInputElement>) {
      this.$store.commit('editor/changeBlockParam', {
        block: this.block,
        path: 'name',
        value: e.target.value
      });
    },
    isValid() {
      if (!this.block.name) {
        this.showAlert('Please, fill a name out', true);
        return false;
      }
      if (!this.currentCategory) {
        this.showAlert('Please, select a category', true);
        return false;
      }
      if (!this.BlockImage.file && !this.BlockImage.id) {
        this.showAlert('Please, upload an image', true);
        return false;
      }
      this.hideAlert();
      return true;
    },
    /*    editBlock() {
      const { id } = this.block;
      if (!this.isValid() || !id) return;

      const payload = createPayload(this.block, this.popupSettings.data, this.img, this.currentCategory);
      apiClient.interfaceElements.interfaceElementsUpdate(InterfaceElementType.Block, id, payload).then(() => {
        this.showAlert('Block saved', false);
        setTimeout(() => {
          this.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
        }, 2000);
      });
    }, */
    saveBlock(isNewBlock: boolean) {
      if (!this.isValid()) return;

      const payload = createPayload(
        this.block,
        this.popupSettings.data,
        this.BlockImage,
        this.currentCategory,
        isNewBlock
      );
      const formData = Converter.jsonToFormData(payload);

      const httpMethod = isNewBlock ? 'post' : 'put';
      const blockUrlId = !isNewBlock ? `/${this.block.id}` : '';
      http[httpMethod](`/api/interface/block${blockUrlId}`, formData)
        .then(({ data: blockId }) => {
          if (isNewBlock) {
            const { blockConfig } = this.popupSettings.data;
            this.$store.commit('editor/changeBlockParam', {
              block: blockConfig,
              path: 'dbId',
              value: blockId
            });
          }
          this.showAlert('Block saved', false);
          setTimeout(() => {
            this.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
          }, 2000);
        })
        .catch((error: any) => {
          console.error(error);
        });
      /*  apiClient.interfaceElements
        .interfaceElementsAdd(InterfaceElementType.Block, payload)
        .then(({ data: blockId }) => {
          const { blockConfig } = this.popupSettings.data;
          this.$store.commit('editor/changeBlockParam', {
            block: blockConfig,
            path: 'dbId',
            value: blockId
          });
          this.showAlert('Block saved', false);
          setTimeout(() => {
            this.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
          }, 2000);
        })
        .catch(error => {
          console.error(error);
        }); */
    },
    changeCurrentCategory(category: BaseNameDtoOfInteger) {
      this.currentCategory = category;
    },
    showAlert(alertText: string, isError: boolean) {
      this.alertShow = true;
      this.alertText = alertText;
      this.alertError = isError;
    },
    hideAlert() {
      this.alertShow = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.popup-alert {
  align-items: center;
  display: flex;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.03em;
  margin-right: 15px;
  color: #53b71b;
  &-red {
    color: #f46363;
  }
}
.add-block-popup {
  padding-top: 10px;
  border-top: 1px solid #f3f3f3;
  margin-top: 15px;
}
.popup-bottom-wrap {
  display: flex;
  column-gap: 5px;
  justify-content: flex-end;
  width: 100%;
  margin-top: 52px;
}
.add-block-btn {
  display: inline-flex;
  align-items: center;
  background: #318bf5;
  border-radius: $shape_border_radius;
  padding: 0 16px;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.03em;
  color: #ffffff;
  height: 30px;

  &--secondary {
    background-color: #828282;
  }

  &:hover {
    cursor: pointer;
  }
  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}
.field {
  &__input {
    font-size: 12px;
    line-height: 14px;
    padding: 8px;
    border: 1px solid $color_input_border;
    transition: border-color 0.2s ease, opacity 0.2s ease;
    position: relative;
    &:hover {
      border-color: $color_input_hover;
      z-index: 3;
    }

    &:focus {
      border-color: $color_input_focus;
      z-index: 3;
    }
  }
}
.popup-field {
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 24px;
  &_inline {
    display: flex;
    align-items: center;
    .popup-field__label {
      margin: 0 12px 0 0;
    }
  }
  &__label {
    display: block;
    font-size: 12px;
    line-height: 14px;
    margin-bottom: 12px;
    color: #828282;
  }
  &__text-with-button {
    display: flex;
    justify-content: space-between;
  }
}

.block-history {
  &__header {
    margin-bottom: 12px;
  }
  &__label {
    margin: 0 12px 0 0;
  }
  &__toggler {
    height: 12px;
  }
  &__list {
    border-radius: 5px;
  }
  &__item {
    position: relative;

    &:hover .block-history__img-preview {
      visibility: visible;
    }

    &:first-child {
      border-radius: 4px 4px 0 0;
    }

    &:last-child {
      border-radius: 0 0 4px 4px;
    }

    &:nth-child(odd) {
      background-color: #f3f3f3;
    }

    width: 100%;
    padding: 10px 12px;
    cursor: pointer;
  }

  &__img-preview {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 110%;
    padding: 10px;
    z-index: 2;

    background-color: #dadada;
    border-radius: $shape_border_radius;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
}
.image-input {
  height: 116px;
  background: $gray100;
  border: 1px solid rgba(189, 194, 199, 0.2);
  border-radius: $shape_border_radius;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .upload-message {
    position: absolute;
    font-size: 13px;
  }
  &:hover {
    border: 1px solid $gray300;
    .image-input__default-icon {
      opacity: 1;
    }
  }
  &__upload-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 8px;
    bottom: 10px;
    z-index: 999;
    width: 30px;
    height: 30px;
    background: $white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    transition: 0.3s;

    svg {
      transition: 0.3s;
    }

    &:hover {
      background: $black;

      svg {
        color: $white !important;
      }
    }
  }
  &__image-preview {
    height: 116px;
    width: 100%;
  }
  &__loader {
    position: absolute;
    z-index: 200;
  }
  &__default-icon {
    transition: 0.3s;
    opacity: 0.6;
  }
  input {
    display: none;
  }
  picture {
    img {
      border-radius: 4px;
      width: 100%;
      height: 116px;
      object-fit: cover;
    }
  }
}
.inValid {
  border: 1px solid red;
}
</style>

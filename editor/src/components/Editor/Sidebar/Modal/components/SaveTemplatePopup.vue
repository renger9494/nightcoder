<template>
  <div class="add-block-popup">
    <div class="popup-field">
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
            @click="replaceUserConfigWith(historyItem)"
            v-for="(historyItem, index) in history"
            :key="index"
            class="block-history__item"
          >
            <span class="block-history__img-preview">
              <img :src="historyItem.config.img" height="auto" width="200" alt="" />
            </span>
            {{ historyItem.createdUtcDateTime | localDate }}
          </div>
        </div>
      </div>
    </div>
    <span v-if="alertShow" class="popup-alert">{{ alertText }}</span>
    <div class="popup-bottom-wrap popup-bottom-wrap_end">
      <button @click="save" class="add-btn">Update template</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import { cloneDeep as _cloneDeep } from 'lodash';
import apiClient from '@/utils/apiClient';
import { InterfaceElementHistoryItemDto, InterfaceElementType, SaveInterfaceElementConfigDto } from '@/utils/api';
import { PopupSettings, SaveTemplatePopupData, TemplateElement } from '../types';

type History = Omit<InterfaceElementHistoryItemDto, 'config'> & { config: any };

export default Vue.extend({
  name: 'SaveTemplatePopup',
  data: () => ({
    alertShow: false,
    alertText: '',
    history: [] as History[],
    showHistory: false,
    template: {} as TemplateElement
  }),
  computed: {
    ...mapState({
      popupSettings: (state: any) => <PopupSettings<SaveTemplatePopupData>>state.editor.popupSettings,
      userConfig: (state: any) => state.editor.userConfig
    })
  },
  async mounted() {
    const { template } = this.popupSettings.data;

    const { data: history } = await apiClient.interfaceElements.interfaceElementsGetHistories(
      InterfaceElementType.Templates,
      template.interfaceElementId
    );

    this.history = history.map(({ id, createdUtcDateTime, config, whoCreated }) => {
      return { config: config ? JSON.parse(config) : null, createdUtcDateTime, whoCreated, id };
    });
    this.template = template;
  },
  methods: {
    setUserConfig(config: any) {
      this.$store.state.dispatch('editor/setUserConfig', config);
    },
    replaceUserConfigWith(historyItem: InterfaceElementHistoryItemDto) {
      this.setUserConfig((<any>historyItem.config).config);
    },
    prepareConfig() {
      const preparedConfig = _cloneDeep(this.userConfig);
      delete preparedConfig.allComponents;
      delete preparedConfig.dependTemplate;
      return preparedConfig;
    },
    showAlert(message: string) {
      this.alertShow = true;
      this.alertText = message;
      setTimeout(() => {
        this.alertShow = false;
      }, 3000);
    },
    async save() {
      const payload: SaveInterfaceElementConfigDto = {
        config: JSON.stringify({
          config: this.prepareConfig(),
          templateId: this.template.templateId
        })
      };
      apiClient.interfaceElements
        .interfaceElementsSaveConfig(InterfaceElementType.Templates, this.template.interfaceElementId, payload)
        .then(() => {
          this.showAlert('Template saved');
          setTimeout(() => {
            this.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
          }, 800);
        })
        .catch(() => {
          this.showAlert('Failed to save template, please, try again later');
        });
    }
  }
});
</script>

<style lang="scss">
.popup-field__content {
  width: 100%;
}
.popup-alert {
  align-items: center;
  display: flex;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.03em;
  margin-right: 15px;
}
.add-block-popup {
  padding-top: 10px;
  border-top: 1px solid #f3f3f3;
  margin-top: 15px;
}
.popup-bottom-wrap {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 0;
}
.add-btn {
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
  margin: 0;
}
.popup-field {
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 12px;
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
</style>

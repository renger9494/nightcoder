<template>
  <div class="add-block-popup">
    <div class="popup-field popup-field_inline">
      <span class="popup-field__label">Name:</span>
    </div>
    <div class="popup-field popup-field_inline">
      <div class="popup-field__content">
        <Field :value="name" :onChange="handleNameFieldChange" :onEnter="save" placeholder="Enter template name..." />
      </div>
    </div>
    <div class="popup-bottom-wrap popup-bottom-wrap_end">
      <span v-if="alertShow" class="popup-alert">{{ alertText }}</span>
      <button @click="save" class="add-btn">Save</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import apiClient from '@/utils/apiClient';
import { mapMutations, mapState } from 'vuex';
import { InterfaceElementType } from '@/utils/api';
import Field from '@/components/Shared/Field.vue';
import HTMLElementEvent from '@/utils/types/HTMLElementEvent';
import { cloneDeep as _cloneDeep } from 'lodash';
import { NewTemplatePopupData, PopupSettings } from '../types';
import { Converter } from '@/utils/converter';
export default Vue.extend({
  name: 'NewTemplatePopup',
  components: {
    Field
  },
  data: () => ({
    alertShow: false,
    alertText: '',
    name: ''
  }),
  computed: {
    ...mapState({
      popupSettings: (state: any) => <PopupSettings<NewTemplatePopupData>>state.editor.popupSettings,
      userConfig: (state: any) => state.editor.userConfig
    })
  },
  methods: {
    ...mapMutations({
      changeEditorParam: 'editor/changeEditorParam'
    }),
    handleNameFieldChange(event: HTMLElementEvent<HTMLInputElement>) {
      this.name = event.target.value;
    },
    isValid() {
      if (!this.name) {
        this.alertShow = true;
        this.alertText = 'Set name before saving';
        return false;
      }
      this.alertShow = false;
      return true;
    },
    async save() {
      if (!this.isValid()) return;

      try {
        const { data: savedTemplate } = await apiClient.templates.templatesCreate({ name: this.name ?? '' });
        const config = JSON.stringify({ config: this.userConfig, templateId: savedTemplate.id });
        const payload = { Config: config, OrderNumber: 0, Name: this.name ?? '' };
        const formData = Converter.jsonToFormData(payload);

        const { data: savedTemplateUserConfigId } = await apiClient.interfaceElements.interfaceElementsAdd(
          InterfaceElementType.Templates,
          payload
        );

        this.alertShow = true;
        this.alertText = 'Template saved';
        setTimeout(() => {
          this.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
        }, 800);
        const { projectId, pageId } = this.popupSettings.data;
        await apiClient.projectPages.projectPagesAttachedTemplate(projectId, pageId, savedTemplate.id);

        this.changeEditorParam({
          path: 'templateElement',
          value: { templateId: savedTemplate.id, interfaceElementId: savedTemplateUserConfigId }
        });
      } catch (error) {
        this.alertShow = true;
        this.alertText = 'Failed to save template, please, try again later';
        setTimeout(() => {
          this.alertShow = false;
        }, 3000);
      }
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

  button:hover {
    cursor: pointer;
  }
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

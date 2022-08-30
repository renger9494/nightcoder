<template>
  <div class="sidebar-block form-elements">
    <div class="sidebar-block__head">
      <p class="sidebar-block__title sidebar-block__title--no-gutter">Form elements</p>
      <span v-if="!isMailchimp" class="form-elements__title">Add input</span>
      <square-icon-btn
        v-if="!isMailchimp"
        @click="addNewElement"
        :icon-settings="{ name: 'plus-icon', ...iconSize }"
        icon-color="#000"
      />
    </div>

    <div class="sidebar-block__body form-section">
      <div class="form-section__elem-section">
        <p class="form-section__section-title">Inputs</p>
        <label class="form-sidebar-field" v-for="(item, index) in inputElements" :key="item.id">
          <input
            :ref="`input_${index}`"
            class="form-sidebar-field__input"
            type="text"
            :value="item.payload.text"
            @change="onInputChange(item, `input_${index}`)"
            @keydown.enter="onInputChange(item, `input_${index}`)"
            @keydown.esc="cancelEdit(`input_${index}`, item.payload.text)"
          />
          <svg-icon
            name="check-mark-icon"
            width="10"
            height="8"
            color="#53B71B"
            class="form-sidebar-field__icon"
            v-if="savedIndex === `input_${index}`"
          />
          <button v-if="isLastInputElement" class="form-sidebar-field__remove" @click="removeElement(index, 1, true)">
            <svg-icon name="minus-icon" width="24" height="24" color="#000" />
          </button>
        </label>
      </div>

      <div class="form-section__elem-section">
        <p class="form-section__section-title">Buttons</p>
        <label class="form-sidebar-field" v-for="(item, index) in buttonElements" :key="index">
          <input
            :ref="`button_${index}`"
            class="form-sidebar-field__button"
            type="text"
            :value="item.payload.text"
            @change="onInputChange(item, `button_${index}`)"
            @keydown.enter="onInputChange(item, `button_${index}`)"
            @keydown.esc="cancelEdit(`button_${index}`, item.payload.text)"
          />
          <svg-icon
            v-if="savedIndex === `button_${index}`"
            name="check-mark-icon"
            width="10"
            height="8"
            color="#53B71B"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations } from 'vuex';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';

export default Vue.extend({
  name: 'FormElements',
  components: { SquareIconBtn },
  props: {
    value: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  data() {
    return {
      savedIndex: '',
      iconSize: { width: 24, height: 24 }
    };
  },
  watch: {
    integrations(val) {
      const elementsLength = this.value.elements.length;
      if (val === 'mailchimp' && elementsLength > 2) {
        this.removeElement(0, elementsLength - 2, false);
      }
    }
  },
  computed: {
    isLastInputElement(): boolean {
      return this.value.elements.filter((item: any) => item.type === 'input').length !== 1;
    },
    inputElements(): Array<any> {
      return this.value.elements.filter((item: any) => item.type === 'input');
    },
    buttonElements(): Array<any> {
      return this.value.elements.filter((item: any) => item.type === 'button');
    },
    integrations(): string {
      return this.value.payload.integration;
    },
    isMailchimp(): boolean {
      return this.integrations === 'mailchimp';
    }
  },
  methods: {
    ...mapMutations({
      addNewElementToForm: 'editor/addNewElementToForm',
      removeElementsFromFormAtIndex: 'editor/removeElementsFromFormAtIndex',
      changeElementPayloadDirectly: 'editor/changeElementPayloadDirectly',
      changeElementLocation: 'editor/changeElementLocation'
    }),
    addNewElement() {
      this.addNewElementToForm({ formElement: this.value });
      this.changeElementLocation({
        element: this.value,
        data: { resizeImmediately: true },
        isSaveHistory: false
      });
    },
    onInputChange(item: any, element: string) {
      this.changeElementPayloadDirectly({
        element: item,
        path: 'text',
        value: (this.$refs[element] as Array<any>)[0].value
      });
      this.savedIndex = element;

      setTimeout(() => {
        this.savedIndex = '';
      }, 3000);
    },
    cancelEdit(element: string, value: string) {
      (this.$refs[element] as Array<any>)[0].value = value;
      (this.$refs[element] as Array<any>)[0].blur();
    },
    removeElement(index: number, countToRemove: number, saveInHistory: boolean) {
      this.removeElementsFromFormAtIndex({
        formElement: this.value,
        atIndex: index,
        countToRemove,
        saveInHistory
      });
      this.changeElementLocation({
        element: this.value,
        data: { resizeImmediately: true },
        isSaveHistory: false
      });
    }
  }
});
</script>

<style lang="scss">
.form-sidebar-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &:not(:last-child) {
    margin: 0 0 10px;
  }

  &__input,
  &__button {
    background: $white;
    border: 1px solid $gray100;
    border-radius: $shape_border_radius;
    flex: 0 0 calc(100%);
    max-width: calc(100%);
    height: 32px;
    transition: 0.3s;
    padding: 0 5px;
    font-size: 13px;
    line-height: 16px;
    color: $black;

    &:hover {
      border-color: $gray400;
    }

    &:focus {
      border-color: $blue200;
    }
  }

  &__input {
    flex: 1 0 calc(100% - 28px);
    max-width: 100%;
    width: 100%;
  }

  &__icon {
    position: absolute;
    z-index: 9999;
    right: 40px;
    top: 0;
    bottom: 0;
    margin: auto 0;
    transition: all 0.3s ease;
  }

  &__remove {
    flex: 0 0 24px;
    height: 24px;
    cursor: pointer;
    border-radius: $shape_border_radius;
    transition: 0.3s;
    margin: 0 0 0 2px;

    &:hover {
      background: $gray100;
    }
  }
}

.form-section {
  &__elem-section {
    &:not(:last-child) {
      margin: 0 0 $margin_l;
    }
  }
  &__section-title {
    font-size: 12px;
    line-height: 16px;
    color: $gray400;
    margin: 0 0 $margin_s;
  }
}

.form-elements {
  &__title {
    font-size: 12px;
    line-height: 16px;
    color: $gray200;
    margin: 0 5px 0 auto;
  }
}
</style>

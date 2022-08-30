<template>
  <div>
    <head-section :value="value" :is-link="false" />

    <head-form-section
      :elements="formTypes"
      :value="value"
      :block="block"
      :selected-elements="selectedElement"
      @chooseElement="chooseElement"
    />

    <dimension-form-section v-show="isFieldVisible(['form'])" :value="value" :block="block" />

    <button-color-multiple v-if="isFieldVisible(['button', 'input'])" :value="selectedElement" header="Text color" />

    <background-color-multiple
      v-if="isFieldVisible(['button', 'input'])"
      :value="selectedElement"
      header="Background color"
    />

    <font-section-multiple
      v-if="isFieldVisible(['button', 'input'])"
      :value="selectedElement"
      :elements-to-resize="[value]"
      :is-form="true"
    />

    <border-multiple v-if="isFieldVisible(['button', 'input'])" :value="selectedElement" />

    <effects-multiple v-if="isFieldVisible(['button', 'input'])" :value="selectedElement" />

    <form-elements v-if="isFieldVisible(['form'])" :value="value" />

    <integration v-if="isFieldVisible(['form'])" :value="value" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeadSection from '@/components/Editor/Sidebar/DesignType/Sections/Head.vue';
import HeadFormSection from '@/components/Editor/Sidebar/DesignType/Sections/Form/HeadForm.vue';
import DimensionFormSection from '@/components/Editor/Sidebar/DesignType/Sections/Form/DimensionForm.vue';
import ButtonColorMultiple from '@/components/Editor/Sidebar/DesignType/Sections/Color/ButtonColorMultiple.vue';
import BackgroundColorMultiple from '@/components/Editor/Sidebar/DesignType/Sections/Color/BackgroundColorMultiple.vue';
import FontSectionMultiple from '@/components/Editor/Sidebar/DesignType/Sections/Multiple/FontMultiple.vue';
import FormElements from '@/components/Editor/Sidebar/DesignType/Sections/Form/FormElements.vue';
import BorderMultiple from '@/components/Editor/Sidebar/DesignType/Sections/Multiple/BorderMultiple.vue';
import EffectsMultiple from '@/components/Editor/Sidebar/DesignType/Sections/Effects/EffectsMultiple.vue';
import Integration from '@/components/Editor/Sidebar/DesignType/Sections/Form/Integration.vue';

export default Vue.extend({
  name: 'Form',
  components: {
    HeadSection,
    Integration,
    EffectsMultiple,
    BorderMultiple,
    FormElements,
    HeadFormSection,
    DimensionFormSection,
    ButtonColorMultiple,
    BackgroundColorMultiple,
    FontSectionMultiple
  },
  props: {
    block: {
      type: [String, Number],
      required: true
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      activeType: 'form'
    };
  },
  computed: {
    selectedElement(): any {
      return this.value.elements.filter((item: any) => item.type === this.activeType);
    },
    projectId(): string {
      return this.$route.params.projectId;
    },
    formTypes(): Array<any> {
      const elemTypes = [...this.value.elements].map((item: any) => ({ name: item.type }));
      return elemTypes.filter((item: any, pos: any, self: any) => self.indexOf(item) == pos);
    }
  },
  methods: {
    chooseElement(item: any) {
      this.activeType = item.name;
    },
    isFieldVisible(typesArr: Array<string>) {
      return typesArr.includes(this.activeType);
    }
  }
});
</script>

<style lang="scss" scoped></style>

<template>
  <form ref="form" @submit="onFormSubmit" class="form-element" :id="element.id">
    <component v-for="(item, index) in elements" :key="index" :is="`${item.type}Element`" :value="item" />
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { MetaInfo } from 'vue-meta';
import useInjectStylesPublishVdr from '../../hooks/publish/injectStylesPublishVdr.hook';
import inputElement from './FormElementInputPublish.vue';
import buttonElement from './FormElementButtonPublish.vue';
import { serviceCollection, IPublishAPI, ServiceInterfaceType } from './types';

export default defineComponent({
  name: 'FormElementPublish',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    inputElement,
    buttonElement
  },
  metaInfo(): MetaInfo {
    return {
      style: [{ type: 'text/css', cssText: this.stylesToHead }],
      __dangerouslyDisableSanitizers: ['style']
    };
  },
  setup(props, { root }) {
    const stylesToHead = useInjectStylesPublishVdr(props.value);
    const form = ref(null as null | any);
    const publishAPI = serviceCollection.get<IPublishAPI>(ServiceInterfaceType.PublishAPI);

    function onFormSubmit(e: FormDataEvent) {
      e.preventDefault();
      const inputs = form.value.elements;
      if (!inputs.length) return;
      if (props.value.payload.integration === 'mailchimp') {
        if (inputs[0].nodeName === 'INPUT' && inputs[0].type === 'text' && inputs[0].value.length > 0) {
          const { projectId, id } = props.value.payload.list;
          const email = inputs[0].value;
          publishAPI.postMailchimpMember(projectId, { listId: id, email });
        }
      }
    }

    return {
      stylesToHead,
      elements: props.value.elements as any[],
      element: props.value,
      form,
      onFormSubmit
    };
  }
});
</script>

<style lang="scss" scoped>
.form-element {
  height: auto !important;
}
</style>

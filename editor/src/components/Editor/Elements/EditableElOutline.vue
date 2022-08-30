<template>
  <span>
    <span v-if="!editunable" :label="label" clickable="true" @click="onClick" @mousedown="onClick">
      <slot />
    </span>
    <span v-else>
      <slot />
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      clicked: false
    };
  },
  props: {
    editunable: {
      type: Boolean
    },
    label: {
      type: String
    },
    index: {
      type: Number
    }
  },
  mounted() {
    const iframeReload = <HTMLIFrameElement>document.getElementById('iframeReload');
    if (iframeReload) {
      const $app = iframeReload.contentDocument?.querySelector('#app');
      if ($app) $app.addEventListener('click', this.clickOutside);
    }
  },
  beforeDestroy() {
    const iframeReload = <HTMLIFrameElement>document.getElementById('iframeReload');
    if (iframeReload) {
      const $app = iframeReload.contentDocument?.querySelector('#app');
      if ($app) $app.removeEventListener('click', this.clickOutside);
    }
  },
  methods: {
    clickOutside(event: any) {
      if (
        event.target != this.$el &&
        event.target.parentElement != this.$el &&
        event.target.parentElement.parentElement != this.$el
      ) {
        this.clicked = false;
      }
    },
    onClick() {
      this.clicked = true;
    }
  }
});
</script>

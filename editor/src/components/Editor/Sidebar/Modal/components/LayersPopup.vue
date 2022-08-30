<template>
  <div class="layer-popup">
    <layers-editor />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LayersEditor from '@/components/Editor/Sidebar/LayersType/LayersType.vue';

export default Vue.extend({
  name: 'LayersPopup',
  components: {
    LayersEditor
  }
});
</script>

<style lang="scss" scoped>
.layer-popup {
  display: block;
}
</style>

<template>
  <div
    class="file-loader"
    @dragenter="$event.preventDefault()"
    @dragleave.prevent="$emit('dragleave')"
    @dragover.prevent=""
    @drop.prevent="$emit('dropped', $event.dataTransfer)"
  />
</template>

<script lang="ts">
import Vue from 'vue';
/*
 * Компонент-провайдер drop события
 *
 * Может генерировать следующие события:
 * dropped - событие drop
 * */
export default Vue.extend({
  name: 'DropProvider'
});
</script>

<style lang="scss">
.file-loader {
  background-color: rgba(49, 139, 245, 0.4);
}
</style>

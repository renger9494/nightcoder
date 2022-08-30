<template>
  <div class="history-btns">
    <button
      v-tooltip="{ text: 'Undo', highlite: 'Ctrl+Z' }"
      :class="historyUn ? '' : 'disable'"
      @click="changeConfigVersion(false)"
      class="undo-btn"
    >
      <svg-icon name="undo-icon" width="8" height="11" :color="!historyUn ? '#949CAD' : '#000'" />
    </button>
    <button
      v-tooltip="{ text: 'Redo', highlite: 'Ctrl+Shift+Z' }"
      :class="historyRe ? '' : 'disable'"
      @click="changeConfigVersion(true)"
      class="redo-btn"
    >
      <svg-icon name="redo-icon" width="8" height="11" :color="!historyRe ? '#949CAD' : '#000'" />
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'HistoryBtns',
  computed: {
    ...mapState({
      historyUn: (state: any) => state.editor.editorHistoryUn.length,
      historyRe: (state: any) => state.editor.editorHistoryRe.length
    })
  },
  methods: {
    changeConfigVersion(type: any) {
      this.$store.commit('editor/cleanSelectedElements');
      this.$store.commit('editor/changeConfigFromHistory', type);
    }
  }
});
</script>

<style lang="scss" scoped>
.history-btns {
  display: flex;
  text-align: center;
  position: absolute;
  right: 395px;
  bottom: 17px;
  background: $white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  border-radius: $shape_border_radius;
  padding: 4px 8px;
  button {
    width: 24px;
    height: 24px;
    background: #ffffff;
    border-radius: $shape_border_radius;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1px;
    cursor: pointer;
    transition: 0.2s ease;

    path {
      transition: 0.2s ease;
    }
    &:active {
      border: 1px solid #f3f3f3;
      box-shadow: none !important;
      path {
        opacity: 1;
      }
    }
    &:hover {
      background: #f3f3f3;
      path {
        opacity: 1;
      }
    }
    &.disable {
      pointer-events: none;
      path {
        opacity: 0.2;
      }
    }
  }
}
</style>

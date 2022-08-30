<template>
  <ul class="sidebar-popup-list">
    <li
      v-for="(el, i) in popupData.list"
      class="sidebar-popup-list-item"
      @click="addElementToConfig(el.name)"
      :key="`addElementPopup_item_${i}`"
    >
      <div class="sidebar-popup-list__icon-wrapper">
        <icon-popup :icon="el.name" />
      </div>
      <div class="sidebar-popup-list__content">
        <h4>
          {{ el.name }}
        </h4>
        <p v-if="el.style">
          <span>
            {{ el.style }}
          </span>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.99999 9.42017C2.89246 9.42017 2.78494 9.37911 2.70295 9.29717L0.123085 6.71727C-0.0410284 6.55316 -0.0410284 6.28708 0.123085 6.12303C0.287132 5.95898 0.553161 5.95898 0.717287 6.12303L2.99999 8.40587L5.2827 6.12311C5.44682 5.95906 5.71282 5.95906 5.87685 6.12311C6.04105 6.28716 6.04105 6.55324 5.87685 6.71735L3.29702 9.29725C3.215 9.37921 3.10748 9.42017 2.99999 9.42017Z"
              fill="#949CAD"
            />
            <path
              d="M2.99999 -4.57764e-05C2.89246 -4.57764e-05 2.78494 0.0410125 2.70296 0.122956L0.123085 2.70285C-0.0410284 2.86697 -0.0410284 3.13305 0.123085 3.2971C0.287132 3.46114 0.553161 3.46114 0.717288 3.2971L2.99999 1.01426L5.28271 3.29702C5.44682 3.46106 5.71282 3.46106 5.87685 3.29702C6.04105 3.13297 6.04105 2.86689 5.87685 2.70277L3.29702 0.122876C3.215 0.0409194 3.10748 -4.57764e-05 2.99999 -4.57764e-05Z"
              fill="#949CAD"
            />
          </svg>
        </p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import IconPopup from '../utils/Icon.vue';
import { mapState } from 'vuex';
import { AddElementPopupData } from '../types';

export default Vue.extend({
  components: {
    IconPopup
  },
  name: 'AddElementPopup',
  data: () => ({}),
  computed: {
    ...mapState({
      popupData: (state: any) => <AddElementPopupData>state.editor.popupSettings.data,
      selectedBlocks: (state: any) => state.editor.selectedBlocks,
      userConfig: (state: any) => state.editor.userConfig
    }),
    defaultBlock(): any {
      return this.userConfig.components[0];
    }
  },
  methods: {
    addElementToConfig(el: string) {
      this.$store.commit('editor/changeInsertElementTo', {
        ...(this.selectedBlocks.length === 0 ? { block: this.defaultBlock } : { block: this.selectedBlocks[0] }),
        element: el.toLowerCase()
      });
      this.$store.commit('editor/changeEditorParam', {
        path: 'isInserting',
        value: true
      });
      this.$store.commit('editor/SET_POPUP_SETTINGS', { active: false });
    }
  }
});
</script>

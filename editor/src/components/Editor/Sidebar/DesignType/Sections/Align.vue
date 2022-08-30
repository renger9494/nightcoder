<template>
  <div class="align-buttons">
    <square-icon-btn
      v-for="(btn, index) in alignBtns"
      :key="index"
      :icon-settings="btn.icon"
      @click="changeElementsAlign(btn.alignValue)"
      v-tooltip="btn.tooltip"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import ALIGN from '@/constants/align';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
const alignBtns = [
  {
    icon: {
      name: 'align-left',
      width: '24',
      height: '24'
    },
    alignValue: ALIGN.LEFT,
    tooltip: 'Align left'
  },
  {
    icon: {
      name: 'align-horizontal-centers-icon',
      width: '24',
      height: '24'
    },
    alignValue: ALIGN.HORIZONTAL_CENTERS,
    tooltip: 'Align horizontal centers'
  },
  {
    icon: {
      name: 'align-right-icon',
      width: '24',
      height: '24'
    },
    alignValue: ALIGN.RIGHT,
    tooltip: 'Align right'
  },
  {
    icon: {
      name: 'align-top-icon',
      width: '24',
      height: '24'
    },
    alignValue: ALIGN.TOP,
    tooltip: 'Align top'
  },
  {
    icon: {
      name: 'align-vertical-centers-icon',
      width: '24',
      height: '24'
    },
    alignValue: ALIGN.VERTICAL_CENTERS,
    tooltip: 'Align vertical centers'
  },
  {
    icon: {
      name: 'align-bottom-icon',
      width: '24',
      height: '24'
    },
    alignValue: ALIGN.BOTTOM,
    tooltip: 'Align bottom'
  }
];

export default Vue.extend({
  components: { SquareIconBtn },
  computed: {
    ...mapState({
      selectedElements: (state: any) => state.editor.selectedElements
    })
  },
  data() {
    return {
      alignBtns
    };
  },
  methods: {
    changeElementsAlign(type: number) {
      if (this.selectedElements.length > 1) {
        this.$store.commit('editor/alignElements', { type });
      } else if (this.selectedElements.length == 1) {
        this.$store.commit('editor/alignElementToParent', { type });
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.align-buttons {
  display: flex;
  justify-content: space-between;
}
</style>

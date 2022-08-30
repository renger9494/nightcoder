<template>
  <div>
    <span v-for="(snap, index) in snaps" :key="index" :class="snap.classes" :style="snap.style">
      <span class="distance-to-parent__text"> {{ snap.distanceToBlock }} </span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { isSafari } from '@/helpers/miscellaneous';

export default Vue.extend({
  name: 'SnapToBlock',
  props: {
    elementId: {
      type: String,
      required: true
    },
    blockId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      blockOffsetTop: 0
    };
  },
  computed: {
    ...mapState({ zoom: (state: any) => state.editor.zoom }),
    snaps(): any[] {
      const element = document.getElementById(this.elementId);
      const block = document.getElementById(this.blockId);
      if (!element || !block) return [];
      const top = element.offsetTop;
      const left = element.offsetLeft;
      const right = block.offsetWidth - element.offsetWidth - element.offsetLeft;
      const bottom = block.offsetHeight - element.offsetHeight - element.offsetTop;

      // Паддинг вокруг editor-area его нужно учитывать для позиционирования снапов
      // возможно можно будет избежать этого перенеся использование компонента snapToBlock в другое место
      const editorAreaPaddings = 0;
      const fontSize = `${12 / this.zoom}px`;
      return [
        {
          style: {
            'font-size': fontSize,
            height: `${top}px`,
            left: `${left + editorAreaPaddings + element.clientWidth / 2}px`,
            top: `${this.blockOffsetTop}px`
          },
          distanceToBlock: Math.round(top),
          classes: 'distance-to-parent top'
        },
        {
          style: {
            'font-size': fontSize,
            width: `${right}px`,
            top: `${top + element.clientHeight / 2 + this.blockOffsetTop}px`,
            left: `${left + editorAreaPaddings + element.clientWidth}px`
          },
          distanceToBlock: Math.round(right),
          classes: 'distance-to-parent right'
        },
        {
          style: {
            'font-size': fontSize,
            height: `${bottom}px`,
            top: `${top + element.clientHeight + this.blockOffsetTop}px`,
            left: `${left + editorAreaPaddings + element.clientWidth / 2}px`
          },
          distanceToBlock: Math.round(bottom),
          classes: 'distance-to-parent bottom'
        },
        {
          style: {
            'font-size': fontSize,
            width: `${left}px`,
            top: `${top + element.clientHeight / 2 + this.blockOffsetTop}px`,
            left: `${editorAreaPaddings}px`
          },
          distanceToBlock: Math.round(left),
          classes: 'distance-to-parent left'
        }
      ];
    }
  },
  mounted() {
    const block = document.getElementById(this.blockId);
    const editor = document.getElementById('editor');

    if (!block || !editor) {
      console.warn('[snapToBlock]: not found editor or block');
      return;
    }

    this.blockOffsetTop = isSafari() ? block.offsetTop - editor.offsetTop : block.offsetTop;
  }
});
</script>

<style lang="scss" scoped>
.distance-to-parent {
  display: flex;
  background: #fa4141;
  position: absolute;
  color: #fa4141;
  z-index: 100;
  text-align: center;
}

.distance-to-parent__text {
  padding: 2px 6px;
  border-radius: $shape_border_radius;
  background-color: #fa4141;
  color: #fbfbfb;

  font-style: normal;
  font-weight: normal;
}

.distance-to-parent.top {
  & .distance-to-parent__text {
    margin-left: 6px;
  }

  left: calc(50% - 0.5px);
  align-items: center;
  justify-content: right;
  width: 1px;
}

.distance-to-parent.right {
  & .distance-to-parent__text {
    margin-bottom: 6px;
  }

  top: calc(50% - 0.5px);
  left: 100%;
  align-items: flex-end;
  justify-content: center;
  height: 1px;
}

.distance-to-parent.bottom {
  & .distance-to-parent__text {
    margin-left: 6px;
  }

  top: 100%;
  left: calc(50% - 0.5px);
  align-items: center;
  justify-content: right;
  width: 1px;
}

.distance-to-parent.left {
  & .distance-to-parent__text {
    margin-bottom: 6px;
  }

  top: calc(50% - 0.5px);
  right: 100%;
  align-items: flex-end;
  justify-content: center;
  height: 1px;
}
</style>

<template>
  <selection-drag-area
    :active="true"
    :className="'multiselection-drag-area'"
    :h="height ? height : data.h"
    :parent="false"
    :resizable="false"
    :w="width ? width : data.w"
    :x="left ? left : data.x"
    :y="top ? top : data.y"
    :z="0"
    :id="id"
    @mouseenter="handleAreaMouseEnter"
    @mouseleave="handleAreaMouseLeave"
    @dragging="handleAreaDragging"
    @dragstop="handleAreaDragStop"
  >
    <div :class="{ hidden: hidden }" :style="{ width: '100%', height: '100%' }" class="multiselection-area">
      <div
        :style="`transform: scale(${1 / zoom}) translate(0px, ${1 / zoom}px)`"
        class="element-size multiselection-area-size"
      >
        <div class="element-size__inner">
          <span>{{ data.w }}</span> x <span>{{ data.h }}</span>
        </div>
      </div>
    </div>
  </selection-drag-area>
</template>

<script lang="ts">
import { computed, reactive, watch, defineComponent, PropType } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers';

import SelectionDragArea from '@/components/Editor/Elements/SelectionDragArea/index.vue';
import { getId } from '@/helpers/randomString';
import { useAnchorPoints } from '@/hooks/editor/anchorPoints.hook';
import { ElementLocation } from '@/src/store/elements/changeLocation';

export default defineComponent({
  name: 'MultiselectionArea',
  components: {
    'selection-drag-area': SelectionDragArea
  },
  props: {
    top: { type: Number, default: undefined },
    left: { type: Number, default: undefined },
    width: { type: Number, default: undefined },
    height: { type: Number, default: undefined },
    hidden: { type: Boolean, default: true },
    id: { type: String, default: `msa-${getId()}` },
    // Значение zoom холста редактора
    zoom: {
      type: Number,
      required: true,
      default: 1
    },
    isShiftPressed: {
      required: true,
      type: Boolean,
      default: false
    },
    elements: { type: Array as PropType<any[]>, default: () => [] }
  },
  setup(props, { root, emit }) {
    const data = reactive({
      dragging: false,

      w: 0,
      h: 0,
      x: 0,
      y: 0,

      startX: null as number | null,
      startY: null as number | null,
      dragDirection: null as string | null
    });

    const { useState } = createNamespacedHelpers(root.$store, 'editor');
    const { previewMode } = useState(['previewMode']);
    const anchorPoints = computed(() => [
      { x: data.x, y: data.y },
      { x: data.x + data.w, y: data.y },
      { x: data.x + data.w, y: data.y + data.h },
      { x: data.x, y: data.y + data.h },
      { x: data.x + Math.round(data.w / 2), y: data.y },
      { x: data.x + Math.round(data.w / 2), y: data.y + data.h },
      { x: data.x, y: data.y + Math.round(data.h / 2) },
      { x: data.x + data.w, y: data.y + Math.round(data.h / 2) },
      { x: data.x + Math.round(data.w / 2), y: data.y + data.h },
      {
        x: data.x + Math.round(data.w / 2),
        y: data.y + Math.round(data.h / 2)
      }
    ]);
    const blockId = computed(() => props.elements && props.elements.length && props.elements[0].parentId);
    useAnchorPoints({ element: { id: props.id, parentId: blockId.value }, store: root.$store, anchorPoints });

    // Установка размеров и стилей рамки
    function setMultiselectionStyles() {
      if (props.elements.length == 0) return;

      const { x, y, w, h } = props.elements[0].location[previewMode.value];

      const point = {
        left: x,
        top: y,
        width: x + w,
        height: y + h
      };

      for (const el of props.elements.slice(1)) {
        const elementLocation = el.location[previewMode.value] as ElementLocation;

        if (elementLocation.x < point.left) {
          //поиск left точки
          point.left = elementLocation.x;
        }

        if (elementLocation.y < point.top) {
          //поиск top точки
          point.top = elementLocation.y;
        }

        if (elementLocation.x + elementLocation.w > point.width) {
          point.width = elementLocation.x + elementLocation.w;
        }

        if (elementLocation.y + elementLocation.h > point.height) {
          point.height = elementLocation.y + elementLocation.h;
        }
      }

      data.w = Math.round(point.width - point.left);
      data.h = Math.round(point.height - point.top);
      data.x = Math.round(point.left);
      data.y = Math.round(point.top);

      root.$nextTick(() => {
        emit('msaLocation', { x: data.x, y: data.y, w: data.w, h: data.h });
      });
    }

    watch(
      () => props.elements,
      () => setMultiselectionStyles(),
      { deep: true }
    );
    watch(
      () => previewMode.value,
      () => setMultiselectionStyles()
    );

    function handleAreaDragging(xArea: number, yArea: number) {
      let newLeft = 0;
      let newTop = 0;

      if (data.startX === null && data.startY === null) {
        data.startX = xArea;
        data.startY = yArea;
      }

      if (props.isShiftPressed) {
        const xDiff = xArea - (data.startX ?? 0);
        const yDiff = yArea - (data.startY ?? 0);

        if (data.dragDirection === null) {
          if (xDiff >= 0 && yDiff >= 0) {
            data.dragDirection = xDiff > yDiff ? 'left' : 'top';
          } else if (xDiff <= 0 && yDiff <= 0) {
            data.dragDirection = xDiff < yDiff ? 'left' : 'top';
          }
        }

        if (data.dragDirection === 'top') {
          newLeft = 0;
          newTop = yDiff;
        } else if (data.dragDirection === 'left') {
          newTop = 0;
          newLeft = xDiff;
        }
      } else {
        newLeft = xArea - (data.startX ?? 0);
        newTop = yArea - (data.startY ?? 0);
      }
      data.dragging = true;
      emit('areaDragging', {
        left: newLeft,
        top: newTop,
        elements: props.elements,
        id: props.id,
        w: data.w,
        h: data.h
      });
    }

    function handleAreaDragStop(xArea: number, yArea: number, e: any) {
      let newLeft = xArea - (data.startX ?? 0);
      let newTop = yArea - (data.startY ?? 0);

      if (data.startX !== null && data.startY !== null) {
        root.$nextTick(() => {
          data.dragging = false;
          const clientX = e.clientX;
          const clientY = e.clientY;

          if (props.isShiftPressed && data.dragDirection) {
            if (data.dragDirection === 'top') {
              newLeft = 0;
            } else if (data.dragDirection === 'left') {
              newTop = 0;
            }

            emit('areaDragstop', {
              left: xArea,
              top: yArea,
              xAreaDiff: newLeft,
              yAreaDiff: newTop,
              elements: props.elements,
              id: props.id,
              w: data.w,
              h: data.h,
              clientX,
              clientY
            });
          } else {
            emit('areaDragstop', {
              left: xArea,
              top: yArea,
              xAreaDiff: newLeft,
              yAreaDiff: newTop,
              elements: props.elements,
              id: props.id,
              w: data.w,
              h: data.h,
              clientX,
              clientY
            });
          }
          data.startX = null;
          data.startY = null;
          data.dragDirection = null;
        });
      }
    }

    setMultiselectionStyles();

    function handleAreaMouseEnter() {
      emit('mouseenter');
    }

    function handleAreaMouseLeave() {
      emit('mouseleave');
    }

    return {
      data,
      handleAreaDragStop,
      handleAreaDragging,
      handleAreaMouseEnter,
      handleAreaMouseLeave
    };
  }
});
</script>

<style lang="scss">
.multiselection-drag-area {
  z-index: 9999 !important;
}
.multiselection-area {
  position: absolute;
  z-index: 9999;
  background: transparent;
  border-radius: 0.1em;
  outline: 2px solid rgba(98, 155, 255, 0.81);
}

.element-size {
  display: none;
  position: absolute;
  bottom: -22px;
  justify-content: center;
  width: 100%;
  &__inner {
    display: inline;
    white-space: nowrap;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    color: #ffffff;
    background: #318bf5;
    border-radius: 4px;
    padding: 2px 6px;
  }
  &.multiselection-area-size {
    display: flex;
  }
}

.hidden {
  visibility: hidden;
}
</style>

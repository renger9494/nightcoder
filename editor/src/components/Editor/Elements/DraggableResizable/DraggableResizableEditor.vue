<template>
  <div
    v-if="!data.hideElement"
    ref="vdrElement"
    v-mouseup-outside="mouseupOutsideHandler"
    :class="[
      {
        [classNameActive]: data.isSelected && !data.isAreaDragging && !dragging, //класс, активирующий рамку
        [classNameDragging]: dragging,
        [classNameResizing]: resizing,
        [classNameDraggable]: draggable,
        [classNameResizable]: resizable,
        [classNameLocked]: data.isElementLocked,
        dragging,
        editable: data.isInteractionsBlocked,
        widthauto: widthauto, //width: auto
        heightauto: resizingWidth || heightauto || widthauto //height: auto
      },
      className
    ]"
    :style="style"
    @click="onClickHandler"
    @mousedown="mouseDownHandler"
    @mouseenter="mouseEnterHandler"
    @mouseleave="mouseLeaveHandler"
    @mouseup="mouseUpHandler"
    @touchstart="touchDownHandler"
  >
    <template v-if="!data.hideSelection">
      <div :style="elementSizeLabelStyle" class="element-size">
        <div class="element-size__inner">
          <span>{{ width }}</span> x <span>{{ height }}</span>
        </div>
      </div>
      <div
        v-for="actualHandle in componentHandles"
        :key="actualHandle"
        :class="[classNameHandle, `${classNameHandle}-${actualHandle}`]"
        :style="getHandleStyle(actualHandle)"
        @mousedown.stop.prevent="handleMouseDownHandler(actualHandle, $event)"
        @touchstart.stop.prevent="handleTouchDownHandler(actualHandle, $event)"
      >
        <div
          v-if="textHandlerCondition"
          :class="[`${data.elementType}-${actualHandle}`]"
          :style="textHandlerStyle"
        ></div>
        <slot :name="actualHandle" />
      </div>
    </template>
    <slot />
  </div>
</template>

<script lang="ts">
/**
 * нативные хелперы для навешивания обработчиков на ивенты,
 * в файле ивенты навешиваются только на documentElement,
 * не знаю зачем этот хелпер вообще решили использовать,
 * я бы удалил и обычными методами пользовался, хз, надо тестить
 */
import { addEvent, removeEvent } from './utils/dom';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  defineComponent,
  PropType
} from '@vue/composition-api';
import { isNil } from 'lodash';

// константы как раз для работы с ивентами, удалить
const events = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup',
    over: 'mouseover'
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  }
};

let eventsFor: any = events.mouse;

/**
 * Таймаут в мс. Если dragging элемента длился меньше этого времени считается что поизошёл click
 */
const DRAG_TIMEOUT = 100;

export default defineComponent({
  replace: true,
  name: 'DraggableResizableEditor',
  emits: [
    'location',
    'mouseenter',
    'mouseleave',
    'touchdown',
    'mousedown',
    'mouseup',
    'size',
    'dblclick',
    'click',
    'dragging',
    'dragstop',
    'resizing',
    'changesize',
    'fontchangeend'
  ],
  props: {
    data: {
      type: Object,
      default: require
    },
    // т.к. у нас компонент используется один раз в цикле, все классы можно задавать хардкодом внутри, параметры удалить
    className: {
      type: String,
      default: 'vdr'
    },
    classNameDraggable: {
      type: String,
      default: 'draggable'
    },
    classNameResizable: {
      type: String,
      default: 'resizable'
    },
    classNameLocked: {
      type: String,
      default: 'locked'
    },
    classNameDragging: {
      type: String,
      default: 'dragging'
    },
    classNameResizing: {
      type: String,
      default: 'resizing'
    },
    classNameActive: {
      type: String,
      default: 'active'
    },
    classNameHandle: {
      type: String,
      default: 'handle'
    },
    draggable: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { root, emit }) {
    /*******************************************************************
     * Data
     ********************************************************************/
    const data = reactive({
      /**
       * флаг направления драга, активируется по драгу с зажатым шифтов
       * высчитывается по первым попиксельным сдвигам
       * ( начинаем драгать вверх/вниз с зажатым шифтов - драг влево/вправо блочится до конца драга)
       */
      dragDirection: null as null | string,

      /**
       * Время начала драга(dragstart) нужно для различия быстрого click с небольшим смещением элемента
       * и перетакивания элемента
       */
      dragStartMoment: null as null | Date,

      /**
       * property to enable autoheight, autowidth and fixed
       */
      widthauto: false,
      /**
       * property to enable autoheight, autowidth and fixed
       */
      heightauto: false,
      /**
       * property to enable height: auto, when user resize an element to show borders by content of element
       */
      resizingWidth: false,

      // Координаты левого верхнего и правого нижнего угла
      left: props.data.x,
      top: props.data.y,
      right: props.data.w + props.data.x,
      bottom: props.data.h + props.data.y,

      // флаг, тянется ли какой-то хендлер
      handle: null as null | string,

      resizing: false,
      dragging: false,
      mouseClickPosition: {} as any,
      isMouseOver: false as boolean
    });

    const vdrElement = ref(null as null | HTMLDivElement);

    /**************************************************************************
     * Lifecycle hooks
     * */
    resetBoundsAndMouseState();

    onMounted(() => {
      addEvent(document.documentElement, eventsFor.stop, globalMouseup);
    });

    onBeforeUnmount(() => {
      removeEvent(document.documentElement, 'mousemove', move);
      removeEvent(document.documentElement, 'mouseup', globalMouseup);
      removeEvent(document.documentElement, 'touchmove', move);
    });

    /*************************************************************************
     * Computed
     */
    const style = computed(() => {
      const outlineWidth = props.data.isSelected ? 1.5 : 2;
      return {
        position: 'absolute',
        ...(props.data.yaxisAlign
          ? props.data.yaxisAlign
          : { top: (props.data.priorityLocation.y !== null ? props.data.priorityLocation.y : data.top) + 'px' }),
        ...(props.data.xaxisAlign
          ? props.data.xaxisAlign
          : { left: (props.data.priorityLocation.x !== null ? props.data.priorityLocation.x : data.left) + 'px' }),
        width: width.value + 'px',
        height: height.value + 'px',
        zIndex: props.data.z,
        transform: `rotate(${props.data.a}deg)`,
        outline:
          props.data.isEditor &&
          !data.dragging &&
          !props.data.isAreaDragging &&
          (data.isMouseOver || props.data.isSelected)
            ? `${outlineWidth / props.data.zoom}px solid #318BF5`
            : ''
      };
    });

    const resizeDirection = computed(() => {
      const direction = {
        top: false,
        right: false,
        bottom: false,
        left: false,
        get isOnlyOne() {
          if (!data.handle) return false;
          return ['tbr', 'rbr', 'bbr', 'lbr'].includes(data.handle);
        }
      };

      if (!data.handle) return direction;

      if (['tl', 'tr', 'tbr'].includes(data.handle)) direction.top = true;
      if (['tr', 'rbr', 'br'].includes(data.handle)) direction.right = true;
      if (['br', 'bbr', 'bl'].includes(data.handle)) direction.bottom = true;
      if (['tl', 'lbr', 'bl'].includes(data.handle)) direction.left = true;

      return direction;
    });

    const aspectRatioLeader = computed(() => (props.data.h > props.data.w ? 'height' : 'width'));

    const width = computed(() => {
      const newHeight = data.bottom - data.top;
      let newWidth = data.right - data.left;
      // proportion;
      if (props.data.isEnableProportionDuringResize && props.data.isShiftPressed && data.resizing) {
        // Если ресайзим за верх или низ
        if ((resizeDirection.value.top || resizeDirection.value.bottom) && resizeDirection.value.isOnlyOne)
          newWidth = Math.round((newHeight * props.data.w) / props.data.h);
        // Если ресайзим за угол
        if (!resizeDirection.value.isOnlyOne) {
          newWidth =
            aspectRatioLeader.value === 'width' ? newWidth : Math.round((newHeight * props.data.w) / props.data.h);
        }
      }
      return Math.round((newWidth > 0 ? newWidth : 0) * 100) / 100;
    });

    const height = computed(() => {
      let newHeight = data.bottom - data.top;
      const newWidth = data.right - data.left;
      //proportion
      if (props.data.isEnableProportionDuringResize && props.data.isShiftPressed && data.resizing) {
        // Если ресайзим за левый или правый бордер
        if ((resizeDirection.value.right || resizeDirection.value.left) && resizeDirection.value.isOnlyOne)
          newHeight = Math.round((newWidth * props.data.h) / props.data.w);
        // Если ресайзим за угол
        if (!resizeDirection.value.isOnlyOne) {
          newHeight =
            aspectRatioLeader.value === 'height' ? newHeight : Math.round((newWidth * props.data.h) / props.data.w);
        }
      }
      return Math.round((newHeight > 0 ? newHeight : 0) * 100) / 100;
    });

    const textHandlerCondition = computed(() => props.data.isOnlyXHandles && props.data.h > 15);

    const textHandlerStyle = computed(() => `transform: scale(${1 / props.data.zoom}) translate(-50%, -50%);`);

    const componentHandles = computed(() => (props.data.isTextEditing ? [] : props.data.handles));

    /***************************************************************************************
     * Watch
     * */

    /**
     * при смене режима выравнивания по оси x
     * переопределяем координаты фактическими
     */
    watch(
      () => props.data.xaxisAlign,
      val => {
        if (val && val.right === '0px') {
          root.$nextTick(() => {
            emit('location', { x: vdrElement.value?.offsetLeft, y: vdrElement.value?.offsetTop });
          });
        }
      },
      { immediate: true }
    );

    /**
     * при смене режима выравнивания по оси у
     * переопределяем координаты фактическими
     */
    watch(
      () => props.data.yaxisAlign,
      val => {
        if (val && val.bottom === '0px') {
          root.$nextTick(() => {
            emit('location', { x: vdrElement.value?.offsetLeft, y: vdrElement.value?.offsetTop });
          });
        }
      },
      { immediate: true }
    );

    function proceedPropXChange() {
      data.left = props.data.x;
      data.right = props.data.x + props.data.w;
    }

    watch(
      () => {
        return props.data.x && isNil(props.data.priorityLocation.x);
      },
      () => {
        proceedPropXChange();
      },
      { immediate: true }
    );

    watch(
      () => {
        return props.data.x;
      },
      () => {
        proceedPropXChange();
      },
      { immediate: true }
    );

    function proceedPropYChange() {
      data.top = props.data.y;
      data.bottom = props.data.y + props.data.h;
    }

    watch(
      () => {
        return props.data.y && isNil(props.data.priorityLocation.y);
      },
      () => {
        proceedPropYChange();
      },
      { immediate: true }
    );

    watch(
      () => {
        return props.data.y;
      },
      () => {
        proceedPropYChange();
      },
      { immediate: true }
    );

    watch(
      () => props.data.w,
      () => {
        data.right = props.data.w + props.data.x;
      },
      { immediate: true }
    );

    watch(
      () => props.data.h,
      () => {
        data.bottom = props.data.h + props.data.y;
      },
      { immediate: true }
    );

    function mouseEnterHandler() {
      if (props.data.isElementLocked) return;
      data.isMouseOver = true;
      emit('mouseenter');
    }

    function mouseLeaveHandler() {
      if (props.data.isElementLocked) return;
      data.isMouseOver = false;
      emit('mouseleave');
    }

    //for recalculating size when textBoxStyle is autowidth or autoheight
    watch(
      () => props.data.resizeImmediately,
      val => {
        if (val) {
          calculateAutoSize();
        }
      }
    );
    // recalculating size of VDR when loading new font type
    watch(
      () => props.data,
      val => {
        if (val.isFontRendered) {
          calculateAutoSize();
          root.$nextTick(() => {
            emit('fontchangeend');
          });
        }
      }
    );

    /**
     * Задаем элементу авто ширину или высоту,
     * берем offset параметр
     * ( + 1, без дополнительной единицы иногда текст слетает на след строку )
     * и коммитим скалькулированную авто ширину\высоту
     */
    function calculateAutoSize() {
      if (!props.data.wAuto && !props.data.hAuto && !data.widthauto && !data.heightauto) return;

      if (props.data.hAuto && !props.data.wAuto) {
        data.heightauto = true;
        root.$nextTick(() => {
          emit('changesize', { h: vdrElement.value?.offsetHeight ?? 0, resizeImmediately: false });
          // console.log('calculateAutoSize hAuto', { h: vdrElement.value.offsetHeight + 1 });
        });
      }

      setTimeout(() => {
        data.widthauto = false;
        data.heightauto = false;
      }, 400);
    }

    function globalMouseup(e: any) {
      mouseUpHandler(e);
      removeEvent(document.documentElement, eventsFor.move, move);
    }

    function resetBoundsAndMouseState() {
      data.mouseClickPosition = {
        mouseX: 0,
        mouseY: 0,
        x: 0,
        y: 0,
        w: 0,
        h: 0
      };
    }

    const mouseupOutsideHandler = (e: any) => {
      if (data.dragging) onClickHandler(e);
      if (data.resizing) onClickHandler(e);
    };

    const onClickHandler = (e: any) => {
      if (props.data.isElementLocked) return;
      if (!props.data.isInteractionsBlocked) {
        emit('mouseup');
        // Убираем точки
        data.handle = null;

        resetBoundsAndMouseState();

        removeEvent(document.documentElement, eventsFor.move, move);
        if (data.resizing) {
          const heightToSave =
            props.data.isOnlyXHandles && props.data.hAuto ? vdrElement.value?.offsetHeight : height.value;
          emit('changesize', { w: width.value, h: heightToSave, x: data.left, y: data.top });
          data.resizing = false;
          data.resizingWidth = false;
          return;
        }
        if (data.dragging) {
          resetDraggingData();
          const xDiff = data.left - props.data.x;
          const yDiff = data.top - props.data.y;
          const clientX = e.clientX;
          const clientY = e.clientY;
          emit('dragstop', { xDiff, yDiff, clientX, clientY });
          return;
        }
        emit('click');
      }
    };

    const resetDraggingData = () => {
      data.dragStartMoment = null;
      data.dragging = false;
      data.dragDirection = null;
    };

    // для мобилки
    const touchDownHandler = () => {
      if (props.data.isElementLocked) return;
      emit('touchdown');
    };

    const mouseDownHandler = (e: any) => {
      if (props.data.isElementLocked) return;
      if (!props.data.isInteractionsBlocked) {
        emit('mousedown');
        data.dragStartMoment = new Date();
        e.preventDefault();

        data.mouseClickPosition.mouseX = e.touches ? e.touches[0].pageX : e.pageX;
        data.mouseClickPosition.mouseY = e.touches ? e.touches[0].pageY : e.pageY;

        data.mouseClickPosition.left = data.left;
        data.mouseClickPosition.right = data.right;
        data.mouseClickPosition.top = data.top;
        data.mouseClickPosition.bottom = data.bottom;

        addEvent(document.documentElement, eventsFor.move, move);
      }
    };

    function handleTouchDownHandler(handle: string, e: any) {
      if (props.data.isElementLocked) return;
      eventsFor = events.touch;
      handleMouseDownHandler(handle, e);
    }

    function handleMouseDownHandler(handle: string, e: any) {
      if (props.data.isElementLocked) return;
      if (e.stopPropagation) e.stopPropagation();

      data.handle = handle;

      data.resizing = true;
      data.resizingWidth =
        (handle.includes('r') || handle.includes('l') || handle === 'lbr' || handle === 'rbr') &&
        (props.data.hAuto || props.data.wAuto);

      data.mouseClickPosition.mouseX = e.touches ? e.touches[0].pageX : e.pageX;
      data.mouseClickPosition.mouseY = e.touches ? e.touches[0].pageY : e.pageY;
      data.mouseClickPosition.left = data.left;
      data.mouseClickPosition.right = data.right;
      data.mouseClickPosition.top = data.top;
      data.mouseClickPosition.bottom = data.bottom;

      addEvent(document.documentElement, eventsFor.move, move);
    }

    function move(e: any) {
      if (data.resizing) {
        handleResizeMove(e);
      } else if (props.draggable) {
        if (data.dragging) {
          elementMove(e);
        } else {
          if (new Date().getTime() - (data.dragStartMoment?.getTime() ?? 0) > DRAG_TIMEOUT) {
            emit('dragstart');
            data.dragging = true;
            elementMove(e);
          }
        }
      }
    }

    function elementMove(e: any) {
      const mouseClickPosition = data.mouseClickPosition;

      const deltaX = Math.round(
        ((e.touches ? e.touches[0].pageX : e.pageX) - mouseClickPosition.mouseX) / props.data.zoom
      );
      const deltaY = Math.round(
        ((e.touches ? e.touches[0].pageY : e.pageY) - mouseClickPosition.mouseY) / props.data.zoom
      );

      if (props.data.isShiftPressed) {
        const xDiff = mouseClickPosition.left - deltaX - props.data.x;
        const yDiff = mouseClickPosition.top - deltaY - props.data.y;
        console.log(xDiff, yDiff);
        if (data.dragDirection === null) {
          if (xDiff >= 0 && yDiff >= 0) {
            data.dragDirection = xDiff > yDiff ? 'left' : 'top';
          } else if (xDiff <= 0 && yDiff <= 0) {
            data.dragDirection = xDiff < yDiff ? 'left' : 'top';
          }
        }

        if (data.dragDirection === 'top') {
          data.top = props.data.y + deltaY;
          data.bottom = data.top + props.data.h;
        } else if (data.dragDirection === 'left') {
          data.left = props.data.x + deltaX;
          data.right = data.left + props.data.w;
        }
      } else {
        data.top = props.data.y + deltaY;
        data.bottom = data.top + props.data.h;
        data.left = props.data.x + deltaX;
        data.right = data.left + props.data.w;
      }
      emit('dragging', {
        xDiff: data.left - props.data.x,
        yDiff: data.top - props.data.y,
        x: props.data.x,
        y: props.data.y,
        w: props.data.w,
        h: props.data.h
      });
    }
    //

    function handleResizeMove(e: any) {
      const mouseClickPosition = data.mouseClickPosition;

      const deltaX = Math.round(
        (mouseClickPosition.mouseX - (e.touches ? e.touches[0].pageX : e.pageX)) / props.data.zoom
      );
      const deltaY = Math.round(
        (mouseClickPosition.mouseY - (e.touches ? e.touches[0].pageY : e.pageY)) / props.data.zoom
      );

      // ресайз по Y только если
      // - не установлена авто высота
      // - не драгают за левый или правй бордер,
      // - ресайз не пропорциональный с ведущей шириной
      if (
        !props.data.hAuto &&
        data.handle &&
        !['rbr', 'lbr'].includes(data.handle) &&
        !(aspectRatioLeader.value === 'width' && props.data.isShiftPressed)
      ) {
        if (resizeDirection.value.bottom) {
          const newBottom = mouseClickPosition.bottom - deltaY;
          data.bottom = newBottom > props.data.y ? newBottom : props.data.y;
        } else if (resizeDirection.value.top) {
          const newTop = mouseClickPosition.top - deltaY;
          const bottom = props.data.y + props.data.h;
          data.top = newTop < bottom ? newTop : bottom;
        }
      }

      // ресайз по X только если
      // - не установлена авто ширины
      // - не драгают за верхний или нижний бордер,
      // - ресайз не пропорциональный с ведущей высотой
      if (
        !props.data.wAuto &&
        data.handle &&
        !['tbr', 'bbr'].includes(data.handle) &&
        !(aspectRatioLeader.value === 'height' && props.data.isShiftPressed)
      ) {
        if (resizeDirection.value.right) {
          const newRight = mouseClickPosition.right - deltaX;
          data.right = newRight > props.data.x ? newRight : props.data.x;
        } else if (resizeDirection.value.left) {
          const newLeft = mouseClickPosition.left - deltaX;
          const right = props.data.x + props.data.w;
          data.left = newLeft < right ? newLeft : right;
        }
      }

      data.right = data.left + width.value;
      data.bottom = data.top + height.value;

      emit('resizing', {
        left: data.left,
        top: data.top,
        width: width.value,
        height: height.value,
        resizeDirection: resizeDirection.value
      });
    }

    function mouseUpHandler(e: any) {
      if (props.data.isElementLocked) return;
    }

    const HANDLE_SIZE = 8;

    function getHandleStyle(handle: string) {
      const handleDimention = HANDLE_SIZE / (props.data.zoom > 2 ? 2 : props.data.zoom);
      const handleSizes = { width: `${handleDimention}px`, height: `${handleDimention}px` };
      let handleShift = `-${handleDimention / 2}px`;
      if (height.value <= HANDLE_SIZE * 2 || width.value <= HANDLE_SIZE * 2) {
        handleShift = `-${handleDimention}px`;
      }

      switch (handle) {
        case 'tl':
          return { top: handleShift, left: handleShift, ...handleSizes };
        case 'tr':
          return { top: handleShift, right: handleShift, ...handleSizes };
        case 'br':
          return { bottom: handleShift, right: handleShift, ...handleSizes };
        case 'bl':
          return { bottom: handleShift, left: handleShift, ...handleSizes };
      }
    }

    const elementSizeLabelStyle = computed(() => {
      return `transform: scale(${1 / props.data.zoom}) translate(0px, ${
        height.value > HANDLE_SIZE * 2 && width.value > HANDLE_SIZE * 2 ? 1 / props.data.zoom : 4 / props.data.zoom
      }px)`;
    });

    return {
      style,
      widthauto: computed(() => data.widthauto),
      heightauto: computed(() => data.heightauto),
      dragging: computed(() => data.dragging),
      resizing: computed(() => data.resizing),
      resizingWidth: computed(() => data.resizingWidth),
      width,
      height,
      vdrElement,
      elementSizeLabelStyle,
      textHandlerCondition,
      textHandlerStyle,
      componentHandles,
      mouseDownHandler,
      mouseUpHandler,
      touchDownHandler,
      onClickHandler,
      mouseEnterHandler,
      mouseLeaveHandler,
      handleMouseDownHandler,
      handleTouchDownHandler,
      mouseupOutsideHandler,
      getHandleStyle
    };
  }
});
</script>

<style lang="scss" scoped>
.vdr {
  touch-action: none;
  &.heightauto {
    height: auto !important;
  }
  &.widthauto {
    width: auto !important;
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
  }

  &.active {
    .element-size {
      display: flex;
    }
  }

  &:not(.active) .handle {
    display: none !important;
  }
  &.editable .contenteditable:after {
    content: none !important;
  }

  &.locked {
    pointer-events: none;
  }
}

.preview_mod .vdr:not(.active):hover {
  outline: none;
}
.vdr.active .contenteditable.touched,
.vdr.active .contenteditable:hover {
  outline: none !important;
}
.vdr.active .contenteditable:after {
  display: none !important;
  font-family: sans-serif;
  font-weight: normal;
  content: attr(label) ' ';
  position: absolute;
  left: 7px;
  top: -13px;
  line-height: 13px;
  background: #318bf5;
  font-size: 9px;
  padding: 0 2px;
  border-radius: 3px 3px 0 0;
  color: #fff;
  text-transform: capitalize;
  letter-spacing: normal;
  opacity: 1;
}

.handle {
  box-sizing: border-box;
  position: absolute;
  background: #ffffff;
  border: 1px solid #318bf5;
  box-sizing: border-box;
  display: block;
  border-radius: 1px;
  z-index: 999;
}

.handle-tl {
  cursor: -webkit-image-set(
        url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2407_19545)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.2417 5.88396L15.0805 14.7228L13.7547 16.0486L17.7322 16.4906L17.2902 12.5131L15.9644 13.8389L7.12558 5.00007L8.45141 3.67425L4.47393 3.23231L4.91587 7.20978L6.2417 5.88396Z' fill='black'/%3E%3Cpath d='M17.0074 12.2302L15.9644 13.2732L7.69127 5.00007L8.73425 3.95709L9.32274 3.3686L8.49558 3.27669L4.5181 2.83475L4.02116 2.77954L4.07638 3.27648L4.51832 7.25395L4.61023 8.08111L5.19872 7.49262L6.2417 6.44964L14.5148 14.7228L13.4719 15.7658L12.8834 16.3543L13.7105 16.4462L17.688 16.8881L18.185 16.9433L18.1297 16.4464L17.6878 12.4689L17.5959 11.6417L17.0074 12.2302Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2407_19545' x='0.568359' y='0.326782' width='21.0693' height='21.0693' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2407_19545'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2407_19545' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      )
      15 7,
    nw-resize;
  cursor: url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2407_19545)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.2417 5.88396L15.0805 14.7228L13.7547 16.0486L17.7322 16.4906L17.2902 12.5131L15.9644 13.8389L7.12558 5.00007L8.45141 3.67425L4.47393 3.23231L4.91587 7.20978L6.2417 5.88396Z' fill='black'/%3E%3Cpath d='M17.0074 12.2302L15.9644 13.2732L7.69127 5.00007L8.73425 3.95709L9.32274 3.3686L8.49558 3.27669L4.5181 2.83475L4.02116 2.77954L4.07638 3.27648L4.51832 7.25395L4.61023 8.08111L5.19872 7.49262L6.2417 6.44964L14.5148 14.7228L13.4719 15.7658L12.8834 16.3543L13.7105 16.4462L17.688 16.8881L18.185 16.9433L18.1297 16.4464L17.6878 12.4689L17.5959 11.6417L17.0074 12.2302Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2407_19545' x='0.568359' y='0.326782' width='21.0693' height='21.0693' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2407_19545'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2407_19545' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      15 7,
    nw-resize;
}

.handle-tr {
  cursor: -webkit-image-set(
        url("data:image/svg+xml,%3Csvg width='22' height='23' viewBox='0 0 22 23' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2407_19543)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.39744 15.3614L16.2363 6.52255L17.5621 7.84838L18.004 3.8709L14.0266 4.31285L15.3524 5.63867L6.51356 14.4775L5.18774 13.1517L4.74579 17.1292L8.72327 16.6872L7.39744 15.3614Z' fill='black'/%3E%3Cpath d='M13.7437 4.59569L14.7867 5.63867L6.51356 13.9118L5.47058 12.8688L4.88209 12.2803L4.79018 13.1075L4.34824 17.085L4.29303 17.5819L4.78997 17.5267L8.76744 17.0848L9.5946 16.9929L9.00611 16.4044L7.96313 15.3614L16.2363 7.08824L17.2793 8.13122L17.8678 8.71971L17.9597 7.89255L18.4016 3.91508L18.4568 3.41814L17.9599 3.47335L13.9824 3.91529L13.1552 4.0072L13.7437 4.59569Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2407_19543' x='0.840332' y='0.965393' width='21.0693' height='21.0693' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2407_19543'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2407_19543' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      )
      15 7,
    ne-resize;
  cursor: url("data:image/svg+xml,%3Csvg width='22' height='23' viewBox='0 0 22 23' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2407_19543)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.39744 15.3614L16.2363 6.52255L17.5621 7.84838L18.004 3.8709L14.0266 4.31285L15.3524 5.63867L6.51356 14.4775L5.18774 13.1517L4.74579 17.1292L8.72327 16.6872L7.39744 15.3614Z' fill='black'/%3E%3Cpath d='M13.7437 4.59569L14.7867 5.63867L6.51356 13.9118L5.47058 12.8688L4.88209 12.2803L4.79018 13.1075L4.34824 17.085L4.29303 17.5819L4.78997 17.5267L8.76744 17.0848L9.5946 16.9929L9.00611 16.4044L7.96313 15.3614L16.2363 7.08824L17.2793 8.13122L17.8678 8.71971L17.9597 7.89255L18.4016 3.91508L18.4568 3.41814L17.9599 3.47335L13.9824 3.91529L13.1552 4.0072L13.7437 4.59569Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2407_19543' x='0.840332' y='0.965393' width='21.0693' height='21.0693' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2407_19543'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2407_19543' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      15 7,
    ne-resize;
}

.handle-bl {
  cursor: -webkit-image-set(
        url("data:image/svg+xml,%3Csvg width='22' height='23' viewBox='0 0 22 23' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2407_19543)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.39744 15.3614L16.2363 6.52255L17.5621 7.84838L18.004 3.8709L14.0266 4.31285L15.3524 5.63867L6.51356 14.4775L5.18774 13.1517L4.74579 17.1292L8.72327 16.6872L7.39744 15.3614Z' fill='black'/%3E%3Cpath d='M13.7437 4.59569L14.7867 5.63867L6.51356 13.9118L5.47058 12.8688L4.88209 12.2803L4.79018 13.1075L4.34824 17.085L4.29303 17.5819L4.78997 17.5267L8.76744 17.0848L9.5946 16.9929L9.00611 16.4044L7.96313 15.3614L16.2363 7.08824L17.2793 8.13122L17.8678 8.71971L17.9597 7.89255L18.4016 3.91508L18.4568 3.41814L17.9599 3.47335L13.9824 3.91529L13.1552 4.0072L13.7437 4.59569Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2407_19543' x='0.840332' y='0.965393' width='21.0693' height='21.0693' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2407_19543'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2407_19543' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      )
      15 7,
    sw-resize;
  cursor: url("data:image/svg+xml,%3Csvg width='22' height='23' viewBox='0 0 22 23' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2407_19543)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.39744 15.3614L16.2363 6.52255L17.5621 7.84838L18.004 3.8709L14.0266 4.31285L15.3524 5.63867L6.51356 14.4775L5.18774 13.1517L4.74579 17.1292L8.72327 16.6872L7.39744 15.3614Z' fill='black'/%3E%3Cpath d='M13.7437 4.59569L14.7867 5.63867L6.51356 13.9118L5.47058 12.8688L4.88209 12.2803L4.79018 13.1075L4.34824 17.085L4.29303 17.5819L4.78997 17.5267L8.76744 17.0848L9.5946 16.9929L9.00611 16.4044L7.96313 15.3614L16.2363 7.08824L17.2793 8.13122L17.8678 8.71971L17.9597 7.89255L18.4016 3.91508L18.4568 3.41814L17.9599 3.47335L13.9824 3.91529L13.1552 4.0072L13.7437 4.59569Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2407_19543' x='0.840332' y='0.965393' width='21.0693' height='21.0693' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2407_19543'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2407_19543' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      15 7,
    sw-resize;
}

.handle-br {
  cursor: -webkit-image-set(
        url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2407_19545)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.2417 5.88396L15.0805 14.7228L13.7547 16.0486L17.7322 16.4906L17.2902 12.5131L15.9644 13.8389L7.12558 5.00007L8.45141 3.67425L4.47393 3.23231L4.91587 7.20978L6.2417 5.88396Z' fill='black'/%3E%3Cpath d='M17.0074 12.2302L15.9644 13.2732L7.69127 5.00007L8.73425 3.95709L9.32274 3.3686L8.49558 3.27669L4.5181 2.83475L4.02116 2.77954L4.07638 3.27648L4.51832 7.25395L4.61023 8.08111L5.19872 7.49262L6.2417 6.44964L14.5148 14.7228L13.4719 15.7658L12.8834 16.3543L13.7105 16.4462L17.688 16.8881L18.185 16.9433L18.1297 16.4464L17.6878 12.4689L17.5959 11.6417L17.0074 12.2302Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2407_19545' x='0.568359' y='0.326782' width='21.0693' height='21.0693' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2407_19545'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2407_19545' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      )
      15 7,
    se-resize;
  cursor: url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2407_19545)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.2417 5.88396L15.0805 14.7228L13.7547 16.0486L17.7322 16.4906L17.2902 12.5131L15.9644 13.8389L7.12558 5.00007L8.45141 3.67425L4.47393 3.23231L4.91587 7.20978L6.2417 5.88396Z' fill='black'/%3E%3Cpath d='M17.0074 12.2302L15.9644 13.2732L7.69127 5.00007L8.73425 3.95709L9.32274 3.3686L8.49558 3.27669L4.5181 2.83475L4.02116 2.77954L4.07638 3.27648L4.51832 7.25395L4.61023 8.08111L5.19872 7.49262L6.2417 6.44964L14.5148 14.7228L13.4719 15.7658L12.8834 16.3543L13.7105 16.4462L17.688 16.8881L18.185 16.9433L18.1297 16.4464L17.6878 12.4689L17.5959 11.6417L17.0074 12.2302Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2407_19545' x='0.568359' y='0.326782' width='21.0693' height='21.0693' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2407_19545'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2407_19545' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      15 7,
    se-resize;
}

.handle-tl,
.handle-tr,
.handle-bl,
.handle-br {
  z-index: 5;
  &:after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
  }
}

.handle {
  &-tl {
    &:after {
      left: -17px;
      top: -17px;
    }
  }
  &-tr {
    &:after {
      right: -17px;
      top: -17px;
    }
  }
  &-bl {
    &:after {
      left: -17px;
      bottom: -17px;
    }
  }
  &-br {
    &:after {
      right: -17px;
      bottom: -17px;
    }
  }
}

.text,
.form {
  &-rbr,
  &-lbr {
    position: absolute;
    width: 4px;
    height: 12px;
    background: $white;
    border-radius: 3px;
    top: 50%;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.35);
    outline: 1.5px solid #318bf5;
    transform-origin: 0 0;
  }

  &-rbr {
    left: 0;
  }
  &-lbr {
    right: -3px;
  }
}

.handle-bbr,
.handle-tbr,
.handle-lbr,
.handle-rbr {
  background: transparent;
  border: none;
}

.handle-bbr,
.handle-tbr {
  cursor: -webkit-image-set(
        url("data:image/svg+xml,%3Csvg width='15' height='29' viewBox='0 0 15 29' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2412_19552)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.125 19.625V7.125H10L7.5 4L5 7.125H6.875L6.875 19.625H5L7.5 22.75L10 19.625H8.125Z' fill='black'/%3E%3Cpath d='M5 7.525H6.475L6.475 19.225H5H4.16775L4.68765 19.8749L7.18765 22.9999L7.5 23.3903L7.81235 22.9999L10.3123 19.8749L10.8323 19.225H10H8.525V7.525H10H10.8323L10.3123 6.87512L7.81235 3.75012L7.5 3.35969L7.18765 3.75012L4.68765 6.87512L4.16775 7.525H5Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2412_19552' x='0.335449' y='0.71936' width='14.3291' height='27.3113' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2412_19552'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2412_19552' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      )
      15 7,
    ns-resize;
  cursor: url("data:image/svg+xml,%3Csvg width='15' height='29' viewBox='0 0 15 29' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_2412_19552)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.125 19.625V7.125H10L7.5 4L5 7.125H6.875L6.875 19.625H5L7.5 22.75L10 19.625H8.125Z' fill='black'/%3E%3Cpath d='M5 7.525H6.475L6.475 19.225H5H4.16775L4.68765 19.8749L7.18765 22.9999L7.5 23.3903L7.81235 22.9999L10.3123 19.8749L10.8323 19.225H10H8.525V7.525H10H10.8323L10.3123 6.87512L7.81235 3.75012L7.5 3.35969L7.18765 3.75012L4.68765 6.87512L4.16775 7.525H5Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_2412_19552' x='0.335449' y='0.71936' width='14.3291' height='27.3113' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2412_19552'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2412_19552' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      15 7,
    ns-resize;
  left: 0;
  height: 20px;
  width: 100%;
}

.handle-bbr {
  bottom: -20px;
}

.handle-tbr {
  top: -20px;
}

.handle-lbr {
  left: -20px;
}

.handle-rbr {
  right: -20px;
}

.handle-lbr,
.handle-rbr {
  cursor: -webkit-image-set(
      url("data:image/svg+xml,%3Csvg width='29' height='15' viewBox='0 0 29 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_654_7003)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.125 7.125H20.625V9L23.75 6.5L20.625 4V5.875H8.125V4L5 6.5L8.125 9V7.125Z' fill='black'/%3E%3Cpath d='M20.225 4V5.475H8.525V4V3.16775L7.87512 3.68765L4.75012 6.18765L4.35969 6.5L4.75012 6.81235L7.87512 9.31235L8.525 9.83225V9V7.525H20.225V9V9.83225L20.8749 9.31235L23.9999 6.81235L24.3903 6.5L23.9999 6.18765L20.8749 3.68765L20.225 3.16775V4Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_654_7003' x='0.719482' y='0.335449' width='27.311' height='14.3291' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_654_7003'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_654_7003' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
    ),
    15 7, ew-resize;
  cursor: url("data:image/svg+xml,%3Csvg width='29' height='15' viewBox='0 0 29 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_654_7003)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.125 7.125H20.625V9L23.75 6.5L20.625 4V5.875H8.125V4L5 6.5L8.125 9V7.125Z' fill='black'/%3E%3Cpath d='M20.225 4V5.475H8.525V4V3.16775L7.87512 3.68765L4.75012 6.18765L4.35969 6.5L4.75012 6.81235L7.87512 9.31235L8.525 9.83225V9V7.525H20.225V9V9.83225L20.8749 9.31235L23.9999 6.81235L24.3903 6.5L23.9999 6.18765L20.8749 3.68765L20.225 3.16775V4Z' stroke='white' stroke-width='0.8'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_654_7003' x='0.719482' y='0.335449' width='27.311' height='14.3291' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_654_7003'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_654_7003' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A")
      15 7,
    ew-resize;
  top: 0;
  height: 100%;
  width: 20px;
}

@media only screen and (max-width: 768px) {
  [class*='handle-']:before {
    content: '';
    left: -3px;
    right: -3px;
    bottom: -3px;
    top: -3px;
    position: absolute;
  }
}
</style>

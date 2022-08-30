<template>
  <div
    :style="style"
    :class="[
      {
        [classNameActive]: enabled,
        [classNameDragging]: dragging,
        [classNameResizing]: resizing,
        [classNameDraggable]: draggable,
        [classNameResizable]: resizable
      },
      className
    ]"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    @mousedown="elementDown"
    @touchstart="elementTouchDown"
  >
    <div
      v-for="handle in actualHandles"
      :key="handle"
      :class="[classNameHandle, classNameHandle + '-' + handle]"
      :style="{ display: enabled ? 'block' : 'none' }"
      @mousedown.stop.prevent="handleDown(handle, $event)"
      @touchstart.stop.prevent="handleTouchDown(handle, $event)"
    >
      <slot :name="handle"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { matchesSelectorToParentElements, addEvent, removeEvent } from './utils/dom';

const events = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  }
};

const userSelectNone = {
  userSelect: 'none',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  MsUserSelect: 'none'
};

const userSelectAuto = {
  userSelect: 'auto',
  MozUserSelect: 'auto',
  WebkitUserSelect: 'auto',
  MsUserSelect: 'auto'
};

let eventsFor = events.mouse;

export default Vue.extend({
  name: 'selection-drag-area',
  props: {
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
    disableUserSelect: {
      type: Boolean,
      default: true
    },
    enableNativeDrag: {
      type: Boolean,
      default: false
    },
    preventDeactivation: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    },
    lockAspectRatio: {
      type: Boolean,
      default: false
    },
    w: {
      type: Number,
      default: 200,
      validator: val => val >= 0
    },
    h: {
      type: Number,
      default: 200,
      validator: val => val >= 0
    },
    minWidth: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    minHeight: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    maxWidth: {
      type: Number,
      default: null,
      validator: val => val >= 0
    },
    maxHeight: {
      type: Number,
      default: null,
      validator: val => val >= 0
    },
    x: {
      type: Number,
      default: 0,
      validator: val => typeof val === 'number'
    },
    y: {
      type: Number,
      default: 0,
      validator: val => typeof val === 'number'
    },
    z: {
      type: [String, Number],
      default: 'auto',
      validator: val => (typeof val === 'string' ? val === 'auto' : val >= 0)
    },
    handles: {
      type: Array as PropType<string[]>,
      default: () => ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
      validator: (val: string[]) => {
        const s = new Set(['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']);

        return new Set(val.filter((h: string) => s.has(h))).size === val.length;
      }
    },
    dragHandle: {
      type: String,
      default: null
    },
    dragCancel: {
      type: String,
      default: null
    },
    axis: {
      type: String,
      default: 'both',
      validator: val => ['x', 'y', 'both'].includes(val)
    },
    grid: {
      type: Array as PropType<number[]>,
      default: () => [1, 1]
    },
    parent: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 1,
      validator: val => val > 0
    },
    onDragStart: {
      type: Function,
      default: null
    },
    onResizeStart: {
      type: Function,
      default: null
    }
  },

  data() {
    return {
      rawWidth: this.w,
      rawHeight: this.h,
      rawLeft: this.x,
      rawTop: this.y,
      rawRight: null as null | number,
      rawBottom: null as null | number,

      left: this.x,
      top: this.y,
      right: null as null | number,
      bottom: null as null | number,

      aspectFactor: this.w / this.h,

      parentWidth: null as null | number,
      parentHeight: null as null | number,

      minW: this.minWidth,
      minH: this.minHeight,

      maxW: this.maxWidth,
      maxH: this.maxHeight,

      handle: null as null | string,
      enabled: this.active,
      resizing: false,
      dragging: false,
      zIndex: this.z,
      mouseClickPosition: null as any,
      bounds: {
        minLeft: null as null | number,
        maxLeft: null as null | number,
        minRight: null as null | number,
        maxRight: null as null | number,
        minTop: null as null | number,
        maxTop: null as null | number,
        minBottom: null as null | number,
        maxBottom: null as null | number
      }
    };
  },

  created() {
    // eslint-disable-next-line
    if (this.maxWidth && this.minWidth > this.maxWidth)
      console.warn('[Vdr warn]: Invalid prop: minWidth cannot be greater than maxWidth');
    // eslint-disable-next-line
    if (this.maxWidth && this.minHeight > this.maxHeight)
      console.warn('[Vdr warn]: Invalid prop: minHeight cannot be greater than maxHeight');

    this.resetBoundsAndMouseState();
  },
  mounted() {
    if (!this.enableNativeDrag) {
      (<any>this.$el).ondragstart = () => false;
    }

    [this.parentWidth, this.parentHeight] = this.getParentSize();

    this.rawRight = (this.parentWidth ?? 0) - this.rawWidth - this.rawLeft;
    this.rawBottom = (this.parentHeight ?? 0) - this.rawHeight - this.rawTop;

    addEvent(document.documentElement, 'mousedown', this.deselect);
    addEvent(document.documentElement, 'touchend touchcancel', this.deselect);

    addEvent(window, 'resize', this.checkParentSize);
  },
  beforeDestroy() {
    removeEvent(document.documentElement, 'mousedown', this.deselect);
    removeEvent(document.documentElement, 'touchstart', this.handleUp);
    removeEvent(document.documentElement, 'mousemove', this.move);
    removeEvent(document.documentElement, 'touchmove', this.move);
    removeEvent(document.documentElement, 'mouseup', this.handleUp);
    removeEvent(document.documentElement, 'touchend touchcancel', this.deselect);

    removeEvent(window, 'resize', this.checkParentSize);
  },

  methods: {
    resetBoundsAndMouseState() {
      this.mouseClickPosition = {
        mouseX: 0,
        mouseY: 0,
        x: 0,
        y: 0,
        w: 0,
        h: 0
      };

      this.bounds = {
        minLeft: null,
        maxLeft: null,
        minRight: null,
        maxRight: null,
        minTop: null,
        maxTop: null,
        minBottom: null,
        maxBottom: null
      };
    },
    checkParentSize() {
      if (this.parent) {
        const [newParentWidth, newParentHeight] = this.getParentSize();

        const deltaX = (this.parentWidth ?? 0) - newParentWidth;
        const deltaY = (this.parentHeight ?? 0) - newParentHeight;

        this.rawRight = (this.rawRight ?? 0) - deltaX;
        this.rawBottom = (this.rawBottom ?? 0) - deltaY;

        this.parentWidth = newParentWidth;
        this.parentHeight = newParentHeight;
      }
    },
    getParentSize(): any {
      if (this.parent) {
        const style = window.getComputedStyle(<any>this.$el.parentNode, null);

        return [parseInt(style.getPropertyValue('width'), 10), parseInt(style.getPropertyValue('height'), 10)];
      }

      return [null, null];
    },
    elementTouchDown(e: any) {
      eventsFor = events.touch;

      this.elementDown(e);
    },
    elementDown(e: any) {
      const target = e.target || e.srcElement;

      if (this.$el.contains(target)) {
        if (this.onDragStart && this.onDragStart(e) === false) {
          return;
        }

        if (
          (this.dragHandle && !matchesSelectorToParentElements(target, this.dragHandle, this.$el)) ||
          (this.dragCancel && matchesSelectorToParentElements(target, this.dragCancel, this.$el))
        ) {
          return;
        }

        if (!this.enabled) {
          this.enabled = true;

          this.$emit('activated');
          this.$emit('update:active', true);
        }

        if (this.draggable) {
          this.dragging = true;
        }

        this.mouseClickPosition.mouseX = e.touches ? e.touches[0].pageX : e.pageX;
        this.mouseClickPosition.mouseY = e.touches ? e.touches[0].pageY : e.pageY;

        this.mouseClickPosition.left = this.left;
        this.mouseClickPosition.right = this.right;
        this.mouseClickPosition.top = this.top;
        this.mouseClickPosition.bottom = this.bottom;

        if (this.parent) {
          this.bounds = this.calcDragLimits();
        }

        addEvent(document.documentElement, eventsFor.move, this.move);
        addEvent(document.documentElement, eventsFor.stop, this.handleUp);
      }
    },
    calcDragLimits(): any {
      const parentWidth = this.parentWidth ?? 0;
      const parentHeight = this.parentHeight ?? 0;
      const right = this.right ?? 0;
      const bottom = this.bottom ?? 0;
      return {
        minLeft: (parentWidth + this.left) % this.grid[0],
        maxLeft: Math.floor((parentWidth - this.width - this.left) / this.grid[0]) * this.grid[0] + this.left,
        minRight: (parentWidth + right) % this.grid[0],
        maxRight: Math.floor((parentWidth - this.width - right) / this.grid[0]) * this.grid[0] + right,
        minTop: (parentHeight + this.top) % this.grid[1],
        maxTop: Math.floor((parentHeight - this.height - this.top) / this.grid[1]) * this.grid[1] + this.top,
        minBottom: (parentHeight + bottom) % this.grid[1],
        maxBottom: Math.floor((parentHeight - this.height - bottom) / this.grid[1]) * this.grid[1] + bottom
      };
    },
    deselect(e: any) {
      const target = e.target || e.srcElement;
      const regex = new RegExp(this.className + '-([trmbl]{2})', '');

      if (!this.$el.contains(target) && !regex.test(target.className)) {
        if (this.enabled && !this.preventDeactivation) {
          this.enabled = false;

          this.$emit('deactivated');
          this.$emit('update:active', false);
        }

        removeEvent(document.documentElement, eventsFor.move, this.handleMove);
      }

      this.resetBoundsAndMouseState();
    },
    handleTouchDown(handle: string, e: any) {
      eventsFor = events.touch;

      this.handleDown(handle, e);
    },
    handleDown(handle: string, e: any) {
      if (this.onResizeStart && this.onResizeStart(handle, e) === false) {
        return;
      }

      if (e.stopPropagation) e.stopPropagation();

      // Here we avoid a dangerous recursion by faking
      // corner handles as middle handles
      if (this.lockAspectRatio && !handle.includes('m')) {
        this.handle = 'm' + handle.substring(1);
      } else {
        this.handle = handle;
      }

      this.resizing = true;

      this.mouseClickPosition.mouseX = e.touches ? e.touches[0].pageX : e.pageX;
      this.mouseClickPosition.mouseY = e.touches ? e.touches[0].pageY : e.pageY;
      this.mouseClickPosition.left = this.left;
      this.mouseClickPosition.right = this.right;
      this.mouseClickPosition.top = this.top;
      this.mouseClickPosition.bottom = this.bottom;

      this.bounds = this.calcResizeLimits();

      addEvent(document.documentElement, eventsFor.move, this.handleMove);
      addEvent(document.documentElement, eventsFor.stop, this.handleUp);
    },
    calcResizeLimits() {
      let minW = this.minW;
      let minH = this.minH;
      let maxW = this.maxW;
      let maxH = this.maxH;

      const aspectFactor = this.aspectFactor;
      const [gridX, gridY] = this.grid;
      const width = this.width;
      const height = this.height;
      const left = this.left;
      const top = this.top;
      const right = this.right ?? 0;
      const bottom = this.bottom ?? 0;
      const parentWidth = this.parentWidth ?? 0;
      const parentHeight = this.parentHeight ?? 0;

      if (this.lockAspectRatio) {
        if (minW / minH > aspectFactor) {
          minH = minW / aspectFactor;
        } else {
          minW = aspectFactor * minH;
        }

        if (maxW && maxH) {
          maxW = Math.min(maxW, aspectFactor * maxH);
          maxH = Math.min(maxH, maxW / aspectFactor);
        } else if (maxW) {
          maxH = maxW / aspectFactor;
        } else if (maxH) {
          maxW = aspectFactor * maxH;
        }
      }

      maxW = maxW - (maxW % gridX);
      maxH = maxH - (maxH % gridY);

      const limits = {
        minLeft: null as null | number,
        maxLeft: 0,
        minTop: null as null | number,
        maxTop: 0,
        minRight: null as null | number,
        maxRight: 0,
        minBottom: null as null | number,
        maxBottom: 0
      };

      if (this.parent) {
        limits.minLeft = (parentWidth + left) % gridX;
        limits.maxLeft = left + Math.floor((width - minW) / gridX) * gridX;
        limits.minTop = (parentHeight + top) % gridY;
        limits.maxTop = top + Math.floor((height - minH) / gridY) * gridY;
        limits.minRight = (parentWidth + right) % gridX;
        limits.maxRight = right + Math.floor((width - minW) / gridX) * gridX;
        limits.minBottom = (parentHeight + bottom) % gridY;
        limits.maxBottom = bottom + Math.floor((height - minH) / gridY) * gridY;

        if (maxW) {
          limits.minLeft = Math.max(limits.minLeft, parentWidth - right - maxW);
          limits.minRight = Math.max(limits.minRight, parentWidth - left - maxW);
        }

        if (maxH) {
          limits.minTop = Math.max(limits.minTop, parentHeight - bottom - maxH);
          limits.minBottom = Math.max(limits.minBottom, parentHeight - top - maxH);
        }

        if (this.lockAspectRatio) {
          limits.minLeft = Math.max(limits.minLeft, left - top * aspectFactor);
          limits.minTop = Math.max(limits.minTop, top - left / aspectFactor);
          limits.minRight = Math.max(limits.minRight, right - bottom * aspectFactor);
          limits.minBottom = Math.max(limits.minBottom, bottom - right / aspectFactor);
        }
      } else {
        limits.minLeft = null;
        limits.maxLeft = left + Math.floor((width - minW) / gridX) * gridX;
        limits.minTop = null;
        limits.maxTop = top + Math.floor((height - minH) / gridY) * gridY;
        limits.minRight = null;
        limits.maxRight = right + Math.floor((width - minW) / gridX) * gridX;
        limits.minBottom = null;
        limits.maxBottom = bottom + Math.floor((height - minH) / gridY) * gridY;

        if (maxW) {
          limits.minLeft = -(right + maxW);
          limits.minRight = -(left + maxW);
        }

        if (maxH) {
          limits.minTop = -(bottom + maxH);
          limits.minBottom = -(top + maxH);
        }

        if (this.lockAspectRatio && maxW && maxH) {
          limits.minLeft = Math.min(limits.minLeft ?? 0, -(right + maxW));
          limits.minTop = Math.min(limits.minTop ?? 0, -(maxH + bottom));
          limits.minRight = Math.min(limits.minRight ?? 0, -left - maxW);
          limits.minBottom = Math.min(limits.minBottom ?? 0, -top - maxH);
        }
      }

      return limits;
    },
    move(e: any) {
      if (this.resizing) {
        this.handleMove(e);
      } else if (this.dragging) {
        this.elementMove(e);
      }
    },
    elementMove(e: any) {
      const axis = this.axis;
      const mouseClickPosition = this.mouseClickPosition;

      const tmpDeltaX =
        axis && axis !== 'y' ? mouseClickPosition.mouseX - (e.touches ? e.touches[0].pageX : e.pageX) : 0;
      const tmpDeltaY =
        axis && axis !== 'x' ? mouseClickPosition.mouseY - (e.touches ? e.touches[0].pageY : e.pageY) : 0;

      const [deltaX, deltaY] = this.snapToGrid(this.grid, tmpDeltaX / this.zoom, tmpDeltaY / this.zoom);

      this.rawTop = mouseClickPosition.top - deltaY;
      this.rawBottom = mouseClickPosition.bottom + deltaY;
      this.rawLeft = mouseClickPosition.left - deltaX;
      this.rawRight = mouseClickPosition.right + deltaX;

      this.$emit('dragging', this.left, this.top);
    },
    handleMove(e: any) {
      const handle = this.handle;
      const mouseClickPosition = this.mouseClickPosition;

      const tmpDeltaX = mouseClickPosition.mouseX - (e.touches ? e.touches[0].pageX : e.pageX);
      const tmpDeltaY = mouseClickPosition.mouseY - (e.touches ? e.touches[0].pageY : e.pageY);

      const [deltaX, deltaY] = this.snapToGrid(this.grid, tmpDeltaX, tmpDeltaY);

      if (handle?.includes('b')) {
        this.rawBottom = mouseClickPosition.bottom + deltaY;
      } else if (handle?.includes('t')) {
        this.rawTop = mouseClickPosition.top - deltaY;
      }

      if (handle?.includes('r')) {
        this.rawRight = mouseClickPosition.right + deltaX;
      } else if (handle?.includes('l')) {
        this.rawLeft = mouseClickPosition.left - deltaX;
      }

      this.$emit('resizing', this.left, this.top, this.width, this.height);
    },
    handleUp(e: any) {
      this.handle = null;

      this.resetBoundsAndMouseState();

      this.rawTop = this.top;
      this.rawBottom = this.bottom;
      this.rawLeft = this.left;
      this.rawRight = this.right;

      if (this.resizing) {
        this.resizing = false;
        this.$emit('resizestop', this.left, this.top, this.width, this.height);
      }
      if (this.dragging) {
        this.dragging = false;
        this.$emit('dragstop', this.left, this.top, e);
      }

      removeEvent(document.documentElement, eventsFor.move, this.handleMove);
    },
    snapToGrid(grid: number[], pendingX: number, pendingY: number) {
      const x = Math.round(pendingX / this.scale / grid[0]) * grid[0];
      const y = Math.round(pendingY / this.scale / grid[1]) * grid[1];

      return [x, y];
    }
  },
  computed: {
    zoom(): number {
      if (process.env.VUE_APP_IS_TEMP_EDITOR) {
        return this.$store.state.editor.zoom;
      }
      return 1;
    },
    style(): any {
      return {
        position: 'absolute',
        top: this.top + 'px',
        left: this.left + 'px',
        width: this.width + 'px',
        height: this.height + 'px',
        zIndex: this.zIndex,
        ...(this.dragging && this.disableUserSelect ? userSelectNone : userSelectAuto)
      };
    },
    actualHandles(): any[] {
      if (!this.resizable) return [];

      return this.handles;
    },
    width(): number {
      return (this.parentWidth ?? 0) - this.left - (this.right ?? 0);
    },
    height(): number {
      return (this.parentHeight ?? 0) - this.top - (this.bottom ?? 0);
    },
    resizingOnX(): boolean {
      if (!this.handle) return false;
      return Boolean(this.handle) && (this.handle.includes('l') || this.handle.includes('r'));
    },
    resizingOnY(): boolean {
      if (!this.handle) return false;
      return Boolean(this.handle) && (this.handle.includes('t') || this.handle.includes('b'));
    },
    isCornerHandle(): boolean {
      if (!this.handle) return false;
      return Boolean(this.handle) && ['tl', 'tr', 'br', 'bl'].includes(this.handle);
    }
  },

  watch: {
    active(val) {
      this.enabled = val;

      if (val) {
        this.$emit('activated');
      } else {
        this.$emit('deactivated');
      }
    },
    z(val) {
      if (val >= 0 || val === 'auto') {
        this.zIndex = val;
      }
    },
    rawLeft(newLeft) {
      const bounds = this.bounds;
      const aspectFactor = this.aspectFactor;
      const lockAspectRatio = this.lockAspectRatio;
      const left = this.left;
      const top = this.top;

      if (bounds.minLeft !== null && newLeft < bounds.minLeft) {
        newLeft = bounds.minLeft;
      } else if (bounds.maxLeft !== null && bounds.maxLeft < newLeft) {
        newLeft = bounds.maxLeft;
      }

      if (lockAspectRatio && this.resizingOnX) {
        this.rawTop = top - (left - newLeft) / aspectFactor;
      }

      this.left = newLeft;
    },
    rawRight(newRight) {
      const bounds = this.bounds;
      const aspectFactor = this.aspectFactor;
      const lockAspectRatio = this.lockAspectRatio;
      const right = this.right ?? 0;
      const bottom = this.bottom ?? 0;

      if (bounds.minRight !== null && newRight < bounds.minRight) {
        newRight = bounds.minRight;
      } else if (bounds.maxRight !== null && bounds.maxRight < newRight) {
        newRight = bounds.maxRight;
      }

      if (lockAspectRatio && this.resizingOnX) {
        this.rawBottom = bottom - (right - newRight) / aspectFactor;
      }

      this.right = newRight;
    },
    rawTop(newTop) {
      const bounds = this.bounds;
      const aspectFactor = this.aspectFactor;
      const lockAspectRatio = this.lockAspectRatio;
      const left = this.left;
      const top = this.top;

      if (bounds.minTop !== null && newTop < bounds.minTop) {
        newTop = bounds.minTop;
      } else if (bounds.maxTop !== null && bounds.maxTop < newTop) {
        newTop = bounds.maxTop;
      }

      if (lockAspectRatio && this.resizingOnY) {
        this.rawLeft = left - (top - newTop) * aspectFactor;
      }

      this.top = newTop;
    },
    rawBottom(newBottom) {
      const bounds = this.bounds;
      const aspectFactor = this.aspectFactor;
      const lockAspectRatio = this.lockAspectRatio;
      const right = this.right ?? 0;
      const bottom = this.bottom ?? 0;

      if (bounds.minBottom !== null && newBottom < bounds.minBottom) {
        newBottom = bounds.minBottom;
      } else if (bounds.maxBottom !== null && bounds.maxBottom < newBottom) {
        newBottom = bounds.maxBottom;
      }

      if (lockAspectRatio && this.resizingOnY) {
        this.rawRight = right - (bottom - newBottom) * aspectFactor;
      }

      this.bottom = newBottom;
    },
    x() {
      if (this.resizing || this.dragging) {
        return;
      }

      if (this.parent) {
        this.bounds = this.calcDragLimits();
      }

      const delta = this.x - this.left;

      if (delta % this.grid[0] === 0) {
        this.rawLeft = this.x;
        this.rawRight = (this.right ?? 0) - delta;
      }
    },
    y() {
      if (this.resizing || this.dragging) {
        return;
      }

      if (this.parent) {
        this.bounds = this.calcDragLimits();
      }

      const delta = this.y - this.top;

      if (delta % this.grid[1] === 0) {
        this.rawTop = this.y;
        this.rawBottom = (this.bottom ?? 0) - delta;
      }
    },
    lockAspectRatio(val) {
      if (val) {
        this.aspectFactor = this.width / this.height;
      } else {
        //it's strange
        this.aspectFactor = <any>undefined;
      }
    },
    minWidth(val) {
      if (val > 0 && val <= this.width) {
        this.minW = val;
      }
    },
    minHeight(val) {
      if (val > 0 && val <= this.height) {
        this.minH = val;
      }
    },
    maxWidth(val) {
      this.maxW = val;
    },
    maxHeight(val) {
      this.maxH = val;
    },
    w() {
      if (this.resizing || this.dragging) {
        return;
      }

      if (this.parent) {
        this.bounds = this.calcResizeLimits();
      }

      const delta = this.width - this.w;

      if (delta % this.grid[0] === 0) {
        this.rawRight = (this.right ?? 0) + delta;
      }
    },
    h() {
      if (this.resizing || this.dragging) {
        return;
      }

      if (this.parent) {
        this.bounds = this.calcResizeLimits();
      }

      const delta = this.height - this.h;

      if (delta % this.grid[1] === 0) {
        this.rawBottom = (this.bottom ?? 0) + delta;
      }
    }
  }
});
</script>

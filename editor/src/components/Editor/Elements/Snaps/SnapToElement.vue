<template>
  <div>
    <span v-for="(snap, i) in snaps" :key="`snap-${i}`" :style="snap.style" :class="snap.classes">
      <span class="distance-to-parent__text"> {{ snap.distance }} </span>
    </span>
    <div :style="toElementRectStyle" />
    <div v-for="(additionalLine, i) in additionalLines" :key="`add-${i}`" :style="additionalLine.style" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { isSafari } from '@/helpers/miscellaneous';

// Паддинг вокруг editor-area его нужно учитывать для позиционирования снапов
// возможно можно будет избежать этого перенеся использование компонента snapToBlock в другое место
const EDITOR_AREA_PADDING = 0;

export default Vue.extend({
  name: 'SnapToElement',
  props: {
    blockId: {
      type: String,
      required: true
    },
    elementId: {
      type: String,
      required: true
    },
    toElementId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      snaps: [] as any[],
      additionalLines: [] as any[],
      blockOffsetTop: 0
    };
  },
  computed: {
    ...mapState({ zoom: (state: any) => state.editor.zoom }),
    toElementRectStyle(): string {
      const toElement = document.getElementById(this.toElementId);
      if (!toElement) return '';
      return `{
        z-index: 100;
        position: absolute;
        outline: ${2 / this.zoom}px ${this.additionalLines.length > 0 ? 'dashed' : 'solid'} ${
        this.additionalLines.length > 0 ? '#318BF5' : '#fa4141'
      };
        width: ${toElement.offsetWidth}px;
        height: ${toElement.offsetHeight}px;
        left: ${toElement.offsetLeft + EDITOR_AREA_PADDING}px;
        top: ${this.blockOffsetTop + toElement.offsetTop}px;
      }`;
    }
  },
  mounted() {
    const block = document.getElementById(this.blockId);
    const editor = document.getElementById('editor');
    if (!block || !editor) {
      console.warn('[snapToElement]: not found editor or block');
      return;
    }

    this.blockOffsetTop = isSafari() ? block.offsetTop - editor.offsetTop : block.offsetTop;

    this.generateSnapsAndAdditionalLines();
  },
  methods: {
    generateSnapsAndAdditionalLines() {
      const element = document.getElementById(this.elementId);
      const toElement = document.getElementById(this.toElementId);
      if (!element || !toElement) {
        console.warn('[snapToElement]: not found element or toElement');
        return;
      }

      const elementRect = element.getBoundingClientRect();
      const toElementRect = toElement.getBoundingClientRect();
      const relativePosition = this.getRelativePosition(elementRect, toElementRect);
      if (relativePosition.xIntersects && relativePosition.yIntersects) return;

      const fontSize = `${12 / this.zoom}px`;

      const elementCenterCoordinates = {
        x: element.offsetLeft + EDITOR_AREA_PADDING + element.offsetWidth / 2,
        y: element.offsetTop + element.offsetHeight / 2
      };
      const toElementCenterCoordinates = {
        x: toElement.offsetLeft + EDITOR_AREA_PADDING + toElement.offsetWidth / 2,
        y: toElement.offsetTop + toElement.offsetHeight / 2
      };
      if (relativePosition.above) {
        const distance = element.offsetTop - (toElement.offsetTop + toElement.offsetHeight);
        const snap: any = {
          style: {
            'font-size': fontSize,
            height: `${distance}px`,
            left: `${elementCenterCoordinates.x}px`,
            top: `${this.blockOffsetTop + element.offsetTop - distance}px`
          },
          distance: Math.round(distance),
          classes: `distance-to-parent top`
        };
        this.snaps.push(snap);
        //Нужно ли рисовать дополнительную линию из-за сдвига элементов
        if (elementCenterCoordinates.x > toElementCenterCoordinates.x + toElement.offsetWidth / 2) {
          this.additionalLines.push({
            style: {
              position: 'absolute',
              'z-index': 100,
              width: `${elementCenterCoordinates.x - (toElementCenterCoordinates.x + toElement.offsetWidth / 2)}px`,
              left: `${toElementCenterCoordinates.x + toElement.offsetWidth / 2}px`,
              top: `${this.blockOffsetTop + element.offsetTop - distance}px`,
              'border-bottom': `${1 / this.zoom}px dashed #318BF5`
            }
          });
        }
        if (elementCenterCoordinates.x < toElementCenterCoordinates.x - toElement.offsetWidth / 2) {
          this.additionalLines.push({
            style: {
              position: 'absolute',
              'z-index': 100,
              width: `${toElementCenterCoordinates.x - toElement.offsetWidth / 2 - elementCenterCoordinates.x}px`,
              left: `${elementCenterCoordinates.x}px`,
              top: `${this.blockOffsetTop + element.offsetTop - distance}px`,
              'border-bottom': `${1 / this.zoom}px dashed #318BF5`
            }
          });
        }
      }
      if (relativePosition.below) {
        const distance = toElement.offsetTop - (element.offsetTop + element.offsetHeight);
        const snap = {
          style: {
            'font-size': fontSize,
            height: `${distance}px`,
            left: `${elementCenterCoordinates.x}px`,
            top: `${this.blockOffsetTop + element.offsetTop + element.offsetHeight}px`
          },
          distance: Math.round(distance),
          classes: `distance-to-parent top`
        };
        this.snaps.push(snap);
        //Нужно ли рисовать дополнительную линию из-за сдвига элементов
        if (elementCenterCoordinates.x > toElementCenterCoordinates.x + toElement.offsetWidth / 2) {
          this.additionalLines.push({
            style: {
              position: 'absolute',
              'z-index': 100,
              width: `${elementCenterCoordinates.x - (toElementCenterCoordinates.x + toElement.offsetWidth / 2)}px`,
              left: `${toElementCenterCoordinates.x + toElement.offsetWidth / 2}px`,
              top: `${this.blockOffsetTop + element.offsetTop + element.offsetHeight + distance}px`,
              'border-bottom': `${1 / this.zoom}px dashed #318BF5`
            }
          });
        }
        if (elementCenterCoordinates.x < toElementCenterCoordinates.x - toElement.offsetWidth / 2) {
          this.additionalLines.push({
            style: {
              position: 'absolute',
              'z-index': 100,
              width: `${toElementCenterCoordinates.x - toElement.offsetWidth / 2 - elementCenterCoordinates.x}px`,
              left: `${elementCenterCoordinates.x}px`,
              top: `${this.blockOffsetTop + element.offsetTop + element.offsetHeight + distance}px`,
              'border-bottom': `${1 / this.zoom}px dashed #318BF5`
            }
          });
        }
      }
      if (relativePosition.toTheRight) {
        const distance = toElement.offsetLeft - (element.offsetLeft + element.offsetWidth);
        const snap = {
          style: {
            'font-size': fontSize,
            width: `${distance}px`,
            left: `${element.offsetLeft + EDITOR_AREA_PADDING + element.clientWidth}px`,
            top: `${this.blockOffsetTop + element.offsetTop + element.offsetHeight / 2}px`
          },
          distance: Math.round(distance),
          classes: `distance-to-parent right`
        };
        this.snaps.push(snap);
        if (elementCenterCoordinates.y < toElementCenterCoordinates.y - toElement.offsetHeight / 2) {
          this.additionalLines.push({
            style: {
              position: 'absolute',
              'z-index': 100,
              height: `${toElementCenterCoordinates.y - toElement.offsetHeight / 2 - elementCenterCoordinates.y}px`,
              left: `${element.offsetLeft + EDITOR_AREA_PADDING + element.clientWidth + distance}px`,
              top: `${this.blockOffsetTop + elementCenterCoordinates.y}px`,
              'border-left': `${1 / this.zoom}px dashed #318BF5`
            }
          });
        }
        if (elementCenterCoordinates.y > toElementCenterCoordinates.y + toElement.offsetHeight / 2) {
          this.additionalLines.push({
            style: {
              position: 'absolute',
              'z-index': 100,
              height: `${elementCenterCoordinates.y - (toElement.offsetHeight / 2 + toElementCenterCoordinates.y)}px`,
              left: `${element.offsetLeft + EDITOR_AREA_PADDING + element.clientWidth + distance}px`,
              top: `${
                this.blockOffsetTop +
                elementCenterCoordinates.y -
                (elementCenterCoordinates.y - (toElement.offsetHeight / 2 + toElementCenterCoordinates.y))
              }px`,
              'border-left': `${1 / this.zoom}px dashed #318BF5`
            }
          });
        }
      }
      if (relativePosition.toTheLeft) {
        const distance = element.offsetLeft - (toElement.offsetLeft + toElement.offsetWidth);
        const snap = {
          style: {
            'font-size': fontSize,
            width: `${distance}px`,
            left: `${element.offsetLeft + EDITOR_AREA_PADDING - distance}px`,
            top: `${this.blockOffsetTop + element.offsetTop + element.offsetHeight / 2}px`
          },
          distance: Math.round(distance),
          classes: `distance-to-parent right`
        };
        this.snaps.push(snap);

        if (elementCenterCoordinates.y < toElementCenterCoordinates.y - toElement.offsetHeight / 2) {
          this.additionalLines.push({
            style: {
              position: 'absolute',
              'z-index': 100,
              height: `${toElementCenterCoordinates.y - toElement.offsetHeight / 2 - elementCenterCoordinates.y}px`,
              left: `${element.offsetLeft + EDITOR_AREA_PADDING - distance}px`,
              top: `${this.blockOffsetTop + elementCenterCoordinates.y}px`,
              'border-left': `${1 / this.zoom}px dashed #318BF5`
            }
          });
        }
        if (elementCenterCoordinates.y > toElementCenterCoordinates.y + toElement.offsetHeight / 2) {
          this.additionalLines.push({
            style: {
              position: 'absolute',
              'z-index': 100,
              height: `${elementCenterCoordinates.y - (toElement.offsetHeight / 2 + toElementCenterCoordinates.y)}px`,
              left: `${element.offsetLeft + EDITOR_AREA_PADDING - distance}px`,
              top: `${
                this.blockOffsetTop +
                elementCenterCoordinates.y -
                (elementCenterCoordinates.y - (toElement.offsetHeight / 2 + toElementCenterCoordinates.y))
              }px`,
              'border-left': `${1 / this.zoom}px dashed #318BF5`
            }
          });
        }
      }
    },
    getElementCoordinates(elementRect: DOMRect) {
      if (!elementRect)
        return {
          x: 0,
          y: 0,
          x2: 0,
          y2: 0
        };
      return {
        x: elementRect.left,
        y: elementRect.top,
        x2: elementRect.left + elementRect.width,
        y2: elementRect.top + elementRect.height
      };
    },
    /*
     * Как соотносятся позиции элементов. Возвращается позиция элемента до которого измеряется расстояние
     * returns
     *         toTheRight - справа,
     *         toTheLeft - слева
     *         above - выше
     *         belov - ниже
     *         xIntersects - пересекаются по ширине
     *         yIntersects - пересекаются по высоте
     * */
    getRelativePosition(elementRect: DOMRect, toElementRect: DOMRect) {
      const elementCoordinates = this.getElementCoordinates(elementRect);
      const toElementCoordinates = this.getElementCoordinates(toElementRect);
      const position = {
        toTheRight: false,
        toTheLeft: false,
        above: false,
        below: false,
        yIntersects: false,
        xIntersects: false
      };
      if (toElementCoordinates.y2 - elementCoordinates.y > elementRect.height + toElementRect.height) {
        position.below = true;
      }
      if (toElementCoordinates.y2 - elementCoordinates.y < 0) {
        position.above = true;
      } else if (toElementCoordinates.y2 - elementCoordinates.y < elementRect.height + toElementRect.height) {
        position.yIntersects = true;
      }

      if (toElementCoordinates.x2 - elementCoordinates.x > elementRect.width + toElementRect.width) {
        position.toTheRight = true;
      }
      if (toElementCoordinates.x2 - elementCoordinates.x < 0) {
        position.toTheLeft = true;
      } else if (toElementCoordinates.x2 - elementCoordinates.x < elementRect.width + toElementRect.width) {
        position.xIntersects = true;
      }
      return position;
    }
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

  align-items: center;
  justify-content: right;
  width: 1px;
}
.distance-to-parent.right {
  & .distance-to-parent__text {
    margin-bottom: 6px;
  }

  align-items: flex-end;
  justify-content: center;
  height: 1px;
}
.distance-to-parent.bottom {
  & .distance-to-parent__text {
    margin-left: 6px;
  }

  align-items: center;
  justify-content: right;
  width: 1px;
}
.distance-to-parent.left {
  & .distance-to-parent__text {
    margin-bottom: 6px;
  }

  align-items: flex-end;
  justify-content: center;
  height: 1px;
}
</style>

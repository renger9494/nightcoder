<template>
  <div
    class="category-inner__block category-inner-card"
    :id="block.id"
    @click="addBlock(block.id)"
    @dragstart="onDragStart"
    @dragend="onDragStop"
    @drag="onDrag"
  >
    <div class="category-inner-card__top">
      <p class="category-inner-card__title">{{ block.name }}</p>
      <p class="category-inner-card__id">ID:{{ block.id }}</p>
    </div>
    <block-image-preview draggable="true" class="category-inner-card__img" :data="block" :skeleton-height="180" />
    <div
      class="category-inner-card__btn-fav"
      @click.stop.prevent.exact="addOrDeleteFavorite(block)"
      :class="{ active: isBlockFavorite(block) }"
    >
      <svg-icon name="favorite-icon" width="12" height="12" color="#B3B3B3" />
    </div>
    <div class="category-inner-card__btn-add">
      <span>Add</span>
      <svg-icon name="plus-icon" width="24" height="24" color="#000" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BlockImagePreview from './BlockImagePreview.vue';

export default Vue.extend({
  name: 'BlockCard',
  components: { BlockImagePreview },
  props: {
    block: {
      type: Object,
      required: true
    },
    addOrDeleteFavorite: {
      type: Function,
      required: true
    },
    isBlockFavorite: {
      type: Function,
      required: true
    },
    addBlock: {
      type: Function,
      required: true
    },
    dragStar: {
      type: Function,
      required: true
    },
    dragEnd: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      emptyImageSrc: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/empty_block.jpg`,
      draggingElement: null as HTMLElement | null
    };
  },
  computed: {
    image(): any {
      return this.block?.files != null && this.block?.files.length != 0 ? this.block?.files[0] : null;
    }
  },
  methods: {
    onDrag(ev: any) {
      if (!this.draggingElement) return;
      this.draggingElement.style.transform = `translate(${ev.pageX + 317}px, ${ev.pageY + 178}px)`;
    },
    onDragStart(ev: any) {
      const image = new Image();
      ev?.dataTransfer?.setDragImage(image, 0, 0);
      this.createElement(ev);
      this.dragStar();
    },
    onDragStop() {
      if (this.draggingElement) this.draggingElement.style.display = 'none';
      const element = document.querySelector('#image-drag');
      element?.parentNode?.removeChild(element);
      this.draggingElement = null;
      this.dragEnd(this.block.id);
    },
    createElement(ev: any) {
      const dragIcon = ev?.target.cloneNode(true);
      dragIcon.style.width = '314px';
      dragIcon.style.height = '178px';
      dragIcon.style.position = 'fixed';
      dragIcon.style.left = '-314px';
      dragIcon.style.top = '-178px';
      dragIcon.style.zIndex = '9999999';
      dragIcon.style.transformOrigin = 'left top';
      dragIcon.style.pointerEvents = 'none';
      dragIcon.style.opacity = '0.5';
      dragIcon.style.overflow = 'initial';
      dragIcon.id = 'image-drag';
      document.querySelector('body')?.appendChild(dragIcon);
      this.draggingElement = dragIcon;
    }
  }
});
</script>

<style lang="scss" scoped>
.category-inner-card {
  position: relative;
  &:hover {
    .category-inner-card__btn-fav,
    .category-inner-card__btn-add {
      opacity: 1;
    }
  }
  &__top {
    display: flex;
    justify-content: space-between;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin: 0 0 $margin_s;
  }
  &__title {
    color: $black;
  }
  &__id {
    color: $gray600;
  }
  &__img {
    height: 180px;
    border-radius: $shape_border_radius;
    border: 1px solid $gray100;
    cursor: pointer;
  }
  &__btn-fav {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: $white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.3s;
    opacity: 0;

    svg {
      transition: 0.3s;
    }

    &:hover {
      svg {
        color: $danger !important;
        opacity: 0.5;
      }
    }

    &.active {
      opacity: 1;
      svg {
        color: $danger !important;
      }
    }
  }
  &__btn-add {
    position: absolute;
    right: 50px;
    bottom: 12px;
    max-width: 68px;
    padding: 4px 4px 4px 16px;
    background: $white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    border-radius: $shape_border_radius;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: $black;
    transition: 0.3s;
    opacity: 0;

    span {
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
    }

    svg {
      margin: 0 0 0 4px;
      transition: 0.3s;
    }

    &:hover {
      background: $black;
      color: $white;

      svg {
        color: $white !important;
      }
    }
  }
}
</style>

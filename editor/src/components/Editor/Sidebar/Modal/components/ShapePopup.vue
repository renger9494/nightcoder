<template>
  <div class="shape-popup">
    <ul class="shape-popup__list">
      <li
        class="shape-popup__list-item shape-item"
        v-for="(item, index) in shapeList"
        :key="index"
        @click="addElement(item.title)"
      >
        <div class="shape-item__icon">
          <svg-icon :name="item.title.toLowerCase()" :width="24" :height="24" />
        </div>
        <p class="shape-item__text">{{ item.title }}</p>
        <p class="shape-item__shortcut">{{ item.shortCut }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
import { ShapePopupData } from '@/components/Editor/Sidebar/Modal/types';
import { dynamicIconSizes } from '@/constants/dynamicIconSizes';
import ObjectKeys from '@/utils/types/ObjectKeys';

export default Vue.extend({
  name: 'ShapePopup',
  components: {
    SquareIconBtn
  },
  data() {
    return {
      dynamicIconSizes,
      btnSize: {
        width: 16,
        height: 16
      }
    }
  },
  computed: {
    ...mapState({
      popupData: (state: any) => <ShapePopupData>state.editor.popupSettings.data,
      userConfig: (state: any) => state.editor.userConfig
    }),
    ...mapGetters({
      blockInViewPortId: 'editor/blockInViewPortId'
    }),
    shapeList(): Array<ObjectKeys<string>> {
      return this.popupData.shapeList
    }
  },
  methods: {
    ...mapActions({
      proceedElementClick: 'editor/proceedElementClick',
      createElement: 'editor/createElement'
    }),
    addElement(name: string) {
      const blockInViewPort = document.querySelector(`#${this.blockInViewPortId}`);
      const coords = {
        x: blockInViewPort ? (blockInViewPort as HTMLElement).offsetWidth / 2 : 0,
        y: blockInViewPort ? (blockInViewPort as HTMLElement).offsetHeight / 2 : 0
      };
      this.createElement({
        element: name.toLowerCase(),
        block: this.userConfig.allComponents[this.blockInViewPortId],
        coords
      }).then(element => {
        this.proceedElementClick({ element });
      });
    }
  }
});
</script>

<style lang="scss">
.shape-popup {
  &__list {
    list-style: none;

    &-item {
      &:not(:last-child) {
        margin: 0 0 8px;
      }
    }
  }
}

.shape-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    .shape-item__text,
    .shape-item__shortcut {
      color: $blue200;
    }
    .shape-item__icon {
      svg {
        color: $blue200 !important;
      }
    }
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 2px 0 0;

    svg {
      transition: 0.3s;
    }
  }

  &__text {
    color: $black;
    font-size: 13px;
    line-height: 15px;
    transition: 0.3s;
  }

  &__shortcut {
    margin: 0 0 0 auto;
    color: $gray300;
    font-size: 12px;
    line-height: 16px;
    transition: 0.3s;
  }
}
</style>

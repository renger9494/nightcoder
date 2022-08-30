<template>
  <div
    class="design-text-editor__section design-text-editor__collapse dte-position"
    :class="{ 'design-text-editor__collapse_opened': isPanelActive }"
  >
    <div @click="toggleSection" class="design-text-editor__head">
      <span>Position</span>
      <button class="design-text-editor__button">
        <TogglePanelIcon :isPanelActive="isPanelActive" />
      </button>
    </div>
    <div v-if="isPanelActive" class="design-text-editor__content">
      <div class="dte-position__matrix_panel">
        <div class="dte-position__matrix">
          <div
            :id="positionItem.id"
            class="dte-position__matrix_item"
            v-for="positionItem in positionItems"
            :key="positionItem.id"
            @click="setPositionItemIsActive(positionItem)"
            :class="{ active: positionItem.isActive }"
          ></div>
        </div>
        <div class="dte-position__matrix_selects">
          <SelectPosition
            type="Horizontal"
            :activeItem="activeHorizontalItem"
            :items="horizontalItems"
            @changeItem="changeHorizontalItem"
          />
          <SelectPosition
            type="Vertical"
            :activeItem="activeVerticalItem"
            :items="verticalItems"
            @changeItem="changeVerticalItem"
          />
        </div>
      </div>

      <div class="dte-position__position_types">
        <div
          class="dte-position__position_types_button"
          :class="{ active: activePositionType == positionTypes.WINDOW }"
          @click="changePositionType(positionTypes.WINDOW)"
        >
          <svg-icon name="window-position-icon" width="22" height="16" color="#000" />
          <span>Window</span>
        </div>
        <div
          class="dte-position__position_types_button"
          :class="{ active: activePositionType == positionTypes.CONTAINER }"
          @click="changePositionType(positionTypes.CONTAINER)"
        >
          <svg-icon name="window-position-icon" width="20" height="16" color="#000" />
          <span>Container</span>
        </div>
      </div>
      <div class="dte-position__check">
        <CustomСheckbox :inputValue="isFixPosition" @change="changeIsFixPosition" text="Fix position when scrolling" />
        <!-- <span>Fix position when scrolling</span> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

import CustomСheckbox from '@/components/Shared/ui/Сheckbox.vue';
import SelectPosition from '@/components/Editor/Sidebar/DesignType/Sections/Position/SelectPosition.vue';
import TogglePanelIcon from '@/components/Editor/Sidebar/DesignType/Sections/TogglePanelIcon.vue';
import position from '@/constants/position';

export default Vue.extend({
  components: {
    SelectPosition,
    TogglePanelIcon,
    CustomСheckbox
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      previewMode: (state: any) => state.editor.previewMode
    })
  },
  mounted() {
    const elementPosition = this.value.position && this.value.position[this.previewMode];
    if (elementPosition) {
      this.activePositionType = elementPosition.positionType;
      this.activeHorizontalItem = <any>this.horizontalItems.find(x => x.id == elementPosition.horizontalId);
      this.activeVerticalItem = <any>this.verticalItems.find(x => x.id == elementPosition.verticalId);
      this.isFixPosition = elementPosition.isFixPosition;
      this.changePositionItemsIsActive();
    }
  },
  data() {
    position.items[0].isActive = true;
    return {
      activeHorizontalItem: position.horizontalPositionItems[0],
      horizontalItems: position.horizontalPositionItems,
      activeVerticalItem: position.verticalPositionItems[0],
      verticalItems: position.verticalPositionItems,
      positionItems: position.items,
      positionTypes: position.types,
      activePositionType: position.types.WINDOW,
      isPanelActive: false,
      isFixPosition: false
    };
  },
  methods: {
    changeStatePosition() {
      if (!this.isPanelActive) {
        this.$store.commit('editor/changePosition', { element: this.value, position: null });
        return;
      }
      const horizontalId = this.activeHorizontalItem.id;
      const verticalId = this.activeVerticalItem.id;
      const positionType = this.activePositionType;
      const isFixPosition = this.isFixPosition;
      this.$store.commit('editor/changePosition', {
        element: this.value,
        position: {
          horizontalId,
          verticalId,
          positionType,
          isFixPosition
        }
      });
    },
    changePositionType(type: number) {
      this.activePositionType = type;
    },
    /**
     *
     * @param {{horizontal, vertical, isActive}} positionItem - position item
     */
    setPositionItemIsActive(positionItem: { vertical: number; horizontal: number; isActive: boolean }) {
      position.items.filter(x => x.isActive).forEach(x => (x.isActive = false));

      this.activeHorizontalItem = <any>this.horizontalItems.find(x => x.id == positionItem.horizontal);
      this.activeVerticalItem = <any>this.verticalItems.find(x => x.id == positionItem.vertical);
      positionItem.isActive = !positionItem.isActive;

      this.changeStatePosition();
    },
    toggleSection() {
      this.isPanelActive = !this.isPanelActive;
      this.changeStatePosition();
    },
    changeHorizontalItem(item: any) {
      this.activeHorizontalItem = item;
      this.changePositionItemsIsActive();
    },
    changeVerticalItem(item: any) {
      this.activeVerticalItem = item;
      this.changePositionItemsIsActive();
    },
    changePositionItemsIsActive() {
      position.items.filter(x => x.isActive).forEach(x => (x.isActive = false));

      const activeHorizontal = this.activeHorizontalItem.value;
      const activeHorizontalAdditional = this.activeHorizontalItem.additionalValue;

      const activeVertical = this.activeVerticalItem.value;
      const activeVerticalAdditional = this.activeVerticalItem.additionalValue;

      const positionActiveHorizontal = position.items.find(
        x => x.vertical == activeVertical && x.horizontal == activeHorizontal
      );
      if (positionActiveHorizontal) positionActiveHorizontal.isActive = true;

      if (activeHorizontalAdditional) {
        const positionActiveHorizontalAdditional = position.items.find(
          x => x.vertical == activeVertical && x.horizontal == activeHorizontalAdditional
        );
        if (positionActiveHorizontalAdditional) positionActiveHorizontalAdditional.isActive = true;
        if (activeVerticalAdditional) {
          const positionVerticalAdditionalHorizontalAdditional = position.items.find(
            x => x.vertical == activeVerticalAdditional && x.horizontal == activeHorizontalAdditional
          );
          if (positionVerticalAdditionalHorizontalAdditional)
            positionVerticalAdditionalHorizontalAdditional.isActive = true;
        }
      }

      if (activeVerticalAdditional) {
        const positionactiveVerticalAdditional = position.items.find(
          x => x.vertical == activeVerticalAdditional && x.horizontal == activeHorizontal
        );
        if (positionactiveVerticalAdditional) positionactiveVerticalAdditional.isActive = true;
        if (activeHorizontalAdditional) {
          const positionVerticalAdditionalHorizontalAdditional = position.items.find(
            x => x.vertical == activeVerticalAdditional && x.horizontal == activeHorizontalAdditional
          );
          if (positionVerticalAdditionalHorizontalAdditional)
            positionVerticalAdditionalHorizontalAdditional.isActive = true;
        }
      }

      this.changeStatePosition();
    },
    changeIsFixPosition(value: any) {
      this.isFixPosition = value;
      this.changeStatePosition();
    }
  }
});
</script>

<style lang="scss" scoped>
.dte-position {
  &__position_types {
    margin: 20px 0;
    display: flex;
    align-items: center;
    &_button {
      display: flex;
      align-items: center;
      padding: 4px 6px;
      border-radius: 4px;
      &:first-child {
        margin-right: 40px;
      }

      span {
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 14px;
      }

      &.active {
        background: #f3f3f3;
      }
      svg {
        margin-right: 12px;
        width: 17px;
        height: 12px;
      }

      &:hover {
        cursor: pointer;
        background: #f3f3f3;
      }
    }
  }

  &__matrix_panel {
    display: flex;
    margin-top: 16px;
  }
  &__matrix {
    display: grid;
    grid-template-columns: 22px 22px 22px;
    grid-template-rows: 22px 22px 22px;

    &_item {
      border: 1px solid #bdc2c7;
      box-sizing: border-box;
      border-radius: 4px;
      width: 20px;
      height: 20px;
      margin-bottom: 2px;
      &.active {
        background: #318bf5;
        border: 1px solid #318bf5;
      }
      &:hover {
        background: #318bf5;
        border: 1px solid#318bf5;
        cursor: pointer;
      }
    }

    &_selects {
      margin-left: 25px;
    }
  }
}
</style>

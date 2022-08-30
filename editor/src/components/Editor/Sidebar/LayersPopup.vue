<template>
  <div class="layer-popup">
    <div class="layer-popup__head">
      <div class="layer-popup__head-container">
        <svg-icon name="layer-icon" width="24" height="24" />
        <h3 class="layer-popup__title">Layers</h3>
      </div>
      <button @click="closeModal" class="layer-popup__close">
        <svg-icon name="close" width="8" height="8" color="#BDBDBD" />
      </button>
    </div>
    <layers-editor class="layer-popup__body" />
    <add-block-btn class="layer-popup__add-btn" @click="addEmptyBlock" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LayersEditor from '@/components/Editor/Sidebar/LayersType/LayersType.vue';
import { mapGetters, mapMutations } from 'vuex';
import AddBlockBtn from '@/components/Editor/Sidebar/Modal/components/BlockCollection/AddBlockBtn.vue';

export default Vue.extend({
  name: 'LayersPopup',
  components: {
    AddBlockBtn,
    LayersEditor
  },
  methods: {
    ...mapMutations({
      insertBlockToConfig: 'editor/insertBlockToConfig',
      changeBlockToViewId: 'editor/changeBlockToViewId'
    }),
    closeModal() {
      this.$emit('close');
    },
    addEmptyBlock() {
      const insertAfter: number = this.blocksSortedBySortId[this.blocksSortedBySortId.length - 1]?.sortId;
      const newBlockConfig = this.createNewBlockConfig({ insertAfter, name: 'Empty Block' });

      this.insertBlockToConfig({ blockConfig: newBlockConfig });
      this.changeBlockToViewId(newBlockConfig.id);
    }
  },
  computed: {
    ...mapGetters({
      createNewBlockConfig: 'editor/createNewBlockConfig',
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    })
  }
});
</script>

<style lang="scss" scoped>
.layer-popup {
  background: $white;
  box-shadow: 0 10px 20px rgba(130, 130, 130, 0.15);
  border-radius: $shape_border_radius;
  display: flex;
  flex-direction: column;
  position: relative;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid $gray100;
    &-container {
      display: flex;
      align-items: center;

      svg {
        margin: 0 5px 0 0;
      }
    }
  }

  &__title {
    color: $black;
    font-size: 15px;
    line-height: 18px;
  }

  &__close {
    background: #f2f2f2;
    border-radius: 100%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    svg {
      transition: 0.3s;
    }

    &:hover {
      svg {
        color: $black !important;
      }
    }
  }

  &__body {
    padding: 16px 8px 0;
    overflow-y: auto;
    flex: 1 0 0;
    &::-webkit-scrollbar {
      width: 2px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #bdc2c7;
      height: 30px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track-piece {
      display: none;
    }
  }

  &__add-btn {
    position: sticky;
    z-index: 100;
    bottom: 20px;
    width: 100%;
    max-width: 150px;
    margin: 15px auto;
  }
}
</style>

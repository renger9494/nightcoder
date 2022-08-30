<template>
  <div v-click-outside="() => (isShowDropdown = false)" class="filter filter_item">
    <div @click="isShowDropdown = true" :class="isShowDropdown ? 'active' : null" class="filter__head">
      <span>{{ currentItemName || 'Choose a category' }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="9" viewBox="0 0 6 9" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.5 0.917976C0.5 0.568158 0.880887 0.373672 1.13801 0.592202L5.35262 4.17423C5.54913 4.34124 5.54913 4.65876 5.35262 4.82577L1.13801 8.4078C0.880886 8.62633 0.5 8.43184 0.5 8.08202L0.5 0.917976Z"
          fill="black"
        />
      </svg>
    </div>
    <div class="filter__body filter__body_lg" v-show="isShowDropdown">
      <div v-for="(item, i) in items" :key="i" @click="changeCurrentItem(item)" class="filter__option">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
//TODO: Move to shared folder
export default Vue.extend({
  name: 'ItemsSelector',
  props: {
    currentItem: {
      type: Object,
      default: null
    },
    items: {
      type: Array as PropType<any[]>,
      default: []
    }
  },
  data() {
    return {
      isShowDropdown: false
    };
  },
  computed: {
    currentItemName(): string | null {
      if (this.currentItem) {
        return this.currentItem.name;
      }
      return null;
    }
  },
  methods: {
    changeCurrentItem(item: any) {
      this.isShowDropdown = false;
      this.$emit('itemChanged', item);
    }
  }
});
</script>

<style lang="scss">
.filter_item {
  position: relative;
  display: flex;
  align-items: center;
  width: 150px;
  height: 34px;
  background: #ffffff;
  box-shadow: $shadow_button;
  border-radius: $shape_border_radius;
  font-size: 13px;
  line-height: 15px;

  color: #949cad;
  .filter__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0 12px;
  }

  .filter__body {
    width: 150px;
    top: 0px;
    position: absolute;
    background: #ffffff;
    box-shadow: $shadow_button;
    border-radius: $shape_border_radius;
    z-index: 999;

    .filter__option {
      padding: 0 6px;
      display: flex;
      align-items: center;
      height: 34px;
      &:hover {
        background: linear-gradient(0deg, #f3f3f3, #f3f3f3);
      }
    }
  }
}
</style>

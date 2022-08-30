<template>
  <div class="filter">
    <div
      v-if="!isFilterUsers"
      class="drop-down"
      :style="{
        visibility: isUserLoggedIn ? 'visible' : 'hidden',
      }"
    >
      <span class="drop-down-head">Show:</span>
      <div
        class="drop-down__filter-head"
        @click="isDropdownShowOpen = !isDropdownShowOpen"
      >
        <span>{{ selectedActionShow }}</span>
        <svg-icon
          width="16"
          height="16"
          color="#000000"
          name="dropdown_arrow"
        />
      </div>
      <div
        v-if="isDropdownShowOpen"
        v-click-outside="() => (isDropdownShowOpen = false)"
        class="drop-down__container"
      >
        <div
          class="drop-down__item"
          v-for="(action, index) in ShowActions"
          :key="index"
          @click.prevent.stop="selectAction(action, null)"
          :class="{ active: action === selectedActionShow }"
        >
          <span>{{ action }}</span>
        </div>
      </div>
    </div>
    <div
      class="drop-down"
      :style="{
        visibility: isUserLoggedIn ? 'visible' : 'hidden',
      }"
    >
      <span class="drop-down-head">Sort by:</span>
      <div
        class="drop-down__filter-head"
        @click="isDropdownSortOpen = !isDropdownSortOpen"
      >
        <span>{{ selectedActionSort }}</span>
        <svg-icon
          width="16"
          height="16"
          color="#000000"
          name="dropdown_arrow"
        />
      </div>
      <div
        v-if="isDropdownSortOpen"
        v-click-outside="() => (isDropdownSortOpen = false)"
        class="drop-down__container"
      >
        <div
          class="drop-down__item"
          v-for="(action, index) in SortActions"
          :key="index"
          @click.prevent.stop="selectAction(null, action)"
          :class="{ active: action === selectedActionSort }"
        >
          <span>{{ action }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
export enum SortActions {
  MostAppreciated = 'Most appreciated',
  Latest = 'Latest',
}
export enum ShowActions {
  All = 'All projects',
  Following = 'Following',
}
export default Vue.extend({
  components: {},
  data() {
    return {
      SortActions,
      ShowActions,
      isDropdownShowOpen: false,
      isDropdownSortOpen: false,
    }
  },
  props: {
    selectedActionShow: {
      type: String,
      required: true,
    },
    selectedActionSort: {
      type: String,
      required: true,
    },
    isFilterUsers: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState({
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
    }),
  },
  methods: {
    selectAction(show: ShowActions | null, sort: SortActions | null) {
      this.isDropdownShowOpen = false
      this.isDropdownSortOpen = false
      this.$emit('selectAction', show, sort)
    },
  },
})
</script>
<style lang="scss" scoped>
.filter {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  color: #bdc2c7;
  margin-top: 20px;
}
.drop-down {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  &-head {
    font-size: 12px;
    color: #949cad;
    margin-right: 8px;
    white-space: nowrap;
  }
  &__filter-head {
    border: 1px solid $color_input_border;
    border-radius: $shape_border_radius;
    display: flex;
    align-items: center;
    padding: 8px;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    transition: 0.3s;
    width: 200px;
    white-space: nowrap;
    cursor: pointer;
    color: #000000;
    svg {
      margin: 0 0 0 auto;
    }

    &:hover {
      border-color: $gray400;
    }

    span {
      display: inline-block;
      width: 90%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  &__container {
    width: 200px;
    background: $white;
    color: $black;
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    border: 1px solid #dadada;
    box-shadow: 0 10px 20px rgba(9, 9, 9, 0.15);
    border-radius: 4px;
    padding: 2px 6px;
    z-index: 10;
  }
  &__item {
    padding: 4px;
    margin: 0 -4px;
    cursor: pointer;

    span {
      font-size: 13px;
      line-height: 15px;
      margin-left: 5px;
    }

    &:hover {
      background: #f3f3f3;
    }
  }
}
</style>

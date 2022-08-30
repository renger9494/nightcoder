<template>
  <div class="feed-search">
    <label
      class="feed-search__field"
      :class="{
        isInputEntered,
        isInputFocused,
        'feed-search__field__empty': !isSearchPage,
      }"
      @mouseenter="isInputEntered = true"
      @mouseleave="isInputEntered = false"
    >
      <svg-icon width="16" height="16" name="search" color="#BDC2C7" />
      <input
        @focus="isInputFocused = true"
        @blur="isInputFocused = false"
        class="feed-search__input"
        v-model="nameToSearch"
        placeholder="Search"
        @keydown.enter="search"
      />
      <div
        class="feed-search__input-clear"
        @click="nameToSearch = ''"
        v-if="nameToSearch.length > 0"
      >
        <svg-icon name="close" width="8" height="8" color="#BDBDBD" />
      </div>
    </label>
    <ul v-if="isSearchPage && !isLoading" class="feed-search__list">
      <li
        @click="changeSelectedTypeSearch(TypeSearch.Projects)"
        :class="{
          'feed-search__list__active':
            selectedTypeSearch == TypeSearch.Projects,
        }"
      >
        <span>Projects</span
        ><span v-if="selectedTypeSearch == TypeSearch.Projects"
          >({{ countProjects }})</span
        >
      </li>

      <li
        @click="changeSelectedTypeSearch(TypeSearch.Users)"
        :class="{
          'feed-search__list__active': selectedTypeSearch == TypeSearch.Users,
        }"
      >
        <span>Users</span
        ><span v-if="selectedTypeSearch == TypeSearch.Users"
          >({{ countUsers }})</span
        >
      </li>
    </ul>
    <div v-if="isSearchPage && isLoading" class="feed-search-skeleton">
      <div
        class="feed-search-skeleton-item"
        v-for="item in 2"
        :key="`${item}skeleton`"
      >
        <skeleton max-width="100%" height="37" width="75" radius="0" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
export enum TypeSearch {
  Projects = 'projects',
  Tags = 'tags',
  Users = 'users',
}
export default Vue.extend({
  data() {
    return {
      TypeSearch,
      nameToSearch: this.textSearch,
      isInputEntered: false,
      isInputFocused: false,
    }
  },
  props: {
    textSearch: {
      type: String,
      default: '',
    },
    countProjects: {
      type: Number,
      default: 0,
    },
    countTags: {
      type: Number,
      default: 0,
    },
    countUsers: {
      type: Number,
      default: 0,
    },
    selectedTypeSearch: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isSearchPage: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    textSearch(val) {
      this.nameToSearch = val
    },
  },
  methods: {
    search() {
      this.$emit('search', this.nameToSearch)
    },
    changeSelectedTypeSearch(type: TypeSearch) {
      this.$emit('changeSelectedTypeSearch', type)
    },
  },
})
</script>
<style lang="scss" scoped>
.feed-search {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  &__field {
    width: 100%;
    position: relative;
    padding: 8px;
    border: 1px solid $color_input_border;
    border-radius: $shape_border_radius 0 0 $shape_border_radius;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.3s;
    overflow: hidden;

    @include bp(1046px) {
      margin: 12px 0 0;
      width: 100%;
      max-width: 100%;
    }
    &__empty {
      width: 245px;
      border-radius: $shape_border_radius;
    }
    svg {
      transition: 0.3s;
    }

    &.isInputEntered {
      border-color: $color_input_focus;
    }

    &.isInputFocused {
      border-color: $color_input_focus;
    }

    @include bp($sm) {
      max-width: 100%;
    }
  }
  &__input {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: $black;
    height: 100%;
    transition: 0.3s;

    &::placeholder {
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
      color: $gray700;
    }

    &-clear {
      position: absolute;
      top: 5px;
      bottom: 0;
      right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: #f2f2f2;
      width: 24px;
      height: 24px;
      border-radius: 24px;
      svg {
        transition: 0.3s;
      }

      &:hover {
        svg {
          color: $black !important;
        }
      }
    }
  }
  &__list {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
    border: 1px solid $color_input_border;
    border-radius: 0 $shape_border_radius $shape_border_radius 0;
    height: 100%;
    padding: 8px;
    color: #949cad;
    border-left: none;
    li {
      width: fit-content;
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 30px;
      }
      span:not(:last-child) {
        margin-right: 4px;
      }
    }
    &__active {
      color: $black;
    }
  }
  &-skeleton {
    display: flex;
    flex-wrap:nowrap &-item {
      flex: 0 0 75px;
      width: 75px;
    }
  }
}
</style>
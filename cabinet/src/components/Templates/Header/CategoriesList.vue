<template>
  <div
    class="categories-list"
    :class="{
      'categories-list_footer': !isVisible,
    }"
  >
    <div
      :class="{
        'categories-list_open': isOpen,
        'categories-list__inner': !isOpen,
        'categories-list__innerFooter': !isVisible,
      }"
    >
      <category
        class="categories-list__item"
        :is-reset="true"
        :category="{ name: 'all', id: 0 }"
      />
      <category
        class="categories-list__item"
        v-for="category in categories"
        :key="category.id"
        :category="category"
      />
    </div>
    <button class="categories-list__show-all" @click="toggleCategoryList">
      <span> {{ !isOpen ? 'Show All' : 'Hide' }}</span>
      <svg-icon
        :class="{ 'categories-list__show-all__iconUp': isOpen }"
        width="10"
        height="8"
        color="#000"
        name="vectorDown"
      />
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Category from '@/components/Templates/Category.vue'
import { BaseNameDtoOfInteger } from '@/utils/api'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg?inline'

export default Vue.extend({
  props: {
    categories: {
      type: Array as PropType<BaseNameDtoOfInteger[]>,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    toggleCategoryList() {
      this.isOpen = !this.isOpen
    },
  },
  components: {
    Category,
    ArrowDownIcon,
  },
})
</script>

<style lang="scss" scoped>
.categories-list {
  &_footer {
    position: fixed;
    bottom: 20px;
    width: 100%;
    z-index: 10;
    padding-right: 20px;
    padding-left: 20px;
  }

  &__innerFooter {
    display: flex;
    flex-wrap: wrap;
    margin-right: auto;
    margin-left: auto;
    justify-content: center;
    gap: 8px;
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    max-width: 1280px;
    height: fit-content;
    border-radius: 4px;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
    padding: 4px;
    background-color: #ffffff;
  }

  &__inner,
  &_open {
    display: flex;
    flex-wrap: wrap;
    margin-right: auto;
    margin-left: auto;
    gap: 8px;
    margin-bottom: 60px;
    justify-content: center;
  }

  &__show-all {
    display: none;
    align-items: center;
    flex-direction: row;
    font-size: 12px;

    margin: auto;
    span {
      margin-right: 4px;
      font-weight: 500;
    }
    &__iconUp {
      transform: rotate(180deg);
    }
  }
}
@media screen and (max-width: 768px) {
  .categories-list {
    &_footer {
      padding-right: 20px;
      padding-left: 20px;
    }
    &__inner {
      margin-bottom: 50px;
    }
  }
}
@media screen and (max-width: 414px) {
  .categories-list {
    &_footer {
      bottom: 15px;
      padding-right: 15px;
      padding-left: 15px;
    }
    &_open {
      height: fit-content;
      margin-bottom: 16px;
    }
    &__inner {
      height: 85px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    &__show-all {
      display: flex;
      margin-bottom: 50px;
    }
  }
}
</style>

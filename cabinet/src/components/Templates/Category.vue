<template>
  <nuxt-link
    class="category"
    :class="{
      category_active: isActive,
      'category_not-clickable': isNotClickable,
    }"
    :to="templateUrl"
  >
    {{ category.name }}
  </nuxt-link>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { BaseNameDtoOfInteger } from '@/utils/api'

export default Vue.extend({
  props: {
    category: {
      type: Object as PropType<BaseNameDtoOfInteger>,
    },
    isNotClickable: Boolean,
    isReset: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    templateUrl(): string {
      const { projectId, tagId } = this.$route.params
      const tagUrl =
        tagId != this.category.name
          ? `/tag/${this.category.name?.replace(' ', '-').toLowerCase()}`
          : ''

      if (projectId) {
        if (this.isReset) return '/projects/templates'
        return `/projects/templates${tagUrl}`
      }

      if (this.isReset) return '/templates'
      return `/templates${tagUrl}`
    },
    isActive(): boolean {
      const { tagId } = this.$route.params
      if (!tagId && this.isReset) return true
      return this.category.name?.replace(' ', '-').toLowerCase() == tagId
    },
  },
})
</script>

<style lang="scss" scoped>
.category {
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  text-transform: lowercase;
  &::first-letter {
    text-transform: uppercase;
  }
  display: inline-block;
  color: $black;
  border: 1px solid #dadada;
  border-radius: 4px;
  padding: 8px 10px;
  transition: 0.3s;
  cursor: pointer;
  text-decoration: none;

  &_active,
  &:hover {
    color: #ffffff;
    background-color: #000000;

    &:hover {
      background-color: #000000;
      border-color: #000000;
    }
  }

  &_active {
    border-color: #000000 !important;
    background-color: #000000 !important;

    &:hover {
      opacity: 0.8 !important;
    }
  }

  &_not-clickable {
    cursor: default;

    &:hover {
      background-color: #f3f3f3;
    }
  }
}
@media screen and (max-width: 414px) {
  .category {
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
  }
}
</style>

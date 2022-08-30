<template>
  <div class="sidebar-head">
    <div class="sidebar-head__item">
      <svg-icon
        :name="elementIconName"
        :width="dynamicIconSizes[elementIconName].width"
        :height="dynamicIconSizes[elementIconName].height"
        class="sidebar-head__icon"
      />
      <p class="sidebar-head__title" v-tooltip="elementName" :class="{ isLink: !isLink }">{{ elementName }}</p>
    </div>
    <header-popup-link :value="value" v-if="isLink" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { dynamicIconSizes } from '@/constants/dynamicIconSizes';
import HeaderPopupLink from '@/components/Editor/Sidebar/DesignType/Sections/HeaderPopupLink.vue';

export default Vue.extend({
  name: 'Head',
  components: { HeaderPopupLink },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    isLink: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      dynamicIconSizes
    };
  },
  computed: {
    elementName(): string {
      if (this.value.type === 'block') return this.value.type;
      return this.value.name;
    },
    elementIconName(): string {
      return this.value.type.replaceAll(' ', '-').toLowerCase();
    }
  },
  methods: {}
});
</script>

<style lang="scss">
.sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $padding_m $padding_xl;
  border-bottom: 1px solid $gray100;

  &__item {
    display: flex;
    align-items: center;
  }

  &__title {
    font-size: 15px;
    line-height: 18px;
    color: $black;
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    max-width: 84px;

    &.isLink {
      max-width: 170px;
    }

    &--dots {
      max-width: unset;
      display: flex;
      align-items: center;
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
    margin: 0 5px 0 0;
  }
}
</style>

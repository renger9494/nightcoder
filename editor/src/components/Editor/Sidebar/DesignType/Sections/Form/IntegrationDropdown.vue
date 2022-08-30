<template>
  <div class="integrations-dropdown">
    <div class="integrations-dropdown__top" v-if="activeItem" @click="toggleDropdown">
      <svg-icon :name="activeIconName" width="24" height="24" />
      <p class="integrations-dropdown__top-title">{{ activeItem }}</p>
      <svg-icon name="arrow-down-icon" width="9" height="5" color="#4356BE" />
    </div>
    <transition name="popup-layer" mode="out-in">
      <div
        v-if="isDropdownOpen"
        class="integrations-dropdown-list integrations-dropdown__list"
        v-click-outside="() => (isDropdownOpen = false)"
      >
        <div
          class="integrations-dropdown-list__item"
          :class="{ disabled: item.tooltip, active: activeItem === item.text.toLowerCase() }"
          v-for="(item, index) in list"
          @click="onClick(item)"
          :key="index"
          v-tooltip="item.tooltip"
        >
          <svg-icon :name="item.icon" width="24" height="24" />
          <p>{{ item.text }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'IntegrationDropdown',
  props: {
    activeItem: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [
        {
          text: 'Mailchimp',
          icon: 'mailchimp',
          tooltip: null
        },
        {
          text: 'Airtap CRM',
          icon: 'logo',
          tooltip: 'Coming soon'
        },
        {
          text: 'Telegram',
          icon: 'telegram',
          tooltip: 'Coming soon'
        },
        {
          text: 'Zapier',
          icon: 'zapier',
          tooltip: 'Coming soon'
        }
      ],
      isDropdownOpen: false
    };
  },
  methods: {
    onClick(item: any) {
      if (item.tooltip) return;
      this.toggleDropdown();
      this.$emit('onChange', item.text.toLowerCase());
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  },
  computed: {
    activeIconName(): string {
      return this.activeItem.toLowerCase();
    }
  }
});
</script>

<style lang="scss" scoped>
.integrations-dropdown {
  position: relative;
  width: 100%;
  &__top {
    display: flex;
    align-items: center;
    padding: 2px 10px 2px 2px;
    transition: 0.3s;
    max-width: 140px;
    width: 100%;
    cursor: pointer;
    border-radius: $shape_border_radius;

    &:hover {
      background: $gray100;
      cursor: pointer;
    }
    &-title {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      margin: 0 auto 0 2px;
    }
  }

  &__list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
  }
}
.integrations-dropdown-list {
  background: $white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 8px;
  width: 100%;

  &__item {
    padding: 2px;
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: $black;
    border-radius: $shape_border_radius;
    cursor: pointer;
    transition: 0.3s;

    svg {
      margin: 0 2px 0 0;
    }

    &:hover {
      background: $gray100;
    }

    &.disabled {
      cursor: initial;
      opacity: 0.5;
    }

    &.active {
      color: $blue200;
    }
  }
}
</style>

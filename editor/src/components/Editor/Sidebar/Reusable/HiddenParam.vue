<template>
  <div :class="{ active }" class="hidden-param">
    <div @click="onBtnClick(true)" class="hidden-param__head">
      <div class="hidden-param__title">{{ title }}</div>
      <square-icon-btn
        @click.native.stop="onBtnClick(active ? false : true)"
        :icon-settings="{ name: !active ? 'plus-icon' : 'minus-icon', ...iconSize }"
        :icon-color="!active ? '#828282' : '#000'"
      />
    </div>
    <div v-if="active" class="hidden-param__slot">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';
export default Vue.extend({
  name: 'HiddenParam',
  components: { SquareIconBtn },
  props: {
    title: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerActive: false,
      iconSize: { width: 24, height: 24 }
    };
  },
  methods: {
    onBtnClick(val: any) {
      this.innerActive = val;
      this.$emit('changeActivity', this.innerActive);
    }
  }
});
</script>

<style lang="scss">
.hidden-param {
  &__title {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: $gray700;
    transition: 0.3s ease-in-out;
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      .hidden-param {
        &__title {
          opacity: 1;
        }
      }
    }
  }
  &.active,
  &:hover {
    .square-icon-btn svg {
      color: $black !important;
    }
    .hidden-param {
      &__title {
        color: $black;
        opacity: 1;
      }
    }
  }

  &__slot {
    margin: $margin_xl 0 0;
  }
}
</style>

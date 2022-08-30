<template>
  <div :class="{ switcher__opacityBackground: isWhite }" class="switcher">
    <div class="switcher__placeholder" ref="placeholder" :style="`--switcher-items: ${switcherItems.length}`"></div>

    <div
      :class="{ 'switcher-element__white': isWhite }"
      class="switcher-element"
      v-for="(item, i) in switcherItems"
      :ref="`switcherElement${i}`"
      :key="`switcher_items_${i}`"
      @click="changeItem($event, item.name)"
    >
      <svg-icon
        v-if="item.iconWidth"
        :name="item.icon"
        :width="item.iconWidth"
        :height="item.iconHeight"
        :color="item.iconColor"
      />
      <!-- TODO: удалить icon после перехода на svg спрайт -->
      <icon v-else :icon="item.icon" />
      <span
        :class="{ 'switcher-element__name': item.icon }"
        :style="{ color: item.isActive ? colorActiveElement : colorElement }"
        >{{ item.name }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { TimelineLite } from 'gsap';
import Icon from './Modal/utils/Icon.vue';

export default Vue.extend({
  components: {
    Icon
  },
  props: {
    switcherItems: {
      type: Array as PropType<any[]>
    },
    isWhite: {
      type: Boolean,
      default: false
    },
    colorElement: {
      type: String,
      default: '#000000'
    },
    colorActiveElement: {
      type: String,
      default: '#000000'
    }
  },
  mounted() {
    this.setActiveTab();
  },
  watch: {
    switcherItems() {
      this.$nextTick(() => {
        this.setActiveTab();
      });
    }
  },
  methods: {
    changeItem(event: any, name: string) {
      this.$emit('filterName', name);

      this.animateSwitch(event.target);
    },
    animateSwitch(toElement: HTMLElement) {
      const tl = new TimelineLite();
      const placeholder: any = this.$refs.placeholder;
      tl.to(placeholder, 0.05, {
        x: (toElement.offsetLeft - 4) / 2
      }).to(placeholder, 0.05, {
        x: toElement.offsetLeft - 4
      });
    },
    setActiveTab() {
      const toElementIndex = this.switcherItems.findIndex(x => x.isActive);
      if (toElementIndex >= 0) {
        const $toElements = <any[]>this.$refs[`switcherElement${toElementIndex}`];
        const toElement = $toElements[0];
        this.animateSwitch(toElement);
      }
    }
  }
});
</script>

<style lang="scss">
.switcher {
  display: flex;
  align-items: center;
  padding: 0 4px;
  border-radius: $shape_border_radius;
  background: $color_switcher_bg;
  position: relative;
  font-size: 12px;
  line-height: 14px;
  &__opacityBackground {
    background: rgba(243, 243, 243, 0.4);
  }
  &__placeholder {
    position: absolute;
    // left: 4px;
    pointer-events: none;
    top: calc(50% - 13px);
    width: calc((100% / var(--switcher-items)) - 4px);
    border-radius: $shape_border_radius;
    background: $color_switcher_item_bg;
    box-shadow: $shadow_small;
    height: 26px;
    transition: transform 0.2s ease;
  }

  &-element {
    position: relative;
    z-index: 1;
    padding: 10px 0;
    width: 100%;
    text-align: center;
    cursor: pointer;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color_switcher_item_text;
    &__white {
      span {
        color: $black!important;
      }
    }

    span,
    svg {
      pointer-events: none;
    }

    &__name {
      margin-left: 8px;
      color: #000;
    }
  }
}
</style>

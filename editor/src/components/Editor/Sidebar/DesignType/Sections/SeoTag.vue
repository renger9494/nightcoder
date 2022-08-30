<template>
  <div class="seo-tag sidebar-block">
    <p class="sidebar-block__title">SEO settings</p>
    <div class="sidebar-block__col sidebar-block__col--flex">
      <square-icon-btn
        class="sidebar-block__item sidebar-block__item--xs"
        :icon-settings="{ name: 'p-icon', ...iconSize }"
        :is-active="elementType === ElementType.p"
        @click.native.stop="changeTypeHandler({ type: ElementType.p })"
      />
      <square-icon-btn
        class="sidebar-block__item sidebar-block__item--xs"
        :icon-settings="{ name: 'h1-icon', ...iconSize }"
        :is-active="elementType === ElementType.h1"
        @click.native.stop="changeTypeHandler({ type: ElementType.h1 })"
      />
      <square-icon-btn
        class="sidebar-block__item sidebar-block__item--xs"
        :icon-settings="{ name: 'h2-icon', ...iconSize }"
        :is-active="elementType === ElementType.h2"
        @click.native.stop="changeTypeHandler({ type: ElementType.h2 })"
      />
      <square-icon-btn
        class="sidebar-block__item sidebar-block__item--xs"
        :icon-settings="{ name: 'h3-icon', ...iconSize }"
        :is-active="elementType === ElementType.h3"
        @click.native.stop="changeTypeHandler({ type: ElementType.h3 })"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';

enum ElementType {
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  p = 'p'
}

export default defineComponent({
  name: 'SeoTag',
  components: { SquareIconBtn },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root }) {
    const iconSize = { width: 24, height: 24 };
    const elementType = computed(() => props.value.payload.type);

    function changeTypeHandler(value: any) {
      root.$store.commit('editor/changeElementsType', {
        id: props.value.id,
        ...value
      });
    }

    return {
      iconSize,
      ElementType,
      elementType,
      changeTypeHandler
    };
  }
});
</script>

<style lang="scss" scoped>
.seo-tag {
}
</style>

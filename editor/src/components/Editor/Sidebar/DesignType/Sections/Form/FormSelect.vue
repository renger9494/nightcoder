<template>
  <div class="sidebar-select sidebar-select--form">
    <div class="sidebar-select__header" @click="showToggle">
      <span>{{ activeType ? activeType : 'Nothing selected yet' }}</span>
      <square-icon-btn
        :icon-settings="{ name: 'arrow-down', width: 20, height: 20 }"
        :size="{ width: 20, height: 20 }"
      />
    </div>
    <transition name="popup-layer" mode="out-in">
      <div v-if="show" v-click-outside="showToggle" class="sidebar-select__body">
        <div
          v-for="(item, i) in list"
          :key="i"
          :class="['sidebar-select__item', { 'sidebar-select__item--active': item.name === activeType }]"
          @click="onSelect(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SquareIconBtn from '@/components/Shared/ui/SquareIconBtn.vue';

export default Vue.extend({
  name: 'FormSelect',
  components: { SquareIconBtn },
  props: {
    list: {
      type: Array,
      required: true
    },
    activeType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    showToggle() {
      if (this.list.length === 0) return;
      this.show = !this.show;
    },
    onSelect(type: any) {
      this.showToggle();
      this.$emit('change', type);
    }
  }
});
</script>

<style lang="scss"></style>

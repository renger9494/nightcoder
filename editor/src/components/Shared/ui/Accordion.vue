<template>
  <div class="accordion">
    <div class="accordion__head" :class="{ isActive }" @click="toggleAccrodion">
      <p>{{ title }}</p>
      <svg-icon name="arrow-down-icon" width="9" height="5" color="#000" />
    </div>
    <div class="accordion__body" ref="body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'accordion',
  data() {
    return {
      isActive: false
    };
  },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    toggleAccrodion(): void {
      this.isActive = !this.isActive;
      const clickedItem: any = this.$refs.body;
      const bodyHeight: number = !this.isActive ? 0 : clickedItem.scrollHeight;
      clickedItem.style.height = `${bodyHeight}px`;
    }
  }
});
</script>

<style scoped lang="scss">
.accordion {
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 15px;
    cursor: pointer;

    svg {
      width: 10px;
      height: 5px;
      transition: 0.3s;
    }

    p {
      font-size: 12px;
      line-height: 14px;
      color: $black;
    }

    &.isActive {
      svg {
        transform: scale(-1);
      }
    }
  }

  &__body {
    height: 0;
    overflow: hidden;
    transition: 0.3s;
  }
}
</style>

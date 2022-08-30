<template>
  <div class="modal" :class="{ modal_visible: isVisible }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    isVisible: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 440px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 8px 20px rgba(130, 130, 130, 0.2);
  padding-top: 35px;
  padding-right: 45px;
  padding-bottom: 40px;
  padding-left: 45px;
  transform: translate(-50%, -50%);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;

  &_visible {
    opacity: 1;
    visibility: visible;
  }
}
</style>


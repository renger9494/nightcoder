<template>
  <button
    class="loginButton"
    id="login"
    type="button"
    @click="action()"
    :disabled="isDisabled || isProcessing"
  >
    <span>{{ buttonText }}</span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    action: Function,
    isDisabled: Boolean,
    isProcessing: Boolean,
    buttonText: String,
  },
})
</script>
<style lang="scss">
.loginButton {
  width: 100%;
  background: #000000;
  border-radius: 4px;
  padding: 8px 16px;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: #ffffff;
  font-family: 'Poppins';
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, color 0.3s ease,
    box-shadow 0.3s ease;

  &:disabled {
    background: #828282;
    cursor: default;
    &:hover {
      background: #828282;
    }
  }

  &:hover {
    background: #333333;
  }
}
@media screen and (max-width: 414px) {
  .loginButton {
    font-size: 12px;
    line-height: 18px;
  }
}
</style>
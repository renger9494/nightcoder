<template>
  <div class="border-type-icon">
    <svg
      v-if="borderType === 'solid'"
      class="solid"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="2"
      viewBox="0 0 15 2"
      fill="none"
    >
      <rect width="15" height="2" rx="1" fill="black" />
    </svg>
    <svg
      v-if="borderType === 'dashed'"
      class="dashed"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="2"
      viewBox="0 0 15 2"
      fill="none"
    >
      <path d="M0 0H4V2H0V0Z" fill="black" />
      <path d="M5.5 0H9.5V2H5.5V0Z" fill="black" />
      <path d="M11 0H15V2H11V0Z" fill="black" />
    </svg>
    <svg
      v-if="borderType === 'dotted'"
      class="dotted"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="2"
      viewBox="0 0 14 2"
      fill="none"
    >
      <path
        d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1Z"
        fill="black"
      />
      <path
        d="M6 1C6 1.55228 5.55228 2 5 2C4.44772 2 4 1.55228 4 1C4 0.447715 4.44772 0 5 0C5.55228 0 6 0.447715 6 1Z"
        fill="black"
      />
      <path
        d="M10 1C10 1.55228 9.55229 2 9 2C8.44771 2 8 1.55228 8 1C8 0.447715 8.44771 0 9 0C9.55229 0 10 0.447715 10 1Z"
        fill="black"
      />
      <path
        d="M14 1C14 1.55228 13.5523 2 13 2C12.4477 2 12 1.55228 12 1C12 0.447715 12.4477 0 13 0C13.5523 0 14 0.447715 14 1Z"
        fill="black"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'BorderTypeIcon',
  props: {
    borderType: {
      required: true,
      validator: prop => typeof prop === 'string' || prop === null
    }
  }
});
</script>

<style></style>

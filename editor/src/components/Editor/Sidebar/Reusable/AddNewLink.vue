<template>
  <button>
    <svg-icon name="plus-icon" width="10" height="10" color="#949CAD" />
    Add New {{ typeOf }}
  </button>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    isImage: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      //
    };
  },
  computed: {
    typeOf(): string {
      if (this.type) return this.type;
      if (this.isImage) return 'Image';
      return 'Link';
    }
  },
  methods: {
    //
  }
});
</script>

<style lang="scss" scoped>
button {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-transform: capitalize;
  color: #949cad;
  margin-bottom: 14px;
  cursor: pointer;
}
button:hover {
  color: #4356be;
}

svg {
  margin-right: 8px;
}
button:hover path {
  fill: #4356be;
}
</style>

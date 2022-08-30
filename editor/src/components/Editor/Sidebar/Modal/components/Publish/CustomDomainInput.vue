<template>
  <div class="custom-domain">
    <label class="custom-domain__label" for="input">{{ label }}</label>
    <input v-model="inputVal" class="custom-domain__input" id="input" type="text" placeholder="Example, itmeo.com" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'custom-domain-input',
  props: {
    value: {
      type: [Number, String],
      required: true,
      default: () => ''
    },
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    inputVal: {
      set(val: string | number) {
        this.$emit('input', val);
      },
      get(): string | number {
        return this.value;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.custom-domain {
  width: 100%;

  &__label {
    display: block;
    font-size: 14px;
    line-height: 17px;
    color: #828282;
    margin: 0 0 11px;
  }

  &__input {
    border: unset;
    background: $white;
    border-radius: $shape_border_radius;
    width: 100%;
    height: 34px;
    padding: 0 6px;
    font-size: 12px;
    line-height: 15px;
    color: $black;
    border: 1px solid #dadada;
    transition: 0.3s;

    &::placeholder {
      font-size: 12px;
      line-height: 15px;
      color: #000000;
      opacity: 0.3;
    }

    &:focus {
      border-color: $blue200;
    }
  }
}
</style>

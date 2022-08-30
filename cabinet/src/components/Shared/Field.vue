<template>
  <div class="field">
    <input
      class="field__input"
      type="text"
      :placeholder="placeholder"
      :value="value"
      @keyup="onChange"
      @keyup.enter="onEnter"
    />
  </div>
</template>

<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__input {
    width: 100%;
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    background-color: #ffffff;
    border: 1px solid #dadada;
    border-radius: $shape_border_radius;
    padding-top: 6px;
    padding-right: 10px;
    padding-bottom: 7px;
    padding-left: 10px;
    outline: none;
    transition: 0.3s;
    -webkit-appearance: none;

    &:hover {
      border-color: #c4c4c4;
    }

    &:active,
    &:focus {
      border-color: #555555;
    }

    &::placeholder {
      font-size: 12px;
      color: #bdbdbd;
    }
  }
}
</style>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: String,
    onChange: Function,
    onEnter: Function,
  },
};
</script>

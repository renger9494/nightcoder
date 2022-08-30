<template>
  <div class="search">
    <svg-icon
      class="search__icon-slide"
      width="16"
      height="16"
      name="search"
    />
    <input
      class="search__input"
      :value="value"
      placeholder="Search for a template"
      @keyup="onChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    onChange: {
      type: Function,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  margin-bottom: 30px;
  width: 600px;
  // min-width: 300px;
  display: flex;
  align-items: center;
  border: 1px solid #dadada;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  transition: border-color 0.3s;
  -webkit-appearance: none;
  outline: none;
  &:hover {
    border: 1px solid #318bf5;
  }
  &:focus-within {
    border: 1px solid #318bf5;
  }
  &__input {
    display: block;
    margin-left: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #000000;
    width: 100%;

    &:focus {
      border-color: #318bf5;

      &::placeholder {
        text-indent: 10px;
        opacity: 0;
      }
    }

    &::placeholder {
      font-size: 13px;
      line-height: 16px;
      color: #000000;
      opacity: 0.4;
    }
  }

  &__icon-slide {
    opacity: 0.4;
  }
}
@media screen and (max-width: 768px) {
  .search {
    width: 100%;
    max-width: 100%;
  }
}
@media screen and (max-width: 414px) {
  .search {
    &__input {
      font-size: 12px;
      font-weight: 400;
      &::placeholder {
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
}
</style>



<template>
  <div class="favorite-empty">
    <svg-icon
      class="favorite-empty__icon"
      :name="isFav ? 'block-fav-empty' : 'block-filter-empty'"
      width="139"
      height="139"
    />
    <p v-if="isFav" class="favorite-empty__text">You haven’t added any favorites yet</p>
    <p v-else class="favorite-empty__text">Nothing is found.<br />Try searching something related.</p>
    <div class="favorite-empty__btn" @click="$emit('change')">
      <svg-icon name="arrow-left-line-icon" width="24" height="24" color="#fff" />
      <span>Back to categories</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlockCollectionEmpty',
  props: {
    isFav: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style lang="scss">
.favorite-empty {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &__text {
    margin: 0 0 $margin_l;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }

  &__btn {
    padding: 4px 16px 4px 4px;
    background: $black;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    border-radius: $shape_border_radius;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: $white;
    transition: 0.3s;

    span {
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
    }

    svg {
      margin: 0 4px 0 0;
      transition: 0.3s;
    }

    &:hover {
      background: $white;
      color: $black;

      svg {
        color: $black !important;
      }
    }
  }

  &__icon {
    margin: 0 0 $margin_l;
  }
}
</style>

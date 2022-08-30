<template>
  <div class="container" :class="{ container_large: type === 'large' }">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: static; // Because of styles from another file
  max-width: 1210px;
  width: 100%;
  padding-right: 0; // Because of styles from another file
  padding-left: 0; // Because of styles from another file
  margin-right: auto;
  margin-left: auto;

  @include xl-down {
    max-width: 986px;
  }

  @include lg-down {
    max-width: 689px;
  }

  @include sm-down {
    max-width: 500px;
  }

  @include xs-down {
    padding-right: 15px;
    padding-left: 15px;
  }

  &_large {
    max-width: 1454px;

    @include xl-down {
      max-width: 986px;
    }

    @include lg-down {
      max-width: 689px;
    }

    @include sm-down {
      max-width: 500px;
    }
  }
}
</style>

<script>
export default {
  props: {
    type: String,
  },
};
</script>

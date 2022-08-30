<template>
  <div class="affiliate-section">
    <h2 class="affiliate-section__title">
      Start earning right now, join our affiliate program.&#8194;<a href="#">
        Join&nbsp;us.
      </a>
    </h2>
    <p class="affiliate-section__text">
      Surprise your audience and tell about a new amazing project.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.affiliate-section {
  text-align: center;

  @include xs-down {
    padding-right: 15px;
    padding-left: 15px;
  }

  &__title {
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    margin-top: 0;
    margin-bottom: 10px;

    @include lg-down {
      max-width: 500px;
      margin-right: auto;
      margin-left: auto;
    }

    a {
      font-weight: 400;
      text-decoration: none;
      color: #2f80ed;
    }
  }

  &__text {
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>

<script>
export default {}
</script>

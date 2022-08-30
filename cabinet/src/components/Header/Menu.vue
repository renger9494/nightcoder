<template>
  <nav class="menu">
    <ul class="menu__list">
      <li class="menu__item">
        <a class="menu__link" href="/templates">Templates</a>
      </li>
      <li class="menu__item">
        <a class="menu__link" href="/pricing">Pricing</a>
      </li>
      <li class="menu__item">
        <a class="menu__link" href="/examples">Examples</a>
      </li>
      <li class="menu__item">
        <a class="menu__link" href="/demo">Demo</a>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.menu {
  &__list {
    display: flex;
    align-items: center;
    list-style-type: none;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  &__item {
    margin-right: 12px;

    &:last-child {
      margin-right: 0;
    }
  }

  &__link {
    display: inline-block;
    vertical-align: top;
    font-weight: 500;
    font-size: 15px;
    line-height: 22px;
    text-decoration: none;
    color: #000000;
    border-radius: $shape_border_radius;
    padding: 5px 14px 4px;
    transition: 0.3s;

    &:hover {
      background-color: #f2f2f2;
    }

    &:active {
      background-color: #dadada;
    }

    &.nuxt-link-active {
      color: #173bef;
    }
  }
}
</style>

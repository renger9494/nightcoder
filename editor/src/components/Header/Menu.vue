<template>
  <nav class="menu">
    <ul class="menu__list">
      <li class="menu__item">
        <a class="menu__link" :class="{ menu__link_active: activeLink === 'templates' }" href="/templates">
          Templates
        </a>
      </li>
      <li class="menu__item">
        <a class="menu__link" :class="{ menu__link_active: activeLink === 'pricing' }" href="/pricing"> Pricing </a>
      </li>
      <li class="menu__item">
        <a class="menu__link" :class="{ menu__link_active: activeLink === 'examples' }" href="/examples">Examples </a>
      </li>
      <li class="menu__item">
        <a class="menu__link" :class="{ menu__link_active: activeLink === 'demo' }" href="/demo">Demo </a>
      </li>
    </ul>
  </nav>
</template>

<script>
//TODO: similar component with editor\src\components\Header\MenuDropdown.vue
export default {
  props: {
    activeLink: String
  }
};
</script>

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
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    text-transform: uppercase;
    color: #000000;
    border-radius: $shape_border_radius;
    padding-top: 5px;
    padding-right: 14px;
    padding-bottom: 4px;
    padding-left: 14px;
    transition: 0.3s;

    &:hover {
      background-color: #f2f2f2;
    }

    &:active {
      background-color: #dadada;
    }

    &.menu__link_active {
      color: #ffffff;
      background-color: #000000;
    }
  }
}
</style>

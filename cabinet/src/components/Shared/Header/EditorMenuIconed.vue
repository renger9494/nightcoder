<template>
  <a class="editor-menu__iconed disabled">
    <span>{{ title }}</span>
    <client-only>
      <menu-arrow v-if="projectName" />
      <span>{{projectName}}</span>
    </client-only>
  </a>
</template>

<script>
import MenuArrow from '@/assets/icons/menu-arrow.svg?inline'
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    projectName: {
      type: String,
      default: null
    }
  },
  components: {
    MenuArrow
  }
};
</script>

<style lang="scss">
.editor-menu__iconed {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  padding: 4px 6px;
  background: transparent;
  border-radius: $shape_border_radius;
  transition: 0.3s all ease;

  &:first-of-type {
    margin-left: 0;
  }
  &.disabled {
    pointer-events: none;
  }
  &:hover {
    background: #f2f2f2;
    path {
      fill: #000000;
    }
  }
  svg {
    position: relative;
    top: 2px;
    transition: 0.3s all ease;
    opacity: 0.3;
    margin: 0 10px;
  }
  &.active {
    svg {
      transform: rotate(90deg);
    }
  }
  span {
    display: inline-block;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    color: #000000;
    max-width: 77px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

a.editor-menu__iconed {
  path {
    transition: 0.3s all ease;
  }
  &:hover {
    path {
      fill: #333;
    }
  }
}
</style>

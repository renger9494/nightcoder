<template>
  <a class="editor-menu__iconed disabled">
    <svg
      width="14px"
      height="14px"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill-rule="nonzero" stroke="#333333" stroke-width="1.2">
          <path
            d="M1,0.6 C0.7790861,0.6 0.6,0.7790861 0.6,1 L0.6,5.5942029 C0.6,5.8151168 0.7790861,5.9942029 1,5.9942029 L5.54014599,5.9942029 C5.76105989,5.9942029 5.94014599,5.8151168 5.94014599,5.5942029 L5.94014599,1 C5.94014599,0.7790861 5.76105989,0.6 5.54014599,0.6 L1,0.6 Z M8.45985401,0.6 C8.23894011,0.6 8.05985401,0.7790861 8.05985401,1 L8.05985401,5.5942029 C8.05985401,5.8151168 8.23894011,5.9942029 8.45985401,5.9942029 L13,5.9942029 C13.2209139,5.9942029 13.4,5.8151168 13.4,5.5942029 L13.4,1 C13.4,0.7790861 13.2209139,0.6 13,0.6 L8.45985401,0.6 Z M8.45985401,8.0057971 C8.23894011,8.0057971 8.05985401,8.1848832 8.05985401,8.4057971 L8.05985401,13 C8.05985401,13.2209139 8.23894011,13.4 8.45985401,13.4 L13,13.4 C13.2209139,13.4 13.4,13.2209139 13.4,13 L13.4,8.4057971 C13.4,8.1848832 13.2209139,8.0057971 13,8.0057971 L8.45985401,8.0057971 Z M1,8.0057971 C0.7790861,8.0057971 0.6,8.1848832 0.6,8.4057971 L0.6,13 C0.6,13.2209139 0.7790861,13.4 1,13.4 L5.54014599,13.4 C5.76105989,13.4 5.94014599,13.2209139 5.94014599,13 L5.94014599,8.4057971 C5.94014599,8.1848832 5.76105989,8.0057971 5.54014599,8.0057971 L1,8.0057971 Z"
          ></path>
        </g>
      </g>
    </svg>
    <span>{{ title }}</span>
  </a>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss">
.editor-menu__iconed {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  height: 30px;
  padding: 0 6px;
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
  }
  svg {
    position: relative;
    transition: 0.3s all ease;
  }
  &.active {
    svg {
      //transform: rotate(90deg);
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
    margin-right: 6px;
  }
}

a.editor-menu__iconed {
  span {
    margin-left: 10px;
  }
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

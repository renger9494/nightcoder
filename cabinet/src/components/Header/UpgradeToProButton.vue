<template>
  <a class="upgrade-to-pro-button" href="/dashboard/plans">
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12">
      <path
        fill-rule="evenodd"
        d="M9.72788 11.9676l-3.38502-1.1913-3.38502 1.1913c-.37076.1306-.75721-.1502-.74657-.5421l.09914-3.55132-2.192651-2.8201c-.241947-.31093-.0935306-.76699.285072-.87751L3.85338 3.1701 5.88193.241149c.22234-.321532.69895-.321532.92186 0L8.83234 3.1701l3.45056 1.00647c.3786.11052.527.56658.2851.87751l-2.1927 2.8201.0991 3.55132c.0107.3919-.3758.6727-.74652.5421z"
        clip-rule="evenodd"
      ></path>
    </svg>
    <span>U</span>
    <span>p</span>
    <span>g</span>
    <span>r</span>
    <span>a</span>
    <span>d</span>
    <span>e&nbsp;</span>
    <span>t</span>
    <span>o&nbsp;</span>
    <span>P</span>
    <span>R</span>
    <span>O</span>
  </a>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.upgrade-to-pro-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  background-color: #000000;
  border-radius: $shape_border_radius;
  padding: 9px 10px;
  overflow: hidden;
  min-width: fit-content;

  &:before {
    content: 'Upgrade to PRO';
    box-sizing: border-box;
    position: absolute;
    top: auto;
    left: 0;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    //text-transform: uppercase;
    color: #ffc557;
    white-space: nowrap;
    padding: 9px 10px 9px 31px;
    transition: 0.3s;
    transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
  }

  &:hover {
    &:before {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }

    span {
      opacity: 1;
      transform: translate3d(0, 0, 0);

      &:nth-child(1) {
        transition-delay: 0.045s;
      }

      &:nth-child(2) {
        transition-delay: 0.09s;
      }

      &:nth-child(3) {
        transition-delay: 0.135s;
      }

      &:nth-child(4) {
        transition-delay: 0.18s;
      }

      &:nth-child(5) {
        transition-delay: 0.225s;
      }

      &:nth-child(6) {
        transition-delay: 0.27s;
      }

      &:nth-child(7) {
        transition-delay: 0.315s;
      }

      &:nth-child(8) {
        transition-delay: 0.36s;
      }

      &:nth-child(9) {
        transition-delay: 0.405s;
      }

      &:nth-child(10) {
        transition-delay: 0.45s;
      }

      &:nth-child(11) {
        transition-delay: 0.495s;
      }

      &:nth-child(12) {
        transition-delay: 0.54s;
      }

      &:nth-child(13) {
        transition-delay: 0.585s;
      }
    }
  }

  svg {
    margin-right: 8px;

    path {
      fill: #ffc557;
    }
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #ffc557;
    transform: translate3d(0, -10px, 0);
    opacity: 0;
    transition: 0.3s;
    transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
  }
}
</style>

<template>
  <router-link to="/dashboard/plans" class="upgrade-to-pro-header">
    <svg-icon name="star-icon" width="22" height="22" color="#FD9C0C" />
    <div>
      <span>
        <span>U</span>
        <span>P</span>
        <span>G</span>
        <span>R</span>
        <span>A</span>
        <span>D</span>
        <span>E</span>
        <span>&nbsp;</span>
        <span>T</span>
        <span>O</span>
        <span>&nbsp;</span>
        <span>P</span>
        <span>R</span>
        <span>O</span>
      </span>
      <span>UPGRADE TO PRO</span>
      <span>Add power features for just $5/month</span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'UpgradeToProHeader'
};
</script>

<style lang="scss" scoped>
@mixin transition {
  $transition: 0.045;
  @for $i from 1 through 14 {
    $transition: $transition + 0.02;
    &:nth-child(#{$i}) {
      transition-delay: (#{$transition}s);
    }
  }
}
.upgrade-to-pro-header {
  display: flex;
  padding: 13px 18px 13px 14px;
  background: #000000;
  border-radius: $shape_border_radius;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-decoration: unset;

  svg {
    margin-right: 14px;
  }

  & > div {
    color: #fff;

    & > span {
      text-align: left;
      display: block;

      &:nth-child(2),
      &:nth-child(1) {
        font-weight: bold;
        font-size: 10px;
        line-height: 14px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #ffc557;
        transition: 0.3s;
      }

      &:nth-child(1) {
        position: absolute;
        span {
          color: #ffc557;
          display: inline-block;
          font-size: 10px;
          line-height: 14px;
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          opacity: 0;
          transform: translate3d(0, -5px, 0);
          transition: transform 0.3s;
          transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);

          &:empty {
            width: 2px;
          }
        }
      }

      &:last-child {
        font-size: 10px;
        line-height: 12px;
      }
    }
  }

  &:hover {
    & > div > span > span {
      @include transition;
      transition: 0.3s;
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    & > div > span {
      &:nth-child(2) {
        opacity: 0;
        transform: translate(0, 5px);
      }
    }
  }
}
</style>

<template>
  <a class="upgrade-to-pro" href="/dashboard/plans" :ref="'upgradeToPro'" target="_blank">
    <div class="upgrade-to-pro__content" :class="{ 'upgrade-to-pro__content--social': isSocialImage }">
      <slot></slot>
    </div>
    <div class="upgrade-to-pro__button">
      <svg-icon name="star-icon" width="22" height="22" color="#FD9C0C" />
      <div class="upgrade-to-pro__button-text">
        <span>U</span>
        <span>p</span>
        <span>g</span>
        <span>r</span>
        <span>a</span>
        <span>d</span>
        <span>e</span>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    arrowType: String,
    isSocialImage: {
      type: Boolean,
      default: false
    }
  },
  mounted: function() {
    document.addEventListener('add-hovered-class-to-upgrade-to-pro', this.addHoveredClass);
    document.addEventListener('remove-hovered-class-to-upgrade-to-pro', this.removeHoveredClass);
  },
  beforeDestroy: function() {
    document.removeEventListener('add-hovered-class-to-upgrade-to-pro', this.addHoveredClass);
    document.removeEventListener('remove-hovered-class-to-upgrade-to-pro', this.removeHoveredClass);
  },
  methods: {
    addHoveredClass: function() {
      this.$refs.upgradeToPro.$el.classList.add('upgrade-to-pro_hovered');
    },
    removeHoveredClass: function() {
      this.$refs.upgradeToPro.$el.classList.remove('upgrade-to-pro_hovered');
    }
  }
};
</script>

<style lang="scss" scoped>
.upgrade-to-pro {
  position: relative;
  display: block;
  width: 100%;
  text-decoration: none;
  border: 1px solid $black;
  border-radius: $shape_border_radius;
  box-shadow: 0 2px 4px rgba(57, 61, 69, 0.06);

  @include xs-down {
    min-height: 71px;
  }

  &_hovered,
  &:hover {
    .upgrade-to-pro__button {
      svg {
        fill: #fee765;
      }
    }

    .upgrade-to-pro__button-text {
      &:before {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }

      span {
        color: #fee765;
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
      }
    }
  }

  &__content {
    font-size: 13px;
    line-height: 20px;
    color: $black;
    padding: 8px 124px 7px 20px;

    &--social {
      padding: 8px 115px 7px 6px;
    }

    @include xs-down {
      padding-right: 93px;
    }
  }

  &__button {
    position: absolute;
    top: 50%;
    right: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px 12px;
    background-color: #000000;
    border-radius: $shape_border_radius;
    box-shadow: 0 8px 25px rgba(67, 67, 67, 0.5);
    transform: translateY(-50%);
    transition: 0.3s;

    @include xs-down {
      right: 6px;
    }

    svg {
      height: 12px;
      fill: #ffc557;
      margin-right: 10px;
      transition: 0.3s;
    }
  }

  &__button-text {
    position: relative;
    display: flex;

    &:before {
      content: 'Upgrade';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 10px;
      line-height: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-align: center;
      text-transform: uppercase;
      color: #ffc557;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }

    span {
      font-size: 10px;
      line-height: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-align: center;
      text-transform: uppercase;
      color: #ffc557;
      opacity: 0;
      transform: translate3d(0, -10px, 0);
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }
  }

  &__arrow {
    position: absolute;
    transform: translateY(-152%);

    @include xs-down {
      display: none;
    }

    &_short {
      width: 48px;
      top: 6px;
      right: 14px;
    }

    &_long {
      width: 95px;
      top: -15px;
      right: 34px;
    }
  }
}
.favicon {
  .upgrade-to-pro__arrow_long {
    top: 35px;
  }
}
</style>

<style lang="scss">
.upgrade-to-pro {
  &__content {
    span {
      font-weight: 500;
    }
  }
}
</style>

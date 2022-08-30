<template>
  <div class="made-with" :class="classesMadeWith" @click="onClick(theme)">
    <div class="made-with__text">Made with</div>
    <div class="made-with__footer">
      <div class="made-with__logo">
        <span>a</span>
        <span>i</span>
        <span>r</span>
        <span>t</span>
        <span>a</span>
        <span>p</span>
      </div>
      <div class="made-with__circle">
        <svg-icon class="made-with__arrow" name="arrow-right-line-icon" width="6" height="5" color="#fff" />
      </div>
    </div>
  </div>
</template>

<script>
//TODO: we have several similar components, we need to choose one of this:
//1. src/components/SiteSettings/MadeWithAirtap.vue
//2. src/components/Publish/Elements/Branding.vue

export default {
  props: {
    onClick: Function,
    theme: {
      type: String,
      default: 'White'
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    classesMadeWith() {
      return {
        'made-with_black': this.theme === 'Black',
        'made-with_white': this.theme === 'White',
        'made-with_active': this.isActive
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Muli:900');

.made-with {
  position: relative;
  width: 97px;
  border-radius: 6px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  padding-top: 10px;
  padding-right: 14px;
  padding-bottom: 10px;
  padding-left: 10px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);

    .made-with__logo {
      &:before {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }

      span {
        opacity: 1;
        transform: translateY(0px);

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

  &__text {
    display: block;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.3px;
    font-weight: 500;
    margin-bottom: 7px;
  }

  &__footer {
    display: flex;
    align-items: center;
  }

  &__logo {
    position: relative;
    font-family: 'Muli';
    font-weight: 900;
    font-size: 16px;
    width: 53px;
    margin-right: 7px;

    &::before {
      content: 'airtap';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: inherit;
      line-height: inherit;
      font-weight: inherit;
      letter-spacing: inherit;
      text-align: inherit;
      text-transform: inherit;
      color: inherit;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }

    span {
      display: inline-block;
      opacity: 0;
      transform: translateY(-10px);
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
      font-weight: inherit;
      font-size: inherit;
    }
  }

  &__circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15px;
    height: 15px;
    background-color: #173bef;
    border-radius: 50%;
  }

  &__arrow {
    width: 6px;
    fill: #ffffff;
    margin-right: 0.5px;
  }
}

.made-with.made-with_white {
  border: 1px solid #fff;
  background: #fff;

  .made-with__text,
  .made-with__logo {
    color: #000;
  }
}

.made-with.made-with_black {
  border: 1px solid #000;
  background: #000;

  .made-with_active {
    border: 1px solid #4256be;
  }
  .made-with__text,
  .made-with__logo {
    color: #fff;
  }
}

.made-with.made-with_active {
  border: 1px solid #4256be;
  box-shadow: 0px 12px 30px rgba(130, 130, 130, 0.15);

  &::after {
    position: absolute;
    top: -16px;
    right: -16px;
    content: '';
    background: #4256be;
    border-radius: 100%;
    width: 24px;
    height: 24px;
  }
}
</style>

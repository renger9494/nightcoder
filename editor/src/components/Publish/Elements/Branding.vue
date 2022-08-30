<template>
  <a href="https://airtap.io/" target="_blank" class="made-with" :class="classesMadeWith" @click="openSettings">
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
        <svg width="6" height="5" fill="none" xmlns="http://www.w3.org/2000/svg" class="made-with__arrow">
          <path
            d="M5.955 2.261a.635.635 0 00-.13-.204L4.024.183a.584.584 0 00-.849 0 .643.643 0 000 .884l.776.808H.6c-.332 0-.6.28-.6.625s.268.625.6.625h3.352l-.776.808a.643.643 0 000 .884.584.584 0 00.849 0l1.8-1.875a.65.65 0 00.13-.681z"
            fill="#fff"
          />
        </svg>
      </div>
    </div>
  </a>
</template>

<script lang="ts">
//TODO: we have several similar components, we need to choose one of this:
//1. src/components/SiteSettings/MadeWithAirtap.vue
//2. src/components/Publish/Elements/Branding.vue
import { computed, defineComponent } from '@vue/composition-api';

const BrandingThemeType = {
  White: 'White',
  Black: 'Black'
};

const BrandingPositionType = {
  BottomRight: 'BottomRight',
  BottomLeft: 'BottomLeft'
};

export default defineComponent({
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    openSettings: {
      type: Function,
      default: () => {}
    },
    isOuter: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const classesMadeWith = computed(() => {
      return {
        'made-with_black': props.value.theme === BrandingThemeType.Black,
        'made-with_white': props.value.theme === BrandingThemeType.White,
        'made-with_br': props.value.position === BrandingPositionType.BottomRight,
        'made-with_bl': props.value.position === BrandingPositionType.BottomLeft
      };
    });

    return {
      classesMadeWith
    };
  }
});
</script>

<style lang="scss">
.made-with {
  position: fixed;
  font-family: 'Muli', sans-serif;
  font-weight: 900;
  text-decoration: none;
  width: 97px;
  border-radius: 6px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 14px 10px 10px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  z-index: 9999;
  height: 59px;
}
.made-with:hover {
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.25);
}
.made-with:hover .made-with__logo:before {
  opacity: 0;
  transform: translate3d(0, 100%, 0);
}
.made-with:hover .made-with__logo span {
  opacity: 1;
  transform: translateY(0px);
}
.made-with:hover .made-with__logo span:nth-child(1) {
  transition-delay: 0.045s;
}
.made-with:hover .made-with__logo span:nth-child(2) {
  transition-delay: 0.09s;
}
.made-with:hover .made-with__logo span:nth-child(3) {
  transition-delay: 0.135s;
}
.made-with:hover .made-with__logo span:nth-child(4) {
  transition-delay: 0.18s;
}
.made-with:hover .made-with__logo span:nth-child(5) {
  transition-delay: 0.225s;
}
.made-with:hover .made-with__logo span:nth-child(6) {
  transition-delay: 0.27s;
}
.made-with:hover .made-with__logo span:nth-child(7) {
  transition-delay: 0.315s;
}
.made-with__text {
  display: block;
  font-size: 10px;
  line-height: 1;
  letter-spacing: 0.3px;
  margin-bottom: 7px;
  font-weight: 900;
}
.made-with__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.made-with__logo {
  position: relative;
  font-family: 'Muli', sans-serif;
  display: flex;
  font-weight: 900;
  font-size: 16px;
  width: 53px;
}
.made-with__logo::before {
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
.made-with__logo span {
  display: inline-block;
  opacity: 0;
  transform: translateY(-10px);
  transition: 0.3s;
  transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
}
.made-with__circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  background-color: #173bef;
  border-radius: 50%;
}
.made-with__arrow {
  width: 6px;
  fill: #fff;
  margin-right: 0.5px;
}
.made-with.made-with_white {
  border: 1px solid #fff;
  background: #fff;
}
.made-with.made-with_white .made-with__text,
.made-with.made-with_white .made-with__logo {
  color: #000;
}
.made-with.made-with_black {
  border: 1px solid #000;
  background: #000;
}
.made-with.made-with_black .made-with_active {
  border: 1px solid #4256be;
}
.made-with.made-with_black .made-with__text,
.made-with.made-with_black .made-with__logo {
  color: #fff;
}
.made-with_br {
  bottom: 30px;
  right: 30px;
}
.made-with_bl {
  bottom: 30px;
  left: 30px;
}
</style>

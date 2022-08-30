<template>
  <div class="onboarding">
    <div class="onboarding__item" :class="item.textClass" v-for="(item, index) in list" :key="index">
      <div class="onboarding__item-close">
        <svg-icon name="close" width="8" height="8" color="#BDBDBD" />
      </div>
      <div class="onboarding__item-top">
        <div class="onboarding__item-col">
          <img
            class="onboarding__item-img"
            :src="require(`@/assets/img/editor/onboarding/on_${index}.jpg`)"
            alt="img"
            width="200"
            height="170"
          />
        </div>
        <div class="onboarding__item-col">
          <p class="onboarding__item-title">{{ item.title }}</p>
          <p class="onboarding__item-text">{{ item.text }}</p>
        </div>
      </div>
      <div class="onboarding__item-bottom">
        <div class="onboarding__item-col">
          <ul class="onboarding__item-list">
            <li
              class="onboarding__item-bullet"
              v-for="(itemB, indexB) in list"
              :key="indexB"
              :class="{ active: indexB === index }"
            ></li>
          </ul>
        </div>
        <div class="onboarding__item-col">
          <div class="onboarding__item-action">
            <p class="onboarding__item-skip" v-if="index !== 5">Skip intro</p>
            <button class="onboarding__item-btn" :class="{ 'prev-btn-on': index !== 0 }" v-if="index !== 5">
              <svg-icon
                name="arrow_btn"
                width="16"
                height="16"
                color="#000"
                :style="`transform: rotate(-180deg); opacity: ${index === 0 ? '0.3' : '1'};`"
              />
              <span :style="`opacity: ${index === 0 ? '0.3' : '1'};`">{{ index === 5 ? 'Got it!' : 'Next' }}</span>
            </button>
            <button class="onboarding__item-btn" :class="{ 'next-btn-on': index !== 5, 'close-btn-on': index === 5 }">
              <span>{{ index === 5 ? 'Got it!' : 'Next' }}</span>
              <svg-icon name="arrow_btn" width="16" height="16" color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapState, mapMutations } from 'vuex';
import { ElementType } from '@/store/elements/create';
import cookies from '@/utils/cookies';

export default Vue.extend({
  name: 'Onboarding',
  data() {
    return {
      list: [
        {
          title: 'Instruments 💪🏻',
          text:
            'Feel the power of our toolbar panel, where you can add elements and build your site exactly the way you want.',
          class: '.elements-bar__list',
          textClass: 'onboarding__item--0',
          direction: 'right',
          padding: 0,
          offset: [0, 20]
        },
        {
          title: 'Ready-to-use blocks 💥',
          text: "Fully customizable blocks for your awesome pages. Add, edit and don't deny yourself anything.",
          class: '.elements-bar__list--block',
          textClass: 'onboarding__item--1',
          direction: 'right',
          padding: 3,
          offset: [80, 20]
        },
        {
          title: 'Layers 🍔',
          text:
            'With layers, you can replace, delete or hide your objects. Now imagine your favourite burger, where you can add or remove toppings whatever you like.',
          class: '.layers-btn',
          textClass: 'onboarding__item--2',
          direction: 'right',
          padding: 10,
          offset: [-125, 30]
        },
        {
          title: 'Element settings 🎨',
          text:
            'Hope you’ll love it as we do! Here you can customize added elements - from position on the page to shadow settings.',
          class: '.template_nav',
          textClass: 'onboarding__item--3',
          direction: 'left',
          padding: 0,
          offset: [0, 20]
        },
        {
          title: 'Responsive design 😍',
          text: 'In this dropdown you can make equally awesome website on all devices.',
          class: '.adaptive-buttons-block',
          textClass: 'onboarding__item--4',
          direction: 'top',
          padding: 10,
          offset: [0, 30]
        },
        {
          title: 'Publish your website 🎉 ',
          text:
            'Publish your project for quick interaction. The project is published without a code.\n\nAfter publishing you can showcase your website and get tons of followers and work offers. Discover more.',
          class: '.publish-btn-wrap',
          textClass: 'onboarding__item--5',
          direction: 'top',
          padding: 15,
          offset: [-200, 35]
        }
      ] as Array<any>,
      tour: null as any
    };
  },
  mounted() {
    this.initOnboarding();
    this.onTourEnd();
  },
  computed: {
    ...mapState({
      selectedBlocks: (state: any) => state.editor.selectedBlocks,
      components: (state: any) => state.editor.userConfig.components,
      blockInViewPortId: (state: any) => state.editor.blockInViewPortId,
      selectedElements: (state: any) => state.editor.selectedElements
    })
  },
  methods: {
    ...mapActions({
      createElement: 'editor/createElement',
      proceedElementClick: 'editor/proceedElementClick'
    }),
    ...mapMutations({
      cleanSelectedBlocks: 'editor/cleanSelectedBlocks',
      addBlockIntoSelected: 'editor/addBlockIntoSelected',
      removeElement: 'editor/removeElement',
      cleanSelectedElements: 'editor/cleanSelectedElements',
      changeOnboardingActiveType: 'ui/changeOnboardingActiveType'
    }),
    initOnboarding() {
      this.$nextTick(() => {
        this.tour = this.$shepherd({
          useModalOverlay: true,
          exitOnEsc: true,
          keyboardNavigation: true
        });

        for (const item of this.list) {
          const text = document.querySelector(`.${item.textClass}`);
          if (text) {
            const step = {
              title: '',
              attachTo: { element: item.class as string, on: item.direction as string },
              text,
              popperOptions: {
                modifiers: [{ name: 'offset', options: { offset: item.offset } }]
              },
              when: {
                show: async () => {
                  if (item.textClass === 'onboarding__item--3') {
                    const coords = { x: 50000, y: 0 };
                    this.cleanSelectedBlocks();
                    this.addBlockIntoSelected(this.components[0]);
                    await this.$nextTick();
                    this.createElement({
                      element: ElementType.Image,
                      block: this.selectedBlocks[0],
                      coords
                    }).then(element => {
                      this.proceedElementClick({ element });
                    });
                  }
                  if (item.textClass === 'onboarding__item--4') {
                    this.selectedElements.forEach((el: any) => this.removeElement(el.element));
                    await this.$nextTick();
                    this.cleanSelectedElements();
                  }
                }
              },
              modalOverlayOpeningPadding: item.padding
            };
            this.tour.addStep(step);
          }
        }
        this.tour.start();
        this.initClicks();
      });
    },
    initClicks() {
      const items = document.querySelectorAll('.onboarding__item');
      for (const item of items) {
        const close = item.querySelector('.onboarding__item-close');
        const skip = item.querySelector('.onboarding__item-skip');
        const next = item.querySelector('.next-btn-on');
        const prev = item.querySelector('.prev-btn-on');
        const finish = item.querySelector('.close-btn-on');
        if (close) close.addEventListener('click', this.close);
        if (skip) skip.addEventListener('click', this.close);
        if (finish) finish.addEventListener('click', this.close);
        if (next) next.addEventListener('click', this.next);
        if (prev) prev.addEventListener('click', this.prev);
      }
    },
    async close() {
      if (!this.tour) return;
      this.tour.cancel();
      cookies.setItem('isHelperShown', true, Infinity, '/', '', '');
      this.selectedElements.forEach((el: any) => this.removeElement(el.element));
      await this.$nextTick();
      this.cleanSelectedElements();
    },
    next() {
      if (!this.tour) return;
      this.tour.next();
    },
    prev() {
      if (!this.tour) return;
      this.tour.back();
    },
    async onTourEnd() {
      await this.$nextTick();
      if (!this.tour) return;
      this.tour.on('complete', this.hideTour);
      this.tour.on('cancel', this.hideTour);
      this.tour.on('close', this.hideTour);
      this.changeOnboardingActiveType(false);
    },
    hideTour() {
      cookies.setItem('isHelperShown', true, Infinity, '/', '', '');
      this.changeOnboardingActiveType(false);
    }
  }
});
</script>

<style lang="scss">
.shepherd-element {
  max-width: 500px;
  border-radius: $shape_border_radius;
}
.shepherd-text {
  padding: 20px;
}
.shepherd-modal-overlay-container {
  z-index: 9999;
}
.onboarding {
  position: absolute;
  left: -3500px;
  top: -3500px;
  z-index: 100000;
  width: 100%;
  height: 100%;

  &__item {
    background: $white;
    max-width: 500px;
    position: relative;
    &:not(:last-child) {
      margin: 0 auto 10px;
    }

    &-close {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      background: $gray100;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;

      svg {
        transition: 0.3s;
      }

      &:hover {
        svg {
          color: $black !important;
        }
      }
    }
    &-title {
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
      margin: 0 0 16px;
    }
    &-text {
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      white-space: pre-wrap;
    }
    &-top {
      margin: 0 0 20px;
    }
    &-bottom {
      padding: 20px 0 0;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        left: -20px;
        top: 0;
        width: calc(100% + 40px);
        height: 1px;
        background: $gray100;
      }

      .onboarding__item-col {
        &:first-child {
          flex: 0 0 100px;
        }
      }
    }
    &-top,
    &-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &-col {
      flex: 1;
      &:first-child {
        flex: 0 0 200px;
        margin: 0 20px 0 0;
      }
    }
    &-action {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    &-skip {
      font-weight: 700;
      font-size: 10px;
      line-height: 15px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-feature-settings: 'liga' off;
      color: $gray500;
      margin: 0 16px 0 0;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        color: $black;
      }
    }
    &-btn {
      cursor: pointer;
      padding: 6px 10px;
      background: $black;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
      border-radius: $shape_border_radius;
      display: flex;
      align-items: center;
      transition: 0.3s;
      svg {
        margin: 0 0 0 8px;
      }

      &:nth-child(2) {
        margin: 0 16px 0 0;
        border: 1px solid $gray100;
        background: transparent;
        box-shadow: none;

        span {
          color: $black;
        }
        svg {
          margin: 0 8px 0 0;
        }
      }

      &:hover {
        opacity: 0.5;
      }

      span {
        color: $white;
        font-weight: 700;
        font-size: 10px;
        line-height: 15px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        font-feature-settings: 'liga' off;
      }
    }
    &-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, 6px);
      grid-gap: 0 10px;
      width: 100%;
    }
    &-bullet {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $gray300;
      &.active {
        background: $black;
      }
    }
    &-img {
      max-width: 100%;
    }
  }
}
</style>

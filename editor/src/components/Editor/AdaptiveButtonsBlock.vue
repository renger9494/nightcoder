<template>
  <div class="adaptive-buttons-block">
    <div class="adaptive-buttons-block__head" :class="{ isPopupVisible }" @click="isPopupVisible = !isPopupVisible">
      <div class="adaptive-buttons-block__dot" />
      <div class="adaptive-buttons-block__icon">
        <svg-icon
          :name="`${previewMode}-icon`"
          :width="dynamicIconSizes[previewMode].width"
          :height="dynamicIconSizes[previewMode].height"
          :color="dynamicIconSizes[previewMode].color"
        />
      </div>
      <p class="adaptive-buttons-block__breakpoint">{{ breakpointData[previewMode].name }}</p>
      <svg-icon name="arrow-down-icon" width="9" height="5" color="#000" />
    </div>
    <div
      class="adaptive-buttons-block__body"
      :class="{ isPopupVisible }"
      v-click-outside="() => (isPopupVisible = false)"
    >
      <div
        class="adaptive-buttons-block__btn"
        v-for="(value, key) in adaptives"
        :key="key"
        @click="selectAdaptive(value)"
      >
        <div class="adaptive-buttons-block__icon">
          <svg-icon
            :name="`${value}-icon`"
            :width="dynamicIconSizes[value].width"
            :height="dynamicIconSizes[value].height"
            :color="dynamicIconSizes[value].color"
          />
        </div>
        <p>{{ breakpointData[value].size }} <span>px</span></p>
        <p>{{ breakpointData[value].name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import breakpointNames from '@/constants/breakpoints';
import ObjectKeys from '@/utils/types/ObjectKeys';
import { dynamicIconSizes } from '@/constants/dynamicIconSizes';

export default Vue.extend({
  props: {
    isEditor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPopupVisible: false,
      adaptives: breakpointNames,
      alert: false,
      adaptivesState: {
        lg: false,
        laptop: false,
        tablet: false,
        mobile: false
      } as ObjectKeys<boolean>,
      dynamicIconSizes,
      breakpointData: {
        laptop: {
          name: 'Desktop',
          size: '1280'
        },
        tablet: {
          name: 'Tablet',
          size: '768'
        },
        mobile: {
          name: 'Mobile',
          size: '375'
        }
      }
    };
  },
  mounted() {
    this.checkUnavailability();

    window.addEventListener('resize', this.checkUnavailability);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkUnavailability);
  },
  computed: {
    previewMode(): string {
      return this.$store.state.editor.previewMode;
    }
  },
  watch: {
    isEditor() {
      this.checkUnavailability();
    }
  },
  methods: {
    checkUnavailability() {
      const wrapper = window;
      if (wrapper) {
        this.adaptives.map(el => {
          let width;
          switch (el) {
            case 'laptop':
              width = 1280;
              break;
            case 'tablet':
              width = 768;
              break;
            case 'mobile':
              width = 375;
              break;
          }

          // this.adaptivesState[el] = wrapper.innerWidth < width; разрешить все брейкпоинты везде
        });
      } else {
        console.warn('checkUnavailability failed');
      }
    },
    showAlert() {
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      }, 1000);
    },
    async selectAdaptive(value: string) {
      this.isPopupVisible = false;
      const templateWrapper = document.querySelector('.template_wrapper');
      if (!templateWrapper) return;
      const templateWrapperScrollTop = templateWrapper.scrollTop;
      const templateWrapperScrollHeight = templateWrapper.scrollHeight;
      const oldScrollPercentage = +((templateWrapperScrollTop / templateWrapperScrollHeight) * 100).toFixed(3);
      this.$store.commit('editor/dropAllAPs');
      this.$store.commit('editor/SET_PREVIEW_MODE', value);
      // i'd change $nextTick to setTimeOut but it works kind of buggy
      await this.$nextTick();
      await this.$nextTick();
      await this.$nextTick();
      if (templateWrapperScrollTop > 1000) {
        const templateWrapperScrollHeightNew = templateWrapper.scrollHeight;
        templateWrapper.scrollTop = +((templateWrapperScrollHeightNew * oldScrollPercentage) / 100).toFixed(3);
      } else {
        templateWrapper.scrollTop = templateWrapperScrollTop;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.adaptive-buttons-block {
  position: relative;
  &__head {
    display: flex;
    align-items: center;
    padding: 5px 8px;
    background: $gray100;
    border-radius: $shape_border_radius;
    cursor: pointer;
    &.isPopupVisible {
      pointer-events: none;
    }
  }
  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ffc557;
    margin: 0 4px 0 0;
  }
  &__breakpoint {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin: 0 4px 0 0;
  }
  &__body {
    position: absolute;
    left: 50%;
    bottom: -4px;
    transform: translate(-50%, 100%);
    background: $white;
    border: 1px solid $gray300;
    box-shadow: $shadow_popup;
    border-radius: 4px;
    padding: 4px;
    width: 168px;
    transition: 0.3s;
    opacity: 0;
    visibility: hidden;
    &.isPopupVisible {
      opacity: 1;
      visibility: visible;
    }
  }
  &__btn {
    display: flex;
    align-items: center;
    max-width: 160px;
    width: 100%;
    padding: 4px;
    transition: 0.3s;
    border-radius: $shape-border_radius;
    cursor: pointer;

    &:hover {
      background: $gray100;
    }

    p {
      span {
        font-weight: 400;
        font-size: 10px;
        line-height: 12px;
        color: $gray700;
      }
      &:nth-child(2) {
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        color: $black;
        margin: 0 auto 0 0;
      }
      &:nth-child(3) {
        font-weight: 400;
        font-size: 10px;
        line-height: 12px;
        color: $gray700;
      }
    }
  }
  &__icon {
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
    margin: 0 8px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

<template>
  <div class="zoom-control-wrap" tabindex="0" @keydown.esc.stop.prevent.exact="showZoomPopup = false">
    <div v-tooltip="'Zoom/view options'" @click.exact="openZoomPopup" :class="{ active: showZoomPopup, focused: isFieldFocused }" class="zoom-control">
      <div class="zoom-control__field">
        <svg-icon name="search-icon" width="18" height="18" color="#000" />
        <input
          v-model="zoom"
          type="number"
          class="zoom-control__input"
          @focus="isFieldFocused = true"
          @blur="isFieldFocused = false"
        />
        <span>%</span>
      </div>
      <svg-icon name="arrow-down-icon" width="9" height="5" color="#B3B3B3" />
    </div>
    <transition name="popup-layer" mode="out-in">
      <div
        v-if="showZoomPopup"
        v-click-outside="() => (showZoomPopup = false)"
        class="zoom-control-popup"
      >
        <div class="zoom-control-popup__item" @click="zoomStep('in')">
          <span>Zoom In</span>
          <span>
            <svg-icon name="command-icon" width="10" height="10" color="#949CAD" />
            +
          </span>
        </div>
        <div class="zoom-control-popup__item" @click="zoomStep('out')">
          <span>Zoom Out</span>
          <span>
            <svg-icon name="command-icon" width="10" height="10" color="#949CAD" />
            -
          </span>
        </div>
        <div class="zoom-control-popup__item" @click="defaultZoom">
          <span>Zoom to 100%</span>
          <span>
            <svg-icon name="command-icon" width="10" height="10" color="#949CAD" />
            0
          </span>
        </div>
        <div class="zoom-control-popup__item" @click="fitZoom">
          <span>Zoom to Fit</span>
          <span>
            <svg-icon name="command-icon" width="10" height="10" color="#949CAD" />
            1
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
//TODO: add correct types in future
import Vue from 'vue';

export default Vue.extend({
  name: 'ZoomControl',
  data: () => ({
    showZoomPopup: false,
    isFieldFocused: false,
  }),
  computed: {
    zoom: {
      get(): number {
        return Math.floor(this.$store.state.editor.zoom * 100);
      },
      set(val: number) {
        this.$store.commit('editor/changeEditorParam', {
          path: 'zoom',
          value: Number(val / 100).toFixed(2)
        });
      }
    }
  },
  methods: {
    openZoomPopup(e: any) {
      this.showZoomPopup = !this.showZoomPopup;
    },
    zoomStep(to: string) {
      const delta = to === 'in' ? -125 : 125;

      this.$store.commit('editor/changeTemplateZoom', {
        delta,
        pointer: null,
        editorAreaRect: null
      });
    },
    defaultZoom() {
      this.$store.commit('editor/changeTemplateZoom', {
        delta: 'default',
        pointer: null,
        editorAreaRect: null
      });
    },
    fitZoom() {
      const wrapper = <any>document.querySelector('.template_wrapper');
      const editorAreaWrapper = document.querySelector('.editor-area-wrapper');
      const template = <any>document.querySelector('.editor-area');

      const wrapperWidth = wrapper.clientWidth;
      const templateWidth = template.getBoundingClientRect().width;
      const templateFullWidth = templateWidth + (template.getBoundingClientRect().width / 100) * 20;

      this.initZoom(wrapperWidth, templateFullWidth).then(() => {
        this.scrollEditorIntoView();
      });
    },
    async initZoom(wrapperWidth: number, templateFullWidth: number) {
      this.$store.commit('editor/changeEditorParam', {
        path: 'zoom',
        value: Number((wrapperWidth / templateFullWidth).toFixed(2))
      });
    },
    scrollEditorIntoView() {
      const templWrapper = <any>document.querySelector('[class="template_wrapper"]');
      templWrapper.scrollLeft = 0;
      const editor = <any>document.getElementById('editor');
      editor.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'center'
      });
      const editorRect = editor.getBoundingClientRect();
      if (editorRect.x > 300) {
        templWrapper.scrollLeft += (editorRect.x - 300) / 2;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.zoom-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 0 10px;
  transition: all 0.3s ease;
  border-radius: $shape_border_radius;
  cursor: pointer;
  border: 1px solid transparent;
  svg {
    transition: all 0.3s ease;
    &:first-child {
      margin: 0 8px 0 0;
      width: 12px;
      height: 12px;
    }
    &:last-child {
      margin: 0 0 0 6px;
      width: 8px;
      height: 5px;
    }
  }
  &.active {
    pointer-events: none;
    svg:last-child {
      transform: rotate(90deg);
    }
  }
  &.focused {
    border-color: $color_input_overlay_border_focus;
    background: transparent !important;
  }
  &__field {
    display: flex;
    align-items: center;
    margin-left: -2px;
    input,
    span {
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 16px;

      color: #000000;
    }
    input {
      width: 23px;
      margin-right: 1.5px;
      text-align: right;
    }
  }
  &:hover {
    background: #f3f3f3;
  }
  &-popup {
    position: absolute;
    z-index: 999;
    width: 180px;
    top: calc(100% + 10px);
    background: #ffffff;
    border: 1px solid #dadada;
    box-sizing: border-box;
    box-shadow: $shadow_popup;
    border-radius: $shape_border_radius;
    padding: 6px;
    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: $shape_border_radius;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #f3f3f3;
      }
      span {
        &:first-of-type {
          font-style: normal;
          font-weight: normal;
          font-size: 13px;
          line-height: 15px;
          color: #000000;
        }
        &:last-of-type {
          width: 21px;
          svg {
            margin-right: 2px;
          }
          display: inline-flex;
          align-items: center;
          font-style: normal;
          font-weight: normal;
          font-size: 13px;
          line-height: 15px;
          text-align: right;

          color: #949cad;
        }
      }
    }
  }
  &-wrap {
    outline: none;
    position: relative;
    padding-right: 10px;
    margin-right: 10px;
  }
}
</style>

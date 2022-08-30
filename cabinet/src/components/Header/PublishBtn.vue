<template>
  <div class="publish-btn-wrap" ref="popupButton">
    <button
      @click="showPublishPopup"
      :class="{ active: show }"
      class="publish-btn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M5.99962 0C2.6865 0.00075 0.00075 2.6865 0 5.99962C0.00075 9.31388 2.6865 11.9996 5.99962 12C9.31388 11.9993 11.9996 9.31388 12 5.99962C11.9996 2.6865 9.31388 0.00075 5.99962 0ZM4.32413 1.02975C3.91988 1.49625 3.486 2.14575 3.156 3.00038H1.69762C2.334 2.08988 3.25087 1.39237 4.32413 1.02975ZM1.26412 3.75H2.91C2.76225 4.30237 2.66663 4.92825 2.64 5.625H0.7695C0.817875 4.95713 0.99 4.32525 1.26412 3.75ZM0.7695 6.37537H2.64C2.66663 7.07212 2.76225 7.69763 2.91 8.25H1.26487C0.99075 7.67475 0.81825 7.04362 0.7695 6.37537ZM1.69875 9H3.15637C3.486 9.85312 3.91913 10.5026 4.32338 10.9688C3.25088 10.6065 2.33475 9.90975 1.69875 9ZM5.625 11.1709C5.2725 10.9069 4.50338 10.2338 3.96263 9H5.625V11.1709ZM5.625 8.24963H3.68625C3.52575 7.71075 3.4185 7.08563 3.38812 6.375H5.625V8.24963ZM5.625 5.625H3.39C3.42037 4.911 3.53025 4.28888 3.69187 3.75H5.625V5.625ZM5.625 3.00038H3.96075C4.15875 2.54925 4.38713 2.17237 4.61438 1.863C4.92188 1.44525 5.22862 1.15013 5.45475 0.9615C5.52 0.9075 5.5755 0.86475 5.625 0.828V3.00038ZM11.2294 5.625H9.36C9.33337 4.92788 9.23775 4.30237 9.08925 3.75H10.7351C11.0089 4.32525 11.1818 4.95713 11.2294 5.625ZM10.3024 3.00038H8.844C8.51363 2.14538 8.08012 1.49588 7.6755 1.02975C8.7495 1.39237 9.66638 2.08988 10.3024 3.00038ZM6.375 3.00075V0.8295C6.72787 1.09387 7.49662 1.76738 8.03775 3.00113L6.375 3.00075ZM6.375 3.75H8.31338C8.47425 4.28888 8.58113 4.91437 8.6115 5.625H6.375V3.75ZM6.375 6.375H8.60962C8.57925 7.08825 8.46937 7.71075 8.30775 8.24963H6.375V6.375ZM6.54487 11.0385C6.47962 11.0925 6.42413 11.1345 6.375 11.1716V9.00037H8.03925C7.84162 9.45113 7.6125 9.82763 7.38525 10.137C7.07812 10.5544 6.77137 10.8503 6.54487 11.0385ZM7.67663 10.9688C8.0805 10.5026 8.51363 9.85312 8.84363 9H10.3016C9.66488 9.90975 8.74913 10.6065 7.67663 10.9688ZM10.7347 8.24963H9.09C9.23738 7.69763 9.333 7.07212 9.36 6.375H11.2294C11.181 7.04287 11.0089 7.67438 10.7347 8.24963Z"
          fill="black"
        />
      </svg>
      <span
        v-if="isHasUnpublishedChanges"
        class="is-has-unpublished-changes"
      ></span>
      <span>Publish</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="7"
        height="5"
        viewBox="0 0 7 5"
        fill="none"
      >
        <path d="M3.5 5L0 -4.76837e-07H7L3.5 5Z" fill="#949CAD" />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  props: {
    isHasUnpublishedChanges: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    show: false,
  }),
  computed: {
    ...mapState({
      popupSettings: (state: any) => state.ui.popupSettings,
    }),
  },
  watch: {
    popupSettings: {
      deep: true,
      handler() {
        if (this.popupSettings.active === false) {
          this.show = this.popupSettings.active
        }
      },
    },
  },
  methods: {
    showPublishPopup() {
      this.show = !this.show
      this.$store.commit('ui/SET_POPUP_SETTINGS', {
        active: this.show,
        closeButton: true,
        header: 'Publish settings',
        content: 'Publish',

        location: (<HTMLDivElement>(
          this.$refs.popupButton
        )).getBoundingClientRect(),
        data: {
          isUnderHeader: true,
        },
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.publish-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  width: 100px;
  height: 30px;
  background: #fff;
  border-radius: $shape_border_radius;
  cursor: pointer;
  svg:last-of-type {
    transition: transform 0.2s ease;
  }
  &.active {
    svg:last-of-type {
      transform: rotate(-90deg);
      path {
        fill: #000000;
      }
    }
  }
  .is-has-unpublished-changes {
    position: absolute;
    top: 7px;
    left: 5px;
    background-color: red;
    height: 4px;
    width: 4px;
    border-radius: 10px;
  }
  span {
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;

    color: #000000;
  }
  &:hover {
    background: #f3f3f3;
  }
}
</style>

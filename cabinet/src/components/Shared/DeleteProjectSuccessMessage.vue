<template>
  <div
    class="delete-project-success-message"
    :class="{ 'delete-project-success-message_visible': isVisible }"
    @click="closeMessage"
  >
    <div class="delete-project-success-message__side">
      <div class="delete-project-success-message__circle">
        <svg
          class="delete-project-success-message__circle-svg"
          width="41"
          height="41"
        >
          <circle
            class="
              delete-project-success-message__circle-progress
              delete-project-success-message__circle-progress_path
            "
            cx="20.5"
            cy="20.5"
            r="19"
          ></circle>
          <circle
            class="
              delete-project-success-message__circle-progress
              delete-project-success-message__circle-progress_fill
            "
            cx="20.5"
            cy="20.5"
            r="19"
            ref="circleProgressFill"
          ></circle>
        </svg>
        <span class="delete-project-success-message__circle-number">
          {{ currentSecond }}
        </span>
      </div>
      <span class="delete-project-success-message__text">
        {{ modalType }} deleted
      </span>
    </div>
    <div class="delete-project-success-message__side"></div>
    <div class="delete-project-success-message__undo-button" @click="restore">
      <div class="delete-project-success-message__undo-button-text">Undo</div>
      <div class="delete-project-success-message__undo-button-icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="8"
          fill="none"
        >
          <path
            fill="#2F80ED"
            d="M3.03333 3C5.06667 3 6.7 4.63333 6.7 6.66667v1c0 .2.13333.33333.33333.33333H7.7c.2 0 .33333-.13333.33333-.33333v-1c0-2.76667-2.23333-5-5-5h-.2C2.7 1.66667 2.6 1.5 2.7 1.36667l.33333-.33334C3.1.966667 3.13333.9 3.13333.8S3.1.633333 3.03333.566667L2.56667.1C2.5.0333333 2.43333 0 2.33333 0S2.16667.0333333 2.1.1l-2 2c-.0666667.06667-.1.16667-.1.23333 0 .1.0333333.16667.1.23334l2 2c.06667.06666.13333.1.23333.1s.16667-.03334.23334-.1L3.03333 4.1c.06667-.06667.1-.13333.1-.23333S3.1 3.7 3.03333 3.63333L2.7 3.3c-.1-.1-.03333-.3.13333-.3h.2z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { DeleteModalMode, RestoreModalData } from '@/store/project'

export default Vue.extend({
  props: {
    isVisible: Boolean,
  },
  data() {
    return {
      currentSecond: 5,
      interval: null as null | number,
    }
  },
  computed: {
    ...mapState({
      restoreModalData: (state: any) =>
        <RestoreModalData>state.project.restoreModalData,
    }),
    modalType(): string {
      if (!this.restoreModalData) return 'Website'

      const { type } = this.restoreModalData

      return type == DeleteModalMode.Project ? 'Website' : 'Page'
    },
  },
  watch: {
    isVisible(newValue: boolean) {
      if (newValue === true) {
        const fill = <SVGCircleElement>this.$refs.circleProgressFill

        setTimeout(() => {
          fill.style.strokeDashoffset = '0'

          this.interval = window.setInterval(() => {
            if (this.currentSecond - 1 <= 0) {
              this.closeMessage()
              return
            }

            this.currentSecond = this.currentSecond - 1
          }, 1000)
        }, 500)
      }
    },
  },
  methods: {
    restore(event: Event) {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      const { projectId, pageId, type } = this.restoreModalData

      if (type === DeleteModalMode.Project) {
        this.$store.dispatch('project/restoreProject', { projectId })
      } else {
        this.$store.dispatch('project/restorePage', { projectId, pageId })
      }
      this.closeMessage()
    },
    closeMessage() {
      if (this.interval) clearInterval(this.interval)
      this.interval = null

      this.$store.dispatch('ui/closeMessage')

      this.currentSecond = 5
      if (this.restoreModalData.actionAfterDelete)
        this.restoreModalData.actionAfterDelete()
      setTimeout(() => {
        this.$store.commit('project/changeRestoreModalData', null)
      }, 500)
    },
  },
})
</script>

<style lang="scss" scoped>
.delete-project-success-message {
  position: fixed;
  visibility: hidden;
  bottom: 40px;
  left: 50%;
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 300px;
  width: 100%;
  background: #000000;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(130, 130, 130, 0.2);
  padding-top: 11px;
  padding-right: 16px;
  padding-bottom: 11px;
  padding-left: 16px;
  transform: translate(-50%, 50%);
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 20px rgba(130, 130, 130, 0.3);
  }

  &_visible {
    transform: translate(-50%, 0);
    opacity: 1;
    visibility: visible;
  }

  &__side {
    display: flex;
    align-items: center;
  }

  &__circle {
    position: relative;
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  &__circle-svg {
    position: absolute;
    top: -11px;
    left: -11px;
    transform: rotate(-90deg) scale(0.4878);
  }

  &__circle-progress {
    fill: none;
    stroke: #2f80ed;
    stroke-width: 3;
    stroke-opacity: 0.3;
    stroke-linecap: round;

    &_fill {
      stroke-opacity: 1;
      stroke-dasharray: 164;
      stroke-dashoffset: 164;
      transition: stroke-dashoffset 12s ease;
    }
  }

  &__circle-number {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    font-size: 9px;
    font-weight: 500;
    line-height: 13px;
    text-align: center;
    color: #ffffff;
    transform: translateY(-50%);
  }

  &__text {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: #dadada;
  }

  &__undo-button {
    display: flex;
    align-items: center;
    text-decoration: none;

    &:hover {
      .delete-project-success-message__undo-button-icon-wrapper {
        background-color: #2f80ed;

        path {
          fill: #ffffff;
        }
      }
    }
  }

  &__undo-button-text {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #ffffff;
    margin-right: 14px;
  }

  &__undo-button-icon-wrapper {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f2f2f2;
    border-radius: 50%;
    margin-right: 10px;
    transition: 0.3s;

    path {
      fill: #2f80ed;
      transition: 0.3s;
    }
  }
}
</style>


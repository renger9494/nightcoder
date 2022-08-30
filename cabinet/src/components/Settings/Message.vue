<template>
  <div
    class="message"
    :class="{ message_visible: isVisible, message_error: type === 'error' }"
    @click="closeMessage"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
  >
    <span class="message__emoji" v-if="type !== 'error'">{{ emoji }}</span>
    <error-icon
      class="message__emoji message__emoji_icon"
      v-if="type === 'error'"
    ></error-icon>
    <span class="message__text">{{ text }}</span>
  </div>
</template>

<style lang="scss" scoped>
.message {
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: max-content;
  text-align: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(130, 130, 130, 0.2);
  padding-top: 10px;
  padding-right: 16px;
  padding-bottom: 10px;
  padding-left: 16px;
  transform: translateY(-50%);
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;

  @include sm-down {
    max-width: 65%;
    min-width: 240px;
    padding-top: 13px;
    padding-right: 18px;
    padding-bottom: 13px;
    padding-left: 18px;
  }

  &:hover {
    box-shadow: 0 8px 20px rgba(130, 130, 130, 0.3);
  }

  &_error {
    min-width: 217px;

    @include sm-down {
      min-width: 197px;
    }
  }

  &_visible {
    transform: translateY(-50%);
    opacity: 1;
  }

  &__emoji {
    font-size: 16px;
    margin-right: 12px;

    &_icon {
      width: 18px;
      fill: #f26b60;
    }
  }

  &__text {
    font-size: 14px;
    font-weight: 400;
    color: #000000;

    @include sm-down {
      font-size: 12px;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import ErrorIcon from '@/assets/icons/error.svg?inline'

const AUTO_CLOSE_TIME = 3000

let closeMessageTimeout = null as any
export default Vue.extend({
  components: {
    ErrorIcon,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    emoji: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isVisible: false,
    }
  },
  mounted() {
    // We need here timeout because otherwise animation won't work :(
    setTimeout(() => {
      this.isVisible = true
      closeMessageTimeout = setTimeout(this.closeMessage, AUTO_CLOSE_TIME)
    }, 10)
  },
  beforeDestroy() {
    this.isVisible = false
    this.$store.dispatch('ui/closeMessage')

    clearTimeout(closeMessageTimeout)
    closeMessageTimeout = null
  },
  methods: {
    mouseover() {
      if (this.isVisible) {
        clearTimeout(closeMessageTimeout)
      }
    },
    mouseleave() {
      if (this.isVisible) {
        closeMessageTimeout = setTimeout(this.closeMessage, AUTO_CLOSE_TIME)
      }
    },
    closeMessage() {
      this.isVisible = false

      setTimeout(() => {
        this.$store.dispatch('ui/closeMessage')
      }, 300)
    },
  },
})
</script>
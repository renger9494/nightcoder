<template>
  <div class="save-popup" :class="{ 'save-popup_visible': isVisible }">
    <span class="save-popup__emoji" v-if="showEmoji">{{ getEmoji }}</span>
    <p class="save-popup__text">{{ text }}</p>
  </div>
</template>

<style lang="scss" scoped>
.save-popup {
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  max-width: 573px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(130, 130, 130, 0.2);
  padding: 7px 10px;
  transform: translateX(-50%);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;

  @include xs-down {
    max-width: 529px;
  }

  &_visible {
    opacity: 1;
    visibility: visible;
  }

  &__emoji {
    font-size: 15px;
    line-height: 15px;
    margin-right: 9px;
  }

  &__text {
    font-size: 14px;
    font-weight: 400;

    @include xs-down {
      font-size: 13px;
      text-align: center;
    }
  }
}
</style>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
      default: 'Project successfully saved!!!'
    },
    showEmoji: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      isVisible: true,
      emoji: [
        '💥',
        '🔥',
        '🌈',
        '⚡️',
        '👌',
        '👍',
        '💪',
        '🖖',
        '🤘',
        '👏',
        '💙',
        '🖤',
        '🧡',
        '💛',
        '💚',
        '😻',
        '🌿',
        '☕️'
      ]
    };
  },
  computed: {
    getEmoji: function() {
      return this.emoji[Math.floor(Math.random() * this.emoji.length)];
    }
  }
};
</script>

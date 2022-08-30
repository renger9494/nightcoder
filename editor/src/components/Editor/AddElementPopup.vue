<template>
  <modal class="project-publish-modal" :isVisible="isVisible">
    <!-- <transition name="fade">
        <div class="link-copied-alert" v-if="copiedAlert">
          <span class="link-copied-alert__emoji">{{getEmoji}}</span>
          <span class="link-copied-alert__text">Link copied!</span>
        </div>
      </transition> -->
    <a href="#" class="project-publish-modal__close-button" v-on:click="closeModal">
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none">
        <path
          fill="#BDBDBD"
          d="M7.74148 1.14999C7.73213.923128 7.64775.698128 7.47396.524991c-.1731-.173138-.39814-.258105-.625-.267517-.25248-.01062-.5081.074379-.70059.267517L3.99961 2.67437 1.85086.524991C1.65775.331853 1.40275.247474 1.15024.257474.923372.266854.698372.351232.525235.524991.352131.698128.26713.923128.257719 1.14999c-.010621.25252.074379.50748.267516.70062L2.67399 3.99999.525235 6.14875c-.193137.1931-.277516.44814-.267516.70059.009379.22686.093758.45189.267516.625.173137.17313.398137.25813.625005.26751.25251.01062.50751-.07434.70062-.26751l2.14875-2.14873 2.14938 2.14938c.19314.19311.44814.27748.70062.26752.22687-.00938.45187-.09376.625-.26752.17314-.17314.25811-.39814.26752-.625.01062-.25252-.07438-.50748-.26752-.70062L5.32524 3.99999l2.14872-2.14876c.19317-.1931.27814-.4481.26752-.70124z"
        ></path>
      </svg>
    </a>

    <div>
      <div class="element-item" @click="addElement('TextElement')">Text</div>
      <!-- <div class="element-item" @click="addElement('HeadingElement')"> Text Heading </div>
        <div class="element-item" @click="addElement('SubheadingElement')"> Text Subheading </div>
        <div class="element-item" @click="addElement('ParagraphElement')"> Text Paragraph </div> -->
      <div class="element-item" @click="addElement('ImageElement')">Image</div>
      <div class="element-item" @click="addElement('ButtonElement')">Button</div>
      <div class="element-item" @click="addElement('GridElement')">Grid</div>
    </div>
  </modal>
</template>

<script>
/**
 * @deprecated popup and because we use
 */
// src/components/Editor/Sidebar/Modal/components/AddNewBlockOrElementPopup/AddNewBlockOrElementPopup.vue ?
import Modal from '@/components/Shared/Modal.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
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
      ],
      copiedAlert: false
    };
  },
  props: {
    isVisible: Boolean
  },
  components: {
    Modal
  },
  watch: {},
  computed: {
    cellKey() {
      return this.$store.state.editor.insertElementTo;
    },
    selectedBlock() {
      return this.$store.state.editor.openedSidebarItem;
    }
  },
  methods: {
    closeModal: function(event) {
      if (event) event.preventDefault();
      this.$store.dispatch('ui/closeModal');
    },
    addElement(element) {
      this.$store.commit('editor/changeInsertElementTo', {
        block: this.selectedBlock
      });
      this.$store.commit('editor/addElementToConfig', element); //delete
      this.$store.dispatch('ui/closeModal');
    }
  }
};
</script>

<style lang="scss" scoped>
.element-item {
  margin-bottom: 30px;
  cursor: pointer;
  &:hover {
    color: blue;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
.link-copied-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  max-width: 350px;
  left: 50%;
  bottom: 10px;
  width: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(130, 130, 130, 0.2);
  padding: 7px 10px;
  transform: translateX(-50%);
  opacity: 1;
  transition: 0.3s;
  font-size: 14px;
  font-weight: 400;
  &__text {
    margin-left: 10px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.project-publish-modal {
  width: 432px;
  height: 496px;
  @include sm-down {
    width: 292px;
    height: 524px;
    padding-left: 14px;
    padding-right: 14px;
  }
  &.project-published {
    @include sm-down {
      height: 496px;
    }
  }
  &__inner {
    height: 100%;
    width: 100%;
  }
  &__url-block {
    background: #000000;
    border-radius: $shape_border_radius;
    padding: 16px;
    margin-bottom: 24px;
    @include sm-down {
      padding: 16px 10px 14px;
    }
    &.light {
      background: #d7e2fc;
      .project-publish-modal__url-link {
        margin-bottom: 0;
      }
    }
  }
  &__url-settings {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 17px;
    color: #555555;
    margin-bottom: 35px;
    text-decoration: none;
    svg {
      margin-right: 5px;
    }
  }
  &__url-link {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    color: #318bf5;
    text-decoration: none;
    display: block;
    background: #ffffff;
    border-radius: $shape_border_radius;
    padding: 6px 12px;
    cursor: pointer;
    margin-bottom: 16px;
    @include sm-down {
      font-size: 12px;
      line-height: 14px;
      padding: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &__btns {
    justify-content: center;
    align-items: center;
    display: flex;
  }
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    font-weight: bold;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: #000000;
    border: 1px solid #000;
    color: #ffffff;
    text-decoration: none;
    width: 95px;
    height: 30px;
    &:nth-child(2) {
      margin-left: 20px;
    }
    &.disabled {
      color: #bdbdbd;
      background: #fff;
      border-color: #dadada;
    }
  }
  &__links {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      display: flex;
      text-decoration: none;
      font-size: 14px;
      line-height: 17px;
      color: #ffffff;
      align-items: center;
      &:last-child {
        margin-left: 24px;
      }
      svg {
        margin-left: 8px;
      }
    }
  }
  &__illustration {
    display: block;
    max-width: 100%;
    margin-right: auto;
    margin-bottom: 30px;
    margin-left: auto;
  }

  &__title {
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    color: #000000;
    margin-bottom: 30px;
  }

  &__close-button {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f2f2f2;
    border-radius: 50%;
    transition: 0.3s;

    &:hover {
      background-color: #828282;

      path {
        fill: #ffffff;
      }
    }

    &:active {
      background-color: #333333;

      path {
        fill: #ffffff;
      }
    }

    path {
      fill: #bdbdbd;
      transition: 0.3s;
    }
  }
}
</style>

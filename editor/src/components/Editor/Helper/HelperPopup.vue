<template>
  <div class="helper-popup" @keydown.esc="changeHelperOpenType(false)" ref="modal" tabindex="0">
    <div class="helper-popup__wrap">
      <div class="helper-popup__top">
        <p class="helper-popup__top-title">Keyboard shortcuts</p>
        <div class="helper-popup__top-btn" @click="changeHelperOpenType(false)">
          <svg-icon name="close" width="8" height="8" color="#949CAD" />
        </div>
      </div>
      <div class="helper-popup__container">
        <div class="helper-popup__col shortcut-list" v-for="(item, index) in shortcuts" :key="index">
          <p class="shortcut-list__title">{{ item.title }}</p>
          <ul class="shortcut-list__container">
            <li v-for="(listItem, indexList) in item.list" :key="`${indexList}list`" class="shortcut-list__item">
              <svg-icon
                v-if="listItem.icon"
                :name="listItem.icon"
                :width="dynamicIconSizes[listItem.icon].width"
                :height="dynamicIconSizes[listItem.icon].height"
              />
              <p class="shortcut-list__text">{{ listItem.text }}</p>
              <div class="shortcut-list__shortcut-list">
                <div
                  class="shortcut-list__shortcut"
                  v-for="(shortcut, index) in listItem.shortcuts"
                  :key="`${index}shortcut`"
                  :class="{ notShortcut: shortcut.notShortcut }"
                >
                  <template v-if="typeof shortcut === 'string'">
                    <span>{{ shortcut }}</span>
                  </template>
                  <template v-else>
                    <svg-icon
                      v-if="shortcut.icon"
                      :name="shortcut.icon.name"
                      :width="shortcut.icon.w"
                      :height="shortcut.icon.h"
                    />
                    <span v-if="shortcut.text">{{ shortcut.text }}</span>
                    <span v-if="shortcut.notShortcut">{{ shortcut.notShortcut }}</span>
                  </template>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations } from 'vuex';
import { dynamicIconSizes } from '@/constants/dynamicIconSizes';

export default Vue.extend({
  name: 'HelperPopup',
  methods: {
    ...mapMutations({
      changeHelperOpenType: 'ui/changeHelperOpenType'
    })
  },
  data() {
    return {
      dynamicIconSizes
    };
  },
  mounted() {
    (this.$refs?.modal as HTMLDivElement).focus();
  },
  computed: {
    isIOS(): boolean {
      return navigator.appVersion.indexOf('Mac') !== -1;
    },
    shortcuts(): Array<any> {
      return [
        {
          title: 'Tools',
          list: [
            {
              icon: 'text',
              text: 'Text tool',
              shortcuts: ['T']
            },
            {
              icon: 'rectangle',
              text: 'Rectangle tool',
              shortcuts: ['R']
            },
            {
              icon: 'circle',
              text: 'Circle tool',
              shortcuts: ['O']
            },
            {
              icon: 'button',
              text: 'Button tool',
              shortcuts: ['B']
            },
            {
              icon: 'image',
              text: 'Image tool',
              shortcuts: ['I']
            },
            {
              icon: 'form',
              text: 'Forms',
              shortcuts: ['F']
            },
            {
              icon: 'video',
              text: 'Video',
              shortcuts: ['V']
            },
            {
              icon: 'block',
              text: 'Add empty block',
              shortcuts: this.isIOS
                ? [{ icon: { name: 'command-icon', w: '10', h: '10' }, text: 'Cmd' }, 'Shift', 'B']
                : ['Ctrl', 'Shift', 'B']
            }
          ]
        },
        {
          title: 'Selection',
          list: [
            {
              text: 'Edit text',
              shortcuts: ['Enter']
            },
            {
              text: 'Resize proportionally',
              shortcuts: ['shift']
            },
            {
              text: 'Duplicate selected layers',
              shortcuts: [this.isIOS ? { icon: { name: 'command-icon', w: '10', h: '10' }, text: 'Cmd' } : 'ctrl', 'd']
            },
            {
              text: 'Copy selected layers',
              shortcuts: [this.isIOS ? { icon: { name: 'command-icon', w: '10', h: '10' }, text: 'Cmd' } : 'ctrl', 'c']
            },
            {
              text: 'Paste copied layers',
              shortcuts: [this.isIOS ? { icon: { name: 'command-icon', w: '10', h: '10' }, text: 'Cmd' } : 'ctrl', 'v']
            },
            {
              text: 'Rename layer’s element',
              shortcuts: [this.isIOS ? { icon: { name: 'command-icon', w: '10', h: '10' }, text: 'Cmd' } : 'ctrl', 'v']
            },
            {
              text: 'Delete selected layers',
              shortcuts: [
                'Delete',
                { notShortcut: 'or' },
                this.isIOS ? { icon: { name: 'backspace-icon', w: '16', h: '16' } } : 'Backspace'
              ]
            }
          ]
        },
        {
          title: 'Other',
          list: [
            {
              text: 'Undo action',
              shortcuts: [this.isIOS ? { icon: { name: 'command-icon', w: '10', h: '10' }, text: 'Cmd' } : 'ctrl', 'Z']
            },
            {
              text: 'Redo action',
              shortcuts: [this.isIOS ? { icon: { name: 'command-icon', w: '10', h: '10' }, text: 'Cmd' } : 'ctrl', 'shift', 'Z']
            },
            {
              text: 'Measure to selection',
              shortcuts: ['Alt']
            },
            {
              text: 'Move artboard',
              shortcuts: ['Shift + Drag']
            },
            {
              text: 'Move selection (1 px)',
              shortcuts: ['Arrows']
            },
            {
              text: 'Move selection (10 px)',
              shortcuts: ['Shift', 'Arrows']
            },
            {
              text: 'Zoom in',
              shortcuts: [this.isIOS ? { icon: { name: 'command-icon', w: '10', h: '10' }, text: 'Cmd' } : 'ctrl', '+']
            },
            {
              text: 'Zoom out',
              shortcuts: [this.isIOS ? { icon: { name: 'command-icon', w: '10', h: '10' }, text: 'Cmd' } : 'ctrl', '-']
            }
          ]
        }
      ];
    }
  }
});
</script>

<style lang="scss" scoped>
.helper-popup {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100vw;
  background: $white;
  z-index: 1000000;
  box-shadow: -15px 0px 40px rgba(0, 0, 0, 0.1);
  cursor: default;
  padding: 40px 0;
  outline: none;

  &__wrap {
    max-width: 1040px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 30px;
    &-title {
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
    }
    &-btn {
      width: 20px;
      height: 20px;
      background: $gray100;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
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
  }

  &__container {
    display: flex;
    margin: 0 -25px;
  }

  &__col {
    flex: 1;
    margin: 0 25px;
  }
}

.shortcut-list {
  &__title {
    margin: 0 0 16px;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: $gray600;
  }

  &__container {
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin: 0 0 $margin_s;
    }

    & > svg {
      margin: 0 4px 0 0;
    }
  }

  &__text {
    font-size: 12px;
    line-height: 16px;
  }

  &__shortcut-list {
    margin: 0 -2px 0 auto;
    display: flex;
    align-items: center;
  }

  &__shortcut {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-width: 26px;
    padding: 6px 9px;
    font-size: 10px;
    line-height: 12px;
    border: 1px solid $gray600;
    border-radius: $shape_border_radius;
    margin: 0 2px;
    text-transform: capitalize;

    span {
      &:nth-child(2) {
        display: inline-block;
        margin: 0 0 0 3px;
      }
    }

    &.notShortcut {
      padding: 0;
      border: none;
    }
  }
}
</style>

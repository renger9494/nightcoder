<template>
  <div
    class="publish-field"
    :class="{ 'publish-field--is-published': isPublished }"
  >
    <div class="publish-field__top">
      <label class="publish-field__label">
        <component
          :is="isPublished ? 'a' : 'span'"
          class="publish-field__label-icons"
          :href="isPublished ? `https://${url}` : ''"
          target="_blank"
        >
          <svg-icon
            width="20"
            height="20"
            :color="isPublished ? '#173BEF' : '#BDBDBD'"
            name="open-link"
          />
        </component>
        <component
          :is="isPublished ? 'a' : 'span'"
          class="publish-field__label-text"
          :href="isPublished ? `https://${url}` : ''"
          target="_blank"
        >
          {{ url }}
        </component>
      </label>
      <div class="publish-field__btns">
        <button
          class="publish-field__btn publish-field__btn--copy"
          v-if="isPublished"
          @click="copy"
        >
          <svg-icon name="copy-icon" width="12" height="12" color="#828282" />
        </button>
      </div>
    </div>
    <div class="publish-field__bottom" v-if="isPublished && !isCommunity">
      <div class="publish-field__bottom-link" @click="openLink">
        <p>Open URL</p>
        <svg-icon
          name="open-link-icon"
          width="13"
          height="10"
          color="#000000"
        />
      </div>
      <div
        class="publish-field__bottom-settings"
        @click="($event) => openSettings($event, isHomePage)"
      >
        <p>{{ isHomePage ? 'Domain' : 'Page URL' }} Settings</p>
        <svg-icon
          name="setting-icon"
          width="12"
          height="12"
          :color="isCommunity ? '#fff' : '#000'"
        />
      </div>
    </div>
    <div class="publish-field__bottom" v-if="!isPublished && !isCommunity">
      <div class="publish-field__bottom-link">
        <div class="publish-field__bottom-publish-status"></div>
        <p class="publish-field__bottom-publish-text">Not published</p>
      </div>
      <div class="publish-field__bottom-settings" @click="($event) => openSettings($event, isHomePage)">
        <p>{{ isHomePage ? 'Domain' : 'Page URL' }} Settings</p>
        <svg-icon name="setting-icon" width="12" height="12" color="#000"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import copyToClipboard from '@/utils/copy_to_clibpoard'

export default Vue.extend({
  name: 'publish-input',
  props: {
    url: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    openSettings: {
      type: Function as PropType<(e: Event, isHomePage: boolean) => boolean>,
      default: function () {
        return (e: Event, isHomePage: boolean) => true
      },
    },
    isHomePage: {
      type: Boolean,
      required: true,
    },
    isCommunity: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    userFullName: {
      type: String,
      required: false,
      default: () => '',
    },
  },
  methods: {
    copy(): void {
      copyToClipboard(`https://${this.url}`)
    },
    openLink(): void {
      window.open(`https://${this.url}`, '_blank')?.focus()
    },
    openProfile(): void {
      window.open(`https://${this.userFullName}`, '_blank')?.focus()
    },
  },
})
</script>

<style lang="scss" scoped>
.publish-field {
  width: 100%;

  border-radius: 4px;
  border: 1px solid transparent;
  transition: 0.3s border linear;
  position: relative;
  .white {
    color: #ffffff;
  }
  &--is-published {
    .publish-field {
      &__label-text {
        opacity: 1;
        color: #173bef;
        max-width: calc(100% - 55px);
      }
    }
  }

  &__top {
    background: #ffffff;
    border-radius: 4px;
    padding: 0 6px;
    position: relative;
    display: flex;
    align-items: center;
    height: 34px;
  }

  &__label {
    width: 100%;
    display: flex;
    align-items: center;
    &-text {
      font-size: 12px;
      line-height: 15px;
      color: #bdbdbd;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
      white-space: nowrap;
      text-decoration: unset;
      margin-left: 8px;
      &--domain {
        color: #000000;
        margin: 0;
      }
    }
    &-icons {
      display: flex;
      align-items: center;
    }
  }

  &__btns {
    right: 6px;
    top: 0;
    bottom: 0;
    margin: auto;
    position: absolute;
    height: 22px;
    display: flex;
    opacity: 1;
    visibility: visible;
    transition: 0.3s;
    &--hidden {
      transition: unset;
      opacity: 0 !important;
      visibility: hidden !important;
    }
  }

  &__btn {
    cursor: pointer;
    width: 22px;
    height: 22px;
    background: transparent;
    transition: 0.3s;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      path {
        transition: 0.3s;
      }
    }

    &:hover {
      background: rgba($black, 0.07);

      path {
        fill: #505050;
      }
    }
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    &-link,
    &-settings {
      display: flex;
      align-items: center;
      cursor: pointer;
      flex: 0 0 calc(50% - 10px);
      padding: 11px 6px 3px;
      transition: 0.3s;

      path {
        fill: $white;
      }

      svg {
        margin: 0 0 0 10px;
      }

      p {
        font-weight: 500;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.03em;
      }

      &:hover {
        opacity: 0.8;
      }
    }
    &-settings {
      justify-content: flex-end;
    }
    &-publish-status {
      width: 6px;
      height: 6px;
      background: #949cad;
      border-radius: 50%;
      opacity: 0.3;
      margin: 0 4px 0 0;
    }
    &-publish-text {
      color: #949cad;
      font-size: 12px;
      line-height: 18px;
      font-weight: 400;
    }
  }

  &__setting {
    &-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      p {
        font-size: 10px;
        margin: 0 4px 0 0;
        font-weight: 500;
        line-height: 15px;
        letter-spacing: 0.03em;
      }

      svg {
        fill: #000000;
      }
    }
  }
}
</style>

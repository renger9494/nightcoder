<template>
  <div class="sidebar-block embed-section">
    <div class="sidebar-block__head">
      <p class="sidebar-block__title">Embed code</p>
    </div>
    <div class="embed-section__dropdown" @click="openEmbedPopup" ref="btn">
      <svg-icon class="embed-section__dropdown-icon" :name="embedList[type].iconName" width="24" height="24" />
      <p class="embed-section__dropdown-text">{{ embedList[type].title }}</p>
      <svg-icon class="embed-section__dropdown-arrow" name="arrow-down-icon" width="9" height="5" color="#318BF5" />
    </div>
    <div class="embed-section__code">
      <textarea
        v-model="code"
        @change="changeCode"
        @input="onInput"
        @keydown.enter="onKeyUpEnter"
        rows="10"
        class="embed-section__textarea"
        placeholder="Paste your code here"
      />
      <div class="embed-section__save" :class="{ 'embed-section__save--success': isSaveSuccess }">
        <svg-icon name="check-mark-icon" width="10" height="8" color="#53B71B" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { embedList, EmbedType } from '@/constants/embed';
import { EmbedPopupData, PopupContainerType, PopupSettings, PopupType } from '@/components/Editor/Sidebar/Modal/types';
import { mapMutations } from 'vuex';
export default Vue.extend({
  name: 'CodeSection',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    block: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      isSaveSuccess: false,
      embedList,
      code: ''
    };
  },
  created() {
    this.code = this.value.payload.code;
  },
  computed: {
    type(): EmbedType {
      return this.value.payload.type;
    },
    payloadCode(): string {
      return this.value.payload.code;
    }
  },
  watch: {
    payloadCode(val: string) {
      if (val.length) this.setType(val);
      this.code = val;
    },
    code(val: string) {
      if (val.length) this.setType(val);
    }
  },
  methods: {
    ...mapMutations({
      setPopupSettings: 'editor/SET_POPUP_SETTINGS',
      changeElementPayload: 'editor/changeElementPayload'
    }),
    onInput() {
      this.isSaveSuccess = false;
    },
    onKeyUpEnter($event: any) {
      $event.preventDefault();
      $event.stopPropagation();
      $event.target.blur();
    },
    changeCode() {
      this.changeElementPayload({ id: this.value.id, path: 'code', value: this.code });
      this.isSaveSuccess = true;
    },
    openEmbedPopup() {
      const popupSettings = {
        active: true,
        content: PopupType.Embed,
        container: PopupContainerType.LargePaddings,
        header: 'Embed Code',
        closeButton: true,
        location: (this.$refs.btn as any)?.getBoundingClientRect(),
        data: {
          isUnderHeader: false,
          isNextToSidebar: true,
          setEmbedType: this.addEmbedElement
        }
      };
      this.setPopupSettings(popupSettings as PopupSettings<EmbedPopupData>);
    },
    addEmbedElement(item: any) {
      this.changePayload('type', item.type);
      this.changePayload('code', item.code);
    },
    changePayload(path: string, value: any) {
      const clearedEmbed = value.replaceAll('"', `'`);
      this.changeElementPayload({ id: this.value.id, path, value: clearedEmbed });
    },
    getHostname(url: string): string {
      return new URL(url).hostname;
    },
    setType(val: string) {
      const match: RegExpMatchArray | null = val.match('src\\s*=\\s*"([^"]+)"');
      if (match?.length) {
        const host = this.getHostname(match[1]);

        if (this.embedList.Youtube.domain.includes(host)) {
          this.changePayload('type', this.embedList.Youtube.type);
        } else if (this.embedList.Vimeo.domain.includes(host)) {
          this.changePayload('type', this.embedList.Vimeo.type);
        } else if (this.embedList.Spotify.domain.includes(host)) {
          this.changePayload('type', this.embedList.Spotify.type);
        } else if (this.embedList.Soundcloud.domain.includes(host)) {
          this.changePayload('type', this.embedList.Soundcloud.type);
        } else if (this.embedList.Twitter.domain.includes(host)) {
          this.changePayload('type', this.embedList.Twitter.type);
        } else if (this.embedList.Instagram.domain.includes(host)) {
          this.changePayload('type', this.embedList.Instagram.type);
        } else if (this.embedList.GoogleMaps.domain.includes(host)) {
          this.changePayload('type', this.embedList.GoogleMaps.type);
        } else {
          this.changePayload('type', this.embedList.CustomCode.type);
        }
      }
    }
  }
});
</script>

<style scoped lang="scss">
.embed-section {
  &__code {
    position: relative;
  }

  &__textarea {
    width: 100%;
    background: #ffffff;
    border: 1px solid #f3f3f3;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 10px 6px;
    font-size: 13px;
    line-height: 15px;
    overflow-y: hidden;
    overflow-x: hidden;
    resize: none;

    &:hover {
      overflow-y: overlay;
    }

    &::-webkit-scrollbar {
      width: 2px;
      height: 7px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #bdc2c7;
      height: 30px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track-piece {
      display: none;
    }
  }

  &__save {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    top: 0;
    right: -1px;
    border-radius: $shape_border_radius;
    transition: 0.3;
    opacity: 0;
    &--success {
      opacity: 1;
    }
  }

  &__dropdown {
    display: inline-flex;
    align-items: center;
    padding: 2px;
    cursor: pointer;
    margin: 0 0 2px;
    border-radius: $shape_border_radius;
    transition: 0.3s;

    &:hover {
      background: $gray100;
    }

    &-icon {
      margin: 0 2px 0 0;
    }

    &-text {
      font-size: 12px;
      line-height: 16px;
      color: $blue200;
      margin: 0 16px 0 0;
    }
  }
}
</style>

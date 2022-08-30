<template>
  <div class="video-settings sidebar-block">
    <div class="sidebar-block__head">
      <p class="sidebar-block__title">Video Settings</p>
    </div>
    <div class="video-settings__field">
      <span v-if="!isValid" class="video-settings__field-error">Invalid URL</span>
      <input
        v-model="link"
        class="video-settings__field-input"
        :class="{ 'video-settings__field-input--error': !isValid }"
        type="text"
        @change="onInputChange"
      />
      <p class="video-settings__field-text">Supports only YouTube links</p>
    </div>
    <div class="sidebar-block__row sidebar-block__row--sbc">
      <p class="video-settings__text">Autoplay</p>
      <switcher
        class="video-settings__switcher"
        :switcher-items="autoplayFilter"
        @filterName="val => onSwitchChange(val, 'isAutoplay')"
      />
    </div>
    <div class="sidebar-block__row sidebar-block__row--sbc">
      <p class="video-settings__text">Loop</p>
      <switcher
        class="video-settings__switcher"
        :switcher-items="autoplayLoop"
        @filterName="val => onSwitchChange(val, 'isLoop')"
      />
    </div>
    <div class="sidebar-block__row sidebar-block__row--sbc">
      <p class="video-settings__text">Mute</p>
      <switcher
        class="video-settings__switcher"
        :switcher-items="autoplayMute"
        @filterName="val => onSwitchChange(val, 'isMute')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import Switcher from '@/components/Editor/Sidebar/Switcher.vue';
import { createNamespacedHelpers } from 'vuex-composition-helpers';

export default defineComponent({
  name: 'VideoSettings',
  components: { Switcher },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root }) {
    const isAutoplay = computed(() => props.value.payload.isAutoplay);
    const isLoop = computed(() => props.value.payload.isLoop);
    const isMute = computed(() => props.value.payload.isMute);
    const youtubeLinkUrl = computed(() => props.value.payload.url);
    const autoplayFilter = computed(() => [
      { name: 'Off', isActive: !isAutoplay.value },
      { name: 'On', isActive: isAutoplay.value }
    ]);
    const autoplayLoop = computed(() => [
      { name: 'Off', isActive: !isLoop.value },
      { name: 'On', isActive: isLoop.value }
    ]);
    const autoplayMute = computed(() => [
      { name: 'Off', isActive: !isMute.value },
      { name: 'On', isActive: isMute.value }
    ]);

    const link = ref(youtubeLinkUrl.value);
    const isValid = ref(true);

    const { useMutations } = createNamespacedHelpers(root.$store, 'editor');
    const { changeElementPayload } = useMutations(['changeElementPayload']);

    function onInputChange() {
      if (link.value === '') {
        isValid.value = true;
        changeElementPayload({
          id: props.value.id,
          value: link.value,
          path: 'url'
        });
        return;
      }
      const regex = /(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'<> #]+)/gim;
      if (regex.test(link.value)) {
        isValid.value = true;
        changeElementPayload({
          id: props.value.id,
          value: link.value,
          path: 'url'
        });
      } else {
        isValid.value = false;
      }
    }

    function onSwitchChange(value: string, path: string) {
      if (path === 'isAutoplay') {
        changeElementPayload({
          id: props.value.id,
          value: value === 'On' ? 1 : 0,
          path
        });
        changeElementPayload({
          id: props.value.id,
          value: value === 'On' ? 1 : 0,
          path: 'isMute'
        });
        return;
      }
      if (path === 'isMute') {
        changeElementPayload({
          id: props.value.id,
          value: value === 'On' ? 1 : 0,
          path
        });
        if (isAutoplay) {
          changeElementPayload({
            id: props.value.id,
            value: false,
            path: 'isAutoplay'
          });
        }
        return;
      }
      changeElementPayload({
        id: props.value.id,
        value: value === 'On' ? 1 : 0,
        path
      });
    }

    return {
      autoplayFilter,
      autoplayLoop,
      autoplayMute,
      isAutoplay,
      isValid,
      isLoop,
      isMute,
      link,
      onSwitchChange,
      onInputChange
    };
  }
});
</script>

<style lang="scss" scoped>
.video-settings {
  &__field {
    position: relative;
    margin: 0 0 $margin_s;
    padding: 0 0 17px;

    &-input {
      border: 1px solid $color_input_border;
      border-radius: $shape_border_radius;
      padding: 8px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      transition: 0.3s;
      width: 100%;

      &:hover {
        border-color: $color_input_hover;
      }

      &:focus {
        border-color: $color_input_focus;
      }

      &--error {
        border-color: $danger;
      }
    }

    &-error,
    &-text {
      position: absolute;
      font-weight: 400;
      font-size: 10px;
      line-height: 12px;
    }

    &-error {
      top: -2px;
      right: 0;
      color: $danger;
      transform: translate(0, -100%);
    }

    &-text {
      bottom: 0;
      left: 0;
      color: $gray400;
    }
  }

  &__switcher {
    max-width: 115px;
    width: 100%;
  }

  &__text {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }
}
</style>

<template>
  <div class="page_wrapper">
    <transition name="fade-layout">
      <header-component :type="'full-width'" :authorized="true" v-if="isEditorDataLoaded && isEditor" />
    </transition>
    <transition name="skeleton">
      <header-skeleton v-if="!isEditorDataLoaded" />
    </transition>
    <transition name="fade-layout">
      <preview-header-component v-if="isEditorDataLoaded && !isEditor" :type="'full-width'" :authorized="true" />
    </transition>
    <transition name="skeleton">
      <feedback-form v-if="isFeedbackOpen" class="feedback-form-popup" />
    </transition>
    <slot />
    <helper v-if="isEditor" />
    <zoom-control v-if="isEditor" />
    <history-btns v-if="isEditor" />
    <cookies-popup />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeaderComponent from '@/components/Header/EditorHeader.vue';
import PreviewHeaderComponent from '@/components/Header/PreviewHeader.vue';
import CookiesPopup from '@/components/Shared/CookiesPopup.vue';
import { mapState } from 'vuex';
import HeaderSkeleton from '@/components/Header/HeaderSkeleton.vue';
import Helper from '@/components/Editor/Helper/Helper.vue';
import FeedbackForm from '@/components/Shared/FeedbackForm/FeedbackForm.vue';
import HistoryBtns from '@/components/Editor/HistoryBtns.vue';
import ZoomControl from '@/components/Editor/ZoomControl.vue';

export default Vue.extend({
  components: {
    ZoomControl,
    HistoryBtns,
    FeedbackForm,
    Helper,
    HeaderSkeleton,
    HeaderComponent,
    CookiesPopup,
    PreviewHeaderComponent
  },
  computed: {
    ...mapState({
      isEditorDataLoaded: (state: any) => state.ui.isEditorDataLoaded,
      isFeedbackOpen: (state: any) => state.ui.isFeedbackOpen
    }),
    isEditor(): boolean {
      return this.$route.name === 'editor' || this.$route.name === 'templateEditor';
    }
  }
});
</script>

<style lang="scss" scoped>
.page_wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.fade-layout-enter-active,
.fade-layout-leave-active {
  transition: all 0.5s ease;
}
.fade-layout-enter,
.fade-layout-leave-to {
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}

.skeleton-enter-active,
.skeleton-leave-active {
  transition: all 0.5s ease;
}
.skeleton-enter,
.skeleton-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.feedback-form-popup {
  position: fixed;
  right: 256px;
  bottom: 67px;
  z-index: 1000000;
}
</style>

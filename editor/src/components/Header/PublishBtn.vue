<template>
  <div class="publish-btn-wrap" ref="popupButton">
    <button @click.stop="showPublishPopup" :class="{ active: isPopupOpen, published: isPublished }" class="publish-btn">
      <span v-if="isPublished && isHasUnpublishedChanges" class="is-has-unpublished-changes"></span>
      <svg-icon v-if="isPublished" name="update-stroke-icon" width="13" height="13" color="#fff" />
      <svg-icon v-else name="new_publish" width="13" height="13" color="#fff" />
      <span>{{ isPublished ? 'Update' : 'Publish'}}</span>
      <svg-icon name="arrow-down-icon" width="9" height="5" color="#fff" />
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { BasePopupData, PopupSettings, PopupType, PublishPopupData } from '@/components/Editor/Sidebar/Modal/types';
import { PagedProjectDto, BaseProjectPageDto } from '@/utils/api';
import Arrow from '@/components/Header/Svg/Arrow.vue';

export default Vue.extend({
  components: {
    Arrow
  },
  props: {
    isHasUnpublishedChanges: {
      type: Boolean,
      default: () => false
    },
    isPublished: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    show: false
  }),
  computed: {
    ...mapState({
      popupSettings: (state: any) => <PopupSettings<BasePopupData>>state.editor.popupSettings,
      projectPages: (state: any) => <BaseProjectPageDto[]>state.project.projectPages,
      projects: (state: any) => <PagedProjectDto[]>state.project.projects
    }),
    isPopupOpen(): boolean {
      return this.popupSettings.active && this.popupSettings.content === PopupType.Publish;
    }
  },
  methods: {
    showPublishPopup() {
      const { projectId, pageId } = this.$route.params;

      if (!projectId || !pageId) {
        console.error("[PublishBtn]: user doesn't edit project page");
        return;
      }

      const project = this.projects.find(p => p.id == +projectId);
      const page = this.projectPages.find(pp => pp.id == +pageId);

      if (!project || !page) {
        console.error('[PublishBtn]: not found project or page in store');
        return;
      }

      const domRect = (<HTMLDivElement>this.$refs.popupButton).getBoundingClientRect();
      const popupSettings: PopupSettings<PublishPopupData> = {
        active: true,
        closeButton: true,
        header: 'Publish',
        description: 'Anyone with the link can view',
        content: PopupType.Publish,
        location: domRect,
        background: '',
        data: {
          project,
          page,
          pages: this.projectPages,
          isUnderHeader: true,
          isNextToSidebar: true
        }
      };
      this.$store.commit('editor/SET_POPUP_SETTINGS', popupSettings);
    }
  }
});
</script>

<style lang="scss" scoped>
.publish-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: space-between;
  padding: 0 18px;
  height: 30px;
  background: $black;
  border-radius: $shape_border_radius;
  cursor: pointer;
  transition: 0.3s;
  &.active {
    pointer-events: none;
    opacity: 0.8;
    svg:last-child {
      transform: rotate(90deg);
    }
  }
  &.published {
    background: $gray600;
  }
  .is-has-unpublished-changes {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 7px;
    margin: auto;
    background-color: #FFC557;
    height: 6px;
    width: 6px;
    border-radius: 10px;
    flex: 0 0 6px;
  }
  span {
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    color: $white;
  }
  svg {
    transition: 0.3s;
    &.svg-icon--arrow-down-icon {
        flex: 0 0 9px;
    }
    &.svg-icon--update-stroke-icon {
      flex: 0 0 13px;
    }
  }
  &:hover {
    opacity: 0.8;
  }
}
</style>

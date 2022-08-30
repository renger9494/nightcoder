import Vue from 'vue';

export enum VisibleModalType {
  Limit = 'limit',
  Templates = 'templates',
  SiteSettings = 'site-settings',
  LinkCopied = 'link-copied',
  PageDuplicated = 'page-duplicated',
  ProjectDuplicates = 'project-duplicated',
  PublishPage = 'publish-page',
  DeleteProjectConfirmation = 'delete-project-confirmation',
  DeleteProjectSuccess = 'delete-project-success',
  AuthorizationPopup = 'authorization-popup'
}

export enum VisibleMessageNameType {
  Success = 'success-settings-change',
  Failed = 'unsuccessful-settings-change',
  DeleteProjectSuccess = 'delete-project-success',
  MoveElement = 'move-element'
}

const state = () => ({
  visibleModalName: null as null | VisibleModalType,
  visibleMessageName: null as null | VisibleMessageNameType,
  showSidebar: true,
  settingsPopupMode: 'site',
  settingsPopupTab: null,
  routeName: null,
  isSelecting: false,
  isTextEditing: false,
  isDragging: false,
  isEditorDataLoaded: false,
  isHelperOpen: false,
  isFeedbackOpen: false,
  isOnboardingActive: false,
  isBlockCollectionDragging: false,
  newBlockSortId: null as null | number
});

const mutations = {
  changeTextEditing(state: any, data: any) {
    Vue.set(state, 'isTextEditing', data);
  },
  changeSelectingState(state: any, data: any) {
    Vue.set(state, 'isSelecting', data);
  },
  changeDraggingState(state: any, data: boolean) {
    Vue.set(state, 'isDragging', data);
  },
  changeEditorDataLoadingState(state: any, data: boolean) {
    Vue.set(state, 'isEditorDataLoaded', data);
  },
  changeHelperOpenType(state: any, data: boolean) {
    Vue.set(state, 'isHelperOpen', data);
  },
  changeFeedbackOpenType(state: any, data: boolean) {
    Vue.set(state, 'isFeedbackOpen', data);
  },
  changeOnboardingActiveType(state: any, data: boolean) {
    Vue.set(state, 'isOnboardingActive', data);
  },
  changeBlockDraggingType(state: any, data: boolean) {
    Vue.set(state, 'isBlockCollectionDragging', data);
  },
  changeNewBlockSortId(state: any, data: number | null) {
    state.newBlockSortId = data;
  },
  changeVisibleModalName(state: any, visibleModalName: VisibleModalType) {
    state.visibleModalName = visibleModalName;
  },
  changeVisibleMessageName(state: any, newVisibleMessageName: VisibleMessageNameType) {
    state.visibleMessageName = newVisibleMessageName;
  },
  setSettingsPopupMode(state: any, mode: string) {
    state.settingsPopupMode = mode;
  },
  TOGGLE_SIDEBAR(state: any) {
    state.showSidebar = !state.showSidebar;
  },
  changeSettingsPopupTab(state: any, tab: any) {
    state.settingsPopupTab = tab;
  },
  changeRouteName(state: any, name: any) {
    state.routeName = name;
  }
};

const actions = {
  /**
   * why? we have the mutation 'changeVisibleModalName' for doing that
   * @param context
   * @param param1
   */
  changeVisibleModalName(context: any, { newVisibleModalName }: { newVisibleModalName: VisibleModalType }) {
    context.commit('changeVisibleModalName', newVisibleModalName);
  },
  closeModal(context: any) {
    context.commit('changeVisibleModalName', null);
    context.commit('changeSettingsPopupTab', null);
    context.commit('project/changeOpenPageSettingsId', null, { root: true });
  },
  closeMessage(context: any) {
    context.commit('changeVisibleMessageName', null);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

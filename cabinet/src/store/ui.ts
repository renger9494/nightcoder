import Vue from 'vue'

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
  AuthorizationPopup = 'authorization-popup',
  SubmissionsDelete = 'submissions-delete',
  MobileAlert = 'mobile-alert'
}

export enum VisibleMessageNameType {
  Success = 'success-settings-change',
  Failed = 'unsuccessful-settings-change',
  DeleteProjectSuccess = 'delete-project-success'
}

const state = () => ({
  visibleModalName: null as null | VisibleModalType,
  visibleMessageName: null as null | VisibleMessageNameType,
  showSidebar: true,
  routeName: null,
  isSelecting: false,
  isTextEditing: false,
  isDragging: false,
  isAllCategories: false,
  popupSettings: {
    active: false,
    header: '',
    closeButton: false,
    content: '',
    data: {},
    position: {}
  }
})

const mutations = {
  changeTextEditing(state: any, data: any) {
    Vue.set(state, 'isTextEditing', data)
  },
  changeSelectingState(state: any, data: any) {
    Vue.set(state, 'isSelecting', data)
  },
  changeDraggingState(state: any, data: any) {
    Vue.set(state, 'isDragging', data)
  },
  changeAllCategoriesState(state: any, data: any) {
    Vue.set(state, 'isAllCategories', data)
    if (!data) document.body.style.overflow = ''
  },
  changeVisibleModalName(state: any, visibleModalName: VisibleModalType) {
    state.visibleModalName = visibleModalName
  },
  changeVisibleMessageName(state: any, newVisibleMessageName: VisibleMessageNameType) {
    state.visibleMessageName = newVisibleMessageName
  },
  TOGGLE_SIDEBAR(state: any) {
    state.showSidebar = !state.showSidebar
  },
  changeRouteName(state: any, name: any) {
    state.routeName = name
  },
  SET_POPUP_SETTINGS(state: any, data: any) {
    state.popupSettings.active = data.active
    state.popupSettings = {
      ...data
    }
  },
  SET_POPUP_SETTINGS_DATA_ITEM(state: any, { key, value }: any) {
    if (!key) {
      console.warn('[SET_POPUP_SETTINGS_DATA_ITEM]: key is empty')
      return
    }

    state.popupSettings.data[key] = value
  },
  CHANGE_POPUP_HEADER(state: any, header: string) {
    state.popupSettings.header = header

  },
  CHANGE_POPUP_DESCRIPTION(state: any, description: string) {
    state.popupSettings.description = description;
  },
  CHANGE_POPUP_BACKGROUND(state: any, background: string) {
    state.popupSettings.background = background;
  },
}

const actions = {
  /**
   * why? we have the mutation 'changeVisibleModalName' for doing that
   * @param context
   * @param param1
   */
  changeVisibleModalName(context: any, { newVisibleModalName }: { newVisibleModalName: VisibleModalType }) {
    context.commit('changeVisibleModalName', newVisibleModalName)
  },
  closeModal(context: any) {
    context.commit('changeVisibleModalName', null)
  },
  closeMessage(context: any) {
    context.commit('changeVisibleMessageName', null)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

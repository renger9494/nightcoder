import { Module, ActionTree } from 'vuex';
import apiClient from '@/utils/apiClient';
import { BaseProjectDto, BaseProjectPageDto, ProjectSettingsDto } from '@/utils/api';

export enum SiteSettingsMutations {
  CHANGE_PROJECT = 'CHANGE_PROJECT',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_PROJECT_PAGES = 'CHANGE_PROJECT_PAGES',
  UPDATE_PROJECT_PAGES_PAGE = 'UPDATE_PROJECT_PAGES_PAGE',
  CHANGE_MODAL_MODE = 'CHANGE_MODAL_MODE',
  CHANGE_ACTIVE_SECTION = 'CHANGE_ACTIVE_SECTION',
  CHANGE_HOME_PAGE = 'CHANGE_HOME_PAGE',
  CHANGE_PROJECT_SETTINGS = 'CHANGE_PROJECT_SETTINGS'
}

export enum SectionType {
  GENERAL = 0,
  FAVICON = 1,
  DOMAIN = 2,
  INTEGRATIONS = 3,
  BRANDING = 4,
  HELP = 5,
  HOME_PAGE = 6,
  PAGE_GENERAL = 7,
  PAGE_SEO = 8,
  PAGE_SSI = 9,
  TRANSFER = 10,
}

export enum ModalMode {
  Project = 'site',
  Page = 'page'
}

export interface Project {
  settings: object;
  id: number;
}

export interface Page {
  id: number;
  name: string;
  isHomePage: boolean;
  url: string | null;
}

export interface SiteSettingsState {
  project: BaseProjectDto | null;
  projectPages: BaseProjectPageDto[];
  page: BaseProjectPageDto | null;
  mode: ModalMode;
  activeSection: SectionType;
}

const state = () =>
({
  project: null,
  projectPages: [],
  page: null,
  mode: ModalMode.Project,
  activeSection: SectionType.GENERAL
} as SiteSettingsState);

const mutations = {
  [SiteSettingsMutations.CHANGE_PROJECT](state: SiteSettingsState, project: BaseProjectDto) {
    state.project = project;
  },
  [SiteSettingsMutations.CHANGE_PAGE](state: SiteSettingsState, page: BaseProjectPageDto) {
    state.page = page;
  },
  [SiteSettingsMutations.CHANGE_PROJECT_PAGES](state: SiteSettingsState, projectPages: BaseProjectPageDto[]) {
    state.projectPages = projectPages;
  },
  [SiteSettingsMutations.UPDATE_PROJECT_PAGES_PAGE](state: SiteSettingsState, page: BaseProjectPageDto) {
    const projectIndexToUpdate: number = state.projectPages.findIndex(x => x.id == page.id);
    state.projectPages[projectIndexToUpdate] = page;
  },
  [SiteSettingsMutations.CHANGE_MODAL_MODE](state: SiteSettingsState, modalMode: ModalMode) {
    state.mode = modalMode;
  },
  [SiteSettingsMutations.CHANGE_ACTIVE_SECTION](state: SiteSettingsState, activeSection: SectionType) {
    state.activeSection = activeSection;
  },
  [SiteSettingsMutations.CHANGE_HOME_PAGE](state: SiteSettingsState, indexToChange: number) {
    state.projectPages.forEach((item: any, index: number) => {
      indexToChange === index ? (item.isHomePage = true) : (item.isHomePage = false);
    });
  },
  [SiteSettingsMutations.CHANGE_PROJECT_SETTINGS](state: SiteSettingsState, settings: ProjectSettingsDto) {
    if (state.project) state.project.settings = settings;
  }
};

const actions: ActionTree<SiteSettingsState, any> = {
  /**
   * TODO: change to get projectSettings and settings of project pages
   * Load modal data
   * because we need to call this modal in several cases:
   * 1. Страница "Страницы проекта"
   * 2. Попап Quick Actions у проекта
   * 3. Попап Quick Actions у страницы проекта
   * 4. Модальное окно выбора проекта в header редактора
   * 5. Модальное окно выбора страницы проекта в header редактора
   * 6. Header in editor near Publish button
   * @param store - Store
   * @param params - Parameters
   */
  async loadModalData(
    { commit },
    { projectId, pageId, activeSectionNumber }: { projectId: number; pageId: number; activeSectionNumber: SectionType }
  ) {
    const getProjectById = () => apiClient.projects.projectsGetById(projectId);
    const getProjectPages = () => apiClient.projectPages.projectPagesGet(projectId);

    await Promise.all([getProjectById(), getProjectPages()]).then(([{ data: project }, { data: projectPages }]) => {
      commit(SiteSettingsMutations.CHANGE_PROJECT, project);
      commit(SiteSettingsMutations.CHANGE_PROJECT_PAGES, projectPages);
      commit(
        SiteSettingsMutations.CHANGE_PAGE,
        pageId ? projectPages.find((page: any) => page.id == pageId) : projectPages[0]
      );
      commit(SiteSettingsMutations.CHANGE_MODAL_MODE, pageId ? ModalMode.Page : ModalMode.Project);
      if (activeSectionNumber) {
        commit(SiteSettingsMutations.CHANGE_ACTIVE_SECTION, activeSectionNumber);
      } else {
        commit(SiteSettingsMutations.CHANGE_ACTIVE_SECTION, pageId ? SectionType.PAGE_GENERAL : SectionType.GENERAL);
      }
    });
  },
  /**
   * Set modal data
   * use it when you have data: project, projectPages
   * @param store - Store
   * @param params - Parameters
   */
  setModalData({ commit }, { project, projectPages, pageId, activeSectionNumber }: any) {
    commit(SiteSettingsMutations.CHANGE_PROJECT, project);
    commit(SiteSettingsMutations.CHANGE_PROJECT_PAGES, projectPages);
    commit(
      SiteSettingsMutations.CHANGE_PAGE,
      pageId ? projectPages.find((page: any) => page.id == pageId) : projectPages[0]
    );
    commit(SiteSettingsMutations.CHANGE_MODAL_MODE, pageId ? ModalMode.Page : ModalMode.Project);
    if (activeSectionNumber) {
      commit(SiteSettingsMutations.CHANGE_ACTIVE_SECTION, activeSectionNumber);
    } else {
      commit(SiteSettingsMutations.CHANGE_ACTIVE_SECTION, pageId ? SectionType.PAGE_GENERAL : SectionType.GENERAL);
    }
  },
  setPage({ commit }, { page }: any) {
    commit(SiteSettingsMutations.CHANGE_PAGE, page);
    commit(SiteSettingsMutations.CHANGE_MODAL_MODE, ModalMode.Page);
    commit(SiteSettingsMutations.CHANGE_ACTIVE_SECTION, SectionType.PAGE_GENERAL);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
} as Module<SiteSettingsState, any>;

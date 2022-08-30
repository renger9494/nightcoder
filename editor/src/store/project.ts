/* eslint-disable no-console */
import router from '@/router';
import apiClient from '@/utils/apiClient';
import { Module, ActionTree } from 'vuex';
import {
  CreateProjectPageDto,
  CreateProjectDto,
  BaseProjectDto,
  BaseProjectPageDto,
  ProjectStatus,
  PagedProjectDto
} from '@/utils/api';
import ObjectKeys from '@/utils/types/ObjectKeys';
import { VisibleMessageNameType } from './ui';

export enum DeleteModalMode {
  Project = 'Project',
  Page = 'Page'
}

export interface DeleteModalData {
  type: DeleteModalMode;
  projectId?: number;
  pageId?: number;
  name?: string;
  actionAfterDelete?: () => void;
}

export interface RestoreModalData {
  type: DeleteModalMode;
  projectId?: number;
  pageId?: number;
  actionAfterDelete?: () => {};
}

export interface ProjectState {
  projects: PagedProjectDto[];
  projectPages: BaseProjectPageDto[];
  areProjectsLoading: boolean;
  openPageSettingsId: number | null;
  selectedProject: number | null;
  projectToPublish: object | null;
  templateToCreate: object | null;
  deleteModalData: DeleteModalData | null;
  restoreModalData: RestoreModalData | null;
  /**
   * @deprecated it's old, use popup data instead
   */
  openSiteSettingsId: number | null;
  publishProgress: number;
  /**
   * @deprecated it's old
   */
  publishId: null;
}

const state = (): ProjectState => ({
  projects: [],
  projectPages: [],
  areProjectsLoading: false,
  /**
   * @deprecated it's old, use popup data instead
   */
  openSiteSettingsId: null,
  openPageSettingsId: null,
  selectedProject: null,

  /**
   * @deprecated it's old
   */
  publishProgress: 0,
  /**
   * @deprecated it's old
   */
  publishId: null,

  templateToCreate: null,
  projectToPublish: null,
  deleteModalData: null,
  restoreModalData: null
});

function getProjectById(state: ProjectState, id: number): BaseProjectDto {
  const project = state.projects.find(p => p.id == id);

  if (!project) throw new Error(`[store/project]: can't find project by id: ${id}`);

  return project;
}

function getPageById(state: ProjectState, id: number): BaseProjectPageDto & ObjectKeys<string> {
  const page = state.projectPages.find(p => p.id == id);

  if (!page) throw new Error(`[store/project]: can't find page by id: ${id}`);

  return page as BaseProjectPageDto & ObjectKeys<string>;
}

const mutations = {
  /**
   * old function for create project from template on editor. Not needed anymore
   * Now page created with editor config in server
   * @deprecated
   * @param {*} state
   * @param {*} data
   */
  changeTemplateToCreate(state: ProjectState, data: object) {
    state.templateToCreate = data;
  },
  changeProjectSettings(state: ProjectState, { id, settings }: any) {
    const project = getProjectById(state, id);

    for (const key in settings) {
      if (project.settings.hasOwnProperty(key)) {
        (project.settings as any)[key] = settings[key];
      } else {
        console.warn(`[project/changeProjectSettings]: ${key} is not exist in project.settings`);
      }
    }
  },
  changePublishProgress(state: ProjectState, data: number) {
    state.publishProgress = data;
  },
  changePublishedProject(state: ProjectState, { id, previewImage, name }: any) {
    const project = getProjectById(state, id)
    if (project) {
      if (previewImage)
        project.previewImage = previewImage
      project.name = name
    }

  },
  changeProjects(state: ProjectState, projects: any[]) {
    state.projects = projects;
  },
  setSelectedProject(state: ProjectState, projectId: number) {
    state.selectedProject = projectId;
  },
  publishPage(state: ProjectState, { publishedPage, projectId }: any) {
    const page = getPageById(state, publishedPage.id);
    for (const property in publishedPage) {
      page[property] = publishedPage[property];
    }

    const project = getProjectById(state, projectId);
    if (project.status != ProjectStatus.Published) {
      project.statusName = ProjectStatus.Published;
      project.status = ProjectStatus.Published;
    }
  },
  unPublishPage(state: ProjectState, { publishedPage, projectId }: any) {
    const page = getPageById(state, publishedPage.id);
    for (const property in publishedPage) {
      page[property] = publishedPage[property];
    }

    const project = getProjectById(state, projectId);
    if (project.status != ProjectStatus.Draft) {
      project.statusName = ProjectStatus.Draft;
      project.status = ProjectStatus.Draft;
    }
  },
  changePagePreview(state: ProjectState, { pageId, projectId, previewImage }: any) {
    const page = getPageById(state, pageId);
    page.previewImage = previewImage;
    if (page.isHomePage) {
      const project = getProjectById(state, projectId);
      project.previewImage = previewImage;
    }
  },
  changeProjectPages(state: ProjectState, projectPages: any[]) {
    state.projectPages = projectPages;
  },
  changeAreProjectsLoading(state: ProjectState, value: boolean) {
    state.areProjectsLoading = value;
  },
  /**
   *
   * @param {*} state
   * @param {*} projectId
   * @deprecated it's old, use popupData instead
   */
  changeOpenSiteSettingsId(state: ProjectState, projectId: number) {
    state.openSiteSettingsId = projectId;
  },
  /**
   *
   * @param {*} state
   * @param {*} page
   * @deprecated it's old, use popupData instead
   */
  changeOpenPageSettingsId(state: ProjectState, page: any) {
    if (page) {
      state.openPageSettingsId = page.id;
      state.openSiteSettingsId = page.projectId;
    } else {
      state.openPageSettingsId = page;
      state.openSiteSettingsId = page;
    }
  },
  changeDeleteModalData(state: ProjectState, modalData: DeleteModalData) {
    state.deleteModalData = modalData;
  },
  changeRestoreModalData(state: ProjectState, modalData: RestoreModalData) {
    state.restoreModalData = modalData;
  },
  changeProjectPage(state: ProjectState, page: any) {
    const currentPage = getPageById(state, page.id);

    for (const key in currentPage) {
      currentPage[key] = page[key];
    }
  }
};

const getters = {
  getProjectSettingsById: (state: ProjectState) => (id: number) => {
    const project = state.projects.find(el => el.id == id);
    return project?.settings;
  },
  getProjectPageById: (state: ProjectState) => (id: number) => {
    return state.projectPages.find(x => x.id == id);
  },
  getProjectToPublish: (state: ProjectState) => state.projectToPublish,
  getProjectById: (state: ProjectState) => (id: number) => {
    return state.projects.find(p => p.id == id);
  }
};

const actions: ActionTree<ProjectState, any> = {
  loadProjectPages(context, projectId: number) {
    apiClient.projectPages
      .projectPagesGet(projectId)
      .then(({ data }) => {
        context.commit('changeProjectPages', data);
      })
      .catch(error => {
        console.error(error);
      });
  },
  loadProjects(context) {
    context.commit('changeAreProjectsLoading', true);
    apiClient.projects
      .projectsGetPaged()
      .then(({ data }) => {
        context.commit('changeAreProjectsLoading', false);
        context.commit('changeProjects', data.items);
      })
      .catch(error => {
        context.commit('changeAreProjectsLoading', false);
        console.error(error);
      });
  },
  createProject(context, request: CreateProjectDto) {
    apiClient.projects
      .projectsCreate(request)
      .then(({ data: { projectId, pageId } }) => {
        context.dispatch('loadProjects');
        router.push(`/editor/projects/${projectId}/pages/${pageId}`);
      })
      .catch(error => {
        console.error(error);
      });
  },

  duplicateProject(context, projectId: number) {
    apiClient.projects
      .projectsDuplicate(projectId)
      .then(() => {
        context.dispatch('loadProjects');
      })
      .catch(error => {
        console.error(error);
      });
  },
  deleteProject(
    { commit, dispatch },
    { projectId, actionAfterDelete }: { projectId: number; actionAfterDelete: () => {} }
  ) {
    apiClient.projects
      .projectsDelete(projectId)
      .then(() => {
        actionAfterDelete();
      })
      .catch(error => {
        console.warn(error);
      });
  },
  restoreProject({ dispatch, commit }, { projectId }: any) {
    apiClient.projects
      .projectsRestore(projectId)
      .then(() => {
        commit('ui/changeVisibleMessageName', null, { root: true });
        dispatch('loadProjects');
      })
      .catch(error => {
        console.warn(error);
      });
  },
  createPage({ dispatch, commit }, payload: CreateProjectPageDto & { projectId: number }) {
    apiClient.projectPages
      .projectPagesCreate(payload.projectId, payload)
      .then(({ data: pageId }) => {
        router.push(`/editor/projects/${payload.projectId}/pages/${pageId}`);
      })
      .catch(error => {
        console.warn('[project/createPage]:', error);
      });
  },
  savePage({ commit, dispatch }, { page, isChangeHomePage, isChangeUrl }: any) {
    apiClient.projectPages
      .projectPagesSave(page.projectId, page.id, page)
      .then(() => {
        if (isChangeHomePage || isChangeUrl) dispatch('loadProjectPages', page.projectId);
        commit('changeProjectPage', page);
      })
      .catch(error => {
        console.warn('[store/savePage]:', error);
      });
  },
  duplicatePage({ dispatch }, page: any) {
    apiClient.projectPages
      .projectPagesDuplicate(page.projectId, page.id)
      .then(() => {
        dispatch('loadProjectPages', page.projectId);
      })
      .catch(error => {
        console.error(error);
      });
  },
  deletePage(
    { dispatch },
    { projectId, pageId }: { pageId: number; projectId: number; }
  ) {
    return new Promise((resolve, reject) => {
      apiClient.projectPages
        .projectPagesDelete(projectId, pageId)
        .then(() => {
          resolve('');
        })
        .catch(error => {
          console.error(error);
          reject('');
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} as Module<ProjectState, any>;

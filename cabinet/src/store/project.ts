/* eslint-disable no-console */
import { createEditorPageUrl, getErrorData } from '@/utils/http'
import { Module, ActionTree } from 'vuex'
import { ProjectStatusEnum } from '@/utils/types/api/Base'
import apiClient from '@/utils/apiClient'
import { CreateProjectPageDto, CreateProjectDto, BaseProjectDto, BaseProjectPageDto, PagedProjectDto } from '@/utils/api'
import ObjectKeys from '@/utils/types/ObjectKeys'
import { VisibleMessageNameType } from '@/store/ui'

export enum DeleteModalMode {
  Project = 'Project',
  Page = 'Page',
}

export interface DeleteModalData {
  type: DeleteModalMode
  projectId?: number
  pageId?: number
  name?: string
  actionAfterDelete?: () => void
}

export interface RestoreModalData {
  type: DeleteModalMode
  projectId?: number
  pageId?: number
  actionAfterDelete?: () => {}
}

export interface ProjectState {
  projects: BaseProjectDto[]
  project: BaseProjectDto
  projectPages: BaseProjectPageDto[]
  areProjectsLoading: boolean
  openPageSettingsId: number | null
  selectedProject: number | null
  projectIdWhosePageToDelete: number | null
  projectToPublish: object | null
  pageToPublish: object | null
  templateToCreate: object | null
  deleteModalData: DeleteModalData | null
  restoreModalData: RestoreModalData | null
}

const state = (): ProjectState => ({
  projects: [] as BaseProjectDto[],
  project: {} as BaseProjectDto,
  projectPages: [] as BaseProjectPageDto[],
  areProjectsLoading: false,
  openPageSettingsId: null,
  selectedProject: null,
  projectIdWhosePageToDelete: null,
  projectToPublish: null,
  pageToPublish: null,
  templateToCreate: null,
  deleteModalData: null,
  restoreModalData: null,
})

function getProjectById(state: ProjectState, id: number): BaseProjectDto {
  const project = state.projects.find((p) => p.id == id)
  if (!project) throw new Error(`[store/project]: can't find project by id: ${id}`)

  return project
}

function getPageById(state: ProjectState, id: number): BaseProjectPageDto & ObjectKeys<string> {
  const page = state.projectPages.find((p) => p.id == id)
  if (!page) throw new Error(`[store/project]: can't find page by id: ${id}`)

  return page as BaseProjectPageDto & ObjectKeys<string>
}

const mutations = {
  /**
   * old function for create project from template on editor. Not needed anymore
   * Now page created with editor config in server
   * @deprecated
   * @param {*} state
   * @param {*} data
   */
  changeTemplateToCreate(state: ProjectState, templateToCreate: object) {
    state.templateToCreate = templateToCreate
  },
  changeProjectSettings(state: ProjectState, { id, settings }: any) {
    let project = getProjectById(state, id)

    for (const key in settings) {
      if (project.settings.hasOwnProperty(key)) {
        (<any>project.settings)[key] = settings[key]
      } else {
        console.warn(`[project/changeProjectSettings]: ${key} is not exist in project.settings`)
      }
    }
  },
  changeProjects(state: ProjectState, projects: any[]) {
    state.projects = projects
  },
  setSelectedProject(state: ProjectState, projectId: number) {
    state.selectedProject = projectId
  },
  publishPage(state: ProjectState, { publishedPage, projectId }: any) {
    const page = getPageById(state, publishedPage.id)
    for (const property in publishedPage) {
      page[property] = publishedPage[property]
    }

    const project = getProjectById(state, projectId)
    if (project.statusName != ProjectStatusEnum.Published) project.statusName = ProjectStatusEnum.Published
  },
  changePagePreview(state: ProjectState, { pageId, projectId, previewImage }: any) {
    const page = getPageById(state, pageId)
    page.previewImage = previewImage
    if (page.isHomePage) {
      const project = state.projects.find((x) => x.id == projectId)
      if (project) project.previewImage = previewImage
    }
  },
  changeProjectPreview(state: ProjectState, { projectId, previewImage }: any) {
    const project = getProjectById(state, projectId)
    project.previewImage = previewImage
  },
  changePublishedProject(state: ProjectState, { id, previewImage, name }: any) {
    const project = getProjectById(state, id)
    if (project) {
      if (previewImage)
        project.previewImage = previewImage
      project.name = name
    }

  },
  changeProjectName(state: ProjectState, { id, name }: any) {
    const project = getProjectById(state, id)
    if (project) {
      project.name = name
    }
  },

  changePageName(state: ProjectState, { pageId, name }: any) {
    const page = getPageById(state, pageId)
    if (page) {
      page.name = name
    }
  },
  changeProjectPages(state: ProjectState, projectPages: Array<any>) {
    state.projectPages = projectPages
  },
  changeAreProjectsLoading(state: ProjectState, areProjectsLoading: boolean) {
    state.areProjectsLoading = areProjectsLoading
  },
  changeDeleteModalData(state: ProjectState, modalData: DeleteModalData) {
    state.deleteModalData = modalData
  },
  changeRestoreModalData(state: ProjectState, modalData: RestoreModalData) {
    state.restoreModalData = modalData
  },
  changeProjectPage(state: ProjectState, page: any) {
    const currentPage = getPageById(state, page.id)

    for (var key in currentPage) {
      currentPage[key] = page[key]
    }

  },
  changeProjectPageUnpublish(state: ProjectState, pageID: number) {
    const currentPage = getPageById(state, pageID)
    if (currentPage)
      currentPage.isPublished = false

  },
  changePageToPublish(state: ProjectState, page: any) {
    state.pageToPublish = page
  },
  changeProjectToPublish(state: ProjectState, id: number) {
    const project = getProjectById(state, id)
    if (project) {
      project.isPublishedInCommunity = true
    }
  },
  changeProject(state: ProjectState, project: any) {
    state.projects = state.projects.map(item => item.id === project.id ? project : item)
  },
  removeProject(state: ProjectState, projectId: number) {
    const project = state.projects.find((p) => p.id == projectId)
    if (!project) return
    const index = state.projects.indexOf(project)
    state.projects = state.projects.splice(index, 1);
  },
  removePage(state: ProjectState, pageId: number) {
    const page = state.projectPages.find((p) => p.id == pageId)
    if (!page) return
    const index = state.projectPages.indexOf(page)
    state.projectPages = state.projectPages.splice(index, 1);
  },
}

const getters = {
  getProjectSettingsById: (state: ProjectState) => (id: number) => {
    const project = state.projects.find((p) => p.id == id)
    return project?.settings
  },
  getProjectPageById: (state: ProjectState) => (id: number) => {
    return state.projectPages.find((x) => x.id == id)
  },
  getProjectToPublish: (state: ProjectState) => state.projectToPublish,
  getPageToPublish: (state: ProjectState) => state.pageToPublish,

  getProjectById: (state: ProjectState) => (id: number) => {
    return state.projects.find((p) => p.id == id)
  },
}

const actions: ActionTree<ProjectState, any> = {
  loadProjectPages(context, projectId: number) {
    apiClient.projectPages
      .projectPagesGet(projectId)
      .then(({ data }) => {
        context.commit('changeProjectPages', data)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  loadProjects(context) {
    context.commit('changeAreProjectsLoading', true)
    apiClient.projects
      .projectsGet()
      .then(({ data }) => {
        context.commit('changeAreProjectsLoading', false)
        context.commit('changeProjects', data)
      })
      .catch((error) => {
        context.commit('changeAreProjectsLoading', false)
        console.error(error)
      })
  },
  createProject(context, projectToCreate: CreateProjectDto) {
    apiClient.projects
      .projectsCreate(projectToCreate)
      .then(({ data }) => {
        const { projectId, pageId } = data
        location.href = createEditorPageUrl(projectId, pageId)
      })
      .catch((error) => {
        console.error(error)
      })
  },

  duplicateProject(context, projectId: number) {
    apiClient.projects
      .projectsDuplicate(projectId)
      .then(() => {
        context.dispatch('loadProjects')
      })
      .catch((error) => {
        console.error(error)
      })
  },
  deleteProject(
    { commit, dispatch },
    { projectId, actionAfterDelete }: { projectId: number; actionAfterDelete: () => {} }
  ) {
    apiClient.projects
      .projectsDelete(projectId)
      .then(() => {
        // if (actionAfterDelete)
        //   setTimeout(actionAfterDelete, 5000)
        const restoreModalData: RestoreModalData = { projectId, type: DeleteModalMode.Project, actionAfterDelete }
        commit('changeRestoreModalData', restoreModalData)
        commit('ui/changeVisibleMessageName', VisibleMessageNameType.DeleteProjectSuccess, { root: true })
        setTimeout(() => {
          if (actionAfterDelete) actionAfterDelete()

        }, 6000)

        // hide, because it needs rethinking
        // setTimeout(() => {
        //   const restoreModalData: RestoreModalData = { projectId, type: DeleteModalMode.Project, actionAfterDelete }
        //   commit('changeRestoreModalData', restoreModalData)
        //   commit('ui/changeVisibleMessageName', VisibleMessageNameType.DeleteProjectSuccess, { root: true })
        // }, 300)
      })
      .catch((error) => {
        console.warn(error)
      })
  },
  restoreProject(context, { projectId }: any) {
    apiClient.projects
      .projectsRestore(projectId)
      .then(() => {
        context.commit('ui/changeVisibleMessageName', null, { root: true })
        context.dispatch('loadProjects')
      })
      .catch((error) => {
        console.warn(error)
      })
  },
  createPage({ dispatch, commit }, payload: CreateProjectPageDto & { projectId: number }) {
    apiClient.projectPages
      .projectPagesCreate(payload.projectId, payload)
      .then(({ data }) => {
        const pageId = data
        location.href = createEditorPageUrl(payload.projectId, pageId)
      })
      .catch((error) => {
        console.warn('[project/createPage]:', error)
      })
  },
  savePage(context, { page, isChangeHomePage, isChangeUrl }: any) {
    apiClient.projectPages
      .projectPagesSave(page.projectId, page.id, page)
      .then(() => {
        if (isChangeHomePage || isChangeUrl) context.dispatch('loadProjectPages', page.projectId)
        context.commit('changeProjectPage', page)
      })
      .catch((error) => {
        console.warn('[store/savePage]:', error)
      })
  },
  duplicatePage(context, page: any) {
    apiClient.projectPages
      .projectPagesDuplicate(page.projectId, page.id)
      .then(() => {
        context.dispatch('loadProjectPages', page.projectId)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  deletePage(
    context, { projectId, pageId, actionAfterDelete }: { pageId: number; projectId: number; actionAfterDelete: () => {} }
  ) {
    apiClient.projectPages
      .projectPagesDelete(projectId, pageId)
      .then(() => {
        //hide, because it needs rethinking
        // const restoreModalData: RestoreModalData = { projectId, pageId, type: DeleteModalMode.Page, actionAfterDelete }
        // commit('changeRestoreModalData', restoreModalData)
        context.dispatch('loadProjectPages', projectId)

        const restoreModalData: RestoreModalData = { projectId, pageId, type: DeleteModalMode.Page, actionAfterDelete }
        context.commit('changeRestoreModalData', restoreModalData)

        context.commit('ui/changeVisibleMessageName', VisibleMessageNameType.DeleteProjectSuccess, { root: true })
        setTimeout(() => {
          if (actionAfterDelete) actionAfterDelete()

        }, 6000)
      })
      .catch((errorResponse) => {
        const error = getErrorData(errorResponse);
        console.error(error);
      })
  },
  restorePage(context, { projectId, pageId }: any) {
    apiClient.projectPages
      .projectPagesRestore(projectId, pageId)
      .then(() => {
        context.commit('ui/changeVisibleMessageName', null, { root: true })
      })
      .catch((error) => {
        console.warn(error)
      })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
} as Module<ProjectState, any>

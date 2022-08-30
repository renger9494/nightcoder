import { Api } from './api'
import apiClient from '@/utils/apiClient'

export enum DomainStatus {
  NotWorked,
  Worked,
}

class DomainStatusChecker {
  private _apiClient: Api<unknown>
  private _timeout = 1000
  constructor(apiClient: Api<unknown>) {
    this._apiClient = apiClient
  }

  async isWorked(projectId: number) {
    let countOfAttempt = 5
    while (countOfAttempt > 0) {
      const domainStatus = await this.getDomainStatus(projectId)
      countOfAttempt--
      if (countOfAttempt == 0 || domainStatus == DomainStatus.Worked) {
        return domainStatus
      }
    }
  }

  private async getDomainStatus(projectId: number) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data: status } = await this._apiClient.projects.projectsCheckCustomDomainStatus(projectId)
          resolve(status.isResolved ? DomainStatus.Worked : DomainStatus.NotWorked)
        } catch (e) {
          resolve(DomainStatus.NotWorked)
        }
      }, this._timeout)
    })
  }
}

export const domainStatusChecker = new DomainStatusChecker(apiClient)

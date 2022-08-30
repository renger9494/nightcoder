import auth from '@/utils/auth'
import apiClient from '@/utils/apiClient'
import http from '@/utils/http'
import { Store } from 'vuex'
import { PlanCategory, AccountDto } from '@/utils/api'

export interface AuthState {
  user: AccountDto | null
  isUserLoggedIn: boolean
}

const state = (): AuthState => ({
  isUserLoggedIn: false,
  user: null,
})

const mutations = {
  changeIsUserLoggedIn(state: AuthState, isUserLoggedIn: boolean) {
    state.isUserLoggedIn = isUserLoggedIn
  },
  readAllNotifications(state: AuthState) {
    if (state.user)
      state.user.plan.unreadNotifications = 0
  },
  changeUser(state: AuthState, user: AccountDto) {
    state.user = user
  },
}

const actions = {
  async checkIsUserLoggedIn(context: Store<any>) {
    const isTokenValid = await auth.isTokenValid()
    context.commit('changeIsUserLoggedIn', isTokenValid)
  },
  async getUserInfo(context: Store<any>, { cookie }: any) {
    if (cookie) apiClient.instance.defaults.headers.Cookie = cookie
    // const { data: user } = await http.get('/api/accounts?filter=' + Date.now(), null, cookie);
    const { data: user } = await apiClient.accounts.accountsGet();
    context.commit('changeUser', user)
    context.commit('changeIsUserLoggedIn', true)
  },
}

const getters = {
  isUserWithFreePlan(state: AuthState) {
    return state.user && state.user.plan.category === PlanCategory.Free
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

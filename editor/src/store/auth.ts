import apiClient from '@/utils/apiClient';
import { Module, ActionTree } from 'vuex';
import { PlanCategory, AccountDto } from '@/utils/api';

export interface AuthState {
  user: AccountDto | null;
  isUserLoggedIn: boolean;
}

const state = (): AuthState => ({
  isUserLoggedIn: false,
  user: null
});

const mutations = {
  changeIsUserLoggedIn(state: AuthState, isUserLoggedIn: boolean) {
    state.isUserLoggedIn = isUserLoggedIn;
  },
  changeUser(state: AuthState, user: AccountDto) {
    state.user = user;
  }
};

const actions: ActionTree<AuthState, any> = {
  async getUserInfo(context) {
    const { data: user } = await apiClient.accounts.accountsGet();
    // if (!user.avatar) user.avatar = '/img/projects/avatar.jpg';

    context.commit('changeUser', user);
    context.commit('changeIsUserLoggedIn', true);
  }
};

const getters = {
  isUserWithFreePlan(state: AuthState) {
    return state.user && state.user.plan.category === PlanCategory.Free;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} as Module<AuthState, any>;

<template>
  <div class="limit-project-popup-wrap">
    <img
      class="limit-project-img"
      src="/img/dashboard/limit-project.png"
      srcset="/img/dashboard/limit-project@2x.png 2x"
      alt=""
    />
    <div class="limit-project-header">The limit is reached</div>
    <div class="limit-project-text">
      you have
      <span class="limit-project-text-bold">exceeded the limit</span> of
      creating new projects. You can
      <span class="limit-project-text-bold">update</span> your tariff to create
      new fascinating websites
    </div>
    <upgrade-to-pro-button class="limit-project__upgrade-to-pro-button" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import apiClient from '@/utils/apiClient'
import { mapState } from 'vuex'
import { PopupSettings, ChangeAccountSettingsPopupData } from './types'
import { AccountDto, ForgotPasswordDto } from '@/utils/api'
import UpgradeToProButton from '@/components/Header/UpgradeToProButton.vue'
export default Vue.extend({
  computed: {
    ...mapState({
      popupSettings: (state: any) =>
        <PopupSettings<ChangeAccountSettingsPopupData>>state.ui.popupSettings,
      user: (state: any) => <AccountDto>state.auth.user,
    }),
  },
  components: {
    UpgradeToProButton,
  },
  methods: {
    closeModal() {
      this.$store.commit('ui/SET_POPUP_SETTINGS', {
        active: false,
      })
    },
  },
})
</script> 
<style lang="scss" scoped>
.action-btns {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  border: 1px solid #000000;
  box-sizing: border-box;
  background: #000000;
  border-radius: 6px;
  height: 40px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: #ffffff;
  cursor: pointer;
  &:hover {
    background: #333333;
    border: 1px solid #333333;
  }
}
.limit-project {
  &-popup-wrap {
    display: flex;
    flex-direction: column;
    min-height: 280px;
    height: 100%;

    align-items: center;
  }
  &-img {
    width: 162px;
    height: 122px;
    margin-top: -20px;
    margin-bottom: 20px;
  }
  &-header {
    font-weight: 400;
    font-size: 25px;
    line-height: 38px;
    text-align: center;
    margin-bottom: 8px;
  }
  &-text {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    margin-bottom: 16px;
    &-bold {
      font-weight: 600;
    }
  }
  &__upgrade-to-pro-button {
    height: 37px;
  }
}
</style>
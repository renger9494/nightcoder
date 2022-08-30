<template>
  <div class="changed-accountSettings-popup-wrap">
    <img
      class="changed-accountSettings-img"
      src="/img/dashboard/publish-changes.png"
      srcset="/img/dashboard/publish-changes@2x.png 2x"
      alt=""
    />
    <div v-if="isSuccessed" class="changed-accountSettings-text">
      You can check your inbox
    </div>
    <div v-else class="changed-accountSettings-text">
      Do you really want to change your
      {{ popupSettings.data.isPassword ? 'Password' : 'Email' }}?
    </div>
    <login-button
      :action="sendMail"
      :is-disabled="errors != ''"
      :is-processing="isProcessing"
      :button-text="isSuccessed ? 'Okay' : 'Send email'"
    />
    <!--  <div class="action-btns" @click="sendMail">Send the confirmation</div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import apiClient from '@/utils/apiClient'
import { mapState } from 'vuex'
import { PopupSettings, ChangeAccountSettingsPopupData } from '../types'
import { AccountDto, ForgotPasswordDto } from '@/utils/api'
import LoginButton from '@/components/Login/LoginButton.vue'
export default Vue.extend({
  computed: {
    ...mapState({
      popupSettings: (state: any) =>
        <PopupSettings<ChangeAccountSettingsPopupData>>state.ui.popupSettings,
      user: (state: any) => <AccountDto>state.auth.user,
    }),
  },
  components: {
    LoginButton,
  },
  data() {
    return {
      isProcessing: false,
      isSuccessed: false,
      errors: '',
    }
  },
  methods: {
    sendMail() {
      if (this.isSuccessed) {
        this.closeModal()
        return
      }
      if (this.popupSettings.data.isPassword) {
        var data: ForgotPasswordDto = {
          email: this.user.email,
        }
        this.isProcessing = true
        apiClient.auth
          .authForgotPassword(data)
          .then(() => {
            this.isProcessing = false
            this.isSuccessed = true
          })
          .catch((error) => {
            this.isProcessing = false
            this.isSuccessed = false
            console.log(error)
          })
      } else {
        apiClient.auth
          .authSendChangingEmail()
          .then(() => {
            this.isProcessing = false
            this.isSuccessed = true
          })
          .catch((error) => {
            this.isProcessing = false
            this.isSuccessed = false
            console.log(error)
          })
      }
      this.popupSettings.data.sendMail
    },
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
.changed-accountSettings-popup-wrap {
  display: flex;
  flex-direction: column;
  min-height: 280px;
  height: 100%;
  margin-top: -20px;
  align-items: center;
  justify-content: space-between;
  .changed-accountSettings-img {
    width: 143px;
    height: 140px;
    margin-top: -20px;
    margin-bottom: 20px;
  }
  .changed-accountSettings-text {
    font-weight: 400;
    font-size: 25px;
    line-height: 38px;
    text-align: center;
    margin-bottom: 30px;
  }
}
</style>
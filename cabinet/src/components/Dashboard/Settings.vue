<template>
  <div>
    <transition :css="false" @enter="enter" @leave="leave">
      <div class="accountSettings">
        <div class="accountSettings__title">Settings</div>
        <div class="accountSettings__email-group">
          <air-title>Account</air-title>
          <div class="accountSettings__fields-wrapper">
            <div class="accountSettings__field-wrapper">
              <email
                class="accountSettings__email"
                :value="user && user.email"
                :onChangeEmailClick="toggleAccountSettings"
                v-if="!isEmailEditing"
              ></email>
              <div
                class="
                  accountSettings__field-wrapper
                  accountSettings__field-wrapper_email
                "
                v-else
              >
                <field
                  :label="'Email'"
                  :name="'email'"
                  :type="'email'"
                  :isReadOnly="true"
                  :value="isEmailTouched ? inputValues.email : user.email"
                  :error="inputErrors.email"
                  :onChange="changeInputValue"
                ></field>
              </div>
              <!--  <div class="accountSettings__field-wrapper__footer">
                You are logged in with
                <svg-icon
                  class="accountSettings__field-wrapper__googleLogo"
                  width="11"
                  height="11"
                  folder="login"
                  name="googleLogo"
                />
                account
              </div>-->
            </div>
          </div>
          <div
            class="accountSettings__password-group"
            @click="toggleAccountSettings($event, true)"
          >
            Change Password
          </div>
        </div>
        <div class="accountSettings__notifications-group">
          <notifications />

          <!--  <div class="accountSettings__actions">
        <air-button :tag="'button'" :onClick="saveChanges"> Save </air-button>
      </div> -->
        </div>
      </div>
    </transition>
    <transition name="popup-layer" mode="out-in">
      <div ref="popupButton-accountSettings"></div
    ></transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AirTitle from '@/components/Settings/Title.vue'
import Field from '@/components/Settings/Field.vue'
import Email from '@/components/Settings/AccountSettings/Email.vue'
import AirButton from '@/components/Settings/Button.vue'
import Notifications from '@/components/Settings/Notifications.vue'
import EmailJs from '@/utils/email'
import ObjectKeys from '@/utils/types/ObjectKeys'
import { mapState } from 'vuex'
import { AccountDto, PlanCategory } from '@/utils/api'
import apiClient from '@/utils/apiClient'

import {
  PopupSettings,
  PopupType,
  ChangeAccountSettingsPopupData,
} from '@/components/Modal/types'
export default Vue.extend({
  components: {
    AirTitle,
    Field,
    Email,
    AirButton,
    Notifications,
  },
  data() {
    return {
      inputValues: {
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      } as ObjectKeys<string>,
      inputErrors: {
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      } as ObjectKeys<string>,
      touchedInputNames: [] as any[],
      isEmailEditing: false,
      isFormValid: true,
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      popupSettings: (state: any) => state.ui.popupSettings,
    }),
    isNameTouched(): any {
      return this.touchedInputNames.find(
        (touchedInputName) => touchedInputName === 'name'
      )
    },
    isEmailTouched(): any {
      return this.touchedInputNames.find(
        (touchedInputName) => touchedInputName === 'email'
      )
    },
  },
  methods: {
    toggleAccountSettings(event: any, isPassword: boolean) {
      if (event) event.preventDefault()
      const domRect = (<HTMLDivElement>(
        this.$refs['popupButton-accountSettings']
      )).getBoundingClientRect()
      const popupSettings: PopupSettings<ChangeAccountSettingsPopupData> = {
        active: true,
        closeButton: true,
        header: '',
        content: PopupType.ChangedAccountSettings,
        location: domRect,
        data: {
          sendMail: isPassword
            ? this.sendMailChangedPassword
            : this.sendMailChangedEmail,
          isPassword: isPassword,
        },
      }
      this.$store.commit('ui/SET_POPUP_SETTINGS', popupSettings)
    },
    changeInputValue(inputName: any, event: any) {
      this.inputValues[inputName] = event.currentTarget.value

      if (
        !this.touchedInputNames.find(
          (touchedInputName) => touchedInputName === inputName
        )
      ) {
        this.touchedInputNames.push(inputName)
      }
    },
    leave(el: any, done: any) {
      this.$gsap.tweenMax.to(el, 0.25, {
        x: '-100%',
        clearProps: 'all',
        ease: this.$gsap.expo.easeIn,
        onComplete: () => {
          done()
        },
      })
    },
    enter(el: any, done: any) {
      this.$gsap.tweenMax.fromTo(
        el,
        0.5,
        {
          x: '-100%',
        },
        {
          x: '0%',
          clearProps: 'all',
          ease: this.$gsap.expo.easeOut,
          onComplete: () => {
            done()
          },
        }
      )
    },
    sendMailChangedPassword() {},
    sendMailChangedEmail() {},
  },
})
</script>

<style lang="scss" scoped>
.accountSettings {
  font-family: 'Poppins', sans-serif;
  margin: 30px 0 20px 0;
  &__title {
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
    margin-bottom: 20px;
  }
  &__email-group {
    padding-bottom: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #dadada;
  }
  &__fields-wrapper {
    display: flex;
    margin-bottom: 26px;

    &:last-child {
      margin-bottom: 0;
    }
  }
  &__password-group {
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    color: #173bef;
    border-bottom: 1px solid transparent;
    margin-top: 20px;
    width: fit-content;
    cursor: pointer;
    &:hover {
      border-bottom: 1px solid #173bef;
    }
  }
  &__field-wrapper {
    position: relative;
    margin-right: 20px;
    &__footer {
      font-weight: 400;
      font-size: 10px;
      line-height: 15px;
      text-align: left;
      width: 100%;
      margin-top: 5px;
      margin-bottom: 0px;
      height: 16px;
      font-family: 'Poppins';
      align-items: center;
      flex-direction: row;
      display: flex;
    }
    &__googleLogo {
      margin: 1px 2px 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  &__forgot-password-link {
    position: absolute;
    top: -1px;
    left: 240px;
    font-size: 10px;
    text-decoration: none;
    white-space: nowrap;
    color: #333333;
    padding: 2px 4px;
    transition: 0.3s;
    border-radius: $shape_border_radius;
    transform: translateX(-100%);

    &:hover {
      color: #000000;
      background-color: #f2f2f2;
    }
  }
}

@media screen and (max-width: 414px) {
  .accountSettings {
    margin: 30px 0 80px 0;
    &__field-wrapper {
      width: 100%;
    }
  }
}
</style>

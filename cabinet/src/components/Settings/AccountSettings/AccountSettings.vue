<template>
  <div class="accountSettings" v-if="!!user">
    <div class="accountSettings__email-group">
      <air-title>Email</air-title>
      <div class="accountSettings__fields-wrapper">
        <div class="accountSettings__field-wrapper">
          <email
            class="accountSettings__email"
            :value="user && user.email"
            :onChangeEmailClick="toggleEmailEditing"
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
              :value="isEmailTouched ? inputValues.email : user.email"
              :error="inputErrors.email"
              :onChange="changeInputValue"
            ></field>
          </div>
        </div>
      </div>
    </div>
    <div class="accountSettings__password-group">
      <air-title>Password</air-title>
      <div class="accountSettings__fields-wrapper">
        <div
          class="
            accountSettings__field-wrapper
            accountSettings__field-wrapper_current-password
          "
        >
          <field
            :label="'Current Password'"
            :name="'currentPassword'"
            :type="'password'"
            :value="inputValues.currentPassword"
            :error="inputErrors.currentPassword"
            :onChange="changeInputValue"
          ></field>
          <router-link
            class="accountSettings__forgot-password-link"
            to="/forgot-password"
            >Forgot Password</router-link
          >
        </div>
        <div class="accountSettings__field-wrapper">
          <field
            :label="'New Password'"
            :name="'newPassword'"
            :type="'password'"
            :value="inputValues.newPassword"
            :error="inputErrors.newPassword"
            :onChange="changeInputValue"
          ></field>
        </div>
        <div class="accountSettings__field-wrapper">
          <field
            :label="'Retype New Password'"
            :name="'confirmNewPassword'"
            :type="'password'"
            :value="inputValues.confirmNewPassword"
            :error="inputErrors.confirmNewPassword"
            :onChange="changeInputValue"
          ></field>
        </div>
      </div>
      <div class="accountSettings__actions">
        <air-button :tag="'button'" :onClick="saveChanges"> Save </air-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AirTitle from '@/components/Settings/Title.vue'
import Field from '@/components/Settings/Field.vue'
import Email from '@/components/Settings/AccountSettings/Email.vue'
import AirButton from '@/components/Settings/Button.vue'

import EmailJs from '@/utils/email'
import ObjectKeys from '@/utils/types/ObjectKeys'
import { mapState } from 'vuex'
import { AccountDto, PlanCategory } from '@/utils/api'
import apiClient from '@/utils/apiClient'
import { VisibleMessageNameType } from '@/store/ui'

export default Vue.extend({
  components: {
    AirTitle,
    Field,
    Email,
    AirButton,
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
    toggleEmailEditing(event: any) {
      if (event) event.preventDefault()

      this.isEmailEditing = !this.isEmailEditing
    },
    validateFields() {
      const fieldsToValidate = {} as any

      this.touchedInputNames.forEach((touchedInputName) => {
        fieldsToValidate[touchedInputName] = this.inputValues[touchedInputName]
      })
      const hasOwnProperty = fieldsToValidate.hasOwnProperty
      if (
        hasOwnProperty.call(fieldsToValidate, 'name') &&
        fieldsToValidate.name.length === 0
      ) {
        this.inputErrors.name = 'This field may not be empty'
      } else if (this.inputErrors.name === 'This field may not be empty') {
        this.inputErrors.name = ''
      }

      if (
        hasOwnProperty.call(fieldsToValidate, 'email') &&
        fieldsToValidate.email.length === 0
      ) {
        this.inputErrors.email = 'This field may not be empty'
      } else if (
        hasOwnProperty.call(fieldsToValidate, 'email') &&
        EmailJs.isValid(fieldsToValidate.email).length > 0
      ) {
        this.inputErrors.email = EmailJs.isValid(fieldsToValidate.email)
      } else if (this.inputErrors.email === 'This field may not be empty') {
        this.inputErrors.email = ''
      }

      if (
        this.inputValues.currentPassword.length !== 0 ||
        this.inputValues.newPassword.length !== 0 ||
        this.inputValues.confirmNewPassword.length !== 0
      ) {
        if (
          !fieldsToValidate.currentPassword ||
          fieldsToValidate.currentPassword.length === 0
        ) {
          this.inputErrors.currentPassword = 'This field may not be empty'
        } else if (
          this.inputErrors.currentPassword === 'This field may not be empty'
        ) {
          this.inputErrors.currentPassword = ''
        }

        if (
          !fieldsToValidate.newPassword ||
          fieldsToValidate.newPassword.length === 0
        ) {
          this.inputErrors.newPassword = 'This field may not be empty'
        } else if (
          this.inputErrors.newPassword === 'This field may not be empty'
        ) {
          this.inputErrors.newPassword = ''
        }

        if (
          !fieldsToValidate.confirmNewPassword ||
          fieldsToValidate.confirmNewPassword.length === 0
        ) {
          this.inputErrors.confirmNewPassword = 'This field may not be empty'
        } else if (
          this.inputErrors.confirmNewPassword === 'This field may not be empty'
        ) {
          this.inputErrors.confirmNewPassword = ''
        }

        if (
          fieldsToValidate.newPassword &&
          fieldsToValidate.confirmNewPassword
        ) {
          if (
            fieldsToValidate.newPassword !== fieldsToValidate.confirmNewPassword
          ) {
            this.inputErrors.newPassword = 'New password should match'
            this.inputErrors.confirmNewPassword = 'New password should match'
          } else if (
            fieldsToValidate.currentPassword === fieldsToValidate.newPassword
          ) {
            this.inputErrors.newPassword = 'New password cannot be the same'
            this.inputErrors.confirmNewPassword =
              'New password cannot be the same'
          } else {
            this.inputErrors.newPassword = ''
            this.inputErrors.confirmNewPassword = ''
          }
        }
      } else {
        this.inputErrors.currentPassword = ''
        this.inputErrors.newPassword = ''
        this.inputErrors.confirmNewPassword = ''
      }

      this.isFormValid = Object.keys(this.inputErrors).every((inputError) => {
        return this.inputErrors[inputError].length === 0
      })
    },
    saveChanges() {
      const data = {} as any

      this.touchedInputNames.forEach((touchedInputName) => {
        // We don't need to send this input's value
        if (touchedInputName === 'Retype New Password') return

        data[touchedInputName] = this.inputValues[touchedInputName]
      })

      if (Object.keys(data).length === 0) {
        this.isEmailEditing = false
        return
      }

      this.validateFields()

      if (!this.isFormValid) return

      apiClient.accounts
        .accountsEditProfile(data)
        .then(() => {
          this.$store.commit(
            'ui/changeVisibleMessageName',
            VisibleMessageNameType.Success
          )
          this.isEmailEditing = false
        })
        .catch((error) => {
          if (error.errors) {
            error.errors.forEach((error: any) => {
              if (error.code === 'PasswordMismatch') {
                this.inputErrors.currentPassword = error.description
              } else if (error.code === 'DuplicateEmail') {
                this.inputErrors.email = error.description
              }
            })
          } else {
            this.$store.commit(
              'ui/changeVisibleMessageName',
              VisibleMessageNameType.Failed
            )
          }
        })
    },
  },
})
</script>

<style lang="scss" scoped>
.accountSettings {
  margin-bottom: 40px;

  &__email-group {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dadada;
  }
  &__fields-wrapper {
    display: flex;
    margin-bottom: 26px;

    @include xl-down {
      flex-wrap: wrap;
    }

    @include sm-down {
      margin-bottom: 30px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__field-wrapper {
    position: relative;
    margin-right: 20px;

    @include sm-down {
      width: 100%;
      margin-right: 0;
      margin-bottom: 30px;
    }

    &:last-child {
      margin-right: 0;

      @include sm-down {
        margin-bottom: 0;
      }
    }

    &_email {
      @include sm-down {
        margin-top: 10px;
        margin-bottom: 10px;
      }

      &:last-child {
        @include sm-down {
          margin-top: 10px;
          margin-bottom: 10px;
        }
      }
    }

    &_current-password {
      @include xl-down {
        flex: 1 0 100%;
        margin-bottom: 30px;
      }
    }
  }

  &__email {
    @include sm-down {
      margin-top: 10px;
      margin-bottom: 10px;
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

    @include sm-down {
      right: 0;
      left: auto;
      transform: none;
    }

    &:hover {
      color: #000000;
      background-color: #f2f2f2;
    }
  }
}
</style>

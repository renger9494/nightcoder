<template>
  <div class="forgotPassword__container">
    <div class="forgotPassword__item">
      <expired-link v-if="componentName === 'ExpiredLink'" />
      <reset-password
        v-else-if="componentName === 'ResetPassword'"
        :email="email"
        :token="token"
        @сhange="сhange('SavedPassword')"
      />
      <saved-password v-else-if="componentName === 'SavedPassword'" />
    </div>
    <user-feedback />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import apiClient from '@/utils/apiClient'
import ExpiredLink from '@/components/Login/ExpiredLink.vue'
import ResetPassword from '@/components/Login/ResetPassword.vue'
import SavedPassword from '@/components/Login/SavedPassword.vue'
import UserFeedback from '@/components/Login/UserFeedback.vue'
import { VerifyResetPasswordDto } from '@/utils/api'
export default Vue.extend({
  head() {
    return {
      title: 'Forgot password'
    }
  },

  layout: 'profile',
  components: {
    ExpiredLink,
    SavedPassword,
    ResetPassword,
    UserFeedback,
  },
  data() {
    return {
      componentName: 'ExpiredLink',
      email: '',
      token: '',
    }
  },
  created() {
    this.logout()
  },
  async asyncData({ route }) {
    try {
      let filter: any = {
        email: '',
        token: '',
        ...route.query,
      }

      if (filter.token != '') {
        /*   var query: VerifyResetPasswordDto = {
          email: decodeURIComponent(filter.email),
          token: decodeURIComponent(filter.token),
        }
        const { data } = await apiClient.auth.authVerifyResetPassword(query)
 */
        //this.$store.commit('auth/changeIsUserLoggedIn', false)
        //  this.$store.commit('auth/changeUser', null)
        return {
          token: filter.token,
          email: filter.email,
          componentName: 'ResetPassword',
        }
      }
    } catch (error) {
      return {
        componentName: 'ExpiredLink',
      }
    }
  },
  methods: {
    сhange(newComponent: string) {
      this.componentName = newComponent
    },
    logout() {
      apiClient.auth
        .authLogout()
        .then(() => {})
        .catch((error) => console.error(error))
    },
  },
})
</script>

<style lang="scss">
.forgotPassword {
  &__container {
    font-family: 'Poppins';
    margin: auto;
    display: grid;
    grid-template-columns: 50% 50%;
    height: calc(100vh - 60px);
    min-height: 320px;
  }
  &__title {
    width: 100%;
  }
  &__description {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: #000000;
    margin-bottom: 30px;
  }
  &__errors {
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: #f46363;
    text-align: left;
    width: 100%;
    margin-bottom: 3px;
    height: 15px;
    margin-top: -15px;
    font-family: 'Poppins';
  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 420px;
    margin: auto;
    &__container {
      max-width: 350px;
    }
  }
  &__field-wrapper {
    width: 100%;
    position: relative;
    padding: 9px 8px;
    border: 1px solid #dadada;
    box-sizing: border-box;
    border-radius: 4px;
    &:hover {
      border: 1px solid #318bf5;
    }
    &__password {
      margin-top: 8px;
    }
  }
  &__field-wrapper__password:hover {
    .forgotPassword__passwordFootnote {
      display: block;
    }
  }
  &__mobilePasswordFootnote {
    display: none;
  }
  &__passwordFootnote {
    display: none;
    position: absolute;
    right: -256px;
    bottom: -50px;
    z-index: 5;
  }
  &__passwordCharacters {
    position: relative;
    width: 239px;
    height: 140px;
    box-shadow: 0px 5px 30px -4px rgba(0, 0, 0, 0.12);
    padding: 16px;
    background: #ffffff;
    border-radius: 4px;
    font-size: 12px;
    line-height: 18px;
    color: #333333;
    &::before,
    &::after {
      content: '';
      z-index: -1;
      transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
      position: absolute;
      left: -20px;
      bottom: 60px;
      border: 10px solid transparent;
      border-top: 10px solid #ffffff;
      box-shadow: 0px 5px 30px -4px rgba(0, 0, 0, 0.12);
    }
    &::before {
      z-index: 1;
      box-shadow: none;
    }
    &__header {
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      color: #000000;
      margin-bottom: 16px;
    }
    &__item {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        margin-left: 8px;
      }
    }
    &__readyItem {
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      color: #dadada;
      text-decoration-line: line-through;
    }
  }
  &__input {
    font-family: 'Poppins';
    width: 100%;
    font-size: 13px;
    line-height: 20px;
    background-color: #ffffff;
    -webkit-appearance: none;
    &:-webkit-autofill {
      box-shadow: 0 0 0 50px white inset;
    }
    &__password {
      width: calc(100% - 32px);
    }
    &::placeholder {
      color: #828282;
    }
  }
  &__input-slide {
    position: absolute;
    z-index: 9;
    right: 8px;
    top: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
    opacity: 0.3;
    &:hover {
      opacity: 1;
    }
  }
  &__inputErrors {
    border: 1px solid #f46363;
  }
  &__button {
    padding: 8px 0px 30px 0px;
    width: 100%;
  }
  &__goback {
    a {
      font-family: 'Poppins';
      text-decoration: none;
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      color: #000000;
      &:hover {
        color: #bdbdbd;
      }
    }

    text-align: center;
  }
}

@media screen and (max-width: 768px) {
  .forgotPassword {
    &__item {
      width: 100%;
      padding: 0px $margin_page_tablet;
    }
  }
}
@media screen and (max-width: 630px) {
  .forgotPassword {
    &__container {
      grid-template-columns: 100%;
      height: fit-content;
    }
    &__item {
      width: 100%;
      padding: 50px $margin_page_tablet 0px;

      max-width: 100%;
      align-items: normal;
      &__container {
        max-width: 100%;
        width: 100%;
      }
    }
    &__description {
      font-size: 12px;
      line-height: 18px;
    }
    &__input {
      font-size: 12px;
      line-height: 18px;
    }
    &__goback {
      a {
        font-size: 12px;
        line-height: 18px;
      }
    }
    &__field-wrapper__password:hover {
      .forgotPassword__passwordFootnote {
        display: none;
      }
    }
    &__mobilePasswordFootnote {
      display: block;
      font-size: 12px;
      line-height: 18px;
      margin-top: 8px;
      width: 100%;
      margin-bottom: 30px;
    }
    &__passwordCharacters {
      &__header {
        font-size: 12px;
        line-height: 18px;
        margin-bottom: 8px;
      }
    }
  }
}
@media screen and (max-width: 414px) {
  .forgotPassword {
    &__item {
      padding: 0px $margin_page_mobile;
    }
  }
}
</style>

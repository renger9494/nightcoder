<template>
  <div class="login__container">
    <div class="login__item">
      <expired-link v-if="componentName === 'ExpiredLink'" />
      <changed-email
        v-else-if="componentName === 'ChangedEmail'"
        :token="token"
        @сhange="сhange('SavedEmail')"
      />
      <saved-password v-else-if="componentName === 'SavedEmail'" />
    </div>
    <user-feedback />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import http from '@/utils/http'
import apiClient from '@/utils/apiClient'

import ExpiredLink from '@/components/Login/ExpiredLink.vue'
import ChangedEmail from '@/components/Login/ChangedEmail.vue'
import SavedEmail from '@/components/Login/SavedEmail.vue'
import UserFeedback from '@/components/Login/UserFeedback.vue'

export default Vue.extend({
  head() {
    return {
      title: 'Login'
    }
  },
  /*  middleware: ['login'], */
  layout: 'profile',
  components: {
    SavedEmail,
    ExpiredLink,
    ChangedEmail,
    UserFeedback,
  },
  data() {
    return {
      token: '',
      componentName: 'ChangedEmail',
    }
  },
  computed: {
    isRegistrationAccess() {
      return process.env.USER_IS_CAN_CREATE_ACCOUNT == 'true'
    },
  },
  async asyncData({ route }) {
    try {
      let filter: any = {
        token: '',
        ...route.query,
      }
      if (filter.token != '') {
        return {
          token: filter.token,
        }
      }
    } catch (error) {
      return {
        componentName: 'ExpiredLink',
      }
    }
  },
  /*  async asyncData({ route }) {
    try {
      let filter: any = {
        email: '',
        token: '',
        ...route.query,
      }
      if (filter.token != '') {
        var query: VerifyResetPasswordDto = {
          email: filter.email,
          token: filter.token,
        }
        const { data } = await apiClient.auth.authVerifyResetPassword(query)
        return {
          token: filter.token,
          email: filter.email,
          componentName: 'ChangedEmail',
        }
      }
    } catch (error) {
      return {
        componentName: 'ExpiredLink',
      }
    }
  }, */
  methods: {
    сhange(newComponent: string) {
      this.componentName = newComponent
    },
  },
})
</script>

<style lang="scss">
.login {
  font-family: 'Poppins';
  &__container {
    //max-width: 1280px;
    margin: auto;
    display: grid;
    grid-template-columns: 50% 50%;
    //height: 1020px;
    height: calc(100vh - 60px);
    min-height: 464px;
  }
  &__title {
    width: 100%;
  }
  &__errors {
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: #f46363;
    text-align: left;
    width: 100%;
    margin-top: 0px;
    margin-bottom: 0px;
    height: 16px;
    font-family: 'Poppins';
  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 350px;
    margin: auto;
  }
  &__field-wrapper {
    font-family: 'Poppins';
    width: 100%;
    height: 38px;
    position: relative;
    border-radius: 4px;
    border: 1px solid #dadada;
    box-sizing: border-box;
    padding: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &:hover {
      border: 1px solid #318bf5;
    }
  }
  &__btn-send {
    font-family: 'Poppins';
    color: #173bef;
    font-weight: 500;
    font-size: 14px;
    line-height: normal;
    position: absolute;
    z-index: 9;
    right: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      color: #000000;
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
  &__сhecked {
    border: 1px solid #53b71b;
  }
  &__inputErrors {
    border: 1px solid #f46363;
  }

  &__inline {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;
  }
  &__button {
    padding: 30px 0px;

    width: 100%;
  }
  &__forgot-password {
    color: #000000;
    font-size: 13px;
    line-height: 20px;
    text-decoration: none;
    text-align: right;
    &:hover {
      color: #bdbdbd;
    }
  }
  &__remember {
    color: #828282;
    font-size: 13px;
    line-height: 20px;
    input {
      position: absolute;
      z-index: -1;
      opacity: 0;

      & + label {
        display: inline-flex;
        align-items: center;
        user-select: none;
      }
      & + label::before {
        content: '';
        display: inline-block;
        width: 15px;
        height: 15px;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1px solid #dadada;
        border-radius: 2px;
        margin-right: 10px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 10px 15px;
      }
      &:checked + label::before {
        border-color: #000000;
        background-color: #000000;
        background-image: url('/img/login/icons/labelChecked.svg');
      }
      & + label:hover::before {
        cursor: pointer;
      }
    }
  }
  &__socialLogin {
    width: 100%;
    margin-top: 30px;
    margin-bottom: 16px;
  }
  &__create {
    display: inline-flex;
    text-align: center;
    p {
      font-size: 13px;
      line-height: 20px;
      color: #828282;
      margin-right: 10px;
    }
    a {
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      text-decoration: none;
      color: #173bef;
      &:hover {
        color: #000000;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .login {
    &__item {
      width: 100%;
      padding: 0px $margin_page_tablet;
    }
  }
}
@media screen and (max-width: 630px) {
  .login {
    &__container {
      grid-template-columns: 100%;
      height: fit-content;
    }
    &__input {
      font-size: 12px;
      line-height: 18px;
    }
    &__create {
      p {
        font-size: 12px;
        line-height: 18px;
      }
      a {
        font-size: 12px;
        line-height: 18px;
      }
    }
    &__remember {
      font-size: 12px;
      line-height: 18px;
    }
  }
  &__forgot-password {
    font-size: 12px;
    line-height: 18px;
  }
}
@media screen and (max-width: 414px) {
  .login {
    &__item {
      padding: 0px $margin_page_mobile;
    }
  }
}
</style>

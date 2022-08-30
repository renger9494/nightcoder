<template>
  <div class="password">
    <div
      :class="{
        password__inputErrors: errorsPassword,
        password__сhecked: verifiedPassword,
      }"
      class="password__field-wrapper"
    >
      <button name="icon-slide" @click="changeVisibility(true)">
        <svg-icon
          class="password__icon-slide"
          width="16"
          :height="visiblePassword ? '12' : '13'"
          :name="visiblePassword ? 'icon-password-open' : 'icon-password'"
        />
      </button>
      <input
        class="password__input"
        id="password"
        :type="visiblePassword ? 'text' : 'password'"
        name="Password"
        placeholder="Password"
        v-model="password"
        @keyup="parsePassword"
        @keydown.enter="check"
        @blur="check"
      />

      <div class="password__footnote" v-if="!isLogin">
        <div class="password__characters">
          <p class="password__characters__header">
            Must have at least 6 characters
          </p>
          <span>It’s better to have:</span>
          <ul>
            <li
              :class="{
                password__characters__readyItem: rulesPassword.first,
              }"
              class="password__characters__item"
            >
              <svg-icon
                width="4"
                height="4"
                name="passwordEllipse"
                color="#173BEF"
              />
              <span>Upper & lower case letters</span>
            </li>
            <li
              :class="{
                password__characters__readyItem: rulesPassword.second,
              }"
              class="password__characters__item"
            >
              <svg-icon
                width="4"
                height="4"
                name="passwordEllipse"
                color="#173BEF"
              />
              <span>A symbol (like “#”, “$”, “&” or others)</span>
            </li>
            <li
              :class="{
                password__characters__readyItem: rulesPassword.third,
              }"
              class="password__characters__item"
            >
              <svg-icon
                width="4"
                height="4"
                name="passwordEllipse"
                color="#173BEF"
              /><span>A longer password</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="password__errors">
      <login-error :errors="errorsPassword" />
    </div>
    <div v-if="!isLogin">
      <div
        :class="{
          password__inputErrors: errorsRepeatPassword,
          password__сhecked: verifiedRepeatPassword,
        }"
        class="password__field-wrapper"
      >
        <input
          class="password__input"
          id="repeatPassword"
          :type="visibleRepeatPassword ? 'text' : 'password'"
          name="RepeatPassword"
          placeholder="Repeat Password"
          v-model="repeatPassword"
          @keyup=";(errorsPassword = ''), (verifiedRepeatPassword = false)"
          @keydown.enter="check"
          @blur="check"
        />
        <button name="icon-slide" @click="changeVisibility(false)">
          <svg-icon
            class="password__icon-slide"
            width="16"
            :height="visibleRepeatPassword ? '12' : '13'"
            :name="
              visibleRepeatPassword ? 'icon-password-open' : 'icon-password'
            "
          />
        </button>
      </div>
      <div class="password__errors">
        <login-error :errors="errorsRepeatPassword" />
      </div>
    </div>
    <div class="password__mobileFootnote" v-if="!isLogin">
      <p class="password__characters__header">
        Must have at least 6 characters
      </p>
      <span>It’s better to have:</span>
      <ul>
        <li
          :class="{
            password__characters__readyItem: rulesPassword.first,
          }"
          class="password__characters__item"
        >
          <svg-icon
            width="4"
            height="4"
            name="passwordEllipse"
            color="#173BEF"
          />
          <span>Upper & lower case letters</span>
        </li>
        <li
          :class="{
            password__characters__readyItem: rulesPassword.second,
          }"
          class="password__characters__item"
        >
          <svg-icon
            width="4"
            height="4"
            name="passwordEllipse"
            color="#173BEF"
          />
          <span>A symbol (like “#”, “$”, “&” or others)</span>
        </li>
        <li
          :class="{
            password__characters__readyItem: rulesPassword.third,
          }"
          class="password__characters__item"
        >
          <svg-icon
            width="4"
            height="4"
            name="passwordEllipse"
            color="#173BEF"
          />
          <span>A longer password</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import http from '@/utils/http'
import emailValidator from '@/utils/email'
import LoginError from '@/components/Login/LoginErrorMessage.vue'
import SvgIcon from '@/components/Shared/SvgIcon.vue'
import { ErrorDto, RegistrationUserDto } from '@/utils/api'
export default Vue.extend({
  components: {
    LoginError,
    SvgIcon,
  },
  data() {
    return {
      password: '',
      repeatPassword: '',
      errorsRepeatPassword: '' as string | ErrorDto[],
      errorsPassword: this.errors as string | ErrorDto[],
      verifiedPassword: false,
      verifiedRepeatPassword: false,
      rulesPassword: { first: false, second: false, third: false },
      visiblePassword: false,
      visibleRepeatPassword: false,
    }
  },
  props: {
    isLogin: Boolean,
    errors: String,
  },
  watch: {
    errors(newText) {
      this.errorsPassword = newText
      this.verifiedPassword = newText
    },
  },
  methods: {
    changeVisibility(firstPassword: boolean) {
      if (firstPassword) {
        this.visiblePassword = !this.visiblePassword
      } else {
        this.visibleRepeatPassword = !this.visibleRepeatPassword
      }
    },
    parsePassword() {
      this.errorsPassword = ''
      this.errorsRepeatPassword = ''
      this.verifiedPassword = false
      this.rulesPassword.third = this.password.length >= 6
      this.rulesPassword.second =
        /[!"#$%&'()*+,-./:;<=>?@[/\\//\]/^_`{|}~]/.test(this.password)
      this.rulesPassword.first =
        /[a-z]/g.test(this.password) && /[A-Z]/g.test(this.password)
    },
    check() {
      this.verifiedPassword = false
      if (!this.password) {
        this.errorsPassword = 'Please fill out all required fields'
      }
      if (!this.isLogin && this.password) {
        if (this.password.length < 6) {
          this.errorsPassword = 'The password must be longer than 6 characters'
        } /* else if (!/[0-9]/g.test(this.password)) {
          this.errorsPassword = 'The password must contain numbers'
        } else if (!this.rulesPassword.first) {
          this.errorsPassword = 'The password must contain capital letters'
        }  */ else {
          this.errorsPassword = ''
          this.verifiedPassword = true
        }
        if (!this.repeatPassword) {
          this.errorsRepeatPassword = 'Please fill out all required fields.'
          this.verifiedRepeatPassword = false
        } else {
          if (this.password != this.repeatPassword) {
            this.errorsRepeatPassword = "Passwords don't match"
          } else {
            this.errorsRepeatPassword = ''
            this.verifiedRepeatPassword = true
          }
        }
      } else {
        this.verifiedRepeatPassword = true
        this.verifiedPassword = !this.errorsPassword
      }
      this.$emit(
        'changedPassword',
        this.verifiedPassword && this.verifiedRepeatPassword,
        this.password,
        this.repeatPassword
      )
    },
  },
})
</script>

<style lang="scss">
.password {
  font-family: 'Poppins';
  width: 100%;
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
      .password__footnote {
        display: block;
      }
    }
  }
  &__mobileFootnote {
    display: none;
  }
  &__footnote {
    display: none;
    position: absolute;
    right: -256px;
    bottom: -50px;
    z-index: 9;
  }
  &__characters {
    position: relative;
    width: 239px;
    height: 150px;
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

    font-size: 13px;
    line-height: 20px;
    background-color: #ffffff;
    -webkit-appearance: none;
    &:-webkit-autofill {
      box-shadow: 0 0 0 50px white inset;
    }

    width: calc(100% - 32px);

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
  &__icon-slide {
    position: absolute;
    z-index: 9;
    right: 8px;
    top: 12px;
    // display: flex;
    // flex-direction: row;
    //align-items: center;
    transition: all 0.3s ease;
    cursor: pointer;
    opacity: 0.3;
    &:hover {
      opacity: 1;
    }
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
    border-bottom: 1px solid #ebebeb;
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .password {
    &__item {
      width: 100%;
    }
  }
}
@media screen and (max-width: 630px) {
  .password {
    &__field-wrapper:hover {
      .password__footnote {
        display: none;
      }
    }
    &__footnote {
      display: none;
    }

    &__mobileFootnote {
      display: block;
      font-size: 12px;
      line-height: 18px;
      margin-top: 8px;
      width: 100%;
    }
    &__characters {
      &__header {
        font-size: 12px;
        line-height: 18px;
        margin-bottom: 8px;
      }
    }
  }
}
@media screen and (max-width: 538px) {
  .password {
    &__footnote {
      right: -220px;
      bottom: -60px;
    }

    &__characters {
      width: 200px;
      height: 160px;

      &::before,
      &::after {
        left: -20px;
        bottom: 70px;
      }
    }
  }
}
@media screen and (max-width: 630px) {
  .password {
    &__input {
      font-size: 12px;
      line-height: 18px;
    }
  }
}
</style>

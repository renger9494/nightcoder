<template>
  <div class="welcome">
    <div class="welcome__title">
      Now you’re in <span>Airtap community</span>. Please, tell us about
      yourself.
    </div>
    <div class="user">
      <div class="user__photo">
        <div class="user__avatar">
          <skeleton
            v-if="!profile.fullName"
            width="71"
            height="71"
            radius="46"
            max-width="100%"
          />
          <template v-else>
            <template v-if="!imageLoading">
              <picture v-if="AvatarImage.path">
                <source
                  v-if="AvatarImage.id && AvatarImage.fullPathWebP"
                  type="image/webp"
                  :srcset="AvatarImage.fullPathWebP.replace(' ', '%20')"
                />
                <source
                  v-if="AvatarImage.id && AvatarImage.fullPathJp2"
                  type="image/jp2"
                  :srcset="AvatarImage.fullPathJp2.replace(' ', '%20')"
                />
                <img :src="AvatarImage.path" />
              </picture>
              <avatar v-else :size="71" :name="avatarName" />
            </template>
            <loader :size="50" v-else />
          </template>
          <input
            ref="avatar-image-input"
            type="file"
            accept="image/jpeg,image/png"
            multiple
            @change="uploadAvatarImage($event)"
          />
        </div>

        <button
          :class="{
            'avatar-loaded': profile.avatar,
          }"
          class="user__loadingAvatar"
          @click.prevent="avatarimageInput.click()"
        >
          <svg-icon
            width="13"
            height="13"
            color="#000000"
            name="loadingImage"
          />
        </button>
        <span class="user__ref-text"
          >Recommended size for avatar: 400x400px. 400KB max.</span
        >
      </div>
      <div class="user__field-wrapper user__wrapper-fullName">
        <label class="user__label-fullName" for="fullName">Full Name*</label>
        <p class="user__count">
          <span>{{ fullNameCount }}</span
          >/30
        </p>
        <div
          :class="{
            'user__field-wrapper-error': this.inputErrors.fullName,
          }"
          class="user__fullName"
        >
          <input
            :id="'fullName'"
            :maxlength="30"
            :value="profile.fullName"
            @keyup="changeFullName($event)"
            @keydown.enter="checkfullName"
            @blur="checkfullName"
          />
        </div>

        <span
          v-if="inputErrors.fullName"
          class="user__error"
          aria-live="polite"
          >{{ this.inputErrors.fullName }}</span
        >
      </div>
      <div class="user__field-wrapper user__wrapper-bio">
        <label class="user__label-bio" for="bio">Bio</label>
        <p class="user__count">
          <span>{{ bioCount }}</span
          >/600
        </p>
        <textarea
          class="user__bio"
          id="bio"
          maxlength="600"
          wrap="soft"
          :value="profile.bio"
          @keyup="changeBio($event)"
        ></textarea>
      </div>
      <a class="user__editLink" href="/settings/profile">Edit profile</a>
      <button
        @click="save"
        class="welcome__button"
        :class="{ loading: isSaving }"
      >
        <svg-icon
          v-if="isSaving"
          name="loader-icon"
          width="16"
          height="16"
          color="#fff"
        />
        <span>Continue</span>
      </button>
      <div class="welcome__skipLink" @click="goToLink">Skip</div>
    </div>
    <message
      class="welcome__message"
      v-if="visibleMessageName === VisibleMessageNameType.Failed"
      :type="'error'"
      :text="textError"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { VisibleMessageNameType, VisibleModalType } from '@/store/ui'
import HTMLElementEvent from '@/utils/types/HTMLElementEvent'
import http from '@/utils/http'
import { Converter } from '@/utils/converter'
import Field from '@/components/Settings/Field.vue'
import Message from '@/components/Shared/SiteSettings/Message.vue'
import Avatar from '@/components/Header/avatar/Avatar.vue'
import ObjectKeys from '@/utils/types/ObjectKeys'
import Loader from '@/components/Shared/ui/loader.vue'
import apiClient from '@/utils/apiClient'
import { AccountDto, GetProfileDto, FileDto, FileType } from '@/utils/api'
import cookies from '@/utils/cookies'
interface Preview {
  id: undefined | string
  file: null | File | Blob
  path: string | ArrayBuffer | null
  fullPathWebP: string | null
  fullPathJp2: string | null
}
export default Vue.extend({
  layout: 'profile',
  head() {
    return {
      title: 'Welcome',
    }
  },
  components: {
    Loader,
    Avatar,
    Field,
    Message,
  },

  data() {
    return {
      VisibleMessageNameType,
      profile: {} as GetProfileDto,
      fileUrl: '',
      inputErrors: {
        fullName: '',
        alias: '',
        bio: '',
      } as ObjectKeys<string>,
      fullNameCount: 0,
      bioCount: 0,
      imageLoading: false,
      isSaving: false,
      AvatarImage: {
        id: undefined,
        file: null,
        path: null,
        fullPathWebP: null,
        fullPathJp2: null,
      } as Preview,
      isFormValid: true,
    }
  },

  async asyncData({ route, redirect, req }) {
    try {
      let filter: any = {
        email: '',
        token: '',
        fileUrl: '',
        ...route.query,
      }
      if (filter.token != '') {
        const { data, headers } = await apiClient.auth.authWelcome({
          email: filter.email,
          token: filter.token,
        })
        if (process.server)
          apiClient.instance.defaults.headers.Cookie =
            headers?.['set-cookie'] ?? null

        if (data.id) {
          const { data: user } = await apiClient.accounts.accountsGetProfile()

          return {
            profile: user,
            fileUrl: filter.fileUrl,
            fullNameCount: user.fullName ? user.fullName.length : 0,
            bioCount: user.bio ? user.bio.length : 0,
            AvatarImage: {
              id: user.avatar?.id,
              file: null,
              path: user.avatar?.fullPath || null,
              fullPathWebP: user.avatar?.fullPathWebP || null,
              fullPathJp2: user.avatar?.fullPathJp2 || null,
            },
          }
        }
      }

      redirect('/404')
    } catch (error) {
      console.log(error)
    }
  },
  async mounted() {
    if (this.fileUrl != '') window.open(this.fileUrl, '_blank')

    try {
      let filter: any = {
        email: '',
        token: '',
        fileUrl: '',
        ...this.$route.query,
      }
      if (filter.token != '') {
        const { data, headers } = await apiClient.auth.authWelcome({
          email: filter.email,
          token: filter.token,
        })
        if (process.server)
          apiClient.instance.defaults.headers.Cookie =
            headers?.['set-cookie'] ?? null

        if (data.id) {
          const { data: user } = await apiClient.accounts.accountsGetProfile()

          this.profile = user
          this.fileUrl = filter.fileUrl
          this.fullNameCount = user.fullName ? user.fullName.length : 0
          this.bioCount = user.bio ? user.bio.length : 0
          this.AvatarImage = {
            id: user.avatar?.id,
            file: null,
            path: user.avatar?.fullPath || null,
            fullPathWebP: user.avatar?.fullPathWebP || null,
            fullPathJp2: user.avatar?.fullPathJp2 || null,
          }
          await this.$store.dispatch('auth/getUserInfo', { cookie: null })
          return
        }
      }

      this.$router.push('/404')
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      visibleMessageName: (state: any) =>
        <VisibleMessageNameType>state.ui.visibleMessageName,
    }),
    avatarimageInput(): any {
      return this.$refs['avatar-image-input']
    },
    avatarName(): string {
      return !!this.profile.fullName ? this.profile.fullName : 'itmeo'
    },
    textError(): string {
      if (this.inputErrors.fullName) return this.inputErrors.fullName
      return 'Something went wrong'
    },
  },
  methods: {
    goToLink() {
      this.$router.push('/welcome/discover')
    },
    validateFields() {
      this.isFormValid = true
      if (!this.profile.fullName) {
        this.inputErrors.fullName = 'The field cannot be empty'
        this.isFormValid = false
      }
    },
    save() {
      this.validateFields()
      if (!this.isFormValid) {
        this.$store.commit(
          'ui/changeVisibleMessageName',
          VisibleMessageNameType.Failed
        )
        return
      }
      this.isSaving = true
      const dto = {
        FullName: this.profile.fullName,
      } as any
      if (this.profile.bio) dto.Bio = this.profile.bio
      if (this.AvatarImage.file) dto.Avatar = this.AvatarImage.file
      else if (this.AvatarImage.id) dto.AvatarId = this.AvatarImage.id

      const formData = Converter.jsonToFormData(dto)
      http
        .put(`/api/accounts/welcome`, formData)
        .then(({ data }) => {
          this.$store.commit(
            'ui/changeVisibleMessageName',
            VisibleMessageNameType.Success
          )
          this.$store.commit('auth/changeUser', {
            ...this.user,
            fullName: this.profile.fullName,
            avatar: data.avatar || this.profile.avatar,
          })
          this.isSaving = false
          this.$router.push('/welcome/discover')
        })
        .catch((error) => {
          if (error.response.data) {
            var key: string
            let errors = error.response.data
            for (key in errors) {
              this.inputErrors[`${key}`] = errors[key]
            }
          }
          this.$store.commit(
            'ui/changeVisibleMessageName',
            VisibleMessageNameType.Failed
          )
          this.isSaving = false
        })
    },
    checkfullName(nameInput: any, event: any) {
      if (!this.profile.fullName || this.profile.fullName.length === 0) {
        this.inputErrors.fullName = 'The field cannot be empty'
      }
    },
    uploadAvatarImage(event: HTMLElementEvent<HTMLInputElement>) {
      if (event.target?.files == null || !event.target.files[0]) return
      const file = event.target.files[0]
      const resolveUpload = (isUploaded: boolean) => {
        this.imageLoading = false
      }

      this.imageLoading = true

      this.uploadImage(file, FileType.ProfileAvatar, resolveUpload)
    },

    uploadImage(
      file: File,
      fileType: FileType,
      resolveUpload: (isUploaded: boolean) => void
    ) {
      this.profile.avatar = {} as FileDto
      const preview = this.AvatarImage
      if (preview) {
        var reader = new FileReader()
        reader.onload = function () {
          preview.path = reader.result
          preview.id = ''
          preview.file = file
        }
        reader.readAsDataURL(file)
      }
      resolveUpload(true)
    },
    changeFullName(event: any) {
      this.inputErrors.fullName = ''
      this.fullNameCount = event.currentTarget.value.length
      this.changeInputValue('fullName', event)
    },
    changeBio(event: any) {
      this.bioCount = event.currentTarget.value.length
      this.changeInputValue('bio', event)
    },

    changeInputValue(nameInput: keyof GetProfileDto, event: any) {
      ;(<any>this.profile[nameInput]) = event.currentTarget.value
    },
  },
})
</script>


<style lang="scss" scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__title {
    margin-top: 60px;
    font-weight: 600;
    font-size: 32px;
    line-height: 48px;
    text-align: center;
    width: 608px;
    span {
      background: linear-gradient(
        90deg,
        #e64afa 0%,
        #8c38ff 40.1%,
        #3ca1ff 100%
      );
      font-weight: 600;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }
  &__button {
    margin-top: 20px;
    padding: 7px 8px;
    background: $black;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    color: $white;
    width: 100%;
    border: 1px solid $black;
    border-radius: $shape_border_radius;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      animation: spin 1s linear infinite;
      margin-right: 5px;
    }

    &:hover {
      background: #333333;
      border-color: #333333;
    }

    &.loading {
      pointer-events: none;
    }
  }
  &__skipLink {
    width: 100%;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    color: #bdc2c7;
    margin-top: 20px;
    cursor: pointer;
    &:hover {
      color: #000000;
    }
  }
  &__message {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translate(-50%, 50%);

    @include sm-down {
      position: fixed;
    }

    &.message_visible {
      transform: translateX(-50%);
    }
  }
}

.user {
  width: 320px;
  margin-top: 60px;
  margin-bottom: 40px;
  &__editLink {
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    text-decoration: none;
    outline: none;
    color: #173bef;
    border-bottom: 1px solid transparent;
    transition: 0.3s;

    white-space: nowrap;
    &:hover {
      border-bottom: 1px solid #173bef;
    }
  }

  &__loadingImage {
    text-align: center;
    height: 100%;
    width: 100%;
    cursor: pointer;
    position: relative;

    &-overlay {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
    }
  }
  &__loading-text {
    margin-top: 15px;
    margin-bottom: 5px;
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;
    position: relative;
    z-index: 2;
  }
  &__ref-text {
    font-size: 10px;
    font-weight: 400;
    color: #828282;
    line-height: 12px;
    position: relative;
    z-index: 2;
    display: inline-flex;
    width: 170px;
    margin-top: 45px;
    position: absolute;
    top: 0;
    right: -15px;
    transform: translate(100%, 0);
  }
  &__photo {
    display: inline-block;
    position: relative;
    margin-bottom: 20px;
  }

  &__avatar {
    width: 75px;
    height: 75px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    position: relative;
    border: 4px solid $white;

    .skeleton {
      display: inline-flex;
    }

    input {
      display: none;
    }
    picture {
      display: flex;
    }
    img {
      border-radius: 35px;
      width: 71px;
      height: 71px;
    }
  }
  &__loadingAvatar {
    width: 30px;
    height: 30px;
    background: #ffffff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    right: 0;
    bottom: 3px;
    position: absolute;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  &__changeImage {
    width: 24px;
    height: 24px;
    background: #ffffff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    right: 55px;
    bottom: 10px;
    position: absolute;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  &__fields-wrapper {
    display: flex;
    //margin-bottom: 30px;
    max-width: 1020px;
    justify-content: space-between;

    &:last-child {
      margin-bottom: 0;
    }
  }
  &__label-fullName,
  &__label-bio {
    font-size: 13px;
    line-height: 14px;
    color: #000;
    margin-bottom: 4px;
  }

  &__wrapper-fullName {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
    .link-input-icon {
      position: absolute;
      z-index: 9;
      right: 7px;
      top: 13px;
      opacity: 0;
      transition: all 0.3s ease;
      &.active {
        opacity: 1;
      }
    }
  }
  &__wrapper-bio {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    margin-top: 16px;
    margin-bottom: 16px;
  }
  &__bio {
    min-width: 100%;
    max-width: 100%;
    height: 90px;
    padding: 9px 6px;
    font-family: 'Poppins', sans-serif;
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 3px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #dadada;
      height: 30px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track-piece {
      display: none;
    }
  }

  &__fullName,
  &__bio {
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    font-weight: 400;
    color: #333333;
    background-color: #ffffff;
    border: 1px solid #dadada;
    border-radius: $shape_border_radius;
    outline: none;
    transition: 0.3s;
    input {
      font-size: 13px;
      line-height: 14px;
      padding: 10px 6px;
      font-family: 'Poppins';
      -webkit-appearance: none;
      &:-webkit-autofill {
        box-shadow: 0 0 0 50px white inset;
      }
    }

    margin-bottom: 3px;
    &:hover {
      border-color: $color_input_overlay_border_focus;
    }

    &--focus {
      border-color: $color_input_overlay_border_focus;
    }

    &:active,
    &:focus {
      border-color: $color_input_overlay_border_focus;
    }
  }
  &__fullName {
    input {
      width: 100%;
    }
  }
  &__field-wrapper-error {
    border-color: #f46363;
  }
  &__count {
    position: absolute;
    top: -1px;
    font-size: 10px;
    text-decoration: none;
    white-space: nowrap;
    padding: 2px 4px;
    transition: 0.3s;
    border-radius: $shape_border_radius;
    right: 0px;
  }
  &__field-wrapper {
    position: relative;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

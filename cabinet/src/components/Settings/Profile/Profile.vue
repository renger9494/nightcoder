<template>
  <div class="profile" v-if="!!user">
    <div class="profile__title">Edit Profile</div>
    <div class="profile__imge">
      <air-title>Profile image</air-title>
      <div class="profile__cover-image">
        <input
          ref="cover-image-input"
          type="file"
          :accept="'image/jpeg,image/png'"
          multiple
          @change="uploadCoverAvatarImage($event, true)"
        />
        <skeleton
          v-if="!profile.fullName"
          width="100%"
          height="165"
          radius="3"
          max-width="100%"
        />
        <template v-else>
          <template v-if="!imageLoading.cover">
            <div v-if="CoverImage.path">
              <picture>
                <source
                  v-if="CoverImage.id && CoverImage.fullPathWebP"
                  type="image/webp"
                  :srcset="CoverImage.fullPathWebP.replace(' ', '%20')"
                />
                <source
                  v-if="CoverImage.id && CoverImage.fullPathJp2"
                  type="image/jp2"
                  :srcset="CoverImage.fullPathJp2.replace(' ', '%20')"
                />
                <img :src="CoverImage.path" />
              </picture>
              <button
                :class="{
                  'image-loaded': profile.cover,
                }"
                class="profile__changeImage"
                @click.prevent="coverimageInput.click()"
              >
                <svg-icon width="13" height="13" name="changeImage" />
              </button>
              <button class="profile__deleteImage" @click="deleteImage">
                <svg-icon
                  width="13"
                  height="13"
                  color="#000"
                  name="deleteImage"
                />
              </button>
            </div>
            <button
              v-else
              :class="{
                'image-loaded': profile.cover,
              }"
              class="profile__loadingImage"
              @click.prevent="coverimageInput.click()"
            >
              <div
                class="profile__loadingImage-overlay"
                :style="overlayGradient"
              />
              <svg-icon
                width="13"
                height="13"
                color="#000000"
                name="loadingImage"
              />
              <p class="profile__loading-text">Upload cover image</p>
              <p class="profile__ref-text">
                (recommended size: 1590x530px. 5MB max)
              </p>
            </button>
          </template>
          <loader v-else :size="54" />
        </template>
      </div>
      <div class="profile__photo">
        <div class="profile__avatar">
          <skeleton
            v-if="!profile.fullName"
            width="71"
            height="71"
            radius="46"
            max-width="100%"
          />
          <template v-else>
            <template v-if="!imageLoading.profile">
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
            @change="uploadCoverAvatarImage($event, false)"
          />
        </div>

        <button
          :class="{
            'avatar-loaded': profile.avatar,
          }"
          class="profile__loadingAvatar"
          @click.prevent="avatarimageInput.click()"
        >
          <svg-icon
            width="13"
            height="13"
            color="#000000"
            name="loadingImage"
          />
        </button>
        <span class="profile__ref-text profile__ref-text_avatar"
          >Recommended size for avatar: 400x400px. 400KB max.</span
        >
      </div>
    </div>
    <div class="profile__general-info">
      <air-title>General Info</air-title>
      <div class="profile__fields-wrapper">
        <div class="profile__field-wrapper profile__wrapper-fullName">
          <label class="profile__label-fullName" for="fullName"
            >Full Name*</label
          >
          <p class="profile__count">
            <span>{{ fullNameCount }}</span
            >/30
          </p>
          <div
            :class="{
              'profile__field-wrapper-error': this.inputErrors.fullName,
            }"
            class="profile__fullName"
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
            class="profile__error"
            aria-live="polite"
            >{{ this.inputErrors.fullName }}</span
          >
        </div>
        <div class="profile__field-wrapper profile__wrapper-website">
          <field
            :error="inputErrors.personalWebSite"
            :label="'Personal website'"
            :name="'personalWebSite'"
            :value="profile.personalWebSite || ''"
            :maxlength="300"
            :onChange="checkWebSite"
          ></field>
        </div>
        <div class="profile__field-wrapper profile__wrapper-username">
          <label class="profile__label-username" for="username"
            >Username*</label
          >
          <p class="profile__count">
            <span>{{ userNameCount }}</span
            >/30
          </p>
          <div
            :class="{
              'profile__field-wrapper-error': this.inputErrors.alias,
            }"
            class="profile__username"
          >
            <span class="profile__fixtext-username">airtap.io/</span>
            <input
              :id="'alias'"
              :maxlength="30"
              :value="profile.alias"
              @keyup="changeUserName($event)"
              @keydown.enter="checkAlias"
              @blur="checkAlias"
            />
            <svg-icon
              :class="{ active: checkedAlias }"
              class="link-input-icon"
              width="10"
              height="8"
              color="#53B71B"
              name="checkIcon"
            />
          </div>

          <span
            v-if="inputErrors.alias"
            class="profile__error"
            aria-live="polite"
            >{{ this.inputErrors.alias }}</span
          >
          <p v-else class="profile__ref-text">
            airtap.io/<span class="profile__ref-text__alias">{{
              profile.alias
            }}</span>
          </p>
        </div>
      </div>
      <div class="profile__fields-wrapper">
        <div class="profile__field-wrapper profile__wrapper-bio">
          <label class="profile__label-bio" for="bio">Bio</label>
          <p class="profile__count">
            <span>{{ bioCount }}</span
            >/600
          </p>
          <textarea
            class="profile__bio"
            id="bio"
            maxlength="600"
            wrap="soft"
            :value="profile.bio"
            @keyup="changeBio($event)"
          ></textarea>
        </div>
      </div>
      <div class="profile__fields-wrapper">
        <div class="profile__field-wrapper profile__wrapper-bio">
          <p class="profile__label-social">Social Media Links</p>
          <ul>
            <draggable :value="socialLinks" @change="socialLinkListChanged">
              <li
                class="profile__itemSocialLinks"
                v-for="social in socialLinks"
                :key="social.type"
              >
                <div class="profile__socialLink">
                  <div class="profile__socialType">
                    <svg-icon
                      class="profile__socialType__icon"
                      width="12"
                      height="12"
                      :name="social.type"
                    />
                    <span class="profile__socialType__desktop">{{
                      social.domain
                    }}</span>
                    <span
                      v-if="social.domain"
                      class="profile__socialType__mobile"
                      >{{ social.domain.replace('https://', '') }}</span
                    >
                  </div>

                  <input
                    class="profile__socialName"
                    :id="social.type"
                    :maxlength="30"
                    @keyup="changeSocialLinks()"
                    v-model="social.link"
                  />
                </div>
                <svg-icon
                  class="profile__socialBurger"
                  width="24"
                  height="24"
                  name="burger"
                />
              </li>
            </draggable>
          </ul>
          <span
            v-if="inputErrors.socialLinks"
            class="profile__error"
            aria-live="polite"
            >{{ this.inputErrors.socialLinks }}</span
          >
          <button
            class="profile__button-links"
            v-if="!isShowAllSocialLinks"
            @click="showAllSocialLink"
          >
            View More
            <svg-icon width="10" height="8" color="#000" name="vectorDown" />
          </button>
          <button
            class="profile__button-links"
            v-if="isShowAllSocialLinks"
            @click="showAllSocialLink"
          >
            View Less
            <svg-icon
              class="profile__button-links__iconUp"
              width="10"
              height="8"
              color="#000"
              name="vectorDown"
            />
          </button>
        </div>
      </div>
    </div>
    <div class="profile__privacy-info">
      <air-title>Profile privacy</air-title>
      <p>
        Your public profile page and projects are visible to anyone who visits
        your profile and are used to represent you in Airtap Discover page.
      </p>
      <div class="profile__privacy" @click="toggleSwitchValue()">
        <span class="profile__privacy-text">Profile</span>
        <air-switch
          :id="'profile-public'"
          :isActive="profile.isPublic ? true : false"
          :name="'profilePublic'"
          :statusText="{
            on: 'Your profile is public',
            off: 'Your profile is private',
          }"
          :onClick="toggleSwitchValue"
        />
      </div>
    </div>
    <div class="profile__actions">
      <air-button
        v-if="!isSaving"
        :tag="'button'"
        :isActive="formValid"
        :onClick="saveChanges"
      >
        Save
      </air-button>
      <button v-else class="loading iconed btn">
        <svg-icon name="loader-icon" width="12" height="12" color="#fff" />
        <span>Saving</span>
      </button>
    </div>
    <message
      class="profile__message"
      v-if="visibleMessageName === VisibleMessageNameType.Failed"
      :type="'error'"
      :text="textError"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'
import AirTitle from '@/components/Settings/Title.vue'
import Field from '@/components/Settings/Field.vue'
import Email from '@/components/Settings/AccountSettings/Email.vue'
import AirButton from '@/components/Settings/Button.vue'
import AirSwitch from '@/components/Settings/Switch.vue'
import { VisibleMessageNameType, VisibleModalType } from '@/store/ui'
import Message from '@/components/Shared/SiteSettings/Message.vue'
import { Converter } from '@/utils/converter'
import ObjectKeys from '@/utils/types/ObjectKeys'
import { mapState } from 'vuex'
import {
  AccountDto,
  GetProfileDto,
  EditedSocialLinkDto,
  FileDto,
  FileType,
} from '@/utils/api'
import apiClient from '@/utils/apiClient'
import HTMLElementEvent from '@/utils/types/HTMLElementEvent'
import http from '@/utils/http'
import Avatar from '@/components/Header/avatar/Avatar.vue'
import Skeleton from '@/components/Shared/ui/skeleton.vue'
import Loader from '@/components/Shared/ui/loader.vue'
import { generateGradient } from '@/components/Header/avatar/utilities'
interface Preview {
  id: undefined | string
  file: null | File | Blob
  path: string | ArrayBuffer | null
  fullPathWebP: string | null
  fullPathJp2: string | null
}
export default Vue.extend({
  components: {
    Skeleton,
    Loader,
    Avatar,
    AirTitle,
    AirSwitch,
    Field,
    Email,
    AirButton,
    draggable,
    Message,
  },

  data() {
    return {
      VisibleMessageNameType,
      inputErrors: {
        fullName: '',
        alias: '',
        bio: '',
        personalWebSite: '',
        socialLinks: '',
      } as ObjectKeys<string>,
      profile: {} as GetProfileDto,
      touchedInputNames: [] as any[],
      isFormValid: true,
      fullNameCount: 0,
      userNameCount: 0,
      bioCount: 0,
      isShowAllSocialLinks: false,
      checkedAlias: false,
      imageLoading: {
        profile: false,
        cover: false,
      } as ObjectKeys<boolean>,
      isSaving: false,
      AvatarImage: {
        id: undefined,
        file: null,
        path: null,
        fullPathWebP: null,
        fullPathJp2: null,
      } as Preview,
      CoverImage: {
        id: undefined,
        file: null,
        path: null,
        fullPathWebP: null,
        fullPathJp2: null,
      } as Preview,
    }
  },
  async mounted() {
    try {
      const { data } = await apiClient.accounts.accountsGetProfile()
      this.profile = data
      this.fullNameCount = data.fullName ? data.fullName.length : 0
      this.userNameCount = data.alias ? data.alias.length : 0
      this.bioCount = data.bio ? data.bio.length : 0
      this.checkedAlias = !!data.alias
      this.CoverImage.id = data.cover?.id
      this.CoverImage.path = data.cover?.fullPath || null
      this.CoverImage.fullPathWebP = data.cover?.fullPathWebP || null
      this.CoverImage.fullPathJp2 = data.cover?.fullPathJp2 || null
      this.AvatarImage.id = data.avatar?.id
      this.AvatarImage.path = data.avatar?.fullPath || null
      this.AvatarImage.fullPathWebP = data.avatar?.fullPathWebP || null
      this.AvatarImage.fullPathJp2 = data.avatar?.fullPathJp2 || null
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

    formValid(): Boolean {
      return (
        this.inputErrors.fullName.length == 0 &&
        this.inputErrors.personalWebSite.length == 0 &&
        this.inputErrors.alias.length == 0 &&
        this.inputErrors.socialLinks.length == 0
      )
    },
    socialLinks(): EditedSocialLinkDto[] {
      return this.profile.socialLinks != undefined
        ? this.isShowAllSocialLinks
          ? this.profile.socialLinks
          : this.profile.socialLinks?.slice(0, 4)
        : []
    },
    coverimageInput(): any {
      return this.$refs['cover-image-input']
    },
    avatarimageInput(): any {
      return this.$refs['avatar-image-input']
    },
    avatarName(): string {
      return !!this.profile.fullName ? this.profile.fullName : 'itmeo'
    },
    overlayGradient(): string {
      return this.avatarName
        ? `background: ${generateGradient(this.avatarName)};`
        : ''
    },
    textError(): string {
      if (this.inputErrors.socialLinks) return this.inputErrors.socialLinks
      if (this.inputErrors.personalWebSite) {
        return this.inputErrors.personalWebSite
      }
      if (this.inputErrors.alias) {
        return this.inputErrors.alias
      }
      if (this.inputErrors.fullName) return this.inputErrors.fullName
      return 'Something went wrong'
    },
  },
  methods: {
    toggleSwitchValue() {
      this.profile.isPublic = !this.profile.isPublic
    },
    socialLinkListChanged(event: any) {
      if (this.profile.socialLinks != undefined) {
        let activLink = this.profile.socialLinks.splice(
          event.moved.oldIndex,
          1
        )[0]
        this.profile.socialLinks.splice(event.moved.newIndex, 0, activLink)
      }
    },
    showAllSocialLink() {
      this.isShowAllSocialLinks = !this.isShowAllSocialLinks
    },
    deleteImage() {
      this.CoverImage.path = null
      this.CoverImage.file = null
      this.CoverImage.id = ''
    },
    checkWebSite(nameInput: any, event: any) {
      this.changeInputValue(nameInput, event)
      const regex = new RegExp(
        /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
      )
      if (
        this.profile.personalWebSite &&
        !regex.test(this.profile.personalWebSite)
      ) {
        this.inputErrors.personalWebSite = 'Please enter a valid link'
        return
      }
      this.inputErrors.personalWebSite = ''
    },
    checkfullName(nameInput: any, event: any) {
      if (!this.profile.fullName || this.profile.fullName.length === 0) {
        this.inputErrors.fullName = 'The field cannot be empty'
      }
    },
    checkAlias() {
      if (!this.profile.alias || this.profile.alias.length === 0) {
        this.inputErrors.alias = 'The field cannot be empty'
        return
      }
      if (this.inputErrors.alias != '') {
        return
      }
      apiClient.accounts
        .accountsCheckAlias({ alias: this.profile.alias })
        .then(({ data }) => {
          this.checkedAlias = data.isUniqued
          if (!this.checkedAlias) {
            this.inputErrors.alias = 'You choose a non-unique Username'
          }
        })
        .catch((error) => {
          if (error.errors) {
            error.errors.forEach((error: any) => {
              this.checkedAlias = false
              if (error.code === 'UserDataIsNotFound') {
                this.inputErrors.alias = error.description
              }
            })
          }
        })
    },
    uploadCoverAvatarImage(
      event: HTMLElementEvent<HTMLInputElement>,
      isCover: boolean
    ) {
      if (event.target?.files == null || !event.target.files[0]) return
      const file = event.target.files[0]
      const resolveUpload = (isUploaded: boolean) => {
        if (isCover) {
          this.imageLoading.cover = false
        } else this.imageLoading.profile = false
      }
      if (isCover) {
        this.imageLoading.cover = true
      } else this.imageLoading.profile = true
      this.uploadImage(
        file,
        isCover ? FileType.ProfileCover : FileType.ProfileAvatar,
        resolveUpload
      )
    },

    uploadImage(
      file: File,
      fileType: FileType,
      resolveUpload: (isUploaded: boolean) => void
    ) {
      if (FileType.ProfileCover && !this.profile.cover)
        this.profile.cover = {} as FileDto
      else if (!FileType.ProfileCover && !this.profile.avatar)
        this.profile.avatar = {} as FileDto
      const preview =
        fileType == FileType.ProfileCover ? this.CoverImage : this.AvatarImage
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
    changeUserName(event: any) {
      this.userNameCount = event.currentTarget.value.length
      this.checkedAlias = false
      this.changeInputValue('alias', event)
      const re = new RegExp('^[a-zA-Z0-9_]*$')
      if (this.profile.alias && !re.test(this.profile.alias)) {
        this.inputErrors.alias =
          'Must contain only latin letters, numbers and "_"'
      } else {
        this.inputErrors.alias = ''
      }
    },
    changeSocialLinks() {
      this.inputErrors.socialLinks = ''
      if (!this.profile.socialLinks) {
        return
      }
      /* let isLink = false
      this.profile.socialLinks.forEach(function (entry) {
        if (entry.link && entry.link.length > 0) {
          isLink = true
        }
      })
      if (!isLink) {
        this.inputErrors.socialLinks =
          'Social network must be at least one filled'
      } */
    },
    changeBio(event: any) {
      this.bioCount = event.currentTarget.value.length
      this.changeInputValue('bio', event)
    },

    changeInputValue(nameInput: keyof GetProfileDto, event: any) {
      ;(<any>this.profile[nameInput]) = event.currentTarget.value
    },
    validateFields() {
      this.isFormValid = true
      if (!this.profile.fullName) {
        this.inputErrors.fullName = 'The field cannot be empty'
        this.isFormValid = false
      }
      /*  if (!this.profile.socialLinks) {
        this.isFormValid = false
        return
      }
      let isLink = false
      this.profile.socialLinks.forEach(function (entry) {
        if (entry.link && entry.link.length > 0) {
          isLink = true
        }
      })
      if (!isLink) {
        this.isFormValid = false
        this.inputErrors.socialLinks =
          'Social network must be at least one filled'
      } */
    },
    saveChanges() {
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
        Alias: this.profile.alias,
        IsPublic: this.profile.isPublic,
      } as any
      if (this.profile.personalWebSite)
        dto.PersonalWebSite = this.profile.personalWebSite
      if (this.profile.bio) dto.Bio = this.profile.bio
      if (this.profile.socialLinks) dto.SocialLinks = this.profile.socialLinks

      if (this.CoverImage.file) dto.Cover = this.CoverImage.file
      else if (this.CoverImage.id) dto.CoverId = this.CoverImage.id
      if (this.AvatarImage.file) dto.Avatar = this.AvatarImage.file
      else if (this.AvatarImage.id) dto.AvatarId = this.AvatarImage.id

      const formData = Converter.jsonToFormData(dto)
      http
        .put(`/api/accounts/profiles`, formData)
        .then(({ data }) => {
          this.$store.commit('auth/changeUser', {
            ...this.user,
            isPublic: this.profile.isPublic,
            fullName: this.profile.fullName,
            avatar: data.avatar || this.profile.avatar,
            userName: this.profile.alias,
          })
          this.$store.commit(
            'ui/changeVisibleMessageName',
            VisibleMessageNameType.Success
          )
          this.isSaving = false
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
  },
})
</script>

<style lang="scss" scoped>
.profile {
  font-family: 'Poppins', sans-serif;
  margin: 30px 0 80px 0;
  &__actions {
    .btn {
      box-sizing: border-box;
      display: inline-block;
      vertical-align: top;
      min-width: unset;
      text-align: center;
      color: $white;
      background: $black;
      font-weight: 500;
      font-size: 13px;
      line-height: 15px;
      padding: 9px 24px;
      transition: 0.3s;
      border: none;
      border-radius: $shape_border_radius;
      outline: none;
      cursor: pointer;

      @include sm-down {
        min-width: 103px;
        padding-right: 15px;
        padding-left: 15px;
      }

      &.loading {
        background: #949cad;
        color: $white;
        svg {
          animation: spin 1s linear infinite;
        }
      }
      &.iconed {
        &--right {
          svg {
            margin-right: 0;
            margin-left: 8px;
          }
        }
      }
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
  &__title {
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
    margin-bottom: 20px;
  }
  &__imge {
    border-bottom: 1px solid #dadada;
    padding-bottom: 30px;
    margin-bottom: 30px;
  }

  &__cover-image {
    width: 100%;
    height: 165px;
    max-width: 1020px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    border: 1px dashed #dadada;
    input {
      display: none;
    }
    picture > img {
      width: 100%;
      height: 165px;
      object-fit: cover;
      object-position: center;
      position: relative;
      // z-index: 2;
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
    &__alias {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: calc(100% - 5s0px);
    }
  }
  &__ref-text_avatar {
    width: 149px;
    margin-top: 45px;
    position: absolute;
    top: 0;
    right: -15px;
    transform: translate(100%, 0);
  }
  &__photo {
    margin-top: -20px;
    display: inline-block;
    position: relative;
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
    bottom: 7px;
    position: absolute;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  &__changeImage {
    width: 30px;
    height: 30px;
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
  &__deleteImage {
    width: 30px;
    height: 30px;
    background: #ffffff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    right: 15px;
    bottom: 10px;
    position: absolute;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  &__general-info {
    margin-bottom: 40px;
    border-bottom: 1px solid #dadada;
  }
  &__privacy-info {
    margin-bottom: 40px;
    p {
      font-size: 13px;
      margin-bottom: 20px;
    }
  }

  &__privacy {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 250px;
    margin-bottom: 20px;
    font-size: 13px;
    cursor: pointer;

    @include sm-down {
      width: 100%;
      min-width: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__privacy-text {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
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
  &__label-username,
  &__label-bio,
  &__label-social {
    font-size: 13px;
    line-height: 14px;
    color: #000;
    margin-bottom: 4px;
  }
  &__fixtext-username {
    color: #828282;
    font-size: 13px;
    line-height: 14px;
    padding: 10px 0 10px 6px;
  }
  &__wrapper-username,
  &__wrapper-fullName,
  &__wrapper-website {
    display: flex;
    flex-direction: column;
    position: relative;
    width: calc(33.333% - 15px);
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
    min-height: 130px;
    max-height: 300px;
    padding: 9px 6px;
    font-family: 'Poppins', sans-serif;
    overflow-x: hidden;
  }

  &__username,
  &__fullName,
  &__socialLink,
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
  &__username {
    input {
      padding: 10px 6px 10px 0;
      width: calc(100% - 85px);
    }
  }
  &__fullName {
    input {
      width: 100%;
    }
  }
  &__username {
    .link-input-icon {
      position: absolute;
      z-index: 9;
      right: 7px;
      top: 34px;
      opacity: 0;
      transition: all 0.3s ease;
      &.active {
        opacity: 1;
      }
    }
  }
  &__field-wrapper-error {
    border-color: #f46363;
  }
  &__itemSocialLinks {
    display: flex;
    align-items: center;
  }
  &__socialLink {
    padding: 0px;
  }
  &__socialName {
    width: 240px;
    border-left: 1px solid #dadada;
    padding-left: 6px;
    padding: 9px 6px;
  }
  &__socialType {
    opacity: 0.5;
    width: 240px;
    padding: 9px 6px;
    display: flex;
    align-items: center;
    &__mobile {
      display: none;
    }
    &__icon {
      margin-right: 7px;
      opacity: 0.5;
    }
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
  &__button-links {
    width: 100px;
    margin-top: 5px;
    padding: 2px 4px;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    &__iconUp {
      transform: rotate(180deg);
    }
    &:hover {
      opacity: 0.6;
    }

    &:active {
      opacity: 1;
    }
  }
  &__socialBurger {
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }
  &__error {
    color: #f46363;
    font-size: 10px;
    font-weight: 400;
    line-height: 12px;
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@media screen and (max-width: 1240px) {
  .profile {
    &__wrapper-username,
    &__wrapper-fullName,
    &__wrapper-website {
      display: flex;
      flex-direction: column;
      position: relative;
      width: calc(33.333% - 10px);
    }
  }
}
@media screen and (max-width: 620px) {
  .profile {
    &__fields-wrapper {
      flex-wrap: wrap;
    }
    &__wrapper-username,
    &__wrapper-fullName,
    &__wrapper-website {
      width: 100%;
    }
    &__wrapper-bio {
      margin-top: 0;
    }
    &__field-wrapper {
      width: 100%;
      margin-bottom: 20px;
      margin-right: 0px;
    }
    &__label-social {
      margin-top: 14px;
    }
  }
}

@media screen and (max-width: 540px) {
  .profile {
    &__socialLink {
      width: calc(100% - 30px);
    }
    &__socialType {
      width: 165px;
      padding: 8px 4px;
      &__desktop {
        display: none;
      }
      &__mobile {
        display: block;
      }
      &__icon {
        margin-right: 4px;
      }
    }
    &__socialName {
      width: calc(100% - 165px);

      padding-left: 4px;
      padding: 8px 4px;
    }
  }
}
@media screen and (max-width: 475px) {
  .profile {
    &__socialLink {
      width: 100%;
    }
    &__socialBurger {
      display: none;
    }
  }
}
</style>

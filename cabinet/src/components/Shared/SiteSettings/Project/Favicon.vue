<template>
  <div class="favicon">
    <div class="favicon__header favicon__header_pb-14">
      <title-component>Favicon</title-component>
    </div>
    <div class="favicon__section">
      <title-component :theme="'brown'">Favicon on Browser Tab</title-component>
      <description class="favicon__section-descr"
        >Set your browser tab icon</description
      >
      <image-upload
        class="favicon__image-upload"
        :onClick="handleImageUploadClick"
        :onChange="dataSetFavicon"
        :isDisabled="!isUserCanChangeFavicon"
        :image="faviconImage"
        :stylesImg="stylesImg"
        :onMouseLeave="handleImageUploadMouseLeave"
        :remove-image-by-id="removeImage"
        :is-default-image="isDefault && !fileData.file"
      />
      <description class="favicon__section-info">
        You need to upload file with <span>256x256px</span> with format .png
      </description>
    </div>
    <upgrade-to-pro v-if="!isUserCanChangeFavicon">
      Your favicon is currently the Airtap logo.<br /><span
        >Upgrade to a&nbsp;Pro Plan</span
      >&nbsp;that includes a custom favicon.
    </upgrade-to-pro>
    <div
      class="favicon__actions"
      :class="
        !isUserCanChangeFavicon || isDisabledSaveChanges ? 'action-blocked' : ''
      "
    >
      <button-component
        :tag="'button'"
        :onClick="saveChanges"
        :isDisabled="isSaving || isDisabledSaveChanges"
      >
        <svg-icon
          v-if="isSaving"
          name="loader-icon"
          width="12"
          height="12"
          color="#fff"
        />
        <span>{{ isSaving ? 'Saving' : 'Save' }}</span>
      </button-component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import TitleComponent from '@/components/Shared/SiteSettings/Title.vue'
import Description from '@/components/Shared/SiteSettings/Description.vue'
import ButtonComponent from '@/components/Shared/SiteSettings/Button.vue'
import UpgradeToPro from '@/components/Shared/SiteSettings/UpgradeToPro.vue'
import ImageUpload from '@/components/Shared/SiteSettings/ImageUpload.vue'
import Loader from '@/components/Shared/ui/loader.vue'
import { VisibleMessageNameType } from '@/store/ui'
import { SiteSettingsMutations } from '@/store/siteSettings'
import { cloneDeep as _cloneDeep } from 'lodash'
import { AccountDto } from '@/utils/api'
import apiClient from '@/utils/apiClient'
interface Preview {
  id: undefined | string
  file: null | File
  fullPath: string | ArrayBuffer | null
}
export default Vue.extend({
  components: {
    TitleComponent,
    Description,
    ButtonComponent,
    UpgradeToPro,
    ImageUpload,
    Loader,
  },
  props: {
    openProjectId: {
      type: Number,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
  },

  data() {
    let defaultFaviconImage = {
      id: '1645692c-b2fe-4cbb-8159-29a42ddd9981',
      path: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/256.png`,
      fullPath: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/256.png`,
      originalFileName: 'favicon.png',
      fullPathWebP: null,
      fullPathJp2: null,
      dominantColor: null,
      additionalCategory: 'Favicon',
      isHasWebP: false,
      isHasJp2: false,
      isFavicon: true,
      isSocial: false,
    }

    return {
      defaultFaviconImage,
      faviconBase64: '',
      isDisabledSaveChanges: true,
      isSaving: false,
      fileData: {
        id: undefined,
        file: null,
        fullPath: null,
      } as Preview,
    }
  },

  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
    }),
    isUserCanChangeFavicon(): boolean {
      return this.user.isAdmin || this.user.plan.features.isCustomFavicon
    },
    stylesImg(): string {
      return `
          width: 100%;
          max-width: inherit;
          max-height: inherit;
          padding: 18px 16px;
        `
    },
    faviconImage(): any {
      if (this.settings.faviconImage) return this.settings.faviconImage
      return this.defaultFaviconImage
    },
    isDefault(): boolean {
      if (
        !this.settings.faviconImage ||
        (this.settings.faviconImage.path &&
          this.settings.faviconImage.path.includes('Defaults/256.png'))
      )
        return true
      else return false
    },
  },
  watch: {
    settings() {
      this.isDisabledSaveChanges = true
    },
  },
  methods: {
    handleImageUploadClick() {
      if (!this.isUserCanChangeFavicon) {
        document.dispatchEvent(new Event('add-hovered-class-to-upgrade-to-pro'))
      }
    },
    handleImageUploadMouseLeave() {
      if (!this.isUserCanChangeFavicon) {
        document.dispatchEvent(
          new Event('remove-hovered-class-to-upgrade-to-pro')
        )
      }
    },
    dataSetFavicon(file: File | null) {
      const preview = this.fileData
      var reader = new FileReader()
      reader.onload = function () {
        preview.fullPath = reader.result
        preview.id = ''
        preview.file = file
      }
      this.isDisabledSaveChanges = false
      if (file != null) reader.readAsDataURL(file)
    },
    async removeImage(id: string) {
      this.fileData = {
        id: undefined,
        file: null,
        fullPath: null,
      }
      if (this.isDefault) {
        return
      }
      const { commit } = this.$store
      const projectSettings = _cloneDeep(this.settings)
      const payload = {
        id: this.openProjectId,
        settings: {
          ...projectSettings,
          faviconImage: this.defaultFaviconImage,
        },
      }

      try {
        apiClient.projects
          .projectsChangeFavicon(this.openProjectId, {
            Favicon: null,
          })
          .then(({ data: dto }) => {
            commit('project/changeProjectSettings', payload)
            commit(
              `siteSettings/${SiteSettingsMutations.CHANGE_PROJECT_SETTINGS}`,
              payload.settings
            )
            commit(
              'ui/changeVisibleMessageName',
              VisibleMessageNameType.Success
            )
          })
          .catch((error: any) => {
            commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed)
            console.error(error)
          })
      } catch (e) {
        console.error(e)
        commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed)
      }
    },
    saveChanges() {
      const { commit } = this.$store
      this.isSaving = true
      apiClient.projects
        .projectsChangeFavicon(this.openProjectId, {
          Favicon: this.fileData.file,
        })
        .then(() => {
          const projectSettings = _cloneDeep(this.settings)
          const fileData = _cloneDeep(this.fileData)
          const payload = {
            id: this.openProjectId,
            settings: {
              ...projectSettings,
              faviconImage: fileData,
            },
          }
          commit('project/changeProjectSettings', payload)
          commit(
            `siteSettings/${SiteSettingsMutations.CHANGE_PROJECT_SETTINGS}`,
            payload.settings
          )
          this.isSaving = false
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success)
        })
        .catch((error) => {
          console.error(error)
          this.isSaving = false
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed)
        })
    },
  },
})
</script>

<style lang="scss" scoped>
.favicon {
  &__header {
    margin-bottom: 30px;

    &_pb-14 {
      padding-bottom: 10px;
      border-bottom: 1px solid $gray200;
    }

    .title {
      margin: 0;
    }
  }

  &__section {
    margin-bottom: 30px;

    &-descr {
      margin: 0 0 18px;
    }

    &-info {
      ::v-deep {
        color: #828282;
        span {
          color: $black;
        }
      }
    }
  }

  &__image-upload {
    margin-bottom: 13px;
  }

  &__actions {
    margin-top: 60px;
    svg {
      animation: spin 1s linear infinite;
      margin-right: 5px;
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

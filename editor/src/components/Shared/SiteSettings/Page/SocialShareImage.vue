<template>
  <div class="social-share-image">
    <div class="social-share-image__header social-share-image__header_mb-14">
      <title-component>Open graph</title-component>
    </div>
    <div class="social-share-image__section">
      <title-component class="social-share-image__subtitle">Open graph</title-component>
      <description class="social-share-image__section-description">
        This image appears when your website is shared
      </description>
      <image-upload
        class="social-share-image__image-upload"
        :onClick="handleImageUploadClick"
        :onMouseLeave="handleImageUploadMouseLeave"
        :onChange="dataSetImage"
        :image="socialImage"
        :remove-image-by-id="removeImage"
        :isDisabled="isUserCannotChangeSocialImage"
        :is-social-image="true"
        :is-default-image="isDefault && !fileData.file"
      />
      <description class="social-share-image__text">
        You need to upload file with <span>1200 X 630</span> px with format .png
      </description>
    </div>
    <!-- Maybe remove this section -->
    <upgrade-to-pro v-if="isUserCannotChangeSocialImage" :arrowType="'long'" :is-social-image="true">
      Your Share Image is currently the Airtap Share Image.
      <br />
      Upgrade to a&nbsp;<span>Pro Plan</span>&nbsp;that includes a custom Share Image.
    </upgrade-to-pro>
    <div
      class="social-share-image__actions"
      :class="isUserCannotChangeSocialImage || isDisabledSaveChanges ? 'action-blocked' : ''"
    >
      <button-component :tag="'button'" :onClick="saveChanges" :isDisabled="isDisabledSaveChanges || isSaving">
        <svg-icon v-if="isSaving" name="loader-icon" width="12" height="12" color="#fff" />
        <span>{{ isSaving ? 'Saving' : 'Save' }}</span>
      </button-component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapState } from 'vuex';
import Loader from '@/components/Shared/ui/loader.vue';
import TitleComponent from '@/components/Shared/SiteSettings/Title.vue';
import Description from '@/components/Shared/SiteSettings/Description.vue';
import ButtonComponent from '@/components/Shared/SiteSettings/Button.vue';
import UpgradeToPro from '@/components/Shared/SiteSettings/UpgradeToPro.vue';
import ImageUpload from '@/components/Shared/SiteSettings/ImageUpload.vue';
import SwitchComponent from '@/components/Shared/SiteSettings/Switch.vue';
import apiClient from '@/utils/apiClient';
import { cloneDeep as _cloneDeep } from 'lodash';
import { VisibleMessageNameType } from '@/store/ui';
import { AccountDto, PlanCategory, BaseProjectPageDto } from '@/utils/api';
import { SiteSettingsMutations } from '@/store/siteSettings';
interface Preview {
  id: undefined | string;
  file: null | File;
  fullPath: string | ArrayBuffer | null;
}
export default Vue.extend({
  components: {
    TitleComponent,
    Description,
    ButtonComponent,
    UpgradeToPro,
    ImageUpload,
    SwitchComponent,
    Loader
  },
  props: {
    openProjectId: {
      type: Number,
      required: true
    },
    page: {
      type: Object as PropType<BaseProjectPageDto>
    }
  },
  data() {
    const defaultSocialImage = {
      id: '5d9ca1cb-2807-46e3-a2b6-28c7cb17d07d',
      path: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/share+image.png`,
      fullPath: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/share+image.png`,
      originalFileName: 'share image.png',
      fullPathWebP: null,
      fullPathJp2: null,
      dominantColor: null,
      additionalCategory: 'Social',
      isHasWebP: false,
      isHasJp2: false,
      isFavicon: false,
      isSocial: true
    };
    return {
      isApplyToAll: false,
      fileData: {
        id: undefined,
        file: null,
        fullPath: null
      } as Preview,
      isDisabledSaveChanges: true,
      defaultSocialImage,
      isSaving: false
    };
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user
    }),
    isUserCannotChangeSocialImage(): boolean {
      return this.user.plan.category == PlanCategory.Free && !this.user.isAdmin;
    },
    socialImage(): any {
      if (this.page.socialImage) return this.page.socialImage;
      return this.defaultSocialImage;
    },
    isDefault(): boolean {
      if (
        !this.page.socialImage ||
        (this.page.socialImage.path && this.page.socialImage.path.includes('Defaults/share+image.png'))
      )
        return true;
      else return false;
    }
  },
  watch: {
    page() {
      this.isDisabledSaveChanges = true;
    }
  },
  methods: {
    handleImageUploadClick() {
      if (this.isUserCannotChangeSocialImage) {
        document.dispatchEvent(new Event('add-hovered-class-to-upgrade-to-pro'));
      }
    },
    handleImageUploadMouseLeave() {
      if (this.isUserCannotChangeSocialImage) {
        document.dispatchEvent(new Event('remove-hovered-class-to-upgrade-to-pro'));
      }
    },
    dataSetImage(file: File | null) {
      const preview = this.fileData;
      var reader = new FileReader();
      reader.onload = function () {
        preview.fullPath = reader.result;
        preview.id = '';
        preview.file = file;
      };
      if (file != null) reader.readAsDataURL(file);
      this.isDisabledSaveChanges = false;
    },
    async removeImage(id: string) {
      this.fileData = {
        id: undefined,
        file: null,
        fullPath: null
      };
      if (this.isDefault) {
        return;
      }
      const { commit, dispatch } = this.$store;
      try {
        const page = { ...this.page, socialImage: this.defaultSocialImage };
        apiClient.projectPages
          .projectPagesChangeSocialImage(this.openProjectId, this.page.id, {
            Image: null
          })
          .then(({ data: dto }) => {
            commit(`siteSettings/${SiteSettingsMutations.CHANGE_PAGE}`, page);
            commit(`siteSettings/${SiteSettingsMutations.UPDATE_PROJECT_PAGES_PAGE}`, page);
            commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success);
          })
          .catch((error: any) => {
            commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
            console.error(error);
          });
      } catch (e) {
        console.error(e);
        commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
      }
    },
    saveChanges() {
      this.isSaving = true;
      const { commit } = this.$store;
      apiClient.projectPages
        .projectPagesChangeSocialImage(this.openProjectId, this.page.id, {
          Image: this.fileData.file
        })
        .then(() => {
          const fileData = _cloneDeep(this.fileData);
          const page = { ...this.page, socialImage: fileData };
          commit(`siteSettings/${SiteSettingsMutations.CHANGE_PAGE}`, page);
          commit(`siteSettings/${SiteSettingsMutations.UPDATE_PROJECT_PAGES_PAGE}`, page);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Success);
          this.isSaving = false;
        })
        .catch(error => {
          console.error(error);
          commit('ui/changeVisibleMessageName', VisibleMessageNameType.Failed);
          this.isSaving = false;
        });
    },
    changeSwitchValue() {
      this.isApplyToAll = !this.isApplyToAll;
    }
  }
});
</script>

<style lang="scss" scoped>
.social-share-image {
  &__header {
    margin-bottom: 30px;

    &_mb-14 {
      padding-bottom: 14px;
      margin-bottom: 30px;
      border-bottom: 1px solid $gray200;

      .title {
        margin-bottom: 0px;
      }
    }
  }

  &__description {
    max-width: 330px;
  }

  &__section {
    margin-bottom: 30px;
    &-description {
      margin: 0 0 18px;
    }
  }

  &__subtitle {
    margin-bottom: 8px;
  }

  &__image-upload {
    margin-bottom: 8px;
  }

  &__actions {
    margin-top: 60px;
    svg {
      animation: spin 1s linear infinite;
      margin-right: 5px;
    }
  }
  &__switch {
    margin-top: 10px;
  }
  &__text {
    ::v-deep {
      color: #828282;
      span {
        color: $black;
      }
    }
  }
  &__btn {
    display: inline-block;
    font-weight: bold;
    font-size: 10px;
    line-height: 12px;
    text-align: center;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #333333;
    padding: 9px 23px;
    background: #f2f2f2;
    border: 1px solid #dadada;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    margin: 20px 0 30px;
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

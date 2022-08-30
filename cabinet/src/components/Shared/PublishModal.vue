<template>
  <modal
    class="project-publish-modal"
    :isVisible="isVisible"
    v-if="isVisible"
    :class="isSuccessed ? '' : 'project-published'"
  >
    <div class="project-publish-modal__inner">
      <a
        href="#"
        class="project-publish-modal__close-button"
        @click="closeModal"
      >
        <close />
      </a>
      <img
        class="project-publish-modal__illustration"
        src="/img/modals/published-success.png"
        srcset="/img/modals/published-success@2x.png 2x"
        alt=""
        v-if="isSuccessed"
      />
      <img
        class="project-publish-modal__illustration"
        src="/img/modals/publish-changes.png"
        srcset="/img/modals/publish-changes@2x.png 2x"
        alt=""
        v-if="!isSuccessed"
      />

      <div class="project-publish-modal__title" v-if="isSuccessed">
        Your website is {{ isPublished ? 'published' : 'unpublished' }}!
      </div>

      <div class="project-publish-modal__title" v-if="!isSuccessed">
        Do you want
        {{ isPublished ? 'unpublish page' : 'publish changes on your URL' }}?
      </div>

      <div
        class="project-publish-modal__url-block"
        :class="isPublished ? '' : 'light'"
      >
        <a
          :href="mergedProjectUrl || '#'"
          target="_blank"
          class="project-publish-modal__url-link"
          :title="mergedProjectUrl || '#'"
        >
          {{ mergedProjectUrl }}
        </a>
        <div class="project-publish-modal__links" v-if="isPublished">
          <a href="#" @click.prevent="copyUrl">
            <span>Copy URL</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.39469 9.52066L3.78749 10.1237C3.26114 10.6454 2.40509 10.6458 1.87904 10.1237C1.62615 9.87271 1.48725 9.53941 1.48725 9.18511C1.48725 8.83081 1.6263 8.49736 1.87889 8.24641L4.11389 6.02897C4.57709 5.56967 5.44843 4.89332 6.08353 5.52317C6.37498 5.81267 6.84568 5.81072 7.13503 5.51942C7.42453 5.22812 7.42273 4.75727 7.13128 4.46807C6.05173 3.39677 4.45619 3.59477 3.06659 4.97357L0.831448 7.19116C0.295199 7.72351 0 8.43151 0 9.18511C0 9.93871 0.295199 10.6466 0.831598 11.1789C1.38345 11.7264 2.10809 12 2.83304 12C3.55814 12 4.28309 11.7264 4.83524 11.1786L5.44288 10.5755C5.73418 10.2863 5.73583 9.81556 5.44633 9.52411C5.15729 9.23296 4.68614 9.23131 4.39469 9.52066ZM11.1681 0.906631C10.0086 -0.243866 8.38738 -0.306266 7.31398 0.758731L6.55708 1.51008C6.26563 1.79943 6.26383 2.26998 6.55333 2.56143C6.84283 2.85288 7.31353 2.85453 7.60498 2.56518L8.36158 1.81428C8.91763 1.26213 9.64572 1.49103 10.1206 1.96218C10.3738 2.21313 10.5129 2.54658 10.5129 2.90088C10.5129 3.25532 10.3737 3.58877 10.1209 3.83972L7.73638 6.20522C6.64603 7.28701 6.13453 6.77926 5.91628 6.56266C5.62484 6.27332 5.15429 6.27512 4.86479 6.56642C4.57529 6.85771 4.57709 7.32856 4.86854 7.61776C5.36909 8.11456 5.94043 8.36086 6.53938 8.36086C7.27273 8.36086 8.04733 7.99156 8.78383 7.26031L11.1684 4.89482C11.7045 4.36247 12 3.65432 12 2.90073C12 2.14743 11.7045 1.43928 11.1681 0.906631Z"
                fill="white"
              />
            </svg>
          </a>
          <a :href="mergedProjectUrl || '#'" target="_blank">
            <span>Go to the Website</span>
            <svg
              width="13"
              height="10"
              viewBox="0 0 13 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.77616 2.62266V0.331819C6.77616 0.0656927 7.08099 -0.0918326 7.30571 0.0581659L12.2653 4.06834C12.4626 4.20006 12.4626 4.48447 12.2653 4.61565L7.30571 8.62582C7.08099 8.77582 6.77616 8.61829 6.77616 8.35217V6.22961C3.67786 6.22961 1.05105 7.61347 0.0870944 10C0.0354829 9.68119 0 9.357 0 9.0242C0 5.48876 3.03379 2.62266 6.77616 2.62266Z"
                fill="white"
              />
            </svg>
          </a>
        </div>
      </div>
      <div class="project-publish-modal__btns">
        <air-button
          :action="publish"
          :is-processing="isProcessing"
          :button-text="
            isSuccessed ? 'Okay' : isPublished ? 'Unpublish' : 'Publish'
          "
        />
      </div>
    </div>
  </modal>
</template>

<script>
//@deprecated ?
import Vue from 'vue'
import Modal from '@/components/Shared/Modal.vue'
import Close from '@/assets/icons/close.svg?inline'
import http from '@/utils/http'
import { mapGetters } from 'vuex'
import { VisibleModalType } from '@/store/ui'
import apiClient from '@/utils/apiClient'
import AirButton from '@/components/Login/LoginButton.vue'
export default Vue.extend({
  data() {
    return {
      copiedAlert: false,
      isProcessing: false,
      isSuccessed: false,
    }
  },
  props: {
    isVisible: Boolean,
  },
  components: {
    Modal,
    Close,
    AirButton,
  },
  computed: {
    ...mapGetters({
      pageToPublish: 'project/getPageToPublish',
      getProjectSettingsById: 'project/getProjectSettingsById',
    }),
    mergedProjectUrl() {
      const domain = process.env.VUE_APP_AIRTAP_DOMAIN

      if (!this.projectSettings) return ''
      const pageUrl = this.pageToPublish.url ? `${this.pageToPublish.url}` : ''
      if (!!this.projectSettings.customDomain)
        return `https://${domain}/w/${this.projectSettings.customDomain}/${pageUrl}`

      return `https://${domain}/w/${this.projectSettings.airtapDomain}/${pageUrl}`
    },
    isPublished() {
      return this.pageToPublish.isPublished
    },
    projectSettings() {
      return this.getProjectSettingsById(this.pageToPublish.projectId)
    },
  },
  methods: {
    closeModal(event) {
      if (event) event.preventDefault()
      this.$store.dispatch('ui/closeModal')
      this.isSuccessed = false
    },
    copyUrl() {
      navigator.clipboard.writeText(this.mergedProjectUrl || '#')
      this.copiedAlert = true
      setTimeout(() => {
        this.copiedAlert = false
      }, 1000)
    },
    openSiteSettings(event) {
      if (event) event.preventDefault()

      this.$store.dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: VisibleModalType.SiteSettings,
      })
    },
    publish() {
      if (this.isSuccessed) {
        this.closeModal()
        return
      }
      this.isProcessing = true
      if (this.isPublished) {
        apiClient.projectPages
          .projectPagesUnpublished(
            this.pageToPublish.projectId,
            this.pageToPublish.id
          )
          .then(({ data: page }) => {
            this.isProcessing = false
            this.isSuccessed = true
            this.$store.commit(
              'project/changeProjectPageUnpublish',
              this.pageToPublish.id
            )
          })
          .catch((error) => {
            this.additionalPublishStatus = null
            this.isProcessing = false
            this.isSuccessed = false
            console.error(error)
          })
        return
      }
      apiClient.projectPages
        .projectPagesPublish(
          this.pageToPublish.projectId,
          this.pageToPublish.id
        )
        .then(({ data: page }) => {
          this.isProcessing = false
          this.isSuccessed = true
          this.$store.commit('project/changeProjectPage', page.page)
        })
        .catch((error) => {
          this.additionalPublishStatus = null
          this.isProcessing = false
          this.isSuccessed = false
          console.error(error)
        })
    },
  },
})
</script>

<style lang="scss" scoped>
.link-copied-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  max-width: 350px;
  left: 50%;
  bottom: 10px;
  width: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(130, 130, 130, 0.2);
  padding: 7px 10px;
  transform: translateX(-50%);
  opacity: 1;
  transition: 0.3s;
  font-size: 14px;
  font-weight: 400;
  &__text {
    margin-left: 10px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.project-publish-modal {
  width: 432px;
  @include sm-down {
    width: 292px;
    padding-left: 14px;
    padding-right: 14px;
  }
  &.project-published {
    @include sm-down {
      height: 496px;
    }
  }
  &__inner {
    height: 100%;
    width: 100%;
  }
  &__url-block {
    background: #000000;
    border-radius: $shape_border_radius;
    padding: 16px;
    margin-bottom: 24px;
    @include sm-down {
      padding: 16px 10px 14px;
    }
    &.light {
      background: #d7e2fc;
      .project-publish-modal__url-link {
        margin-bottom: 0;
      }
    }
  }
  &__url-settings {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 17px;
    color: #555555;
    margin-bottom: 35px;
    text-decoration: none;
    svg {
      margin-right: 5px;
    }
  }
  &__url-link {
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    color: #173bef;
    text-decoration: none;
    display: block;
    background: #ffffff;
    border-radius: $shape_border_radius;
    padding: 6px 12px;
    cursor: pointer;
    margin-bottom: 16px;
    transition: 0.3s;
    width: 100%;
    word-break: break-word;
    &:hover {
      color: rgba(23, 59, 239, 0.8);
    }
    @include sm-down {
      font-size: 12px;
      line-height: 14px;
      padding: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &__btns {
    justify-content: center;
    align-items: center;
    display: flex;
  }
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    font-weight: bold;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: #000000;
    border: 1px solid #000;
    color: #ffffff;
    text-decoration: none;
    width: 95px;
    height: 30px;
    transition: 0.3s;
    &:nth-child(2) {
      margin-left: 20px;
    }
    &.disabled {
      color: #bdbdbd;
      background: #fff;
      border-color: #dadada;
    }
    &:hover {
      opacity: 0.8;
    }
  }
  &__links {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      display: flex;
      text-decoration: none;
      font-size: 14px;
      line-height: 17px;
      color: #ffffff;
      align-items: center;
      &:last-child {
        margin-left: 24px;
      }
      svg {
        margin-left: 8px;
      }
    }
  }
  &__illustration {
    display: block;
    max-width: 100%;
    margin-right: auto;
    margin-bottom: 30px;
    margin-left: auto;
  }

  &__title {
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    color: #000000;
    margin-bottom: 30px;
  }

  &__close-button {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f2f2f2;
    border-radius: 50%;
    transition: 0.3s;

    &:hover {
      background-color: #828282;

      path {
        fill: #ffffff;
      }
    }

    &:active {
      background-color: #333333;

      path {
        fill: #ffffff;
      }
    }

    path {
      fill: #bdbdbd;
      transition: 0.3s;
    }
  }
}
</style>

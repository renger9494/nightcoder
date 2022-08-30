<template>
  <div class="template_container">
    <div class="template">
      <div class="template__poster_wrapper">
        <picture v-if="templateImage">
          <source
            v-if="templateImage.fullPathWebP"
            type="image/webp"
            :srcset="templateImage.fullPathWebP.replace(' ', '%20')"
          />
          <source
            v-if="templateImage.fullPathJp2"
            type="image/jp2"
            :srcset="templateImage.fullPathJp2.replace(' ', '%20')"
          />

          <img
            class="template__poster"
            v-if="templateImage.fullPath"
            :src="templateImage.fullPath"
            :alt="template.name"
          />
        </picture>
      </div>

      <div class="template__info">
        <div class="template__info_header">
          <div class="template__info_bread-crumbs">
            <nuxt-link to="/templates">Templates</nuxt-link>
            <span>/</span>
            <span class="template__info_bread-crumbs__template_name">{{
              template.name
            }}</span>
          </div>
          <!--          <div class="template__info_nav">-->
          <!--            <div class="template__info_nav_button" @click="getNextTemplate">-->
          <!--              <svg-icon-->
          <!--                width="12"-->
          <!--                height="12"-->
          <!--                name="icon-left"-->
          <!--              />-->
          <!--            </div>-->
          <!--            <div class="template__info_nav_button" @click="getNextTemplate">-->
          <!--              <svg-icon-->
          <!--                width="12"-->
          <!--                height="12"-->
          <!--                name="icon-right"-->
          <!--              />-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
        <h2 class="template__info_name">{{ template.name }}</h2>
        <h3 class="template__info_description">{{ template.description }}</h3>
        <div class="template__info_buttons">
          <AirButton @change="startEdit" :is-template="true" />
          <!--          <AirButton @click="openDemo" iconName="eye" name="View demo" />-->
        </div>
        <div class="delimiter"></div>
        <div class="template__info_tags">
          <h3>Tags</h3>
          <category
            class="template__info_category"
            v-for="(category, index) in template.categories"
            :key="index"
            :isNotClickable="false"
            :category="category"
            :theme="'brown'"
          />
        </div>
        <div class="template__admin" v-if="user.isAdmin">
          <h3>Admin actions</h3>
          <a
            class="template__admin__link"
            target="_blank"
            :href="linkTemplateAdmin"
          >
            <svg-icon
              width="16"
              height="16"
              name="setting-icon"
              color="#ffffff"
            />
            <span>Edit template info</span>
          </a>
          <a
            class="template__admin__link"
            target="_blank"
            :href="linkTemplateEditor"
          >
            <svg-icon width="16" height="16" name="drafts" color="#ffffff" />
            <span>Edit template in editor</span>
          </a>
        </div>
      </div>
    </div>
    <limit-modal
      v-if="visibleModalName === VisibleModalType.Limit"
      :isVisible="visibleModalName === VisibleModalType.Limit"
    />
    <mobile-alert-modal
      v-if="visibleModalName === VisibleModalType.MobileAlert"
    />
    <overlay :isVisible="visibleModalName !== null" />
    <!-- <div class="similar-templates">
      <h2>Similar templates</h2>
      <templates-list :templates="similarTemplates" />
    </div>
    <modal-overlay :isVisible="visibleModalName !== null" />-->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import { MetaInfo } from 'vue-meta'
import { mapState } from 'vuex'

import AirButton from '@/components/Settings/Profile/ButtonFollow.vue'
import Category from '@/components/Templates/Category.vue'
import TemplatesList from '@/components/Templates/TemplatesList/TemplatesList.vue'

//modals
import LimitModal from '@/components/Shared/LimitModal.vue'
import MobileAlertModal from '@/components/Shared/MobileAlertModal.vue'
import Overlay from '@/components/Shared/Overlay.vue'
import { VisibleModalType } from '@/store/ui'
import apiClient from '@/utils/apiClient'
import { TemplateDto, FileType, FileDto, AccountDto } from '@/utils/api'
import { getTemplateImageUrl } from '@/utils/types/api/files'

export default Vue.extend({
  components: {
    AirButton,
    Category,
    TemplatesList,
    Overlay,
    LimitModal,
    MobileAlertModal,
  },
  head(): MetaInfo {
    return {
      title: this.template != null ? this.template.name : 'Template',
    }
  },
  layout: 'profile',
  data() {
    return {
      FileType,
      template: {} as TemplateDto,
      similarTemplates: [] as TemplateDto[],
      isLoading: true,
      VisibleModalType,
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
      visibleModalName: (state: any) =>
        <VisibleModalType | null>state.ui.visibleModalName,
    }),

    templateId(): number {
      return +this.template.id
    },
    linkTemplateAdmin(): string {
      return `https://admin.airtap.io/template/${this.templateId}`
    },
    linkTemplateEditor(): string {
      const editorEndpoint = process.env.EDITOR_ENDPOINT
        ? process.env.EDITOR_ENDPOINT
        : ''
      return `${editorEndpoint}/editor/templates/${this.templateId}`
    },
    projectId(): number {
      return +this.$route.params.projectId
    },
    templateImage(): FileDto | undefined {
      return this.getTemplateImageUrl()
    },
    isProjectsLimit(): boolean {
      if (this.user.isAdmin) return false

      return (
        this.user.plan.currentProjects >= this.user.plan.features.draftProjects
      )
    },
  },
  methods: {
    getTemplateImageUrl() {
      let image =
        getTemplateImageUrl(this.template, FileType.TemplateFull) ??
        getTemplateImageUrl(this.template, FileType.TemplatePreview)
      return image
    },
    getNextTemplate() {},
    openDemo() {
      console.warn('[openDemo]: function hasnot implementation')
    },
    startEdit(event: Event) {
      if (event) event.preventDefault()

      if (!this.isUserLoggedIn) {
        this.$router.push({
          path: '/login',
          query: { redirectUrl: this.$route.fullPath },
        })
        return
      }
      if (this.isProjectsLimit) {
        this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
        return
      }
      const { dispatch } = this.$store
      if (window.innerWidth < 1200) {
        dispatch('ui/changeVisibleModalName', {
          newVisibleModalName: VisibleModalType.MobileAlert,
        })
        return
      }

      const isCreatePage = this.projectId > 0
      if (isCreatePage) {
        dispatch('project/createPage', {
          projectId: this.projectId,
          templateId: this.templateId,
        })
        return
      }

      dispatch('project/createProject', { templateId: this.templateId })
    },
  },
  async asyncData({ params, req, redirect }: Context) {
    try {
      let templateId = 0
      if (params.templateId) {
        const templateSplit = params.templateId.split('-')
        templateId = +templateSplit[templateSplit.length - 1]
      }

      const { data: template } = await apiClient.templates.templatesGetById(
        templateId
      )
      /* const { data: similarTemplates } =
        await apiClient.templates.templatesGet() */

      return {
        template,
        // similarTemplates: similarTemplates.items,
      }
    } catch (error) {
      console.log(error)
      redirect('/404')
    }
  },
})
</script>

<style lang="scss" scoped>
.template_container {
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1280px;
  width: 100%;
  height: fit-content;
  margin: 0 auto;
  padding: 0 $margin_page_desktop;
  .template {
    display: flex;
    //align-items: flex-start;
    //justify-content: space-between;
    //grid-template-columns: 58% 40%;
    //grid-gap: 30px;
    width: 100%;
    margin: 30px 0 100px;
    &__poster_wrapper {
      position: relative;
      border: 1px solid #f3f3f3;
      box-sizing: border-box;
      border-radius: 4px;
      flex: 0 0 calc(50% - 30px);
      width: calc(50% - 30px);
      margin-right: 30px;
    }
    &__poster {
      position: relative;
      width: 100%;
      height: auto;
    }
    &__info {
      flex: 0 0 calc(50% - 30px);
      width: calc(50% - 30px);
      &_header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      }
      &_bread-crumbs {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #949cad;
        a {
          text-decoration: none;
          outline: none;
          color: #949cad;
          transition: 0.3s;

          &:hover {
            color: #173bef;
          }
        }
        &__template_name {
          color: #000000;
        }
      }
      &_name {
        font-style: normal;
        font-weight: 500;
        font-size: 45px;
        line-height: 130%;
        margin-bottom: 8px;
      }
      &_description {
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 30px;
      }
      &_buttons {
        width: fit-content;
        margin-bottom: 27px;
      }
      &_tags {
        h3 {
          font-weight: 400;
          font-size: 13px;
          line-height: 20px;
          margin-bottom: 8px;
        }
      }
      &_category {
        margin-right: 8px;
      }
      &_nav {
        display: flex;
        flex-direction: row;
        &_button {
          width: 24px;
          height: 24px;
          border: 1px solid #ebebeb;
          box-sizing: border-box;
          border-radius: 4px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin-right: 8px;
        }
      }
    }
    &__admin {
      h3 {
        margin-top: 27px;
        font-weight: 400;
        font-size: 13px;
        line-height: 20px;
        margin-bottom: 8px;
      }
      &__link {
        width: fit-content;
        display: inline-flex;
        border: 1px solid $black;
        box-sizing: border-box;
        border-radius: $shape_border_radius;
        text-decoration: none;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        height: 40px;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: normal;
        color: $white;
        background: $black;
        margin-right: 10px;
        cursor: pointer;
        padding: 0 10px;
        transition: background 0.3s, color 0.3s, border 0.3s;
        span {
          margin-left: 5px;
        }
        &:hover {
          background: #333333;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .template_container {
    padding: 0 $margin_page_tablet;
    .template {
      margin: 30px 0 80px;
      flex-direction: column;

      &__poster_wrapper {
        order: 2;
        width: 100%;
      }

      &__info {
        order: 1;
        width: 100%;
        margin: 0 0 30px;
        &_name {
          font-size: 32px;
          line-height: 48px;
        }
        &_description {
          font-size: 13px;
          line-height: 19px;
        }
      }
    }
  }
}
@media screen and (max-width: 480px) {
  .template_container {
    padding: 0 $margin_page_mobile;
    .template {
      margin: 15px 0 80px;
      grid-template-columns: 100%;
      grid-template-rows: 1fr 1fr;
      &__poster_wrapper {
        grid-row: 2/3;
      }
      &__info {
        grid-row: 1/2;
        &_header {
          margin-bottom: 20px;
        }

        &_name {
          font-size: 22px;
          line-height: 33px;
        }
        &_description {
          font-size: 12px;
          line-height: 18px;
          margin-bottom: 16px;
        }
        &_buttons {
          display: none;
        }
        &_tags {
          h3 {
            font-size: 14px;
            line-height: 21px;
          }
        }
        &_category {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>

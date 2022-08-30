<template>
  <div
    class="template"
    :class="{
      template__carousel: carousel,
    }"
  >
    <a :href="templateUrl" class="template__poster-wrapper">
      <div
        class="template__poster-wrapper-img"
        :class="{ isLoaded }"
        :style="`background: ${
          templatePreview && templatePreview.dominantColor
            ? templatePreview.dominantColor
            : ''
        };`"
      >
        <picture v-if="templatePreview">
          <source
            v-if="templatePreview.fullPathWebP"
            type="image/webp"
            :srcset="templatePreview.fullPathWebP.replace(' ', '%20')"
          />
          <source
            v-if="templatePreview.fullPathJp2"
            type="image/jp2"
            :srcset="templatePreview.fullPathJp2.replace(' ', '%20')"
          />

          <img
            class="template__poster"
            :class="{
              template__poster__carousel: carousel,
            }"
            v-if="templatePreview.fullPath"
            :src="templatePreview.fullPath"
            :alt="template.name"
            @load="load"
          />
        </picture>
        <div v-if="!carousel">
          <div class="template__btn">
            <button class="template__btn-view">
              <div class="template__btn-view__icons">
                <svg-icon
                  class="template__btn-view__plain"
                  width="100%"
                  height="100%"
                  color="#000000"
                  name="eye"
                />
                <svg-icon
                  class="template__btn-view__hover"
                  width="100%"
                  height="100%"
                  color="#ffffff"
                  name="eye"
                />
              </div>
            </button>
            <button @click="startEdit($event)" class="template__btn-edit">
              <div class="template__btn-edit__icons">
                <svg-icon
                  class="template__btn-edit__plain"
                  width="100%"
                  height="100%"
                  color="#000000"
                  name="pencil"
                />
                <svg-icon
                  class="template__btn-edit__hover"
                  width="100%"
                  height="100%"
                  color="#ffffff"
                  name="pencil"
                />
              </div>
            </button>
          </div>
          <div
            class="template__label template__label_starter"
            v-if="isShowStarter"
          >
            <span>Starter</span>
          </div>
          <div
            class="template__label template__label_pro"
            v-else-if="isShowPro"
          >
            <filled-star-icon />
            <span>Pro</span>
          </div>
          <div class="template__label template__label_free" v-else>
            <span>Free</span>
          </div>
        </div>
      </div>
    </a>

    <div
      class="template__footer"
      :class="{
        template__footer__carousel: carousel,
      }"
    >
      <a :href="templateUrl" class="template__name">{{ template.name }}</a>
      <div class="template__categories" v-if="!carousel">
        <category
          class="template__category"
          v-for="(category, index) in template.categories"
          :category="category"
          :key="index"
          :theme="'brown'"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { VisibleModalType } from '@/store/ui'
import Category from '@/components/Templates/Category.vue'
import ShoppingCartIcon from '@/assets/icons/shopping-cart.svg?inline'
import FilledStarIcon from '@/assets/icons/star_filled.svg?inline'
import {
  PlanCategory,
  TemplateDto,
  AccountDto,
  FileType,
  BaseNameDtoOfInteger,
  FileDto,
} from '@/utils/api'
import { getTemplateImageUrl } from '@/utils/types/api/files'

export default Vue.extend({
  components: {
    Category,
    ShoppingCartIcon,
    FilledStarIcon,
  },
  props: {
    template: {
      type: Object as PropType<TemplateDto>,
    },
    categories: {
      type: Array as PropType<BaseNameDtoOfInteger[]>,
      default: function () {
        return []
      },
    },
    carousel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      FileType,
      isLoaded: false,
      VisibleModalType,
    }
  },
  methods: {
    getTemplateImageUrl,
    startEdit(event: Event) {
      event.preventDefault()
      event.stopPropagation()
      const { commit, dispatch } = this.$store

      if (!this.isUserLoggedIn) {
        this.$router.push({
          path: '/login',
          query: { redirectUrl: this.$route.fullPath },
        })
        return
      }
      if (this.isProjectsLimit) {
        commit('ui/changeVisibleModalName', VisibleModalType.Limit)
        return
      }
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
    load() {
      this.isLoaded = true
    },
    goToTemplateDetails(event: any) {
      event.preventDefault()
      event.stopPropagation()

      this.$router.push(this.templateUrl)
    },
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
    }),
    templateId(): number {
      return +this.template.id
    },
    projectId(): number {
      return +(this.$route.params.projectId || 0)
    },
    templatePreview(): FileDto | undefined {
      return this.getTemplateImageUrl(this.template, FileType.TemplatePreview)
    },
    showedCategories(): BaseNameDtoOfInteger[] {
      if (this.template.categories.length > 2)
        return this.template.categories.splice(0, 2)
      return this.template.categories
    },
    templateUrl(): string {
      const { projectId } = this.$route.params
      let templateName = ''
      if (this.template && this.template.name) {
        templateName = this.template.name.toLowerCase().replace(/ /g, '-')
      }
      let templateUrl = `/templates/${templateName}-${this.template.id}`

      if (projectId) templateUrl = `/projects/${projectId}${templateUrl}`
      return templateUrl
    },
    isShowStarter(): boolean {
      return this.template.planName == PlanCategory.Starter
    },
    isShowPro(): boolean {
      return this.template.planName == PlanCategory.Pro
    },
    isShowFree(): boolean {
      return this.template.planName === PlanCategory.Free
    },
    isProjectsLimit(): boolean {
      if (this.user.isAdmin) return false

      return (
        this.user.plan.currentProjects >= this.user.plan.features.draftProjects
      )
    },
    //TOOD: to backend this logic
    isTemplateAvailable(): boolean {
      // if (!this.user && this.planName === 'free') return true;

      // if (this.user && this.user.plan.planName === 'free' && this.planName === 'free') {
      //   return true;
      // } else if (
      //   this.user &&
      //   this.user.plan.planName === 'starter' &&
      //   (this.planName === 'free' || this.planName === 'starter')
      // ) {
      //   return true;
      // } else if (this.user && this.user.plan.planName === 'pro') {
      //   return true;
      // } else {
      //   return false;
      // }
      return true
    },
    dominantColor(): string {
      return this.templatePreview && this.templatePreview.dominantColor
        ? this.templatePreview.dominantColor
        : 'linear-gradient(90deg, #fdfbfb 0%, #ebedee 100%)'
    },
  },
})
</script>

<style lang="scss" scoped>
.template {
  * {
    box-sizing: border-box;
  }
  &__carousel {
    max-width: 180px;
  }
  &__poster-wrapper {
    /*  position: relative;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;  */
    &:hover {
      .template__btn {
        opacity: 1;
      }
    }
    &:hover ~ .template__footer > .template__name {
      color: #173bef;
      border-bottom: 1px solid #173bef;
    }
  }
  &__poster-wrapper-img {
    position: relative;
    border-radius: 16px;
    padding-bottom: 66%;
    overflow: hidden;

    &.isLoaded {
      .template__poster {
        opacity: 1;
      }
    }
  }

  &__poster {
    border-radius: 16px;
    object-fit: cover;
    object-position: center;
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: 0.3s;
    &__carousel {
      width: 100%;
      height: 100%;
      border-radius: 5px;
      object-fit: fill;
    }
  }

  &__btn {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    gap: 16px;
    opacity: 0;
    transition: 0.3s;
    button {
      width: 80px;
      height: 80px;
      background: #ffffff;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      border-radius: 80px;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    &__icons {
      object-fit: cover;
      object-position: center;
      width: 43px;
      height: 43px;
      position: relative;
    }
  }
  &__btn-view {
    cursor: pointer;
    transition: 0.3s;
    &__plain {
      transition: 0.3s;
    }
    &__hover {
      opacity: 0;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      transition: 0.3s;
    }
    &__icons {
      object-fit: cover;
      object-position: center;
      width: 43px;
      height: 43px;
      position: relative;
    }
    &:hover {
      background-color: $black;
      .template__btn-view__hover {
        opacity: 1;
      }
      .template__btn-view__plain {
        opacity: 0;
      }
    }
  }
  &__btn-edit {
    cursor: pointer;
    transition: 0.3s;
    &__plain {
      transition: 0.3s;
    }
    &__hover {
      opacity: 0;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      transition: 0.3s;
    }
    &__icons {
      object-fit: cover;
      object-position: center;
      width: 40px;
      height: 40px;
      position: relative;
    }
    &:hover {
      background-color: $black;
      .template__btn-edit__hover {
        opacity: 1;
      }
      .template__btn-edit__plain {
        opacity: 0;
      }
    }
  }
  &__label {
    position: absolute;
    top: 10%;
    right: 8%;
    display: inline-flex;
    align-items: center;
    border-radius: $shape_border_radius;
    padding-top: 4px;
    padding-right: 8px;
    padding-bottom: 4px;
    padding-left: 8px;
    user-select: none;
    z-index: 10;

    span {
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
    }

    &_starter {
      background-color: #173bef;

      span {
        color: #fff;
      }
    }

    &_free {
      background-color: #949cad;

      span {
        color: #fff;
      }
    }

    &_pro {
      background-color: #000000;

      span {
        color: #ffc557;
      }
    }
  }
  &__category {
    margin-left: 8px;
    white-space: nowrap;
    margin-bottom: 2px;
  }
  &__categories {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    overflow: hidden;
    height: 38px;
    justify-content: flex-end;
    max-width: 70%;
    flex-grow: 1;
  }
  &__footer {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 16px;
    align-items: center;
    row-gap: 8px;
    width: 100%;
    &__carousel {
      //margin-top: 3px;
      a {
        font-size: 12px;
        line-height: normal;
      }
    }
  }

  &__name {
    font-weight: 400;
    text-decoration: none;
    outline: none;
    font-size: 16px;
    line-height: 24px;
    color: #000;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex-shrink: 10;
    border-bottom: 1px solid transparent;
    transition: 0.3s;

    &:hover {
      color: #173bef;
      border-bottom: 1px solid #173bef;
    }
  }
}
@media screen and (max-width: 1728px) {
  .template {
    &__carousel {
      max-width: 170px;
    }
  }
}
@media screen and (max-width: 1000px) {
  .template {
    &__carousel {
      max-width: 160px;
      height: 140px;
    }
  }
}
@media screen and (max-width: 768px) {
  .template__btn {
    display: none;
  }
}
</style>

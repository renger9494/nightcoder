<template>
  <aside class="navigation">
    <div class="navigation__header-1">
      <a
        class="navigation__header-1__avatarLink"
        :href="`/${user.userName}`"
        target="_blank"
      >
        <picture v-if="user.avatar">
          <source
            v-if="user.avatar.fullPathWebP"
            type="image/webp"
            :srcset="user.avatar.fullPathWebP.replace(' ', '%20')"
          />
          <source
            v-if="user.avatar.fullPathJp2"
            type="image/jp2"
            :srcset="user.avatar.fullPathJp2.replace(' ', '%20')"
          />
          <img
            class="navigation__header-1__avatar"
            v-if="user.avatar.fullPath"
            :src="user.avatar.fullPath"
          />
        </picture>
        <avatar
          v-else
          size="50"
          :name="!!user.fullName ? user.fullName : 'itmeo'"
          class="navigation__header-1__avatar"
        />
      </a>
      <div>
        <div
          class="navigation__label navigation__label_starter"
          v-if="user.plan.category == PlanCategory.Starter"
        >
          <span>Starter</span>
        </div>
        <div
          class="navigation__label navigation__label_pro"
          v-else-if="user.plan.category == PlanCategory.Pro"
        >
          <filled-star-icon />
          <span>Pro</span>
        </div>
        <div class="navigation__label navigation__label_free" v-else>
          <span>Free</span>
        </div>
        <a class="navigation__header-1__editLink" href="/settings/profile"
          >Edit profile</a
        >
      </div>
      <a
        class="navigation__header-1__btn-open"
        :href="`/${user.userName}`"
        target="_blank"
      >
        <svg-icon width="24" height="24" color="#000000" name="open-link"
      /></a>
    </div>
    <div v-if="user.isAdmin" class="navigation__header-2">Admin actions</div>
    <a
      v-if="user.isAdmin"
      class="navigation__link"
      target="_blank"
      href="https://admin.airtap.io/template/new"
    >
      <svg-icon width="16" height="16" name="plus" color="#333333" />
      <span>Create new template</span>
    </a>
    <div class="navigation__header-2">Dashboard</div>
    <div class="navigation__menu">
      <router-link
        class="navigation__link"
        :class="{
          navigation__link_active:
            activeSection === SectionType.Projects &&
            activeSectionProjects === ProjectFilterType.All,
        }"
        to="/dashboard"
      >
        <svg-icon width="16" height="16" color="#000" name="projects" />
        <span>All projects</span>
        <div
          :class="{
            navigation__count_green: !isProjectsLimit,
            navigation__count_red: isProjectsLimit,
          }"
          class="navigation__count"
        >
          {{ user.plan.currentProjects }}/{{ projectsLimit }}
        </div>
      </router-link>
      <router-link
        class="navigation__link"
        :class="{
          navigation__link_active:
            activeSection === SectionType.Projects &&
            activeSectionProjects === ProjectFilterType.Community,
        }"
        to="/dashboard/community"
      >
        <svg-icon width="16" height="16" name="community" color="#333333" />
        <span>Community</span>
      </router-link>
      <router-link
        class="navigation__link"
        :class="{
          navigation__link_active:
            activeSection === SectionType.Projects &&
            activeSectionProjects === ProjectFilterType.Custom,
        }"
        to="/dashboard/custom"
      >
        <svg-icon width="16" height="16" name="custom" color="#333333" />
        <span>Domain</span>
      </router-link>
      <router-link
        class="navigation__link"
        :class="{
          navigation__link_active:
            activeSection === SectionType.Projects &&
            activeSectionProjects === ProjectFilterType.Drafts,
        }"
        to="/dashboard/drafts"
      >
        <svg-icon width="16" height="16" name="drafts" color="#333333" />
        <span>Drafts</span>
        <div class="add-project-btn" @click="createDefaultPage">
          <svg-icon width="16" height="16" color="#000000" name="plus" />
        </div>
      </router-link>
    </div>

    <router-link
      class="navigation__link navigation__link_submission"
      :class="{
        navigation__link_active: activeSection === SectionType.Submissions,
      }"
      to="/dashboard/submissions"
    >
      <svg-icon width="16" height="16" name="submissions" color="#333333" />
      <span>Submissions</span>
      <div class="navigation__count navigation__count_grey">
        {{ user.plan.submissions }}/{{ submissionsLimit }}
      </div>
    </router-link>

    <router-link
      class="navigation__link"
      :class="{
        navigation__link_active: activeSection === SectionType.Notifications,
      }"
      to="/dashboard/notifications"
    >
      <svg-icon width="16" height="16" name="notifications" color="#333333" />
      <span>Notifications</span>
      <div  v-if="user.plan.unreadNotifications>0" class="navigation__count navigation__count_blue">
        {{ user.plan.unreadNotifications }}
      </div>
    </router-link>
    <div class="navigation__header-2">Account</div>
    <div class="navigation__menu">
      <router-link
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === SectionType.Plans,
        }"
        to="/dashboard/plans"
      >
        <svg-icon width="16" height="16" name="plan" color="#333" />
        <span>Plans and Coupons</span>
      </router-link>

      <router-link
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === SectionType.Settings,
        }"
        to="/dashboard/settings"
      >
        <svg-icon width="16" height="16" color="#333333" name="settings" />
        <span>Settings</span>
      </router-link>
      <router-link
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === SectionType.Help,
        }"
        to="/dashboard/help"
      >
        <svg-icon width="16" height="16" color="#000000" name="info-i" />
        <span>Help and support</span>
      </router-link>
    </div>

    <a
      href="/dashboard/plans"
      class="banner"
      v-if="user.plan.category != PlanCategory.Pro"
    >
      <div class="banner__info">
        <div class="banner__header">Upgrade to PRO</div>
        <div class="banner__p">Get 1 month free an annual subscription</div>
      </div>
      <svg-icon
        class="banner__icon"
        width="61"
        height="65"
        color="#000000"
        name="upgrade-to-pro"
      />
    </a>
  </aside>
</template>


<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import UserIcon from '@/assets/icons/user.svg?inline'
import SettingIcon from '@/assets/icons/setting.svg?inline'
import BellIcon from '@/assets/icons/bell.svg?inline'
import StarIcon from '@/assets/icons/star.svg?inline'
import CreditCardsIcon from '@/assets/icons/credit-cards.svg?inline'
import CouponIcon from '@/assets/icons/coupon.svg?inline'
import HelpIcon from '@/assets/icons/help.svg?inline'
import { AccountDto, PlanCategory, ProjectFilterType } from '@/utils/api'
import apiClient from '@/utils/apiClient'
import { VisibleModalType } from '~/store/ui'

enum SectionType {
  Projects = 'projects',
  Submissions = 'submissions',
  Notifications = 'notifications',
  Plans = 'plans',
  Settings = 'settings',
  Help = 'help',
}
export default Vue.extend({
  props: {
    activeSection: {
      type: String,
      required: true,
    },
    user: {
      type: Object as PropType<AccountDto>,
    },
    activeSectionProjects: {
      type: String as PropType<ProjectFilterType>,
    },
  },
  data() {
    return {
      SectionType,
      PlanCategory,
      ProjectFilterType,
    }
  },
  components: {
    UserIcon,
    SettingIcon,
    BellIcon,
    StarIcon,
    CreditCardsIcon,
    CouponIcon,
    HelpIcon,
  },
  computed: {
    ...mapState({
      popupSettings: (state: any) => state.ui.popupSettings,
    }),
    projectsLimit(): string {
      return this.user.isAdmin
        ? '∞'
        : this.user.plan.features.draftProjects.toString()
    },
    submissionsLimit(): string {
      return this.user.isAdmin
        ? '∞'
        : this.user.plan.features.submissions.toString()
    },
    isProjectsLimit(): boolean {
      if (this.user.isAdmin) return false

      return (
        this.user.plan.currentProjects >= this.user.plan.features.draftProjects
      )
    },
  },
  methods: {
    createDefaultPage(event: any) {
      event.preventDefault()
      event.stopPropagation()
      if (this.isProjectsLimit) {
        this.$emit('showLimitProjectPopup')
        return
      }
      const { dispatch } = this.$store
      if (window.innerWidth < 1200) {
        dispatch('ui/changeVisibleModalName', {
          newVisibleModalName: VisibleModalType.MobileAlert,
        })
        return
      }
      dispatch('project/createProject', { isWithBlankPage: true })
    },
  },
})
</script>

<style lang="scss" scoped>
.navigation {
  font-family: 'Poppins', sans-serif;
  padding: 20px 10px 20px 30px;
  // margin-left: -10px;
  width: 230px;
  height: calc(100vh - 60px);
  background: rgba(243, 243, 243, 0.5);
  margin-right: 50px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  position: sticky;
  top: 60px;
  min-height: 770px;
  &__header-1 {
    display: grid;
    grid-template-columns: 60px 70px auto;
    padding: 10px 10px 14px;
    &:hover {
      background: #f3f3f3;
      border-radius: 6px;
    }
    &__avatarLink {
      position: relative;
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        transition: 0.3s;
        opacity: 0;
        background: rgba($black, 0.4);
      }
      &:hover {
        &:before {
          opacity: 1;
        }
      }
    }
    &__editLink {
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      text-decoration: none;
      outline: none;
      color: #000000;
      border-bottom: 1px solid transparent;
      transition: 0.3s;
      margin-top: 5px;
      white-space: nowrap;
      &:hover {
        color: #173bef;
        border-bottom: 1px solid #173bef;
        .navigation__header-1 {
          background: #173bef;
          border-radius: 6px;
        }
      }
    }
    &__avatar {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    &__btn-open {
      margin: auto 0 auto auto;
      width: 24px;
      height: 24px;

      &:hover {
        background: #ebebeb;
        border-radius: 3px;
      }
    }
  }
  &__header-2 {
    margin-top: 30px;
    margin-bottom: 15px;
    margin-left: 10px;
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: #333333;
  }
  &__label {
    position: relative;
    display: inline-flex;
    align-items: center;
    border-radius: $shape_border_radius;
    padding-top: 4px;
    padding-right: 8px;
    padding-bottom: 4px;
    padding-left: 8px;
    user-select: none;
    height: 20px;
    span {
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
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
  &__link {
    width: 190px;
    display: flex;
    align-items: center;
    text-decoration: none;
    border-radius: $shape_border_radius;
    padding: 5px 10px;
    margin-bottom: 1px;
    transition: 0.3s;
    &_submission {
      margin-top: 24px;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: -14px;
        left: 0;
        width: 100%;
        height: 1px;
        background: #f3f3f3;
      }
    }
    &:hover {
      background: #f3f3f3;

      span {
        color: #000000;
      }

      svg {
        fill: #000000;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    &_active {
      background-color: #ebebeb;
      span {
        color: #000000;
      }

      svg {
        fill: #000000;
      }
    }

    span {
      color: $gray900;
      transition: 0.3s;
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      margin-left: 5px;
    }

    svg {
      transition: 0.3s;
      path {
        fill: #000;
      }
    }
  }
  &__count {
    box-shadow: 0px 4px 20px rgba(130, 130, 130, 0.2);
    border-radius: 4px;
    padding: 0 7px;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;

    margin-left: auto;
    &_grey {
      background: #ebebeb;
      color: #000000;
    }
    &_red {
      background: #f46363;
      color: #ffffff;
    }
    &_green {
      background: #53b71b;
      color: #ffffff;
    }
    &_red {
      background: #f46363;
      color: #ebebeb;
    }
    &_blue {
      background: #318bf5;
      color: #ebebeb;
    }
  }
  .banner {
    width: 180px;
    height: 90px;
    position: sticky;
    margin: auto 0 15px 10px;
    color: $black;
    bottom: 20px;
    top: 550px;
    &__info {
      position: absolute;
      top: 0;
      left: 0;
      width: 170px;
      height: 85px;
      background: #ffc557;
      border-radius: 4px;
      padding: 15px;
    }
    &__header {
      font-weight: 700;
      font-size: 13px;
      line-height: 20px;
    }
    &__p {
      font-weight: 400;
      font-size: 10px;
      line-height: 15px;
      margin-top: 5px;
      width: 118px;
    }
    &__icon {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
.add-project-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
}
@media screen and (max-width: 1440px) {
  .navigation {
    padding: 20px 10px;
    width: 210px;
    margin-right: 30px;
  }
}
@media screen and (max-width: 768px) {
  .navigation {
    display: none;
  }
}
</style>

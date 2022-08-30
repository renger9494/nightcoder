<template>
  <aside class="navigation">
    <div class="navigation__menu">
      <router-link
        class="navigation__link"
        :class="{ navigation__link_active: activeSection === 'profile' }"
        to="/settings/profile"
      >
        <div class="navigation__link-icon-wrapper">
          <user-icon></user-icon>
        </div>
        <span>Profile</span>
        <div class="navigation__newItem">New</div>
      </router-link>
      <router-link
        class="navigation__link"
        :class="{
          navigation__link_active: activeSection === 'accountSettings',
        }"
        to="/settings/accountSettings"
      >
        <div class="navigation__link-icon-wrapper">
          <setting-icon></setting-icon>
        </div>
        <span>Account settings</span>
      </router-link>
      <router-link
        class="navigation__link"
        :class="{ navigation__link_active: activeSection === 'notifications' }"
        to="/settings/notifications"
      >
        <div class="navigation__link-icon-wrapper">
          <bell-icon></bell-icon>
        </div>
        <span>Notifications</span>
      </router-link>
      <router-link
        class="navigation__link navigation__link_special"
        :class="{ navigation__link_active: activeSection === 'plans' }"
        to="/dashboard/plans"
      >
        <div class="navigation__link-icon-wrapper">
          <star-icon></star-icon>
        </div>
        <span>Plans</span>
      </router-link>
      <!-- router-link.navigation__link(:class="{'navigation__link_active': activeSection === 'billing'}" to="/settings/billing").navigation__link-icon-wrapper
  credit-cards-icon
span Billing-->
      <router-link
        class="navigation__link"
        :class="{ navigation__link_active: activeSection === 'coupons' }"
        to="/settings/coupons"
      >
        <div class="navigation__link-icon-wrapper">
          <coupon-icon></coupon-icon>
        </div>
        <span>Coupons & Offers</span>
      </router-link>
    </div>
    <router-link
      class="navigation__link navigation__link_help"
      :class="{ navigation__link_active: activeSection === 'help' }"
      to="/settings/help"
    >
      <div class="navigation__link-icon-wrapper">
        <help-icon></help-icon>
      </div>
      <span>Help</span>
    </router-link>
  </aside>
</template>

<style lang="scss" scoped>
.navigation {
  border-right: 1px solid #dadada;
  padding: 36px 10px;

  @include lg-down {
    border-right: none;
    border-bottom: 1px solid #dadada;
    padding: 16px 30px;
  }

  @include sm-down {
    padding: 10px;
    overflow: hidden;
  }

  &__menu {
    border-bottom: 1px solid #dadada;
    padding-bottom: 20px;
    margin-bottom: 16px;

    @include lg-down {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    @include sm-down {
      display: block;
    }
  }

  &__link {
    min-width: 190px;
    display: flex;
    align-items: center;
    text-decoration: none;
    border-radius: $shape_border_radius;
    padding: 7px 5px 7px 14px;
    margin-bottom: 1px;
    transition: 0.3s;

    @include lg-down {
      min-width: initial;
      margin-bottom: 0;
    }

    @include sm-down {
      padding-right: 10px;
      padding-left: 10px;
      margin-bottom: 7px;
    }

    &:hover {
      background-color: #f2f2f2;

      span {
        color: #000000;
      }

      svg {
        fill: #000000;
      }
    }

    &:last-child {
      margin-bottom: 0;

      @include lg-down {
        margin-right: 0;
      }
    }

    &_active {
      background-color: #f2f2f2;

      span {
        color: #000000;
      }

      svg {
        fill: #000000;
      }
    }

    &_help {
      @include lg-down {
        display: none;
      }
    }

    span {
      color: $gray900;
      transition: 0.3s;
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
    }

    svg {
      transition: 0.3s;
      path {
        fill: #000;
      }
    }
  }

  &__link-icon-wrapper {
    display: flex;
    align-items: center;
    min-width: 25px;

    @include lg-down {
      min-width: initial;
      margin-right: 9px;
    }

    @include sm-down {
      min-width: 25px;
      margin-right: 0;
    }
  }
  &__newItem {
    background: #53b71b;
    box-shadow: 0px 4px 20px rgba(130, 130, 130, 0.2);
    border-radius: 4px;
    padding: 4px 6px;
    font-weight: 500;
    font-size: 10px;
    line-height: 15px;
    color: #ffffff;
    margin-left: auto;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import UserIcon from '@/assets/icons/user.svg?inline'
import SettingIcon from '@/assets/icons/setting.svg?inline'
import BellIcon from '@/assets/icons/bell.svg?inline'
import StarIcon from '@/assets/icons/star.svg?inline'
import CreditCardsIcon from '@/assets/icons/credit-cards.svg?inline'
import CouponIcon from '@/assets/icons/coupon.svg?inline'
import HelpIcon from '@/assets/icons/help.svg?inline'

export default Vue.extend({
  props: {
    activeSection: {
      type: String,
      required: true,
    },
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
})
</script>

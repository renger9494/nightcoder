<template>
  <div class="checkout" :class="{ checkout_black: activePlanCategory == PlanCategory.Pro }">
    <div class="checkout__header">
      <h1 class="checkout__title">Upgrade to {{ activePlanCategory }} Plan</h1>
      <p class="checkout__description" v-if="activePlanCategory == PlanCategory.Starter">
        Upgrade to Airtap Starter for more benefits and customize your domain
      </p>
      <p class="checkout__description" v-else-if="activePlanCategory == PlanCategory.Pro">
        Become a Pro user to unlock all existing and upcoming templates and other features
      </p>
    </div>
    <div class="checkout__content">
      <div class="checkout__plan-info">
        <h2 class="checkout__plan-info-title">Choose the plan for you:</h2>
        <div class="checkout__plan-terms">
          <div
            class="checkout__plan-term"
            :class="{
              'checkout__plan-term_active': currentPlan == showedPlan,
            }"
            v-for="showedPlan in showedPlans"
            :key="showedPlan.id"
            @click="currentPlan = showedPlan"
          >
            <span class="checkout__plan-term-save" v-if="showedPlan.months == 12 && !showedPlan.isPlus"
              >Save 3 months</span
            >
            <span class="checkout__plan-term-duration" v-if="!showedPlan.isPlus">
              {{ showedPlan.months + (showedPlan.months > 1 ? ' months' : ' month') }}
            </span>
            <span class="checkout__plan-term-duration" v-if="showedPlan.isPlus"
              >Pro {{ showedPlan.features.publishedProjects }}</span
            >
            <span class="checkout__plan-term-monthly-price">${{ showedPlan.pricePerMonth }}</span>
            <span class="checkout__plan-term-per-month">per month</span>
            <span class="checkout__plan-term-total-price" v-if="showedPlan.months != 1">
              <strong>${{ showedPlan.months * showedPlan.pricePerMonth }}&nbsp;</strong>billed
              {{ showedPlan.months == 12 ? 'yearly' : 'half year' }}
            </span>
            <active-plan-term-corner-icon class="checkout__plan-term-corner" />
          </div>
        </div>
        <div
          class="checkout__add-coupon-wrapper"
          :class="{
            'checkout__add-coupon-wrapper_input-visible': coupon.isVisible,
            'checkout__add-coupon-wrapper_input-readonly': coupon.isApply,
          }"
        >
          <button class="checkout__add-coupon" @click="toggleIsCouponInputVisible">
            <plus-icon class="checkout__add-coupon-icon" />
            <span class="checkout__add-coupon-text checkout__add-coupon-text_add">Add coupon</span>
            <span class="checkout__add-coupon-text checkout__add-coupon-text_close">Close</span>
            <span class="checkout__add-coupon-text checkout__add-coupon-text_delete">Delete</span>
          </button>
          <div class="checkout__add-coupon-input-wrapper">
            <input
              class="checkout__add-coupon-input"
              :value="coupon.value"
              placeholder="Enter your coupon"
              :readonly="coupon.isApply"
              @keyup="changeCouponInputValue"
            />
            <div
              class="checkout__add-coupon-input-error"
              :class="{
                'checkout__add-coupon-input-error_visible': coupon.error.length & 0,
              }"
            >
              {{ coupon.error }}
            </div>
          </div>
          <button class="checkout__add-coupon-button" @click="validateCoupon">Apply</button>
        </div>
        <div class="checkout__plan-details">
          <div class="checkout__plan-details-side">
            <h2 class="checkout__plan-name">{{ activePlanCategory }}</h2>
            <img
              class="checkout__logo"
              :src="
                currentPlan.category == PlanCategory.Starter ? '/img/checkout/logo.svg' : '/img/checkout/logo_black.svg'
              "
              alt="Airtap logo"
            />
          </div>
          <div class="checkout__plan-details-side">
            <ul class="checkout__plan-features">
              <li>
                <span>{{ currentPlan.features.publishedProjects }}&nbsp;</span>Website
              </li>
              <li>
                <span>{{ currentPlan.features.projectPages }}&nbsp;</span>Pages
              </li>
              <li>
                <span>{{ currentPlan.features.draftProjects }}&nbsp;</span>Draft projects
              </li>
              <li>
                <span>{{ currentPlan.features.storage / 1000 }} GB&nbsp;</span>Storage
              </li>
              <li>{{ currentPlan.features.isCustomHosting ? '' : 'No' }} Custom Domain</li>
              <li>Amazing templates</li>
              <li>Rich Styles</li>
              <li>
                {{ currentPlan.features.isDisabledAirtapBranding ? '' : 'No' }}
                Airtap Branding
              </li>
              <li>
                <router-link :to="learnMoreLink" target="_blank">Learn more about all features</router-link>
              </li>
            </ul>
          </div>
        </div>
        <router-link
          class="checkout__more-websites"
          to="/checkout/pro-plus"
          v-if="activePlanCategory === PlanCategory.Pro && !isPlus"
        >
          <span class="checkout__more-websites-text"
            >Need more than <strong>&nbsp;{{ currentPlan.features.publishedProjects }}&nbsp;</strong>websites?
          </span>
          <span class="checkout__more-websites-link">Learn more<arrow-right-icon /> </span>
        </router-link>
      </div>
      <div class="checkout__summary checkout__summary_sm-hidden">
        <div class="checkout__summary-section">
          <h2 class="checkout__summary-title">Order Summary</h2>
        </div>
        <div class="checkout__summary-section">
          <p class="checkout__summary-plan-price">
            <span class="checkout__summary-plan-price-text">{{ isPlus ? 'Pro Plan Yearly' : currentPlan.name }}</span>
            <span class="checkout__summary-plan-price-text"> ${{ isPlus ? currentPlanTotal : monthPlanPrice }}</span>
            <span class="checkout__summary-plan-price-tooltip" v-if="currentPlan.months > 1">
              {{ `${currentPlan.pricePerMonth}$ x ${currentPlan.months} months` }}
            </span>
          </p>
          <p class="checkout__summary-saving" v-if="currentPlan.months > 1 && !currentPlan.isPlus">
            <span>Your savings</span>
            <span>-${{ monthPlanPrice - currentPlanTotal }}</span>
          </p>
          <p class="checkout__summary-saving" v-if="coupon.isApply">
            <span>Coupon {{ coupon.percent }}%</span><span>-${{ coupon.saving }}</span>
          </p>
        </div>
        <div class="checkout__summary-section">
          <div class="checkout__summary-total-price">
            <span>Total:</span><span>${{ coupon.isApply ? coupon.price : currentPlanTotal }}</span>
          </div>
        </div>
        <p class="checkout__summary-note">
          Your subscription is&nbsp;<span>billed {{ billed }}&nbsp;</span>and will automatically renew for&nbsp;<span
            >${{ currentPlanTotal }}&nbsp;</span
          >on&nbsp;<span>{{ renewDate }}.&nbsp;</span>You can cancel any time before this date.
        </p>
        <a class="checkout__summary-button" @click="openPaddleCheckout">
          <filled-star-icon class="checkout__summary-button-icon" />
          <span>P</span>
          <span>u</span>
          <span>r</span>
          <span>c</span>
          <span>h</span>
          <span>a</span>
          <span>s</span>
          <span>e</span>
        </a>
        <p class="checkout__summary-security-note">This is a secure and encrypted payment powered by Paddle</p>
        <div class="checkout__summary-payment-methods">
          <img src="/img/checkout/ssl.svg" alt="SSL Secure" />
          <img src="/img/checkout/paypal.svg" alt="PayPal" />
          <img src="/img/checkout/visa.svg" alt="Visa" />
          <img src="/img/checkout/mastercard.svg" alt="Mastercard" />
          <img src="/img/checkout/american-express.svg" alt="American Express" />
          <img src="/img/checkout/apple-pay.svg" alt="Apple Pay" />
        </div>
        <p class="checkout__summary-purchase-note">
          By purchasing you agree to&nbsp;<a href="/terms" target="_blank">Terms of Service</a>&nbsp;and&nbsp;
          <a href="/privacy-policy" target="_blank">Privacy Policy</a>
        </p>
      </div>
    </div>
    <div class="checkout__back-link-wrapper">
      <router-link class="checkout__back-link" v-if="fromRoutePath === 'pricing'" to="/pricing">
        Go to the Pricing Page
      </router-link>
      <router-link class="checkout__back-link" v-else-if="fromRoutePath === 'settings'" to="/dashboard/plans">
        Go to the Plans Page
      </router-link>
      <router-link class="checkout__back-link" v-else to="/pricing"> Go to the Pricing Page </router-link>
    </div>
    <authorization-popup v-if="visibleModalName === VisibleModalType.AuthorizationPopup" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { add, format } from 'date-fns'

import AuthorizationPopup from '@/components/AuthorizationPopup/AuthorizationPopup.vue'

import ActivePlanTermCornerIcon from '@/assets/icons/active-plan-term-corner.svg?inline'
import PlusIcon from '@/assets/icons/plus.svg?inline'
import ArrowRightIcon from '@/assets/icons/arrow_right.svg?inline'
import FilledStarIcon from '@/assets/icons/star_filled.svg?inline'

import ObjectKeys from '@/utils/types/ObjectKeys'
import { PlanCategory, PlanDto, AccountDto } from '@/utils/api'
import { VisibleModalType } from '@/store/ui'
import apiClient from '@/utils/apiClient'
import HTMLElementEvent from '@/utils/types/HTMLElementEvent'
import SocketManager, { PurchaseInfo, SocketNotificationType } from '@/utils/SocketManager'

declare const Paddle: any

const getCurrentPlanCategory = (plan: string): PlanCategory => {
  const currentPlan = plan.split('-')[0]

  return <PlanCategory>(currentPlan[0].toUpperCase() + currentPlan.substring(1))
}

async function showPaddleCheckout(this: any, planId: number, coupon?: string, closeCallback?: Function) {
  const { data: paylink } = await apiClient.plans.plansCreatePaylink(planId, coupon ? { coupon } : undefined)
  const { plan } = this.$route.params

  const socket = SocketManager.getInstance(this.$socket)
  socket.startListen<PurchaseInfo>(SocketNotificationType.Purchase, async (data: PurchaseInfo) => {
    console.log('[showPaddleCheckout purchaseInfo]:data from socket', data)
    if (!data.isSuccessed) {
      console.log('[showPaddleCheckout purchaseInfo]:Something is wrong')
      return
    }
    await this.$store.dispatch('user/getUserInfo')

    this.$router.push({
      path: '/checkout/success',
      query: {
        plan,
      },
    })
  })

  let paddleOptions = {
    override: paylink,
    successCallback: (data: any) => {},
    closeCallback: (data: any) => {
      socket.destroy()
      if (closeCallback) closeCallback()
    },
  }
  Paddle.Checkout.open(paddleOptions)
}

export default Vue.extend({
  head() {
    return {
      title: 'Checkout',
      script: [
        {
          src: 'https://cdn.paddle.com/paddle/paddle.js',
        },
      ],
    }
  },
  layout: 'checkout',
  components: {
    AuthorizationPopup,
    ActivePlanTermCornerIcon,
    PlusIcon,
    ArrowRightIcon,
    FilledStarIcon,
  },
  async asyncData({ params }) {
    const { data: plans } = await apiClient.plans.plansGet()

    const { plan } = params
    const isPlus = plan === 'pro-plus'
    const currentPlanCategory = getCurrentPlanCategory(plan)
    const currentPlan = plans.find((p) => p.category == currentPlanCategory && p.months == 12 && p.isPlus == isPlus)

    return {
      plans: plans.filter((p) => p.category != PlanCategory.Free),
      currentPlan,
    }
  },
  data() {
    return {
      VisibleModalType,
      PlanCategory,
      plans: [] as PlanDto[],
      currentPlan: {} as PlanDto,
      coupon: {
        value: '',
        error: '',
        isVisible: false,
        isApply: null as boolean | null,
        price: 0,
        saving: 0,
        percent: 0,
      },

      fromRoutePath: '',
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      isUserLoggedIn: (state: any) => <boolean>state.auth.isUserLoggedIn,
      visibleModalName: (state: any) => <VisibleModalType>state.ui.visibleModalName,
    }),
    activePlanCategory(): PlanCategory {
      const { plan } = this.$route.params
      return getCurrentPlanCategory(plan)
    },
    isPlus(): boolean {
      const { plan } = this.$route.params
      return plan === 'pro-plus'
    },
    showedPlans(): PlanDto[] {
      let showedPlans = this.plans.filter((p) => p.category == this.activePlanCategory && p.isPlus == this.isPlus)
      const sort = this.isPlus
        ? (a: PlanDto, b: PlanDto) => {
            if (a.pricePerMonth > b.pricePerMonth) return 1
            if (a.pricePerMonth < b.pricePerMonth) return -1
            return 0
          }
        : (a: PlanDto, b: PlanDto) => {
            if (a.months > b.months) return 1
            if (a.months < b.months) return -1
            return 0
          }
      return showedPlans.sort(sort)
    },
    monthPlanPrice(): number {
      const monthPlan = this.showedPlans.find((p) => p.category == this.activePlanCategory && p.months == 1)
      if (!monthPlan) return 0

      return monthPlan.pricePerMonth * this.currentPlan.months
    },
    currentPlanTotal(): number {
      return this.currentPlan.months * this.currentPlan.pricePerMonth
    },
    billed(): string {
      const billed = {
        1: 'monthly',
        6: 'half year',
        12: 'yearly',
      } as ObjectKeys<string>

      return billed[this.currentPlan.months]
    },
    renewDate(): string {
      return format(add(new Date(), { months: this.currentPlan.months }), 'MMM dd, yyyy')
    },
    learnMoreLink(): string {
      if (this.fromRoutePath === 'settings') {
        return '/dashboard/plans'
      }
      return '/pricing'
    },
  },
  created() {
    if (
      this.$route.params &&
      this.$route.params.plan !== 'starter' &&
      this.$route.params.plan !== 'pro' &&
      this.$route.params.plan !== 'pro-plus'
    ) {
      this.$router.push('/404')
    }
  },
  mounted() {
    if (process.client) Paddle.Setup({ vendor: 40246 })
  },
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      vm.fromRoutePath = from.name
    })
  },
  methods: {
    toggleIsCouponInputVisible() {
      this.coupon.isVisible = !this.coupon.isVisible

      if (!this.coupon.isVisible) {
        this.coupon.value = ''
        this.coupon.error = ''
        this.coupon.isApply = null
        this.coupon.saving = 0
        this.coupon.price = 0
        this.coupon.percent = 0
      }
    },
    changeCouponInputValue(event: HTMLElementEvent<HTMLInputElement>) {
      this.coupon.value = event.target.value
    },
    validateCoupon(event: Event) {
      if (event) event.preventDefault()

      if (this.coupon.value.trim() === '') {
        this.coupon.error = 'This field is required'
      } else {
        this.coupon.error = ''
      }

      if (this.coupon.error.length > 0) return

      apiClient.plans
        .plansApplyCoupon(this.currentPlan.paddlePlanId, this.coupon.value)
        .then(({ data }) => {
          this.coupon.isApply = true
          this.coupon.price = data.price
          this.coupon.saving = data.oldPrice - data.price
          this.coupon.percent = (this.coupon.saving / data.oldPrice) * 100
        })
        .catch((error) => {
          this.coupon.isApply = false
        })
    },
    openPaddleCheckout(event: Event) {
      if (event) event.preventDefault()

      if (this.isUserLoggedIn) {
        showPaddleCheckout.call(this, this.currentPlan.id, this.coupon.isApply ? this.coupon.value : undefined)
        return
      }

      //if user doesn't log in
      //TODO: remove subscribe in future
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'auth/changeIsUserLoggedIn' && mutation.payload) {
          showPaddleCheckout.call(this, this.currentPlan.id, this.coupon.isApply ? this.coupon.value : undefined)
        }
      })
      this.$store.dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: VisibleModalType.AuthorizationPopup,
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.checkout {
  &_black {
    .checkout__content {
      margin-bottom: 105px;

      @include lg-down {
        display: block;
        margin-bottom: 220px;
      }

      @include sm-down {
        margin-bottom: 100px;
      }
    }

    .checkout__plan-term_active {
      border-color: #000000;
    }

    .checkout__plan-term-monthly-price {
      color: #ffc557;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #000000;
    }

    .checkout__plan-term-corner {
      fill: #000000;
    }

    .checkout__plan-name {
      color: #000000;
    }

    .checkout__plan-features {
      li {
        &:hover {
          &:before {
            background-color: #f78700;
          }
        }

        &:before {
          background-color: #ffc557;
        }
      }
    }

    .checkout__plan-details {
      margin-bottom: 30px;
    }

    .checkout__summary-button {
      background-color: #000000;

      &:before {
        color: #ffc557;
        padding-left: 23px;
      }

      span {
        color: #ffc557;
      }
    }

    .checkout__summary-button-icon {
      display: block;
      width: 13px;
      fill: #ffc557;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 50px;

    @include sm-down {
      margin-bottom: 30px;
    }
  }

  &__title {
    font-size: 30px;
    font-weight: 500;
    line-height: normal;
    color: #000000;
    margin-top: 0;
    margin-bottom: 20px;

    @include sm-down {
      font-size: 20px;
    }
  }

  &__description {
    font-size: 18px;
    font-weight: 400;
    line-height: 24px;
    color: #828282;
    margin-top: 0;
    margin-bottom: 0;

    @include sm-down {
      max-width: 290px;
      margin-right: auto;
      margin-left: auto;
    }
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 260px;

    @include lg-down {
      display: block;
      margin-bottom: 220px;
    }

    @include sm-down {
      margin-bottom: 100px;
    }
  }

  &__plan-info {
    @include lg-down {
      max-width: 433px;
      margin-right: auto;
      margin-bottom: 50px;
      margin-left: auto;
    }
  }

  &__plan-info-title {
    font-size: 20px;
    font-weight: 400;
    margin-top: 0;
    margin-bottom: 30px;

    @include sm-down {
      text-align: center;
    }
  }

  &__plan-terms {
    display: flex;
    margin-bottom: 60px;

    @include sm-down {
      justify-content: center;
      margin-right: -6.5px;
      margin-bottom: 45px;
      margin-left: -6.5px;
    }
  }

  &__plan-term {
    position: relative;
    width: 128px;
    border: 1px solid #dadada;
    border-radius: 6px;
    padding-top: 30px;
    padding-right: 30px;
    padding-bottom: 39px;
    padding-left: 30px;
    margin-right: 20px;
    transition: 0.3s;
    cursor: pointer;

    @include sm-down {
      flex-basis: calc(33.333% - 13px);
      max-width: 110px;
      width: auto;
      padding-top: 24px;
      padding-right: 14px;
      padding-bottom: 24px;
      padding-left: 14px;
      margin-right: 6.5px;
      margin-left: 6.5px;
    }

    &:hover {
      box-shadow: 0 8px 15px rgba(189, 189, 189, 0.2);
    }

    &:last-child {
      margin-right: 0;
    }

    &_active {
      border-color: #4256be;
      box-shadow: 0 8px 15px rgba(189, 189, 189, 0.2);

      .checkout__plan-term-corner {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  &__plan-term-save {
    position: absolute;
    top: 14px;
    left: 30px;
    font-size: 10px;
    font-weight: 900;
    color: #28ce4f;

    @include sm-down {
      top: 9px;
      left: 14px;
    }

    @include xs-down {
      font-size: 9px;
    }
  }

  &__plan-term-duration {
    display: block;
    font-size: 12px;
    font-weight: 400;
    line-height: normal;
    color: #000000;
    margin-bottom: 7px;
  }

  &__plan-term-monthly-price {
    display: block;
    font-size: 36px;
    font-weight: 900;
    line-height: normal;
    color: #4256be;
    margin-bottom: 3px;

    @include sm-down {
      font-size: 30px;
    }
  }

  &__plan-term-per-month {
    font-size: 10px;
    font-weight: 400;
    line-height: normal;
    color: #555555;
  }

  &__plan-term-total-price {
    position: absolute;
    right: 0;
    bottom: -14px;
    left: 0;
    font-size: 10px;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    color: #333333;
    transform: translateY(100%);
    pointer-events: none;

    @include sm-down {
      font-size: 9px;
    }

    strong {
      font-weight: 500;
    }
  }

  &__plan-term-corner {
    position: absolute;
    top: -1px;
    right: -1px;
    width: 8px;
    height: 8px;
    fill: #4256be;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
  }

  &__add-coupon-wrapper {
    display: flex;
    align-items: center;
    padding-bottom: 40px;
    border-bottom: 1px solid #dadada;
    margin-bottom: 40px;

    @include sm-down {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 25px;
    }

    &_input-visible {
      .checkout__add-coupon-text {
        &_add {
          position: absolute;
          opacity: 0;
          visibility: hidden;
          transition: 0s;
        }

        &_close {
          position: static;
          opacity: 1;
          visibility: visible;
          transition: 0.3s;
        }
      }

      .checkout__add-coupon-icon {
        transform: rotate(45deg);
      }

      .checkout__add-coupon-input {
        opacity: 1;
        visibility: visible;
        transition: 0.3s;
      }

      .checkout__add-coupon-button {
        opacity: 1;
        visibility: visible;
        transition: 0.3s;
      }
    }

    &_input-readonly {
      .checkout__add-coupon-text {
        &_close {
          position: absolute;
          opacity: 0;
          visibility: hidden;
          transition: 0s;
        }

        &_delete {
          position: static;
          opacity: 1;
          visibility: visible;
          transition: 0.3s;
        }
      }

      .checkout__add-coupon-input {
        color: #ffffff;
        background-color: #000000;
        border-color: #000000;

        &:hover {
          border-color: #000000;
        }

        &:active {
          border-color: #000000;
        }
      }

      .checkout__add-coupon-button {
        opacity: 0;
        visibility: hidden;
      }
    }
  }

  &__add-coupon {
    display: flex;
    align-items: center;
    margin-right: 67px;
    cursor: pointer;
    transition: 0.3s;

    @include sm-down {
      margin-right: 7px;
    }

    &:hover {
      .checkout__add-coupon-icon {
        fill: #000000;
      }

      .checkout__add-coupon-text {
        color: #000000;
      }
    }
  }

  &__add-coupon-icon {
    width: 8px;
    fill: #333333;
    margin-right: 5px;
    transition: 0.3s;
  }

  &__add-coupon-text {
    font-size: 13px;
    font-weight: 500;
    line-height: normal;
    white-space: nowrap;
    color: #333333;
    transition: 0.3s;

    &_close {
      position: absolute;
      opacity: 0;
      visibility: hidden;
      transition: 0s;
    }

    &_delete {
      position: absolute;
      opacity: 0;
      visibility: hidden;
      transition: 0s;
    }
  }

  &__add-coupon-input-wrapper {
    flex-grow: 1;
    position: relative;
    margin-right: 14px;
  }

  &__add-coupon-input {
    width: 100%;
    font-size: 12px;
    font-weight: 400;
    line-height: normal;
    color: #000000;
    background: #ffffff;
    border: 1px solid #dadada;
    border-radius: $shape_border_radius;
    padding-top: 6px;
    padding-right: 11px;
    padding-bottom: 5px;
    padding-left: 11px;
    opacity: 0;
    visibility: hidden;
    -webkit-appearance: none;

    &::placeholder {
      color: #dadada;
    }

    &:hover {
      border-color: #c4c4c4;
    }

    &:active,
    &:focus {
      border-color: #555555;
    }
  }

  &__add-coupon-input-error {
    position: absolute;
    bottom: -4px;
    font-size: 11px;
    font-weight: 400;
    line-height: normal;
    color: #f26b60;
    transform: translateY(100%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;

    &_visible {
      opacity: 1;
      visibility: visible;
    }
  }

  &__add-coupon-button {
    font-size: 12px;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    color: #ffffff;
    background-color: #333333;
    border-radius: $shape_border_radius;
    padding-top: 5px;
    padding-right: 16px;
    padding-bottom: 6px;
    padding-left: 16px;
    cursor: pointer;
    outline: none;
    opacity: 0;
    visibility: hidden;

    &:hover {
      background-color: #000000;
    }
  }

  &__plan-details {
    display: flex;
  }

  &__plan-name {
    width: 161px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.19em;
    line-height: normal;
    text-align: center;
    text-transform: uppercase;
    color: #000000;
    margin-top: 0;
    margin-bottom: 70px;

    @include sm-down {
      width: 91px;
    }
  }

  &__logo {
    display: block;
    width: 63px;
    margin-right: auto;
    margin-left: auto;

    @include sm-down {
      width: 60px;
    }
  }

  &__plan-features {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    list-style-type: none;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;

    li {
      position: relative;
      font-size: 14px;
      line-height: normal;
      font-weight: 400;
      color: #000000;
      padding-left: 14px;
      margin-bottom: 15px;

      @include sm-down {
        font-size: 13px;
      }

      &:hover {
        &:before {
          background-color: #4256be;
        }
      }

      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 4px;
        height: 4px;
        background-color: #adbbff;
        border-radius: 50%;
        transform: translateY(-50%);
        transition: 0.3s;
      }

      span {
        font-weight: 500;
      }

      a {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        font-weight: 500;
        line-height: normal;
        text-decoration: none;
        color: #000000;
        border-bottom: 1px dashed #949cad;
        transition: 0.3s;

        @include sm-down {
          font-size: 13px;
        }

        &:hover {
          border-bottom-color: #000000;
        }
      }
    }
  }

  &__more-websites {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    background-color: #ffffff;
    border-radius: $shape_border_radius;
    box-shadow: 0 4px 14px rgba(198, 198, 198, 0.25);
    padding-top: 21px;
    padding-right: 20px;
    padding-bottom: 22px;
    padding-left: 20px;
    transition: 0.3s;

    &:hover {
      box-shadow: 0 8px 14px rgba(198, 198, 198, 0.45);

      .checkout__more-websites-link {
        svg {
          transform: translateX(2.5px);
        }
      }
    }

    @include sm-down {
      padding-right: 5px;
      padding-left: 5px;
    }
  }

  &__more-websites-text {
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    color: #000000;

    @include sm-down {
      font-size: 12px;
    }

    strong {
      font-weight: 500;
    }
  }

  &__more-websites-link {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    color: #000000;

    @include sm-down {
      font-size: 12px;
    }

    svg {
      width: 12px;
      fill: #000000;
      margin-left: 7px;
      transition: 0.3s;
    }
  }

  &__summary {
    position: relative;
    max-width: 465px;
    border: 1px solid #dadada;
    border-radius: 6px;
    padding-top: 30px;
    padding-right: 32px;
    padding-bottom: 22px;
    padding-left: 32px;
    margin-top: 54px;

    @include lg-down {
      margin-right: auto;
      margin-left: auto;
    }

    @include sm-down {
      padding-top: 30px;
      padding-right: 20px;
      padding-bottom: 20px;
      padding-left: 20px;
      margin-bottom: 70px;
    }

    &_sm-hidden {
      @include sm-down {
        display: none;
      }
    }

    &_sm-visible {
      display: none;

      @include sm-down {
        display: block;
      }
    }
  }

  &__summary-section {
    border-bottom: 1px solid #dadada;
    padding-bottom: 30px;
    margin-bottom: 30px;
  }

  &__summary-title {
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    color: #000000;
    margin-top: 0;
    margin-bottom: 0;
  }

  &__summary-plan-price {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  &__summary-plan-price-text {
    font-size: 16px;
    font-weight: 400;
    line-height: normal;
    color: #000000;

    &:nth-of-type(2) {
      &:hover {
        ~ .checkout__summary-plan-price-tooltip {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }

  &__summary-plan-price-tooltip {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
    font-size: 12px;
    font-weight: 400;
    line-height: normal;
    color: #ffffff;
    background-color: #000000;
    border-radius: $shape_border_radius;
    padding-top: 3px;
    padding-right: 12px;
    padding-bottom: 2px;
    padding-left: 12px;
    transform: translate(100%, -100%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;

    @include xl-down {
      right: -32px;
      transform: translateY(-150%);
    }
  }

  &__summary-saving {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      font-size: 16px;
      font-weight: 400;
      line-height: normal;
      color: #28ce4f;
    }
  }

  &__summary-total-price {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      line-height: normal;

      &:first-of-type {
        font-size: 16px;
        font-weight: 400;
      }

      &:last-of-type {
        font-size: 24px;
        font-weight: 500;
        color: #000000;
      }
    }
  }

  &__summary-note {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #828282;
    margin-top: 0;
    margin-bottom: 30px;

    span {
      font-weight: 400;
      color: #333333;
    }
  }

  &__summary-button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 310px;
    width: 100%;
    text-decoration: none;
    background-color: #4256be;
    border-radius: $shape_border_radius;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    margin-right: auto;
    margin-bottom: 30px;
    margin-left: auto;
    overflow: hidden;

    &:before {
      content: 'Purchase';
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 13px;
      font-weight: 500;
      line-height: normal;
      text-align: center;
      white-space: nowrap;
      color: #ffffff;
      padding-top: 10px;
      padding-bottom: 10px;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }

    &:hover {
      &:before {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }

      span {
        opacity: 1;
        transform: translate3d(0, 0, 0);

        &:nth-child(1) {
          transition-delay: 0.045s;
        }

        &:nth-child(2) {
          transition-delay: 0.09s;
        }

        &:nth-child(3) {
          transition-delay: 0.135s;
        }

        &:nth-child(4) {
          transition-delay: 0.18s;
        }

        &:nth-child(5) {
          transition-delay: 0.225s;
        }

        &:nth-child(6) {
          transition-delay: 0.27s;
        }

        &:nth-child(7) {
          transition-delay: 0.315s;
        }

        &:nth-child(8) {
          transition-delay: 0.36s;
        }

        &:nth-child(9) {
          transition-delay: 0.405s;
        }

        &:nth-child(10) {
          transition-delay: 0.45s;
        }
      }
    }

    span {
      font-size: 13px;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      transform: translate3d(0, -10px, 0);
      opacity: 0;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }
  }

  &__summary-button-icon {
    display: none;
    margin-right: 10px;
  }

  &__summary-security-note {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #828282;
    margin-top: 0;
    margin-bottom: 20px;

    @include sm-down {
      max-width: 240px;
      margin-right: auto;
      margin-left: auto;
    }
  }

  &__summary-payment-methods {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52px;

    @include sm-down {
      height: 34px;
    }

    img {
      @include sm-down {
        width: 13%;
      }
    }
  }

  &__summary-purchase-note {
    position: absolute;
    right: 0;
    bottom: -8px;
    left: 0;
    font-size: 10px;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    color: #828282;
    transform: translateY(100%);

    @include sm-down {
      left: 50%;
      width: 225px;
      transform: translate(-50%, 100%);
    }

    a {
      font-weight: 400;
      text-decoration: none;
      color: #333333;
      transition: 0.3s;

      &:hover {
        color: #000000;
      }
    }
  }

  &__back-link-wrapper {
    text-align: center;
  }

  &__back-link {
    font-size: 12px;
    font-weight: 400;
    line-height: normal;
    text-decoration: none;
    color: #828282;
    transition: 0.3s;

    &:hover {
      color: #333333;
    }

    &:active {
      color: #000000;
    }
  }
}
</style>

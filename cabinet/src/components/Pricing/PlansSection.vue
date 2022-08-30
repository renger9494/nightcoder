<template>
  <div
    class="plans-section"
    :class="{ 'plans-section--dashboard': isDashboard }"
  >
    <div class="plans-section__header">
      <div class="plans-section__title-wrapper" v-if="!isDashboard">
        <h1 class="plans-section__title">Pricing Plans</h1>
        <span class="plans-section__note">Beta price</span>
        <span class="plans-section__text">A plan for everyone</span>
      </div>
      <div class="plans-section__toggle" :class="{ month: activeTermName }">
        <img src="~/assets/img/pricing/save_plan.png" alt="airtap" />
        <pricing-switch
          :items-list="termsList"
          @onChange="handleTermNameClick"
        />
      </div>
    </div>
    <div class="plans-section__plans-list">
      <div class="plans-section__plan plans-section__plan_free">
        <img src="~/assets/img/pricing/free_img.png" alt="airtap" />
        <h2 class="plans-section__plan-name">Free</h2>
        <span class="plans-section__plan-price">
          ${{
            activeTermName === TermNameType.Annually
              ? annualPrices.free
              : monthlyPrices.free
          }}
        </span>
        <span class="plans-section__plan-duration">free forever</span>
        <p class="plans-section__plan-text">
          Start with basic features &amp; create your own site in minutes
        </p>
        <component
          class="plans-section__button"
          :is="activePlan === PlanCategory.Free ? 'a' : 'nuxt-link'"
          :href="activePlan === PlanCategory.Free ? '#' : null"
          :to="activePlan === PlanCategory.Free ? null : '/sign-up'"
          :data-text="activePlan !== PlanCategory.Free ? 'Try free now' : ''"
          @click.prevent="activePlan === PlanCategory.Free ? () => {} : null"
        >
          <template v-if="activePlan !== PlanCategory.Free">
            <span>T</span>
            <span>r</span>
            <span>y&nbsp;</span>
            <span>f</span>
            <span>r</span>
            <span>e</span>
            <span>e&nbsp;</span>
            <span>n</span>
            <span>o</span>
            <span>w</span>
          </template>
          <template v-if="activePlan === PlanCategory.Free">
            <p>Your current plan</p>
            <svg-icon
              color="#fff"
              width="20"
              height="20"
              name="success"
            />
          </template>
        </component>
        <ul class="plans-section__plan-features">
          <li class="plans-section__plan-features-item">
            <span>3 Projects</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Airtap domain</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Free templates</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Basic SEO</span>
          </li>
        </ul>
      </div>
      <div class="plans-section__plan plans-section__plan_starter">
        <img src="~/assets/img/pricing/starter_plan.png" alt="airtap" />
        <h2 class="plans-section__plan-name">Starter</h2>
        <span class="plans-section__plan-price">
          ${{
            activeTermName === TermNameType.Annually
              ? annualPrices.starter
              : monthlyPrices.starter
          }}
        </span>
        <span class="plans-section__plan-duration">per month</span>
        <p class="plans-section__plan-text">
          Start with basic features &amp; create your own site in minutes
        </p>
        <component
          class="plans-section__button"
          :is="activePlan === PlanCategory.Starter ? 'a' : 'nuxt-link'"
          :to="activePlan === PlanCategory.Starter ? null : '/checkout/starter'"
          :href="activePlan === PlanCategory.Starter ? '#' : null"
          :data-text="activePlan !== PlanCategory.Starter ? 'Purchase' : ''"
          @click.prevent="
            activePlan === PlanCategory.Starter ? openModal() : null
          "
        >
          <template v-if="activePlan !== PlanCategory.Starter">
            <span>P</span>
            <span>u</span>
            <span>r</span>
            <span>c</span>
            <span>h</span>
            <span>a</span>
            <span>s</span>
            <span>e</span>
          </template>
          <template v-if="activePlan === PlanCategory.Starter">
            <p>Your current plan</p>
            <svg-icon
              color="#fff"
              width="20"
              height="20"
              name="success"
            />
          </template>
        </component>
        <ul class="plans-section__plan-features">
          <li class="plans-section__plan-features-item">
            <span>Unlimited projects</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Connect 1 custom domain</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Starter templates</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Advanced SEO</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Basic integrations</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Form Submission - 100/month</span>
          </li>
          <li
            class="
              plans-section__plan-features-item
              plans-section__plan-features-item_with-tooltip
            "
            v-if="activeTermName === TermNameType.Monthly"
          >
            <span>Airtap Branding</span>
            <p class="plans-section__tooltip">
              Airtap branding is absent only when purchasing an annual tariff
            </p>
          </li>
          <li
            class="
              plans-section__plan-features-item
              plans-section__plan-features-item_with-tooltip
            "
            v-if="activeTermName === TermNameType.Annually"
          >
            <span>No Airtap Branding</span>
            <p class="plans-section__tooltip">
              Airtap branding is absent only when purchasing an annual tariff
            </p>
          </li>
        </ul>
      </div>
      <div class="plans-section__plan plans-section__plan_pro">
        <img src="~/assets/img/pricing/pro_plan.png" alt="airtap" />
        <h2 class="plans-section__plan-name">Pro</h2>
        <span class="plans-section__plan-price"
          >${{
            activeTermName === TermNameType.Annually
              ? annualPrices.pro
              : monthlyPrices.pro
          }}</span
        ><span class="plans-section__plan-duration">per month</span>
        <p class="plans-section__plan-text">
          Start with basic features &amp; create your own site in minutes
        </p>
        <component
          :is="activePlan === PlanCategory.Pro ? 'a' : 'nuxt-link'"
          class="plans-section__button"
          @click.prevent="activePlan === PlanCategory.Pro ? openModal() : null"
          :href="activePlan === PlanCategory.Pro ? '#' : null"
          :to="activePlan === PlanCategory.Pro ? null : '/checkout/pro'"
          :data-text="activePlan !== PlanCategory.Pro ? 'Upgrade to PRO' : ''"
        >
          <template v-if="activePlan !== PlanCategory.Pro">
            <filled-star-icon />
            <span>U</span>
            <span>p</span>
            <span>g</span>
            <span>r</span>
            <span>a</span>
            <span>d</span>
            <span>e&nbsp;</span>
            <span>t</span>
            <span>o&nbsp;</span>
            <span>P</span>
            <span>R</span>
            <span>O</span>
          </template>
          <template v-if="activePlan === PlanCategory.Pro">
            <p>Your current plan</p>
            <svg-icon
              color="#fff"
              width="20"
              height="20"
              name="success"
            />
          </template>
        </component>
        <ul class="plans-section__plan-features">
          <li class="plans-section__plan-features-item">
            <span>Unlimited projects</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Connect 5 custom domain</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>All templates</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Advanced SEO</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Custom integrations</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Form Submission - 1000/month</span>
          </li>
          <li
            class="
              plans-section__plan-features-item
              plans-section__plan-features-item_with-tooltip
            "
            v-if="activeTermName === TermNameType.Monthly"
          >
            <span>Airtap Branding</span>
            <p class="plans-section__tooltip">
              Airtap branding is absent only when purchasing an annual tariff
            </p>
          </li>
          <li
            class="
              plans-section__plan-features-item
              plans-section__plan-features-item_with-tooltip
            "
            v-if="activeTermName === TermNameType.Annually"
          >
            <span>No Airtap Branding</span>
            <p class="plans-section__tooltip">
              Airtap branding is absent only when purchasing an annual tariff
            </p>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Pro badge on profile</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Online support</span>
          </li>
        </ul>
      </div>
    </div>
    <button
      class="plans-section__toggle-features-list-button"
      v-if="isAllFeaturesListOpen === false"
      @click="handleToggleFeaturesListButtonClick"
    >
      <svg-icon
        width="16"
        height="16"
        color="#000000"
        name="dropdown_arrow"
      />
      Show All Features
    </button>
    <button
      class="
        plans-section__toggle-features-list-button
        plans-section__toggle-features-list-button_close
      "
      v-if="isAllFeaturesListOpen === true"
      @click="handleToggleFeaturesListButtonClick"
    >
      <svg-icon
        width="16"
        height="16"
        color="#000000"
        name="dropdown_arrow"
        style="transform: rotate(180deg)"
      />
      Close All Features
    </button>
    <features-table v-if="isAllFeaturesListOpen === true" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import FeaturesTable from '@/components/Pricing/FeaturesTable.vue'

import FilledStarIcon from '@/assets/icons/star_filled.svg?inline'
import ShortArrowIcon from '@/assets/icons/arrow_short.svg?inline'
import PricingSwitch from '~/components/Pricing/PricingSwitch.vue'
import SvgIcon from '~/components/Shared/SvgIcon.vue'
import Template from '~/components/Templates/TemplatesList/Template.vue'
import { PlanCategory } from '~/utils/api'

enum TermNameType {
  Annually = 0,
  Monthly,
}

export default Vue.extend({
  components: {
    Template,
    SvgIcon,
    PricingSwitch,
    FeaturesTable,
    FilledStarIcon,
    ShortArrowIcon,
  },
  props: {
    isDashboard: {
      type: Boolean,
      default: () => false,
    },
    activePlan: {
      type: String as PropType<PlanCategory>,
      default: () => '',
    },
    openModal: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      PlanCategory,
      TermNameType,
      termsList: [
        { text: 'Pay annually', term: TermNameType.Annually },
        { text: 'Pay monthly', term: TermNameType.Monthly },
      ],
      monthlyPrices: {
        free: 0,
        starter: 10,
        pro: 15,
      },
      annualPrices: {
        free: 0,
        starter: 8,
        pro: 12,
      },
      activeTermName: TermNameType.Annually,
      isAllFeaturesListOpen: false,
    }
  },
  methods: {
    handleTermNameClick(termName: TermNameType) {
      this.activeTermName = termName
    },
    handleToggleFeaturesListButtonClick() {
      this.isAllFeaturesListOpen = !this.isAllFeaturesListOpen
    },
  },
})
</script>

<style lang="scss" scoped>
.plans-section {
  text-align: center;
  padding-top: 35px;
  padding-bottom: 45px;
  margin-bottom: 40px;

  &--dashboard {
    display: inline-block;
    max-width: 1240px;
    width: 100%;
    padding-top: unset;
    .plans-section__header {
      margin: 0 0 23px;
    }
    .plans-section__toggle,
    .features-table {
      margin: unset;
    }
    .plans-section__toggle.month img {
      display: none;
    }
    .plans-section__plans-list {
      max-width: unset;
      margin: 0 0 50px;
    }
    .plans-section__plan {
      max-width: 400px;
    }

    .features-table {
      max-width: 1240px;
    }
  }

  @include xs-down {
    padding-top: 25px;
    margin-bottom: 20px;
  }

  &__header {
    margin-bottom: 40px;

    @include lg-down {
      margin-bottom: 30px;
    }
  }

  &__title-wrapper {
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin-bottom: 25px;
  }

  &__title {
    font-weight: 700;
    font-size: 64px;
    line-height: 85px;
    margin: 0 0 10px;
    color: #0e0e11;

    @include xs-down {
      font-size: 30px;
      line-height: 45px;
    }
  }

  &__note {
    position: absolute;
    top: 0;
    right: -5px;
    font-weight: 500;
    font-size: 10px;
    line-height: 15px;
    color: #3896ec;
    transform: translate(100%, 0);
  }

  &__text {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin: 0 0 30px;

    @include xs-down {
      font-size: 14px;
      line-height: 21px;
    }
  }

  &__toggle {
    max-width: 228px;
    margin: 0 auto;
    position: relative;

    img {
      opacity: 0;
      max-width: 213px;
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(-100%, -50%);
      transition: 0.3s;

      @include xl-down {
        display: none;
      }
    }

    &.month {
      img {
        opacity: 1;
      }
    }
  }

  &__save {
    position: absolute;
    top: -32px;
    left: -18px;
    font-size: 10px;
    font-weight: 500;
    line-height: normal;
    color: #28ce4f;
    transform: translate(-100%, -100%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;

    &_visible {
      opacity: 1;
      visibility: visible;
    }
  }

  &__arrow {
    position: absolute;
    bottom: 3px;
    left: -6px;
    width: 48px;
    transform: rotate(-180deg) translateX(100%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;

    &_visible {
      opacity: 1;
      visibility: visible;
    }
  }

  &__term-name {
    font-size: 10px;
    font-weight: 500;
    line-height: normal;
    color: #bdbdbd;
    cursor: pointer;
    transition: 0.3s;

    &_active {
      color: #000000;
    }
  }

  &__plans-list {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    max-width: 1020px;
    margin: 0 auto 50px;

    @include xs-down {
      margin-bottom: 35px;
      flex-direction: column;
    }
  }

  &__plan {
    max-width: 328px;
    width: 100%;
    text-align: left;
    background-color: #ffffff;
    border: 1px solid #bdbdbd;
    border-radius: 6px;
    padding: 30px;
    margin-right: 20px;
    transition: 0.3s;
    position: relative;

    &:hover {
      z-index: 40;
    }

    img {
      position: absolute;
      right: 0;
      top: 10px;
      transition: 0.3s;
      opacity: 0;
    }

    @include lg-down {
      padding: 20px;
      margin-bottom: 20px;
      &:not(:last-child) {
        margin-right: 10px;
      }

      img {
        top: -35px;
      }
    }

    @include xs-down {
      max-width: 100%;
      &:not(:last-child) {
        margin-right: 0;
      }

      img {
        display: none;
      }
    }

    &:hover {
      box-shadow: 0 12px 30px rgba(130, 130, 130, 0.15);
      img {
        opacity: 1;
      }
    }

    &:last-child {
      margin-right: 0;

      @include lg-down {
        margin-right: auto;
        margin-bottom: 0;
      }
    }

    &_free {
      img {
        max-width: 228px;
      }
      .plans-section__plan-price {
        color: #949cad;
      }

      .plans-section__plan-features-item {
        &:before {
          background-color: $gray600;
        }

        &:hover {
          &:before {
            background-color: #000000;
          }
        }
      }

      .plans-section__button {
        background-color: #949cad;
        color: #ffffff;
      }
    }

    &_starter {
      background: #e8ebfd;
      border-color: transparent;
      img {
        top: -20px;
        max-width: 203px;

        @include lg-down {
          top: -63px;
        }
      }

      .plans-section__plan-price {
        color: #173bef;
      }

      .plans-section__plan-features-item {
        &:hover {
          &:before {
            background-color: #4256be;
          }
        }

        &:before {
          background-color: #173bef;
        }

        &_with-tooltip {
          &:hover {
            span {
              border-bottom-color: #000000;
            }
          }
        }
      }

      .plans-section__button {
        background-color: $white;
        color: #173bef;

        svg {
          color: #173bef !important;
        }
      }

      .plans-section__plan-features {
        border-color: #173bef;
      }

      .plans-section__tooltip {
        background: #333333;
      }
    }

    &_pro {
      background-color: #000000;
      border-color: #000000;
      padding: 30px 25px 30px 17px;

      img {
        max-width: 173px;
      }

      @include lg-down {
        padding: 20px;
      }

      .plans-section__plan-name,
      .plans-section__plan-text {
        color: #ffffff;
      }

      .plans-section__plan-price {
        color: #ffc557;
      }

      .plans-section__plan-features {
        border-top-color: #ffc557;
      }

      .plans-section__plan-features-item {
        padding-left: 22px;
        &:before {
          display: inline-block;
          transform: rotate(45deg) translateY(-50%);
          height: 12px;
          width: 5px;
          border-bottom: 1px solid #ffc557;
          border-right: 1px solid #ffc557;
          border-radius: 0;
          top: 9px;
          left: 0;
        }

        &_with-tooltip {
          &:hover {
            span {
              border-bottom-color: #ffffff;
            }
          }
        }

        span {
          color: #ffffff;
        }
      }

      .plans-section__tooltip {
        background-color: #333333;
      }

      .plans-section__button {
        background-color: #ffc557;
        color: #000000;

        &:before {
          padding-left: 23px;
        }

        svg {
          width: 13px;
          fill: #000000;
          margin-right: 10px;
          color: #000000 !important;
        }
      }
    }
  }

  &__plan-name {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }

  &__plan-price {
    display: block;
    font-weight: 700;
    font-size: 45px;
    line-height: 130%;
  }

  &__plan-duration {
    display: block;
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: $gray700;
    margin-bottom: 8px;
  }

  &__plan-text {
    max-width: 240px;
    font-size: 12px;
    font-weight: 400;
    margin-top: 0;
    margin-bottom: 15px;
  }

  &__plan-features {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    list-style-type: none;
    border-top: 1px solid #dadada;
    padding-top: 20px;
  }

  &__plan-features-item {
    position: relative;
    padding-left: 14px;
    margin-bottom: 16px;

    @include xl-down {
      width: 100%;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      transform: translateY(-50%);
      transition: 0.3s;
    }

    &_with-tooltip {
      position: relative;

      &:hover {
        .plans-section__tooltip {
          opacity: 1;
          visibility: visible;
        }
      }

      span {
        border-bottom: 1px dashed #949cad;
        padding-bottom: 2px;
        transition: 0.3s;
        cursor: help;
      }
    }

    span {
      font-size: 16px;
      line-height: 24px;
    }
  }

  &__tooltip {
    position: absolute;
    top: 0;
    right: 0;
    width: 185px;
    font-size: 12px;
    font-weight: 400;
    line-height: normal;
    color: #ffffff;
    background-color: #000000;
    border-radius: 3px;
    padding: 5px 10px;
    transform: translate(100%, -100%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;

    @include xl-down {
      right: -80px;
      transform: translateY(-100%);
    }

    @include lg-down {
      right: 0;
      transform: translate(100%, -100%);
    }

    @include xs-down {
      right: -50px;
      transform: translateY(-100%);
    }
  }

  &__button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    border-radius: $shape_border_radius;
    padding: 8px 16px;
    text-align: center;
    overflow: hidden;
    margin: 0 0 19px;

    &:before {
      content: attr(data-text);
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 0;
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

        &:nth-child(11) {
          transition-delay: 0.495s;
        }

        &:nth-child(12) {
          transition-delay: 0.54s;
        }

        &:nth-child(13) {
          transition-delay: 0.585s;
        }
      }
    }

    span,
    p {
      font-size: 13px;
      font-weight: 500;
      line-height: normal;
      text-align: center;
      transform: translate3d(0, -10px, 0);
      opacity: 0;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }

    p {
      opacity: 1;
      transform: unset;
    }
  }

  &__toggle-features-list-button {
    display: inline-flex;
    align-items: center;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    font-feature-settings: 'liga' off;
    border: 1px solid $gray200;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    transition: 0.3s;
    padding: 8px 16px;

    svg {
      margin: 0 8px 0 0;
    }

    &:hover {
      border-color: #000000;
    }

    &_close {
      margin: 0 0 30px;
    }
  }
}
</style>

<template>
  <div class="plans-section">
    <div class="plans-section__header">
      <div class="plans-section__term-switch">
        <div class="plans-section__term-switch-inner">
          <span
            class="plans-section__save"
            :class="{
              'plans-section__save_visible':
                activeTermName === TermNameType.Monthly,
            }"
          >
            Save 3 months
          </span>
          <span
            class="plans-section__term-name"
            :class="{
              'plans-section__term-name_active':
                activeTermName === TermNameType.Annually,
            }"
            @click="handleTermNameClick(TermNameType.Annually)"
          >
            Pay annually
          </span>
          <switch-component
            class="plans-section__switch"
            :isActive="activeTermName === TermNameType.Annually"
            :onClick="handleSwitchClick"
          />
          <span
            class="plans-section__term-name"
            :class="{
              'plans-section__term-name_active':
                activeTermName === TermNameType.Monthly,
            }"
            @click="handleTermNameClick(TermNameType.Monthly)"
          >
            Pay monthly
          </span>
        </div>
      </div>
    </div>
    <div class="plans-section__plans-list">
      <div
        class="plans-section__plan plans-section__plan_free"
        :class="{
          'plans-section__plan_active': activePlan === PlanCategory.Free,
        }"
      >
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
        <ul class="plans-section__plan-features">
          <li class="plans-section__plan-features-item">
            <span>1 Website</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Airtap Domain</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Free Templates</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Basic Styles</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Airtap Branding</span>
          </li>
        </ul>
        <a
          class="plans-section__button"
          v-if="activePlan === PlanCategory.Free"
          href="#"
        >
          Your current plan<check-icon />
        </a>
        <a
          class="plans-section__button"
          @click="openModal"
          v-if="activePlan !== PlanCategory.Free"
          href="#"
          data-text="Downgrade"
        >
          <span>D</span>
          <span>o</span>
          <span>w</span>
          <span>n</span>
          <span>g</span>
          <span>r</span>
          <span>a</span>
          <span>d</span>
          <span>e</span>
        </a>
        <active-plan-term-corner-icon class="plans-section__plan-corner" />
      </div>
      <div
        class="plans-section__plan plans-section__plan_starter"
        :class="{
          'plans-section__plan_active': activePlan === PlanCategory.Starter,
        }"
      >
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
        <ul class="plans-section__plan-features">
          <li class="plans-section__plan-features-item">
            <span>1 Website</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Custom Domain</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Integrations</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Amazing Templates</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Rich Styles</span>
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
        <a
          class="plans-section__button"
          v-if="activePlan === PlanCategory.Starter"
          href="#"
        >
          Your current plan<check-icon />
        </a>
        <router-link
          class="plans-section__button"
          v-if="activePlan === PlanCategory.Free"
          to="/checkout/starter"
          data-text="Upgrade"
        >
          <span>U</span>
          <span>p</span>
          <span>g</span>
          <span>r</span>
          <span>a</span>
          <span>d</span>
          <span>e</span>
        </router-link>
        <a
          class="plans-section__button"
          @click="openModal"
          v-if="activePlan === PlanCategory.Pro"
          href="#"
          data-text="Downgrade"
        >
          <span>D</span>
          <span>o</span>
          <span>w</span>
          <span>n</span>
          <span>g</span>
          <span>r</span>
          <span>a</span>
          <span>d</span>
          <span>e</span>
        </a>
        <active-plan-term-corner-icon class="plans-section__plan-corner" />
      </div>
      <div
        class="plans-section__plan plans-section__plan_pro"
        :class="{
          'plans-section__plan_active': activePlan === PlanCategory.Pro,
        }"
      >
        <h2 class="plans-section__plan-name">Pro</h2>
        <span class="plans-section__plan-price">
          ${{
            activeTermName === TermNameType.Annually
              ? annualPrices.pro
              : monthlyPrices.pro
          }}
        </span>
        <span class="plans-section__plan-duration">per month</span>
        <p class="plans-section__plan-text">
          Start with basic features &amp; create your own site in minutes
        </p>
        <ul class="plans-section__plan-features">
          <li class="plans-section__plan-features-item">
            <span>5 Websites</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Custom Domain</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>Integrations</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>+ Pro Templates</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>+ Secret Styles</span>
          </li>
          <li class="plans-section__plan-features-item">
            <span>+ Dynamic Elements</span>
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
        <a
          class="plans-section__button"
          v-if="activePlan === PlanCategory.Pro"
          href="#"
        >
          Your current plan<check-icon />
        </a>
        <router-link
          class="plans-section__button"
          v-if="activePlan !== PlanCategory.Pro"
          to="/dashboard/plans"
          data-text="Upgrade to PRO"
        >
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
        </router-link>
        <active-plan-term-corner-icon class="plans-section__plan-corner" />
      </div>
    </div>
    <button
      class="plans-section__toggle-features-list-button"
      v-if="!isAllFeaturesListOpen"
      @click="handleToggleFeaturesListButtonClick"
    >
      Show All Features
    </button>
    <button
      class="plans-section__toggle-features-list-button"
      v-if="isAllFeaturesListOpen"
      @click="handleToggleFeaturesListButtonClick"
    >
      Close All Features
    </button>
    <features-table v-if="isAllFeaturesListOpen" />
  </div>
</template>

<script lang="ts">
//copy paste src/components/Pricing/PlansSection.vue
import Vue, { PropType } from 'vue'
import FeaturesTable from '@/components/Dashboard/Plans/FeaturesTable.vue'
import SwitchComponent from '@/components/Dashboard/Plans/Switch.vue'

import FilledStarIcon from '@/assets/icons/star_filled.svg?inline'
import ShortArrowIcon from '@/assets/icons/arrow_short.svg?inline'
import ActivePlanTermCornerIcon from '@/assets/icons/active-plan-term-corner.svg?inline'
import CheckIcon from '@/assets/icons/check.svg?inline'
import { PlanCategory } from '@/utils/api'

enum TermNameType {
  Annually = 0,
  Monthly,
}

export default Vue.extend({
  props: {
    activePlan: String as PropType<PlanCategory>,
    openModal: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      TermNameType,
      PlanCategory,
      monthlyPrices: {
        free: 0,
        starter: 12,
        pro: 24,
      },
      annualPrices: {
        free: 0,
        starter: 8,
        pro: 16,
      },
      activeTermName: TermNameType.Annually,
      isAllFeaturesListOpen: false,
    }
  },
  methods: {
    handleTermNameClick(termName: TermNameType) {
      this.activeTermName = termName
    },
    handleSwitchClick() {
      if (this.activeTermName === TermNameType.Annually) {
        this.activeTermName = TermNameType.Monthly
      } else if (this.activeTermName === TermNameType.Monthly) {
        this.activeTermName = TermNameType.Annually
      }
    },
    handleToggleFeaturesListButtonClick() {
      this.isAllFeaturesListOpen = !this.isAllFeaturesListOpen
    },
  },
  components: {
    FeaturesTable,
    SwitchComponent,
    FilledStarIcon,
    ShortArrowIcon,
    ActivePlanTermCornerIcon,
    CheckIcon,
  },
})
</script>

<style lang="scss" scoped>
.plans-section {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  margin-bottom: 30px;

  &__header {
    margin-bottom: 20px;
  }

  &__term-switch {
    @include lg-down {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &__term-switch-inner {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__save {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 10px;
    font-weight: 500;
    line-height: normal;
    color: #28ce4f;
    transform: translate(-50%, -100%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;

    @include lg-down {
      transform: translate(-100%, -100%);
    }

    @include xs-down {
      transform: translate(-75%, -100%);
    }

    &_visible {
      opacity: 1;
      visibility: visible;
    }
  }

  &__term-name {
    font-size: 13px;
    font-weight: 500;
    line-height: normal;
    color: #bdbdbd;
    cursor: pointer;
    transition: 0.3s;

    &_active {
      color: #000000;
    }
  }

  &__switch {
    margin-left: 8px;
    margin-right: 15px;
  }

  &__plans-list {
    max-width: 876px;
    display: flex;
    align-items: flex-start;
    margin-bottom: 40px;

    @include xl-down {
      max-width: 706px;
    }

    @include lg-down {
      max-width: initial;
      display: block;
      margin-right: 0;
      margin-left: 0;
    }

    @include xs-down {
      margin-right: -11px;
      margin-left: -11px;
    }
  }

  &__plan {
    flex-grow: 1;
    position: relative;
    text-align: left;
    background-color: #ffffff;
    border: 1px solid #dadada;
    border-radius: 6px;
    padding: 16px;
    margin-right: 16px;
    transition: 0.3s;

    @include xl-down {
      padding-top: 20px;
      padding-right: 15px;
      padding-bottom: 20px;
      padding-left: 15px;
      margin-right: 15px;
    }

    @include lg-down {
      width: 272px;
      padding-top: 30px;
      padding-right: 30px;
      padding-bottom: 30px;
      padding-left: 30px;
      margin-right: auto;
      margin-bottom: 20px;
      margin-left: auto;
    }

    @include xs-down {
      margin-right: auto;
      margin-left: auto;
    }

    &:hover {
      box-shadow: 0 12px 30px rgba(130, 130, 130, 0.15);
    }

    &:last-child {
      margin-right: 0;

      @include lg-down {
        margin-right: auto;
        margin-bottom: 0;
      }
    }

    &_free {
      &.plans-section__plan_active {
        border-color: #949cad;
      }

      .plans-section__plan-price {
        color: #949cad;
      }

      .plans-section__plan-features-item {
        &:before {
          background-color: #949cad;
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

      .plans-section__plan-corner {
        fill: #949cad;
      }
    }

    &_starter {
      &.plans-section__plan_active {
        border-color: #4256be;
      }

      .plans-section__plan-price {
        color: #4256be;
      }

      .plans-section__plan-features-item {
        &:hover {
          &:before {
            background-color: #4256be;
          }
        }

        &:before {
          background-color: #adbbff;
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
        background-color: #4256be;
        color: #ffffff;
      }

      .plans-section__plan-corner {
        fill: #4256be;
      }
    }

    &_pro {
      background-color: #000000;
      border-color: #000000;

      &.plans-section__plan_active {
        border-color: #ffc557;
      }

      .plans-section__plan-name {
        color: #ffffff;
      }

      .plans-section__plan-price {
        color: #ffc557;
      }

      .plans-section__plan-text {
        color: #ffffff;
      }

      .plans-section__plan-features {
        border-top-color: #ffc557;
      }

      .plans-section__plan-features-item {
        &:hover {
          &:before {
            background-color: #f78700;
          }
        }

        &:before {
          background-color: #ffc557;
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
        }
      }

      .plans-section__plan-corner {
        fill: #ffc557;
      }
    }

    &_active {
      box-shadow: 0 12px 30px rgba(130, 130, 130, 0.15);

      svg {
        width: 8px;
        fill: #ffffff;
        margin-left: 7px;
      }

      .plans-section__plan-corner {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  &__plan-name {
    font-size: 16px;
    font-weight: 400;
    line-height: normal;
    margin-top: 0;
    //margin-bottom: 8px;
  }

  &__plan-price {
    display: block;
    font-size: 45px;
    font-weight: 500;
    line-height: normal;
    // margin-bottom: 4px;
  }

  &__plan-duration {
    display: block;
    font-size: 10px;
    font-weight: 400;
    line-height: normal;
    color: #555555;
    margin-bottom: 8px;
  }

  &__plan-text {
    max-width: 228px;
    font-size: 13px;
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
    padding-top: 16px;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 20px;
  }

  &__plan-features-item {
    position: relative;
    padding-left: 14px;
    margin-bottom: 8px;

    @include xs-down {
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
      font-size: 13px;
      font-weight: 400;
      line-height: normal;
    }
  }

  &__tooltip {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 185px;
    font-size: 12px;
    font-weight: 400;
    line-height: normal;
    color: #ffffff;
    background-color: #000000;
    border-radius: 3px;
    padding-top: 5px;
    padding-right: 10px;
    padding-bottom: 5px;
    padding-left: 10px;
    transform: translate(100%, -100%);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;

    @include xl-down {
      right: -85px;
      transform: translateY(-100%);
    }

    @include lg-down {
      right: 0;
      transform: translate(100%, -100%);
    }

    @include xs-down {
      right: -35px;
    }
  }

  &__button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    line-height: normal;
    text-align: center;
    text-decoration: none;
    border-radius: $shape_border_radius;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    overflow: hidden;

    &:before {
      content: attr(data-text);
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

        &:nth-child(11) {
          transition-delay: 0.5s;
        }

        &:nth-child(12) {
          transition-delay: 0.55s;
        }

        &:nth-child(13) {
          transition-delay: 0.6s;
        }
      }
    }

    span {
      font-size: 13px;
      font-weight: 500;
      line-height: normal;
      text-align: center;
      transform: translate3d(0, -10px, 0);
      opacity: 0;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }
  }

  &__plan-corner {
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

  &__toggle-features-list-button {
    font-family: 'Poppins', sans-serif;
    display: inline-block;
    vertical-align: top;
    font-size: 13px;
    font-weight: 500;
    line-height: normal;
    padding: 8px 16px;
    background: #ffffff;
    border: 1px solid #ebebeb;
    box-sizing: border-box;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    transition: 0.3s;
    margin-bottom: 40px;
    &:hover {
      border-color: #000000;
    }
  }
}
</style>

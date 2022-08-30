<template>
  <div class="features-table">
    <div class="features-table__wrap features-table__wrap--line">
      <div class="features-table__col"/>
      <div class="features-table__col">
        <button class="features-table__btn features-table__btn--free">Free</button>
      </div>
      <div class="features-table__col">
        <button class="features-table__btn features-table__btn--starter">Starter</button>
      </div>
      <div class="features-table__col">
        <button class="features-table__btn features-table__btn--pro">
          <svg-icon width="16" height="16" name="star" color="#FFC557" />
          Pro
        </button>
      </div>
    </div>
    <div class="features-table__title">Resources</div>
    <div class="features-table__table">
      <div
        class="features-table__table-row"
        :class="{ odd: index % 2 === 0 }"
        v-for="(row, index) in resources"
        :key="index"
      >
        <div class="features-table__col" v-for="(rowItem, rowIndex) in row" :key="rowIndex">
          <p class="features-table__text" v-html="rowItem"/>
        </div>
      </div>
    </div>
    <div class="features-table__title">Design</div>
    <div class="features-table__table">
      <div
        class="features-table__table-row"
        :class="{ odd: index % 2 === 0 }"
        v-for="(row, index) in design"
        :key="index"
      >
        <div class="features-table__col" v-for="(rowItem, rowIndex) in row" :key="rowIndex">
          <p class="features-table__text" v-html="rowItem"/>
        </div>
      </div>
    </div>
    <div class="features-table__title">SEO</div>
    <div class="features-table__table">
      <div
        class="features-table__table-row"
        :class="{ odd: index % 2 === 0 }"
        v-for="(row, index) in seo"
        :key="index"
      >
        <div class="features-table__col" v-for="(rowItem, rowIndex) in row" :key="rowIndex">
          <p class="features-table__text" v-html="rowItem"/>
        </div>
      </div>
    </div>
    <div class="features-table__title">Infrastructure</div>
    <div class="features-table__table">
      <div
        class="features-table__table-row"
        :class="{ odd: index % 2 === 0 }"
        v-for="(row, index) in infrastructure"
        :key="index"
      >
        <div class="features-table__col" v-for="(rowItem, rowIndex) in row" :key="rowIndex">
          <p class="features-table__text" v-html="rowItem"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SvgIcon from "~/components/Shared/SvgIcon.vue";

export default Vue.extend({
  name: 'features-table',
  components: {SvgIcon},
  data() {
    return {
      resources: [
        ['Projects', '<span class="medium">3</span>', '<span class="medium">Unlimited 💙</span>', '<span class="medium">Unlimited 💙</span>'],
        ['Pages', '<span class="medium">10</span>', '<span class="medium">Unlimited 💙</span>', '<span class="medium">Unlimited 💙</span>'],
        ['Storage', '<span class="medium">100 MB</span> <span class="gray">per account</span>', '<span class="medium">1 GB</span> <span class="gray">per account</span>', '<span class="medium">5 GB</span> <span class="gray">per account</span>'],
        ['Views', '<span class="medium">10k</span> <span class="gray">per project</span>', '<span class="medium">50k</span> <span class="gray">per project</span>', '<span class="medium">200k</span> <span class="gray">per project</span>'],
        ['Airtap branding', 'Airtap branding', 'No Airtap Branding\n <span class="gray small-text">(If you pay annually)</span>', 'No Airtap Branding\n <span class="gray small-text">(If you pay annually)</span>'],
        ['Badge on profile', '<span class="medium">-</span>', '<span class="medium">-</span>', '<span class="medium">Pro</span> Badge'],
      ],
      design: [
        ['Design editor', '<span class="medium">+</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Responsive layouts', '<span class="medium">+</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Google Fonts', '<span class="medium">+</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Templates', '<span class="medium">Free</span> Templates', '<span class="medium">Starter</span> Templates', '<span class="medium">Pro</span> Templates'],
        ['Blocks', '<span class="medium">Free</span> Blocks', '<span class="medium">Starter</span> Blocks', '<span class="medium">Pro</span> Blocks'],
        ['Photos', '<span class="medium">Low</span> Resolution', '<span class="medium">High</span> Resolution', '<span class="medium">High</span> Resolution'],
        ['Unsplash <span class="gray small-text">(coming soon)</span>', '<span class="medium">-</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Library of icons <span class="gray small-text">(coming soon)</span>', '<span class="medium">-</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Upload Video <span class="gray small-text">(coming soon)</span>', '<span class="medium">-</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Lazy load <span class="gray small-text">(coming soon)</span>', '<span class="medium">-</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Animations <span class="gray small-text">(coming soon)</span>', '<span class="medium">Basic</span> Animation', '<span class="medium">Basic</span> Animation', '<span class="medium">Basic</span> Animation'],
        ['Custom fonts <span class="gray small-text">(coming soon)</span>', '<span class="medium">-</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
      ],
      seo: [
        ['Seo', '<span class="medium">Basic</span> SEO', '<span class="medium">Advanced</span> SEO', '<span class="medium">Advanced</span> SEO'],
        ['Favicon', '<span class="medium">-</span>', '<span class="medium">Custom Favicon</span>', '<span class="medium">Custom Favicon</span>'],
        ['Open graph', '<span class="medium">-</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Integrations', '<span class="medium">-</span>', '<span class="medium">Basic Integrations</span>', '<span class="medium">Custom Integrations</span>'],
        ['Form submission', '<span class="medium">-</span>', '<span class="medium">100</span><span class="gray">/month</span>', '<span class="medium">1000</span><span class="gray">/month</span>'],
        ['Airtap CRM ', '<span class="medium">-</span>', '<span class="medium">100</span><span class="gray">/month</span>', '<span class="medium">1000</span><span class="gray">/month</span>'],
        ['Short Links <span class="gray small-text">(coming soon)</span>', '<span class="medium">-</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Form file upload ', '<span class="medium">-</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
      ],
      infrastructure: [
        ['Airtap hosting', '<span class="medium">+</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['SSL Certificate', '<span class="medium">+</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['CDN', '<span class="medium">+</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Auto Scaling', '<span class="medium">+</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
        ['Online support', '<span class="medium">Basic</span> Support', '<span class="medium">Basic</span> Support', '<span class="medium">Personal</span> Support'],
        ['Transfer to another account', '<span class="medium">-</span>', '<span class="medium">+</span>', '<span class="medium">+</span>'],
      ]
    }
  }
})
</script>

<style lang="scss">
.features-table {
  max-width: 1020px;
  width: 100%;
  margin: 0 auto;


  @include md-down {
    overflow-x: scroll;
  }

  &__btn {
    padding: 3px;
    max-width: 140px;
    height: 26px;
    width: 100%;
    border-radius: 4px;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    font-feature-settings: 'liga' off;
    color: $white;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      margin: 0 2px 0 0;
    }
    &--free {
      background: #949CAD;
    }
    &--starter {
      background: #4256BE;
    }
    &--pro {
      background: #000000;
      color: #FFC557;
    }
  }
  &__title {
    margin: 0 0 12px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    padding: 0 0 0 10px;
    text-align: left;
  }
  &__wrap,
  &__table-row {
    display: flex;
    align-items: center;
  }
  &__wrap {
    @include md-down {
      width: 768px;
    }
    &--line {
      padding: 30px 0 30px;
      margin: 0 0 30px;
      border-bottom: 1px solid #C4C4C4;
      background: $white;
      position: sticky;
      top: 59px;
      @include md-down {
        position: unset;
        top: unset;
      }
    }
  }
  &__table {
    @include md-down {
      width: 768px;
    }
    &:not(:last-child) {
      margin: 0 0 40px;
    }
    &-row {
      padding: 2px 10px;
      height: 36px;
      &.odd {
        background: #F3F3F3;
        border-radius: 3px;
      }
    }
  }
  &__col {
    &:nth-child(1) {
      max-width: 200px;
      width: 100%;
      text-align: left;
      margin: 0 auto 0 0;

      .features-table__text {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    &:nth-child(2) {
      max-width: 140px;
      width: 100%;
      text-align: center;
      margin: 0 auto;
    }
    &:nth-child(3) {
      max-width: 160px;
      width: 100%;
      text-align: center;
      margin: 0 auto;
    }
    &:nth-child(4) {
      max-width: 160px;
      width: 100%;
      text-align: center;
      margin: 0 auto;
    }
  }
  &__text {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    white-space: pre-wrap;

    .medium {
      font-weight: 500;
    }
    .gray {
      color: #949CAD;
    }
    .small-text {
      font-size: 10px;
      line-height: 15px;
    }
  }
}
</style>

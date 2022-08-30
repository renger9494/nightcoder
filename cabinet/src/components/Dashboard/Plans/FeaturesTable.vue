<template>
  <div class="features-table" ref="wrapper">
    <div class="features-table__inner">
      <div class="features-table__header" ref="header">
        <div class="features-table__header-side">
          <div class="features-table__plan-name features-table__plan-name_free">Free</div>
        </div>
        <div class="features-table__header-side">
          <div class="features-table__plan-name features-table__plan-name_starter">Starter</div>
        </div>
        <div class="features-table__header-side">
          <div class="features-table__plan-name features-table__plan-name_pro">
            <filled-star-icon></filled-star-icon>Pro
          </div>
        </div>
      </div>
      <div class="features-table__content" ref="content">
        <div class="features-table__content-section">
          <div class="features-table__content-section-side features-table__content-section-side_details">
            <h4 class="features-table__subtitle">Resources</h4>
            <p class="features-table__description">What opportunities gives you a tariff in design</p>
          </div>
          <div class="features-table__content-section-side features-table__content-section-side_table">
            <div class="features-table__table-group">
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>1&nbsp;</strong>website</span
                  ><span class="features-table__table-item"><strong>1&nbsp;</strong>website</span
                  ><span class="features-table__table-item"><strong>5&nbsp;</strong>websites</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>10&nbsp;</strong>pages</span
                  ><span class="features-table__table-item"><strong>50&nbsp;</strong>pages</span
                  ><span class="features-table__table-item"
                    ><strong>100&nbsp;</strong>pages&nbsp;<span>(for each)</span></span
                  >
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>3&nbsp;</strong>Draft Projects</span
                  ><span class="features-table__table-item"><strong>5&nbsp;</strong>Draft Projects</span
                  ><span class="features-table__table-item"><strong>10&nbsp;</strong>Draft Projects</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>100 MB&nbsp;</strong>Storage</span
                  ><span class="features-table__table-item"><strong>1 GB&nbsp;</strong>Storage</span
                  ><span class="features-table__table-item"><strong>5 GB&nbsp;</strong>Storage</span>
                </div>
              </div>
            </div>
            <div class="features-table__table-group">
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item">Airtap Hosting</span
                  ><span class="features-table__table-item">Airtap Hosting</span
                  ><span class="features-table__table-item">Airtap Hosting</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item">Airtap.io Domain</span
                  ><span class="features-table__table-item"><strong>Custom Domain</strong></span
                  ><span class="features-table__table-item"><strong>Custom Domain</strong></span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item">SSL Certificate Included</span
                  ><span class="features-table__table-item">SSL Certificate Included</span
                  ><span class="features-table__table-item">SSL Certificate Included</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item">CDN</span><span class="features-table__table-item">CDN</span
                  ><span class="features-table__table-item">CDN</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item">Auto Scaling</span
                  ><span class="features-table__table-item">Auto Scaling</span
                  ><span class="features-table__table-item">Auto Scaling</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item">Airtap Branding</span
                  ><span class="features-table__table-item">No Airtap Branding<small>(If you pay annually)</small></span
                  ><span class="features-table__table-item"
                    >No Airtap Branding<small>(If you pay annually)</small></span
                  >
                </div>
                <div class="features-table__table-section features-table__table-section_hidden">
                  <div class="features-table__table-item">
                    <p>Airtap branding is absent only when purchasing an annual plan.</p>
                  </div>
                  <div class="features-table__table-item">
                    <p>Airtap branding is absent only when purchasing an annual plan.</p>
                  </div>
                  <div class="features-table__table-item">
                    <p>Airtap branding is absent only when purchasing an annual plan.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="features-table__table-group">
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>Free&nbsp;</strong>Templates</span
                  ><span class="features-table__table-item"><strong>Starter&nbsp;</strong>Templates</span
                  ><span class="features-table__table-item"><strong>Pro&nbsp;</strong>Templates</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>1&nbsp;</strong>Animation Styles</span
                  ><span class="features-table__table-item"><strong>3&nbsp;</strong>Animation Styles</span
                  ><span class="features-table__table-item"><strong>All&nbsp;</strong>Animation Styles</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>3&nbsp;</strong>Font Styles</span
                  ><span class="features-table__table-item"><strong>3&nbsp;</strong>Font Styles</span
                  ><span class="features-table__table-item"><strong>All&nbsp;</strong>Font Styles</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>3&nbsp;</strong>Color Styles</span
                  ><span class="features-table__table-item"><strong>5&nbsp;</strong>Color Styles</span
                  ><span class="features-table__table-item"><strong>All&nbsp;</strong>Color Styles</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item features-table__table-item_disabled">Animated Forms</span
                  ><span class="features-table__table-item">Animated Forms</span
                  ><span class="features-table__table-item">Animated Forms</span>
                </div>
                <div class="features-table__table-section features-table__table-section_hidden">
                  <div class="features-table__table-item">
                    <p>Animated forms are made for high conversion. Available only in Starter and Pro tariffs.</p>
                  </div>
                  <div class="features-table__table-item">
                    <p>Animated forms are made for high conversion.</p>
                  </div>
                  <div class="features-table__table-item">
                    <p>Animated forms are made for high conversion.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="features-table__table-group">
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item">Basic SEO Settings</span
                  ><span class="features-table__table-item">SEO Settings</span
                  ><span class="features-table__table-item">SEO Settings</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item features-table__table-item_disabled">Custom Favicon</span
                  ><span class="features-table__table-item">Custom Favicon</span
                  ><span class="features-table__table-item">Custom Favicon</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item features-table__table-item_disabled">Share Image</span
                  ><span class="features-table__table-item">Share Image</span
                  ><span class="features-table__table-item">Share Image</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item features-table__table-item_disabled">Integrations</span
                  ><span class="features-table__table-item"><strong>Mailchimp&nbsp;</strong>Integrations</span
                  ><span class="features-table__table-item"><strong>All&nbsp;</strong>Integrations</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item features-table__table-item_disabled">Google Analytics</span
                  ><span class="features-table__table-item">Google Analytics</span
                  ><span class="features-table__table-item">Google Analytics</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item features-table__table-item_disabled">Short Links</span
                  ><span class="features-table__table-item features-table__table-item_disabled">Short Links</span
                  ><span class="features-table__table-item">Short Links</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="features-table__content-section">
          <div class="features-table__content-section-side features-table__content-section-side_details">
            <h4 class="features-table__subtitle">Coming Soon</h4>
            <p class="features-table__description">What opportunities gives you a tariff in design</p>
          </div>
          <div class="features-table__content-section-side features-table__content-section-side_table">
            <div class="features-table__table-group">
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>Basic&nbsp;</strong>Blocks</span
                  ><span class="features-table__table-item"><strong>Starter&nbsp;</strong>Blocks</span
                  ><span class="features-table__table-item"><strong>All&nbsp;</strong>Blocks</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item features-table__table-item_disabled">Premium Analytics</span
                  ><span class="features-table__table-item features-table__table-item_disabled">Premium Analytics</span
                  ><span class="features-table__table-item">Premium Analytics</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>Basic&nbsp;</strong>Integrations</span
                  ><span class="features-table__table-item"><strong>Improved&nbsp;</strong>Integrations</span
                  ><span class="features-table__table-item"><strong>Improved&nbsp;</strong>Integrations</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item"><strong>Basic&nbsp;</strong>Elements</span
                  ><span class="features-table__table-item"><strong>Starter&nbsp;</strong>Elements</span
                  ><span class="features-table__table-item"><strong>Dynamic&nbsp;</strong>Elements</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item">Text Editor</span
                  ><span class="features-table__table-item">Text Editor</span
                  ><span class="features-table__table-item">Text Editor Pro</span>
                </div>
              </div>
              <div class="features-table__table-row">
                <div class="features-table__table-section" @click="handleTableSectionClick">
                  <span class="features-table__table-item">Basic CMS</span
                  ><span class="features-table__table-item">CMS</span
                  ><span class="features-table__table-item">CMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.features-table {
  max-width: 876px;
  background-color: #f2f2f2;
  border-radius: 16px;
  padding-bottom: 20px;
  margin-top: 20px;

  @include xl-down {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  @include xs-down {
    margin-right: -20px;
    margin-left: -20px;
  }

  &__inner {
    position: relative;
    width: 816px;
    margin-right: auto;
    margin-left: auto;

    @include xl-down {
      width: 650px;
      padding-right: 25px;
      padding-left: 25px;
    }
  }

  &__header {
    z-index: 9;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 816px;
    background-color: #f2f2f2;
    border-bottom: 1px solid #c4c4c4;
    padding-top: 30px;
    padding-bottom: 25px;
    margin-bottom: 25px;

    @include xl-down {
      width: 600px;
    }

    @include lg-down {
      width: 100%;
    }
  }

  &__header-side {
    flex: 0 0 200px;
  }

  &__plan-name {
    display: block;
    width: 140px;
    font-size: 12px;
    letter-spacing: 0.19em;
    font-weight: 700;
    line-height: normal;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    color: #ffffff;
    border-radius: $shape_border_radius;
    padding-top: 6px;
    padding-bottom: 5px;

    &_free {
      background-color: #949cad;
    }

    &_starter {
      background-color: #4256be;
    }

    &_pro {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffc557;
      background-color: #000000;

      svg {
        width: 13px;
        fill: #ffc557;
        margin-right: 8px;
      }
    }
  }

  &__content-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 60px;

    @include xl-down {
      display: block;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__content-section-side {
    &_details {
      @include xl-down {
        margin-bottom: 25px;
      }
    }

    &_table {
      flex: 0 0 600px;
    }
  }

  &__subtitle {
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    text-align: left;
    margin-top: 0;
    margin-bottom: 10px;
  }

  &__description {
    max-width: 120px;
    font-size: 10px;
    font-weight: 400;
    line-height: normal;
    text-align: left;
    margin-top: 0;
    margin-bottom: 0;
  }

  &__table-group {
    margin-bottom: 60px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__table-row {
    border-radius: 3px;
    padding-top: 8px;
    padding-bottom: 7px;

    &:nth-of-type(odd) {
      background-color: #ffffff;
    }

    &_active {
      .features-table__table-section {
        &:nth-of-type(1) {
          .features-table__table-item {
            color: #0087ff;

            &_disabled {
              color: #000000;
            }
          }
        }

        &:nth-of-type(2) {
          display: flex;
        }
      }
    }
  }

  &__table-section {
    display: flex;

    &_hidden {
      display: none;
      margin-top: 15px;

      .features-table__table-item {
        cursor: initial;
      }
    }
  }

  &__table-item {
    flex: 0 0 200px;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    text-align: left;
    color: #000000;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      color: #0087ff;

      @include sm-down {
        color: #000000;
      }
    }

    &:first-child {
      padding-left: 10px;
    }

    &:last-child {
      padding-right: 10px;
    }

    &_disabled {
      opacity: 0.4;
      cursor: text;

      &:hover {
        color: #000000;
      }
    }

    p {
      max-width: 165px;
      font-size: 13px;
      line-height: 17px;
      color: #333333;
      margin-top: 0;
      margin-bottom: 0;

      &:hover {
        color: #333333;
      }
    }

    strong {
      font-weight: 500;
    }

    span {
      font-weight: 400;
      color: #828282;
    }

    small {
      display: block;
      font-size: 10px;
      font-weight: 400;
      line-height: normal;
      color: #828282;
    }
  }
}
</style>

<script lang="ts">
//copy paste src/components/Pricing/FeaturesTable.vue
import Vue from 'vue'
import stickybits from 'stickybits'

import FilledStarIcon from '@/assets/icons/star_filled.svg?inline'

export default Vue.extend({
  mounted() {
    stickybits(<Element>this.$refs.header)
    // window.addEventListener('scroll', this.handleWindowScroll);
  },
  beforeDestroy() {
    // window.removeEventListener('scroll', this.handleWindowScroll);
  },
  methods: {
    handleTableSectionClick(event: any) {
      if (event) event.preventDefault()

      const target = event.currentTarget

      if (target) {
        const tableRow = target.closest('.features-table__table-row')
        tableRow.classList.toggle('features-table__table-row_active')
      }
    },
    handleWindowScroll() {
      const wrapper: HTMLDivElement = <HTMLDivElement>this.$refs.wrapper
      const header: HTMLDivElement = <HTMLDivElement>this.$refs.header
      const content: HTMLDivElement = <HTMLDivElement>this.$refs.content

      const headerHeight = header.offsetHeight
      const contentHeight = content.offsetHeight

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const contentTopOffset = content.getBoundingClientRect().top

      if (contentTopOffset <= 0) {
        const topPosition = window.pageYOffset
        const maxTopPosition = contentTopOffset + scrollTop + contentHeight - headerHeight

        wrapper.style.cssText = 'position: static'
        header.style.cssText = `top: ${topPosition < maxTopPosition ? topPosition : maxTopPosition}px`
      } else {
        wrapper.style.cssText = ''
        header.style.cssText = ''
      }
    },
  },
  components: {
    FilledStarIcon,
  },
})
</script>

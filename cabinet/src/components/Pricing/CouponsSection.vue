<template>
  <div class="coupons-section">
    <h2 class="coupons-section__title">Coupons</h2>
    <div class="coupons-section__coupons-wrapper">
      <div class="coupons-section__coupon coupons-section__coupon_comet">
        <div
          class="coupons-section__coupon-side coupons-section__coupon-side_image"
        >
          <img
            class="coupons-section__coupon-image"
            src="@/assets/img/coupons/coupon-01-image.png"
            srcset="@/assets/img/coupons/coupon-01-image@2x.png 2x"
            alt=""
          />
          <div class="coupons-section__coupon-dot-line">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div
          class="coupons-section__coupon-side coupons-section__coupon-side_content"
        >
          <h3 class="coupons-section__coupon-name">
            Get amazing $60 off for PRO if you’re maker!
          </h3>
          <div class="coupons-section__coupon-footer">
            <span class="coupons-section__coupon-discount">$88</span>
            <a class="coupons-section__coupon-button" href="#">Save pass</a>
            <span class="coupons-section__coupon-left-count">
              Left 50 Coupons
            </span>
          </div>
        </div>
      </div>
      <div class="coupons-section__coupon coupons-section__coupon_rock-blue">
        <div
          class="coupons-section__coupon-side coupons-section__coupon-side_image"
        >
          <img
            class="coupons-section__coupon-image"
            src="@/assets/img/coupons/coupon-02-image.png"
            srcset="@/assets/img/coupons/coupon-02-image@2x.png 2x"
            alt=""
          />
          <div class="coupons-section__coupon-dot-line">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div
          class="coupons-section__coupon-side coupons-section__coupon-side_content"
        >
          <h3 class="coupons-section__coupon-name">
            Get 50% off for PRO 10 Plan! Only for users with paid plans.
          </h3>
          <div class="coupons-section__coupon-footer">
            <span class="coupons-section__coupon-discount">50%</span>
            <a class="coupons-section__coupon-button" href="#">Save pass</a>
            <span class="coupons-section__coupon-left-count">
              Left 50 Coupons
            </span>
          </div>
        </div>
      </div>
    </div>
    <p class="coupons-section__footer-text">
      How to activate coupon&nbsp;<a href="#">Learn More</a>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style lang="scss" scoped>
.coupons-section {
  max-width: 1020px;
  margin: 0 auto;
  background-color: $gray100;
  border-radius: 12px;
  padding: 80px 40px;

  @include lg-down {
    margin-bottom: 40px;
  }

  &__title {
    font-weight: 700;
    font-size: 48px;
    line-height: 64px;
    text-align: center;
    margin-bottom: 30px;
    color: #0E0E11;
  }

  &__coupons-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;

    @include lg-down {
      display: block;
    }
  }

  &__coupon {
    display: flex;
    width: 370px;
    background-color: #f2f2f2;
    border-radius: 9px;
    margin-right: 16px;

    @include lg-down {
      margin-right: auto;
      margin-bottom: 16px;
      margin-left: auto;
    }

    @include xs-down {
      width: 260px;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &_comet {
      .coupons-section__coupon-side {
        background-color: #61657e;
      }
    }

    &_rock-blue {
      .coupons-section__coupon-side {
        background-color: #9bb7cb;
      }
    }
  }

  &__coupon-side {
    position: relative;
    border-radius: 9px;
    box-shadow: $shadow_popup;

    &_image {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      padding-top: 10px;

      @include xs-down {
        width: 52px;
        height: 63px;
        padding-top: 10px;
        padding-bottom: 5px;
      }

      img {
        @include xs-down {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }

    &_content {
      flex-grow: 1;
      padding: 17px 17px 6px 22px;

      @include xs-down {
        padding-top: 10px;
        padding-bottom: 6px;
        padding-left: 15px;
      }
    }
  }

  &__coupon-dot-line {
    position: absolute;
    top: 10px;
    right: -3px;
    bottom: 10px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 68px;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #f2f2f2;

      @include xs-down {
        width: 4px;
        height: 4px;
      }
    }
  }

  &__coupon-name {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.03em;
    line-height: normal;
    color: #ffffff;
    margin-top: 0;
    margin-bottom: 18px;

    @include xs-down {
      max-width: 170px;
      font-size: 9px;
      margin-bottom: 6px;
    }
  }

  &__coupon-footer {
    @include xs-down {
      display: flex;
      align-items: center;
    }
  }

  &__coupon-discount {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.03em;
    line-height: normal;
    color: #ffffff;
    margin-right: 18px;

    @include xs-down {
      font-size: 9px;
      margin-right: 13px;
    }
  }

  &__coupon-button {
    display: inline-block;
    vertical-align: top;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-decoration: none;
    text-transform: uppercase;
    color: #ffffff;
    background-color: rgba(#000000, 0.2);
    border-radius: $shape_border_radius;
    padding-top: 6px;
    padding-right: 10px;
    padding-bottom: 6px;
    padding-left: 10px;
    margin-right: 14px;
    transition: 0.3s;

    @include xs-down {
      font-size: 8px;
      padding-top: 5px;
      padding-right: 5px;
      padding-bottom: 5px;
      padding-left: 5px;
      margin-right: 13px;
    }

    &:hover {
      background-color: rgba(#000000, 0.5);
    }
  }

  &__coupon-left-count {
    font-size: 10px;
    font-weight: 400;
    line-height: normal;
    color: rgba(#ffffff, 0.8);

    @include xs-down {
      font-size: 6px;
    }
  }

  &__footer-text {
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    color: #555555;
    margin-top: 0;
    margin-bottom: 0;

    a {
      font-weight: 700;
      font-size: 13px;
      line-height: 20px;
      text-decoration: none;
      color: #3896EC;
    }
  }
}
</style>



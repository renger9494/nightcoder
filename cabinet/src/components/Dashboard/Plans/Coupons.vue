<template>
  <div class="coupons">
    <div class="coupons__title">Coupons</div>

    <div class="coupons__coupons-wrapper">
      <div class="coupons__coupon coupons__coupon_comet">
        <div class="coupons__coupon-side coupons__coupon-side_image">
          <img
            class="coupons__coupon-image"
            src="@/assets/img/coupons/coupon-01-image.png"
            srcset="@/assets/img/coupons/coupon-01-image@2x.png 2x"
            alt=""
          />
          <div class="coupons__coupon-dot-line">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="coupons__coupon-side coupons__coupon-side_content">
          <h3 class="coupons__coupon-name">
            Get amazing $60 off for PRO if you’re maker!
          </h3>
          <div class="coupons__coupon-footer">
            <span class="coupons__coupon-discount">$88</span
            ><a class="coupons__coupon-button" href="#">Save pass</a
            ><span class="coupons__coupon-left-count">Left 50 Coupons</span>
          </div>
        </div>
      </div>
      <div class="coupons__coupon coupons__coupon_rock-blue">
        <div class="coupons__coupon-side coupons__coupon-side_image">
          <img
            class="coupons__coupon-image"
            src="@/assets/img/coupons/coupon-02-image.png"
            srcset="@/assets/img/coupons/coupon-02-image@2x.png 2x"
            alt=""
          />
          <div class="coupons__coupon-dot-line">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="coupons__coupon-side coupons__coupon-side_content">
          <h3 class="coupons__coupon-name">
            Get 50% off for PRO 10 Plan! Only for users with paid plans.
          </h3>
          <div class="coupons__coupon-footer">
            <span class="coupons__coupon-discount">50%</span
            ><a class="coupons__coupon-button" href="#">Save pass</a
            ><span class="coupons__coupon-left-count">Left 50 Coupons</span>
          </div>
        </div>
      </div>
    </div>
    <p class="coupons__note coupons__note_negative-margin">
      How to activate coupon?&nbsp;<a href="#">Learn More</a>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.coupons {
  padding-top: 30px;
  border-top: 1px solid #dadada;
  &__title {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 16px;
  }
  &__note {
    font-size: 13px;
    font-weight: 500;
    line-height: normal;
    color: #828282;
    margin-top: 0;
    margin-bottom: 80px;

    &_negative-margin {
      margin-top: -10px;
    }

    a {
      font-weight: 400;
      text-decoration: none;
      color: #000000;
      transition: 0.3s;

      &:hover {
        color: #bdbdbd;
      }
    }
  }

  &__coupons-wrapper {
    margin-top: 20px;
    display: inline-flex;
  }

  &__coupon {
    display: flex;
    width: 370px;
    height: 106px;
    background-color: #f2f2f2;
    border-radius: 9px;
    margin-bottom: 20px;
    margin-right: 16px;
    @include xs-down {
      width: 260px;
    }

    &:last-child {
      margin-bottom: 30px;
      margin-right: 0;
    }

    &_comet {
      .coupons__coupon-side {
        background-color: #61657e;
      }
    }

    &_rock-blue {
      .coupons__coupon-side {
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
      padding-top: 17px;
      padding-bottom: 6px;
      padding-left: 22px;

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
      font-size: 9px;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import TitleComponent from '@/components/Settings/Title.vue'
export default Vue.extend({
  components: {
    TitleComponent,
  },
})
</script>

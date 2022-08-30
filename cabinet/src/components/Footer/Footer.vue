 <template>
  <footer class="footer" :class="{ footer_large: type === 'large' }">
    <div class="footer__container">
      <div class="footer__inner">
        <additional-info />
        <air-menu />
        <div class="footer__social">
          <ul class="footer__social-list">
            <li class="footer__social-item">
              <a
                class="footer__social-link"
                href="https://www.facebook.com/itmeocom"
                target="_blank"
              >
                <div class="footer__social-link-icon-wrapper">
                  <facebook-icon class="footer__social-link-icon" />
                </div>
                <span>Facebook</span>
              </a>
            </li>
            <li class="footer__social-item">
              <a
                class="footer__social-link"
                href="https://twitter.com/itmeohq"
                target="_blank"
              >
                <div class="footer__social-link-icon-wrapper">
                  <twitter-icon
                    class="
                      footer__social-link-icon footer__social-link-icon_twitter
                    "
                  />
                </div>
                <span>Twitter</span>
              </a>
            </li>
            <li class="footer__social-item">
              <a
                class="footer__social-link"
                href="https://www.instagram.com/itmeo.design/"
                target="_blank"
              >
                <div class="footer__social-link-icon-wrapper">
                  <instagram-icon class="footer__social-link-icon" />
                </div>
                <span>Instagram</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom-section">
        <div class="footer__legal-links-wrapper">
          <a class="footer__legal-link" href="/privacy-policy"
            >Privacy Policy</a
          >
          <a class="footer__legal-link" href="/terms">Terms of Service</a>
        </div>
        <span class="footer__copyright">©{{ year }} airtap.io</span>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
//TODO: join all to one component:
//1. src\components\Footer\AdditionalInfo.vue
//2. src\components\Footer\Footer.vue
//3. src\components\Login\Footer.vue
import Vue from 'vue'

import AdditionalInfo from '@/components/Footer/AdditionalInfo.vue'
import AirMenu from '@/components/Footer/Menu.vue'
import FacebookIcon from '@/assets/icons/facebook.svg?inline'
import TwitterIcon from '@/assets/icons/twitter.svg?inline'
import InstagramIcon from '@/assets/icons/instagram.svg?inline'
import SlackIcon from '@/assets/icons/slack.svg?inline'

export default Vue.extend({
  props: {
    type: String,
  },
  components: {
    AdditionalInfo,
    AirMenu,
    FacebookIcon,
    TwitterIcon,
    InstagramIcon,
    SlackIcon,
  },
  data() {
    return {
      year: new Date().getFullYear(),
    }
  },
})
</script>

<style lang="scss">
.footer {
  background-color: #ffffff;
  z-index: 10;

  font-family: 'Poppins', sans-serif;
  padding: 0 $margin_page_high_resolution;
  &__container {
    //max-width: 1280px;
    margin-top: 60px;
    margin-bottom: 30px;
  }
  &--main {
    background: transparent;
    border: none !important;
    margin: -229px 0 0;
    color: $white;
    .footer__inner,
    .footer__bottom-section {
      max-width: 1280px;
      margin: 0 auto;
    }
    .additional-info {
      &__logo {
        img {
          &:nth-child(1) {
            display: none;
          }
          &:nth-child(2) {
            display: block;
          }
        }
      }
      &__powered-by {
        background: rgba(255, 255, 255, 0.4);
      }
      &__text {
        color: $white;
        margin: 16px 0 30px;
      }
    }
    .menu-footer {
      height: 22px;
      &__column-link {
        color: $white;
      }
    }
    .footer {
      &__social {
        height: 22px;
        &-item {
          height: 22px;
        }
      }
      &__social-link {
        color: $white;
        &-icon {
          path {
            fill: $white;
          }
        }
      }
      &__legal-link,
      &__copyright {
        color: $white;
      }
      &__container {
        padding: 0 20px;
      }
    }
    @include bp($mobile) {
      padding-top: 0 !important;
      margin: -210px 0 0;
    }
  }

  &_large {
    .footer__inner {
      max-width: 1574px;
      width: 100%;
      padding-right: 60px;
      padding-left: 60px;
    }
  }

  &__inner {
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    margin-right: auto;
    margin-left: auto;
  }

  &__bottom-section {
    margin: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin-bottom: 16px;
  }

  &__copyright {
    display: inline-block;
    vertical-align: top;
    font-size: 10px;
    line-height: 17px;
    color: rgba(0, 0, 0, 0.7);
  }

  &__legal-links-wrapper {
    display: flex;
    align-items: center;
  }

  &__legal-link {
    font-size: 10px;
    line-height: 17px;
    text-decoration: none;
    color: rgba(#555555, 0.7);
    transition: 0.3s;
    margin-right: 35px;

    &:hover {
      color: #555555;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  &__social {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 36px;
    align-items: center;
    &-title {
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: $black;
    }

    &-list {
      display: flex;
    }

    &-item {
      width: 100%;

      &:not(:last-child) {
        margin: 0 32px 0 0;
      }
    }

    &-link {
      display: inline-flex;
      align-items: center;
      font-size: 13px;
      line-height: 20px;
      letter-spacing: 0.005em;
      text-decoration: none;
      color: $black;
      transition: 0.3s;
      border-bottom: 1px solid transparent;

      &:hover {
        opacity: 0.4;

        .footer {
          &__social-link-icon {
            path {
              fill: #000000;
            }
          }
        }
      }
    }

    &-link-icon-wrapper {
      display: flex;
      align-items: center;
      margin-right: 8px;
    }

    &-link-icon {
      width: 12px;

      &_twitter {
        width: 14px;
      }

      path {
        fill: #333333;
        transition: 0.3s;
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .footer {
    padding: 0px $margin_page_desktop 0px;
  }
}
@media screen and (max-width: 990px) {
  .footer {
    &__social-link {
      span {
        display: none;
      }
      &-icon-wrapper {
        margin-right: 0;
      }
    }
    &__inner {
      padding: 0;
    }
  }
}
@media screen and (max-width: 768px) {
  .footer {
    // padding-top: 50px;
    padding: 0 $margin_page_tablet;
    &__container {
      width: 100%;
      margin-top: 50px;
      margin-bottom: 30px;
    }
  }
}
@media screen and (max-width: 655px) {
  .footer {
    &__bottom-section {
      padding-top: 16px;
      border-top: 1px solid #ebebeb;
      margin-top: 16px;
    }
  }
}
@media screen and (max-width: 414px) {
  .footer {
    // padding-top: 40px;
    //padding-bottom: 16px;
    padding: 0 $margin_page_mobile;
    &__container {
      width: 100%;
      margin-top: 40px;
      margin-bottom: 16px;
    }
    &__social-item {
      &:not(:last-child) {
        margin: 0 20px 0 0;
      }
    }
    &__legal-link {
      margin-right: 15px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>

<template>
  <div
    class="footer"
    :class="{ 'footer_no-margin-top': type === 'no-margin-top' }"
  >
    <container class="footer__container" :type="largeContainer && 'large'">
      <div class="footer__item footer__item_left">
        <div class="footer-about">
          <div class="footer-about__title">
            <div class="footer-logo">
              <router-link class="nav__logo_link" :to="rootUrl">
                <img
                  class="nav__logo_img"
                  src="/img/components/footer/logo-title.svg"
                />
              </router-link>
            </div>
            <a class="powered-itmeo" href="https://itmeo.com" target="_blank"
              >Powered by
              <img src="/img/components/footer/logoitmeo.svg" alt="itmeo" />
            </a>
            <p class="footer-slogan">
              Launch your ideas in the fast way for free<br />with simple and
              pretty web-site builder.
            </p>
            <div class="police-terms">
              <p class="small">©{{ year }} airtap.io</p>
              <ul>
                <li>
                  <router-link class="small" to="/privacy-policy">
                    Privacy Policy
                  </router-link>
                </li>
                <li>
                  <router-link class="small" to="/terms">
                    Terms of Service
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer__item footer__item_right">
        <div class="footer-list">
          <div class="footer-list__item">
            <p @click="clickHandler">Product</p>
            <ul>
              <li>
                <router-link to="/demo">Demo</router-link>
              </li>
              <li>
                <router-link to="/templates">Templates</router-link>
              </li>
              <li>
                <router-link to="/examples">Examples</router-link>
              </li>
              <li>
                <router-link to="/plans">Pricing</router-link>
              </li>
              <li>
                <router-link to="/help">Help</router-link>
              </li>
            </ul>
          </div>
          <div class="footer-list__item expand">
            <p @click="clickHandler">Company</p>
            <ul>
              <li>
                <router-link to="/about">About</router-link>
              </li>
              <li>
                <router-link to="/changelog">Changelog</router-link>
              </li>
              <li>
                <router-link to="/roadmap">Roadmap</router-link>
              </li>
              <li>
                <router-link to="/affiliate">Affiliate</router-link>
              </li>
            </ul>
          </div>
          <div class="footer-list__item">
            <p @click="clickHandler">Support</p>
            <ul>
              <li>
                <router-link to="/faq">FAQ</router-link>
              </li>
              <li>
                <router-link to="/template-request"
                  >Request for the template</router-link
                >
              </li>
            </ul>
          </div>
          <div class="footer-list__item">
            <p @click="clickHandler">Let's Connect</p>
            <ul>
              <li>
                <a
                  class="link-icon link-facebook"
                  href="https://www.facebook.com"
                  target="_blank"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  class="link-icon link-twitter"
                  href="https://twitter.com/AirtapCo"
                  target="_blank"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  class="link-icon link-instagram"
                  href="https://www.instagram.com/"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  class="link-icon link-slack"
                  href="https://slack.com/"
                  target="_blank"
                >
                  Slack
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer__item police-terms">
        <p class="small">©{{ year }} airtap.io</p>
        <ul>
          <li>
            <router-link class="small" to="/privacy-policy">
              Privacy Policy
            </router-link>
          </li>
          <li>
            <router-link class="small" to="/terms">
              Terms of Service
            </router-link>
          </li>
        </ul>
      </div>
    </container>
  </div>
</template>

<script lang="ts">
//TODO: join all to one component:
//1. src\components\Footer\AdditionalInfo.vue
//2. src\components\Footer\Footer.vue
//3. src\components\Login\Footer.vue
import Vue from 'vue'
import Container from '@/components/Container.vue'
import HTMLElementEvent from '@/utils/types/HTMLElementEvent'

export default Vue.extend({
  props: {
    type: String,
    largeContainer: Boolean,
  },
  data() {
    return {
      rootUrl: '/',
      year: new Date().getFullYear(),
    }
  },
  methods: {
    clickHandler(e: HTMLElementEvent<HTMLDivElement>) {
      const element = e.target.parentElement
      if (!element) return

      if (element.classList.contains('expand')) {
        element.classList.remove('expand')
      } else {
        element.classList.add('expand')
      }
    },
  },
  components: {
    Container,
  },
})
</script>

<style lang="scss" scoped>
.footer {
  background: #fff;
  margin-top: 51px;

  &_no-margin-top {
    margin-top: 0 !important;
  }

  .footer__container {
    padding-top: 22px;
    padding-bottom: 22px;
    overflow: hidden;
  }
}

.footer__item {
  float: left;
  width: 100%;
}

.footer__item_right {
  width: 100%;
}

.footer__item_left {
  width: 100%;
}

.footer-about__title {
  line-height: 23px;
  font-size: 14px;
  letter-spacing: 0.1px;
  color: #333333;
  text-align: center;

  .footer-logo {
    display: block;
  }

  a.nav__logo_link {
    margin-right: 15px;

    .nav__logo_img {
      width: 100px;
      margin: 0 auto 11px auto;
    }
  }

  .powered-itmeo {
    background: #f2f2f2;
    border-radius: $shape_border_radius;
    display: inline-block;
    vertical-align: middle;
    text-decoration: none;
    padding: 5px 8px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    font-size: 12px;
    letter-spacing: 0.1px;
    color: #333333;

    img {
      display: inline-block;
      vertical-align: middle;
      margin-left: 7px;
      margin-top: -2px;
      width: 62px;
      height: auto;
    }
  }

  .footer-slogan {
    margin: 14px 0;
    font-size: 12px;
    line-height: 20px;
  }
}

.police-terms {
  display: none;

  .small {
    line-height: 12px;
    font-size: 10px;
    letter-spacing: 0.5px;
    color: #555555;
    opacity: 0.7;
  }

  ul {
    margin-top: 4px;
  }

  li {
    display: inline-block;
  }

  li a {
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: #000000;
      opacity: 1;
    }
  }
}

.footer__item.police-terms {
  display: block;
  text-align: center;
  margin-top: 4px;
}

.footer-list {
  overflow: hidden;
}

.footer-list__item {
  width: 100%;
  border-bottom: 1px solid #dadada;
  padding-bottom: 6px;
  margin-bottom: 12px;

  p {
    line-height: 22px;
    font-size: 12px;
    letter-spacing: 0.15px;
    color: #2f80ed;
    margin-bottom: 0px;
    cursor: pointer;
  }

  p:after {
    content: 'd';
    text-indent: 1000px;
    display: block;
    width: 12px;
    height: 7px;
    background: url(/img/components/footer/arrow-right.svg) no-repeat;
    background-size: contain;
    float: right;
    margin-top: 5px;
  }

  ul {
    display: none;
  }

  li {
    margin-bottom: 12px;
  }

  li:last-child {
    margin-bottom: 8px;
  }

  li a {
    font-size: 12px;
    color: #333333;
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: #000000;
    }
  }

  &.expand {
    padding-bottom: 0px;

    p:after {
      background: url(/img/components/footer/arrow-down.svg) no-repeat;
      width: 7px;
      height: 12px;
      background-size: contain;
    }

    ul {
      display: block;
      margin-top: 8px;
    }
  }
}

.link-icon {
  text-align: center;
  padding: 0;
}

.link-icon:before {
  content: 'd';
  text-indent: 1000px;
  display: inline-block;
  width: auto;
  height: 12px;
  margin-right: 7px;
  vertical-align: middle;
  max-width: 15px;
  margin-top: -3px;
}

.link-facebook:before {
  background: url(/img/components/footer/icon-facebook-b.svg) no-repeat;
  background-size: contain;
}

.link-twitter:before {
  background: url(/img/components/footer/icon-twitter-b.svg) no-repeat;
  background-size: contain;
}

.link-slack:before {
  background: url(/img/components/footer/icon-slack-b.svg) no-repeat;
  background-size: contain;
}

.link-instagram:before {
  background: url(/img/components/footer/icon-instagram-b.svg) no-repeat;
  background-size: contain;
}

@media (min-width: 768px) and (max-width: 999px) {
  .footer {
    margin-top: 57px;

    .footer__container {
      padding-top: 50px;
      padding-bottom: 50px;
    }
  }
  .footer__item_right {
    width: 66%;
  }
  .footer__item_left {
    width: 34%;
  }
  .footer-about__title .footer-logo {
    display: inline-block;
  }
  .footer-list__item {
    margin-bottom: 24px;

    p {
      font-size: 20px;
    }

    p:after {
      width: 16px;
      height: 9px;
      margin-top: 8px;
    }

    li a {
      font-size: 16px;
    }

    &.expand {
      padding-bottom: 15px;
      margin-bottom: 20px;

      p:after {
        width: 9px;
        height: 16px;
        margin-top: 0px;
      }

      ul {
        margin-top: 23px;
      }
    }
  }
  .footer-logo {
    vertical-align: middle;
    display: inline-block;
  }
  .footer-about__title {
    text-align: left;

    .powered-itmeo {
      margin-top: 10px;
    }
  }
  .footer-list {
    padding-left: 46px;
    margin-top: -8px;
  }
  .footer-about__title {
    .footer-slogan {
      margin-bottom: 25px;
      margin-top: 28px;
    }

    .police-terms {
      display: block;

      p.small {
        margin: 0;
      }
    }
  }
  .footer__item.police-terms {
    display: none;
  }
}

@media (min-width: 1000px) and (max-width: 1499px) {
  .footer {
    margin-top: 59px;

    .footer__container {
      padding-top: 35px;
      padding-bottom: 35px;
    }
  }
  .footer__item_left {
    width: 42%;
  }
  .footer__item_right {
    width: 58%;
  }
  .footer-about__title {
    text-align: left;

    .footer-logo {
      display: inline-block;
      vertical-align: middle;

      a.nav__logo_link .nav__logo_img {
        margin: 0;
      }
    }

    .footer-slogan {
      margin: 18px 0 31px 0;
      font-size: 14px;
      line-height: 21px;
    }

    .police-terms {
      ul {
        margin-top: 0px;
      }

      li {
        display: inline-block;
        margin-right: 20px;
      }
    }
  }
  .footer-list {
    display: flex;
    justify-content: space-between;
  }
  .footer-list__item {
    width: 107px;
    border-bottom: 0px;

    p {
      font-size: 16px;
      margin-bottom: 0px;
      cursor: initial;
    }

    p:after {
      display: none;
    }

    ul {
      list-style: none;
      margin-top: 22px;
      padding: 0;
      display: block;
    }

    li {
      margin-bottom: 15px;
    }

    li a {
      font-size: 14px;
    }
  }
  .footer-list__item:last-child {
    width: 106px;
  }
  .footer-list__item.expand ul {
    margin-top: 22px;
  }
  .footer__item.police-terms {
    display: none;
  }
  .police-terms {
    display: block;
  }
}

@media (min-width: 1500px) {
  .footer {
    margin-top: 141px;

    .footer__container {
      padding-top: 35px;
      padding-bottom: 35px;
    }
  }
  .footer__item_left {
    width: 60%;
  }
  .footer__item_right {
    width: 40%;
  }
  .footer-about__title {
    text-align: left;

    .footer-logo {
      display: inline-block;
      vertical-align: middle;

      a.nav__logo_link .nav__logo_img {
        margin: 0;
      }
    }

    .footer-slogan {
      margin: 18px 0 31px 0;
      font-size: 14px;
      line-height: 21px;
    }

    .police-terms {
      ul {
        margin-top: 0px;
      }

      li {
        display: inline-block;
        margin-right: 20px;
      }
    }
  }
  .footer-list {
    display: flex;
    justify-content: space-between;
  }
  .footer-list__item {
    width: 107px;
    border-bottom: 0px;

    p {
      font-size: 16px;
      margin-bottom: 0px;
      cursor: initial;
    }

    p:after {
      display: none;
    }

    ul {
      list-style: none;
      margin-top: 22px;
      padding: 0;
      display: block;
    }

    li {
      margin-bottom: 15px;
    }

    li a {
      font-size: 14px;
    }
  }
  .footer-list__item:last-child {
    width: 106px;
  }
  .footer-list__item.expand ul {
    margin-top: 22px;
  }
  .footer__item.police-terms {
    display: none;
  }
  .police-terms {
    display: block;
  }
}
</style>

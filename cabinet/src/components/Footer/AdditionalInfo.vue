<template>
  <div class="additional-info">
    <div class="additional-info__header">
      <router-link class="additional-info__logo" :to="rootUrl">
        <img src="/img/main/airtap_logo--black.svg" alt="Airtap" />
        <img src="/img/main/airtap_logo--white.svg" alt="Airtap" />
      </router-link>
      <a
        class="additional-info__powered-by"
        href="http://itmeo.com"
        target="_blank"
      >
        <span>Powered by</span>
        <img src="/img/components/footer/logo-itmeo.svg" alt="Itmeo" />
      </a>
    </div>
    <p class="additional-info__text">
      Launch your ideas in the fast way for free with simple and pretty web-site
      builder.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
//TODO: join all to one component:
//1. src\components\Footer\AdditionalInfo.vue
//2. src\components\Footer\Footer.vue
//3. src\components\Login\Footer.vue
export default Vue.extend({
  computed: {
    rootUrl(): string {
      return this.$store.state.auth.isUserLoggedIn ? '/projects' : '/'
    },
  },
  data() {
    return {
      year: new Date().getFullYear(),
    }
  },
})
</script>

<style lang="scss">
.additional-info {
  &__header {
    display: flex;
    align-items: center;
  }

  &__logo {
    margin-right: 15px;
    display: flex;
    align-items: center;

    img {
      width: 79px;

      &:nth-child(2) {
        display: none;
      }
    }
  }

  &__powered-by {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    background-color: #f2f2f2;
    border-radius: $shape_border_radius;
    padding: 1px 8px;
    white-space: nowrap;
    span {
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
      color: #232323;
      margin-right: 4px;
    }
  }

  &__text {
    max-width: 278px;
    font-size: 13px;
    line-height: 20px;
    font-weight: 400;
    color: $black;
    margin-top: 16px;
    margin-bottom: 30px;
  }

  &__copyright {
    display: inline-block;
    vertical-align: top;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.5px;
    color: rgba(#555555, 0.7);
    margin-bottom: 6px;
  }

  &__legal-links-wrapper {
    display: flex;
    align-items: center;
  }

  &__legal-link {
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.5px;
    text-decoration: none;
    color: rgba(#555555, 0.7);
    transition: 0.3s;
    margin-right: 16px;

    &:hover {
      color: #555555;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
@media screen and (max-width: 655px) {
  .additional-info {
    flex: 100%;
  }
}

@media screen and (max-width: 414px) {
  .additional-info {
    &__text {
      font-size: 12px;
      line-height: 18px;
    }
    &__powered-by {
      span {
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
}
</style>

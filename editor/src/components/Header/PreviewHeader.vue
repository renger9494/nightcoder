<template>
  <header
    class="header preview-header"
    :class="{
      header_large: type === 'large',
      'header_full-width': type === 'full-width'
    }"
  >
    <div class="header__inner">
      <div class="header__side">
        <a class="header__logo" :href="rootUrl">
          <img src="/img/login/logo-uplaunch.svg" alt="Airtap" />
        </a>
      </div>
      <div class="header__side">
        <adaptive-buttons-block />
      </div>
      <div class="header__side">
        <router-link
          class="preview-header__link"
          :to="projectId ? `/editor/projects/${projectId}/pages/${pageId}` : `/editor/templates/${templateId}`"
        >
          <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.04221 1.95571L2.79988 6.20303C2.60489 6.39802 2.28741 6.39802 2.09241 6.20303C1.89742 6.00804 1.89742 5.69055 2.09241 5.49556L6.33474 1.24824C6.52973 1.05324 6.84721 1.05324 7.04221 1.24824C7.1397 1.34573 7.1897 1.47323 7.1897 1.60072C7.1897 1.73072 7.1397 1.85821 7.04221 1.95571ZM8.63485 1.42557L7.57239 0.36561C7.08491 -0.12187 6.29245 -0.12187 5.80497 0.36561L1.25016 4.92792C1.10766 5.06791 1.00267 5.24291 0.94017 5.4354L0.0252086 8.35028C-0.0972863 8.73526 0.265199 9.09774 0.650182 8.97775L3.57006 8.06029C3.76005 8.00029 3.93504 7.89529 4.07754 7.7528L8.63485 3.19049C9.12233 2.70301 9.12233 1.91304 8.63485 1.42557Z"
              fill="black"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.37465 11.9999H0.624974C0.279738 11.9999 0 11.7202 0 11.3749C0 11.0297 0.279738 10.75 0.624974 10.75H8.37465C8.71988 10.75 8.99962 11.0297 8.99962 11.3749C8.99962 11.7202 8.71988 11.9999 8.37465 11.9999Z"
              fill="black"
            />
          </svg>
          <span>Back to Editor</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import AdaptiveButtonsBlock from '@/components/Editor/AdaptiveButtonsBlock.vue';

export default Vue.extend({
  components: {
    AdaptiveButtonsBlock
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    authorized: Boolean
  },
  data() {
    return {
      projectId: this.$route.params.projectId || null,
      pageId: this.$route.params.pageId || null,
      templateId: this.$route.params.templateId || null
    };
  },
  computed: {
    rootUrl(): string {
      return this.$store.state.auth.isUserLoggedIn ? '/dashboard' : '/';
    }
  }
});
</script>

<style lang="scss" scoped>
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #dadada;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;

  &_full-width {
    .header__inner {
      max-width: 100%;
      padding-right: 20px;
      padding-left: 20px;

      @include sm-down {
        padding-right: 15px;
        padding-left: 15px;
      }

      @include xs-down {
        padding-right: 15px;
        padding-left: 15px;
      }
    }
  }

  &_large {
    .header__inner {
      max-width: 1574px;
      width: 100%;
      padding-right: 60px;
      padding-left: 60px;

      @include sm-down {
        padding-right: 40px;
        padding-left: 40px;
      }

      @include xs-down {
        padding-right: 20px;
        padding-left: 20px;
      }
    }
  }

  &__inner {
    position: relative;
    z-index: 998;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1330px;
    height: 60px;
    background-color: #ffffff;
    padding-top: 15px;
    padding-right: 60px;
    padding-bottom: 15px;
    padding-left: 60px;
    margin-right: auto;
    margin-left: auto;

    @include sm-down {
      padding-top: 19.5px;
      padding-right: 40px;
      padding-bottom: 19.5px;
      padding-left: 40px;
    }

    @include xs-down {
      padding-right: 20px;
      padding-left: 20px;
    }
  }

  &__side {
    display: flex;
    align-items: center;
    min-width: 80px; // Why? It is for correct centering Menu, it is the largest width of side blocks

    &:first-child {
      margin: 0 0 0 6px;
    }

    @include lg-down {
      min-width: initial;
    }
  }

  &__logo {
    display: inline-block;
    vertical-align: top;

    img {
      display: block;
      width: 83px;
    }
  }
}
.preview-header {
  &__link {
    display: flex;
    text-align: center;
    padding: 14px 18px;
    background: #ffffff;
    border: 1px solid #c4c4c4;
    box-sizing: border-box;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    border-radius: $shape_border_radius;
    transition: 0.3s ease;
    text-decoration: none;
    &:hover {
      box-shadow: 0px 5px 4px rgba(51, 51, 51, 0.12);
    }
    &:focus {
      border-color: #000000;
      box-shadow: 0px 5px 4px rgba(51, 51, 51, 0.12);
    }
    span {
      font-size: 12px;
      line-height: 13px;
      letter-spacing: 0.3px;
      color: #000000;
      margin-left: 6px;
    }
  }
}
</style>

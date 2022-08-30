<template>
  <div class="cookies-popup" :class="{ 'cookies-popup_visible': isVisible }">
    <span class="cookies-popup__emoji">🍪</span>
    <p class="cookies-popup__text">
      This site uses cookies. By using this site, you agree with the&nbsp;<a
        href="/privacy-policy"
        target="_blank"
        >Privacy Policy
      </a>
    </p>
    <a
      class="cookies-popup__close-button"
      href="#"
      @click="handleCloseButtonClick"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none">
        <path
          fill="#BDBDBD"
          d="M7.74148 1.14999C7.73213.923128 7.64775.698128 7.47396.524991c-.1731-.173138-.39814-.258105-.625-.267517-.25248-.01062-.5081.074379-.70059.267517L3.99961 2.67437 1.85086.524991C1.65775.331853 1.40275.247474 1.15024.257474.923372.266854.698372.351232.525235.524991.352131.698128.26713.923128.257719 1.14999c-.010621.25252.074379.50748.267516.70062L2.67399 3.99999.525235 6.14875c-.193137.1931-.277516.44814-.267516.70059.009379.22686.093758.45189.267516.625.173137.17313.398137.25813.625005.26751.25251.01062.50751-.07434.70062-.26751l2.14875-2.14873 2.14938 2.14938c.19314.19311.44814.27748.70062.26752.22687-.00938.45187-.09376.625-.26752.17314-.17314.25811-.39814.26752-.625.01062-.25252-.07438-.50748-.26752-.70062L5.32524 3.99999l2.14872-2.14876c.19317-.1931.27814-.4481.26752-.70124z"
        ></path>
      </svg>
    </a>
  </div>
</template>

<script>
import cookies from "@/utils/cookies";

export default {
  data() {
    return {
      isVisible: false,
    };
  },
  async mounted() {
    if (process.client) {
      const policyCookie = cookies.getItem("a_cp");

      if (!policyCookie) {
        await this.$nextTick();
        this.isVisible = true;
      }
    }
  },
  methods: {
    handleCloseButtonClick(event) {
      if (!process.client) return;
      if (event) event.preventDefault();

      cookies.setItem("a_cp", true, Infinity);
      this.isVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.cookies-popup {
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 9999;
  display: flex;
  align-items: center;
  max-width: 574px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(130, 130, 130, 0.2);
  padding-top: 7px;
  padding-right: 16px;
  padding-bottom: 7px;
  padding-left: 10px;
  transform: translateX(-50%);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;

  @include xs-down {
    max-width: 529px;
    padding-right: 10px;
  }

  &_visible {
    opacity: 1;
    visibility: visible;
  }

  &__emoji {
    font-size: 21px;
    margin-right: 9px;
  }

  &__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    margin-top: 0;
    margin-right: 14px;
    margin-bottom: 0;

    @include xs-down {
      font-size: 13px;
      text-align: center;
      margin-right: 10px;
    }

    a {
      position: relative;
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      text-decoration: none;
      color: rgba(#2f80ed, 0.8);

      &:hover {
        color: #2f80ed;

        &:after {
          transform: none;
          opacity: 1;
        }
      }

      &:after {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #2f80ed;
        transform: translateY(2px) rotateZ(1deg);
        transition: transform 0.2s ease, opacity 0.3s ease;
        opacity: 0;
      }
    }
  }

  &__close-button {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f2f2f2;
    border-radius: 50%;
    transition: 0.3s;

    &:hover {
      background-color: #828282;

      path {
        fill: #ffffff;
      }
    }

    &:active {
      background-color: #333333;

      path {
        fill: #ffffff;
      }
    }

    path {
      fill: #828282;
      transition: 0.3s;
    }
  }
}
</style>


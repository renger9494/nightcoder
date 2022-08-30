<template>
  <modal class="limit-modal" :isVisible="isVisible">
    <div class="limit-modal__inner">
      <a class="limit-modal__close-button" href="#" @click.prevent="closeModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none">
          <path
            fill="#BDBDBD"
            d="M7.74148 1.14999C7.73213.923128 7.64775.698128 7.47396.524991c-.1731-.173138-.39814-.258105-.625-.267517-.25248-.01062-.5081.074379-.70059.267517L3.99961 2.67437 1.85086.524991C1.65775.331853 1.40275.247474 1.15024.257474.923372.266854.698372.351232.525235.524991.352131.698128.26713.923128.257719 1.14999c-.010621.25252.074379.50748.267516.70062L2.67399 3.99999.525235 6.14875c-.193137.1931-.277516.44814-.267516.70059.009379.22686.093758.45189.267516.625.173137.17313.398137.25813.625005.26751.25251.01062.50751-.07434.70062-.26751l2.14875-2.14873 2.14938 2.14938c.19314.19311.44814.27748.70062.26752.22687-.00938.45187-.09376.625-.26752.17314-.17314.25811-.39814.26752-.625.01062-.25252-.07438-.50748-.26752-.70062L5.32524 3.99999l2.14872-2.14876c.19317-.1931.27814-.4481.26752-.70124z"
          ></path>
        </svg>
      </a>
      <img
        src="/img/modals/limit-modal-img.png"
        srcset="/img/modals/limit-modal-img-x2.png 2x"
        class="limit-modal__img"
      />

      <div class="limit-modal__title">The limit is reached</div>

      <div class="limit-modal__desc">
        You have <strong>exceeded the limit</strong> of creating new projects. You can <strong>update</strong> your
        tariff to create new fascinating websites.
      </div>

      <a href="/dashboard/plans" class="limit-modal__btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12">
          <path
            fill-rule="evenodd"
            d="M9.72788 11.9676l-3.38502-1.1913-3.38502 1.1913c-.37076.1306-.75721-.1502-.74657-.5421l.09914-3.55132-2.192651-2.8201c-.241947-.31093-.0935306-.76699.285072-.87751L3.85338 3.1701 5.88193.241149c.22234-.321532.69895-.321532.92186 0L8.83234 3.1701l3.45056 1.00647c.3786.11052.527.56658.2851.87751l-2.1927 2.8201.0991 3.55132c.0107.3919-.3758.6727-.74652.5421z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span>U</span>
        <span>p</span>
        <span>g</span>
        <span>r</span>
        <span>a</span>
        <span>d</span>
        <span>e</span>
      </a>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/Shared/Modal.vue';

export default {
  props: {
    isVisible: {
      type: Boolean
    }
  },
  components: {
    Modal
  },
  methods: {
    closeModal() {
      this.$store.dispatch('ui/closeModal');
    }
  }
};
</script>

<style lang="scss">
.limit-modal {
  background: #ffffff;
  box-shadow: 0px 8px 20px rgba(130, 130, 130, 0.2) !important;
  border-radius: 8px !important;
  width: 380px !important;
  height: 361px !important;
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto 0;
    width: 99px;
    height: 30px;
    font-style: normal;
    font-weight: bold;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #ffc557;
    background: #000000;
    border-radius: $shape_border_radius;
    text-decoration: none;
    position: relative;
    svg {
      fill: #ffc557;
      margin-right: 7px;
    }
    &:before {
      content: 'Upgrade';
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.4px;
      text-align: center;
      text-transform: uppercase;
      color: #ffc557;
      white-space: nowrap;
      padding-top: 9px;
      padding-right: 10px;
      padding-bottom: 9px;
      padding-left: 31px;
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
      }
    }
    span {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.4px;
      text-transform: uppercase;
      color: #ffc557;
      transform: translate3d(0, -10px, 0);
      opacity: 0;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }
  }
  &__title {
    font-style: normal;
    font-weight: normal;
    font-size: 26px;
    line-height: 42px;
    text-align: center;
    color: #000000;
    margin-bottom: 10px;
  }
  &__desc {
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    color: #000000;
  }
  &__img {
    width: 132px;
    height: 100px;
    margin-bottom: 10px;
  }
  &__close-button {
    position: absolute;
    top: 14px;
    right: 14px;
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
      fill: #bdbdbd;
      transition: 0.3s;
    }
  }
}
</style>

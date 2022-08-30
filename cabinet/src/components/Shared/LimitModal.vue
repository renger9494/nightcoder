<template>
  <modal class="limit-modal" :isVisible="isVisible">
    <div class="limit-modal__inner">
      <a class="limit-modal__close-button" href="#" @click.prevent="closeModal">
        <svg-icon name="close"  width="8" height="8" color="#BDBDBD" />
      </a>
      <img
        src="/img/modals/limit-modal-img.png"
        srcset="/img/modals/limit-modal-img-x2.png 2x"
        class="limit-modal__img"
      />

      <div class="limit-modal__title">The limit is reached</div>

      <div class="limit-modal__desc">
        You have <strong>exceeded the limit</strong> of creating new projects.
        You can <strong>update</strong> your tariff to create new fascinating
        websites.
      </div>

      <router-link to="/dashboard/plans" class="limit-modal__btn">
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
      </router-link>
    </div>
  </modal>
</template>

<script>
import Modal from "@/components/Shared/Modal.vue";
import SvgIcon from "~/components/Shared/SvgIcon";

export default {
  props: {
    isVisible: {
      type: Boolean,
    },
  },
  components: {
    SvgIcon,
    Modal,
  },
  methods: {
    closeModal() {
      this.$store.dispatch("ui/closeModal");
    },
  },
};
</script>

<style lang="scss">
.limit-modal {
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(130, 130, 130, 0.2) !important;
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
      content: "Upgrade";
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

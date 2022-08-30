<template>
  <modal class="project-publish-modal" :isVisible="isVisible">
    <div class="project-publish-modal__inner">
      <a
        href="#"
        class="project-publish-modal__close-button"
        @click="closeModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="8"
          fill="none"
        >
          <path
            fill="#BDBDBD"
            d="M7.74148 1.14999C7.73213.923128 7.64775.698128 7.47396.524991c-.1731-.173138-.39814-.258105-.625-.267517-.25248-.01062-.5081.074379-.70059.267517L3.99961 2.67437 1.85086.524991C1.65775.331853 1.40275.247474 1.15024.257474.923372.266854.698372.351232.525235.524991.352131.698128.26713.923128.257719 1.14999c-.010621.25252.074379.50748.267516.70062L2.67399 3.99999.525235 6.14875c-.193137.1931-.277516.44814-.267516.70059.009379.22686.093758.45189.267516.625.173137.17313.398137.25813.625005.26751.25251.01062.50751-.07434.70062-.26751l2.14875-2.14873 2.14938 2.14938c.19314.19311.44814.27748.70062.26752.22687-.00938.45187-.09376.625-.26752.17314-.17314.25811-.39814.26752-.625.01062-.25252-.07438-.50748-.26752-.70062L5.32524 3.99999l2.14872-2.14876c.19317-.1931.27814-.4481.26752-.70124z"
          ></path>
        </svg>
      </a>
      <img
        class="project-publish-modal__illustration"
        src="/img/modals/publishing-in-process-2.png"
        alt=""
      />

      <div class="project-publish-modal__title">
        Your website will be published soon, <br />
        please wait 😎
      </div>

      <div class="project-publish-modal__persent">
        <span :style="`left: calc(${totalPersent}% - 17.5px);`"
          >{{ totalPersent }}%</span
        >
      </div>

      <div class="project-publish-modal__progress">
        <span class="project-publish-modal__precompleted">
          <span :style="`width: ${preprogress}%;`"></span>
        </span>
        <span
          class="project-publish-modal__completed"
          :class="!nextStep ? 'active' : null"
        >
          <span :style="`width: ${publishProgress}%;`"></span>
        </span>
      </div>

      <div class="project-publish-modal__btns">
        <a href="#" class="project-publish-modal__btn">cancel</a>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/Shared/Modal.vue'

export default {
  data() {
    return {
      preprogress: 0,
      scalePreprogress: null,
      nextStep: false,
    }
  },
  props: {
    isVisible: Boolean,
    projectId: String,
  },
  components: {
    Modal,
  },
  computed: {
    publishProgress: function () {
      return this.$store.state.project.publishProgress
    },
    project: function () {
      return this.$store.state.project.projects.find((project) => {
        return project.id == this.projectId
      })
    },
    totalPersent() {
      let percent = Math.round(
        this.preprogress / 3.0303030303 + this.publishProgress / 1.49253731343
      )
      if (percent <= 100) return percent
      else return 100
    },
  },
  methods: {
    closeModal: function (event) {
      if (event) event.preventDefault()
      this.$store.dispatch('ui/closeModal')
    },
  },
  mounted() {
    setTimeout(() => {
      this.scalePreprogress = setInterval(() => {
        this.preprogress += 20
        if (this.preprogress == 100) {
          clearInterval(this.scalePreprogress)
          setTimeout(() => {
            this.nextStep = true
          }, 300)
        }
      }, 100)
    }, 500)
  },
}
</script>

<style lang="scss" scoped>
.project-publish-modal {
  width: 380px;
  height: auto;
  &__persent {
    position: relative;
    font-size: 14px;
    height: 18px;
    span {
      display: inline-flex;
      position: absolute;
      transition: 0.3s all ease-in-out;
      justify-content: center;
      width: 35px;
    }
  }
  &__precompleted {
    width: 33%;
    max-width: 33%;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    span {
      transition: 0.3s all ease-in-out;
      background: #4256be;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
    }
  }
  @include sm-down {
    width: 292px;
    padding-left: 14px;
    padding-right: 14px;
  }
  &__progress {
    width: 100%;
    height: 6px;
    background: #adbbff;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    margin-bottom: 35px;
  }
  &__completed {
    position: absolute;
    width: 67%;
    left: 33%;
    top: 0;
    height: 100%;
    &.active {
      span {
        width: 0 !important;
      }
    }
    span {
      transition: 0.3s all ease-in-out;
      background: #4256be;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
    }
  }
  &__inner {
    height: 100%;
    width: 100%;
  }
  &__btns {
    justify-content: center;
    align-items: center;
    display: flex;
  }
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: $shape_border_radius;
    font-weight: bold;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: #000000;
    border: 1px solid #000;
    color: #ffffff;
    text-decoration: none;
    width: 95px;
    height: 30px;
    &:nth-child(2) {
      margin-left: 20px;
    }
    &.disabled {
      color: #bdbdbd;
      background: #fff;
      border-color: #dadada;
    }
  }
  &__illustration {
    display: block;
    max-width: 100%;
    margin-right: auto;
    margin-bottom: 30px;
    margin-left: auto;
    max-width: 137px;
  }

  &__title {
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    color: #000000;
    margin-bottom: 30px;
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

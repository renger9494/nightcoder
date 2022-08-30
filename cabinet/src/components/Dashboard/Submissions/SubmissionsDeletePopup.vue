<template>
  <modal class="delete-project-confirmation-modal" :isVisible="isVisible">
    <div class="delete-project-confirmation-modal__inner">
      <img
        class="delete-project-confirmation-modal__illustration"
        src="/img/modals/delete-project-illustration.png"
        srcset="
          /img/modals/delete-project-illustration.png,
          /img/modals/delete-project-illustration@2x.png 2x
        "
        alt=""
      />
      <h2 class="delete-project-confirmation-modal__title">
        Do you really want to Delete <br />
        this {{ count > 1 ? 'items' : 'item' }} ?
      </h2>
      <div class="delete-project-confirmation-modal__buttons-wrapper">
        <a
          class="delete-project-confirmation-modal__button"
          href="#"
          @click="closeModal"
        >
          Cancel
        </a>
        <a
          class="
            delete-project-confirmation-modal__button
            delete-project-confirmation-modal__button_red
          "
          href="#"
          @click="remove"
        >
          Delete
        </a>
      </div>
      <a
        class="delete-project-confirmation-modal__close-button"
        href="#"
        @click="closeModal"
      >
        <svg-icon name="close" width="8" height="8" color="#BDBDBD" />
      </a>
    </div>
  </modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Modal from '@/components/Shared/Modal.vue'
import SvgIcon from '@/components/Shared/SvgIcon.vue'
import apiClient from '@/utils/apiClient'

export default Vue.extend({
  name: 'SubmissionsDeletePopup',
  props: {
    isVisible: Boolean,
    count: {
      type: Number,
      required: true,
    },
    submissionsDelete: {
      required: true,
      type: Array as PropType<number[]>,
    },
  },
  components: {
    SvgIcon,
    Modal,
  },
  methods: {
    closeModal() {
      this.$store.dispatch('ui/closeModal')
      this.$store.commit('project/changeDeleteModalData', null)
      location.reload()
    },
    remove() {
      apiClient.submissions
        .submissionsDeleteSelected({
          Submissions:
            this.submissionsDelete != [] ? this.submissionsDelete : null,
        })
        .then(({}) => {
          this.closeModal()
        })
        .catch((error) => {})
    },
  },
})
</script>

<style lang="scss" scoped>
.delete-project-confirmation-modal {
  width: 420px;
  height: 380px;
  padding-left: 30px;
  padding-right: 30px;
  @include sm-down {
    width: 292px;
    height: 360px;
    padding-left: 14px;
    padding-right: 14px;
  }
  &__inner {
    width: 100%;
  }
  &__illustration {
    display: block;
    max-width: 100%;
    margin-right: auto;
    margin-bottom: 30px;
    margin-left: auto;
  }

  &__title {
    font-size: 16px;
    font-weight: 400;
    line-height: 25px;
    color: #000000;
    margin-top: 0;
    margin-bottom: 40px;

    span {
      font-weight: 500;
    }
  }

  &__note {
    font-size: 13px;
    line-height: 20px;
    font-weight: 400;
    color: #555555;
    margin-top: 0;
    margin-bottom: 29px;
  }

  &__buttons-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__button {
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    background-color: #f3f3f3;
    color: #000000;
    border-radius: $shape_border_radius;
    padding: 16px 16px 12px;
    transition: 0.3s;
    width: calc(50% - 10px);
    &:hover {
      color: #000000;
      background-color: #f2f2f2;
    }

    &:active {
      color: #000000;
      background-color: #dadada;
    }

    &_red {
      color: #ffffff;
      background-color: #000000;

      &:hover {
        color: #ffffff;
        background-color: #333333;
      }

      &:active {
        color: #ffffff;
        background-color: #000000;
      }
    }
  }

  &__close-button {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f2f2f2;
    border-radius: 50%;
    transition: 0.3s;

    &:hover {
      path {
        fill: #000000;
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

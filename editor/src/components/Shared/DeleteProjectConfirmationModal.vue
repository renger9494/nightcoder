<template>
  <modal class="delete-project-confirmation-modal" :isVisible="isVisible">
    <div class="delete-project-confirmation-modal__inner">
      <img
        class="delete-project-confirmation-modal__illustration"
        src="/img/modals/delete-project-illustration.png"
        srcset="/img/modals/delete-project-illustration@2x.png 2x"
        alt=""
      />
      <h2 class="delete-project-confirmation-modal__title">
        Do you really want to delete&nbsp;<br /><span> «{{ name }}»? </span>
      </h2>
      <p class="delete-project-confirmation-modal__note">
        A deleted
        {{ modalType === DeleteModalMode.Project ? 'project' : 'page' }} cannot be restored.
      </p>
      <div class="delete-project-confirmation-modal__buttons-wrapper">
        <a class="delete-project-confirmation-modal__button" href="#" @click="closeModal"> Cancel </a>
        <a
          class="delete-project-confirmation-modal__button delete-project-confirmation-modal__button_red"
          href="#"
          @click="remove"
        >
          Delete
        </a>
      </div>
      <a class="delete-project-confirmation-modal__close-button" href="#" @click="closeModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none">
          <path
            fill="#BDBDBD"
            d="M7.74148 1.14999C7.73213.923128 7.64775.698128 7.47396.524991c-.1731-.173138-.39814-.258105-.625-.267517-.25248-.01062-.5081.074379-.70059.267517L3.99961 2.67437 1.85086.524991C1.65775.331853 1.40275.247474 1.15024.257474.923372.266854.698372.351232.525235.524991.352131.698128.26713.923128.257719 1.14999c-.010621.25252.074379.50748.267516.70062L2.67399 3.99999.525235 6.14875c-.193137.1931-.277516.44814-.267516.70059.009379.22686.093758.45189.267516.625.173137.17313.398137.25813.625005.26751.25251.01062.50751-.07434.70062-.26751l2.14875-2.14873 2.14938 2.14938c.19314.19311.44814.27748.70062.26752.22687-.00938.45187-.09376.625-.26752.17314-.17314.25811-.39814.26752-.625.01062-.25252-.07438-.50748-.26752-.70062L5.32524 3.99999l2.14872-2.14876c.19317-.1931.27814-.4481.26752-.70124z"
          ></path>
        </svg>
      </a>
    </div>
  </modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Modal from '@/components/Shared/Modal.vue';
import { mapState } from 'vuex';
import { DeleteModalData, DeleteModalMode } from '@/store/project';

export default Vue.extend({
  components: {
    Modal
  },
  props: {
    isVisible: Boolean
  },
  data() {
    return {
      DeleteModalMode
    };
  },
  computed: {
    ...mapState({
      deleteModalData: (state: any) => <DeleteModalData>state.project.deleteModalData
    }),
    modalType(): DeleteModalMode {
      if (!this.deleteModalData) return DeleteModalMode.Project;

      return this.deleteModalData.type;
    },
    name(): string {
      if (!this.deleteModalData) return '';
      let name = this.deleteModalData.name;
      if (!name) return '';

      if (name.length > 40) {
        name = `${name.slice(0, 40)}...`;
      }

      return name;
    }
  },
  methods: {
    remove(event: Event) {
      if (event) event.preventDefault();

      const { dispatch, commit } = this.$store;
      const { projectId, type, pageId, actionAfterDelete } = this.deleteModalData;
      if (type === DeleteModalMode.Project) {
        dispatch('project/deleteProject', { projectId, actionAfterDelete });
      } else {
        dispatch('project/deletePage', {
          pageId,
          projectId,
          actionAfterDelete
        });
      }
      this.closeModal(event);
    },
    closeModal(event: Event) {
      if (event) event.preventDefault();

      this.$store.dispatch('ui/closeModal');
      this.$store.commit('project/changeDeleteModalData', null);
    }
  }
});
</script>

<style lang="scss" scoped>
.delete-project-confirmation-modal {
  width: 380px;
  height: 360px;
  @include sm-down {
    width: 292px;
    height: 360px;
    padding-left: 14px;
    padding-right: 14px;
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
    margin-bottom: 7px;

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
    justify-content: center;
  }

  &__button {
    font-size: 10px;
    letter-spacing: 1.4px;
    font-weight: 700;
    text-decoration: none;
    text-transform: uppercase;
    color: #555555;
    border-radius: $shape_border_radius;
    padding-top: 9px;
    padding-right: 16px;
    padding-bottom: 9px;
    padding-left: 16px;
    margin-right: 5px;
    transition: 0.3s;

    &:hover {
      color: #000000;
      background-color: #f2f2f2;
    }

    &:active {
      color: #000000;
      background-color: #dadada;
    }

    &:last-child {
      margin-right: 0;
    }

    &_red {
      color: #ffffff;
      background-color: #f26b60;

      &:hover {
        color: #ffffff;
        background-color: #e5483b;
      }

      &:active {
        color: #ffffff;
        background-color: #dc1100;
      }
    }
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

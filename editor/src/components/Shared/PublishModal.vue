<template>
  <modal class="project-publish-modal" :isVisible="isVisible" :class="isPublished ? 'project-published' : ''">
    <div class="project-publish-modal__inner">
      <a href="#" class="project-publish-modal__close-button" v-on:click="closeModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none">
          <path
            fill="#BDBDBD"
            d="M7.74148 1.14999C7.73213.923128 7.64775.698128 7.47396.524991c-.1731-.173138-.39814-.258105-.625-.267517-.25248-.01062-.5081.074379-.70059.267517L3.99961 2.67437 1.85086.524991C1.65775.331853 1.40275.247474 1.15024.257474.923372.266854.698372.351232.525235.524991.352131.698128.26713.923128.257719 1.14999c-.010621.25252.074379.50748.267516.70062L2.67399 3.99999.525235 6.14875c-.193137.1931-.277516.44814-.267516.70059.009379.22686.093758.45189.267516.625.173137.17313.398137.25813.625005.26751.25251.01062.50751-.07434.70062-.26751l2.14875-2.14873 2.14938 2.14938c.19314.19311.44814.27748.70062.26752.22687-.00938.45187-.09376.625-.26752.17314-.17314.25811-.39814.26752-.625.01062-.25252-.07438-.50748-.26752-.70062L5.32524 3.99999l2.14872-2.14876c.19317-.1931.27814-.4481.26752-.70124z"
          ></path>
        </svg>
      </a>
      <img
        class="project-publish-modal__illustration"
        src="/img/modals/published-success.png"
        srcset="/img/modals/published-success@2x.png 2x"
        alt=""
        v-if="!isPublished"
      />
      <img
        class="project-publish-modal__illustration"
        src="/img/modals/publish-changes.png"
        srcset="/img/modals/publish-changes@2x.png 2x"
        alt=""
        v-if="isPublished"
      />

      <div class="project-publish-modal__title" v-if="!isPublished">
        Your website is published!
      </div>

      <div class="project-publish-modal__title" v-if="isPublished">
        Do you want publish changes on your URL?
      </div>

      <div class="project-publish-modal__url-block" :class="isPublished ? 'light' : ''">
        <a
          :href="mergedProjectUrl || '#'"
          target="_blank"
          class="project-publish-modal__url-link"
          :title="mergedProjectUrl || '#'"
        >
          {{ mergedProjectUrl }}
        </a>
        <div class="project-publish-modal__links" v-if="!isPublished">
          <a href="#" @click.prevent="copyUrl">
            <span>Copy URL</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.39469 9.52066L3.78749 10.1237C3.26114 10.6454 2.40509 10.6458 1.87904 10.1237C1.62615 9.87271 1.48725 9.53941 1.48725 9.18511C1.48725 8.83081 1.6263 8.49736 1.87889 8.24641L4.11389 6.02897C4.57709 5.56967 5.44843 4.89332 6.08353 5.52317C6.37498 5.81267 6.84568 5.81072 7.13503 5.51942C7.42453 5.22812 7.42273 4.75727 7.13128 4.46807C6.05173 3.39677 4.45619 3.59477 3.06659 4.97357L0.831448 7.19116C0.295199 7.72351 0 8.43151 0 9.18511C0 9.93871 0.295199 10.6466 0.831598 11.1789C1.38345 11.7264 2.10809 12 2.83304 12C3.55814 12 4.28309 11.7264 4.83524 11.1786L5.44288 10.5755C5.73418 10.2863 5.73583 9.81556 5.44633 9.52411C5.15729 9.23296 4.68614 9.23131 4.39469 9.52066ZM11.1681 0.906631C10.0086 -0.243866 8.38738 -0.306266 7.31398 0.758731L6.55708 1.51008C6.26563 1.79943 6.26383 2.26998 6.55333 2.56143C6.84283 2.85288 7.31353 2.85453 7.60498 2.56518L8.36158 1.81428C8.91763 1.26213 9.64572 1.49103 10.1206 1.96218C10.3738 2.21313 10.5129 2.54658 10.5129 2.90088C10.5129 3.25532 10.3737 3.58877 10.1209 3.83972L7.73638 6.20522C6.64603 7.28701 6.13453 6.77926 5.91628 6.56266C5.62484 6.27332 5.15429 6.27512 4.86479 6.56642C4.57529 6.85771 4.57709 7.32856 4.86854 7.61776C5.36909 8.11456 5.94043 8.36086 6.53938 8.36086C7.27273 8.36086 8.04733 7.99156 8.78383 7.26031L11.1684 4.89482C11.7045 4.36247 12 3.65432 12 2.90073C12 2.14743 11.7045 1.43928 11.1681 0.906631Z"
                fill="white"
              />
            </svg>
          </a>
          <a :href="mergedProjectUrl || '#'" target="_blank">
            <span>Go to the Website</span>
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.77616 2.62266V0.331819C6.77616 0.0656927 7.08099 -0.0918326 7.30571 0.0581659L12.2653 4.06834C12.4626 4.20006 12.4626 4.48447 12.2653 4.61565L7.30571 8.62582C7.08099 8.77582 6.77616 8.61829 6.77616 8.35217V6.22961C3.67786 6.22961 1.05105 7.61347 0.0870944 10C0.0354829 9.68119 0 9.357 0 9.0242C0 5.48876 3.03379 2.62266 6.77616 2.62266Z"
                fill="white"
              />
            </svg>
          </a>
        </div>
      </div>

      <a href="" class="project-publish-modal__url-settings" v-if="!isPublished" @click="openSiteSettings">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.76589 13.7189H6.29427C6.07286 13.7189 5.99562 13.7194 5.2411 11.8501L4.6584 11.6132C3.07068 12.3335 2.88273 12.3335 2.8199 12.3335H2.6984L2.5948 12.2445L1.55159 11.2239C1.39295 11.0655 1.33797 11.0105 2.1543 9.16567L1.9167 8.60353C0 7.91669 0 7.83699 0 7.61066V6.16786C0 5.9418 0 5.87043 1.91035 5.13176L2.14795 4.56839C1.28442 2.75161 1.34384 2.69519 1.51417 2.53484L2.63605 1.43495L2.77537 1.43058C2.94474 1.43058 3.57313 1.65984 4.64468 2.11223L5.22566 1.87634C5.92514 -0.00027329 6.01099 0 6.23165 0H7.70327C7.92372 0 8.00124 0.00027316 8.75576 1.87005L9.33941 2.10519C10.9247 1.38584 11.1151 1.38584 11.1784 1.38584H11.2991L11.4027 1.47333L12.4459 2.49229C12.6046 2.65237 12.6588 2.70715 11.8425 4.55275L12.0808 5.1181C13.9999 5.802 13.9999 5.88143 13.9999 6.10824V7.54933C13.9999 7.77006 13.9999 7.84778 12.0871 8.58687L11.851 9.15071C12.7102 10.9596 12.6534 11.0163 12.4926 11.1784L11.3622 12.2851L11.2221 12.289C11.0535 12.289 10.4265 12.0595 9.35649 11.6066L8.77209 11.8427C8.07069 13.7189 7.99099 13.7189 7.76589 13.7189ZM6.44725 13.1232H7.608C7.74117 12.8517 8.0291 12.1319 8.2596 11.5118L8.30604 11.3884L9.36291 10.9616L9.47655 11.0098C10.1064 11.2784 10.8509 11.5761 11.141 11.6675L11.9567 10.8698C11.8531 10.5826 11.539 9.8799 11.2557 9.28717L11.1985 9.16669L11.6358 8.1228L11.7549 8.07684C12.3911 7.83193 13.1283 7.52959 13.4037 7.39171V6.27098C13.1251 6.13999 12.3908 5.8606 11.7581 5.63625L11.6342 5.592L11.194 4.54708L11.2465 4.42927C11.5173 3.81824 11.8185 3.09745 11.915 2.80706L11.0972 2.0076C10.8332 2.09973 10.0941 2.41648 9.47061 2.701L9.3545 2.75427L8.29764 2.32825L8.25045 2.21071C8.00062 1.58718 7.69022 0.864205 7.55022 0.596557H6.3903C6.25637 0.867347 5.96939 1.58745 5.73945 2.20729L5.69376 2.33002L4.63983 2.75823L4.52618 2.7096C3.89487 2.44148 3.14888 2.14426 2.85781 2.05288L2.04359 2.85111C2.14576 3.13781 2.46081 3.84002 2.74314 4.43276L2.80105 4.5535L2.36157 5.59691L2.24329 5.6426C1.60807 5.88723 0.872127 6.18937 0.596625 6.32671V7.44887C0.875269 7.58034 1.60876 7.86048 2.2411 8.08579L2.36403 8.13052L2.80426 9.17195L2.75174 9.28949C2.48095 9.90004 2.18005 10.6199 2.08327 10.9097L2.90281 11.7116C3.16602 11.6188 3.90422 11.302 4.52844 11.0172L4.64529 10.9637L5.69997 11.3924L5.74716 11.5099C5.99774 12.1336 6.30718 12.8554 6.44725 13.1232ZM6.9999 9.26046C5.65046 9.26046 4.55159 8.18331 4.55159 6.85928C4.55159 5.53627 5.65025 4.4598 6.9999 4.4598C8.34859 4.4598 9.44479 5.53647 9.44479 6.85928C9.44479 8.18331 8.34859 9.26046 6.9999 9.26046ZM6.9999 5.05602C5.97848 5.05602 5.14822 5.86504 5.14822 6.85935C5.14822 7.85434 5.97827 8.66411 6.9999 8.66411C8.01961 8.66411 8.84919 7.85434 8.84919 6.85935C8.84892 5.86504 8.01961 5.05602 6.9999 5.05602Z"
            fill="#555555"
          />
        </svg>

        <span>Change Site Settings</span>
      </a>

      <a href="" @click="openSiteSettings" class="project-publish-modal__url-settings" v-if="isPublished">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.76589 13.7189H6.29427C6.07286 13.7189 5.99562 13.7194 5.2411 11.8501L4.6584 11.6132C3.07068 12.3335 2.88273 12.3335 2.8199 12.3335H2.6984L2.5948 12.2445L1.55159 11.2239C1.39295 11.0655 1.33797 11.0105 2.1543 9.16567L1.9167 8.60353C0 7.91669 0 7.83699 0 7.61066V6.16786C0 5.9418 0 5.87043 1.91035 5.13176L2.14795 4.56839C1.28442 2.75161 1.34384 2.69519 1.51417 2.53484L2.63605 1.43495L2.77537 1.43058C2.94474 1.43058 3.57313 1.65984 4.64468 2.11223L5.22566 1.87634C5.92514 -0.00027329 6.01099 0 6.23165 0H7.70327C7.92372 0 8.00124 0.00027316 8.75576 1.87005L9.33941 2.10519C10.9247 1.38584 11.1151 1.38584 11.1784 1.38584H11.2991L11.4027 1.47333L12.4459 2.49229C12.6046 2.65237 12.6588 2.70715 11.8425 4.55275L12.0808 5.1181C13.9999 5.802 13.9999 5.88143 13.9999 6.10824V7.54933C13.9999 7.77006 13.9999 7.84778 12.0871 8.58687L11.851 9.15071C12.7102 10.9596 12.6534 11.0163 12.4926 11.1784L11.3622 12.2851L11.2221 12.289C11.0535 12.289 10.4265 12.0595 9.35649 11.6066L8.77209 11.8427C8.07069 13.7189 7.99099 13.7189 7.76589 13.7189ZM6.44725 13.1232H7.608C7.74117 12.8517 8.0291 12.1319 8.2596 11.5118L8.30604 11.3884L9.36291 10.9616L9.47655 11.0098C10.1064 11.2784 10.8509 11.5761 11.141 11.6675L11.9567 10.8698C11.8531 10.5826 11.539 9.8799 11.2557 9.28717L11.1985 9.16669L11.6358 8.1228L11.7549 8.07684C12.3911 7.83193 13.1283 7.52959 13.4037 7.39171V6.27098C13.1251 6.13999 12.3908 5.8606 11.7581 5.63625L11.6342 5.592L11.194 4.54708L11.2465 4.42927C11.5173 3.81824 11.8185 3.09745 11.915 2.80706L11.0972 2.0076C10.8332 2.09973 10.0941 2.41648 9.47061 2.701L9.3545 2.75427L8.29764 2.32825L8.25045 2.21071C8.00062 1.58718 7.69022 0.864205 7.55022 0.596557H6.3903C6.25637 0.867347 5.96939 1.58745 5.73945 2.20729L5.69376 2.33002L4.63983 2.75823L4.52618 2.7096C3.89487 2.44148 3.14888 2.14426 2.85781 2.05288L2.04359 2.85111C2.14576 3.13781 2.46081 3.84002 2.74314 4.43276L2.80105 4.5535L2.36157 5.59691L2.24329 5.6426C1.60807 5.88723 0.872127 6.18937 0.596625 6.32671V7.44887C0.875269 7.58034 1.60876 7.86048 2.2411 8.08579L2.36403 8.13052L2.80426 9.17195L2.75174 9.28949C2.48095 9.90004 2.18005 10.6199 2.08327 10.9097L2.90281 11.7116C3.16602 11.6188 3.90422 11.302 4.52844 11.0172L4.64529 10.9637L5.69997 11.3924L5.74716 11.5099C5.99774 12.1336 6.30718 12.8554 6.44725 13.1232ZM6.9999 9.26046C5.65046 9.26046 4.55159 8.18331 4.55159 6.85928C4.55159 5.53627 5.65025 4.4598 6.9999 4.4598C8.34859 4.4598 9.44479 5.53647 9.44479 6.85928C9.44479 8.18331 8.34859 9.26046 6.9999 9.26046ZM6.9999 5.05602C5.97848 5.05602 5.14822 5.86504 5.14822 6.85935C5.14822 7.85434 5.97827 8.66411 6.9999 8.66411C8.01961 8.66411 8.84919 7.85434 8.84919 6.85935C8.84892 5.86504 8.01961 5.05602 6.9999 5.05602Z"
            fill="#555555"
          />
        </svg>

        <span>Change URL</span>
      </a>

      <div class="project-publish-modal__btns">
        <a href="#" class="project-publish-modal__btn" v-if="isPublished">publish</a>
        <a href="#" class="project-publish-modal__btn disabled">unpublish</a>
      </div>

      <transition name="fade">
        <div class="link-copied-alert" v-if="copiedAlert">
          <span class="link-copied-alert__emoji">{{ getEmoji }}</span>
          <span class="link-copied-alert__text">Link copied!</span>
        </div>
      </transition>
    </div>
  </modal>
</template>

<script>
//deprecated?
import Modal from '@/components/Shared/Modal.vue';

export default {
  data() {
    return {
      emoji: [
        '💥',
        '🔥',
        '🌈',
        '⚡️',
        '👌',
        '👍',
        '💪',
        '🖖',
        '🤘',
        '👏',
        '💙',
        '🖤',
        '🧡',
        '💛',
        '💚',
        '😻',
        '🌿',
        '☕️'
      ],
      copiedAlert: false
    };
  },
  props: {
    isVisible: Boolean,
    isPublished: Boolean,
    projectId: String
  },
  components: {
    Modal
  },
  computed: {
    getEmoji: function() {
      return this.emoji[Math.floor(Math.random() * this.emoji.length)];
    },
    project: function() {
      return this.$store.state.project.projects.find(project => {
        return project.id == this.projectId;
      });
    },
    mergedProjectUrl() {
      const domain = process.env.VUE_APP_AIRTAP_DOMAIN;
      return `https://${domain}/w/${this.project.settings.airtapDomain}`;
    }
  },
  methods: {
    closeModal: function(event) {
      if (event) event.preventDefault();
      this.$store.dispatch('ui/closeModal');
    },
    copyUrl: function() {
      navigator.clipboard.writeText(this.mergedProjectUrl || '#');
      this.copiedAlert = true;
      setTimeout(() => {
        this.copiedAlert = false;
      }, 1000);
    },
    openSiteSettings: function(event) {
      if (event) event.preventDefault();

      this.$store.commit('ui/changeSettingsPopupTab', 'domain');

      this.$store.commit('project/changeOpenSiteSettingsId', this.projectId);

      this.$store.dispatch('ui/changeVisibleModalName', {
        newVisibleModalName: 'site-settings'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.link-copied-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  max-width: 350px;
  left: 50%;
  bottom: 10px;
  width: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(130, 130, 130, 0.2);
  padding: 7px 10px;
  transform: translateX(-50%);
  opacity: 1;
  transition: 0.3s;
  font-size: 14px;
  font-weight: 400;
  &__text {
    margin-left: 10px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.project-publish-modal {
  width: 432px;
  height: 496px;
  @include sm-down {
    width: 292px;
    height: 524px;
    padding-left: 14px;
    padding-right: 14px;
  }
  &.project-published {
    @include sm-down {
      height: 496px;
    }
  }
  &__inner {
    height: 100%;
    width: 100%;
  }
  &__url-block {
    background: #000000;
    border-radius: $shape_border_radius;
    padding: 16px;
    margin-bottom: 24px;
    @include sm-down {
      padding: 16px 10px 14px;
    }
    &.light {
      background: #d7e2fc;
      .project-publish-modal__url-link {
        margin-bottom: 0;
      }
    }
  }
  &__url-settings {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 17px;
    color: #555555;
    margin-bottom: 35px;
    text-decoration: none;
    svg {
      margin-right: 5px;
    }
  }
  &__url-link {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    color: #318bf5;
    text-decoration: none;
    display: block;
    background: #ffffff;
    border-radius: $shape_border_radius;
    padding: 6px 12px;
    cursor: pointer;
    margin-bottom: 16px;
    @include sm-down {
      font-size: 12px;
      line-height: 14px;
      padding: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
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
  &__links {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      display: flex;
      text-decoration: none;
      font-size: 14px;
      line-height: 17px;
      color: #ffffff;
      align-items: center;
      &:last-child {
        margin-left: 24px;
      }
      svg {
        margin-left: 8px;
      }
    }
  }
  &__illustration {
    display: block;
    max-width: 100%;
    margin-right: auto;
    margin-bottom: 30px;
    margin-left: auto;
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

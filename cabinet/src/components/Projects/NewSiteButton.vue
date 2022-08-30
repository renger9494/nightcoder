<template>
  <a
    class="new-site-button"
    :class="{ 'new-site-button_large': type === 'large' }"
    href="#"
    @click="redirectToTemplatesPage"
  >
    <svg width="14" height="14" viewbox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.00603 0C3.14729 0 0 3.13793 0 7C0 10.8621 3.13523 14 7.00603 14C10.8648 14 14 10.8621 14 7C14 3.13793 10.8648 0 7.00603 0ZM7.00603 13.0224C3.68992 13.0224 0.988803 10.319 0.988803 7C0.988803 3.68103 3.68992 0.977586 7.00603 0.977586C10.3221 0.977586 13.0233 3.68103 13.0233 7C13.0233 10.319 10.3221 13.0224 7.00603 13.0224Z"
        fill="white"
      ></path>
      <path
        d="M10.2266 6.44444H7.50141V3.70479C7.50141 3.4272 7.28436 3.20996 7.00701 3.20996C6.72966 3.20996 6.51261 3.4272 6.51261 3.70479V6.43237H3.78737C3.51002 6.43237 3.29297 6.64962 3.29297 6.9272C3.29297 7.20479 3.51002 7.42203 3.78737 7.42203H6.51261V10.1496C6.51261 10.4272 6.72966 10.6444 7.00701 10.6444C7.28436 10.6444 7.50141 10.4272 7.50141 10.1496V7.42203H10.2266C10.504 7.42203 10.721 7.20479 10.721 6.9272C10.721 6.64962 10.504 6.44444 10.2266 6.44444Z"
        fill="white"
      ></path>
    </svg>
    <span>
      <slot></slot>
    </span>
  </a>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { VisibleModalType } from '@/store/ui'
import { BaseProjectDto, AccountDto } from '@/utils/api'

export default Vue.extend({
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      projects: (state: any) => <BaseProjectDto[]>state.project.projects,
    }),
    isProjectsLimit(): boolean {
      if (this.user.isAdmin) return false

      return this.projects.length >= this.user.plan.features.draftProjects
    },
  },
  methods: {
    redirectToTemplatesPage(event: Event) {
      if (event) event.preventDefault()

      if (!this.isProjectsLimit) {
        this.$router.push('/templates')
        return
      }

      this.$store.commit('ui/changeVisibleModalName', VisibleModalType.Limit)
    },
  },
})
</script>

<style lang="scss" scoped>
.new-site-button {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  border-radius: $shape_border_radius;
  background-color: #333333;
  padding-top: 7px;
  padding-right: 14px;
  padding-bottom: 7px;
  padding-left: 14px;
  transition: 0.3s;

  &:hover {
    background-color: #000000;
    box-shadow: 0 4px 12px rgba(9, 9, 9, 0.18);
    transform: translateY(-2px);

    svg {
      transform: rotate(90deg);
    }
  }

  svg {
    margin-right: 8px;
    transition: transform 0.5s ease;
  }

  path {
    transition: fill 0.3s;
  }

  span {
    font-size: 13px;
    font-weight: 400;
    color: #ffffff;
    transition: 0.3s;
  }

  &_large {
    border-radius: 6px;
    padding-top: 11px;
    padding-right: 74px;
    padding-bottom: 12px;
    padding-left: 74px;

    svg {
      margin-right: 10px;
    }

    span {
      font-size: 16px;
      letter-spacing: 0.5px;
    }
  }
}
</style>

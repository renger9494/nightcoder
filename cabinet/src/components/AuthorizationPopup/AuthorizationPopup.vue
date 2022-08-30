<template>
  <div class="authorization-popup" @click="handleWrapperClick">
    <sign-up v-if="activeTab === ActiveTabType.SignUp" :onSwitchTabClick="changeActiveTab" />
    <login v-else :onSwitchTabClick="changeActiveTab" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HTMLElementEvent from '@/utils/types/HTMLElementEvent'

import { ActiveTabType } from '@/components/AuthorizationPopup/types'
import Login from '@/components/AuthorizationPopup/Login.vue'
import SignUp from '@/components/AuthorizationPopup/SignUp.vue'

export default Vue.extend({
  components: {
    Login,
    SignUp,
  },
  data() {
    return {
      ActiveTabType,
      activeTab: ActiveTabType.SignUp,
    }
  },
  mounted() {
    document.addEventListener('keyup', this.handleDocumentKeyup)
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.handleDocumentKeyup)
  },
  methods: {
    changeActiveTab(newActiveTab: ActiveTabType) {
      this.activeTab = newActiveTab
    },
    handleWrapperClick(event: HTMLElementEvent<HTMLDivElement>) {
      if (!event.target.closest('.container') && !event.target.closest('.login__tails-wrapper')) {
        this.$store.dispatch('ui/closeModal')
      }
    },
    handleDocumentKeyup(event: KeyboardEvent) {
      if (event && event.key === 'Escape') {
        this.$store.dispatch('ui/closeModal')
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.authorization-popup {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  z-index: 999;

  @media (min-width: 1920px) {
    padding-bottom: 130px;
  }

  @media (max-width: 1919px) and (min-width: 1000px) {
    padding-bottom: 60px;
  }

  @media (max-width: 999px) and (min-width: 768px) {
    padding-bottom: 40px;
  }

  @media (max-width: 767px) {
    padding-bottom: 20px;
  }
}
</style>

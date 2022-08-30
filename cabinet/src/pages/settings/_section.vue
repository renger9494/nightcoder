<template>
  <div>
    <div class="settings">
      <navigation :activeSection="activeSection" />
      <main
        class="settings__content"
        :class="{
        'settings__content_overflow-hidden': activeSection === SectionType.Profile,
      }"
      >
        <profile v-if="activeSection === SectionType.Profile" />
        <accountSettings v-if="activeSection === SectionType.AccountSettings" />
        <notifications v-if="activeSection === SectionType.Notifications" />
        <plans v-if="activeSection === SectionType.Plans" :open-modal="openCancelModal" />
        <!-- billing(v-if="activeSection === 'billing'")-->
        <coupons v-if="activeSection === SectionType.Coupons" />
        <help v-if="activeSection === SectionType.Help" />
        <message
          class="settings__message"
          :emoji="'🎉'"
          :text="'Your settings have been successfully updated!'"
          v-if="visibleMessageName === VisibleMessageNameType.Success"
        />
        <message
          class="settings__message"
          :type="'error'"
          :text="'Something went wrong'"
          v-if="visibleMessageName === VisibleMessageNameType.Failed"
        />
      </main>
    </div>
    <unsubscribe-modal
      v-if="isCancelModalIsOpen"
      :cancel-modal="cancelModal"
      :close-modal="closeModal"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import Navigation from '@/components/Settings/Navigation.vue'
import Profile from '@/components/Settings/Profile/Profile.vue'
import AccountSettings from '@/components/Settings/AccountSettings/AccountSettings.vue'
import UnsubscribeModal from '@/components/Settings/UnsubscribeModal.vue'
import Notifications from '@/components/Settings/Notifications.vue'
import Plans from '@/components/Settings/Plans/Plans.vue'
import Billing from '@/components/Settings/Billing.vue'
import Coupons from '@/components/Settings/Coupons.vue'
import Help from '@/components/Settings/Help.vue'
import Message from '@/components/Settings/Message.vue'

import { VisibleMessageNameType } from '@/store/ui'

enum SectionType {
  Profile = 'profile',
  AccountSettings = 'accountSettings',
  Notifications = 'notifications',
  Plans = 'plans',
  Billing = 'billing',
  Coupons = 'coupons',
  Help = 'help',
}

export default Vue.extend({
  head() {
    return {
      title: 'Settings'
    }
  },
  middleware: ['auth'],
  layout: 'cabinet',
  components: {
    Navigation,
    Profile,
    AccountSettings,
    Notifications,
    Plans,
    Billing,
    Coupons,
    Help,
    Message,
    UnsubscribeModal
  },
  data() {
    return {
      VisibleMessageNameType,
      SectionType,
      isCancelModalIsOpen: false
    }
  },
  computed: {
    ...mapState({
      visibleMessageName: (state: any) => <VisibleMessageNameType>state.ui.visibleMessageName,
    }),
    activeSection(): SectionType {
      const { section } = this.$route.params

      return <SectionType>section
    },
  },
  methods: {
    closeModal() {
      this.isCancelModalIsOpen = false;
    },
    openCancelModal() {
      this.isCancelModalIsOpen = true;
    },
    cancelModal() {}
  }
})
</script>

<style lang="scss" scoped>
.settings {
  position: relative;
  display: flex;
  align-items: stretch;
  min-height: calc(100vh - 529px);
  background-color: #ffffff;
  border: 1px solid #dadada;
  border-radius: 8px;
  margin-top: 40px;
  margin-bottom: 120px;

  @include lg-down {
    display: block;
  }

  @include sm-down {
    margin-top: 20px;
  }

  &__content {
    width: 100%;
    padding: 40px 40px 60px;

    @include xl-down {
      overflow: hidden;
    }

    @include sm-down {
      padding: 30px 20px;
    }

    &_overflow-hidden {
      overflow: hidden;
    }
  }

  &__message {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translate(-50%, 50%);

    @include sm-down {
      position: fixed;
    }

    &.message_visible {
      transform: translateX(-50%);
    }
  }
}
</style>

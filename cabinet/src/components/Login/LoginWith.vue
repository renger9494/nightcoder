<template>
  <div class="login-with">
    <social-login-button
      id="google"
      :action="googleAuthorize"
      social-network="google"
      :button-text="
        isRegisteredPage ? 'Sign up with Google' : 'Log in with Google'
      "
    />
    <social-login-button
      v-if="false"
      id="apple"
      :action="facebookAuthorize"
      social-network="apple"
      :button-text="
        isRegisteredPage ? 'Sign up with Apple' : 'Log in with Apple'
      "
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import SocialLoginButton from '@/components/Login/SocialLoginButton.vue'
import SocialAuth, {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from '@/utils/social-auth'

export default Vue.extend({
  props: {
    isRegisteredPage: { type: Boolean, default: () => false },
  },
  components: {
    SocialLoginButton,
  },
  data() {
    const google = new GoogleLoginProvider(this.$gAuth)
    const facebook = new FacebookLoginProvider(this.$fAuth)

    return {
      errors: [],
      google: new SocialAuth(google),
      facebook: new SocialAuth(facebook),
    }
  },
  methods: {
    googleAuthorize() {
      this.google.autheticated(this.isRegisteredPage)
    },
    facebookAuthorize() {
      this.facebook.autheticated(this.isRegisteredPage)
    },
  },
})
</script>



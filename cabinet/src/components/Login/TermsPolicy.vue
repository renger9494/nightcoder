<template>
  <div class="login-terms">
    <p>
      {{ text }}, you agree to our <a href="/terms"> Terms of Use </a>and to
      receive Airtap emails &amp; updates and acknowledge that you read our
      <a href="privacy-policy"> Privacy Policy</a>.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['text'],
})
</script>

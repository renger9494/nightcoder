<template>
  <div>
    <air-title
      title="Expired link"
      urlImage="/img/login/icons/emoji-sadness.png"
      urlImage2x="/img/login/icons/emoji-sadness@2x.png 2x"
    />
    <div class="forgotPassword__item__container">
      <p class="forgotPassword__description">
        This link has expired. Please check your inbox for the most recent link.
        Also check Spam.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AirTitle from '@/components/Login/Title.vue'

export default Vue.extend({
  components: {
    AirTitle,
  },
})
</script>

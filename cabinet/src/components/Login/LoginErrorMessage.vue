<template>
  <div class="login-error" v-html="errorMessage"></div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['errors'],
  computed: {
    errorMessage(): string {
      var errors = this.errors
      if (!errors || typeof errors['id'] !== 'undefined') return ''

      if (Array.isArray(errors)) {
        return errors.map((error) => error.description).join('<br />')
      }

      return errors
    },
  },
})
</script>

<style lang="scss" scoped></style>

<template>
  <div class="create-website">
    <div class="create-website__title">Create Your First Website</div>
    <new-site-button :type="'large'">New Site</new-site-button>
  </div>
</template>

<style lang="scss" scoped>
.create-website {
  text-align: center;
  padding-top: 70px;

  &__title {
    font-size: 24px;
    font-weight: 300;
    margin-top: 0;
    margin-bottom: 60px;
    color: #000000;

    @include sm-down {
      font-size: 18px;
      margin-bottom: 48px;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import NewSiteButton from '@/components/Projects/NewSiteButton.vue'

export default Vue.extend({
  components: {
    NewSiteButton,
  },
})
</script>

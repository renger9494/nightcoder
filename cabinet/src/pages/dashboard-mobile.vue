<template>
  <div class="page_wrapper dashboard-mobile">
    <h1 class="dashboard-mobile__title">You should login with desktop browser </h1>
    <p class="dashboard-mobile__text">Airtap is working on screen resolution from 1200 px.</p>
    <dashboard-mobile-icon />
  </div>
</template>

<script>
import DashboardMobileIcon from '@/assets/img/main/dashbord-mobile.svg?inline';
export default {
  name: 'dashboard-mobile',
  layout: 'profile',
  components: {
    DashboardMobileIcon
  },
}
</script>

<style lang="scss" scoped>
.dashboard-mobile {
  min-height: calc(100vh - 446px);
  text-align: center;
  padding: 60px 0 115px;
  &__title {
    font-weight: bold;
    font-size: 32px;
    line-height: 40px;
    color: #000000;
    margin: 78px 0 31px;
  }
  &__text {
    font-weight: normal;
    font-size: 18px;
    line-height: 27px;
    font-feature-settings: 'liga' off;
    color: #000000;
    margin: 0 auto 66px;
    max-width: 311px;
  }
}
</style>

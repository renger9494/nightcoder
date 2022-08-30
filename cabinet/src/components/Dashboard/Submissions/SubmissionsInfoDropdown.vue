<template>
  <div class="submissions-info">
    <p class="submissions-info__text">
      Getting new submissions will be restricted when you reach the 10
      submission limit.
    </p>
    <upgrade-to-pro-button class="submissions-info__btn" />
  </div>
</template>

<script>
import UpgradeToProButton from '@/components/Header/UpgradeToProButton.vue'
// '@/components/Shared/SiteSettings/UpgradeToProButton';
export default {
  name: 'SubmissionsInfoDropdown',
  components: { UpgradeToProButton },
}
</script>

<style lang="scss" scoped>
.submissions-info {
  padding: 20px;
  background: $white;
  box-shadow: $shadow_small;
  border-radius: $shape_border_radius;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  &__text {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    margin: 0 0 16px;
  }
}
</style>

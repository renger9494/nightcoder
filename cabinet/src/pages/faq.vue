<template>
  <section class="faq">
    <help :is-title-center="true" title="FAQ" />
  </section>
</template>

<script>
import Help from '@/components/Dashboard/Help.vue';

export default {
  name: 'faq',
  components: { Help },
  layout: 'cabinet',
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <div>
    <div class="templates-list__nothing-found" v-if="templates.length === 0">
      <p class="templates-list__nothing-found-h1">
        No Templates were found for your request
      </p>
      <Empty class="templates-list__empty-list" />
    </div>
    <div v-else class="templates-list">
      <air-template
        v-for="template in templates"
        :key="template.id"
        :template="template"
        :categories="categories"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import AirTemplate from '@/components/Templates/TemplatesList/Template.vue'
import { BaseNameDtoOfInteger, TemplateDto } from '@/utils/api'
import Empty from '@/assets/icons/empty.svg?inline'

export default Vue.extend({
  props: {
    templates: {
      type: Array as PropType<TemplateDto[]>,
      required: true,
    },
    categories: {
      type: Array as PropType<BaseNameDtoOfInteger[]>,
    },
  },
  components: {
    AirTemplate,
    Empty,
  },
})
</script>

<style lang="scss" scoped>
.templates-list {
  display: grid;
  grid-template-columns: 48% 48%;
  grid-gap: 50px 45px;
  justify-content: space-between;

  &__nothing-found {
    width: 100%;
    text-align: center;
  }
  &__nothing-found-p {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: #000000;
    opacity: 0.8;
    margin-bottom: 50px;
  }
  &__nothing-found-h1 {
    width: 100%;
    font-weight: 400;
    font-size: 25px;
    line-height: 38px;
    text-align: center;
    color: #000000;
    margin-top: 0px;
    margin-bottom: 30px;
  }

  &__empty-list {
    margin: 0 auto;
  }
}

@media screen and (max-width: 768px) {
  .templates-list {
    display: grid;
    grid-template-columns: 47% 47%;
    grid-gap: 50px 20px;
    &__nothing-found-h1 {
      font-size: 22px;
      line-height: 33px;
    }
  }
}
@media screen and (max-width: 500px) {
  .templates-list {
    display: grid;
    grid-template-columns: 100%;
    grid-gap: 30px;
    &__nothing-found-p {
      font-size: 12px;
      line-height: 18px;
      margin-bottom: 40px;
    }
    &__nothing-found-h1 {
      width: 100%;
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
    }
  }
}
</style>

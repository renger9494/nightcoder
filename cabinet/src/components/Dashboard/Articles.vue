<template>
  <div class="articles">
    <a
      class="article"
      v-for="(article, index) in articles"
      :key="index"
      :href="article.link"
    >
      <picture>
        <source type="image/webp" :srcset="article.image.fullPathWebP" />
        <source type="image/jp2" :srcset="article.image.fullPathJp2" />
        <img class="article__poster" :src="article.image.fullPath"
      /></picture>
      <p class="article__title">{{ article.title }}</p>
      <div class="article__discription">{{ article.description }}</div>
    </a>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { HelpPageDto } from '@/utils/api'

export default Vue.extend({
  data() {
    return {}
  },
  props: {
    articles: {
      type: Array as PropType<HelpPageDto[]>,
    },
  },
  methods: {},
})
</script>
<style lang="scss">
.articles {
  position: relative;
  background: rgba(173, 187, 255, 0.2);
  padding: 30px 20px;
  display: flex;
  width: calc(100% + 100px);
  margin-left: -50px;
}
.article {
  flex: 0 0 calc(33.333% - 20px);
  width: calc(33.333% - 20px);
  margin-right: 10px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  &__title {
    margin-top: 8px;
    margin-bottom: 4px;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #000000;
  }
  &__poster {
    width: 100%;
    height: 120px;
    object-fit: cover;
    object-position: center;
    border-radius: 6px;
  }
  &__discription {
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: #828282;
  }
}
@media screen and (max-width: 1440px) {
  .articles {
    width: calc(100% + 60px);
    margin-left: -30px;
  }
}
@media screen and (max-width: 475px) {
  .articles {
    display: none;
  }
}
</style>

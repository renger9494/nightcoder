<template>
  <ul class="pagination">
    <li>
      <a
        :class="{ imgStyle__hover: pageNumber > 1 }"
        class="imgStyle imgStyle__default"
        @click="anyPage(pageNumber - 1)"
      >
        <svg-icon
          width="12"
          height="10"
          :color="pageNumber > 1 ? '#000' : '#DADADA'"
          name="VectorLeft"
      /></a>
    </li>
    <li>
      <a
        :class="{ current: pageNumber == 1 }"
        class="pageStyle"
        @click="anyPage(1)"
        >1</a
      >
    </li>
    <li v-if="pageNumber > 3 && totalPages > 4">
      <span class="pageStyle">...</span>
    </li>
    <li v-for="currentPage in totalPages" :key="currentPage">
      <a
        :class="{ current: currentPage == pageNumber }"
        class="pageStyle"
        @click="anyPage(currentPage)"
        v-if="
          currentPage != 1 &&
          currentPage != totalPages &&
          (Math.abs(currentPage - pageNumber) < 2 ||
            (pageNumber < 2 && currentPage < 4) ||
            (pageNumber >= totalPages - 1 && currentPage >= totalPages - 2))
        "
        >{{ currentPage }}</a
      >
    </li>
    <li v-if="pageNumber < 3 && totalPages > 4">
      <span class="pageStyle">...</span>
    </li>
    <li v-if="totalPages > 1">
      <a
        :class="{ current: pageNumber == totalPages }"
        class="pageStyle"
        @click="anyPage(totalPages)"
        >{{ totalPages }}</a
      >
    </li>
    <li>
      <a
        :class="{ imgStyle__hover: pageNumber < totalPages }"
        class="imgStyle imgStyle__default"
        @click="anyPage(pageNumber + 1)"
        ><svg-icon
          width="12"
          height="10"
          :color="pageNumber < totalPages ? '#000' : '#DADADA'"
          name="VectorRight"
      /></a>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    pageNumber: Number,
    totalPages: Number,
  },
  methods: {
    anyPage(currentPage: number) {
      if (currentPage > 0 && currentPage <= this.totalPages) {
        this.$emit('loadingList', currentPage)
      }
    },
  },
})
</script>
<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  margin-top: 40px;
}
.pageStyle {
  display: block;
  width: fit-content;
  height: 15px;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 19px;
  color: #bdbdbd;
  margin: 15px;
  &:hover {
    color: #000000;
  }
}
.imgStyle {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  border: 1px solid #dadada;
  box-sizing: border-box;
  border-radius: 4px;
  margin: 0 10px;

  &__default {
    cursor: default;
  }

  &__hover {
    cursor: pointer;
    &:hover {
      background: #f3f3f3;
    }
  }
}

.current {
  color: #000000;
}
</style>

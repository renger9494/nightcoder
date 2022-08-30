<template>
  <div>
    <h1 v-if="!tagName" class="title">
      Choose a <span class="title__template">template</span> for your project
    </h1>
    <h1 v-else class="title title__tag">
      Responsive {{ tagName }} website templates
    </h1>
    <p class="title__text">
      You can totally customize every template later — from text to whole
      sections or
      <a @click="createDefaultPage">start with a blank page</a>.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {VisibleModalType} from "~/store/ui";
export default Vue.extend({
  props: {
    tagName: {
      type: String,
      required: true,
    },
  },
  methods: {
    createDefaultPage() {
      const { dispatch } = this.$store
      if (window.innerWidth < 1200) {
        dispatch('ui/changeVisibleModalName', {
          newVisibleModalName: VisibleModalType.MobileAlert,
        })
        return
      }
      dispatch('project/createProject', { isWithBlankPage: true })
    },
  },
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 45px;
  line-height: 130%;
  margin-top: 0;
  margin-bottom: 30px;
  font-weight: 700;
  text-align: center;
  &__template {
    font-weight: 700;
    font-size: 45px;
    background: linear-gradient(90deg, #e64afa 0%, #8c38ff 40.1%, #3ca1ff 100%),
      #000000;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  &__tag {
    text-transform: none;
  }
  &__text {
    max-width: 450px;
    text-align: center;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
    margin-bottom: 30px;
    margin-left: auto;
    margin-right: auto;
    a {
      text-decoration: none;
      color: #173bef;
      border-bottom: 1px solid transparent;
      &:hover {
        border-bottom: 1px solid #173bef;
      }
    }
  }
}

@media screen and (max-width: 414px) {
  .title {
    font-size: 30px;
    line-height: 45px;
    margin-bottom: 16px;
    &__text {
      font-size: 13px;
      line-height: 19px;
    }
    &__template {
      font-size: 30px;
    }
  }
}
</style>

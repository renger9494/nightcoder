<template>
  <div class="pages-list">
    <div class="additive-state" v-if="additivePage" @click="createPage">
      <div class="additive-state__preview">
        <div class="additive-state__image">
          <svg-icon
            width="84"
            height="78"
            name="additive-state"
          />
        </div>
      </div>
      <div class="additive-state__text">
        <svg-icon
          class="additive-state__plan-icon"
          width="16"
          height="16"
          color="#000000"
          name="plus"
        />
        <svg-icon
          class="additive-state__icon"
          width="16"
          height="16"
          color="#173BEF"
          name="plus"
        />
        <span>Add new page</span>
      </div>
    </div>
    <page
      v-for="page in projectPages"
      :page="page"
      :key="page.id"
      :pages-count="projectPages.length"
      :projectHref="projectHref"
      :is-last-page="projectPages.length === 1"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Page from '@/components/Pages/Page.vue'
import { BaseProjectPageDto } from '@/utils/api'
import { mapState } from 'vuex'
export default Vue.extend({
  components: {
    Page,
  },
  props: {
     projectPages: {
      type: Array as PropType<BaseProjectPageDto[]>,
    }, 
    additivePage: Boolean,
    projectHref: {
      type: String,
    },
    createPage: Function,
  },
})
</script>

<style lang="scss" scoped>
.additive-state {
  flex: 0 0 calc(20% - 30px);
  width: calc(20% - 30px);
  margin: 0 15px 40px;
  cursor: pointer;
  &:hover {
    .additive-state__preview {
      background: #173bef;
    }
    .additive-state__text {
      color: #173bef;
    }
    .additive-state__plan-icon {
      display: none;
    }
    .additive-state__icon {
      display: block;
    }
  }
  &__icon {
    display: none;
  }
  &__preview {
    padding: 15px;
    position: relative;
    width: 100%;
    height: 240px;
    background: #adbbff;
    border: 1px solid #ebebeb;
    box-sizing: border-box;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
  }
  &__image {
    left: 15px;
    top: 15px;
    width: calc(100% - 30px); //296px;
    height: calc(100% - 30px); //210px;
    //height: 320px;
    // aspect-ratio: 3/2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    //margin: auto;
    border-radius: 6px;
    //-top: 7px;
    background-color: white;
    position: absolute;
    svg {
      margin: auto;
    }
  }
  &__text {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    span {
      margin-left: 4px;
    }
  }

  @include bp(1728px) {
    flex: 0 0 calc(25% - 30px);
    width: calc(25% - 30px);
  }
  @include bp(1440px) {
    flex: 0 0 calc(33.333% - 30px);
    width: calc(33.333% - 30px);
  }
  @include bp(960px) {
    flex: 0 0 calc(50% - 30px);
    width: calc(50% - 30px);
    margin: 0 15px 30px;
  }
  @include bp(480px) {
    flex: 0 0 100%;
    width: 100%;
    margin: 0 0 30px;
    &__preview {
      height: 15em;
    }
  }
}
.pages-list {
  display: flex;
  flex-wrap: wrap;
  margin: 20px -15px 0;

  @media screen and (max-width: 480px) {
    margin: 20px 0 0;
  }
}
</style>

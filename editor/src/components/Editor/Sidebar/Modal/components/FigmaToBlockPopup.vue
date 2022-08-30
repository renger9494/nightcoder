<template>
  <div class="figma-block">
    <div class="figma-block__text" v-if="isError">
      Some thing went wrong
    </div>
    <label class="figma-block__filed">
      <span class="figma-block__filed-placeholder">
        Personal access{{ ' ' }}
        <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="nofollow">tokens</a>
      </span>
      <input v-model="personalAccessToken" class="figma-block__filed-input" type="text" />
    </label>
    <label class="figma-block__filed">
      <span class="figma-block__filed-placeholder">
        Figma{{ ' ' }}
        <a
          href="https://help.figma.com/hc/en-us/articles/360052378433-Bubble-and-Figma#:~:text=Each%20Figma%20file%20has%20a,file%20you%20want%20to%20import."
          target="_blank"
          rel="nofollow"
        >
          file id
        </a>
      </span>
      <input v-model="fileName" class="figma-block__filed-input" type="text" />
    </label>
    <div class="figma-block__btn" :class="{ isLoading }" @click="addBlock">
      {{ isLoading ? 'Loading...' : 'Add Block' }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { FigmaToBlockFactory } from '@/helpers/FigmaToBlockFactory';
import { mapGetters, mapMutations } from 'vuex';
//figd_ByP846K9f4TicnMepW-N7_-Lthfry5wB0BsGnaTV
//iUlKwahjpOSQwE7kFCxwHG

export default Vue.extend({
  name: 'FigmaToBlockPopup',
  data() {
    return {
      personalAccessToken: '',
      fileName: '',
      isLoading: false,
      isError: false
    };
  },
  computed: {
    ...mapGetters({
      blocksSortedBySortId: 'editor/blocksSortedBySortId'
    })
  },
  methods: {
    ...mapMutations({
      addCollectionBlock: 'editor/addCollectionBlock'
    }),
    async addBlock() {
      this.isLoading = true;
      this.isError = false;
      const { blockId, pageId, projectId } = this.$route.params;
      const blockConfig = await new FigmaToBlockFactory(this.personalAccessToken, this.fileName, {
        blockId,
        pageId,
        projectId
      }).getBlockConfig();

      const { commit } = this.$store;

      if (!blockConfig) {
        this.isLoading = false;
        this.isError = true;
      }

      if (blockId) {
        commit('editor/SET_USER_CONFIG_FROM_LOCAL', {
          googleFonts: { fonts: [] },
          components: [blockConfig]
        });
        commit('editor/fillAllComponents');
        commit('editor/actualiseFontList');
      }

      if (pageId && projectId) {
        blockConfig.dbId = -1;
        const lastBlockSortId = this.blocksSortedBySortId[this.blocksSortedBySortId.length - 1]?.sortId ?? 0;
        this.addCollectionBlock({ ...blockConfig, sortId: lastBlockSortId });
      }

      this.isLoading = false;
      commit('editor/SET_POPUP_SETTINGS', { active: false });
    }
  }
});
</script>

<style lang="scss" scoped>
.figma-block {
  padding: 16px 0 0;
  position: relative;
  &__filed {
    display: block;

    &:not(:last-child) {
      margin: 0 0 16px;
    }

    &-placeholder {
      font-size: 12px;
      line-height: 14px;
      margin: 0 0 8px;
      display: block;

      a {
        color: $blue200;
        border-bottom: 1px solid transparent;
        text-decoration: none;

        &:hover {
          border-color: $blue200;
        }
      }
    }

    &-input {
      padding: 7px 8px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      border-radius: $shape_border_radius;
      border: 1px solid $gray100;
      transition: 0.3s;
      width: 100%;

      &:hover {
        border-color: $gray200;
      }

      &:focus {
        border-color: $blue200;
      }
    }
  }
  &__btn {
    border: 1px solid $black;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 36px;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    color: $white;
    background: $black;
    cursor: pointer;
    transition: background 0.3s, color 0.3s, border 0.3s, opacity 0.3s;

    &:hover {
      opacity: 0.8;
    }

    &.isLoading {
      pointer-events: none;
      background: $gray400;
    }
  }
  &__text {
    position: absolute;
    left: 0;
    top: 3px;
    right: 0;
    width: 100%;
    background: rgba($white, 0.9);
    border: 1px solid $danger;
    color: $danger;
    font-size: 13px;
    padding: 8px;
    border-radius: $shape_border_radius;
  }
}
</style>

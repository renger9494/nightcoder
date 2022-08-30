<template>
  <div class="published">
    <div class="published__info">
      <img
        class="published__img"
        src="@/assets/img/editor/published-community-success.png"
        srcset="@/assets/img/editor/published-community-success@2x.png 2x"
        alt="new"
      />
      <div class="published__title">
        <div class="published__title-line">
          Your project «
          <div class="published__title-name">{{ projectName }}</div>
          »
        </div>
        is published in community
      </div>
      <div class="published__domain">
        <publish-input
          class="published__domain-field"
          :url="airtapDomainUrl"
          :is-published="true"
          :is-home-page="true"
          :is-community="true"
        />
      </div>
      <div class="action-btns">
        <a class="btn tweet" target="_blank" :href="linkTweet">
          <svg-icon name="twitter-icon" width="23" height="23" color="#fff" />
          <span>Tweet</span>
        </a>
        <a class="btn facebook" target="_blank" :href="linkShare">
          <svg-icon name="facebook-icon" width="16" height="16" color="#fff" />
          <span>Share</span>
        </a>
      </div>
    </div>
    <div class="published__projects">
      <div class="published__projects-image">
        <img
          src="@/assets/img/publish-popup/projects.png"
          srcset="@/assets/img/publish-popup/projects@2x.png 2x"
          alt=""
        />
        <div class="published__projects-image-background"></div>
        <div class="published__projects-text">
          Make your profile eye-catching & unlock premium features with PRO plan
        </div>
      </div>
      <router-link
        class="published__upgrade-to-pro-button"
        to="/checkout/pro"
        data-text="Become a PRO"
      >
        <svg-icon name="star" width="13" height="13" color="#ffc557" />
        <span>B</span>
        <span>e</span>
        <span>c</span>
        <span>o</span>
        <span>m</span>
        <span>e&nbsp;</span>
        <span>a&nbsp;</span>
        <span>P</span>
        <span>R</span>
        <span>O</span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { PagedProjectDto } from '@/utils/api'
import PublishInput from '@/components/Modal/Publish/PublishInput.vue'
export default Vue.extend({
  components: { PublishInput },
  props: {
    airtapDomainUrl: {
      type: String,
    },
    projectName: {
      type: String,
    },
  },
  computed: {
    linkTweet(): string {
      return `https://twitter.com/share?url=${this.airtapDomainUrl}&amp;text=${this.projectName}%20on%20@aiptap:%20${this.airtapDomainUrl}`
    },
    linkShare(): string {
      return `https://www.facebook.com/sharer.php?u=${this.airtapDomainUrl}&amp;t=${this.projectName}%20on%20@aiptap:%20${this.airtapDomainUrl}`
    },
  },

})
</script>

<style lang="scss" scoped>
.published {
  min-height: 370px;
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: row;
  column-gap: 20px;
  &__info {
    width: 380px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    img {
      width: 155px;
      height: 139px;
    }
  }
  &__title {
    font-style: normal;
    max-width: 380px;
    font-weight: 400;
    font-size: 25px;
    margin-bottom: 20px;
    margin-top: 20px;
    color: #000000;
    align-items: center;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    &-line {
      display: flex;
      flex-wrap: nowrap;
    }

    &-name {
      text-overflow: ellipsis;
      white-space: nowrap;
      //display: inline-block;
      overflow: hidden;
      max-width: 12ch;
      transition: 0.3s;
    }
  }
  &__domain {
    width: 100%;
    margin: 0;

    &-field {
      background: #f3f3f3;
      border-radius: 4px;
      padding: 8px;
      margin: 0 0 47px;
      &-community {
        background: rgba(243, 243, 243, 0.2);
      }

      input {
        width: 100%;
        &::placeholder {
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          line-height: 14px;
          color: #000000;
          opacity: 0.2;
        }
      }
    }
  }
  &__projects {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(100% - 400px);
    height: 428px;
    background: #f3f3f3;
    border-radius: 4px;
    padding: 20px;
    &-image {
      width: 392px;
      height: 354px;
      position: relative;
      &-background {
        width: 100%;
        height: 100%;
        position: absolute;
        background: linear-gradient(
          6.63deg,
          #f3f3f3 21.87%,
          rgba(255, 255, 255, 0) 78.55%
        );
      }

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        object-fit: cover;
        object-position: center;
        opacity: 0.7;
      }
    }
    &-text {
      position: absolute;
      bottom: 20px;
      widows: 100%;
      text-align: center;
      font-weight: 500;
      font-size: 20px;
    }
  }
  &__upgrade-to-pro-button {
    background-color: #000000;
    color: #ffc557;

    &:before {
      padding-left: 23px;
    }

    svg {
      width: 13px;
      fill: #000000;
      margin-right: 10px;
    }
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    line-height: normal;
    text-align: center;
    text-decoration: none;
    border-radius: $shape_border_radius;
    padding: 8px 16px;
    overflow: hidden;
    width: fit-content;
    &:before {
      content: attr(data-text);
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 13px;
      font-weight: 500;
      line-height: normal;
      text-align: center;
      white-space: nowrap;
      padding-top: 8px;
      padding-bottom: 16px;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }

    &:hover {
      &:before {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }

      span {
        opacity: 1;
        transform: translate3d(0, 0, 0);

        &:nth-child(1) {
          transition-delay: 0.045s;
        }

        &:nth-child(2) {
          transition-delay: 0.09s;
        }

        &:nth-child(3) {
          transition-delay: 0.135s;
        }

        &:nth-child(4) {
          transition-delay: 0.18s;
        }

        &:nth-child(5) {
          transition-delay: 0.225s;
        }

        &:nth-child(6) {
          transition-delay: 0.27s;
        }

        &:nth-child(7) {
          transition-delay: 0.315s;
        }

        &:nth-child(8) {
          transition-delay: 0.36s;
        }

        &:nth-child(9) {
          transition-delay: 0.405s;
        }

        &:nth-child(10) {
          transition-delay: 0.45s;
        }
        &:nth-child(11) {
          transition-delay: 0.5s;
        }
      }
    }

    span {
      font-size: 13px;
      font-weight: 500;
      line-height: normal;
      text-align: center;
      transform: translate3d(0, -10px, 0);
      opacity: 0;
      transition: 0.3s;
      transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
    }
  }
}
.action-btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  bottom: 20px;
}

.btn {
  border: 1px solid $gray100;
  box-sizing: border-box;
  border-radius: $shape_border_radius;
  display: flex;
  text-decoration: none;
  align-items: center;
  justify-content: center;
  width: calc(50% - 10px);
  height: 40px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: $black;
  background: transparent;
  border: 1px solid #ebebeb;
  cursor: pointer;
  transition: background 0.3s, color 0.3s, border 0.3s;
  &:hover {
    background: #ececec;
  }
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    overflow: hidden;
    max-width: 12ch;
    transition: 0.3s;
  }
  &.primary {
    background: $black;
    border-color: $black;
    color: $white;
    &:hover {
      background: rgba($black, 0.85);
    }
  }
  &.gray {
    background: #949cad;
    border-color: #949cad;
    color: $white;
  }
  &.transparent {
    background: transparent;
    border-color: #ebebeb;
    color: $white;
  }
  &.blue {
    background: transparent;
    border: 1px solid $blue200;
    color: $blue200;
    transition: 0.3s;

    &:hover {
      background: $blue200;
      color: $white;
    }
  }
  &.black {
    background: $gray100;
    border-color: $gray100;
    color: $black;
  }
  &.loading {
    background: #949cad;
    color: $white;
    svg {
      animation: spin 1s linear infinite;
    }
  }
  &.tweet {
    background: #03a9f4;
    border-color: #03a9f4;
    color: $white;
  }
  &.facebook {
    background: #0680dd;
    border-color: #0680dd;
    color: $white;
  }
  &.tweet,
  &.facebook {
    transition: 0.3s;
    &:hover {
      opacity: 0.8;
    }
  }
  &.iconed {
    &--right {
      svg {
        margin-right: 0;
        margin-left: 8px;
      }
    }
    .setting_icon {
      fill: $white;
    }
  }
  &.long {
    width: 100%;
  }
  &:disabled,
  &[disabled] {
    opacity: 0.4;
    background: $black !important;
    pointer-events: none;
  }
  svg {
    margin-right: 8px;
  }
}
</style>

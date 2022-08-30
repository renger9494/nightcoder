<template>
  <article class="case-item" :class="{ 'case-item--long' : !!data.descr }">
    <a href="#" class="case-item__img">
      <div class="case-item__link">
        <p class="case-item__link-text">View Site</p>
        <arrow-right />
      </div>
      <picture>
        <source srcset="@/assets/img/main/design_cards/2.png, @/assets/img/main/design_cards/2.png 2x">
        <img src="@/assets/img/main/design_cards/2.png" alt="airtap img" />
      </picture>
    </a>
    <div class="case-item__content">
      <div class="case-item__person">
        <div class="case-item__person-img">
          <picture>
            <source srcset="@/assets/img/main/avatars/03.png, @/assets/img/main/avatars/03-x2.png 2x">
            <img src="@/assets/img/main/avatars/03.png" alt="airtap img" />
          </picture>
        </div>
        <p class="case-item__person-name">{{ data.name }}</p>
      </div>
      <h3 class="case-item__title">{{ data.title }}</h3>
      <h4 class="case-item__descr" v-if="data.descr">{{ data.descr }}</h4>
      <div class="case-item__tags">
        <nuxt-link
          v-for="(item, index) in data.tags"
          :key="index"
          class="case-item__tag"
          :to="`/templates/tag/${item.toLowerCase()}`"
        >
          {{ item }}
        </nuxt-link>
      </div>
    </div>
  </article>
</template>

<script>
import ArrowRight from '@/assets/icons/menu-arrow.svg?inline';

export default {
  name: 'case-item',
  components: {
    ArrowRight
  },
  props: {
    data: {
      type: Object,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.case-item {
  &--long {
    display: flex;
    justify-content: space-between;

    .case-item {
      &__content {
        flex: 0 0 calc(40% - 10px);
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      &__img {
        flex: 0 0 calc(60% - 10px);
        padding-bottom: 35%;
      }
    }
    @include bp($sm) {
      display: block;
      flex-direction: column;
      .case-item {
        &__content {
          display: block;
          flex-direction: unset;
          justify-content: unset;
          flex: unset;
        }
        &__img {
          flex: unset;
          padding-bottom: 60%;
        }
      }
    }
  }
  &__img {
    display: block;
    padding-bottom: 60%;
    margin: 0 0 20px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;

    img {
      position: absolute;
      object-fit: cover;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }

    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65));
      opacity: 0;
      transition: 0.3s;
    }

    &:hover {
      &:after {
        opacity: 1;
      }
      .case-item__link {
        opacity: 1;
      }
    }
  }
  &__link {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
    display: flex;
    align-items: center;
    transition: 0.3s;
    opacity: 0;

    &-text {
      font-weight: 500;
      font-size: 26px;
      line-height: 39px;
      text-decoration: none;
      color: $white;
    }

    svg {
      @include size(26px, 16px);
      margin: 0 0 0 14px;
      path {
        fill: $white;
      }
    }
  }
  &__person {
    display: flex;
    align-items: center;
    margin: 0 0 14px;
    &-img {
      border-radius: 50%;
      background: #C4C4C4;
      @include size(36px);
      margin: 0 14px 0 0;
      position: relative;

      img {
        position: absolute;
        object-fit: cover;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
      }
    }
    &-name {
      font-size: 14px;
      line-height: 21px;
    }
  }
  &__title {
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    margin: 0 0 18px;
  }
  &__tags {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -7px -7px;
  }
  &__tag {
    padding: 5px 10px;
    border: 1px solid rgba(218, 218, 218, 0.4);
    border-radius: 11px;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    margin: 0 7px 7px;
    color: $white;
    text-decoration: none;
    transition: 0.3s;

    &:hover {
      background: $white;
      color: $black;
    }
  }
  &__descr {
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    margin: 0 0 20px;
  }

  @include bp($md) {
    &__img {
      border-radius: 8px;
      margin: 0 0 13px;
    }
    &__person {
      margin: 0 0 12px;
      &-img {
        @include size(24px);
      }
      &-name {
        font-size: 12px;
        line-height: 18px;
      }
    }
    &__title {
      font-size: 18px;
      line-height: 27px;
    }
    &__descr {
      font-size: 14px;
      line-height: 21px;
      margin: 0 0 14px;
    }
  }
}
</style>

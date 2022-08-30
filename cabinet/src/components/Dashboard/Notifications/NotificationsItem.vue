<template>
  <div>
    <div v-if="isPro" class="notifications-item notifications-item__isPro">
      <nuxt-link to="/checkout/pro" class="notifications-item__pro">
        <svg-icon name="star" width="13" height="13" color="#FFC557" />
        <span class="notifications-item__pro-text">
          You’ve reached the 3 project limit on your Free plan.
          <span>
            <span>U</span>
            <span>p</span>
            <span>g</span>
            <span>r</span>
            <span>a</span>
            <span>d</span>
            <span>e&nbsp;</span>
            <span>t</span>
            <span>o&nbsp;</span>
            <span>P</span>
            <span>R</span>
            <span>O</span> </span
          >.
        </span>
      </nuxt-link>
      <p class="notifications-item__date">
        {{ data.createdUtcDateTime | lastDate }}
      </p>
    </div>
    <div
      class="notifications-item"
      :class="{ 'notifications-item--header': isHeader }"
    >
      <div
        class="notifications-item__dot"
        v-if="!data.isRead"
        :class="{ isNew: !data.isRead }"
      ></div>
      <a class="notifications-item__avatar" :href="`/${data.whoMade.alias}`">
        <picture v-if="data.whoMade.avatar">
          <source
            v-if="data.whoMade.avatar.fullPathWebP"
            type="image/webp"
            :srcset="data.whoMade.avatar.fullPathWebP.replace(' ', '%20')"
          />
          <source
            v-if="data.whoMade.avatar.fullPathJp2"
            type="image/jp2"
            :srcset="data.whoMade.avatar.fullPathJp2.replace(' ', '%20')"
          />
          <img
            class="notifications-item__image user"
            v-if="data.whoMade.avatar.fullPath"
            :src="data.whoMade.avatar.fullPath"
          />
        </picture>
        <avatar
          v-else
          size="30"
          :name="!!data.whoMade.fullName ? data.whoMade.fullName : 'itmeo'"
          class="notifications-item__avatar__image user"
        />
      </a>
      <a
        v-if="data.whoMade && data.whoMade"
        class="notifications-item__link"
        :href="`/${data.whoMade.alias}`"
        >{{ data.whoMade.fullName }}</a
      >
      <p class="notifications-item__text">
        {{
          data.action === NotificationAction.ProjectLike
            ? 'appreciated your project'
            : 'started following you.'
        }}
      </p>
      <div
        v-if="data.action === NotificationAction.ProjectLike && data.project"
        class="notifications-item__project"
      >
        <a :href="data.project.url">
          <picture v-if="data.project && data.project.preview">
            <source
              v-if="data.project.preview.fullPathWebP"
              type="image/webp"
              :srcset="data.project.preview.fullPathWebP.replace(' ', '%20')"
            />
            <source
              v-if="data.project.preview.fullPathJp2"
              type="image/jp2"
              :srcset="data.project.preview.fullPathJp2.replace(' ', '%20')"
            />

            <img
              class="notifications-item__image project-page"
              v-if="data.project.preview.fullPath"
              :src="data.project.preview.fullPath"
            />
          </picture>
          <img
            v-else
            :src="getPlaceholderUrl()"
            alt="airtap"
            class="notifications-item__image project-page"
        /></a>
        <a class="notifications-item__link" :href="data.project.url"
          >{{ data.project.name }}.</a
        >
      </div>
      <p class="notifications-item__date">
        {{ data.createdUtcDateTime | lastDate }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import SvgIcon from '@/components/Shared/SvgIcon.vue'
import { NotificationDto, NotificationAction } from '@/utils/api'
import { getPlaceholderUrl } from '@/utils/images'
import Avatar from '@/components/Header/avatar/Avatar.vue'
export default Vue.extend({
  name: 'NotificationsItem',
  components: { SvgIcon, Avatar },
  props: {
    data: {
      type: Object as PropType<NotificationDto>,
      required: true,
    },
    isHeader: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    isProPlan: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    index: {
      type: Number,
      required: false,
      default: () => 1,
    },
  },
  computed: {
    isPro(): boolean {
      return !this.isProPlan && this.index % 4 === 0
    },
  },
  methods: {
    getPlaceholderUrl() {
      return getPlaceholderUrl()
    },
  },
  data() {
    return {
      NotificationAction,
    }
  },
})
</script>

<style lang="scss" scoped>
.notifications-item {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid $gray200;
  padding: 0 0 16px;
  margin: 0 0 16px;

  &--header {
    border-bottom: unset;
    padding: 0;
  }
  &__dot {
    @include size(8px);
    flex: 0 0 8px;
    background: $gray200;
    border-radius: 50%;

    &.isNew {
      background: #173bef;
    }
  }
  &__link {
    font-size: 13px;
    line-height: normal;
    text-decoration: none;
    color: #173bef;
    font-weight: 500;
    transition: 0.3s;
    border-bottom: 1px solid transparent;

    &:hover {
      border-color: #173bef;
    }
  }
  &__project {
    display: flex;
    align-items: center;
  }
  &__image {
    flex: 0 0 30px;

    &.user {
      border-radius: 50%;
      @include size(30px);
    }

    &.project-page {
      border-radius: $shape_border_radius;
      margin-right: 8px;
      @include size(30px, 24px);
    }
  }
  &__text {
    font-size: 13px;
    line-height: 20px;
  }
  &__date {
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: $gray700;
    margin: 0 0 0 auto;
    white-space: nowrap;
  }
  &__pro {
    display: flex;
    align-items: center;
    padding: 5px 8px;
    border-radius: $shape_border_radius;
    background: $black;
    margin: 0 8px 0 0;
    text-decoration: none;

    svg {
      flex: 0 0 13px;
      margin: 0 8px 0 0;
    }

    &-text {
      font-size: 13px;
      line-height: 20px;
      color: $white;
      & > span {
        font-weight: 600;
        color: #ffc557;
        position: relative;

        &:before {
          content: 'Upgrade to PRO';
          box-sizing: border-box;
          position: absolute;
          top: auto;
          left: 0;
          width: 100%;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          color: #ffc557;
          white-space: nowrap;
          transition: 0.3s;
          transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
        }

        & > span {
          display: table-cell;
          font-size: 14px;
          font-weight: 500;
          color: #ffc557;
          transform: translate3d(0, -10px, 0);
          opacity: 0;
          transition: 0.3s;
          transition-timing-function: cubic-bezier(0.75, 0, 0.125, 1);
        }
      }
    }

    &:hover {
      .notifications-item__pro-text > span:before {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }

      .notifications-item__pro-text > span > span {
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
          transition-delay: 0.495s;
        }

        &:nth-child(12) {
          transition-delay: 0.54s;
        }

        &:nth-child(13) {
          transition-delay: 0.585s;
        }
      }
    }
  }
}
</style>

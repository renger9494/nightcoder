<template>
  <div>
    <div class="feed-user" v-for="user in users" :key="user.userName">
      <a class="feed-user__link" :href="`/${user.userName}`">
        <picture v-if="user.avatar">
          <source
            v-if="user.avatar.fullPathWebP"
            type="image/webp"
            :srcset="user.avatar.fullPathWebP.replace(' ', '%20')"
          />
          <source
            v-if="user.avatar.fullPathJp2"
            type="image/jp2"
            :srcset="user.avatar.fullPathJp2.replace(' ', '%20')"
          />
          <img
            class="feed-user__avatar"
            v-if="user.avatar.fullPath"
            :src="user.avatar.fullPath"
          />
        </picture>
        <avatar
          v-else
          size="48"
          :name="!!user.fullName ? user.fullName : 'itmeo'"
          class="feed-user__avatar"
        />
      </a>

      <div class="feed-user__info">
        <div
          @click="goToUserProfile(user.userName)"
          class="feed-user__fullName"
        >
          {{ user.fullName }}
        </div>
        <div class="feed-user__bio">
          {{ user.bio }}
        </div>
      </div>

      <div class="feed-user__subscription">
        <button-follow
          @change="followUser(user)"
          :is-followed="user.followed"
          :is-owned="user.owned"
        />
        <span
          :class="{ 'feed-user__subscription__span__long': user.followed }"
          class="feed-user__subscription__span"
          v-show="user.followsYou"
        >
          follows you
        </span>
      </div>

      <ul v-if="user.projects" class="feed-user__projects">
        <li
          v-for="(project, index) in user.projects"
          :key="`${user.userName}'_'${project.name}'_'${index}`"
        >
          <a :href="project.url">
            <div
              class="feed-user__project__preview"
              :style="{
                'background-color':
                  project.preview && project.preview.dominantColor
                    ? project.preview.dominantColor
                    : '#1B53C0',
              }"
            >
              <picture v-if="project.preview">
                <source
                  v-if="project.preview.fullPathWebP"
                  type="image/webp"
                  :srcset="project.preview.fullPathWebP.replace(' ', '%20')"
                />
                <source
                  v-if="project.preview.fullPathJp2"
                  type="image/jp2"
                  :srcset="project.preview.fullPathJp2.replace(' ', '%20')"
                />

                <img
                  v-if="project.preview.fullPath"
                  :src="project.preview.fullPath"
                />
              </picture>
              <img v-else :src="getPlaceholderUrl()" alt="" />
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { WelcomeProfileDto } from '@/utils/api'
import Avatar from '~/components/Header/avatar/Avatar.vue'
import { getPlaceholderUrl } from '@/utils/images'
export default Vue.extend({
  components: {
    Avatar,
  },
  props: {
    users: Array as PropType<WelcomeProfileDto[]>,
  },
  methods: {
    getPlaceholderUrl() {
      return getPlaceholderUrl()
    },
    goToUserProfile(userName: string) {
      this.$router.push(`/${userName}`)
    },
    followUser(user: WelcomeProfileDto) {
      this.$emit('followUser', user)
    },
    avatarName(name: string): string {
      return !!name ? name : 'itmeo'
    },
  },
})
</script>
<style lang="scss" scoped>
.feed-user {
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #ebebeb;
  display: grid;
  grid-template-columns: 58px 204px 1fr;
  grid-row-gap: 20px;
  grid-template-rows: 48px 80px;
  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
    margin-right: 10px;
    overflow: hidden;
  }
  &__link {
    position: relative;
    width: 48px;
    height: 48px;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transition: 0.3s;
      opacity: 0;
      background: rgba($black, 0.4);
    }
    &:hover {
      &:before {
        opacity: 1;
      }
      & ~ .feed-user__info > div > .feed-user__fullName {
        color: #173bef;
        border-bottom: 1px solid #173bef;
      }
    }
  }
  &__subscription {
    align-items: flex-end;
    flex-direction: column;
    display: flex;
    grid-column: 3/4;
    &__span {
      opacity: 0.8;
      font-size: 10px;
      margin-top: 8px;
      background: #f3f3f3;
      border-radius: 4px;
      padding: 0px 8px;
      width: fit-content;
      margin-right: 13px;
      &__long {
        margin-right: 21px;
      }
    }
  }
  &__info {
    grid-column: 2/3;
  }
  &__fullName {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    width: fit-content;
    outline: none;
    color: #000000;
    border-bottom: 1px solid transparent;
    transition: 0.3s;
    &:hover {
      color: #173bef;
      font-weight: 500;
      border-bottom: 1px solid #173bef;
    }
  }
  &__bio {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 95%;

    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #949cad;
  }

  &__projects {
    width: 100%;
    grid-column: 1/4;
    flex-wrap: wrap;
    -webkit-box-pack: end;
    //justify-content: space-between;
    grid-gap: 8px;
    margin-left: auto;
    max-height: 80px;
    overflow: hidden;
    display: flex;
  }
  &__project__preview {
    height: 80px;
    width: 124px;
    border-radius: 12px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
      transition: 0.3s;
      opacity: 0;
      background: rgba($black, 0.4);
    }

    &:hover {
      &:before {
        opacity: 1;
      }
    }

    img {
      margin: 6px 6px;
      width: 112px;
      height: 68px;
      border-radius: 8px;
      background-color: white;
    }
  }
}
</style>

<template>
  <div class="followers">
    <div class="followers__empty" v-if="!isFollowers">
      <div v-if="isOwned">
        <span>You don't have any followers yet </span>
        <air-button
          class="followers__empty__button"
          tag="a"
          :isActive="true"
          href="/feed"
        >
          Discover our best creators
        </air-button>
      </div>

      <div v-else>{{ userFullName }} doesn't have any followers yet</div>
      <img src="/img/dashboard/empty_state.svg" alt="empty state airtap" />
    </div>
    <div v-else>
      <p class="followers__header-1">Followers</p>
      <ul class="followers__list">
        <template v-if="!isLoading">
          <li
            class="followers__follower"
            v-for="follower in followers"
            :key="follower.userName"
          >
            <a class="followers__link" :href="`/${follower.userName}`">
              <picture v-if="follower.avatar">
                <source
                  v-if="follower.avatar.fullPathWebP"
                  type="image/webp"
                  :srcset="follower.avatar.fullPathWebP.replace(' ', '%20')"
                />
                <source
                  v-if="follower.avatar.fullPathJp2"
                  type="image/jp2"
                  :srcset="follower.avatar.fullPathJp2.replace(' ', '%20')"
                />
                <img
                  class="followers__avatar"
                  v-if="follower.avatar.fullPath"
                  :src="follower.avatar.fullPath"
                />
              </picture>
              <avatar
                v-else
                size="100"
                :name="!!follower.fullName ? follower.fullName : 'itmeo'"
                class="followers__avatar"
              />
            </a>

            <div class="followers__user-info">
              <div>
                <a :href="`/${follower.userName}`" class="followers__fullName">
                  {{ follower.fullName }}
                </a>
                <span
                  class="followers__subscription__mobile-span"
                  v-if="!follower.owned"
                  v-show="follower.followsYou"
                >
                  follows you
                </span>
              </div>
              <div class="followers__bio">
                {{ follower.bio }}
              </div>
              <div class="followers__other-info">
                <div class="followers__subscription">
                  <button-follow
                    @change="followUser(follower)"
                    :is-followed="follower.followed"
                    :is-owned="follower.owned"
                  />
                  <span
                    class="followers__subscription__span"
                    v-if="!follower.owned"
                    v-show="follower.followsYou"
                  >
                    follows you
                  </span>
                </div>
                <ul class="followers__total-operation">
                  <li @click="showFollowers(follower.userName)">
                    <span>followers</span>
                    <p>{{ follower.followers }}</p>
                  </li>
                  <li @click="showFollowing(follower.userName)">
                    <span>following</span>
                    <p>{{ follower.following }}</p>
                  </li>
                  <li>
                    <span>likes</span>
                    <p>{{ follower.likes }}</p>
                  </li>
                </ul>
              </div>
            </div>
            <ul v-if="follower.projects" class="followers__userProjects">
              <li v-for="project in follower.projects" :key="project.name">
                <a :href="project.url">
                  <div
                    class="followers__projectPreview"
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
                        :srcset="
                          project.preview.fullPathWebP.replace(' ', '%20')
                        "
                      />
                      <source
                        v-if="project.preview.fullPathJp2"
                        type="image/jp2"
                        :srcset="
                          project.preview.fullPathJp2.replace(' ', '%20')
                        "
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
          </li>
        </template>
        <template v-else>
          <li
            class="followers__follower skeleton"
            v-for="item in 2"
            :key="`${item}skeleton`"
          >
            <div class="skeleton__avatar">
              <skeleton max-width="100%" height="100" width="100" radius="50" />
              <skeleton max-width="100%" height="19" width="150" radius="4" />
            </div>
            <div class="skeleton__project">
              <skeleton max-width="100%" height="140" width="182" radius="8" />
              <skeleton max-width="100%" height="140" width="182" radius="8" />
            </div>
          </li>
        </template>
      </ul>
      <pagination
        v-if="totalPages > 1"
        :pageNumber="pageNumber"
        :totalPages="totalPages"
        @loadingList="loadingList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProfileFollowerDto } from '@/utils/api'
import apiClient from '@/utils/apiClient'
import Pagination from '@/components/Shared/Pagination.vue'
import ButtonFollow from '@/components/Settings/Profile/ButtonFollow.vue'
import AirButton from '@/components/Settings/Button.vue'
import { mapState } from 'vuex'
enum ActiveSection {
  Projects = 'projects',
  Followers = 'followers',
  Following = 'following',
}
import Avatar from '~/components/Header/avatar/Avatar.vue'
import Skeleton from '@/components/Shared/ui/skeleton.vue'
import {getPlaceholderUrl} from '@/utils/images'
export default Vue.extend({
  components: { Skeleton, Avatar, Pagination, ButtonFollow, AirButton },
  props: {
    userFullName: {
      type: String,
      default: '',
    },
    isOwned: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      followers: [] as ProfileFollowerDto[],
      userName: this.$route.params.alias,
      pageNumber: 1 as Number,
      totalPages: 1 as Number,
      filter: {} as any,
      isFollowers: true,
      isLoading: true,
    }
  },
  async mounted() {
    try {
      const { data } = await apiClient.profiles.profilesGetFollowers(
        this.userName,
        {
          PageSize: 24,
          PageNumber: this.$route.query.PageNumber
            ? Number(this.$route.query.PageNumber)
            : 1,
        }
      )
      this.followers = data.items
      this.isFollowers = data.items.length > 0
      this.totalPages = data.pagination.totalPages
      this.pageNumber = data.pagination.pageNumber
      this.filter = { PageSize: 24, PageNumber: this.pageNumber }
      this.isLoading = false
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapState({
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
    }),
  },
  methods: {
     getPlaceholderUrl(){
      return getPlaceholderUrl()
    },
    goToCreators() {
      this.$router.push(`/feed`)
    },
    followUser(follower: ProfileFollowerDto) {
      if (!this.isUserLoggedIn) {
        this.$router.push({
          path: '/login',
          query: { redirectUrl: this.$route.fullPath },
        })
        return
      }
      if (follower.owned) {
        this.$router.push({
          path: '/settings/profile',
        })
        return
      }
      if (!follower.userName) {
        return
      }
      apiClient.profiles
        .profilesToggleProfileFollow(follower.userName)
        .then(() => {
          follower.followed = !follower.followed
          follower.followers = follower.followers + (follower.followed ? 1 : -1)
        })
        .catch((error) => {})
    },
    showNextFollowers() {
      apiClient.profiles
        .profilesGetFollowers(this.userName, this.filter)
        .then(({ data }) => {
          this.followers = data.items
        })
        .catch((error) => {})
    },
    loadingList(currentPage: Number) {
      this.pageNumber = currentPage
      this.filter.PageNumber = currentPage
      this.changeRouteQuery()
      this.showNextFollowers()
    },
    changeRouteQuery() {
      this.$router.replace({
        query: { PageNumber: this.filter.PageNumber },
      })
    },
    showFollowers(userName: string | undefined) {
      this.$router.push({
        path: `/${userName}/${ActiveSection.Followers}`,
      })
    },
    showFollowing(userName: string | undefined) {
      this.$router.push({
        path: `/${userName}/${ActiveSection.Following}`,
      })
    },
    avatarName(name: string): string {
      return !!name ? name : 'itmeo'
    },
  },
})
</script>

<style lang="scss">
.followers {
  margin: 30px $margin_page_high_resolution * 2;
  &__empty {
    font-size: 25px;
    line-height: 38px;
    text-align: center;
    color: #000000;
    padding-top: 20px;
    &__button {
      margin-top: 15px;
      font-family: 'Poppins', sans-serif;
    }
    div {
      max-width: 420px;
      margin: auto;
    }
    img {
      width: 138px;
      height: 170px;
      margin-top: 50px;
      margin-bottom: 90px;
      background: #ffffff;
    }
  }
  &__header-1 {
    font-size: 25px;
    line-height: 37px;
  }
  &__list {
    display: grid;
  }

  &__follower {
    padding-bottom: 15px;
    padding-top: 15px;
    border-bottom: 1px solid #dadada;
    display: grid;
    grid-template-columns: 115px 400px 1fr;
    &:last-child {
      border-bottom: 1px solid transparent;
    }
  }
  &__avatar {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    margin-right: 15px;
    overflow: hidden;
  }
  &__link {
    position: relative;
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
      & ~ .followers__user-info > div > .followers__fullName {
        color: #173bef;
        border-bottom: 1px solid #173bef;
      }
    }
  }
  &__subscription {
    align-items: center;
    flex-direction: column;
    display: flex;
    &__span {
      opacity: 0.8;
      font-size: 10px;
      margin-top: 10px;
      background: #f3f3f3;
      border-radius: 4px;
      padding: 0px 8px;
      width: fit-content;
    }
    &__mobile-span {
      display: none;
    }
  }
  &__fullName {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-decoration: none;
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
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    font-size: 13px;
    line-height: 156.2%;
    color: #000000;
    opacity: 0.8;
    margin: 5px 0px 5px 0px;
    max-height: 60px;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
  }
  &__other-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 20px;
  }

  &__total-operation {
    max-width: 350px;
    display: flex;
    li {
      display: inline-block;
      margin-right: 25px;
      font-size: 10px;
      line-height: 15px;
      color: $black;
      cursor: pointer;
      transition: 0.3s;
      span {
        opacity: 0.8;
        font-size: 10px;
      }
      p {
        font-weight: 500;
        font-size: 14px;
        line-height: 21px;
        opacity: 1;
        margin-top: 0;
        margin-left: 0;
      }
      &:hover {
        color: #173bef;
        &:last-child {
          color: #000000;
          cursor: default;
        }
      }
    }
  }
  &__userProjects {
    /* display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(3, 182px); */
    flex-wrap: wrap;
    -webkit-box-pack: end;
    justify-content: flex-end;
    margin-left: auto;
    max-height: 140px;
    overflow: hidden;
    display: flex;
  }
  &__projectPreview {
    height: 140px;
    width: 182px;
    border-radius: 8px;
    position: relative;
    margin-left: 10px;

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
      margin: 12px 12px;
      width: 158px;
      height: 116px;
      border-radius: 8px;
      background-color: white;
    }
  }
}

.skeleton {
  display: flex;
  &__avatar {
    display: flex;
    .skeleton {
      &:first-child {
        flex: 0 0 100px;
        margin-right: 15px;
      }
      &:nth-child(2) {
        flex: 0 0 150px;
      }
    }
  }

  &__project {
    margin: 0 0 0 auto;
    display: flex;
    .skeleton {
      flex: 0 0 182px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .followers {
    margin: 30px 70px;
  }
}

@media screen and (max-width: 850px) {
  .followers {
    &__header-1 {
      font-size: 22px;
      line-height: 33px;
    }

    &__follower {
      grid-template-columns: 120px 287px 1fr;
    }

    &__bio {
      line-height: 20px;
      margin: 5px 0 5px 0;
    }
    &__other-info {
      margin-top: 10px;
    }

    &__total-operation {
      width: 155px;
      // margin-right: 15px;
      li {
        margin-right: 20px;
        p {
          font-size: 13px;
          line-height: 20px;
        }
      }
    }
    &__userProjects {
      max-height: 106px;
    }
    &__projectPreview {
      height: 106px;
      width: 140px;
      border-radius: 7px;
      img {
        margin: 9px 9px;
        width: 122px;
        height: 88px;
        border-radius: 7px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .followers {
    margin: 30px $margin_page_tablet;
  }
}

@media screen and (max-width: 645px) {
  .followers {
    &__header-1 {
      font-size: 18px;
      line-height: 27px;
    }
    &__list {
      display: grid;
    }

    &__follower {
      grid-template-columns: 58px 1fr;
      align-items: flex-start;
      &:last-child {
        border-bottom: 1px solid transparent;
      }
    }
    &__link {
      display: flex;

      picture {
        display: flex;
      }
    }
    &__avatar {
      width: 58px;
      height: 58px;
      border-radius: 50px;
      margin: 0;

      svg {
        @include size(100%);
      }
    }
    &__user-info {
      margin-right: 0;
      padding: 0 0 0 10px;
      display: flex;
      justify-content: space-between;
    }

    &__subscription {
      margin-left: 10px;
      align-items: center;
      flex-direction: column;
      display: flex;
      &__span {
        display: none;
      }
      &__mobile-span {
        display: block;
        opacity: 0.8;
        font-size: 10px;
        margin-top: 10px;
        background: #f3f3f3;
        border-radius: 4px;
        padding: 0px 8px;
        width: fit-content;
      }
    }
    &__fullName {
      font-size: 16px;
      line-height: 24px;
      word-break: break-all;
    }
    &__bio {
      display: none;
    }
    &__other-info {
      display: flex;
      justify-content: space-between;
      margin-top: 0px;
    }

    &__total-operation {
      display: none;
    }
    &__userProjects {
      display: grid;
      grid-gap: 9px;
      margin-top: 15px;
      grid-template-columns: 30% 30% 30%;
      width: 100%;
      grid-column: 1/3;
      justify-content: space-between;
      max-height: 136px;
    }
    &__projectPreview {
      margin: 0px;
      //height: 80px;
      //width: 109px;
      width: auto;
      height: auto;
      border-radius: 5px;
      position: relative;
      padding-bottom: 75%;
      img {
        margin: 0px;
        // margin: 7px 7px;
        //width: 95px;
        //height: 66px;
        width: auto;
        height: auto;
        border-radius: 5px;
        width: 86%;
        height: 82%;
        object-fit: cover;
        object-position: center;
        position: absolute;
        left: 7%;
        top: 9%;
      }
    }
  }
}
@media screen and (max-width: 414px) {
  .followers {
    margin: 30px $margin_page_mobile;
  }
}
</style>

<template>
  <div class="publicProfile">
    <div class="publicProfile__cover-image">
      <picture v-if="userProfile.cover">
        <source
          v-if="userProfile.cover.fullPathWebP"
          type="image/webp"
          :srcset="userProfile.cover.fullPathWebP.replace(' ', '%20')"
        />
        <source
          v-if="userProfile.cover.fullPathJp2"
          type="image/jp2"
          :srcset="userProfile.cover.fullPathJp2.replace(' ', '%20')"
        />
        <img
          v-if="userProfile.cover.fullPath"
          :src="userProfile.cover.fullPath"
        />
      </picture>
      <cover-background
        v-else-if="avatarName"
        height="250px"
        :user-name="avatarName"
      />
    </div>
    <div class="publicProfile__content">
      <div class="publicProfile__glav-info">
        <div class="publicProfile__avatar">
          <picture v-if="userProfile.avatar">
            <source
              v-if="userProfile.avatar.fullPathWebP"
              type="image/webp"
              :srcset="userProfile.avatar.fullPathWebP.replace(' ', '%20')"
            />
            <source
              v-if="userProfile.avatar.fullPathJp2"
              type="image/jp2"
              :srcset="userProfile.avatar.fullPathJp2.replace(' ', '%20')"
            />
            <img
              class="publicProfile__avatar__image"
              v-if="userProfile.avatar.fullPath"
              :src="userProfile.avatar.fullPath"
            />
          </picture>
          <avatar
            v-else
            size="156"
            :name="avatarName"
            class="publicProfile__avatar__image"
          />
        </div>
        <div class="publicProfile__fullName">
          <span class="publicProfile__fullName__name">{{
            userProfile.fullName
          }}</span>
          <span class="publicProfile__profileNumber">
            #{{ userProfile.profileNumber }}
            <a
              class="publicProfile__profileNumber__tip"
              data-title="The number of registration"
            >
              <svg-icon
                class="publicProfile__profileNumber__info"
                width="12"
                height="12"
                color="#828282"
                name="info-i"
              />
              <svg-icon
                class="publicProfile__profileNumber__infoBlue"
                width="12"
                height="12"
                color="#318BF5"
                name="info-i"
              />
            </a>
          </span>
        </div>
        <div class="publicProfile__mobile-fullName">
          {{ userProfile.fullName }}
        </div>
        <div class="publicProfile__subscription">
          <button-follow
            @change="followUser"
            :is-followed="userProfile.followed"
            :is-owned="userProfile.owned"
          />
          <span v-if="!userProfile.owned" v-show="userProfile.followsYou">
            follows you
          </span>
        </div>

        <div class="publicProfile__user-info">
          <p class="publicProfile__bio">
            {{ userProfile.bio }}
          </p>
          <div
            v-if="userProfile.personalWebsite"
            class="publicProfile__personalWebsite"
          >
            <svg-icon width="16" height="16" color="#949CAD" name="clip" />
            <a :href="userProfile.personalWebsite" target="_blank">
              {{
                userProfile.personalWebsite.replace(
                  new RegExp('^(https?|http|ftp)://'),
                  ''
                )
              }}
            </a>
          </div>
        </div>
      </div>
      <div class="publicProfile__other-info">
        <ul class="publicProfile__total-operation">
          <li
            :class="{
              'publicProfile__total-operation__itemActive':
                activeSection == ActiveSection.Projects,
            }"
            class="
              publicProfile__total-operation__item
              publicProfile__total-operation__pointer
            "
            @click="changeActiveComponent(ActiveSection.Projects)"
          >
            <span>projects</span>
            <p>{{ userProfile.projects }}</p>
          </li>
          <li
            :class="{
              'publicProfile__total-operation__itemActive':
                activeSection == ActiveSection.Followers,
            }"
            class="
              publicProfile__total-operation__item
              publicProfile__total-operation__pointer
            "
            @click="changeActiveComponent(ActiveSection.Followers)"
          >
            <span>followers</span>
            <p>{{ userProfile.followers }}</p>
          </li>
          <li
            :class="{
              'publicProfile__total-operation__itemActive':
                activeSection == ActiveSection.Following,
            }"
            class="
              publicProfile__total-operation__item
              publicProfile__total-operation__pointer
            "
            @click="changeActiveComponent(ActiveSection.Following)"
          >
            <span>following</span>
            <p>{{ userProfile.following }}</p>
          </li>
          <li class="publicProfile__total-operation__item">
            <span>likes</span>
            <p>{{ userProfile.likes }}</p>
          </li>
          <li class="publicProfile__total-operation__item">
            <span>views</span>
            <p>{{ userProfile.views }}</p>
          </li>
        </ul>
        <div class="publicProfile__social" v-if="socialLinks.length">
          <p>socials:</p>
          <ul class="publicProfile__socialLinks">
            <li v-for="social in socialLinks" :key="social.type">
              <a :href="social.url" :title="social.url" target="_blank">
                <svg-icon width="12" height="12" :name="social.type" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="publicProfile__user-content">
        <Followers
          v-if="activeSection == ActiveSection.Followers"
          :userFullName="userProfile.fullName"
          :isOwned="userProfile.owned"
        />
        <Following
          v-else-if="activeSection == ActiveSection.Following"
          :userFullName="userProfile.fullName"
          :isOwned="userProfile.owned"
        />
        <Projects
          @likeProject="likeProject"
          v-else-if="!userProfile.owned"
          :userFullName="userProfile.fullName"
          :userAlias="userName"
        />
        <PortfolioProjects
          v-else
          @likeProject="likeProject"
          :userAlias="userName"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ProfileDto, AccountDto } from '@/utils/api'
import { ProfileProjectDto } from '@/utils/api'
import apiClient from '@/utils/apiClient'
import { VisibleMessageNameType } from '@/store/ui'
import AirButton from '@/components/Settings/Button.vue'
import { SocialLinkDto } from '@/utils/api'
import Projects from '@/components/Settings/Profile/Projects.vue'
import PortfolioProjects from '@/components/Settings/Profile/PortfolioProjects.vue'
import Followers from '@/components/Settings/Profile/Followers.vue'
import Following from '@/components/Settings/Profile/Following.vue'
import ButtonFollow from '@/components/Settings/Profile/ButtonFollow.vue'
import Avatar from '@/components/Header/avatar/Avatar.vue'
import CoverBackground from '@/components/Header/avatar/CoverBackground.vue'
import { debounce, cloneDeep as _cloneDeep } from 'lodash'

enum ActiveSection {
  Projects = 'projects',
  Followers = 'followers',
  Following = 'following',
}

export default Vue.extend({
  layout: 'profile',
  components: {
    CoverBackground,
    Avatar,
    AirButton,
    Projects,
    PortfolioProjects,
    Followers,
    ButtonFollow,
    Following,
  },
  data() {
    return {
      ActiveSection,
      VisibleMessageNameType,
      userProfile: {} as ProfileDto,
      userName: this.$route.params.alias,
      activeSection: ActiveSection.Projects,
      width: 1280,
    }
  },
  async asyncData({ route, redirect }) {
    try {
      if (route.params.alias == 'projects') {
        redirect('/404')
        return
      }

      const { data: userProfile } = await apiClient.profiles.profilesGetByAlias(
        route.params.alias
      )
      if (!userProfile) {
        redirect('/404')
        return
      }

      const routePathParts = route.path.split('/')

      let activeSection = ActiveSection.Projects

      if (routePathParts.length > 2) {
        const routePathPart = routePathParts[2]
        if (routePathPart == ActiveSection.Followers)
          activeSection = ActiveSection.Followers

        if (routePathPart == ActiveSection.Following)
          activeSection = ActiveSection.Following
      }

      return {
        userProfile,
        activeSection,
      }
    } catch (error) {
      console.log(error)
      redirect('/404')
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user,
      isUserLoggedIn: (state: any) => state.auth.isUserLoggedIn,
      visibleMessageName: (state: any) =>
        <VisibleMessageNameType>state.ui.visibleMessageName,
    }),

    socialLinks(): SocialLinkDto[] {
      return this.userProfile.socialLinks != undefined
        ? this.userProfile.socialLinks
        : []
    },
    avatarName(): string {
      return !!this.userProfile.fullName ? this.userProfile.fullName : 'itmeo'
    },
  },
  methods: {
    likeProject(project: ProfileProjectDto, projectsBase: any) {
      if (!this.isUserLoggedIn) {
        this.$router.push({
          path: '/login',
          query: { redirectUrl: this.$route.fullPath },
        })
        return
      }

      project.hasLike = !project.hasLike
      project.likes = project.likes + (project.hasLike ? 1 : -1)
      this.userProfile.likes =
        this.userProfile.likes + (project.hasLike ? 1 : -1)
      this.toggleProjectLike(project, this.userProfile, projectsBase)
    },
    toggleProjectLike: debounce(
      (project: ProfileProjectDto, user: ProfileDto, projectsBase: any) => {
        if (projectsBase.get(project.id) == project.hasLike) return
        apiClient.profiles
          .profilesToggleProjectLike(project.id, user.userName)
          .then(() => {
            projectsBase.set(project.id, project.hasLike)
          })
          .catch(() => {
            project.hasLike = !project.hasLike
            project.likes = project.likes + (project.hasLike ? 1 : -1)
            user.likes = user.likes + (project.hasLike ? 1 : -1)
          })
      },
      800
    ),
    followUser() {
      if (!this.isUserLoggedIn) {
        this.$router.push({
          path: '/login',
          query: { redirectUrl: this.$route.fullPath },
        })
        return
      }
      if (this.userProfile.owned) {
        this.$router.push({
          path: '/settings/profile',
        })
        return
      }
      if (!this.userProfile.userName) {
        return
      }

      apiClient.profiles
        .profilesToggleProfileFollow(this.userProfile.userName)
        .then(() => {
          this.userProfile.followed = !this.userProfile.followed
          this.userProfile.followers =
            this.userProfile.followers + (this.userProfile.followed ? 1 : -1)
        })
        .catch((error) => {})
    },
    changeActiveComponent(activeSection: ActiveSection) {
      const { userName } = this.userProfile
      if (
        activeSection == ActiveSection.Followers ||
        activeSection == ActiveSection.Following
      ) {
        this.$router.replace({
          path: `/${userName}/${activeSection}`,
        })
      } else {
        this.$router.replace({
          path: `/${userName}`,
        })
      }
      // this.activeSection = activeSection
    },
  },
})
</script>

<style lang="scss" scoped>
.publicProfile {
  font-family: 'Poppins', sans-serif;
  position: relative;
  &__button {
    box-sizing: border-box;
    vertical-align: top;
    min-width: unset;
    text-align: center;
    font-weight: bold;
    font-size: 10px;
    line-height: 15px;
    transition: 0.3s;
    border-radius: $shape_border_radius;
    outline: none;

    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }

    &:active {
      opacity: 1;
    }
  }
  &__cover-image {
    img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      object-position: center;
    }
  }
  &__content {
    margin: auto;
  }
  &__glav-info {
    margin: -28px $margin_page_high_resolution * 2 50px;
    display: grid;
    grid-template-columns: 150px auto auto;
  }

  &__avatar {
    display: inline;
    grid-column: 1/2;
    grid-row: 1/3;
    background: #ffffff;
    width: 156px;
    height: 156px;
    border-radius: 50%;
    margin-left: -8px;
    overflow: hidden;
    &__image {
      border: 8px solid #ffffff;
      border-radius: 156px;
      width: 156px;
      height: 156px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  &__user-info {
    margin-left: 20px;
    margin-right: 20px;
    grid-column: 2/3;
    grid-row: 2/3;
    max-width: 600px;
  }
  &__fullName {
    margin: 38px 0px 0px 20px;
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
    grid-column: 2/3;
    grid-row: 1/2;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    &__name {
      margin-right: 10px;
      word-wrap: break-word;
      word-break: break-word;
    }
  }
  &__profileNumber {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 1px;

    &__infoBlue {
      display: none;
    }
    a {
      cursor: pointer;
      vertical-align: super;
      position: relative;
      &:hover .publicProfile__profileNumber__infoBlue {
        display: inline;
      }
      &:hover .publicProfile__profileNumber__info {
        display: none;
      }
      &:hover::after {
        content: attr(data-title);
        padding: 2px 4px;
        background: #000000;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        font-size: 10px;
        align-items: center;
        color: #ffffff;
        position: absolute;
        margin: auto;
        left: 15px;
        transform: translate(0.5em, -60%);
        text-align: center;
        z-index: 1;
        width: 133px;
        height: 19px;
        display: flex;
      }
    }
  }
  &__bio {
    font-size: 14px;
    line-height: 21px;
    margin: 15px 0px 12px 0px;
    width: 100%;
    word-break: break-word;
  }
  &__personalWebsite {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 12px;
    a {
      margin-left: 8px;
      font-size: 14px;
      line-height: 22px;
      color: #173bef;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      &:hover {
        border-bottom: 1px solid #173bef;
      }
    }
  }
  &__subscription {
    margin-left: auto;
    margin-top: 75px;
    grid-column: 3/4;
    grid-row: 1/3;
    text-align: center;
    flex-direction: column;
    display: flex;

    span {
      opacity: 0.8;
      font-size: 10px;
      margin-top: 10px;
      background: #f3f3f3;
      border-radius: 4px;
      padding: 0px 8px;
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }
  }
  &__user-content {
    border-top: 1px solid #dadada;
    margin-top: -1px;
  }
  &__other-info {
    padding: 0px $margin_page_high_resolution * 2;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap-reverse;
    justify-content: space-between;
    row-gap: 30px;
    p {
      font-size: 10px;
      line-height: 15px;
      opacity: 0.8;
      color: $black;
    }
  }

  &__total-operation {
    max-width: 350px;
    display: flex;
    justify-content: center;
    margin-right: 20px;
    border-bottom: 1px solid transparent;

    &__itemActive {
      border-bottom: 1px solid #173bef;
    }
    &__item {
      display: inline-block;
      margin-right: 30px;
      font-size: 10px;
      line-height: 15px;
      color: $black;
      text-align: left;
      padding-bottom: 15px;

      span {
        opacity: 0.8;
        font-size: 10px;
      }
      p {
        font-weight: 500;
        font-size: 14px;
        line-height: 21px;
        opacity: 1;
        margin-top: 3px;
      }
      &:last-child {
        margin-right: 0;
      }
    }
    &__pointer {
      cursor: pointer;
      &:hover {
        border-bottom: 1px solid #173bef;
      }
    }
  }

  &__socialLinks {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    li {
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
  &__mobile-fullName {
    display: none;
  }
}

@media screen and (max-width: 1440px) {
  .publicProfile {
    &__glav-info {
      margin: -28px 70px 50px;
      grid-template-columns: 150px auto auto;
    }
  }
}
@media screen and (max-width: 1280px) {
  .publicProfile {
    &__other-info {
      padding: 0px 70px;
    }
  }
}
@media screen and (max-width: 768px) {
  .publicProfile {
    &__cover-image {
      img {
        height: 180px;
      }
    }
    &__glav-info {
      margin: -26px $margin_page_tablet 50px $margin_page_tablet;
      grid-template-columns: 100px 1fr 140px;
    }

    &__avatar {
      width: 112px;
      height: 112px;
      border-radius: 50%;
      margin-left: -6px;
      &__image {
        border: 6px solid #ffffff;
        border-radius: 112px;
        width: 112px;
        height: 112px;
      }
    }
    &__fullName {
      margin-top: 36px;
      font-size: 28px;
      line-height: 42px;
    }
    &__user-info {
      max-width: 450px;
    }

    &__profileNumber {
      font-size: 12px;
      line-height: 6px;
      cursor: pointer;
      a {
        vertical-align: super;
        position: relative;
      }

      &:hover .publicProfile__profileNumber__infoBlue {
        display: inline;
      }
      &:hover .publicProfile__profileNumber__info {
        display: none;
      }
      &:hover .publicProfile__profileNumber__tip::after {
        content: attr(data-title);
        padding: 2px 4px;
        background: #000000;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        font-size: 10px;
        align-items: center;
        color: #ffffff;
        position: absolute;
        margin: auto;
        left: 15px;
        transform: translate(0.5em, -60%);
        text-align: center;
        z-index: 1;
        width: 133px;
        height: 19px;
        display: flex;
      }
    }
    &__bio {
      font-size: 12px;
      line-height: 21px;
    }
    &__personalWebsite {
      a {
        font-size: 12px;
      }
    }

    &__other-info {
      padding: 0px $margin_page_tablet;
    }
    &__total-operation {
      li {
        p {
          font-size: 12px;
        }
      }
    }
  }
}

@media screen and (max-width: 414px) {
  .publicProfile {
    &__cover-image {
      img {
        width: 100%;
        height: 150px;
      }
    }
    &__glav-info {
      margin: -24px $margin_page_mobile 0px $margin_page_mobile;
      grid-template-columns: 100px 1fr;
    }

    &__avatar {
      grid-column: 1/2;
      grid-row: 1/3;
      width: 108px;
      height: 108px;
      border-radius: 50%;
      margin-left: -4px;
      &__image {
        border: 4px solid #ffffff;
        border-radius: 108px;
        width: 108px;
        height: 108px;
      }
    }
    &__fullName__name {
      display: none;
    }
    &__mobile-fullName {
      display: inline-block;
      font-weight: 500;
      font-size: 22px;
      line-height: 33px;
      grid-column: 2/3;
      grid-row: 1/2;
      grid-column: 1/3;
      grid-row: 3/4;
      margin-top: 4px;
      margin-right: 10px;
    }
    &__profileNumber {
      font-size: 13px;
    }
    &__subscription {
      margin: 8px 0px 15px 0px;
      text-align: left;
      grid-column: 1/3;
      grid-row: 4/5;
      flex-direction: row;
      align-items: center;
      span {
        margin-top: 5px;
        margin-left: 8px;
      }
    }
    &__user-info {
      margin: 0px;
      grid-column: 1/3;
      grid-row: 5/6;
    }
    &__bio {
      font-size: 12px;
    }
    &__personalWebsite {
      a {
        font-size: 12px;
      }
    }

    &__other-info {
      margin: 30px $margin_page_mobile 0px $margin_page_mobile;
      padding: 0px;
      row-gap: 0px;
      flex-direction: column-reverse;
      p {
        font-size: 10px;
      }
    }
    &__total-operation {
      max-width: 100%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      margin-right: 0px;
      li {
        display: inline-block;
        // margin-right: 30px;
        p {
          font-size: 12px;
        }
      }
      &__item {
        margin-right: 0px;
      }
    }
    &__social {
      margin-top: 0px;
    }
    &__socialLinks {
      display: flex;
      flex-direction: row;
      li {
        margin-right: 10px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
    &__content {
      border-top: none;
    }
  }
}
</style>

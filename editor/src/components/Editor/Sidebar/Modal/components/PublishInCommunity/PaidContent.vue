<template>
  <div class="paidContent">
    <div class="paidContent__subscribe">
      <div class="paidContent__row">
        <span class="paidContent__span">Action Button</span>
        <switch-component
          class="paidContent__switch"
          :isActive="isEnabledActionButton"
          :onClick="changedIsEnabledActionButton"
        />
      </div>
      <template v-if="isEnabledActionButton">
        <div class="paidContent__title">
          Button Title <span>{{ name.length }}/11</span>
        </div>
        <input
          v-model="name"
          :maxlength="11"
          :class="{ paidContent__input__error: name == '' }"
          class="paidContent__input"
          @keyup="changeButtonName($event)"
        />
        <div class="paidContent__listDiv">
          <div class="paidContent__title">Action</div>
          <div
            :class="{
              paidContent__action__active: isShowAllAction
            }"
            class="paidContent__itemList"
            @click="(isShowAllAction = !isShowAllAction), (isShowAllIntegration = false)"
          >
            <div class="paidContent__itemList__header">
              <div class="paidContent__itemList__header-icon">
                <svg-icon
                  :width="actionsIcons[selectedAction].width"
                  :height="actionsIcons[selectedAction].height"
                  folder="dashboard"
                  :name="actionsIcons[selectedAction].name"
                />
              </div>
              <span>{{ selectedAction }}</span>
            </div>
            <div class="paidContent__itemList__buttomAll">
              <svg-icon v-if="isShowAllAction" width="8" height="5" folder="social" name="vectorUp" />

              <svg-icon v-else width="8" height="5" folder="social" name="vectorDown" />
            </div>
          </div>
          <div class="paidContent__list" v-if="isShowAllAction" v-click-outside="() => (isShowAllAction = false)">
            <div
              v-for="(action, index) in CommunityActionButtonType"
              :key="index"
              class="paidContent__list__item"
              @click="selectAction(action)"
            >
              <div class="paidContent__list__item-icon">
                <svg-icon
                  :width="actionsIcons[action].width"
                  :height="actionsIcons[action].height"
                  color="#000000"
                  :name="actionsIcons[action].name"
                />
              </div>
              <span class="paidContent__list__item__name">{{ action }}</span>

              <div class="paidContent__itemList__label-pro" v-if="action == CommunityActionButtonType.File">
                Only for <span>PRO</span>
              </div>
            </div>
          </div>
        </div>

        <div class="paidContent__link" v-if="selectedAction == CommunityActionButtonType.Link">
          <div class="paidContent__title">Link</div>
          <input
            v-model="actionLink"
            :class="{ 'paidContent__link-input__error': actionLink == '' }"
            class="paidContent__link-input"
            type="text"
            placeholder="https://itmeo.com"
            @keyup="changeActionLink($event)"
          />
          <span v-if="inputErrorsLink" class="paidContent__link-input__error-text" aria-live="polite">{{
            inputErrorsLink
          }}</span>
        </div>

        <div
          v-if="
            selectedAction == CommunityActionButtonType.Form &&
            !(user.isAdmin || user.plan.category == PlanCategory.Pro)
          "
          class="paidContent__submissions-limit"
        >
          <only-pro :is-limit="true" />
        </div>
        <FileInput
          v-if="selectedAction == CommunityActionButtonType.File"
          :isPro="user.plan.category == PlanCategory.Pro || user.isAdmin"
          :file="file"
          @selectedFile="selectedFile"
        />

        <div class="paidContent__listDiv">
          <div class="paidContent__title">Integration</div>
          <div
            :class="{
              paidContent__action__active: isShowAllIntegration
            }"
            class="paidContent__itemList"
            @click="(isShowAllIntegration = !isShowAllIntegration), (isShowAllAction = false)"
          >
            <div class="paidContent__itemList__header" v-if="integration">
              <svg-icon width="24" height="24" :name="integration.icon" />
              <span>{{ integration.name }}</span>
            </div>
            <div class="paidContent__itemList__buttomAll">
              <svg-icon v-if="isShowAllIntegration" width="8" height="5" folder="social" name="vectorUp" />

              <svg-icon v-else width="8" height="5" color="#000" name="vectorDown" />
            </div>
          </div>
          <div
            class="paidContent__list paidContent__list__top"
            v-if="isShowAllIntegration"
            v-click-outside="() => (isShowAllIntegration = false)"
          >
            <div
              v-for="(integration, index) in integrations"
              :key="index"
              class="paidContent__list__item"
              :class="{ soon: integration.isComingSoon }"
              @click="selectedIntegration(integration.name)"
            >
              <svg-icon width="24" height="24" :name="integration.icon" />
              <span class="paidContent__list__item__name">{{ integration.name }}</span>
              <span v-if="integration.isComingSoon">(coming soon)</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="paidContent__project">
      <div class="paidContent__title">Project Preview</div>
      <SliderFile
        :project="project"
        :user="user"
        :isSubscribe="isEnabledActionButton"
        :buttonName="name"
        :previewImage="previewImage"
        :isFile="selectedAction == CommunityActionButtonType.File"
        :fileName="file ? file.name : ''"
        :fileSize="file ? file.size : 0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapState } from 'vuex';
import { CommunityActionButtonType, AccountDto, PlanCategory, CommunityProjectDto } from '@/utils/api';
import SwitchComponent from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/Switch.vue';
import SliderFile from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/SliderFile.vue';
import FileInput from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/File/FileInput.vue';
import OnlyPro from '@/components/Editor/Sidebar/Modal/components/PublishInCommunity/OnlyPro.vue';

const linkReg = new RegExp(
  /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
);

type ListDto = { name: string; icon: string; isPRO?: boolean; isComingSoon?: boolean };

interface FileProject {
  name: string | null;
  size: number | null;
  id: undefined | string;
  file: null | File | Blob;
  path: string | ArrayBuffer | null;
}

export default Vue.extend({
  components: {
    OnlyPro,
    SwitchComponent,
    SliderFile,
    FileInput
  },
  props: {
    isEnabledActionButton: {
      type: Boolean
    },
    buttonName: {
      type: String
    },
    link: {
      type: String
    },
    project: {
      type: Object as PropType<CommunityProjectDto>
    },
    previewImage: {
      type: Object
    },
    file: {
      type: Object as PropType<FileProject>
    },
    selectedAction: {
      type: String as PropType<CommunityActionButtonType>
    }
  },
  watch: {
    buttonName(val) {
      this.name = val;
    },
    link(val) {
      this.actionLink = val;
    }
  },
  data() {
    return {
      CommunityActionButtonType,
      actionsIcons: {
        Form: {
          name: 'form',
          width: '17',
          height: '17'
        },
        File: {
          name: 'file',
          width: '24',
          height: '24'
        },
        Link: {
          name: 'url-icon',
          width: '14',
          height: '14'
        }
      },
      inputErrorsLink: '',
      actionLink: this.link,
      name: this.buttonName,
      PlanCategory,
      isShowAllAction: false,
      isShowAllIntegration: false,
      integration: {
        name: 'Airtap Submissions',
        icon: 'airtapCRM'
      } as ListDto | undefined,
      integrations: [
        {
          name: 'Airtap Submissions',
          icon: 'airtapCRM'
        },
        {
          name: 'Mailchimp',
          icon: 'mailchimp',
          isComingSoon: true
        },
        {
          name: 'Telegram',
          icon: 'telegram',
          isComingSoon: true
        }
      ] as ListDto[]
    };
  },

  computed: {
    ...mapState({
      user: (state: any) => <AccountDto>state.auth.user
    })
  },
  methods: {
    changeButtonName(event: any) {
      this.$emit('changeButtonName', event.currentTarget.value);
    },
    changeActionLink(event: any) {
      const regex = new RegExp(
        /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
      );
      if (event.currentTarget.value && !regex.test(event.currentTarget.value)) {
        this.inputErrorsLink = 'Please enter a valid link';
      } else this.inputErrorsLink = '';

      this.$emit('changeActionLink', event.currentTarget.value, this.inputErrorsLink.length > 0);
    },
    changedIsEnabledActionButton() {
      this.$emit('changedIsEnabledActionButton');
    },
    changedForm() {
      this.$emit('changedForm');
    },
    selectedFile(file: File | undefined) {
      this.$emit('selectedFile', file);
    },
    selectAction(action: CommunityActionButtonType) {
      this.isShowAllAction = !this.isShowAllAction;
      this.$emit('selectAction', action);
    },
    selectedIntegration(name: string) {
      this.integrations.find((integration: any) => {
        if (integration.name == name) this.integration = integration;
        return;
      });
      this.isShowAllIntegration = !this.isShowAllIntegration;
    }
  }
});
</script>

<style lang="scss" scoped>
.paidContent {
  height: fit-content;
  min-height: 419px;
  display: flex;
  flex-direction: row;
  column-gap: 30px;
  &__submissions-limit {
    width: 383px;
    height: 131px;
  }
  &__borderTop {
    padding-top: 20px;
    border-top: 1px solid #ebebeb;
  }
  &__subscribe {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 383px;
  }
  &__row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  &__span {
    font-size: 13px;
  }
  &__title {
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    color: #949cad;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
  }
  &__input {
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    color: #000000;
    background: #ffffff;
    border: 1px solid #f3f3f3;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
    padding: 9px;
    margin-bottom: 20px;
    -webkit-appearance: none;
    transition: 0.3s;
    &:focus,
    &:hover {
      border: 1px solid #000000;
    }
    &__error {
      border: 1px solid #f46363;
    }
  }
  &__project {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 433px;
    height: fit-content;
  }
  &__link {
    margin: 0 0 20px;
    &-input {
      padding: 7px 10px 9px;
      font-size: 13px;
      line-height: 20px;
      border: 1px solid $color_input_border;
      border-radius: $shape_border_radius;
      transition: 0.3s;
      width: 100%;

      &:hover {
        border-color: $color_input_hover;
      }

      &:focus {
        border-color: $color_input_focus;
      }

      &::placeholder {
        color: $gray700;
      }
      &__error {
        border-color: #f46363;
        &-text {
          color: #f46363;
          font-size: 10px;
          font-weight: 400;
          line-height: 12px;
        }
      }
    }
  }
  &__itemList {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 9px 8px;
    margin-bottom: 20px;
    width: 100%;
    height: 37px;
    border: 1px solid #f3f3f3;
    background: #ffffff;
    border-radius: 4px;
    transition: 0.3s;
    cursor: pointer;

    &__header {
      display: flex;
      flex-direction: row;
      align-items: center;

      &-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      span {
        font-size: 14px;
        line-height: normal;
        margin-left: 3px;
        width: 250px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    &__buttomAll {
      height: 100%;
      width: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    &:hover,
    &__active {
      border: 1px solid #318bf5;
    }
    &__actions {
      position: absolute;
      top: 50px;
      left: 0px;
    }
    &__label-pro {
      position: relative;
      display: inline-flex;
      align-items: center;
      border-radius: $shape_border_radius;
      padding: 2px 4px;
      user-select: none;
      height: 24px;
      background-color: #000000;
      margin-left: 20px;
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
      color: #ffc557;
      span {
        margin-left: 4px;
        font-weight: 600;
      }
    }
  }
  &__listDiv {
    position: relative;
  }
  &__list {
    z-index: 999;
    top: 60px;
    position: absolute;
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 100%;
    background: #ffffff;
    border: 1px solid #dadada;
    box-shadow: 0 10px 20px rgba(9, 9, 9, 0.15);
    border-radius: 4px;
    padding: 16px;
    &__top {
      top: auto;
      bottom: 60px;
    }
    &__item {
      width: 100%;
      padding: 6px 9px;
      margin: 0 -6px;
      align-items: center;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      background: #ffffff;
      border-radius: 4px;
      cursor: pointer;
      flex-wrap: nowrap;
      transition: 0.3s;
      &-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &.soon {
        opacity: 0.5;
        pointer-events: none;

        span:last-child {
          font-size: 10px;
          line-height: 15px;
          color: $gray600;
          display: inline-block;
          margin-left: 6px;
        }
      }
      &__name {
        font-size: 14px;
        line-height: normal;
        margin-left: 5px;
        max-width: calc(100% - 23px);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &:hover,
      &__active {
        background: #f3f3f3;
      }
    }
  }
}
</style>

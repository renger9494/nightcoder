<template>
  <div class="projectName">
    <span v-if="!isNameEditing" class="projectName__name">{{
      project.name
    }}</span>
    <button
      class="projectName__edit-name"
      v-if="!isNameEditing"
      @click="enableNameEditing"
    >
      <svg-icon width="16" height="16" color="#BDBDBD" name="pencil" />
    </button>
    <input
      class="projectName__name-input"
      v-if="isNameEditing"
      :value="nameInputValue"
      :maxlength="300"
      @keyup="handleNameInputChange"
    />
    <button
      class="projectName__save-name"
      v-if="isNameEditing"
      @click="saveName"
    >
      Save
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ProfileProjectDto } from '@/utils/api'
import apiClient from '@/utils/apiClient'
import HTMLElementEvent from '@/utils/types/HTMLElementEvent'
export default Vue.extend({
  components: {},
  props: {
    project: {
      type: Object as PropType<ProfileProjectDto>,
    },
  },
  data() {
    return {
      nameInputValue: this.project.name,
      isNameEditing: false,
    }
  },
  created() {
    if (process.client) {
      document.addEventListener('keyup', this.saveNameOnEnter)
    }
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.saveNameOnEnter)
  },
  methods: {
    enableNameEditing(event: Event) {
      this.isNameEditing = true
    },
    saveName(event: Event) {
      if (event) event.preventDefault()

      const projectName = this.nameInputValue
      if (!projectName) {
        console.error('Project name is empty')
        return
      }

      apiClient.projects
        .projectsChangeName(this.project.id, { projectName })
        .then(() => {
          this.isNameEditing = false
          this.project.name = projectName
        })
        .catch((error) => {
          console.error(error)
        })
    },
    saveNameOnEnter(event: KeyboardEvent) {
      if (event && event.key === 'Enter') {
        this.saveName(event)
      }
    },

    handleNameInputChange(event: HTMLElementEvent<HTMLInputElement>) {
      this.nameInputValue = event.target.value
    },
  },
})
</script>

<style lang="scss" scoped>
.projectName {
  font-family: 'Poppins', sans-serif;
  display: flex;
  max-width: 60%;
  margin-right: 10px;

  &__name {
    font-size: 16px;
    line-height: 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-bottom: 1px solid transparent;
    transition: 0.3s;
    &:hover {
      color: #173bef;
      border-bottom: 1px solid #173bef;
    }
  }
  &__name-input {
    width: 100%;

    font-size: 14px;
    font-weight: 500;
    color: #333333;
    border-bottom: 1px solid #dadada;
    padding-bottom: 1px;
    margin-right: 8px;
  }

  &__edit-name {
    line-height: 0;
    margin-left: 5px;
    cursor: pointer;
    &:hover {
      .project__edit-name-icon {
        fill: #000000;
      }
    }
  }
  &__save-name {
    font-size: 9px;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #ffffff;
    background-color: #333333;
    border-radius: $shape_border_radius;
    padding: 4px 6px;
    transition: 0.3s background-color;
    cursor: pointer;
    &:hover {
      background-color: #000000;
      color: #ffffff;
    }
  }
  &__edit-name-icon {
    width: 12px;
    fill: #333333;
    transition: 0.3s fill;
  }
}
@media screen and (max-width: 768px) {
  .projectName {
    &__name {
      font-size: 16px;
      line-height: 21px;
    }
    &__name-input {
      font-size: 14px;
    }
    &__save-name {
      font-size: 8px;
    }
    &__edit-name-icon {
      width: 10px;
    }
  }
}
@media screen and (max-width: 414px) {
  .projectName {
    &__name {
      font-size: 14px;
      line-height: 21px;
    }
    &__name-input {
      font-size: 12px;
    }
  }
}
</style>

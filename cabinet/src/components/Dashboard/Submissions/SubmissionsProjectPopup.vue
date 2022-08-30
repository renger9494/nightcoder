<template>
  <div class="submissions-popup">
    <div class="submissions-popup__head" @click="isPopupOpen = !isPopupOpen">
      <span v-if="selectedProjects.length === 0">All projects</span>
      <span v-else-if="selectedProjects.length === 1">{{
        nameSelectedProject
      }}</span>
      <span v-else-if="selectedProjects.length > 1"
        >Projects {{ selectedProjects.length }}</span
      >
      <svg-icon width="16" height="16" color="#000000" name="dropdown_arrow" />
    </div>
    <transition name="fade">
      <div
        class="submissions-popup__body"
        v-if="isPopupOpen"
        v-click-outside="() => (isPopupOpen = false)"
      >
        <div
          class="submissions-popup__item"
          v-for="(project, index) in projects"
          :key="index"
          @click.prevent.stop="selectProject(project.id)"
        >
          <checkbox :input-value="selectedProjects.includes(project.id)" />
          <div class="submissions-popup__img">
            <picture v-if="project.previewImage">
              <source
                v-if="project.previewImage.fullPathWebP"
                type="image/webp"
                :srcset="project.previewImage.fullPathWebP.replace(' ', '%20')"
              />
              <source
                v-if="project.previewImage.fullPathJp2"
                type="image/jp2"
                :srcset="project.previewImage.fullPathJp2.replace(' ', '%20')"
              />

              <img
                v-if="project.previewImage.fullPath"
                :src="project.previewImage.fullPath"
              />
            </picture>
            <img v-else :src="getPlaceholderUrl()" alt="" />
          </div>
          <p class="submissions-popup__text">{{ project.name }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import SvgIcon from '@/components/Shared/SvgIcon.vue'
import Checkbox from '@/components/Shared/ui/Сheckbox.vue'
import Vue, { PropType } from 'vue'
import { PagedProjectDto } from '@/utils/api'
import { getPlaceholderUrl } from '@/utils/images'
export default Vue.extend({
  name: 'SubmissionsProjectPopup',
  components: { Checkbox, SvgIcon },
  data() {
    return {
      isPopupOpen: false,
    }
  },
  props: {
    selectedProjects: {
      type: Array,
      required: true,
    },
    projects: {
      type: Array as PropType<PagedProjectDto[]>,
      required: true,
    },
  },
  computed: {
    nameSelectedProject(): string {
      return (
        this.projects.find((item) => item.id === this.selectedProjects[0])
          ?.name || ''
      )
    },
  },
  methods: {
    getPlaceholderUrl() {
      return getPlaceholderUrl()
    },
    selectProject(idProject: number) {
      let index = this.selectedProjects.indexOf(idProject)
      const selectedProjectsArr = [...this.selectedProjects]
      if (index === -1) {
        selectedProjectsArr.push(idProject)
      } else {
        selectedProjectsArr.splice(index, 1)
      }
      this.$emit('selectedProjectsChange', selectedProjectsArr)
    },
  },
})
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.submissions-popup {
  position: relative;
  user-select: none;

  &__head {
    border: 1px solid $color_input_border;
    border-radius: $shape_border_radius;
    display: flex;
    align-items: center;
    padding: 8px;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    transition: 0.3s;
    cursor: pointer;

    svg {
      margin: 0 0 0 auto;
    }

    &:hover {
      border-color: $gray400;
    }

    span {
      display: inline-block;
      width: 114px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    @include bp($sm) {
      width: 100%;
    }
  }

  &__body {
    left: 0;
    bottom: -5px;
    transform: translateY(100%);
    position: absolute;
    background: $white;
    box-shadow: $shadow_small;
    border-radius: $shape_border_radius;
    padding: 15px;
    width: 250px;
    z-index: 20;
    max-height: 300px;
    overflow-y: auto;

    @include bp($sm) {
      width: 100%;
    }

    &::-webkit-scrollbar {
      width: 4px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #bdc2c7;
      height: 30px;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-track-piece {
      display: none;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    position: relative;

    &:after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    &:not(:last-child) {
      margin: 0 0 12px;
    }

    &:hover {
      .submissions-popup__text {
        color: $blue200;
      }

      ::v-deep {
        .check-box__checkmark {
          border-color: $gray400;
        }
      }
    }
  }

  &__img {
    border-radius: $shape_border_radius;
    height: 24px;
    width: 30px;

    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: $shape_border_radius;
      transition: 0.3s;
      opacity: 0;
      background: rgba($black, 0.4);
    }

    img {
      width: 30px;
      height: 24px;
      border-radius: $shape_border_radius;
      background-color: white;
    }
  }

  &__text {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    max-width: 159px;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    transition: 0.3s;
  }
}
</style>

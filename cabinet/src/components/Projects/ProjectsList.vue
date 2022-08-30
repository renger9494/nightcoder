<template>
  <div class="projects-list">
    <project
      v-for="project in projects"
      :project="project"
      :key="project.id"
      :totalProjects="totalProjects"
    />
    <div
      class="additive-state"
      v-if="additiveProject"
      @click="redirectToTemplatesPage"
    >
      <svg-icon width="84" height="78" name="additive-state" />

      <div class="additive-state__text">
        <PlusIcon />
        <span>Add new project</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Project from '@/components/Projects/Project.vue'
import { mapState } from 'vuex'
import { PagedProjectDto, BaseProjectDto } from '@/utils/api'
import PlusIcon from '@/assets/icons/plus.svg?inline'
export default {
  components: {
    Project,
    PlusIcon,
  },
  props: {
    // projects: Array as PropType<PagedProjectDto[]>,
    additiveProject: Boolean,
    createDefaultPage: Function,
    redirectToTemplatesPage: Function,
    totalProjects: Number,
  },
  computed: {
    ...mapState({
      projects: (state: any) => <BaseProjectDto[]>state.project.projects,
    }),
  },
}
</script>

<style lang="scss" scoped>
.projects-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-right: -20px;
  margin-left: -20px;
}
.additive-state {
  flex: 0 0 calc(33.333% - 40px);
  width: calc(33.333% - 40px);
  margin-right: 20px;
  margin-bottom: 40px;
  margin-left: 20px;
  min-height: 289px;
  background: #ffffff;
  border: 1px solid #ebebeb;
  box-sizing: border-box;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  &:hover {
    background: rgba(243, 243, 243, 0.5);
  }
  cursor: pointer;
  &__text {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 151px;
    margin-top: 20px;
    svg {
      margin-right: 8px;
      max-width: 10px;
    }
  }
}
@media screen and (max-width: 1866px) {
  .projects-list {
    margin-right: -10px;
    margin-left: -10px;
  }
  .additive-state {
    flex: 0 0 calc(33.333% - 20px);
    width: calc(33.333% - 20px);
    margin-right: 10px;
    margin-bottom: 20px;
    margin-left: 10px;
    min-height: 243px;
  }
}
@media screen and (max-width: 1620px) {
  .projects-list {
    margin-right: -20px;
    margin-left: -20px;
  }
  .additive-state {
    flex: 0 0 calc(50% - 40px);
    width: calc(50% - 40px);
    margin-right: 20px;
    margin-bottom: 40px;
    margin-left: 20px;
    min-height: 313px;
  }
}
@media screen and (max-width: 1320px) {
  .projects-list {
    margin-right: -10px;
    margin-left: -10px;
  }
  .additive-state {
    flex: 0 0 calc(50% - 20px);
    width: calc(50% - 20px);
    margin-right: 10px;
    margin-bottom: 20px;
    margin-left: 10px;
    min-height: 233px;
  }
}
@media screen and (max-width: 1150px) {
  .additive-state {
    min-height: 193px;
  }
}
@media screen and (max-width: 1000px) {
  .additive-state {
    flex: 0 0 calc(100% - 20px);
    width: calc(100% - 20px);
    height: 313px;
  }
}
@media screen and (max-width: 625px) {
  .additive-state {
    height: 273px;
  }
}
@media screen and (max-width: 550px) {
  .additive-state {
    height: 243px;
  }
}
@media screen and (max-width: 510px) {
  .additive-state {
    height: 213px;
  }
}
@media screen and (max-width: 475px) {
  .additive-state {
    height: 356px;
  }
}
</style>

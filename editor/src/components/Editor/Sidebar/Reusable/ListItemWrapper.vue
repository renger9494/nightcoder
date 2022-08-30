<template>
  <div class="sidebar-link-item" :class="[dashed ? 'dashed' : '']">
    <svg
      v-if="dashed"
      class="dashed-svg"
      preserveAspectRatio="none"
      width="260"
      height="157"
      viewBox="0 0 260 157"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="259"
        height="156"
        rx="3.5"
        stroke="#BDC2C7"
        stroke-dasharray="2 5"
        vector-effect="non-scaling-stroke"
      />
    </svg>
    <div class="sidebar-link-item-header">
      <div class="sidebar-link-item-title">
        {{ title }}
      </div>
      <div class="sidebar-link-item-header-right">
        <button v-if="deleteButton" class="delete-link" @click="$emit('delete-link')">
<!--          <delete-icon />-->
        </button>
        <button v-if="duplicateButton" class="delete-link" @click="$emit('dublicate-link')">
<!--          <duplicate-icon />-->
        </button>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
// import LinkTypeSelector from '@/components/Editor/Sidebar/Reusable/LinkTypeSelector'

export default Vue.extend({
  // components: {
  //   LinkTypeSelector
  // },
  props: {
    link: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    linkType: {
      type: Boolean,
      default: true
    },
    linkTypes: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    dashed: {
      type: Boolean,
      default: false
    },
    deleteButton: {
      type: Boolean,
      default: true
    },
    duplicateButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      //
    };
  },
  methods: {
    //
  }
});
</script>

<style lang="scss" scoped>
.sidebar-link-item {
  position: relative;
  // padding: 10px 0;
}
.dashed.sidebar-link-item {
  padding: 10px 0 0;
  margin-bottom: 14px;
}
.sidebar-link-item-title {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: #4356be;
  padding-right: 8px;
  // text-transform: capitalize;
  max-width: 100%;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-link-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.sidebar-link-item.dashed .sidebar-link-item-header {
  margin-bottom: 10px;
}
.sidebar-link-item-header-right {
  display: flex;
}

.delete-link {
  margin-right: 4px;
  cursor: pointer;
}

.dashed-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% + 20px);
  height: 100%;
  margin: 0 -10px;
  pointer-events: none;
}
</style>

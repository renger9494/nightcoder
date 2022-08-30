<template>
  <div class="helper">
    <div class="helper__btn" :class="{ isDialogShown }" @click="openDialog">?</div>
    <transition name="fade">
      <helper-dialog
        v-click-outside="() => (isDialogShown = false)"
        v-if="isDialogShown"
        @helperPopupClick="openHelperPopup(true)"
        @keydown.esc.native="isDialogShown = false"
        @openTour="openTour"
        ref="modal"
        tabindex="0"
      />
    </transition>
    <transition name="fade">
      <helper-popup v-if="isHelperOpen" v-click-outside="() => openHelperPopup(false)" />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelperDialog from '@/components/Editor/Helper/HelperDialog.vue';
import { mapMutations, mapState } from 'vuex';
import HelperPopup from '@/components/Editor/Helper/HelperPopup.vue';

export default Vue.extend({
  name: 'Helper',
  components: { HelperPopup, HelperDialog },
  data() {
    return {
      isDialogShown: false
    };
  },
  computed: {
    ...mapState({
      isHelperOpen: (state: any) => state.ui.isHelperOpen
    })
  },
  methods: {
    ...mapMutations({
      changeHelperOpenType: 'ui/changeHelperOpenType'
    }),
    openTour() {
      this.$store.commit('ui/changeOnboardingActiveType', true);
      this.isDialogShown = false;
    },
    openDialog() {
      this.isDialogShown = true;
      this.$nextTick(() => {
        ((this.$refs?.modal as Vue).$el as HTMLElement).focus();
      });
    },
    openHelperPopup(data: boolean) {
      this.isDialogShown = false;
      this.changeHelperOpenType(data);
    }
  }
});
</script>

<style lang="scss" scoped>
.helper {
  position: absolute;
  width: 32px;
  height: 32px;
  right: 260px;
  bottom: 17px;
  cursor: pointer;
  user-select: none;

  &__btn {
    position: absolute;
    width: 32px;
    height: 32px;
    top: 0;
    bottom: 0;
    border-radius: 50%;
    background: $white;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
    font-size: 15px;
    font-weight: 500;
    z-index: 9998;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 14px;
    cursor: pointer;

    &.isDialogShown {
      pointer-events: none;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

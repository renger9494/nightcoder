<template>
  <div class="sidebar-switcher-wrapper">
    <button @click="toggleSidebar">
      <svg-icon id="arrow" name="chevron-left" width="5" height="8" color="#949CAD" />
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { TweenMax } from 'gsap';

export default Vue.extend({
  props: [],
  data() {
    return {
      //
    };
  },
  computed: {
    ...mapState({
      showSidebar: (state: any) => state.ui.showSidebar
    })
  },
  watch: {
    showSidebar(state) {
      const arrow: any = document.querySelector('#arrow');
      if (state) {
        TweenMax.to(arrow, 0.25, {
          rotation: 0
        });
      } else {
        TweenMax.to(arrow, 0.25, {
          rotation: 180
        });
      }
    }
  },
  mounted() {
    TweenMax.set(<any>this.$refs.arrow, {
      transformOrigin: 'center'
    });
  },
  methods: {
    toggleSidebar() {
      this.$store.commit('ui/TOGGLE_SIDEBAR');
    }
  }
});
</script>

<style lang="scss" scoped>
.sidebar-switcher-wrapper {
  position: fixed;
  top: 50%;
  left: 0;
  z-index: 101;
  transform: translateY(-50%);
}

button {
  width: 11px;
  height: 26px;
  background: rgba(69, 86, 112, 0.15);
  border-radius: 0px 2px 2px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>

<template>
  <main class="page_wrapper landing">
    <!--cover-->
    <cover-home @onComponentLoad="isCoverLoaded = true" />
    <!--steps-->
    <steps-home v-if="isCoverLoaded" @onComponentLoad="isStepsLoaded = true" />
    <!--merged-->
    <merged-home v-if="isStepsLoaded" @onComponentLoad="isMergedLoaded = true" />
    <!--Design-->
    <design-home v-if="isMergedLoaded" @onComponentLoad="isDesignLoaded = true" />
    <!--Creatives-->
    <creatives-home v-if="isDesignLoaded" @onComponentLoad="isCreativesLoaded = true" />
    <!--discover-->
    <discover-home v-if="isCreativesLoaded" @onComponentLoad="isDiscoverLoaded = true" />
    <!--creators-->
    <creators-home v-if="isDiscoverLoaded" @onComponentLoad="isCreatorsLoaded = true" />
    <!--create-project-->
    <create-project-home v-if="isCreatorsLoaded" />
  </main>
</template>

<script>
import CheckIcon from '@/assets/icons/check.svg?inline'
import ArrowRight from '@/assets/icons/arrow_right.svg?inline'
const CoverHome = () => import(/* webpackChunkName: "cover" */ '@/components/HomePage/Cover.vue');
const DesignHome = () => import(/* webpackChunkName: "design" */ '@/components/HomePage/Design.vue');
const StepsHome = () => import(/* webpackChunkName: "steps" */ '@/components/HomePage/Steps.vue');
const MergedHome = () => import(/* webpackChunkName: "merged" */ '@/components/HomePage/Merged.vue');
const CreativesHome = () => import(/* webpackChunkName: "creatives" */ '@/components/HomePage/Creatives.vue');
const DiscoverHome = () => import(/* webpackChunkName: "discover" */ '@/components/HomePage/Discover.vue');
const CreatorsHome = () => import(/* webpackChunkName: "creators" */ '@/components/HomePage/Creators.vue');
const CreateProjectHome = () => import(/* webpackChunkName: "create_project" */ '@/components/HomePage/CreateProject.vue');

export default {
  layout: 'default',
  head() {
    return {
      htmlAttrs: {
        style: "background: #0E0E11; font-family: Poppins,-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu, Cantarell,'Open Sans','Helvetica Neue',sans-serif;",
      },
      title:
        'Airtap — All-in-one solution for creating web pages, collecting submissions & analyzing your visitors 🚀| made by itmeo',
      meta: [
        {
          charset: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content:
            'Airtap — All-in-one solution for creating web pages, collecting submissions & analyzing your visitors 🚀| made by itmeo',
        },
        {
          name: 'theme-color',
          content: '#0E0E11',
        },
      ],
    }
  },
  data() {
    return {
      isCoverLoaded: false,
      isStepsLoaded: false,
      isMergedLoaded: false,
      isDesignLoaded: false,
      isCreativesLoaded: false,
      isDiscoverLoaded: false,
      isCreatorsLoaded: false
    }
  },
  components: {
    CreateProjectHome,
    CreatorsHome,
    DiscoverHome,
    CreativesHome,
    StepsHome,
    DesignHome,
    CoverHome,
    MergedHome,
    CheckIcon,
    ArrowRight,
  },
  mounted() {
    const allTexts = document.querySelectorAll('.split-text')
    allTexts.forEach((item) => {
      this.$split({ target: item, by: 'chars' })
    })
  },

}
</script>


<style lang="scss">
@import '@/assets/scss/main/main';

.landing {
  overflow-x: hidden;
}

.img_card {
  background-image: url(/img/main/cards.png);
}
.features {
  z-index: 20;
}
.prototype {
  z-index: 20;
}
</style>


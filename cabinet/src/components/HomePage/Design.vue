<template>
  <section class="design">
    <div class="container container--main">
      <h2 class="design__title">Enjoy Airtap <span>main features</span></h2>
      <div class="design__wrap">
        <div class="design__bg" :class="`active_${activeTabIndex}`">
          <div class="design__bg-item" v-for="(bg, indexBg) in bgList" :key="indexBg" :style="bg"></div>
        </div>
        <div class="design__wrap-left">
          <div
            class="design__image"
            v-for="(item, index) in tabsData"
            :key="index"
            :class="{'design__image--hidden' : activeTabIndex !== index+1}"
          >
            <responsive-image
              class="design__image-item"
              v-for="(image, indexImage) in item.image"
              :key="indexImage"
              :is-imgix="true"
              :sizes="image.sizes"
              :img-src="image.src"
              :width="image.width"
              :data-parralax="image.parallaxPercentage"
            />
          </div>
        </div>
        <aside class="design__wrap-right">
          <nav class="design-nav">
            <ul class="design-nav__list">
              <li
                class="design-nav__list-item"
                ref="tab_item"
                :class="{ 'design-nav__list-item--active': activeTabIndex === index+1 }"
                v-for="(item,index) in tabsData"
                :key="index"
                @click="setActiveTab(index)"
              >
                <p class="design-nav__list-title">{{ item.title }}</p>
                <p class="design-nav__list-title design-nav__list-title--gradient">{{ item.title }}</p>
                <p class="design-nav__list-text">{{ item.text }}</p>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  </section>
</template>

<script>
import ResponsiveImage from '@/components/Ui/ResponsiveImage.vue';
export default {
  name: 'Design',
  components: {ResponsiveImage},
  data() {
    return {
      activeTabIndex: 1,
      tabsData: [
        {
          title: 'No-code editor',
          text: 'Design website like in your favorite tools, Figma, Sketch, Adobe XD.',
          image: [
            {
              src: '/Landing/design_1_1.jpg',
              sizes: [{size: '313', breakPoint: '$sm'}, {size: '301', breakPoint: '$md'}],
              width: '559',
              parallaxPercentage: 10
            },
            {
              src: '/Landing/design_1_2.jpg',
              sizes: [{size: '71', breakPoint: '$sm'}, {size: '75', breakPoint: '$md'}],
              width: '141',
              parallaxPercentage: 35
            },
            {
              src: '/Landing/design_1_3.jpg',
              sizes: [{size: '71', breakPoint: '$sm'}, {size: '80', breakPoint: '$md'}],
              width: '141',
              parallaxPercentage: 25
            },
            {
              src: '/Landing/design_1_4.jpg',
              sizes: [{size: '75', breakPoint: '$sm'}, {size: '75', breakPoint: '$md'}],
              width: '149',
              parallaxPercentage: 45
            }
          ]
        },
        {
          title: 'Publish',
          text: 'Connect Airtap or your custom domain and get a ready page in 1 sec.',
          image: [
            {
              src: '/Landing/design_2_1.jpg',
              sizes: [{size: '313', breakPoint: '$sm'}, {size: '301', breakPoint: '$md'}],
              width: '559',
              parallaxPercentage: 10
            },
            {
              src: '/Landing/design_2_2.jpg',
              sizes: [{size: '94', breakPoint: '$sm'}, {size: '109', breakPoint: '$md'}],
              width: '203',
              parallaxPercentage: 35
            },
            {
              src: '/Landing/design_2_3.jpg',
              sizes: [{size: '148', breakPoint: '$sm'}, {size: '148', breakPoint: '$md'}],
              width: '275',
              parallaxPercentage: 25
            },
            {
              src: '/Landing/design_2_4.jpg',
              sizes: [{size: '78', breakPoint: '$sm'}, {size: '93', breakPoint: '$md'}],
              width: '173',
              parallaxPercentage: 45
            }
          ]
        },
        {
          title: 'Submissions',
          text: 'You’ll see all collected information directly in your panel. See what\'s working at a glance.',
          image: [
            {
              src: '/Landing/design_3_1.jpg',
              sizes: [{size: '313', breakPoint: '$sm'}, {size: '301', breakPoint: '$md'}],
              width: '559',
              parallaxPercentage: 10
            },
            {
              src: '/Landing/design_3_2.png',
              sizes: [{size: '128', breakPoint: '$sm'}, {size: '135', breakPoint: '$md'}],
              width: '254',
              parallaxPercentage: 35
            },
            {
              src: '/Landing/design_3_3.jpg',
              sizes: [{size: '97', breakPoint: '$sm'}, {size: '103', breakPoint: '$md'}],
              width: '197',
              parallaxPercentage: 25
            },
            {
              src: '/Landing/design_3_4.png',
              sizes: [{size: '81', breakPoint: '$sm'}, {size: '86', breakPoint: '$md'}],
              width: '163',
              parallaxPercentage: 45
            }
          ]
        },
        {
          title: 'Project likes and views',
          text: 'Introduce you to the world, simply share your content with others and instantly get reactions from Airtap community.',
          image: [
            {
              src: '/Landing/design_4_1.jpg',
              sizes: [{size: '313', breakPoint: '$sm'}, {size: '301', breakPoint: '$md'}],
              width: '559',
              parallaxPercentage: 10
            },
            {
              src: '/Landing/design_4_2.jpg',
              sizes: [{size: '159', breakPoint: '$sm'}, {size: '169', breakPoint: '$md'}],
              width: '314',
              parallaxPercentage: 50
            },
            {
              src: '/Landing/design_4_3.jpg',
              sizes: [{size: '108', breakPoint: '$sm'}, {size: '115', breakPoint: '$md'}],
              width: '213',
              parallaxPercentage: 50
            },
            {
              src: '/Landing/design_4_4.jpg',
              sizes: [{size: '108', breakPoint: '$sm'}, {size: '115', breakPoint: '$md'}],
              width: '213',
              parallaxPercentage: 20
            }
          ]
        },
        {
          title: 'Get inspiration',
          text: 'Discover feed of new projects and publish your own. Get inspired and be inspiration to others.',
          image: [
            {
              src: '/Landing/design_5_1.jpg',
              sizes: [{size: '313', breakPoint: '$sm'}, {size: '301', breakPoint: '$md'}],
              width: '559',
              parallaxPercentage: 10
            },
            {
              src: '/Landing/design_5_2.jpg',
              sizes: [{size: '117', breakPoint: '$sm'}, {size: '124', breakPoint: '$md'}],
              width: '230',
              parallaxPercentage: 35
            },
            {
              src: '/Landing/design_5_3.jpg',
              sizes: [{size: '128', breakPoint: '$sm'}, {size: '136', breakPoint: '$md'}],
              width: '253',
              parallaxPercentage: 25
            },
            {
              src: '/Landing/design_5_4.jpg',
              sizes: [{size: '68', breakPoint: '$sm'}, {size: '73', breakPoint: '$md'}],
              width: '136',
              parallaxPercentage: 65
            }
          ]
        }
      ],
      bgList: [
        'background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, #FFF0EA 0%, #FEE7E6 52.08%, #FFFDEE 100%);',
        'background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, #FFFDEE 0%, #F0FEE6 50%, #EAFFEE 100%);',
        'background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, #EAFFEE 0%, #DDFFEC 51.56%, #ECFCEF 100%);',
        'background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, #ECFCEF 0%, #D5F2FF 54.69%, #E7F0FF 100%);',
        'background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, #E7F0FF 0%, #FFE3F4 48.96%, #FCE5F8 100%);',
      ]
    }
  },
  mounted() {
    this.parallax();
    this.$emit('onComponentLoad');
  },
  methods: {
    setActiveTab(index) {
      if (this.activeTabIndex === (index + 1)) return
      this.$refs.tab_item.forEach((item) => {
        item.style.height = '30px';
      });
      const clickedItem = this.$refs.tab_item[index];
      const bodyHeight = clickedItem.scrollHeight;
      clickedItem.style.height = `${bodyHeight + 50}px`;
      this.activeTabIndex = (index+1);
    },
    parallax() {
      const imgArr = document.querySelectorAll('.design__image-item');
      for(const img of imgArr) {
        this.$gsap.to(img, {
          yPercent: img.dataset.parralax,
          ease: 'none',
          scrollTrigger: {
            trigger: '.design',
            start: `center center+=200`,
            scrub: true
          },
        });
      }
    }
  }
}
</script>

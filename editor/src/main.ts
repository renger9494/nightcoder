import Vue from 'vue';
import 'gsap';
import './plugins/filters';

const isProduction = process.env.NODE_ENV == 'production';
const isStaging = process.env.NODE_ENV == 'staging';
const isEnableSocketForDevelopment = false;
const isSocketEnabled = isProduction || isStaging || isEnableSocketForDevelopment;
// @ts-ignore
import VueSignalR from '@latelier/vue-signalr';
import SocketManager, { CreateNewPagePreviewInfo, SocketNotificationType } from '@/helpers/SocketManager';
if (isSocketEnabled) {
  const socketURL = !isProduction && !isStaging ? 'http://localhost:5000' : process.env.VUE_APP_BASE_URL_API;
  Vue.use(VueSignalR, `${socketURL}/api/hubs/notifications`);
}

import VueCompositionAPI from '@vue/composition-api';
Vue.use(VueCompositionAPI);

import VueClipboard from 'vue-clipboard2';
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
// @ts-ignore
import VueDragscroll from 'vue-dragscroll';
Vue.use(VueDragscroll);
// @ts-ignore
import VueYoutube from 'vue-youtube';
Vue.use(VueYoutube);
// @ts-ignore
import VueShepherd from 'vue-shepherd';
Vue.use(VueShepherd);

//register app
import App from './App.vue';
import router from './router';
import store from './store';
import auth from '@/utils/auth';
import apiClient from '@/utils/apiClient';
import { EditorLogDto } from '@/utils/api';

import http from '@/utils/http'

//register components and layout
import Layout from '@/views/layouts/Layout.vue';

import EditorSwitcher from '@/components/Editor/Sidebar/Reusable/EditorSwitcher.vue';
import EditorInput from '@/components/Editor/Sidebar/Reusable/EditorInput.vue';
import EditorTextarea from '@/components/Editor/Sidebar/Reusable/EditorTextarea.vue';
import AddNewLink from '@/components/Editor/Sidebar/Reusable/AddNewLink.vue';
import LinkItemWrapper from '@/components/Editor/Sidebar/Reusable/LinkItemWrapper.vue';
import ListItemWrapper from '@/components/Editor/Sidebar/Reusable/ListItemWrapper.vue';
import LinkTypeSelector from '@/components/Editor/Sidebar/Reusable/LinkTypeSelector.vue';
import SelectedPreview from '@/components/Editor/Sidebar/Reusable/SelectedPreview.vue';
import DropdownSelector from '@/components/Editor/Sidebar/Reusable/DropdownSelector.vue';
import DropdownObjSelector from '@/components/Editor/Sidebar/Reusable/DropdownObjSelector.vue';
import LinkTypeDropdown from '@/components/Editor/Sidebar/Reusable/LinkTypeDropdown.vue';
import LinkTypeObjDropdown from '@/components/Editor/Sidebar/Reusable/LinkTypeObjDropdown.vue';
import StyleSelectorItem from '@/components/Editor/Sidebar/Reusable/StyleSelectorItem.vue';
import TextStyleEditor from '@/components/Editor/Sidebar/Reusable/TextStyleEditor/TextStyleEditor.vue';
import PrefixInput from '@/components/Editor/Sidebar/Global/PrefixInput/PrefixInput.vue';
import SvgIcon from '@/components/Shared/SvgIcon.vue';

Vue.component('default-layout', Layout);

Vue.component('text-style-editor', TextStyleEditor);
Vue.component('prefix-input', PrefixInput);
Vue.component('editor-switcher', EditorSwitcher);
Vue.component('editor-input', EditorInput);
Vue.component('editor-textarea', EditorTextarea);
Vue.component('add-new-link', AddNewLink);
Vue.component('link-item-wrapper', LinkItemWrapper);
Vue.component('list-item-wrapper', ListItemWrapper);
Vue.component('link-type-selector', LinkTypeSelector);
Vue.component('selected-preview', SelectedPreview);
Vue.component('dropdown-selector', DropdownSelector);
Vue.component('dropdown-obj-selector', DropdownObjSelector);
Vue.component('link-type-dropdown', LinkTypeDropdown);
Vue.component('link-type-obj-dropdown', LinkTypeObjDropdown);
Vue.component('style-selector-item', StyleSelectorItem);
Vue.component('svg-icon', SvgIcon);

//register directives
import clickOutside from '@/directives/click-outside';
import mouseupOutside from '@/directives/mouseup-outside';
import tooltip from '@/directives/tooltip';
// @ts-ignore
import { VueMaskDirective } from 'v-mask';


Vue.directive('mask', VueMaskDirective);
Vue.directive('click-outside', clickOutside);
Vue.directive('mouseup-outside', mouseupOutside);
Vue.directive('tooltip', tooltip);

Vue.config.productionTip = false;
if (isProduction) {
  Vue.config.errorHandler = (err, vm, info) => {
    let dto = {
      message: err.stack || err.message,
    } as EditorLogDto
    for (const key in vm.$route.params) {
      (<any>dto)[key] = vm.$route.params[key]
    }
    apiClient.logs.logsSave(dto).catch((error) => {
      console.error(error)
    })

    return true;
  }
}

router.beforeEach(async (to, from, next) => {
  const cabinetEndpoint = process.env.VUE_APP_CABINET_URL;

  if (!to.matched.length) {
    location.href = `${cabinetEndpoint}/404`;
    return;
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isValidToken = await auth.isTokenValid();
    if (!isValidToken) {
      location.href = `${cabinetEndpoint}/login`;
      return;
    }

    // const isRedirectToFirstProjectPage = process.env.VUE_APP_REDIRECT_TO_FIRST_PROJECT_PAGE == 'true';
    // if (isRedirectToFirstProjectPage) {
    //   const firstProjectPage = await http.get()
    // }
  }

  //TODO: use vue-meta instead of
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map((el: any) => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map((tagDef: any) => {
      const tag = document.createElement('meta');

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute('data-vue-router-controlled', '');

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach((tag: any) => document.head.appendChild(tag));

  next();
});

const bus = new Vue();

new Vue({
  router,
  store,
  data() {
    return {
      bus: bus
    };
  },
  created() {
    if (isSocketEnabled) {
      SocketManager.getInstance((<any>this).$socket).startListen(
        SocketNotificationType.CreateNewPagePreview,
        (message: CreateNewPagePreviewInfo) => {
          this.$store.commit('project/changePagePreview', {
            projectId: message.projectId,
            pageId: message.pageId,
            previewImage: message.previewImage
          });
        },
        false
      );
    }

    this.$store.dispatch('auth/getUserInfo');

    this.$store.subscribe(mutation => {
      if (mutation.type === 'auth/changeIsUserLoggedIn' && mutation.payload === true) {
        //TODO: may be move this to editor page, because we need it only for project page
        this.$store.dispatch('project/loadProjects');
      }

      if (mutation.type === 'ui/changeVisibleModalName') {
        const html = document.querySelector('html');
        const body = document.querySelector('body');

        if (!html || !body) return;

        if (mutation.payload !== null) {
          html.style.cssText = 'overflow: hidden;';
          body.style.cssText = 'overflow: hidden;';
        } else {
          html.style.cssText = '';
          body.style.cssText = '';
        }
      }
    });
  },
  beforeDestroy() {
    if (isSocketEnabled) {
      SocketManager.getInstance((<any>this).$socket).destroy();
    }
  },
  render: h => h(App)
}).$mount('#app');

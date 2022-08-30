import { resolve } from 'path'
import http from './src/utils/http'
import head from './head.js'
import router from './router.js'

//add robots
const BASE_URL = process.env.BASE_URL
const CABINET_URL = process.env.CABINET_URL
const EDITOR_ENDPOINT = process.env.EDITOR_ENDPOINT
const USER_IS_CAN_CREATE_ACCOUNT = process.env.USER_IS_CAN_CREATE_ACCOUNT
const VUE_APP_AIRTAP_DOMAIN = process.env.VUE_APP_AIRTAP_DOMAIN
const VUE_APP_IP_ADDRESS = process.env.VUE_APP_IP_ADDRESS
const isStaging = process.env.NODE_ENV == 'staging'
const isProduction = process.env.NODE_ENV == 'production'
const domain = 'airtap.io'
const VUE_APP_BUCKET_NAME = process.env.VUE_APP_BUCKET_NAME
const isLocalhostAPI = false

const modules = [
  '@nuxtjs/axios',
  '@nuxtjs/style-resources',
  '@nuxtjs/svg',
  '@nuxtjs/gtm',
  '@nuxtjs/yandex-metrika',
  '@nuxtjs/device',
  'cookie-universal-nuxt',
  ['nuxt-svg-sprite-module', { directory: '~/assets/svg_sprite', templateLocation: 'src/app.html' }]
]

if (!isProduction && !isStaging) {
  modules.push('@nuxtjs/proxy')
} else {
  modules.push('@nuxtjs/robots')
  modules.push('@nuxtjs/sitemap')
}

export default {
  srcDir: 'src/',
  alias: {
    gsap: resolve(__dirname, './node_modules/nuxt-gsap-module/node_modules/gsap')
  },
  router,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head,

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/global.css', '@/assets/scss/main/main'],
  styleResources: {
    scss: ['@/assets/scss/variables.scss', '@/assets/scss/mixins.scss']
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/googleAuth', ssr: false },
    { src: '@/plugins/facebookAuth', ssr: false },
    { src: '@/plugins/filters' },
    { src: '@/plugins/vClickOutside', ssr: false },
    { src: '@/plugins/splitting', ssr: false },
    { src: '@/plugins/vMask', ssr: false },
    { src: '@/plugins/signalr', ssr: false },
    { src: '@/plugins/tooltip', ssr: false },
    { src: '@/plugins/agile', ssr: false },
    { src: '@plugins/vue-input-facade.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api',
    'nuxt-gsap-module',
    '@nuxtjs/google-analytics'
  ],

  // gsap custom options https://www.npmjs.com/package/nuxt-gsap-module
  gsap: {
    extraPlugins: {
      scrollTo: true,
      scrollTrigger: true
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules,
  gtm: {
    id: 'GTM-NK4LHKK'
  },
  // googleAnalytics: {
  //   id: 'UA-210929760',
  // },
  yandexMetrika: {
    id: '86079556',
    webvisor: true,
    clickmap: true,
    useCDN: false,
    trackLinks: true,
    accurateTrackBounce: true
  },
  robots: () => {
    if (!isProduction)
      return {
        UserAgent: '*',
        Disallow: '/'
      }

    return {
      Allow: '/',
      Disallow: async () => {
        const { data: urls } = await http.get('/api/publish/page/disallowUrls', { Domain: domain })

        return urls
      },
      Sitemap: `https://${domain}/sitemap.xml.gz`
    }
  },
  sitemap: {
    hostname: isProduction ? `https://${domain}` : `https://beta.${domain}`,
    gzip: true,
    exclude: isProduction ? [] : ['/**'],
    routes: async () => {
      if (!isProduction) return []

      //TODO: add templates pages
      const { data: urls } = await http.get('/api/publish/page/urls', { Domain: domain })
      return urls
    }
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},
  proxy:
    !isProduction && !isStaging
      ? {
          '/api': {
            target: isLocalhostAPI ? 'http://localhost:5000' : `https://apidev.${domain}`,
            changeOrigin: true
          }
        }
      : null,

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vuex-composition-helpers'],
    loaders: {
      scss: { sourceMap: isProduction || isStaging },
      vue: { cacheBusting: isProduction || isStaging }
    }
  },
  env: {
    BASE_URL,
    EDITOR_ENDPOINT,
    USER_IS_CAN_CREATE_ACCOUNT,
    CABINET_URL,
    VUE_APP_AIRTAP_DOMAIN,
    VUE_APP_IP_ADDRESS,
    VUE_APP_BUCKET_NAME
  }
}

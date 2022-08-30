const head = {
  title: 'Airtap — Mindblowing Coming Soon Pages 🚀 | by itmeo',
  htmlAttrs: {
    lang: 'en',
    style: "font-family: Poppins,-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu, Cantarell,'Open Sans','Helvetica Neue',sans-serif;"
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'yandex-verification', content: '4ce99954fb7c82ad' },
    { hid: 'description', name: 'description', content: 'Airtap — Mindblowing Coming Soon Pages 🚀 | by itmeo' }
  ],
  link: [
    {
      as: 'font',
      href: '/fonts/Poppins-Regular.woff2',
      type: 'font/woff2',
      rel: 'preload',
      crossorigin: true
    },
    {
      as: 'font',
      href: '/fonts/Poppins-Medium.woff2',
      type: 'font/woff2',
      rel: 'preload',
      crossorigin: true
    },
    {
      as: 'font',
      href: '/fonts/Poppins-Bold.woff2',
      type: 'font/woff2',
      rel: 'preload',
      crossorigin: true
    },
    {
      href: '/fonts/poppins.css',
      rel: 'stylesheet'
    },
    { rel: 'icon', type: 'image/png', href: `${process.env.VUE_APP_BUCKET_NAME}/Defaults/256.png` },
    {
      rel: 'prefetch',
      href: '/img/icons/logo_white.svg',
      as: 'image',
      type: 'mage/svg+xml'
    },
    {
      rel: 'prefetch',
      href: '/img/icons/logo_black.svg',
      as: 'image',
      type: 'mage/svg+xml'
    }
  ]
};

export default head;

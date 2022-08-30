const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV == 'staging';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const isLocalhostAPI = false;

module.exports = {
  publicPath: isProduction || isStaging ? '/editor/' : '/',
  outputDir: 'dist',
  devServer: {
    proxy: isLocalhostAPI ? 'http://localhost:5000' : 'https://apidev.airtap.io'
  },
  lintOnSave: false,
  pluginOptions: {
    svgSprite: {
      dir: 'src/assets/icons-sprite',
      test: /\.(svg)(\?.*)?$/,
      loaderOptions: {
        extract: true,
        spriteFilename: 'img/icons-sprite.[hash:8].svg'
      },
      pluginOptions: {
        plainSprite: true
      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      });

    config.module
      .rule('svg-sprite')
      .use('svgo-loader')
      .loader('svgo-loader');
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "./src/assets/scss/variables.scss";
          @import "./src/assets/scss/mixins.scss";
          @import "./src/assets/scss/global.scss";
        `
      }
    }
  }
};

import Vue from 'vue'

if (process.client) {
  var facebookAuth = (function () {
    function installClient() {
      var apiUrl = 'https://connect.facebook.net/en_US/sdk.js'
      return new Promise((resolve) => {
        var script = document.createElement('script')
        script.src = apiUrl
        script.async = true
        script.defer = true
        script.id = 'facebook-jssdk'
        script.onreadystatechange = script.onload = function () {
          if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            setTimeout(function () {
              resolve()
            }, 500)
          }
        }
        document.getElementsByTagName('head')[0].appendChild(script)
      })
    }

    function initClient(options) {
      FB.init(options)

      FB.AppEvents.logPageView()

      return FB
    }

    class Auth {
      constructor() {
        if (!(this instanceof Auth)) return new Auth()

        this.load = (config) => {
          installClient()
            .then(() => {
              return initClient(config)
            })
            .then((FB) => {
              this.FacebookAuth = FB
              this.getLoginStatus = this.FacebookAuth.getLoginStatus
              this.login = this.FacebookAuth.login
              this.isInit = true
            })
            .catch((error) => {
              console.error(error)
            })
        }
      }
    }

    return new Auth()
  })()

  const fbVersion = 'v10.0'
  const appId = '252094899034041'

  function installFacebookAuth(Vue, options) {
    let FacebookAuthConfig = null
    let FacebookAuthDefaultConfig = {
      cookie: true,
      xfbml: true,
      version: fbVersion,
    }

    if (typeof options === 'object') {
      FacebookAuthConfig = Object.assign(FacebookAuthDefaultConfig, options)
      if (options.version) FacebookAuthConfig.version = options.version
      if (!options.appId) {
        console.warn('Facebook appId is required')
      }
    } else {
      console.warn('invalid option type. Object type accepted only')
    }

    Vue.fAuth = facebookAuth
    if (!Vue.prototype.$fAuth)
      Object.defineProperties(Vue.prototype, {
        $fAuth: {
          get: function () {
            return Vue.fAuth
          },
        },
      })
    Vue.fAuth.load(FacebookAuthConfig)
  }

  /*  Vue.use(installFacebookAuth, {
     appId: appId,
     cookie: true,
     xfbml: true,
     version: fbVersion,
   }) */
}

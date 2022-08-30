import apiClient from '@/utils/apiClient'
import { ExternalAuthDto, LoginProviderType } from '@/utils/api'

enum AuthEventType {
  ClosedAuthDialog,
  NotAuthorized,
  Authorized,
}

interface AuthEvent {
  status: string
  type: AuthEventType
  accessToken?: string
}

type AuthEventFunction = (event: AuthEvent) => void

abstract class LoginProvider {
  abstract getAccessToken(event: AuthEventFunction): void
  abstract get type(): LoginProviderType
}

export class FacebookLoginProvider extends LoginProvider {
  get type(): LoginProviderType {
    return LoginProviderType.Facebook
  }
  constructor(private $fAuth: any) {
    super()
    this.$fAuth = $fAuth
  }

  getAccessToken(event: AuthEventFunction): void {
    console.log('[FacebookLoginProvider]: logIn')
    this.$fAuth.getLoginStatus(({ status, authResponse }: any) => {
      if (status == 'not_authorized' || status == 'unknown') {
        this.signUp(event)
        return
      }

      if (status == 'connected')
        event({ type: AuthEventType.Authorized, status, accessToken: authResponse.accessToken })
    })
  }

  private signUp(event: AuthEventFunction): void {
    console.log('[FacebookLoginProvider]: signUp')
    this.$fAuth.login(
      ({ status, authResponse }: any) => {
        if (status == 'not_authorized' || status == 'unknown') {
          event({ type: AuthEventType.NotAuthorized, status })
          return
        }

        if (status == 'connected')
          event({ type: AuthEventType.Authorized, status, accessToken: authResponse.accessToken })
      },
      {
        scope: 'email',
      }
    )
  }
}

export class GoogleLoginProvider extends LoginProvider {
  get type(): LoginProviderType {
    return LoginProviderType.Google
  }
  constructor(private $gAuth: any) {
    super()
    this.$gAuth = $gAuth
  }

  getAccessToken(event: AuthEventFunction): void {
    this.$gAuth
      .signIn()
      .then((googleUser: any) => {
        if (!this.$gAuth.isAuthorized) {
          event({ type: AuthEventType.NotAuthorized, status: 'not_authorized' })
          return
        }

        // console.log(googleUser)
        // console.log(googleUser.getAuthResponse())
        const authResponse = googleUser.getAuthResponse ? googleUser.getAuthResponse() : googleUser.uc
        event({ type: AuthEventType.Authorized, status, accessToken: authResponse.id_token })
      })
      .catch(({ error }: any) => {
        if (error == 'popup_closed_by_user') {
          event({ type: AuthEventType.ClosedAuthDialog, status: error })
        }
        event({ type: AuthEventType.NotAuthorized, status: error })
      })
  }
}

export default class SocialAuth {
  public isProcessing: boolean = false
  public isSuccessed: boolean = false

  constructor(private loginProvider: LoginProvider) { }

  public autheticated(isRegister: boolean) {
    this.isProcessing = true
    const resolve: AuthEventFunction = (event: AuthEvent) => {
      switch (event.type) {
        case AuthEventType.Authorized:
          if (!event.accessToken) {
            console.error(`[${this.loginProvider.type}]: accessToken is null`)
            this.isProcessing = false
            return
          }

          this.statusChangeCallback(this.loginProvider.type, event.accessToken, isRegister)
          break
        case AuthEventType.NotAuthorized:
          //TODO: show error
          this.isProcessing = false
          console.error(`[${this.loginProvider.type}]: status is ${event.status}`)
          break
        case AuthEventType.ClosedAuthDialog:
          this.isProcessing = false
          console.log(`[${this.loginProvider.type}]: status is ${event.status}`)
          break
        default:
          throw new Error(`[${this.loginProvider.type}]: ${event.type} is not implemented`)
      }
    }

    this.loginProvider.getAccessToken(resolve)
  }

  private statusChangeCallback(loginProvider: LoginProviderType, accessToken: string, isRegister: boolean) {
    var data: ExternalAuthDto = {
      loginProvider,
      accessToken,
    }
    apiClient.auth
      .authExternal(data)
      .then(() => {
        setTimeout(() => {
          this.isSuccessed = true
          location.href = '/dashboard'
        }, 600)
      })
      .catch((error) => {
        console.error(error)
        this.isProcessing = false
      })
  }
}

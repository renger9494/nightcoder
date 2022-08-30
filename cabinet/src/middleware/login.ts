import { Middleware, Context } from '@nuxt/types'
import auth from '@/utils/auth'

const loginMiddleware: Middleware = async ({ redirect, req, $device }: Context) => {
  const isValidToken = await auth.isTokenValid(req?.headers?.cookie ?? null)
  /*  if ($device.isMobileOrTablet) {
     redirect('/dashboard-mobile')
     return
   } */
  if (isValidToken) {
    redirect('/dashboard')

    return
  }
}

export default loginMiddleware

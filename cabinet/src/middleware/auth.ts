import { Middleware, Context } from '@nuxt/types'
import auth from '@/utils/auth'
import http from '@/utils/http'


const authMiddleware: Middleware = async ({ redirect, req, $device }: Context) => {
  const isValidToken = await auth.isTokenValid(req?.headers?.cookie ?? null)
  // if ($device.isMobileOrTablet) {
  //   redirect('/dashboard-mobile')
  //   return
  // }
  if (!isValidToken) {
    redirect('/login')
    return
  }
}

export default authMiddleware

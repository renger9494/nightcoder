import apiClient from '@/utils/apiClient'

export default {
  isTokenValid: async (cookie: any = null) => {
    try {
      if (cookie != null) {
        apiClient.instance.defaults.headers.Cookie = cookie
      }
      const { status } = await apiClient.auth.authIsValidToken()

      return status == 200 || status == 204
    } catch (error) {
      return false
    }
  },
}

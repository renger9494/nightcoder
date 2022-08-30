import { Context } from '@nuxt/types'
import { Store } from 'vuex'
import { ErrorDto } from '@/utils/api'

export const actions = {
  async nuxtServerInit({ dispatch }: Store<any>, { req }: Context) {
    try {
      const cookie = req?.headers?.cookie ?? null
      if (!cookie) return
      await dispatch('auth/getUserInfo', { cookie })
    } catch (error: any) {
      let errormessage = 'getUserInfo failed'
      if (error.response) {
        const { status, data } = error.response
        const errors: ErrorDto[] = data
        let errorsDescription = errors && Array.isArray(errors) ? errors.map((x) => x.description).join(', ') : ''

        errormessage += ` with status ${status} and errors ${errorsDescription}`
      } else {
        errormessage += error
      }
    }
  },
}

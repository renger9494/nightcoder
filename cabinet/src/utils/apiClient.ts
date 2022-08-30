import { Api, PageType } from '@/utils/api'

class ApiClientFactory {
  static createApiClient() {
    const config = {
      baseURL: process.env.BASE_URL,
      withCredentials: !!process.env.BASE_URL,

      paramsSerializer: (params: any) => {
        const parts = [] as any[]

        const encode = (val: string, key: string) => {
          return encodeURIComponent(val)
            .replace(/%3A/gi, ':')
            .replace(/%24/g, '$')
            .replace(/%2C/gi, ',')
            .replace(/%20/g, key == 'Search' ? '%20' : '+')
            .replace(/%5B/gi, '[')
            .replace(/%5D/gi, ']')
        }

        const convertPart = (key: string, val: any) => {
          if (val instanceof Date) val = val.toISOString()
          else if (val instanceof Object) val = JSON.stringify(val)

          parts.push(encode(key, key) + '=' + encode(val, key))
        }

        Object.entries(params).forEach(([key, val]) => {
          if (val === null || typeof val === 'undefined') return

          if (Array.isArray(val)) val.forEach((v, i) => convertPart(`${key}[${i}]`, v))
          else convertPart(key, val)
        })

        return parts.join('&')
      },
    }

    const api = new Api(config);

    api.instance.defaults.headers['Cache-Control'] = 'no-store';
    return api;
  }
}

export interface FeedbackDto {
  Email?: string | null;
  Subject?: string | null;
  Description?: string | null;
  Attachment?: File | null;
}

export interface TemplateQueryFilter {
  Search?: string | null
  Categories?: number[] | null
  PageTypes?: PageType[] | null
  IsIncludeNotPublished?: boolean
  PageNumber?: number
  PageSize?: number
}

export default ApiClientFactory.createApiClient()

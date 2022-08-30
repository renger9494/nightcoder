export class Converter {
  private static buildFormData(formData: FormData, data: any, parentKey: string | null = null) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        this.buildFormData(
          formData,
          data[key],
          parentKey ? (Array.isArray(data) ? `${parentKey}[${key}]` : `${parentKey}.${key}`) : key
        )
      })
    } else if (parentKey) {
      const value = data == null ? '' : data

      formData.append(parentKey, value)
    } else {
      const value = data == null ? '' : data
      console.warn('not added to form data', value)
    }
  }

  public static jsonToFormData(data: any) {
    const formData = new FormData()

    this.buildFormData(formData, data)

    return formData
  }
}

export function getShowTemplatesCarousel(req: any): boolean {
  const value = getValueFromCookie(req, 'templates-carousel')
  if (!value) return true

  return false
}

function getValueFromCookie(req: any, key: string): string | null {
  const cookie = req?.headers?.cookie ?? null
  if (!cookie) return null

  const viewCookie = cookie.split(';').find((x: string) => x.includes(key))

  if (!viewCookie) return null

  return viewCookie.replace(`${key}=`, '').trim()
}

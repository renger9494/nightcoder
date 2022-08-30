import Vue from 'vue'
import {
  isYesterday,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from 'date-fns'

const differenceDates = {
  months: differenceInMonths,
  days: differenceInDays,
  hours: differenceInHours,
  min: differenceInMinutes,
}

/**
 * Convert date from server to local date
 * @param {string} value - utc string from server
 */
function getLocalDate(value) {
  const utcDate = new Date(value)
  return new Date(
    Date.UTC(
      utcDate.getFullYear(),
      utcDate.getMonth(),
      utcDate.getDate(),
      utcDate.getHours(),
      utcDate.getMinutes(),
      utcDate.getSeconds()
    )
  )
}

export function toLocalDate(value) {
  if (!value) return ''
  return format(getLocalDate(value), 'dd.MM.yyyy HH:mm')
}

export function toLocalFormatDate(value) {
  if (!value) return ''
  const year = new Date(value).getFullYear()
  if (!value || year < 1970) return 'Not edited yet'

  return format(getLocalDate(value), 'dd MMM, yyyy')
}

export function toLocalFullFormatDate(value) {
  if (!value) return ''
  const year = new Date(value).getFullYear()
  if (!value || year < 1970) return 'Not edited yet'
  return format(getLocalDate(value), "dd MMM, yyyy  hh:mm a")
}

export function toLastUpdateDate(value) {
  const year = new Date(value).getFullYear()
  if (!value || year < 1970) return 'Not edited yet'

  //date from server
  var date = getLocalDate(value)

  const dateNow = new Date(Date.now())

  if (isYesterday(date)) return 'Yesterday'

  for (const key in differenceDates) {
    const difference = differenceDates[key](dateNow, date)
    if (difference > 0) return `Edited ${difference} ${key} ago`
  }

  return 'Edited 1 min ago'
}

export function toLastDate(value) {
  const year = new Date(value).getFullYear()
  if (!value || year < 1970) return ''

  //date from server
  var date = getLocalDate(value)

  const dateNow = new Date(Date.now())

  if (isYesterday(date)) return 'Yesterday'

  for (const key in differenceDates) {
    const difference = differenceDates[key](dateNow, date)
    if (difference > 0) return `${difference} ${key} ago`
  }

  return ' 1 min ago'
}
Vue.filter('localDate', toLocalDate)
Vue.filter('localFormatDate', toLocalFormatDate)
Vue.filter('localFullFormatDate', toLocalFullFormatDate)
Vue.filter('lastUpdateDate', toLastUpdateDate)
Vue.filter('lastDate', toLastDate)

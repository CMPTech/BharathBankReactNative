import moment from 'moment'
import _ from 'lodash'
import {
  getTranslation, EnglishTranslations, FrenchTranslations, KhmerTranslations, ChineseTranslations,
} from '../../assets/translations'
import { store } from '../store'
import { ACCOUNT_KEYS, COMPONENTS_KEYS } from '../../assets/translations/constants'


const { app } = store.getState()
export const getWeeks = (selectedMonth) => {
  let selectedDate = selectedMonth.value
  let numberOfWeeks
  const weeks = []
  numberOfWeeks = Math.ceil(selectedDate.daysInMonth() / 7)
  if (selectedDate > moment(new Date())) {
    selectedDate = moment(new Date())
    numberOfWeeks = Math.ceil(selectedDate.date() / 7)
  }
  for (let i = 1; i <= numberOfWeeks; i += 1) {
    weeks.push({ value: i, label: `${getTranslation(COMPONENTS_KEYS.ACCOUNT_KEYS.TRANSACTION_TABS_KEYS.WEEK)} ${i.toString()}` })
  }
  return weeks
}

export const getDays = (selectedMonth) => {
  let selectedDate = selectedMonth.value
  const days = []
  let noOfDays = selectedDate.daysInMonth()
  if (selectedDate > moment(new Date())) {
    selectedDate = moment(new Date())
    noOfDays = selectedDate.date()
  }
  for (let i = 1; i <= noOfDays; i += 1) {
    days.push({ label: `${i} ${selectedMonth.value.format('MMM')} `, value: selectedMonth.value.date(i).clone() })
  }
  return days
}

export const get12MonthsFromToday = () => {
  const today = moment(new Date())
  const months = []
  for (let i = 0; i < 12; i += 1) {
    months.push({
      value: moment(today).subtract(i, 'month'),
      label: moment(today).subtract(i, 'month').format('MMM YY'),
    })
  }
  return months
}

export const getMonths = () => {
  return [
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.JAN),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.FEB),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.MAR),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.APR),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.MAY),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.JUN),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.JUL),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.AUG),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.SEP),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.OCT),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.NOV),
    getTranslation(ACCOUNT_KEYS.MONTHS_NAMES.DEC)
  ]
}

export const getYears = (minDate, maxDate) => {
  return _.reverse(_.range(1900, maxDate ? moment(maxDate).year() + 1 : new Date().getFullYear() + 15, 1))
}



export const formatTime = (dt) => {
  let hours = new Date(dt).getHours()
  let minutes = new Date(dt).getMinutes()
  const time = hours >= 12 ? 'PM' : 'AM'
  hours %= 12
  hours = hours || 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes
  const strTime = `${hours}:${minutes} ${time}`
  return strTime
}
export const formatDate = (dt) => {
  try {
    let d = new Date(dt).getDate()
    let s = 'th'
    switch (d.toString()) {
      case '1':
      case '01':
      case '21':
      case '31':
        s = 'st'
        break
      case '02':
      case '2':
      //case '12':
      case '22':
        s = 'nd'
        break
      case '03':
      case '3':
      //case '13':
      case '23':
        s = 'rd'
        break
    }
    let m = new Date(dt).toDateString().split(' ', 3)[1]
    let y = new Date(dt).getFullYear().toString().slice(2, 4)
    const strDate = `${d}${s} ${m}'${y}`
    return strDate
  } catch (e) {

  }

}

import moment from 'moment'

function formatMessage (username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  }
}

function timestampToDate (timestamp) {
  if (timestamp == undefined) return null
  // Create a new JavaScript Date object from the PostgreSQL timestamp.
  const date = new Date(timestamp)

  // Extract the date components from the JavaScript Date object.
  const year = date.getFullYear()
  const month = date.getMonth() // Months are zero-indexed in JavaScript.
  const day = date.getDate()

  // Create a new string in the format `21 July, 2021` using the extracted date components.
  const dateString = `${getDay(day)} ${getMonth(month)}, ${year}`

  // Return the new string.
  return dateString
}
function timeToString (timestamp) {
  // Create a new JavaScript Date object from the PostgreSQL timestamp.
  const date = new Date(timestamp)

  // Extract the date components from the JavaScript Date object.
  const year = date.getFullYear()
  const month = date.getMonth() // Months are zero-indexed in JavaScript.
  const day = date.getDate()
  return { string: `${year}-${month}-${day}`, year: year, month: month + 1 }
}

function getDay (num) {
  const lastDigit = num % 10
  if (lastDigit == 1 || num == 1) return num + 'st'
  else if (lastDigit == 2 || num == 2) return num + 'nd'
  else if (lastDigit == 3 || num == 3) return num + 'rd'
  else return num + 'th'
}
function getMonth (num) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  return months[num]
}

function jobDuration (startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timestamp = Date.now()
  const diff = Math.abs(end - start)
  const spent = Math.abs(timestamp - start)
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  const spentDays = Math.ceil(spent / (1000 * 60 * 60 * 24))
  const percentage =
    spentDays >= days ? 100 : ((spentDays / days) * 100).toFixed(2)
  return { days, percentage }
}
function formatLocation (locationObj) {
  return `${locationObj.panchayat}, ${locationObj.block}, ${locationObj.district}, ${locationObj.state}`
}
function formatLocationShort (locationObj) {
  return `${locationObj.panchayat}, ${locationObj.block}`
}

function formatLocationToGP (locationObj) {
  return `${locationObj?.panchayat}`
}

function getToday () {
  var now = new Date()
  now.setHours(0, 0, 0, 0)
  const year = now.getFullYear()
  const month = now.getMonth() // Months are zero-indexed in JavaScript.
  const day = now.getDate()
  var nowString = `${year}-${month + 1}-${day}`
  return nowString
}
function calculateAge (birthday) {
  const newBirthday = new Date(birthday)
  const ageDifMs = Date.now() - newBirthday
  const ageDate = new Date(ageDifMs) // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}
export {
  timestampToDate,
  jobDuration,
  formatLocation,
  formatLocationShort,
  formatLocationToGP,
  calculateAge,
  timeToString,
  getToday,
  formatMessage
}

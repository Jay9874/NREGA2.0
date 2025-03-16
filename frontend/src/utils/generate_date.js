function getDateStr (timestamp) {
  const date = new Date(timestamp)
  const dateStr = date.toISOString()
  const slicedDate = `${dateStr.slice(0, 10)}`
  return slicedDate
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

var genDates = function (selectedAttnd) {
  return new Promise((resolve, reject) => {
    try {
      const { start, end, dates } = selectedAttnd
      const startDate = new Date(start)
      const endDate = new Date(end)
      const datesStatus = new Map()
      dates.forEach(attnDate => {
        const dateStr = getDateStr(attnDate.created_at)
        datesStatus.set(dateStr, attnDate.status)
      })
      const months = new Map()
      const monthlyDates = new Map()
      for (
        var dt = startDate, i = 0;
        dt <= endDate;
        dt.setDate(dt.getDate() + 1)
      ) {
        const newDateStr = getDateStr(dt)
        const month = dt.getMonth()
        const year = dt.getFullYear()
        const monthIdx = `${month}/${year}`
        const dateItem = {
          date: dt.getDate(),
          month: month + 1,
          status:
            datesStatus.get(newDateStr) === undefined
              ? 'unattend'
              : datesStatus.get(newDateStr)
        }
        if (months.get(monthIdx) === undefined) {
          const monthObj = {
            str: `${monthNames[month]}, ${year}`,
            num: month + 1,
            idx: i,
            uniqueID: monthIdx
          }
          i += 1
          months.set(monthIdx, monthObj)
        }
        if (monthlyDates.get(monthIdx) === undefined) {
          monthlyDates.set(monthIdx, [dateItem])
        } else {
          var dateArr = monthlyDates.get(monthIdx)
          dateArr.push(dateItem)
        }
      }
      // const monthsArr = [...months.values()]
      resolve({ dates: monthlyDates, months: months })
    } catch (err) {
      reject(err)
    }
  })
}

export { genDates, getDateStr }

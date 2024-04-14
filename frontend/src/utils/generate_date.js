function getDateStr(timestamp) {
  const date = new Date(timestamp)
  const dateStr = date.toISOString()
  const slicedDate = `${dateStr.slice(0, 10)}`
  return slicedDate
}

var genDates = function (selectedAttnd) {
  return new Promise((resolve, reject) => {
    try {
      const { start, end, attendances } = selectedAttnd
      const startDate = new Date(start)
      const endDate = new Date(end)
      const datesStatus = new Map()
      attendances.forEach((attnd) => {
        const dateStr = getDateStr(attnd.created_at)
        datesStatus.set(dateStr, attnd.status)
      })
      const months = []
      // const newMonthSet = new Set()
      for (
        var arr = [], dt = startDate;
        dt <= endDate;
        dt.setDate(dt.getDate() + 1)
      ) {
        let newDate = dt
        const weekDay = newDate.getDay()
        const month = newDate.getMonth()
        const year = newDate.getFullYear()
        const newDateStr = getDateStr(dt)
        const newEntry = `${newDateStr.slice(5, 7)}/${year}`
        // const newObj = { year: year, month: month }
        // const objName = `${month}/${year}`
        if (!months.includes(newEntry)) {
          months.push(newEntry)
        }
        const dateItem = {
          date: newDateStr,
          weekDay: weekDay + 1,
          month: month + 1,
          status:
            datesStatus.get(newDateStr) === undefined
              ? 'unattend'
              : datesStatus.get(newDateStr),
        }
        arr.push(dateItem)
      }
      resolve({ dates: arr, months: months })
    } catch (err) {
      reject(err)
    }
  })
}

export { genDates }

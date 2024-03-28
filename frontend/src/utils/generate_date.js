var genDates = function (start, end) {
  console.log(start, end)
  console.log(new Date(start), new Date(end))
  const months = []
  for (
    var arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    let newDate = new Date(dt)
    const newEntry = `${newDate.getMonth()}/${newDate.getFullYear()}`
    if (!months.includes(newEntry)) months.push(newEntry)
    const weekDay = newDate.getDay()
    const month = newDate.getMonth()
    newDate = newDate.toISOString()
    newDate = {
      date: `${newDate.slice(0, 10)}`,
      weekDay: weekDay + 1,
      month: month,
      isCurrentMonth: false,
      status: 'absent',
      isSelected: false,
      isToday: false,
    }
    arr.push(newDate)
  }

  return { dates: arr, months: months }
}

export { genDates }

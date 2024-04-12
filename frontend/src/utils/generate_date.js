var genDates = function (start, end) {
  const months = []
  for (
    var arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    let newDate = new Date(dt)
    const newDateStr = newDate.toISOString()
    const newEntry = `${newDateStr.slice(5, 7)}/${newDate.getFullYear()}`
    
    const weekDay = newDate.getDay()
    const month = newDate.getMonth()
    if (!months.includes(newEntry)){
      
    } months.push(newEntry)
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
  console.log(months)
  return { dates: arr, months: months }
}

export { genDates }

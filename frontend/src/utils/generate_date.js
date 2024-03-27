// var genDates = function (start, end) {
//   for (
//     var arr = [], dt = new Date(start);
//     dt <= new Date(end);
//     dt.setDate(dt.getDate() + 1)
//   ) {
//     const newDate = new Date(dt)
//     console.log(newDate)
//     const dateString = newDate.toISOString().slice(0, 10).join('')
//     console.log(dateString)
//     arr.push(dateString)
//   }
//   console.log(arr)
//   return arr
// }

var getDaysArray = function (start, end) {
  console.log(start, end)
  console.log(new Date(start), new Date(end))
  for (
    var arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    const newDate = new Date(dt)
    console.log(newDate)
    arr.push(new Date(dt))
  }
  console.log(arr)
  return arr
}

function getMonths (start, end) {}

// export { genDates }
export { getDaysArray }

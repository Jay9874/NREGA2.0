function genDates (year, startMonth, endMonth) {
  // Create an array to store the dates.
  const dates = []

  // Loop through the months of the year.
  for (let month = 0; month < 12; month++) {
    // Create a new Date object for the first day of the month.
    const date = new Date(year, month, 1)

    // Loop through the days of the month.
    while (date.getMonth() === month) {
      // Add the date to the array.
      dates.push(date)

      // Increment the date by one day.
      date.setDate(date.getDate() + 1)
    }
  }

  // Return the array of dates.
  return dates
}

export { genDates }

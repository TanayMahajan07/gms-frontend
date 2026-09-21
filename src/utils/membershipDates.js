export function calculateEndDate(startDate, duration, durationUnit) {
  if (!startDate || !duration || duration < 1 || !durationUnit) return ''

  const start = new Date(`${startDate}T00:00:00`)
  if (Number.isNaN(start.getTime())) return ''

  const end = new Date(start)
  const amount = Number(duration)

  if (durationUnit === 'DAY') {
    end.setDate(end.getDate() + amount)
  } else if (durationUnit === 'MONTH') {
    end.setMonth(end.getMonth() + amount)
  } else if (durationUnit === 'YEAR') {
    end.setFullYear(end.getFullYear() + amount)
  } else {
    return ''
  }

  end.setDate(end.getDate() - 1)
  return formatLocalDate(end)
}

export function calculateRenewStartDate(sourceEndDate, today = new Date()) {
  if (!sourceEndDate) return formatLocalDate(today)

  const end = new Date(`${sourceEndDate}T00:00:00`)
  if (Number.isNaN(end.getTime())) return formatLocalDate(today)

  const todayDate = new Date(today)
  todayDate.setHours(0, 0, 0, 0)

  if (end >= todayDate) {
    end.setDate(end.getDate() + 1)
    return formatLocalDate(end)
  }

  return formatLocalDate(todayDate)
}

function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

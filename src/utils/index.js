export const getWeatherIcons = (condition, cloud_cover) => {
  switch (true) {
    case (condition === 'dry' && cloud_cover === 0) :
      return '☀️';
      break
    case (condition === 'dry' && cloud_cover > 0 && cloud_cover < 50) :
      return '🌤'
      break
    case (condition === 'dry' && cloud_cover >= 50) :
      return '🌥'
      break
    case (condition === 'fog'):
      return '💨';
      break
    case (condition === 'rain'):
      return '🌧';
      break
    case (condition === 'sleet'):
      return '🌨';
      break
    case (condition === 'snow') :
      return '🌨';
      break
    case (condition === 'thunderstorm') :
      return '⛈';
      break
    default:
      return 'N/A'
  }
}

export const getRangeDate = () => {
  const daysAhead = 5
  const currentDate = new Date()
  const futureDate = currentDate.setDate(currentDate.getDate() + daysAhead)
  return {
    getDaysAhead: daysAhead,
    today: new Date().toISOString().substring(0, 10),
    futureDate: new Date(futureDate).toISOString().substring(0, 10),
    todayAsDate: currentDate
  }
}

export const customDate = new Date().toLocaleDateString('en-en', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour12: false,
})

export const getWeatherUrl = (lat, lon, today, futureDate) => {
  return `https://api.brightsky.dev/weather?lat=${lat}&lon=${lon}&date=${today}&last_date=${futureDate}`
}

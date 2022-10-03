import React, {useEffect, useState} from 'react'
import {
  Alert,
  Box,
  Button, Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FilledInput,
  FormControl, Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  Typography
} from '@mui/material';
import {Place, Send,} from '@mui/icons-material';
import axios from 'axios';
import WeatherBox from './components/WeatherBox';
import CurrentWeather from './components/CurrentWeather';
import {getWeatherIcons, getRangeDate, getWeatherUrl} from './utils/index.js'

const {today, getDaysAhead, futureDate} = getRangeDate()

export default function App() {
  const [currentPlace, setCurrentPlace] = useState(null)
  const [foundCity, setFoundCity] = useState(null)
  const [forecastWeather, setForecastWeather] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [searchCity, setSearchCity] = useState('')
  const [isFound, setIsFound] = useState(null)

  useEffect(() => {
    axios.get('https://ipwho.is/')
      .then(async res => {
        const {latitude, longitude, city, country_code} = res.data
        await setCurrentPlace({latitude, longitude, today, futureDate, city, country_code})
        axios.get(getWeatherUrl(latitude, longitude, today, futureDate))
          .then(res => {
            const {weather} = res.data
            setWeather(weather)
          })
          .catch(e => console.log(e))
      })
      .catch(e => console.log(e))
  }, [])

  useEffect(() => {
    isFound === false &&
    setTimeout(() => {
      resetInputDialog()
    }, 1500)
  }, [isFound])

  const resetInputDialog = () => {
    setIsFound(undefined)
    setSearchCity('')
  }

  const handleOpen = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSearchCity('')
    setIsFound(null)
    setFoundCity(null)
    setOpenDialog(false)
  }

  const handleConfirm = () => {
    const {latitude, longitude} = foundCity
    axios.get(getWeatherUrl(latitude, longitude, today, futureDate))
      .then(res => {
        const {weather} = res.data
        setWeather(weather)
      })
      .catch(e => console.log(e))
      .finally(() => {
        setCurrentPlace(foundCity)
        handleClose()
      })
  }

  const handleInputChange = (event) => {
    setSearchCity(event.target.value);
  };

  const getCity = () => {
    axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}`, {
      contentType: 'application/json'
    })
      .then(res => {
        if (res.data.results.length > 0) {
          setFoundCity(res.data.results[0])
          setIsFound(true)
        }
      })
      .catch(e => {
        setIsFound(false)
        console.log(e)
      })
  }

  const setWeather = (weather) => {
    let arr = []
    let getToday = new Date(today)
    const currentDayHour = new Date().toISOString().substring(0, 11) + new Date().toLocaleTimeString().substring(0, 2)

    for (let x = 0; x <= getDaysAhead; x++) {
      const dayX = new Date(getToday.setDate(getToday.getDate() + x)).toISOString().substring(0, 10)
      let dayArr = (weather.filter(obj => obj.timestamp.includes(dayX)))
      const highestTemp = dayArr.reduce((previous, current) => {
        return current.temperature > previous.temperature ? current : previous
      })
      const lowestTemp = dayArr.reduce((previous, current) => {
        return current.temperature < previous.temperature ? current : previous
      })
      arr.push({lowestTemp, highestTemp})
      getToday = new Date(today)
    }

    setCurrentWeather(weather.find(obj => obj.timestamp.includes(currentDayHour)))

    setForecastWeather(arr)
  }

  return (
    <>
      <Box sx={{
        textAlign: 'center',
        background: 'radial-gradient(circle farthest-side, rgb(56, 64, 96) 0%, rgb(12, 16, 24) 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '100vw',
        minHeight: '100vh',
        py:5
      }}>
        <Container maxWidth='md'>
          <Paper elevation={0} sx={{
            borderRadius: '2em',
            background: 'rgba(255, 255, 255, 0.25)',
            color: 'whitesmoke',
            border: '1px solid rgba(255,255,255,0.125)',
            boxShadow: 'rgba(255, 255, 255, 0.2) 0 0 16px',
            height: '100%'
          }}>
            {forecastWeather &&
              <Box sx={{p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <Box>
                  <Button sx={{color: 'whitesmoke', textTransform: 'none'}} onClick={handleOpen}>
                    <Place fontSize={'medium'} sx={{mr: 1}}/>
                    <Typography variant='h5'
                                sx={{fontWeight: 'light'}}>{`${currentPlace.city || currentPlace.name} - ${currentPlace.country_code}`}</Typography>
                  </Button>
                </Box>
                <Box>
                  <CurrentWeather
                    temperature={currentWeather.temperature}
                    wind_speed={currentWeather.wind_speed}
                    relative_humidity={currentWeather.relative_humidity}
                    condition={currentWeather.condition}
                    currentWeatherIcon={getWeatherIcons(currentWeather.condition, currentWeather.cloud_cover)}
                  />
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-around', mt: 2}}>
                  <Grid container spacing={3}>
                    {forecastWeather &&
                      forecastWeather.map((obj, index) => {
                        return (
                          <Grid key={index} item xs={6} sm={4} md={2}>
                            <WeatherBox
                              key={index}
                              currentDate={obj.highestTemp.timestamp}
                              lowestTemp={obj.lowestTemp.temperature}
                              highestTemp={obj.highestTemp.temperature}
                              lowestTempIcon={getWeatherIcons(obj.lowestTemp.condition, obj.lowestTemp.cloud_cover)}
                              highestTempIcon={getWeatherIcons(obj.highestTemp.condition, obj.highestTemp.cloud_cover)}
                            />
                          </Grid>
                        )
                      })
                    }
                  </Grid>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 3, mr: 3}}>
                  <a href='https://brightsky.dev/' target='_blank'>
                    <Typography variant='body1' color='whitesmoke'>
                      Weather data by: brightsky.dev
                    </Typography>
                  </a>
                </Box>
              </Box>
            }
          </Paper>
        </Container>
      </Box>
      <Dialog open={openDialog} onClose={handleClose}
              PaperProps={{style: {backgroundColor: 'transparent', borderRadius: '2em'}}}>
        <Paper
          sx={{
            background: 'rgba(255, 255, 255, .9)',
            textAlign: 'center',
          }}>
          <DialogTitle>Choose a city</DialogTitle>
          <DialogContent>
            <Box sx={{}}>
              <FormControl variant="filled">
                <InputLabel htmlFor="filled-city-search">City</InputLabel>
                <FilledInput
                  id="filled-city-search"
                  type='text'
                  value={searchCity}
                  onChange={handleInputChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={getCity}
                        edge="end"
                      >
                        <Send/>
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Box sx={{my: 2}}>
                {isFound === false && searchCity !== '' &&
                  < Alert severity="error">Not found, please try again.</Alert>
                }
                {isFound === true && foundCity.name === searchCity &&
                  <Alert severity="success">{foundCity.name}-{foundCity.country_code} has been found. Confirm?</Alert>
                }
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{display: 'flex', justifyContent: 'center', mb: 3}}>
            <Button variant='contained' onClick={handleConfirm} disabled={!foundCity}>Confirm</Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  )
}

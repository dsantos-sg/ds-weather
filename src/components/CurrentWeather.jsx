import {Box, Grid, Typography} from '@mui/material';
import {Air, Opacity} from '@mui/icons-material';
import React from 'react';
import {customDate, } from '../utils/index.js';

export default function CurrentWeather(props) {
  return (
    <Box sx={{flexGrow: 1}}>
      <Box sx={{my: 5}}>
        <Typography variant='h4' fontWeight='lighter' sx={{my: 3}}>{customDate}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h2' fontWeight='light'>{props.temperature.toFixed(0)} °C</Typography>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Air fontSize='large'/>
                <Typography variant='body2'>{props.wind_speed} km/h</Typography>
              </Grid>
              <Grid item xs={6}>
                <Opacity fontSize='large'/>
                <Typography variant='body2'>{props.relative_humidity ? props.relative_humidity : 'n/a'} %</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{mx: 'auto'}}>
              <Typography variant='h1'>
                {props.currentWeatherIcon}
              </Typography>
              <Typography variant='h4' sx={{fontWeight: 'light', textTransform: 'capitalize'}}>
                {props.condition}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

    </Box>
  )
}

import {Box, Typography} from '@mui/material';
import React from 'react';

export default function WeatherBox(props) {
  return (
    <>
      <Box sx={{m: 2}}>
        <Typography variant='h5'>
          {new Date(props.currentDate).toLocaleDateString('en-en',
            {
              month: 'short',
              day: 'numeric',
            })}
        </Typography>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Typography variant='h4' sx={{mr: 1}}>
            {props.lowestTempIcon}
          </Typography>
          <Typography variant='body2'>
            Min: {props.lowestTemp} °C
          </Typography>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Typography variant='h4' sx={{mr: 1}}>
            {props.highestTempIcon}
          </Typography>
          <Typography variant='body2'>
            Max: {props.highestTemp} °C
          </Typography>
        </Box>
      </Box>
    </>
  )
}

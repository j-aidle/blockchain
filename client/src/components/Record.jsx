import { Card, CardContent, IconButton, Typography, Grid, Box } from '@mui/material'
import React from 'react'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import { grey } from '@mui/material/colors'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const Record = ({ record }) => {
  const [subject, value, userId,adminId, timestamp] = record
  useNavigate()
  console.log(timestamp)

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <DescriptionRoundedIcon style={{ fontSize: 40, color: grey[700] }} />
          </Grid>
          <Grid item xs={3}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                Subject
              </Typography>
              <Typography variant='h6'>{subject}</Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                Grade
              </Typography>
              <Typography variant='h6'>{value}</Typography>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                Created By
              </Typography>
              <Typography variant='h6'>{adminId}</Typography>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                Created time
              </Typography>
              <Typography variant='h6'>{moment.unix(timestamp).format('DD-MM-YYYY HH:mm')}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Record

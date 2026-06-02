import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Divider, Grid, Card, CardContent } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link } from 'react-router-dom'
import { gridSpacing } from 'config'
import RoomCategory from './room-category/RoomCategory'
import { ToastContainer } from 'react-toastify'
import RoomType from './room-type/RoomType'
import RoomNo from './room-no/RoomNo'
import BedMaster from './bed-master/BedMaster'


const RoomManagement = () => {
  const [value, setValue] = useState(0)

  // Handle Tab change
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
         Room Management
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item>
          <Card>
            <CardContent style={{ width: '79vw' }}>
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={value} onChange={handleChange} centered>
                  <Tab label ="Room Category" />
                  <Tab label="Room Type"/>
                  <Tab label ="Room No./Name" />
                  <Tab label="Bed Master" />
                </Tabs>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  {value === 0 &&<RoomCategory/>}
                  {value === 1 && <RoomType/>}
                  {value === 2 && <RoomNo/>}
                  {value === 3 && <BedMaster/>}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer/>
    </>
  )
}

export default RoomManagement

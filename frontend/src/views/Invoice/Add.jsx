import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Divider, Grid, Button } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Gst from './Pages/Gst'


const Add = () => {
  const [value, setValue] = useState(0)
  const navigate = useNavigate();

  const [storedAllData, setStoredAllData] = useState({
    gst: {}
  })

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const renderMasterContent = () => {
    switch (value) {
      case 0:
        return <Gst setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      default:
        return null
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Add User
        </Typography>
      </Breadcrumb>

      <Button sx={{ mb: 2 }} variant="contained" onClick={() => navigate('/invoice-management')}>
        Back
      </Button>
      {/* Tabs for Master Selection */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons='auto'>
          <Tab label='GST Invoice' />
        </Tabs>
        <Divider />
      </Box>

      {/* Render the selected master content */}
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            {renderMasterContent()}
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </>
  )
}

export default Add

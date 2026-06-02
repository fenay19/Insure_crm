import React from 'react'
import ServiceRateHeader from './ServiceRateHeader'
import ServiceRateListServicesWise from './ServiceRateListServicesWise'
import { Typography, Card, Box, RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ImportExport } from '@mui/icons-material'
import { FormControl, FormLabel } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'

function ServiceRateMasterMainPage () {
  
  return (
    <>
      <Breadcrumb title='Service Rate'>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Service Rate master
        </Typography>
      </Breadcrumb>

      <Card>
        <ServiceRateHeader />
        <Divider />
        <ServiceRateListServicesWise />
      </Card>
      <ToastContainer/>
    </>
  )
}

export default ServiceRateMasterMainPage

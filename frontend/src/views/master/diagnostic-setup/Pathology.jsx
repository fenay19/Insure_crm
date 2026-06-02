import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Divider } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link } from 'react-router-dom'

import Unit from './addForms/Unit'
import Spicemen from './addForms/Spicemen'
import MachineMaster from './addForms/MachineMaster'
import TestMaster from './addForms/TestMaster'
import ProfileMaster from './addForms/ProfileMaster'

const Pathology = () => {
  const [value, setValue] = useState(0)

  // Handle Tab change
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // Render the appropriate master content based on the selected tab
  const renderMasterContent = () => {
    switch (value) {
      case 0:
        return <Unit />
      case 1:
        return <Spicemen />
      case 2:
        return <MachineMaster />
      case 3:
        return <TestMaster />
      case 4:
        return <ProfileMaster />
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
          Pathology Master
        </Typography>
      </Breadcrumb>

      {/* Tabs for Master Selection */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label='Unit Master' />
          <Tab label='Specimen Master' />
          <Tab label='Method/Machine Master' />
          <Tab label='Test Master' />
          <Tab label='Profile Master' />
        </Tabs>
        <Divider />
      </Box>

      {/* Render the selected master content */}
      <Box sx={{ mt: 0 }}>{renderMasterContent()}</Box>
    </>
  )
}

export default Pathology

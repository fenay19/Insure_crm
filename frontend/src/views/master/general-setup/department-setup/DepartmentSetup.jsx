import React from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { gridSpacing } from 'config.js'
import Department from './tabs/mainDepartment/Department'
import DepartmentType from './tabs/departmentType/DepartmentType'
import DepartmentSubType from './tabs/departmentSubType/DepartmentSubType'
import { ToastContainer } from 'react-toastify'

const DepartmentSetup = () => {
  const [value, setValue] = React.useState(2)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <Breadcrumb title=''>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Department Setup
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item>
          <Card>
            <CardContent style={{ width: '79vw' }}>
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={value} onChange={handleChange} centered>
                  <Tab label='Department Type' />
                  <Tab label='Department Subtype' />
                  <Tab label='Department Setups' />
                </Tabs>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  {value === 0 && <DepartmentType />}
                  {value === 1 && <DepartmentSubType />}
                  {value === 2 && <Department />}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  )
}

export default DepartmentSetup

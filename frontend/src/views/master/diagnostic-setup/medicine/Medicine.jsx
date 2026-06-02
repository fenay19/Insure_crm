import React from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'

import Breadcrumb from 'component/Breadcrumb'
import { gridSpacing } from 'config.js'
import Generic from './submaster/generic/Generic'
import CategoryMaster from './submaster/category/CategoryMaster'
import Route from './submaster/route/Route'
import Type from './submaster/type/Type'
import MedicineMaster from './medicineMaster/MedicineMaster'
import Dose from './submaster/dose/Dose'
import Brand from './submaster/brand/Brand'

const Medicine = () => {
  const [value, setValue] = React.useState(4)

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
          Medicine master
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item>
          <Card>
            <CardContent style={{ width: '79vw' }}>
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={value} onChange={handleChange} centered>
                  <Tab label='Generic Master' />
                  <Tab label='Type Master' />
                  <Tab label='Route Master' />
                  <Tab label='Category Master' />
                  <Tab label='Dose Master' />
                  <Tab label='Brand Master' />
                  <Tab label='Medicine' />
                </Tabs>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  {value === 0 && <Generic />}
                  {value === 1 && <Type />}
                  {value === 2 && <Route />}
                  {value === 3 && <CategoryMaster />}
                  {value === 4 && <Dose />}
                  {value === 5 && <Brand />}
                  {value === 6 && <MedicineMaster />}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Medicine

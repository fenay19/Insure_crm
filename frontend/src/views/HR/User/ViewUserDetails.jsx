import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { get } from 'api/api'
import { Box, Card, CardContent, Typography, Avatar, Grid, Tab, Tabs, Table, TableBody, TableCell, TableRow, Paper } from '@mui/material'

function ViewUserDetails () {
  const { id, userType } = useParams()
  const [userData, setUserData] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  // Object containing API endpoints mapped to user types
  const APIS = {
    ADMINISTRATIVE: 'administrative',
    SUPPORT: 'support'
  }

  // Validate the userType and fetch user data
  useEffect(() => {
    if (APIS[userType?.toUpperCase()]) {
      fetchData(APIS[userType.toUpperCase()])
    } else {
      console.error('Invalid user type')
    }
  }, [userType, id])

  // Function to fetch user data from the API
  const fetchData = async apiType => {
    try {
      const response = await get(`${apiType}/${id}`)
      const data = response.success === true ? response.data : []
      setUserData(data)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  if (!userData) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 4 }}>
      {/* Header Section */}
      <Card sx={{ display: 'flex', alignItems: 'center', padding: 3, gap: 3 }}>
        <Avatar
          src={`https://your-server-url.com/${userData.basicDetails.profilePhoto}`}
          alt={`${userData.basicDetails.firstName} ${userData.basicDetails.lastName}`}
          sx={{ width: 120, height: 120 }}
        />
        <Box>
          <Typography variant='h5' fontWeight='bold'>
            {`${userData.basicDetails.firstName} ${userData.basicDetails.lastName}`}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {userData.basicDetails.designation || 'Employee'}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {userData.basicDetails.email}
          </Typography>
        </Box>
      </Card>

      {/* Tabs Section */}
      <Box sx={{ marginTop: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
          <Tab label='Basic Details' />
          <Tab label='Employment Details' />
          <Tab label='Documentation' />
          <Tab label='HR/Finance' />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Paper sx={{ marginTop: 2, padding: 3 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Basic Details */}
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>Full Name:</Typography>
              <Typography>{`${userData.basicDetails.firstName} ${userData.basicDetails.middleName || ''} ${
                userData.basicDetails.lastName
              }`}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>Contact Number:</Typography>
              <Typography>{userData.basicDetails.contactNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>Email:</Typography>
              <Typography>{userData.basicDetails.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>Residential Address:</Typography>
              <Typography>{userData.basicDetails.residentialAddress}</Typography>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {/* Employment Details */}
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>Department:</Typography>
              <Typography>{userData.employmentDetails.departmentOrSpeciality}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>Joining Date:</Typography>
              <Typography>{new Date(userData.employmentDetails.joiningDate).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>Location:</Typography>
              <Typography>{userData.employmentDetails.location}</Typography>
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Table>
            {/* Documentation Details */}
            <TableBody>
              <TableRow>
                <TableCell>Offer Letter</TableCell>
                <TableCell>
                  <a href={`https://your-server-url.com/${userData.documentation.offerLetter}`} target='_blank' rel='noopener noreferrer'>
                    View
                  </a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Testing Document</TableCell>
                <TableCell>
                  <a href={`https://your-server-url.com/${userData.documentation.testing}`} target='_blank' rel='noopener noreferrer'>
                    View
                  </a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            {/* HR/Finance Details */}
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>Bank Name:</Typography>
              <Typography>{userData.hrFinance.bankName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>Account Number:</Typography>
              <Typography>{userData.hrFinance.bankAccountNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='subtitle2'>PAN Card No:</Typography>
              <Typography>{userData.hrFinance.panCardNo}</Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  )
}

export default ViewUserDetails

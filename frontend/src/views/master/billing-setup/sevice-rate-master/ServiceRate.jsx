import React, { useState, useEffect } from 'react'
import NoDataPlaceholder from '../../../../component/NoDataPlaceholder'
import Loader from 'component/Loader/Loader'
import { get, post, put } from 'api/api'
import HistoryIcon from '@mui/icons-material/History'
import Breadcrumb from 'component/Breadcrumb'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import ServiceRateHeader from './ServiceRateHeader'
import ImportExport from 'component/ImportExport'
import { format } from 'date-fns'

const item = {
  _id: '12345ABC',
  createdAt: new Date('2024-02-01T10:30:00'),
  updatedAt: new Date('2024-02-02T15:45:00')
}

const ServiceRate = () => {
  const [serverData, setServerData] = useState([])
  const [showData, setShowData] = useState([])
  const [loader, setLoader] = useState(true)
  const [serviceRatePathlogyData, setServiceRatePathlogyData] = useState([])

  const [pathologyData, setPathologyData] = useState([])
  const [radiologyData, setRadiologyData] = useState([])
  const [opdPackageData, setOpdPackageData] = useState([])
  const [formType, setFormType] = useState('Pathology')
  const [editMode, setEditMode] = useState(null)
  const [headerClickData, setHeaderClickData] = useState({})
  // Filter data based on search input
  const filterData = e => {
    const searchValue = e.target.value.toLowerCase()
    const filteredData = serverData.filter(
      item =>
        item.serviceGroupOrBillGroup.toLowerCase().includes(searchValue) ||
        item.detailServiceName.toLowerCase().includes(searchValue) ||
        item.department.toLowerCase().includes(searchValue)
    )
    setShowData(filteredData)
  }

  // Handle form type change
  const handleChangeFormType = e => {
    const selectedFormType = e.target.value
    setFormType(selectedFormType)

    // Update showData based on the selected form type
    switch (selectedFormType) {
      case 'Pathology':
        setShowData(pathologyData)
        break
      case 'Radiology':
        setShowData(radiologyData)
        break
      case 'OPD Package':
        setShowData(opdPackageData)
        break
      case 'Other Services':
        setShowData(serverData)
        break
      default:
        setShowData([])
    }
  }

  // // Fetch TPA data
  // const getTpaData = async () => {
  //   try {
  //     const response = await get('insurance-company/tpa');
  //     setTpaData(response.allTpaCompany || []);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // Fetch Pathology data
  const fetchPathologyData = async () => {
    setLoader(true)
    try {
      const response = await get('investigation-pathology-master')
      const serviceRateData = await get('/investigation-pathology-service-rate/get-all-service-rate-pathology')
      console.log('RESPONSE', serviceRateData)
      setServiceRatePathlogyData(serviceRateData?.data ?? [])
      setPathologyData(response?.investigations || [])
      if (formType === 'Pathology') {
        setShowData(response.investigations || [])
      }
      setLoader(false)
    } catch (error) {
      console.error(error)
      setLoader(false)
    }
  }

  const filterServicRateFilter = serviceRatePathlogyData?.filter(
    data => data?.category?.toLowerCase() === headerClickData?.category?.toLowerCase()?.trim()
  )

  // Fetch Radiology data
  const fetchRadiologyData = async () => {
    setLoader(true)
    try {
      const response = await get('investigation-radiology-master')
      setRadiologyData(response.investigation || [])
      if (formType === 'Radiology') {
        setShowData(response.investigation || [])
      }
      setLoader(false)
    } catch (error) {
      console.error(error)
      setLoader(false)
    }
  }

  // Fetch OPD Package data
  const fetchOpdPackageData = async () => {
    setLoader(true)
    try {
      const response = await get('opd-package')
      setOpdPackageData(response.package || [])
      if (formType === 'OPD Package') {
        setShowData(response.package || [])
      }
      setLoader(false)
    } catch (error) {
      console.error(error)
      setLoader(false)
    }
  }

  // Fetch Other Services data
  const getOtherServiceData = async () => {
    setLoader(true)
    try {
      const response = await get('service-details-master')
      const dataWithSr = response.service.map((item, index) => ({ ...item, sr: index + 1 }))
      setServerData(dataWithSr)
      if (formType === 'Other Services') {
        setShowData(dataWithSr)
      }
      setLoader(false)
    } catch (error) {
      console.error(error)
      setLoader(false)
    }
  }
  const getOpdConsultantService = async () => {
    setLoader(true)
    try {
      const response = await get('opd-consultant-service/all')
      const dataWithSr = response?.data?.map((item, index) => ({ ...item, sr: index + 1 }))
      console.log('DATA WTHJ sr', dataWithSr)
      console.log('response', response)
      setServerData(dataWithSr)
      if (formType === 'OPD Consultant') {
        setShowData(response?.data || [])
      }
      setLoader(false)
    } catch (error) {
      console.error(error)
      setLoader(false)
    }
  }

  const handleSave = async id => {
    try {
      // Find the item being edited
      const updatedItem = showData.find(item => item._id === id)

      // Prepare the payload with updated values
      const payload = {
        newCode: updatedItem.newCode,
        rate: updatedItem.rate,
        category: headerClickData?.category,
        pathologyId: id
      }

      // Determine the API URL based on formType
      let API_URL
      switch (formType) {
        case 'Pathology':
          // API_URL = `investigation-pathology-master/update-rate/${id}`;
          API_URL = `investigation-pathology-service-rate/update-rate-code`
          break
        case 'Radiology':
          API_URL = `investigation-radiology-master/update-rate/${id}`
          break
        case 'OPD Package':
          API_URL = `opd-package/update-rate/${id}`
          break
        case 'Other Services':
          API_URL = `service-details-master/update-rate/${id}`
          break
        case 'OPD Consultant':
          API_URL = `opd-consultant-service/update-rate/${id}`
          break
        default:
          console.error('Invalid form type')
          return
      }

      // Perform the PUT API call
      const response = await put(API_URL, payload)
      if (response) {
        toast.success('Added successfully')
      }

      // Log the response and handle success

      // Exit edit mode after saving
      setEditMode(null)
    } catch (err) {
      console.error('Error while saving:', err)
    }
  }

  const [open, setOpen] = useState(false)

  // Open the dialog
  const handleOpen = ID => {
    console.log('Delete clicked for', ID)
    setOpen(true)
  }

  // Close the dialog
  const handleClose = () => {
    setOpen(false)
  }

  
  useEffect(() => {
    // getTpaData();
    // getGipsaaData();
    fetchPathologyData()
    fetchRadiologyData()
    fetchOpdPackageData()
    getOtherServiceData()
    getOpdConsultantService()
  }, [formType])

  

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
        <ServiceRateHeader setHeaderClickData={setHeaderClickData} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            margin: '20px 15px'
          }}
        >
          <ImportExport />
        </Box>
        <hr style={{ margin: '10px 0' }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FormControl>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <FormLabel style={{ marginRight: '6px' }}>
                  <strong>Filter:</strong>
                </FormLabel>
                <RadioGroup row name='formType' value={formType} onChange={handleChangeFormType}>
                  <FormControlLabel value='Pathology' control={<Radio size='medium' />} label='Pathology' />
                  <FormControlLabel value='Radiology' control={<Radio size='medium' />} label='Radiology' />
                  <FormControlLabel value='OPD Package' control={<Radio size='medium' />} label='OPD Package' />
                  <FormControlLabel value='Other Services' control={<Radio size='medium' />} label='Other Services' />
                  <FormControlLabel value='OPD Consultant' control={<Radio size='medium' />} label='OPD Consultant' />
                </RadioGroup>
              </div>
            </FormControl>
          </div>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2
            }}
          >
            <input
              style={{
                height: '40px',
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid #126078',
                outline: 'none',
                transition: 'all 0.3s',
                width: '300px'
              }}
              className='search_input'
              type='search'
              placeholder='Search...'
              onChange={filterData}
            />
          </Box>
        </Box>

        <CardContent>
          {loader ? (
            <Loader />
          ) : (
            <>
              {showData.length === 0 ? (
                <NoDataPlaceholder />
              ) : (
                <TableContainer style={{ margin: '20px', padding: '10px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center' style={styles.th}>
                          SN
                        </TableCell>
                        <TableCell align='center' style={styles.th}>
                          Service/Bill Group
                        </TableCell>
                        <TableCell align='center' style={styles.th}>
                          Service Name
                        </TableCell>
                        <TableCell align='center' style={styles.th}>
                          Department
                        </TableCell>
                        <TableCell align='center' style={styles.th}>
                          Code
                        </TableCell>
                        <TableCell align='center' style={styles.th}>
                          Rate
                        </TableCell>
                        <TableCell align='center' style={styles.th}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {showData.map((item, index) => (
                        <TableRow key={item._id} hover>
                          <TableCell align='center' style={styles.td}>
                            {index + 1}
                          </TableCell>
                          <TableCell align='center' style={styles.td}>
                            {item?.billGroup || item?.serviceGroupOrBillGroup}
                          </TableCell>
                          <TableCell align='center' style={styles.td}>
                            {item.detailServiceName ||
                              item?.services?.[0]?.detailServiceName ||
                              item?.testName ||
                              `OPD Consultation (${item?.type}) (${item?.consultantName})`}
                          </TableCell>
                          <TableCell align='center' style={styles.td}>
                            {item.department}
                          </TableCell>
                          <TableCell align='center' style={styles.td}>
                            <TextField
                              variant='outlined'
                              size='small'
                              value={item.newCode}
                              onChange={e =>
                                setShowData(prev => prev.map(row => (row._id === item._id ? { ...row, newCode: e.target.value } : row)))
                              }
                              InputProps={{
                                sx: {
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: item.newCode ? 'green' : 'red',
                                    borderWidth: '3px'
                                  }
                                }
                              }}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell align='center' style={styles.td}>
                            <TextField
                              variant='outlined'
                              size='small'
                              value={item.rate}
                              // color={item.rate ? "success" : "error"}
                              onChange={e =>
                                setShowData(prev => prev.map(row => (row._id === item._id ? { ...row, rate: e.target.value } : row)))
                              }
                              InputProps={{
                                sx: {
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: item.rate ? 'green' : 'red',
                                    borderWidth: '3px'
                                  }
                                }
                              }}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell align='center' style={styles.td}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 1
                              }}
                            >
                              <Button variant='contained' color='success' size='small' onClick={() => handleSave(item._id)}>
                                Save
                              </Button>
                              <Button
                                variant='contained'
                                color='error'
                                size='small'
                                onClick={() => console.log('Delete clicked for', item._id)}
                              >
                                Delete
                              </Button>
                              <Button variant='contained' color='primary' size='small' onClick={() => handleOpen(item?._id)}>
                                <HistoryIcon />
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
          <ToastContainer />
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>History Details</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Code Details Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
                    Code Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body1'>
                      <strong>Updated By:</strong>
                    </Typography>
                    <Typography variant='body1'>Jhon</Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body1'>
                      <strong>Created At:</strong>
                    </Typography>
                    <Typography variant='body1'>
                      {item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy hh:mm a') : 'N/A'}
                    </Typography>
                  </Box>

                  <Box display='flex' justifyContent='space-between' mt={1}>
                    <Typography variant='body1'>
                      <strong>Updated At:</strong>
                    </Typography>
                    <Typography variant='body1'>
                      {item.updatedAt ? format(new Date(item.updatedAt), 'dd/MM/yyyy hh:mm a') : 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Rate Details Card */}
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
                    Rate Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body1'>
                      <strong>Updated By:</strong>
                    </Typography>
                    <Typography variant='body1'>Jhon</Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body1'>
                      <strong>Created At:</strong>
                    </Typography>
                    <Typography variant='body1'>
                      {item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy hh:mm a') : 'N/A'}
                    </Typography>
                  </Box>

                  <Box display='flex' justifyContent='space-between' mt={1}>
                    <Typography variant='body1'>
                      <strong>Updated At:</strong>
                    </Typography>
                    <Typography variant='body1'>
                      {item.updatedAt ? format(new Date(item.updatedAt), 'dd/MM/yyyy hh:mm a') : 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

const styles = {
  th: {
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
    border: '1px solid #000'
  },
  td: {
    border: '1px solid #000'
  }
}

export default ServiceRate

import React, { useEffect, useState } from 'react'
import HistoryIcon from '@mui/icons-material/History'
import {
  Box,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Table,
  Button,
  TablePagination,
  Checkbox
} from '@mui/material'
import Loader from 'component/Loader/Loader'
import { get, put } from 'api/api'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import { Save } from '@mui/icons-material'
import { clearSelectedItemIdForViewHistory, setSelectedItemIdForViewHistory } from 'reduxSlices/serviceRateMasterSlices'
import ViewHistoryOfServiceRates from '../ViewHistoryOfServiceRates'
import ImportExport from 'component/ImportExport'

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

// Debounce function to delay search execution
const debounce = (func, delay) => {
  let timeoutId
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

function OtherServicesTable () {
  const [otherServicesData, setOtherServicesData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [serviceRates, setServiceRates] = useState({})
  const [serviceCodes, setServiceCodes] = useState({})
  const [isValidStates, setIsValidStates] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const { selectedServiceRateListItem, selectedFilter } = useSelector(state => state.serviceRateListMaster)
  const dispatch = useDispatch()

  // Fetch other services data
  const fetchOtherServices = async () => {
    setIsLoading(true)
    try {
      const services = await get('service-details-master')
      setOtherServicesData(services.service.length > 0 ? services.service : [])
      setFilteredData(services.service.length > 0 ? services.service : []) // Initialize filtered data
    } catch (error) {
      console.error('Error fetching other services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch service codes and rates
  const fetchServiceCodesAndRates = async () => {
    try {
      const response = await get(`service-rate-new/getServiceCodesAndRates/${selectedServiceRateListItem._id}/${selectedFilter}`)
      if (response.success) {
        setServiceRates(response.rateList)
        setServiceCodes(response.codeList)
      }
    } catch (error) {
      toast.error(`Error fetching service codes and rates: ${error.message || error}`)
    }
  }

  // Fetch isValid status of records
  const fetchIsValidStatusOfRecords = async () => {
    setIsLoading(true)
    try {
      const response = await get(`service-rate-new/getIsValidStatusOfRecords/${selectedServiceRateListItem._id}/${selectedFilter}`)
      if (response.success) {
        setIsValidStates(response.isValidList)
      }
    } catch (error) {
      toast.error(`Error fetching is-valid status: ${error.message || error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search term change with debouncing
  const handleSearch = debounce(term => {
    const filtered = otherServicesData.filter(item => {
      return (
        item.detailServiceName.toLowerCase().includes(term.toLowerCase()) ||
        item.serviceGroupOrBillGroup.toLowerCase().includes(term.toLowerCase()) ||
        item.department.some(dept => dept.toLowerCase().includes(term.toLowerCase()))
      )
    })
    setFilteredData(filtered)
    setPage(0)
  }, 1000)

  useEffect(() => {
    fetchServiceCodesAndRates()
    fetchIsValidStatusOfRecords()
  }, [selectedServiceRateListItem._id, selectedFilter])

  useEffect(() => {
    fetchOtherServices()
  }, [])

  // Handle service rate change
  const handleServiceRateChange = (id, value) => {
    setServiceRates(prev => ({
      ...prev,
      [id]: value
    }))
  }

  // Handle service code change
  const handleServiceCodeChange = (id, value) => {
    setServiceCodes(prev => ({
      ...prev,
      [id]: value
    }))
  }

  // Handle isValid change
  const handleIsValidChange = async (id, isValid) => {
    const payload = {
      serviceRateListItemId: selectedServiceRateListItem._id,
      filter: selectedFilter,
      serviceIdOfRelatedMaster: id,
      isValid: isValid
    }

    try {
      const response = await put(`service-rate-new/valid/updateRecordIsValid`, payload)
      if (response.success) {
        toast.success(response.message)
        setIsValidStates(prev => ({
          ...prev,
          [response.data.serviceIdOfRelatedMaster]: response.data.isValid
        }))
      } else {
        toast.error('Something went wrong')
      }
    } catch (error) {
      console.error('Error updating isValid status:', error)
      toast.error('Failed to update isValid status.')
    }
  }

  // Handle save
  const handleSave = async item => {
    const serviceRateListItemId = selectedServiceRateListItem._id
    const filter = selectedFilter
    const serviceIdOfRelatedMaster = item._id
    const rate = serviceRates[item._id]
    const code = serviceCodes[item._id]

    if (!rate || !code) {
      toast.error('Please enter both service rate and service code.')
      return
    }

    try {
      const payload = {
        serviceRateListItemId: serviceRateListItemId,
        filter: filter,
        serviceIdOfRelatedMaster: serviceIdOfRelatedMaster,
        rate: rate,
        code: code
      }

      const response = await put(`service-rate-new`, payload)

      if (response.success) {
        toast.success(response.message)
      } else {
        toast.error('Something went wrong')
      }
    } catch (error) {
      console.error('Error saving service rate and code:', error)
      alert('Failed to save service rate and code.')
    }
  }

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const handleOpenHistory = id => {
    setIsHistoryModalOpen(true)
    dispatch(setSelectedItemIdForViewHistory(id))
  }

  const handleCloseHistoryModal = () => {
    dispatch(clearSelectedItemIdForViewHistory())
    setIsHistoryModalOpen(false)
  }

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Calculate the current rows to display
  const currentRows = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px' }}>
        <TextField
          variant='outlined'
          placeholder='Search by service, bill group, department'
          size='small'
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value)
            handleSearch(e.target.value) // Trigger debounced search
          }}
          sx={{ width: '400px' }}
        />

        <ImportExport />
      </Box>
      <TableContainer component={Paper} style={{ margin: '20px', padding: '10px' }}>
        <Table width='100%'>
          <TableHead>
            <TableRow>
              <TableCell align='center' style={styles.th}>
                Valid
              </TableCell>
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
            {currentRows.map((item, index) => (
              <TableRow key={item._id} sx={{ backgroundColor: isValidStates[item._id] !== false ? '' : '#fab57a' }}>
                <TableCell align='center' style={styles.td}>
                  <Checkbox
                    checked={isValidStates[item._id] !== false}
                    onChange={e => handleIsValidChange(item._id, e.target.checked)}
                    color='primary'
                  />
                </TableCell>
                <TableCell align='center' style={styles.td}>
                  {index + 1 + page * rowsPerPage}
                </TableCell>
                <TableCell align='center' style={styles.td}>
                  {item.serviceGroupOrBillGroup}
                </TableCell>
                <TableCell align='center' style={styles.td}>
                  {item.detailServiceName}
                </TableCell>
                <TableCell align='center' style={styles.td}>
                  {item.department.length > 0 ? item.department.join(', ') : 'No Department Found'}
                </TableCell>
                <TableCell align='center' style={styles.td}>
                  <TextField
                    variant='outlined'
                    size='small'
                    value={serviceCodes[item._id] || ''}
                    onChange={e => handleServiceCodeChange(item._id, e.target.value)}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: serviceCodes[item._id] ? 'green' : 'red',
                          borderWidth: '2px'
                        }
                      }
                    }}
                  />
                </TableCell>
                <TableCell align='center' style={styles.td}>
                  <TextField
                    variant='outlined'
                    size='small'
                    value={serviceRates[item._id] || ''}
                    onChange={e => handleServiceRateChange(item._id, e.target.value)}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: serviceCodes[item._id] ? 'green' : 'red',
                          borderWidth: '2px'
                        }
                      }
                    }}
                  />
                </TableCell>
                <TableCell align='center' style={styles.td}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button variant='contained' size='medium' sx={{ bgcolor: 'green' }} onClick={() => handleSave(item)}>
                      <Save />
                    </Button>
                    <Button variant='contained' size='medium' sx={{ bgcolor: '#407088' }} onClick={() => handleOpenHistory(item._id)}>
                      <HistoryIcon />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          component='div'
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <ViewHistoryOfServiceRates isOpen={isHistoryModalOpen} onClose={handleCloseHistoryModal} />
      <ToastContainer />
    </>
  )
}

export default OtherServicesTable

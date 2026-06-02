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
import { toast, ToastContainer } from 'react-toastify'
import { Save } from '@mui/icons-material'
import ViewHistoryOfServiceRates from '../ViewHistoryOfServiceRates'
import { clearSelectedItemIdForViewHistory, setSelectedItemIdForViewHistory } from 'reduxSlices/serviceRateMasterSlices'
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

function PathologyServicesTable () {
  const [pathologyServicesData, setPathologyServicesData] = useState([])
  const [filteredData, setFilteredData] = useState([]) // State for filtered data
  const [isLoading, setIsLoading] = useState(false)
  const [serviceRates, setServiceRates] = useState({})
  const [serviceCodes, setServiceCodes] = useState({})
  const [isValidStates, setIsValidStates] = useState({})
  const [searchTerm, setSearchTerm] = useState('') // State for search term
  const { selectedServiceRateListItem, selectedFilter } = useSelector(state => state.serviceRateListMaster)
  const dispatch = useDispatch()

  // Fetch pathology services
  const fetchPathologyServices = async () => {
    setIsLoading(true)
    try {
      const services = await get('investigation-pathology-master')
      setPathologyServicesData(services.investigations || [])
      setFilteredData(services.investigations || []) // Initialize filtered data
    } catch (error) {
      console.error('Error fetching pathology services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch service codes and rates
  const fetchServiceCodesAndRates = async () => {
    setIsLoading(true)
    try {
      const response = await get(`service-rate-new/getServiceCodesAndRates/${selectedServiceRateListItem._id}/${selectedFilter}`)

      if (response.success) {
        setServiceRates(response.rateList)
        setServiceCodes(response.codeList)
      }
    } catch (error) {
      toast.error(`Error fetching service codes and rates: ${error.message || error}`)
    } finally {
      setIsLoading(false)
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

  // Handle search term change
  const handleSearch = event => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = pathologyServicesData.filter(
      item =>
        item.testName.toLowerCase().includes(term) || // Search by test name
        item.billGroup.toLowerCase().includes(term) || // Search by bill group
        item.department.toLowerCase().includes(term)
    )
    setFilteredData(filtered)
  }

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

  // Handle history modal open
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const handleOpenHistory = id => {
    setIsHistoryModalOpen(true)
    dispatch(setSelectedItemIdForViewHistory(id))
  }

  const handleCloseHistoryModal = () => {
    dispatch(clearSelectedItemIdForViewHistory())
    setIsHistoryModalOpen(false)
  }

  // Pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const currentRows = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Fetch data on component mount
  useEffect(() => {
    fetchPathologyServices()
    fetchServiceCodesAndRates()
    fetchIsValidStatusOfRecords()
  }, [selectedServiceRateListItem._id, selectedFilter])

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px' }}>
        <TextField
          variant='outlined'
          size='small'
          placeholder='Search by service, bill group, department'
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: '400px' }}
        />

        <ImportExport />
      </Box>

      {/* Table */}
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
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align='center' style={styles.td}>
                  {item.billGroup}
                </TableCell>
                <TableCell align='center' style={styles.td}>
                  {item.testName}
                </TableCell>
                <TableCell align='center' style={styles.td}>
                  {item.department}
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

      {/* History Modal */}
      <ViewHistoryOfServiceRates isOpen={isHistoryModalOpen} onClose={handleCloseHistoryModal} />
       <ToastContainer />
    </>
  )
}

export default PathologyServicesTable

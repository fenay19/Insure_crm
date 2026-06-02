import React, { useEffect, useState } from 'react'
import {
  TextField,
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CardActionArea,
  List,
  ListItem,
  Tooltip
} from '@mui/material'
import { Cancel, Save } from '@mui/icons-material'
import { get, post, put } from 'api/api'
import { toast } from 'react-toastify'
import { Card } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { clearSelectedServiceRateListItem, setSelectedServiceRateList } from 'reduxSlices/serviceRateMasterSlices'
import ViewValidSelectedServices from './ViewValidSelectedServices'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import GroupsIcon from '@mui/icons-material/Groups' // Suggested icon for "View Parent Payee"

const scrollableRow = {
  display: 'flex',
  overflowX: 'auto',
  gap: '12px',
  padding: '12px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  '&::-webkit-scrollbar': {
    height: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#bbb',
    borderRadius: '6px'
  }
}

const ServiceRateHeader = () => {
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false) // Track edit mode
  const [newRateList, setNewRateList] = useState({
    name: '',
    category: '',
    parentPayee: [],
    payee: []
  })
  const [allCategoryData, setAllCategoryData] = useState([])
  const [insuranceMasterData, setInsuranceMasterData] = useState([])
  const [governmentCompanyData, setGovernmentCompanyData] = useState([])
  const [corporateCompanyPrivate, setCorporateCompanyPrivate] = useState([])
  const [corporateCompanyPublic, setCorporateCompanyPublic] = useState([])
  const [serviceRateList, setServiceRateList] = useState([])
  const [filteredServiceRateList, setFilterdServiceRateList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [tpaData, setTpaData] = useState([])
  const [selectedServiceRate, setSelectedServiceRate] = useState(null)
  const [dataForPatientPayee, setDataForPatientPayee] = useState([])
  const [gipsaaData, setGispaData] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [isViewValidEntriesModalOpen, setIsViewValidEntriesModalOpen] = useState(false)
  const [selectedServiceRateForView, setSelectedServiceRateForView] = useState()
  const [isDeleteServiceRateListItemOpen, setIsDeleteServiceRateItemOpen] = useState(false)
  const [isViewPayeeDialogOpen, setIsViewPayeeDialogOpen] = useState(false)

  const dispatch = useDispatch()

  // Fetch data functions
  const fetchInsuranceMasterData = async () => {
    const response = await get('insurance-company')
    setInsuranceMasterData(response?.allInsuranceCompany?.length > 0 ? response.allInsuranceCompany : [])
  }

  const fetchGovernmentCompanyData = async () => {
    const response = await get('insurance-company/gov')
    setGovernmentCompanyData(response.allGovermentCompany.length > 0 ? response.allGovermentCompany : [])
  }

  const fetchCorporateCompanyPrivate = async () => {
    const response = await get('insurance-company/co-operative-private')
    setCorporateCompanyPrivate(response.allCooperativeCompany.length > 0 ? response.allCooperativeCompany : [])
  }

  const fetchCorporateCompanyPublic = async () => {
    const response = await get('insurance-company/co-operative')
    setCorporateCompanyPublic(response.allCooperativeCompany.length > 0 ? response.allCooperativeCompany : [])
  }

  const fetchTpaCompnayData = async () => {
    const response = await get('insurance-company/tpa')
    setTpaData(response?.allTpaCompany.length > 0 ? response?.allTpaCompany : [])
  }

  useEffect(() => {
    if (newRateList?.category.trim().toLowerCase() === 'INSURANCE'.trim().toLowerCase()) {
      setDataForPatientPayee(insuranceMasterData?.map(item => item.insuranceCompanyName))
    }
    if (newRateList?.category.trim().toLowerCase() === 'CHARITY'.trim().toLowerCase()) {
      setDataForPatientPayee(['Weaker', 'Indigenous']?.map(item => item))
    }
    if (newRateList?.category.trim().toLowerCase() === 'GENERAL CASH'.trim().toLowerCase()) {
      setDataForPatientPayee(['Cash']?.map(item => item))
    }

    if (newRateList?.category.trim().toLowerCase() === 'GOVERNMENT SCHEME'.trim().toLowerCase()) {
      setDataForPatientPayee(governmentCompanyData?.map(item => item.govermentCompanyName))
    }

    if (newRateList?.category.trim().toLowerCase() === 'CORPORATE PRIVATE'.trim().toLowerCase()) {
      setDataForPatientPayee(corporateCompanyPrivate?.map(item => item.cooperativeCompanyName))
    }

    if (newRateList?.category.trim().toLowerCase() === 'CORPORATE PUBLIC'.trim().toLowerCase()) {
      setDataForPatientPayee(corporateCompanyPublic?.map(item => item.cooperativeCompanyName))
    }
    if (newRateList?.category.trim().toLowerCase() === 'gipsaa'.trim().toLowerCase()) {
      setDataForPatientPayee(gipsaaData?.map(item => item?.gipsaaCompanyName))
    }
  }, [newRateList?.category, insuranceMasterData, governmentCompanyData, corporateCompanyPublic, corporateCompanyPrivate, gipsaaData])

  useEffect(() => {
    ;(async () => {
      const response = await get('category/parent-group')
      setAllCategoryData(response?.data ?? [])
    })()
  }, [])

  const fetchSeriveRateListDetails = async () => {
    const response = await get('service-rate-new')
    setServiceRateList(response?.data.length > 0 ? response?.data : [])
    setFilterdServiceRateList(response?.data.length > 0 ? response?.data : [])
  }

  const fetchGipsaa = async () => {
    try {
      const response = await get('gipsaa-company')
      setGispaData(response?.allGipsaaCompany || [])
    } catch (error) {
      console.error(error)
    }
  }

  // Handle new/edit rate list change
  const handleNewRateListChange = (field, value) => {
    setNewRateList(prev => ({ ...prev, [field]: value }))
  }

  // Handle save for both add and edit
  const handleSave = async () => {
    try {
      if (newRateList.name && newRateList.category && (newRateList.category === 'Cash' || newRateList.parentPayee)) {
        let response
        if (isEditMode) {
          // Edit mode: Update existing rate list
          response = await put(`service-rate-new/${selectedServiceRate._id}`, newRateList)
          // console.log(response)
        } else {
          // Add mode: Create new rate list
          response = await post('service-rate-new', newRateList)
        }

        console.log(response)

        if (response.success) {
          fetchSeriveRateListDetails()
          toast.success(response?.message || (isEditMode ? 'Updated Successfully' : 'Added Successfully'))
          setNewRateList({ name: '', category: '', parentPayee: [], payee: [] })
          setIsNewOpen(false)
          setIsEditMode(false)
        } else {
          toast.error('something went wrong')
        }
      } else {
        toast.warning('Please fill all required fields before saving.')
      }
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  const handleClickOnServiceRateItem = item => {
    dispatch(setSelectedServiceRateList(item))
    setSelectedId(item._id)
  }

  // Open edit dialog
  const handleEdit = data => {
    setNewRateList({
      name: data.name,
      category: data.category,
      parentPayee: data.parentPayee || [],
      payee: data.payee || []
    })
    setSelectedServiceRate(data)
    setIsEditMode(true)
    setIsNewOpen(true)
  }

  // Reset form on dialog close
  const handleDialogClose = () => {
    setIsNewOpen(false)
    setIsEditMode(false)
    setNewRateList({ name: '', category: '', parentPayee: [], payee: [] })
  }

  // Render the dialog title based on mode

  const handleView = data => {
    setIsViewValidEntriesModalOpen(true)
    setSelectedServiceRateForView(data)
  }

  const closeViewModal = () => {
    setIsViewValidEntriesModalOpen(false)
    setSelectedServiceRateForView({})
  }

  const handleDelete = data => {
    setIsDeleteServiceRateItemOpen(true)
    setSelectedServiceRate(data)
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await put(`service-rate-new/deleteServiceRateListItem/${selectedServiceRate._id}`)
      if (response.success) {
        toast.success(response.message)
        fetchSeriveRateListDetails()
      } else {
        toast.error(response.message || 'Failed to delete the item. Please try again.')
      }
    } catch (error) {
      toast.error('Error deleting service rate list item:')
      console.log(error)
    } finally {
      setIsDeleteServiceRateItemOpen(false)
    }
  }

  const handleViewPayeeDialog = data => {
    setSelectedServiceRate(data)
    setIsViewPayeeDialogOpen(true)
  }

  const handleCloseViewPayeeDialog = () => {
    setSelectedServiceRate(null)
    setIsViewPayeeDialogOpen(false)
  }

  const renderDialogTitle = () => {
    return isEditMode ? 'Edit Rate List' : 'Create New Rate List'
  }

  // Render the dialog content
  const renderDialogContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: '1rem', width: '100%' }}>
      {/* Rate List Name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ width: '150px', fontWeight: 'bold' }}>Rate List Name:</Typography>
        <TextField
          fullWidth
          variant='outlined'
          size='medium'
          label='Type'
          value={newRateList.name}
          onChange={e => handleNewRateListChange('name', e.target.value)}
        />
      </Box>

      {/* Category Dropdown */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ width: '150px', fontWeight: 'bold' }}>Category:</Typography>
        <FormControl fullWidth size='medium'>
          <InputLabel>Category</InputLabel>
          <Select label='Category' value={newRateList.category} onChange={e => handleNewRateListChange('category', e.target.value)}>
            {allCategoryData?.map(({ parentGroupName }, index) => (
              <MenuItem key={index} value={parentGroupName}>
                {parentGroupName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Parent Payee Dropdown */}
      {newRateList?.category.toLowerCase()?.trim() !== 'cash' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ width: '150px', fontWeight: 'bold' }}>Parent Payee:</Typography>
          <FormControl fullWidth size='medium'>
            <InputLabel>Parent Payee</InputLabel>
            <Select
              label='Parent Payee'
              value={newRateList.parentPayee}
              multiple
              onChange={e => handleNewRateListChange('parentPayee', e.target.value)}
            >
              {dataForPatientPayee?.map((parentPayee, index) => (
                <MenuItem key={index} value={parentPayee}>
                  {parentPayee}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Button
              variant='contained'
              size='medium'
              sx={{ marginLeft: 2, width: '150px !important' }}
              onClick={() =>
                handleNewRateListChange(
                  'parentPayee',
                  dataForPatientPayee?.length === newRateList.parentPayee.length ? [] : dataForPatientPayee
                )
              }
            >
              {dataForPatientPayee?.length === newRateList.parentPayee.length ? 'Deselect All' : 'Select All'}
            </Button>
          </Box>
        </Box>
      )}

      {/* Payee Dropdown */}
      {newRateList?.category?.toLowerCase()?.trim() === 'insurance' || newRateList?.category?.toLowerCase()?.trim() === 'gipsaa' ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ width: '150px', fontWeight: 'bold' }}>Payee:</Typography>
          <FormControl fullWidth size='medium'>
            <InputLabel>Payee</InputLabel>
            <Select label='Payee' value={newRateList.payee} multiple onChange={e => handleNewRateListChange('payee', e.target.value)}>
              {tpaData?.map((payee, index) => (
                <MenuItem key={index} value={payee?.tpaCompanyName}>
                  {payee?.tpaCompanyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Button
              variant='contained'
              size='medium'
              sx={{ marginLeft: 2, width: '150px !important' }}
              onClick={() =>
                handleNewRateListChange(
                  'payee',
                  tpaData?.length === newRateList.payee.length ? [] : tpaData.map(payee => payee?.tpaCompanyName)
                )
              }
            >
              {tpaData?.length === newRateList.payee.length ? 'Deselect All' : 'Select All'}
            </Button>
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  )

  // Render the dialog actions
  const renderDialogActions = () => (
    <DialogActions>
      <IconButton onClick={handleSave} title='Save' className='btnSave' type='submit' sx={{ marginRight: '10px' }}>
        <Save />
      </IconButton>
      <IconButton title='Cancel' className='btnCancel' onClick={handleDialogClose}>
        <Cancel />
      </IconButton>
    </DialogActions>
  )

  // Handle search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const filtered = serviceRateList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilterdServiceRateList(filtered)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, serviceRateList])

  // Fetch initial data
  useEffect(() => {
    fetchInsuranceMasterData()
    fetchGovernmentCompanyData()
    fetchCorporateCompanyPrivate()
    fetchCorporateCompanyPublic()
    fetchTpaCompnayData()
    fetchSeriveRateListDetails()
    fetchGipsaa()
  }, [])

  console.log(selectedServiceRate)

  return (
    <>
      <Box
        sx={{
          padding: 3,
          borderRadius: 3,
          margin: '0 auto'
        }}
      >
        {/* Top Row: Add Button & Search Field */}
        <Box
          sx={{
            marginBottom: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* New Button (Left) */}
          <Button
            variant='contained'
            color='primary'
            sx={{
              paddingX: 3,
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            onClick={() => setIsNewOpen(true)}
          >
            New
          </Button>

          {/* Search Field (Right) */}
          <TextField
            variant='outlined'
            label='Search Rate List'
            size='medium'
            sx={{ width: '400px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Box>

        {/* Scrollable Row */}
        <Box sx={scrollableRow}>
          {filteredServiceRateList.length > 0 ? (
            filteredServiceRateList.map(data => (
              <Card
                key={data?._id}
                sx={{
                  minWidth: 'max-content', // Expands as per content
                  maxWidth: '100%', // Prevents overflow
                  padding: 1.5,
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <CardActionArea
                  onClick={() => handleClickOnServiceRateItem(data)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    border: '1px solid black',
                    backgroundColor: selectedId === data?._id ? '#ff847c' : '#f6eedf'
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      fontWeight: 'bold',
                      color: '#222831',
                      fontSize: '1rem',
                      whiteSpace: 'nowrap', // Prevents text from wrapping
                      overflow: 'hidden', // Hides overflowed text if needed
                      textOverflow: 'ellipsis', // Adds "..." if text overflows
                      display: 'inline-block' // Allows dynamic width
                    }}
                  >
                    {data?.name}
                  </Typography>
                </CardActionArea>

                {/* Buttons Section */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 0.5,
                    padding: '4px 8px',
                    marginTop: '4px'
                  }}
                >
                  <Tooltip title='Edit' arrow>
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: '#4CAF50',
                        '&:hover': { backgroundColor: '#45a049' },
                        flex: 1,
                        minWidth: 'auto',
                        padding: '4px 8px',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => handleEdit(data)}
                    >
                      <EditIcon />
                    </Button>
                  </Tooltip>

                  <Tooltip title='Delete' arrow>
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: '#f44336',
                        '&:hover': { backgroundColor: '#d32f2f' },
                        flex: 1,
                        minWidth: 'auto',
                        padding: '4px 8px',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => handleDelete(data)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Tooltip>

                  <Tooltip title='View Details' arrow>
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: '#2196F3',
                        '&:hover': { backgroundColor: '#1976D2' },
                        flex: 1,
                        minWidth: 'auto',
                        padding: '4px 8px',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => handleView(data)}
                    >
                      <VisibilityIcon />
                    </Button>
                  </Tooltip>

                  <Tooltip title='View Parent Payee' arrow>
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: '#9C27B0', // Different color for distinction
                        '&:hover': { backgroundColor: '#7B1FA2' },
                        flex: 1,
                        minWidth: 'auto',
                        padding: '4px 8px',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => handleViewPayeeDialog(data)}
                    >
                      <GroupsIcon /> {/* Suggested icon */}
                    </Button>
                  </Tooltip>
                </Box>
              </Card>
            ))
          ) : (
            <Typography variant='h6' sx={{ textAlign: 'center', color: '#666', padding: 2 }}>
              No Service Rates Available
            </Typography>
          )}
        </Box>
        {/* Dialog for Add/Edit Rate List */}
        <Dialog open={isNewOpen} onClose={handleDialogClose} maxWidth='xl'>
          <DialogTitle>{renderDialogTitle()}</DialogTitle>
          <DialogContent sx={{ width: '600px !important' }}>{renderDialogContent()}</DialogContent>
          {renderDialogActions()}
        </Dialog>

        {/* Other dialogs (unchanged) */}
        <Box>
          <Dialog open={isDeleteServiceRateListItemOpen} onClose={() => setIsDeleteServiceRateItemOpen(false)} maxWidth='sm' fullWidth>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', padding: '20px' }}>
              {`Do you really want to delete ${selectedServiceRate?.name}?`}
            </DialogTitle>
            <DialogActions sx={{ justifyContent: 'center', padding: '20px', gap: '16px' }}>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => setIsDeleteServiceRateItemOpen(false)}
                sx={{ minWidth: '100px', textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                color='error'
                onClick={() => handleConfirmDelete()}
                sx={{ minWidth: '100px', textTransform: 'none' }}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Box>
          <ViewValidSelectedServices
            isOpen={isViewValidEntriesModalOpen}
            onClose={closeViewModal}
            serviceRateListItem={selectedServiceRateForView}
          />
        </Box>

        <Box>
          <Dialog open={isViewPayeeDialogOpen} onClose={handleCloseViewPayeeDialog} maxWidth='sm' fullWidth>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '15px', fontWeight: 'bold', padding: '20px' }}>
              {`List of Payee's and Parent Payee's of ${selectedServiceRate?.name}`}
            </DialogTitle>
            <DialogContent>
              <Typography variant='h6' sx={{ fontWeight: 'bold', marginTop: '16px' }}>
                Parent Payees:
              </Typography>
              <List>
                {selectedServiceRate?.parentPayee?.map((payee, index) => (
                  <ListItem key={index}>
                    <Typography variant='body1'>{payee}</Typography>
                  </ListItem>
                ))}
              </List>

              <Typography variant='h6' sx={{ fontWeight: 'bold', marginTop: '16px' }}>
                Payees:
              </Typography>
              <List>
                {selectedServiceRate?.payee?.map((payee, index) => (
                  <ListItem key={index}>
                    <Typography variant='body1'>{payee}</Typography>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', padding: '20px', gap: '16px' }}>
              <Button
                variant='outlined'
                color='secondary'
                onClick={handleCloseViewPayeeDialog}
                sx={{ minWidth: '100px', textTransform: 'none' }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  )
}

export default ServiceRateHeader

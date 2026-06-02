import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link, useNavigate } from 'react-router-dom'
import { gridSpacing } from 'config.js'
import { get, put } from 'api/api'
import REACT_APP_API_URL from 'api/api'
import Loader from 'component/Loader/Loader'
import EditBtn from 'component/buttons/EditBtn'
import DeleteBtn from 'component/buttons/DeleteBtn'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Consultant = () => {
  const [consultantData, setConsultantData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDataFetched, setIsDataFetched] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const navigate = useNavigate()

  const goToAddPage = () => {
    navigate('/users/consultant-AddPage')
  }

  const fetchConsultantData = async () => {
    setLoading(true)
    try {
      const response = await get('newConsultant')
      setConsultantData(response.data || [])
      setFilteredData(response.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setIsDataFetched(true)
    }
  }

  const handleSearch = event => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)
    const filtered = consultantData.filter(
      item =>
        item.basicDetails.firstName.toLowerCase().includes(query) ||
        item.basicDetails.lastName.toLowerCase().includes(query) ||
        item.contactDetails.email.toLowerCase().includes(query)
    )
    setFilteredData(filtered)
  }

  const handleDeleteClick = item => {
    setSelectedItem(item)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedItem) {
      toast.error('No item selected for deletion')
      return
    }

    try {
      const response = await put(`newConsultant/delete/${selectedItem._id}`)

      if (response?.success) {
        // Use `message` from the backend response for success toast
        toast.success(response?.message || 'Item deleted successfully')
        fetchConsultantData() // Refresh data after successful deletion
      } else {
        // Use `message` from the backend response for error toast
        toast.error(response?.message || 'Failed to delete the item')
        console.warn('Unexpected response:', response)
      }
    } catch (error) {
      // Generic error message for any unexpected error
      toast.error('An error occurred while deleting the item, please try again later')
      console.error('Error during delete request:', error.message)
    } finally {
      // Reset modal and selected item states
      setDeleteModalOpen(false)
      setSelectedItem(null)
    }
  }

  useEffect(() => {
    fetchConsultantData()
  }, [])

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Consultants
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container alignItems='center' justifyContent='space-between'>
                  <Grid item>
                    <Button variant='contained' color='primary' onClick={goToAddPage}>
                      Add
                    </Button>
                  </Grid>
                  <Grid item>
                    <TextField
                      label='Search'
                      variant='outlined'
                      value={searchQuery}
                      onChange={handleSearch}
                      size='small'
                      style={{ width: '300px' }}
                    />
                  </Grid>
                </Grid>
              }
            />
            <Divider />
            <CardContent>
              {loading ? (
                <Loader />
              ) : (
                <>
                  {isDataFetched && filteredData.length === 0 ? (
                    <Typography variant='h6' align='center' color='textSecondary'>
                      No Records Found
                    </Typography>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Sr.No</TableCell>
                            <TableCell>Profile Picture</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Contact No.</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData.map((item, index) => (
                            <TableRow key={item._id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Avatar
                                  alt={`${item.basicDetails.firstName} ${item.basicDetails.lastName}`}
                                  src={`${REACT_APP_API_URL}images/${item.basicDetails.profilePhoto}`}
                                  style={{ width: 50, height: 50 }}
                                />
                              </TableCell>
                              <TableCell>{item.basicDetails.firstName}</TableCell>
                              <TableCell>{item.basicDetails.lastName}</TableCell>
                              <TableCell>{item.basicDetails.contactNumber}</TableCell>
                              <TableCell>{item.basicDetails.gender}</TableCell>
                              <TableCell>{new Date(item.basicDetails.dateOfBirth).toLocaleDateString('en-GB')}</TableCell>
                              <TableCell>
                                <EditBtn onClick={() => navigate(`/users/consultant-UpdatePage/${item._id}`)} />
                                <DeleteBtn onClick={() => handleDeleteClick(item)} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this record? </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color='secondary'>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  )
}

export default Consultant

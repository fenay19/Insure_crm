import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableRow, TableHead, Button, Box, Modal, Typography, TableContainer, Paper } from '@mui/material'
import EditBtn from 'component/buttons/EditBtn'
import DeleteBtn from 'component/buttons/DeleteBtn'
import { put, post } from 'api/api'
import AddBtn from 'component/buttons/AddBtn'
import AddThirdLevelNestedData from '../thirdLevelNestedData/AddThirdLevelNestedData'
import EditSecondLevelNestedData from './EditSecondLevelNestedData'
import { toast } from 'react-toastify'

const SecondLevelNestedTable = ({ parameters, fetchData, investigation }) => {
  const [openModal, setOpenModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [mode, setMode] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const openAddModal = () => {
    setEditData(null)
    setMode('add')
    setOpenModal(true)
  }

  const openEditModal = parameter => {
    setEditData(parameter)
    setMode('edit')
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
    setEditData(null)
    setMode('')
  }

  const handleSave = async data => {
    if (editData) {
      await put(`unit-pathology-master/update/${editData._id}`, data)
    } else {
      await post(`unit-pathology-master/add/${investigation.id}`, data)
    }
    closeModal()
    fetchData()
  }

  const handleDelete = id => {
    setDeleteId(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    const updatedParameters = parameters.filter(parameter => parameter._id !== deleteId)
    try {
      await put(`investigation-pathology-master/${investigation._id}`, { parameters: updatedParameters })
      toast.success('Test deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Error deleting parameter:', error)
    }
    setDeleteModalOpen(false)
    setDeleteId(null)
  }

  return (
    <>
      <TableContainer component={Paper} style={{ maxHeight: 1000, overflowX: 'auto' }}>
        <Table stickyHeader size='small' aria-label='parameters'>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Sr.No</strong>
              </TableCell>
              <TableCell>
                <strong>Test Name</strong>
              </TableCell>
              <TableCell>
                <strong>Test Code</strong>
              </TableCell>
              <TableCell>
                <strong>Machine Name</strong>
              </TableCell>
              <TableCell>
                <strong>Formula</strong>
              </TableCell>
              <TableCell>
                <strong>Unit</strong>
              </TableCell>
              <TableCell>
                <strong>Standard Range</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {parameters.map((parameter, index) => (
              <TableRow key={parameter._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{parameter.testName}</TableCell>
                <TableCell>{parameter.testCode}</TableCell>
                <TableCell>{parameter.machine}</TableCell>
                <TableCell>{parameter.formula}</TableCell>
                <TableCell>{parameter.unit}</TableCell>
                <TableCell>
                  {parameter.testDetail.map((detail, idx) => (
                    <div key={idx} style={{ marginBottom: '5px', width: '250px' }}>
                      <strong>{idx + 1}. </strong>
                      {detail.minTestRange} - {detail.maxTestRange} {detail.gender} (Age: {detail.ageRange})
                    </div>
                  ))}
                </TableCell>
                <TableCell align='center'>
                  <Box display='flex' gap={1} p={0} m={0}>
                    <Button onClick={() => openEditModal(parameter)} style={{ minWidth: 0, padding: 0 }}>
                      <EditBtn />
                    </Button>
                    <Button onClick={() => handleDelete(parameter._id)} style={{ minWidth: 0, padding: 0 }}>
                      <DeleteBtn />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Modal open={openModal} onClose={closeModal}>
        <Box
          p={3}
          sx={{
            backgroundColor: 'white',
            padding: '50px',
            margin: 'auto',
            marginTop: '5%',
            maxWidth: '900px',
            height: '600px',
            overflowY: 'auto'
          }}
        >
          <Typography variant='h6'>{mode === 'edit' ? 'Edit Parameter' : 'Add Parameter'}</Typography>
          {mode === 'add' && <AddThirdLevelNestedData onSave={handleSave} onCancel={closeModal} investigationData={investigation} />}
          {mode === 'edit' && editData && (
            <EditSecondLevelNestedData fetchData={fetchData} handleClose={closeModal} editData={editData} investigation={investigation} />
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box
          p={3}
          sx={{
            backgroundColor: 'white',
            padding: '20px',
            margin: 'auto',
            marginTop: '20%',
            maxWidth: '400px',
            textAlign: 'center'
          }}
        >
          <Typography variant='h6'>Confirm Deletion</Typography>
          <Typography variant='body1'>Are you sure you want to delete this item?</Typography>
          <Box mt={3} display='flex' justifyContent='space-around'>
            <Button variant='contained' color='error' onClick={confirmDelete}>
              Delete
            </Button>

            <Button variant='outlined' onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default SecondLevelNestedTable

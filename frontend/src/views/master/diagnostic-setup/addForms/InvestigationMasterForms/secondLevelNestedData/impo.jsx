import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableRow, TableHead, Button, Box, Modal, Typography, TableContainer, Paper } from '@mui/material'
import EditBtn from 'component/buttons/EditBtn'
import DeleteBtn from 'component/buttons/DeleteBtn'
import { put, post } from 'api/api'
import AddBtn from 'component/buttons/AddBtn'

const SecondLevelNestedTable = ({ parameters, fetchData, investigationId }) => {
  const [openModal, setOpenModal] = useState(false)
  const [editData, setEditData] = useState(null)

  const openAddModal = () => {
    setEditData(null)
    setOpenModal(true)
  }

  const openEditModal = parameter => {
    setEditData(parameter)
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
    setEditData(null)
  }

  const handleSave = async data => {
    if (editData) {
      await put(`unit-pathology-master/update/${editData._id}`, data)
    } else {
      await post(`unit-pathology-master/add/${investigationId}`, data)
    }
    closeModal()
    fetchData()
  }

  const handleDelete = async id => {
    await put(`unit-pathology-master/delete/${id}`)
    fetchData()
  }

  return (
    <>
      <TableContainer component={Paper} style={{ maxHeight: 600, overflowX: 'auto' }}>
        <Table stickyHeader size='small' aria-label='parameters'>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Sr.No</strong>{' '}
              </TableCell>
              <TableCell>
                {' '}
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
                    <div key={idx} style={{ marginBottom: '5px' }}>
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
                    <Button onClick={openAddModal} style={{ minWidth: 0, padding: 0 }}>
                      <AddBtn />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={closeModal}>
        <Box p={3} sx={{ backgroundColor: 'white', margin: 'auto', marginTop: '10%', maxWidth: '400px' }}>
          <Typography variant='h6'>{editData ? 'Edit Parameter' : 'Add Parameter'}</Typography>
          {/* Render form fields here for parameter data */}
          {/* Form submission should call handleSave with form data */}
          <Button onClick={() => handleSave(/* form data */)}>Save</Button>
          <Button onClick={closeModal}>Cancel</Button>
        </Box>
      </Modal>

      
      



    </>
  )
}

export default SecondLevelNestedTable

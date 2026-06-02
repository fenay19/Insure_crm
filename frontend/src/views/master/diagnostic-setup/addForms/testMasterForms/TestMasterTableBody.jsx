import React, { useState } from 'react'
import Box from '@mui/material/Box'
// import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import EditBtn from 'component/buttons/EditBtn' // Assuming you have a EditBtn component
import DeleteBtn from 'component/buttons/DeleteBtn' // Assuming you have a DeleteBtn component
import ViewBtn from 'component/buttons/ViewBtn'
import TestMasterEditForm from './TestMasterEditForm' // Assuming TestMasterEditForm component exists
import { put } from 'api/api'
import { toast } from 'react-toastify'
import { DialogTitle, Paper, TableBody, TableContainer, TableHead } from '@mui/material'
import { Table } from 'react-bootstrap'

function Row ({ test, index, openEditModal, openDeleteModal, openViewTestRangeModal }) {
  // const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {/* Collapsible toggle button */}
        {/* 
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        */}
        <TableCell >{index + 1}</TableCell>
        <TableCell >{test.testName}</TableCell>
        <TableCell >{test.testCode}</TableCell>
        <TableCell >{test.department}</TableCell>
        <TableCell >{test.subDepartment}</TableCell>
        <TableCell >{test?.billGroup}</TableCell>
        <TableCell >{test.machineName}</TableCell>
        <TableCell >{test.specimen}</TableCell>
        <TableCell >{test.unit}</TableCell>
        <TableCell >{test.formula || 'N/A'}</TableCell>
        <TableCell >{test.testType}</TableCell>
        <TableCell >{test.description || 'N/A'}</TableCell>
        <TableCell >
          <ViewBtn onClick={() => openViewTestRangeModal(test)} />
        </TableCell>
        <TableCell >
          <Box sx={{ display: 'flex' }}>
            <EditBtn onClick={() => openEditModal(test)} />
            <DeleteBtn onClick={() => openDeleteModal(test)} />
          </Box>
        </TableCell>
      </TableRow>
      {/* Collapsible content */}
      {/* 
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Additional Details
              </Typography>
              <Typography>{`Detailed information about ${test.testName}`}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      */}
    </>
  )
}

function TestMasterTableBody ({ TestMasterData, fetchData }) {
  const [openEditModalState, setOpenEditModalState] = useState(false)
  const [openDeleteModalState, setOpenDeleteModalState] = useState(false)
  const [openViewTestRangesState, setOpenViewTestRangesState] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)

  const openEditModal = test => {
    setSelectedTest(test)
    setOpenEditModalState(true)
  }

  const closeEditModal = () => {
    setOpenEditModalState(false)
    setSelectedTest(null)
  }

  const openDeleteModal = test => {
    setSelectedTest(test)
    setOpenDeleteModalState(true)
  }

  const closeDeleteModal = () => {
    setOpenDeleteModalState(false)
    setSelectedTest(null)
  }

  const openViewTestRangeModal = test => {
    setSelectedTest(test)
    setOpenViewTestRangesState(true)
  }

  const closeViewTestRangeModal = () => {
    setOpenViewTestRangesState(false)
    setSelectedTest(null)
  }

  const handleDelete = async () => {
    if (!openDeleteModalState) return

    try {
      const response = await put(`investigation-pathology-master/delete/${selectedTest._id}`)

      if (response.investigation) {
        toast.success(response.msg)
        closeDeleteModal()
        fetchData()
      } else {
        toast.error('Something went wrong')
      }
    } catch (error) {
      console.error('Error during delete operation:', error)
      toast.error('Failed to delete. Please try again later.')
    }
  }

  console.log('selected Test', selectedTest)
  return (
    <>
      {TestMasterData.map((test, index) => (
        <Row
          key={index}
          test={test}
          index={index}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
          openViewTestRangeModal={openViewTestRangeModal}
        />
      ))}

      {/* Edit Modal */}
      <Dialog maxWidth='lg' open={openEditModalState} onClose={closeEditModal}>
        <DialogContent>
          {selectedTest && <TestMasterEditForm editData={selectedTest} handleClose={closeEditModal} fetchData={fetchData} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModalState} onClose={closeDeleteModal}>
        <DialogContent>
          <Typography variant='h6'>Are you sure you want to delete this test: {selectedTest?.testName}?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start' }}>
          <Button onClick={handleDelete} color='primary'>
            Delete
          </Button>
          <Button onClick={closeDeleteModal} color='secondary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth='md' open={openViewTestRangesState} onClose={closeViewTestRangeModal}>
        <DialogTitle>
          <Typography variant='h6'>Test Ranges Of - {selectedTest?.testName}</Typography>
        </DialogTitle>

        <DialogContent>
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Min Test Range</b>
                  </TableCell>
                  <TableCell>
                    <b>Max Test Range</b>
                  </TableCell>
                  <TableCell>
                    <b>Age Range</b>
                  </TableCell>
                  <TableCell>
                    <b>Min Range</b>
                  </TableCell>
                  <TableCell>
                    <b>Max Range</b>
                  </TableCell>
                  <TableCell>
                    <b>Duration</b>
                  </TableCell>
                  <TableCell>
                    <b>Note</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTest?.testDetail?.map(range => (
                  <TableRow key={range._id}>
                    <TableCell>{range.minTestRange || 'N/A'}</TableCell>
                    <TableCell>{range.maxTestRange || 'N/A'}</TableCell>
                    <TableCell>{range.gender || 'N/A'}</TableCell>
                    <TableCell>{range.minTestRange || 'N/A'}</TableCell>
                    <TableCell>{range.maxTestRange || 'N/A'}</TableCell>
                    <TableCell>{range.duration || 'N/A'}</TableCell>
                    <TableCell>{range.note || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'flex-end', padding : 3 }}>
          <Button onClick={closeViewTestRangeModal} color='secondary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TestMasterTableBody

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  Box
} from '@mui/material'
import { get } from 'api/api'

const styles = {
  th: {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    padding: '8px',
    fontSize: '14px'
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    fontSize: '14px'
  },
  stripedRow: {
    backgroundColor: '#f9f9f9'
  }
}

function ViewValidSelectedServices ({ isOpen, onClose, serviceRateListItem }) {
  const servicedRateListItemId = serviceRateListItem?._id
  const { selectedFilter } = useSelector(state => state.serviceRateListMaster)

  const [validServices, setValidServices] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const whichFilter = {
    pathology: 'Pathology',
    radiology: 'Radiology',
    opdPackage: 'OPD Package',
    otherServices: 'Other',
    opdConsultant: 'OPD Consultant',
    otherDiagnostics: 'Other Diagnosticss',
    pathologyProfiles : 'Pathology Profiles'
  }

  const fetchValidServices = async () => {
    try {
      const response = await get(`service-rate-new/getValidServices/${servicedRateListItemId}/${selectedFilter}`)
      console.log(response)
      if (response.success) {
        setValidServices(response.data)
      }
    } catch (error) {
      console.error('Error fetching valid services:', error)
    }
  }

  useEffect(() => {
    if (servicedRateListItemId && selectedFilter) {
      fetchValidServices()
    }

    // Cleanup function
    return () => {
      setValidServices([])
    }
  }, [servicedRateListItemId, selectedFilter])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const currentRows = validServices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

 

  return (
    <Dialog open={isOpen} onClose={() => onClose()} maxWidth='xl' fullWidth>
      {currentRows.length > 0 ? (
        <>
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', padding: '16px', fontSize: '18px' }}>
            {whichFilter[selectedFilter] + ' Services of ' + serviceRateListItem?.name}
          </DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TableContainer component={Paper} style={{ margin: '10px', padding: '5px', maxWidth: '95%' }}>
              <Table size='medium' sx={{ minWidth: '800px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' style={{ ...styles.th, width: '5%' }}>
                      SN
                    </TableCell>
                    <TableCell align='center' style={{ ...styles.th, width: '20%' }}>
                      Service/Bill Group
                    </TableCell>
                    <TableCell align='center' style={{ ...styles.th, width: '25%' }}>
                      Service Name
                    </TableCell>
                    <TableCell align='center' style={{ ...styles.th, width: '20%' }}>
                      Department
                    </TableCell>
                    <TableCell align='center' style={{ ...styles.th, width: '15%' }}>
                      Code
                    </TableCell>
                    <TableCell align='center' style={{ ...styles.th, width: '15%' }}>
                      Rate
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows.map((item, index) => (
                    <TableRow key={item.serviceIdOfRelatedMaster._id} sx={index % 2 === 0 ? styles.stripedRow : null}>
                      <TableCell align='center' style={styles.td}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell align='center' style={styles.td}>
                        {item.serviceIdOfRelatedMaster.billGroup || item.serviceIdOfRelatedMaster.serviceGroupOrBillGroup}
                      </TableCell>
                      <TableCell align='center' style={styles.td}>
                        {item.serviceIdOfRelatedMaster?.testName ||
                        item.serviceIdOfRelatedMaster?.profileName ||
                          item.serviceIdOfRelatedMaster?.services?.map(service => service.detailServiceName).join(', ') ||
                          item.serviceIdOfRelatedMaster?.detailServiceName ||
                          `OPD Consultation (${item.serviceIdOfRelatedMaster?.type}) (${item.serviceIdOfRelatedMaster?.consultantName})` }
                         
                      </TableCell>

                      <TableCell align='center' style={styles.td}>
                        {Array.isArray(item.serviceIdOfRelatedMaster.department)
                          ? item?.serviceIdOfRelatedMaster.department.map(item => item).join(', ')
                          : item.serviceIdOfRelatedMaster.department}
                      </TableCell>
                      <TableCell align='center' style={styles.td}>
                        {item.code}
                      </TableCell>
                      <TableCell align='center' style={styles.td}>
                        {item.rate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 20, 30, 40, 50]}
                component='div'
                count={validServices.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ fontSize: '14px' }}
              />
            </TableContainer>
          </Box>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', fontSize: '16px', color: '#666' }}>No data available</div>
      )}
    </Dialog>
  )
}

export default ViewValidSelectedServices

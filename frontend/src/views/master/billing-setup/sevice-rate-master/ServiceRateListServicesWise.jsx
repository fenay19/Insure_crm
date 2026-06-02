import React, { useState } from 'react'
import ImportExport from 'component/ImportExport'
import { Card, CardContent, Box, Divider, RadioGroup, FormControlLabel, Radio, TextField, FormControl, FormLabel } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import PathologyServicesTable from './table-for-different-services/PathologyServicesTable'
import RadiologyServiceTable from './table-for-different-services/RadiologyServiceTable'
import OpdPackageServicesTable from './table-for-different-services/OpdPackageServicesTable'
import OtherServicesTable from './table-for-different-services/OtherServicesTable'
import OpdConsultantServicesTable from './table-for-different-services/OpdConsultantServicesTable'
import OtherDiagnosticsServicesTable from './table-for-different-services/OtherDiagnosticsServicesTable'
import { setSelectedFilter } from 'reduxSlices/serviceRateMasterSlices'
import PathologyProfiles from './table-for-different-services/PathologyProfiles'

function ServiceRateListServicesWise () {
  const { selectedServiceRateListItem } = useSelector(state => state.serviceRateListMaster)
  const dispatch = useDispatch()

  // State for Search Input and Filter Selection
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState('pathology')

  const DisplayTableAccordingToFilter = {
    pathology: <PathologyServicesTable />,
    radiology: <RadiologyServiceTable />,
    opdPackage: <OpdPackageServicesTable />,
    otherServices: <OtherServicesTable />,
    opdConsultant: <OpdConsultantServicesTable />,
    otherDiagnostics: <OtherDiagnosticsServicesTable />,
    pathologyProfiles: <PathologyProfiles />
  }

  const handleFilterChange = e => {
    setFilterType(e.target.value)
    dispatch(setSelectedFilter(e.target.value))
  }

  return (
    <>
      {selectedServiceRateListItem?._id && (
        <Card>
          <CardContent>
            {/* Search and Import/Export Section */}

            {/* Filter Options */}

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <FormControl>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormLabel sx={{ mr: 2, fontWeight: 'bold' }}>Filter:</FormLabel>
                  <RadioGroup row name='formType' value={filterType} onChange={e => handleFilterChange(e)}>
                    <FormControlLabel value='pathology' control={<Radio size='medium' />} label='Pathology Tests' />
                    <FormControlLabel value='pathologyProfiles' control={<Radio size='medium' />} label='Pathology Profiles' />
                    <FormControlLabel value='radiology' control={<Radio size='medium' />} label='Radiology' />
                    <FormControlLabel value='opdPackage' control={<Radio size='medium' />} label='OPD Package' />
                    <FormControlLabel value='otherServices' control={<Radio size='medium' />} label='Other Services' />
                    <FormControlLabel value='opdConsultant' control={<Radio size='medium' />} label='OPD Consultant' />
                    <FormControlLabel value='otherDiagnostics' control={<Radio size='medium' />} label='Other Diagnostics' />
                  </RadioGroup>
                </Box>
              </FormControl>
            </Box>
            <Divider />

            {/* this table according to services wise */}
            {DisplayTableAccordingToFilter[filterType]}
          </CardContent>
         
        </Card>
      )}
    </>
  )
}

export default ServiceRateListServicesWise

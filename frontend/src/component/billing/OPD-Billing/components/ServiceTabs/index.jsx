import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Select, MenuItem, Typography, Button, TextField, ListSubheader, Autocomplete } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab, setServiceDataSelectedToDisplay } from 'reduxSlices/opdBillingStates';
import { get } from 'api/api';

const ServiceSectionTabs = ({ dropdownValue, onDropdownChange, onAddClick, onInvestigationTypeChange, investigationType }) => {
  const { billingData } = useSelector((state) => state.opdBilling);
  const [existBill, setExistBill] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const { activeTab, dropDownOptions } = useSelector((state) => state.opdBillingStates);
  const allPatientReceipts = useSelector((state) => state.opdBillingStates.OPDReceiptData);
  const previouslySelectedServices = allPatientReceipts?.flatMap((item, index) => item?.services);
  const { _id, title } = billingData?.selectedTest || {};
  // Filter dropdown options based on search input
  const filteredOptions = dropDownOptions?.filter((option) =>
    (
      `${option.detailServiceName}` ||
      `${option?.services?.[0]?.detailServiceName}` ||
      `${option?.testName}` ||
      `OPD Consultation (${option?.serviceIdOfRelatedMaster?.type} - ${option?.serviceIdOfRelatedMaster?.consultantName}` ||
      option?.consultantName ||
      `${option?.serviceIdOfRelatedMaster?.type}` ||
      `${option?.serviceIdOfRelatedMaster?.consultantName}`
    )
      ?.toLowerCase()
      ?.includes(searchTerm.toLowerCase())
  );

  const dispatch = useDispatch();

  const handleTabChange = (event, value) => {
    dispatch(setActiveTab(value));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Don't close dropdown when typing
    e.stopPropagation();
  };

  const fetchBill = async () => {
    try {
      if (!billingData?.patientId) {
        console.warn('Patient ID is missing');
        return;
      }

      const res = await get(`opd-billing/credit/${billingData.patientId}`);

      if (res?.success) {
        setExistBill(res?.data ?? {});
      } else {
        console.error('Failed to fetch billing data:', res?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    }
  };

  useEffect(() => {
    fetchBill();
  }, []);

  useEffect(() => {
    if (!title) return;

    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('radiology') || lowerTitle.includes('tests')) {
      const type = lowerTitle.includes('radiology') ? 'Radiology' : 'Pathology';
      onInvestigationTypeChange(type);
      // if (dropDownOptions?.length) {
      //   onInvestigationTypeChange('Pathology Profile');
      // }

      dispatch(setActiveTab(1));
    } else if (lowerTitle.includes('other')) {
      dispatch(setActiveTab(4));
    } else if (lowerTitle.includes('cross')) {
      dispatch(setActiveTab(2));
    } else {
      dispatch(setActiveTab(0));
    }
  }, [title, dispatch, onInvestigationTypeChange]);

  useEffect(() => {
    if (billingData?.selectedTest) {
      const filteredTest = dropDownOptions?.find((item) => {
        const related = item?.serviceIdOfRelatedMaster;
        return related?._id === _id || related?.consultantId === _id;
      });

      console.log('FILTERED', filteredTest);
      if (filteredTest) {
        dispatch(setServiceDataSelectedToDisplay([filteredTest]));
      }
    }
  }, [_id, dispatch, dropDownOptions, billingData?.selectedTest]);

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f4f6f9', borderRadius: '8px', boxShadow: 3, height: '100%' }}>
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{
          marginBottom: '15px',
          '& .MuiTab-root': {
            backgroundColor: 'transparent',
            borderRadius: '8px',
            fontWeight: 600,
            padding: '12px 24px',
            textTransform: 'capitalize',
            transition: 'all 0.3s ease',
            color: '#555'
          },
          '& .Mui-selected': {
            color: '#fff',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
          },
          '& .MuiTab-textColorPrimary': {
            color: '#777'
          }
        }}
      >
        <Tab label="Add Other Services" />
        <Tab label="Add Investigation" />
        <Tab label="Add Consultation Charges" />
        <Tab label="Add OPD Package" />
        <Tab label="Add Other Diagnostics" />
      </Tabs>

      {/* Content for Investigation Tab */}
      {activeTab === 1 ? (
        <Box>
          <Box sx={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            {/* Pathology and Radiology Buttons */}
            <Button
              variant={investigationType === 'Pathology' ? 'contained' : 'outlined'}
              onClick={() => onInvestigationTypeChange('Pathology')}
              sx={{
                textTransform: 'capitalize',
                padding: '10px 20px',
                borderRadius: '30px',
                fontWeight: 600,
                color: investigationType === 'Pathology' ? '#fff' : '#3f51b5',
                backgroundColor: investigationType === 'Pathology' ? '#3f51b5' : '#fff',
                '&:hover': {
                  backgroundColor: investigationType === 'Pathology' ? '#303f9f' : '#f5f5f5'
                }
              }}
            >
              Pathology Tests
            </Button>
            <Button
              variant={investigationType === 'Pathology Profile' ? 'contained' : 'outlined'}
              onClick={() => onInvestigationTypeChange('Pathology Profile')}
              sx={{
                textTransform: 'capitalize',
                padding: '10px 20px',
                borderRadius: '30px',
                fontWeight: 600,
                color: investigationType === 'Pathology Profile' ? '#fff' : '#3f51b5',
                backgroundColor: investigationType === 'Pathology Profile' ? '#3f51b5' : '#fff',
                '&:hover': {
                  backgroundColor: investigationType === 'Pathology Profile' ? '#303f9f' : '#f5f5f5'
                }
              }}
            >
              Pathology Profiles
            </Button>
            <Button
              variant={investigationType === 'Radiology' ? 'contained' : 'outlined'}
              onClick={() => onInvestigationTypeChange('Radiology')}
              sx={{
                textTransform: 'capitalize',
                padding: '10px 20px',
                borderRadius: '30px',
                fontWeight: 600,
                color: investigationType === 'Radiology' ? '#fff' : '#3f51b5',
                backgroundColor: investigationType === 'Radiology' ? '#3f51b5' : '#fff',
                '&:hover': {
                  backgroundColor: investigationType === 'Radiology' ? '#303f9f' : '#f5f5f5'
                }
              }}
            >
              Radiology
            </Button>
          </Box>
        </Box>
      ) : null}

      {/* Dropdown and Add Button */}
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '15px', marginBottom: '15px' }}>
        <Autocomplete
          options={filteredOptions}
          getOptionLabel={(option) =>
            option?.serviceIdOfRelatedMaster?.detailServiceName ||
            option?.serviceIdOfRelatedMaster?.profileName ||
            option?.serviceIdOfRelatedMaster?.services?.[0]?.detailServiceName ||
            option?.serviceIdOfRelatedMaster?.testName ||
            `OPD Consultation (${option?.serviceIdOfRelatedMaster?.type} - ${option?.serviceIdOfRelatedMaster?.consultantName})` ||
            ''
          }
          value={filteredOptions.find((opt) => opt?._id === dropdownValue) || null}
          onChange={(e, newValue) => onDropdownChange({ target: { value: newValue?._id || '' } })}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={`Select ${['Service', 'Investigation', 'Consultation', 'Package', 'Other Diagnostics'][activeTab]}`}
              fullWidth
              size="small"
              sx={{
                textTransform: 'capitalize',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: 2,
                fontWeight: 500,
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                  paddingRight: '40px'
                },
                '& input': {
                  color: '#000'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3f51b5'
                }
              }}
            />
          )}
          sx={{ flex: 1 }}
          isOptionEqualToValue={(option, value) => option._id === value._id}
        />
        <Button
          variant="contained"
          onClick={onAddClick}
          sx={{
            textTransform: 'capitalize',
            fontWeight: 600,
            padding: '10px 20px',
            backgroundColor: '#3f51b5',
            color: 'white',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#303f9f',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          Add
        </Button>
      </Box>

      {/* Selected Items */}
      <Box
        style={{ marginTop: '20px' }}
        sx={{
          maxHeight: '200px !important', // Set a maximum height for the container
          overflowY: 'auto', // Enable vertical scrolling if content overflows
          paddingRight: '4px', // Add space for the scrollbar
          scrollbarWidth: 'thin', // Style for modern browsers
          scrollbarColor: '#c1c1c1 transparent',
          '&::-webkit-scrollbar': {
            width: '6px' // Adjust width of the scrollbar
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1', // Thumb color
            borderRadius: '10px' // Rounded edges for the scrollbar thumb
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a8a8a8' // Hover color
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent' // Track color
          }
        }}
      >
        {(previouslySelectedServices?.length ? previouslySelectedServices : existBill?.services)?.length > 0 && (
          <Typography mb={3} variant="h6" sx={{ fontWeight: 600 }}>
            Previously Selected Services
          </Typography>
        )}
        <Box>
          {(previouslySelectedServices?.length ? previouslySelectedServices : existBill?.services)?.length > 0 ? (
            (previouslySelectedServices?.length ? previouslySelectedServices : existBill?.services).map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '7px 16px',
                  marginBottom: '10px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer'
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item?.detailServiceName ||
                    item?.services?.[0]?.detailServiceName ||
                    item?.testName ||
                    `OPD Consultation (${item?.type} - ${item?.consultantName})`}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#888' }}>
              No items were selected previously.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceSectionTabs;

// import React, { useState } from 'react';
// import { Box, Tabs, Tab, Select, MenuItem, Typography, Button, TextField, ListSubheader } from '@mui/material';

// const ServiceSectionTabs = ({
//   activeTab,
//   dropdownValue,
//   dropdownOptions,
//   selectedValues,
//   onTabChange,
//   onDropdownChange,
//   onAddClick,
//   onInvestigationTypeChange,
//   investigationType,
//   serviceDataSelectedToDisplay
// }) => {
//   const [searchTerm, setSearchTerm] = useState(''); // State for search input

//   const filteredData = dropdownOptions.filter((option) =>
//     (
//       option?.detailServiceName ||
//       option?.services?.[0]?.detailServiceName ||
//       option?.testName ||
//       `OPD Consultation (${option?.type} - ${option?.consultantName})` ||
//       ''
//     )
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box sx={{ padding: '20px', backgroundColor: '#f4f6f9', borderRadius: '8px', boxShadow: 3, height: '100%'}}>
//       {/* Tabs */}
//       <Tabs
//         value={activeTab}
//         onChange={onTabChange}
//         indicatorColor="primary"
//         textColor="primary"
//         centered
//         sx={{
//           marginBottom: '15px',
//           '& .MuiTab-root': {
//             backgroundColor: 'transparent',
//             borderRadius: '8px',
//             fontWeight: 600,
//             padding: '12px 24px',
//             textTransform: 'capitalize',
//             transition: 'all 0.3s ease',
//             color: '#555'
//           },
//           '& .Mui-selected': {
//             color: '#fff',
//             boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
//           },
//           '& .MuiTab-textColorPrimary': {
//             color: '#777'
//           }
//         }}
//       >
//         <Tab label="Add Services" />
//         <Tab label="Add Investigation" />
//         <Tab label="Add Consultation Charges" />
//         <Tab label="Add OPD Package" />
//       </Tabs>

//       {/* Common Search Bar */}
//       <TextField
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder="Search options"
//         variant="outlined"
//         size="small"
//         fullWidth
//         sx={{
//           backgroundColor: '#fff',
//           borderRadius: '8px',
//           boxShadow: 2,
//           marginBottom: '15px',
//           '& .MuiOutlinedInput-root': {
//             borderRadius: '8px'
//           }
//         }}
//       />

//       {/* Content for Investigation Tab */}
//       {activeTab === 1 ? (
//         <Box>
//           <Box sx={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
//             {/* Pathology and Radiology Buttons */}
//             <Button
//               variant={investigationType === 'Pathology' ? 'contained' : 'outlined'}
//               onClick={() => onInvestigationTypeChange('Pathology')}
//               sx={{
//                 textTransform: 'capitalize',
//                 padding: '10px 20px',
//                 borderRadius: '30px',
//                 fontWeight: 600,
//                 color: investigationType === 'Pathology' ? '#fff' : '#3f51b5',
//                 backgroundColor: investigationType === 'Pathology' ? '#3f51b5' : '#fff',
//                 '&:hover': {
//                   backgroundColor: investigationType === 'Pathology' ? '#303f9f' : '#f5f5f5'
//                 }
//               }}
//             >
//               Pathology
//             </Button>
//             <Button
//               variant={investigationType === 'Radiology' ? 'contained' : 'outlined'}
//               onClick={() => onInvestigationTypeChange('Radiology')}
//               sx={{
//                 textTransform: 'capitalize',
//                 padding: '10px 20px',
//                 borderRadius: '30px',
//                 fontWeight: 600,
//                 color: investigationType === 'Radiology' ? '#fff' : '#3f51b5',
//                 backgroundColor: investigationType === 'Radiology' ? '#3f51b5' : '#fff',
//                 '&:hover': {
//                   backgroundColor: investigationType === 'Radiology' ? '#303f9f' : '#f5f5f5'
//                 }
//               }}
//             >
//               Radiology
//             </Button>
//           </Box>
//         </Box>
//       ) : null}

//       {/* Dropdown and Add Button */}
//       <Box sx={{ display: "flex", flexDirection: "row", gap: "15px", marginBottom: "15px" }}>
//       <Select
//         value={dropdownValue}
//         displayEmpty
//         fullWidth
//         MenuProps={{
//           PaperProps: {
//             style: { maxHeight: 300 },
//           },
//         }}
//         sx={{
//           textTransform: "capitalize",
//           backgroundColor: "#fff",
//           borderRadius: "8px",
//           boxShadow: 2,
//           fontWeight: 500,
//           height: "40px",
//           "& .MuiSelect-icon": {
//             color: "#3f51b5",
//           },
//           "&:hover": {
//             boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//           },
//         }}
//       >
//         {/* Search Bar Inside Dropdown */}
//         <ListSubheader>
//           <TextField
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search options"
//             variant="outlined"
//             size="small"
//             fullWidth
//             autoFocus
//           />
//         </ListSubheader>

//         <MenuItem value="" disabled>
//           Select {["Service", "Investigation", "Consultation", "Package"][activeTab]}
//         </MenuItem>

//         {filteredData?.length > 0 ? (
//           filteredData?.map((option, index) => (
//             <MenuItem key={index} value={option._id}>
//               {option.detailServiceName ||
//                 option?.services?.[0]?.detailServiceName ||
//                 option?.testName ||
//                 `OPD Consultation (${option?.type} - ${option?.consultantName})`}
//             </MenuItem>
//           ))
//         ) : (
//           <MenuItem disabled>No results found</MenuItem>
//         )}
//       </Select>

//       <Button
//         variant="contained"
//         onClick={onAddClick}
//         sx={{
//           textTransform: "capitalize",
//           fontWeight: 600,
//           padding: "10px 20px",
//           backgroundColor: "#3f51b5",
//           color: "white",
//           borderRadius: "8px",
//           "&:hover": {
//             backgroundColor: "#303f9f",
//             boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//           },
//         }}
//       >
//         Add
//       </Button>
//     </Box>

//       {/* Selected Items */}
//       <Box
//         style={{ marginTop: '20px' }}
//         sx={{
//           maxHeight: '200px !important', // Set a maximum height for the container
//           overflowY: 'auto', // Enable vertical scrolling if content overflows
//           paddingRight: '4px', // Add space for the scrollbar
//           scrollbarWidth: 'thin', // Style for modern browsers
//           scrollbarColor: '#c1c1c1 transparent',
//           '&::-webkit-scrollbar': {
//             width: '6px' // Adjust width of the scrollbar
//           },
//           '&::-webkit-scrollbar-thumb': {
//             backgroundColor: '#c1c1c1', // Thumb color
//             borderRadius: '10px' // Rounded edges for the scrollbar thumb
//           },
//           '&::-webkit-scrollbar-thumb:hover': {
//             backgroundColor: '#a8a8a8' // Hover color
//           },
//           '&::-webkit-scrollbar-track': {
//             backgroundColor: 'transparent' // Track color
//           }
//         }}
//       >
//         {serviceDataSelectedToDisplay?.length > 0 && (
//           <Typography mb={3} variant="h6" sx={{ fontWeight: 600 }}>
//             Selected Items
//           </Typography>
//         )}
//         <Box>
//           {serviceDataSelectedToDisplay?.length > 0 ? (
//             serviceDataSelectedToDisplay.map((item, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   backgroundColor: '#ffffff',
//                   borderRadius: '8px',
//                   padding: '7px 16px',
//                   marginBottom: '10px',
//                   boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
//                   border: '1px solid #e0e0e0',
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.15)',
//                     cursor: 'pointer'
//                   }
//                 }}
//               >
//                 <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                   {item.detailServiceName ||
//                     item?.services?.[0]?.detailServiceName ||
//                     item?.testName ||
//                     `OPD Consultation (${item?.type} - ${item?.consultantName})`}
//                 </Typography>
//               </Box>
//             ))
//           ) : (
//             <Typography variant="body2" sx={{ color: '#888' }}>
//               No items selected yet.
//             </Typography>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ServiceSectionTabs;

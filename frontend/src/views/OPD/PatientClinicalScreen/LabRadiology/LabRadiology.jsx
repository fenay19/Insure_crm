// import { Grid } from "@mui/material";
// import "./LabRadiology.css";
// import { useState, useEffect } from "react";
// import LabInvestigation from "./LabInvestigation";
// import axios from "axios";
// import REACT_APP_BASE_URL, { retrieveToken } from "api/api";
// import LabTestList from "./LabTestList";
// import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
// import { Box, Chip, TextField, Button } from "@mui/material";
// import Loader from "component/Loader/Loader";
// import { toast, ToastContainer } from "react-toastify";

// const LabRadiology = ({ selectedMenu,departmentId }) => {
//   const [selectedLabMenu, setSelectedLabMenu] = useState();
//   const [specimen, setSpecimen] = useState([]);
//   const [loader, setLoader] = useState(true);
//   const token = retrieveToken();
//   const [submittedInvestigation, setSubmittedInvestigtion] = useState([]);
//   const [showPathology, setShowPathology] = useState(true);
//   const [alreadyExistId, setAlreadyExistId] = useState("");
//   const [radiologyData, setRadiologyData] = useState([]);
//   const [pathologyData, setPathologyData] = useState([]);
//   const [investigationRadiology, setInvestigationRadiology] = useState([]);
//   const [investigationPathology, setInvestigationPathology] = useState([]);
//   const [patientProcedure, setPatientProcedure] = useState({
//     procedure: [],
//     notes: "",
//   });
//   const [notes, setNotes] = useState("");
//   const [exist, setExist] = useState(false);
//   const [alreadyProcedureExistId, setAlreadyProcedureExistId] = useState("");

//   const [patientInstruction, setPatientInstruction] = useState([]);
//   const [openAddInstructionDetail, setOpenAddInstructionDetail] = useState(false);
//   const [alreadyInstructionExistId, setAlreadyInstructionExistId] = useState("");

//   const getPatientLabRadiology = async () => {
//     await axios
//       .get(`${REACT_APP_BASE_URL}patient-lab-radiology/${departmentId}`, {
//         headers: { Authorization: "Bearer " + token },
//       })
//       .then((response) => {
//         let res = [];
//         response.data.data.forEach((v) => {
//           if (v.departmentId === departmentId) {
//             res.push(v);
//           }
//         });
//         if (res.length > 0) {
//           setSubmittedInvestigtion(res[res.length - 1].labRadiology);
//           setAlreadyExistId(res[res.length - 1]._id);
//         }
//       })
//       .catch((error) => {});
//   };

//   useEffect(() => {
//     const fetchRadiologyData = async () => {
//       await axios
//         .get(`${REACT_APP_BASE_URL}investigation-radiology-master`, {
//           headers: { Authorization: "Bearer " + token },
//         })
//         .then((response) => {
//           let inv = [];
//           response.data.investigation.forEach((v) => {
//             if (departmentId === v.departmentId) {
//               inv.push(v);
//             }
//           });
//           setInvestigationRadiology(inv);
//         })
//         .catch(() => {});
//     };

//     const fetchPathologyData = async () => {
//       await axios
//         .get(`${REACT_APP_BASE_URL}investigation-pathology-master`, {
//           headers: { Authorization: "Bearer " + token },
//         })
//         .then((response) => {
//           let inv = [];
//           response.data.investigation.forEach((v) => {
//             if (departmentId === v.departmentId) {
//               inv.push(v);
//             }
//           });
//           setInvestigationPathology(inv);
//         })
//         .catch(() => {});
//     };
//     fetchRadiologyData();

//     fetchPathologyData();
//   }, []);

//   useEffect(() => {
//     if (submittedInvestigation.length > 0) {
//       let rD = [];
//       let pD = [];
//       investigationRadiology.forEach((v) => {
//         submittedInvestigation.forEach((val) => {
//           if (v._id === val.investigationId) {
//             rD.push(val);
//           }
//         });
//       });
//       investigationPathology.forEach((v) => {
//         submittedInvestigation.forEach((val) => {
//           if (v._id === val.investigationId) {
//             pD.push(val);
//           }
//         });
//       });

//       setRadiologyData(rD);
//       setPathologyData(pD);
//     }
//   }, [submittedInvestigation, investigationRadiology, investigationPathology]);

//   const getLabRadiology = async () => {
//     setLoader(true);
//     await getPatientLabRadiology();

//     await axios
//       .get(`${REACT_APP_BASE_URL}specimen-pathology-master`, {
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       })
//       .then(async (response) => {
//         await axios
//           .get(`${REACT_APP_BASE_URL}investigation-radiology-master`, {
//             headers: { Authorization: "Bearer " + token },
//           })
//           .then((rr) => {
//             let inv = [];
//             rr.data.investigation.forEach((v) => {
//               if (departmentId === v.departmentId) {
//                 inv.push(v);
//               }
//             });

//             setSelectedLabMenu({ name: "Radiology" });
//             setSpecimen(response.data.specimen);
//             setLoader(false);
//           })
//           .catch(() => {});
//       })
//       .catch(() => {});
//   };

//   useEffect(() => {
//     getLabRadiology();
//   }, []);

//   const handleSubmitTestName = (data) => {
//     let sM = [...submittedInvestigation, data];
//     sM = [
//       ...new Map(
//         sM.map((item) => [item["testName"] + item["investigationId"], item])
//       ).values(),
//     ];

//     if (submittedInvestigation.length === 0) {
//       handleCreateData(sM);
//     } else {
//       handleEditData(sM, selectedLabMenu.name);
//     }
//   };

//   const handleCreateData = (sM) => {
//     axios
//       .post(
//         `${REACT_APP_BASE_URL}patient-lab-radiology`,
//         {
//           departmentId,
//           labRadiology: sM,
//         },
//         {
//           headers: { Authorization: "Bearer " + token },
//         }
//       )
//       .then((response) => {
//         toast.success(`Investigation Successfully Submitted!!`);
//         getPatientLabRadiology();
//       })
//       .catch((error) => {
//         toast.error("Something went wrong, Please try later!!");
//       });
//   };

//   const handleEditData = (dta) => {
//     axios
//       .put(
//         `${REACT_APP_BASE_URL}patient-lab-radiology/${alreadyExistId}`,
//         {
//           departmentId,
//           labRadiology: dta,
//         },
//         {
//           headers: { Authorization: "Bearer " + token },
//         }
//       )
//       .then((response) => {
//         toast.success(`Investigation Successfully Updated!!`);
//         getPatientLabRadiology();
//       })
//       .catch((error) => {
//         toast.error("Something went wrong, Please try later!!");
//       });
//   };

//   const getPatientProcedure = async () => {
//     await axios
//       .get(`${REACT_APP_BASE_URL}patient-procedure/${departmentId}`, {
//         headers: { Authorization: "Bearer " + token },
//       })
//       .then((response) => {
//         let res = [];
//         response.data.data.forEach((v) => {
//           if (v.departmentId === departmentId) {
//             res.push({ procedure: v.procedure, notes: v.notes });
//             setAlreadyProcedureExistId(v._id);
//           }
//         });
//         if (res.length > 0) {
//           setPatientProcedure(res[res.length - 1]);
//           setNotes(res[res.length - 1].notes);
//           setExist(false);
//         }
//       })
//       .catch((error) => {});
//   };

//   useEffect(() => {
//     getPatientProcedure();
//   }, []);

//   const handleCreatePatientProcedure = (pro) => {
//     axios
//       .post(
//         `${REACT_APP_BASE_URL}patient-procedure`,
//         {
//           departmentId,
//           ...pro,
//         },
//         {
//           headers: { Authorization: "Bearer " + token },
//         }
//       )
//       .then((response) => {
//         getPatientProcedure();
//         toast.success(`Procedure Successfully Submitted!!`);
//         setExist(false);
//       })
//       .catch((error) => {
//         toast.error("Something went wrong, Please try later!!");
//       });
//   };

//   const handleEditPatientProcedure = (pro) => {
//     axios
//       .put(
//         `${REACT_APP_BASE_URL}patient-procedure/${alreadyProcedureExistId}`,
//         {
//           departmentId,
//           ...pro,
//         },
//         {
//           headers: { Authorization: "Bearer " + token },
//         }
//       )
//       .then((response) => {
//         getPatientProcedure();
//         toast.success(`Procedure Successfully Updated!!`);
//         setExist(false);
//       })
//       .catch((error) => {
//         toast.error("Something went wrong, Please try later!!");
//       });
//   };

//   const handleSubmitProcedure = (pro) => {
//     if (patientProcedure.procedure.length === 0) {
//       handleCreatePatientProcedure(pro);
//     } else {
//       handleEditPatientProcedure(pro);
//     }
//   };

//   const getPatientInstructionData = async () => {
//     await axios
//       .get(
//         `${REACT_APP_BASE_URL}patient-instruction/${
//           JSON.parse(localStorage.getItem("patientConsult"))._id
//         }`,
//         {
//           headers: { Authorization: "Bearer " + token },
//         }
//       )
//       .then((response) => {
//         let res = [];
//         response.data.data.forEach((v) => {
//           if (v.departmentId === departmentId) {
//             res.push(v);
//           }
//         });
//         if (res.length > 0) {
//           setPatientInstruction(res[res.length - 1].instruction);
//           setAlreadyInstructionExistId(res[res.length - 1]._id);
//         }
//       })
//       .catch((error) => {});
//   };

//   useEffect(() => {
//     getPatientInstructionData();
//   }, []);

//   const handleSubmitEditInstruction = (sM) => {
//     axios
//       .put(
//         `${REACT_APP_BASE_URL}patient-instruction/${alreadyInstructionExistId}`,
//         {
//           departmentId,
//           instruction: sM,
//         },
//         {
//           headers: { Authorization: "Bearer " + token },
//         }
//       )
//       .then((response) => {
//         getPatientInstructionData();
//         toast.success(`Instruction Successfully Updated!!`);
//       })
//       .catch((error) => {
//         toast.error("Something went wrong, Please try later!!");
//       });
//   };

//   return (
//     <div className="paticularSection">
//       {loader ? (
//         <Loader />
//       ) : (
//         <>
//           {specimen.length === 0 ? (
//             <h2 className="noFoundOPdUP" style={{ marginLeft: "10px" }}>
//               Test not available
//             </h2>
//           ) : (
//             <Grid container spacing={2} style={{ height: "100%" }}>
//               <Grid
//                 item
//                 container
//                 spacing={2}
//                 sx={12}
//                 style={{ marginTop: "1rem", marginLeft: "10px", }}
//               >
//                 <Grid
//                   item
//                   xs={4}
//                   sm={4}
//                   md={3}
//                   lg={4}
//                   className="labMenuParent ptData"
//                   style={{ height: selectedMenu !== "All" && "100%", margin: "1rem", display: "flex", }}
//                 >
//                   <div
//                     className={`${
//                       selectedLabMenu.name === "Radiology" && "labMenuActive"
//                     } labMenu`}
//                     onClick={() => {
//                       setSelectedLabMenu({ name: "Radiology" });
//                     }}
//                     style={{ color: "#056a75", fontWeight: "bold" }}
//                   >
//                     Radiology
//                   </div>
//                   <div
//                     className={`${
//                       selectedLabMenu.name !== "Radiology" && "labMenuActive"
//                     } labMenu`}
//                     style={{
//                       marginTop: "5px",
//                       color: "#056a75",
//                       fontWeight: "bold",
//                       display: "flex",
//                       justifyContent: "space-between",
//                     }}
//                     onClick={() => {
//                       setShowPathology((prev) => !prev);
//                     }}
//                   >
//                     Pathology
//                     {showPathology && <KeyboardArrowDown />}
//                     {!showPathology && <KeyboardArrowUp />}
//                   </div>

//                   {showPathology && (
//                     <div style={{ marginLeft: "10px" }}>
//                       {specimen.map((val, ind) => {
//                         return (
//                           <div
//                             className={`${
//                               selectedLabMenu.name === val.name && "labMenuActive"
//                             } labMenu`}
//                             onClick={() => {
//                               setSelectedLabMenu(val);
//                             }}
//                             key={ind}
//                           >
//                             {val.name}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </Grid>

//                 <Grid item xs={6}  height="inherit">
//                   <LabInvestigation
//                     selectedLabMenu={selectedLabMenu}
//                     submittedInvestigation={submittedInvestigation}
//                     handleSubmitTestName={handleSubmitTestName}
//                   />
//                 </Grid>
//               </Grid>

//               <Grid
//                 item
//                 xs={3}
//                 sm={3}
//                 md={4}
//                 className="ptData"
//                 style={{ height: selectedMenu !== "All" && "100%" }}
//               >
//                 {submittedInvestigation.length > 0 && (
//                   <Grid style={{ marginBottom: "2rem" }}>
//                     <h4 style={{ marginBottom: "10px" }}>Investigation</h4>

//                     {radiologyData.length > 0 && (
//                       <Grid
//                         item
//                         xs={12}
//                         style={{
//                           marginBottom: "10px",
//                           backgroundColor: "#eee",
//                           padding: "5px",
//                           borderRadius: "5px",
//                           boxShadow: "0 0 5px #ccc",
//                         }}
//                       >
//                         <h4 style={{ color: "blue" }}>Radiology</h4>
//                         <LabTestList
//                           submittedInvestigation={submittedInvestigation}
//                           singleData={radiologyData}
//                           handleEditData={handleEditData}
//                         />
//                       </Grid>
//                     )}

//                     {pathologyData.length > 0 && (
//                       <Grid
//                         item
//                         xs={12}
//                         style={{
//                           backgroundColor: "#eee",
//                           padding: "5px",
//                           borderRadius: "5px",
//                           boxShadow: "0 0 5px #ccc",
//                         }}
//                       >
//                         <h4 style={{ color: "blue" }}>Pathology</h4>
//                         <LabTestList
//                           submittedInvestigation={submittedInvestigation}
//                           singleData={pathologyData}
//                           handleEditData={handleEditData}
//                         />
//                       </Grid>
//                     )}
//                   </Grid>
//                 )}

//                 {patientProcedure.procedure.length > 0 && (
//                   <Grid style={{ marginBottom: "2rem" }}>
//                     <h4 style={{ margin: "5px 0" }}>Procedure</h4>
//                     <Box className="selectedPtCategory">
//                       {patientProcedure.procedure.map((val, ind) => {
//                         return (
//                           <Chip
//                             key={ind}
//                             className="selectProblemActive"
//                             label={val.SurgeryName}
//                             onDelete={() => {
//                               let medPro = [];
//                               patientProcedure.procedure.forEach((vM) => {
//                                 if (vM.SurgeryName !== val.SurgeryName) {
//                                   medPro.push(vM);
//                                 }
//                               });
//                               handleSubmitProcedure({
//                                 procedure: medPro,
//                                 notes: notes,
//                               });
//                             }}
//                           />
//                         );
//                       })}

//                       <TextField
//                         fullWidth
//                         variant="outlined"
//                         name="notes"
//                         label="Notes"
//                         value={notes}
//                         onChange={(e) => {
//                           setNotes(e.target.value);
//                           setExist(true);
//                         }}
//                         multiline
//                         rows={2}
//                         style={{ marginTop: "10px" }}
//                       />
//                       {exist && (
//                         <Button
//                           variant="contained"
//                           className="addBtn"
//                           style={{ marginTop: "10px" }}
//                           onClick={() =>
//                             handleSubmitProcedure({
//                               procedure: patientProcedure.procedure,
//                               notes: notes,
//                             })
//                           }
//                         >
//                           Submit
//                         </Button>
//                       )}
//                     </Box>
//                   </Grid>
//                 )}

//                 {patientInstruction.length > 0 && (
//                   <div style={{ marginBottom: "2rem" }}>
//                     <h4 style={{ margin: "5px 0" }}>Instruction</h4>
//                     <Box className="selectedPtCategory">
//                       {patientInstruction.map((val, ind) => {
//                         return (
//                           <Chip
//                             key={ind}
//                             className="selectProblemActive"
//                             label={val.heading}
//                             onDelete={() => {
//                               setOpenAddInstructionDetail(false);
//                               let medPro = [];
//                               patientInstruction.forEach((vM) => {
//                                 if (vM.heading !== val.heading) {
//                                   medPro.push(vM);
//                                 }
//                               });
//                               handleSubmitEditInstruction(medPro);
//                             }}
//                           />
//                         );
//                       })}
//                     </Box>
//                   </div>
//                 )}
//               </Grid>
//             </Grid>
//           )}
//         </>
//       )}
//       <ToastContainer />
//     </div>
//   );
// };

// export default LabRadiology;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { get, post, put } from 'api/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import LabRadiologyDisplay from './LabToDisplay';

const LabRadiology = ({ departmentId }) => {
  // State for storing fetched data
  const patient = useSelector((state) => state.patient.selectedPatient);

  const [radiologyMasterData, setRadiologyMasterData] = useState([]);
  const [pathologyTests, setPathologyTests] = useState([]);
  const [pathologyProfiles, setPathologyProfiles] = useState([]);
  const [submittedDataId, setSubmittedDataId] = useState('');
  // patient radiology data
  const [patientData, setPatientData] = useState([]);

  // UI state
  const [expanded, setExpanded] = useState(null);
  const [pathologyView, setPathologyView] = useState('test'); // "test" or "profile"

  // Search & Pagination State
  const [radiologySearch, setRadiologySearch] = useState('');
  const [pathologySearch, setPathologySearch] = useState('');

  // Selected Items State
  const [selectedRadiology, setSelectedRadiology] = useState([]);
  const [selectedPathology, setSelectedPathology] = useState([]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const radiology = await get('investigation-radiology-master');
        const pathologyTestsData = await get('investigation-pathology-master');
        const pathologyProfilesData = await get('investigation-pathology-master/profile');

        setRadiologyMasterData(radiology?.investigation || []);
        setPathologyTests(pathologyTestsData?.investigations || []);
        setPathologyProfiles(pathologyProfilesData?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Accordion Toggle
  const handleExpand = (panel) => {
    setExpanded(expanded === panel ? null : panel);
  };

  // Filtering & Limiting Displayed Data
  const filteredRadiology = radiologyMasterData
    .filter((item) => item.testName.toLowerCase().includes(radiologySearch.toLowerCase()))
    .slice(0, radiologySearch ? radiologyMasterData.length : 15);

  const filteredPathologyTests = pathologyTests
    .filter((item) => item.testName.toLowerCase().includes(pathologySearch.toLowerCase()))
    .slice(0, pathologySearch ? pathologyTests.length : 15);

  const filteredPathologyProfiles = pathologyProfiles
    .filter((item) => item.profileName.toLowerCase().includes(pathologySearch.toLowerCase()))
    .slice(0, pathologySearch ? pathologyProfiles.length : 15);

  // Handle Select/Deselect for Radiology
  const selectedFor = expanded?.toLowerCase()?.trim() === 'radiology'?.trim() ? 'RadioLogy' : 'Pathology';
  const handleRadiologySelect = (test) => {
    setSelectedRadiology((prevSelected) => {
      const exists = prevSelected.some((item) => item.investigationId === test._id);
      if (exists) {
        return prevSelected.filter((item) => item.investigationId !== test._id); // Remove if already selected
      } else {
        return [...prevSelected, { investigationId: test._id, testName: test.testName, selectedFor }];
      }
    });
  };

  const handlePathologySelect = (test) => {
    setSelectedPathology((prevSelected) => {
      const exists = prevSelected.some((item) => item.investigationId === test._id);
      if (exists) {
        return prevSelected.filter((item) => item.investigationId !== test._id); // Remove if already selected
      } else {
        return [...prevSelected, { investigationId: test._id, testName: test.testName || test.profileName, selectedFor }];
      }
    });
  };

  const getPatientLabRadiology = async () => {
    try {
      const patientId = patient?.patientId?._id;
      const response = await get(`patient-lab-radiology/${patientId}`);
      setPatientData(response?.data ?? []);
      setSubmittedDataId(response?.data?.[0]?._id);
    } catch (err) {}
  };

  const handleSubmitData = async (sM) => {
    try {
      let data = [...selectedRadiology, ...selectedPathology];
      const response = await post(`patient-lab-radiology`, {
        departmentId,
        labRadiology: data,
        patientId: patient?.patientId?._id,
        consultantId: patient?.consultantId
      });

      if (response?.data) {
        toast.success(`Investigation Successfully Submitted!!`);
        getPatientLabRadiology();
        setSelectedPathology([]);
        setSelectedRadiology([]);
      } else {
        toast.error('Something went wrong, Please try later!!');
      }

      // await getPatientLabRadiology();
    } catch (error) {
      toast.error('Something went wrong, Please try later!!');
    }
  };
  const handleDelete = async (testId, parentId) => {
    try {
      const res = await put(`patient-lab-radiology/delete/${parentId}`, { investigationId: testId });
      if (res?.data) {
        toast.success('Test deleted successfully');
        getPatientLabRadiology();
      } else {
        toast.success('Something went wrong');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  console.log('PATIENT DATA', patientData);
  useEffect(() => {
    getPatientLabRadiology();
  }, [patient]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* RADIOLGY SECTION */}
      <Box sx={{ maxWidth: 600, mt: 4 }}>
        <Accordion expanded={expanded === 'radiology'} onChange={() => handleExpand('radiology')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" fontWeight="bold">
              Radiology
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Search Bar */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search Radiology..."
              value={radiologySearch}
              onChange={(e) => setRadiologySearch(e.target.value)}
              sx={{ mb: 2 }}
            />

            {filteredRadiology.length > 0 ? (
              <List>
                {filteredRadiology.map((test, index) => (
                  <ListItem key={index} button onClick={() => handleRadiologySelect(test)}>
                    <ListItemIcon>
                      <Checkbox checked={selectedRadiology.some((item) => item.investigationId === test._id)} />
                    </ListItemIcon>
                    <ListItemText primary={test.testName} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No Radiology Data Available</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* PATHOLOGY SECTION */}
        <Accordion expanded={expanded === 'pathology'} onChange={() => handleExpand('pathology')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" fontWeight="bold">
              Pathology
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Pathology Toggle Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button variant={pathologyView === 'test' ? 'contained' : 'outlined'} onClick={() => setPathologyView('test')}>
                Test
              </Button>
              <Button variant={pathologyView === 'profile' ? 'contained' : 'outlined'} onClick={() => setPathologyView('profile')}>
                Profile
              </Button>
            </Box>

            {/* Search Bar */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder={`Search Pathology ${pathologyView === 'test' ? 'Tests' : 'Profiles'}...`}
              value={pathologySearch}
              onChange={(e) => setPathologySearch(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Display Test or Profile Data */}
            {pathologyView === 'test' ? (
              filteredPathologyTests.length > 0 ? (
                <List>
                  {filteredPathologyTests.map((test, index) => (
                    <ListItem key={index} button onClick={() => handlePathologySelect(test)}>
                      <ListItemIcon>
                        <Checkbox checked={selectedPathology.some((item) => item.investigationId === test._id)} />
                      </ListItemIcon>
                      <ListItemText primary={test.testName || test.profileName} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No Pathology Test Data Available</Typography>
              )
            ) : filteredPathologyProfiles.length > 0 ? (
              <List>
                {filteredPathologyProfiles.map((profile, index) => (
                  <ListItem key={index} button onClick={() => handlePathologySelect(profile)}>
                    <ListItemIcon>
                      <Checkbox checked={selectedPathology.some((item) => item.investigationId === profile._id)} />
                    </ListItemIcon>
                    <ListItemText primary={profile.profileName} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No Pathology Profile Data Available</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        <Button sx={{ mt: 4 }} variant="contained" onClick={handleSubmitData}>
          Save
        </Button>
      </Box>

      {patientData?.length > 0 && <LabRadiologyDisplay data={patientData} onDelete={handleDelete} onUpdate={() => {}} />}
    </Box>
  );
};

export default LabRadiology;

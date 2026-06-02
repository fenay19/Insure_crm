import { Add, Close, Delete, Edit, Search } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import REACT_APP_BASE_URL, { get, post, remove } from 'api/api';
import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { retrieveToken } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';
import Loader from 'component/Loader/Loader';
const DrugHistory = ({
  departmentId,
  medicalCategory,
  activeStep,
  patientHistory,
  setPatientHistory,
  allDrugHistory,
  since,
  sinceFunction,
  getAllMasterData,
  isFemale,
  isPed
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [mostusedDrugHistory, setmostusedDrugHistory] = useState([]);
  const [drugHistory, setDrugHistory] = useState([]);

  const [openMedicalPro, setOpenMedicalPro] = useState(false);
  const [openData, setOpenData] = useState({});
  const [error, setError] = useState('');
  const [openAddMedicalPro, setOpenAddMedicalPro] = useState(false);
  const [loader, setLoader] = useState(true);
  const [openEditHandler, setOpenEditHandler] = useState(false);
  const [openDeleteHandler, setOpenDeleteHandler] = useState(false);
  const [openEditDataDetail, setOpenEditDataDetail] = useState(false);
  const [deleteIds, setDeletedIds] = useState([]);
  const [sinceOpen, setSinceOpen] = useState(false);
  const [sinceValue, setSinceValue] = useState('');
  const [mostUsedMedicine, setMostUsedMedicine] = useState([]);
  const [showMedicine, setShowMedicine] = useState([]);
  const [dose, setDose] = useState([]);
  const [medicineSelected, setMedicineSelected] = useState(false);
  const token = retrieveToken();
  const [originalShowMedicine, setOriginalShowMedicine] = useState([]);
  const handleSince = () => {
    setSinceOpen(true);
    setOpenMedicalPro(false);
  };

  const handleSinceClose = () => {
    setSinceOpen(false);
    setOpenMedicalPro(true);
  };

  const handleSinceSubmit = async () => {
    setMedicineSelected(false);
    if (sinceValue === '') {
      return alert('Enter the Since');
    }

    await post('since-master', { since: sinceValue }).then((response) => {
      if (response) {
        sinceFunction();
        setSinceOpen(false);
        // setOpenMedicalPro(true);
        setSinceValue('');
      }
    });
  };

  const deleteSince = async (id) => {
    await remove(`since-master/delete/${id}`).then((response) => {
      if (response) {
        sinceFunction();
      }
    });
  };

  const getDrugHistory = async () => {
    setLoader(true);

    await axios
      .get(`${REACT_APP_BASE_URL}opd/drug-history/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setDrugHistory(res);
        setmostusedDrugHistory(res);
        setLoader(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getDrugHistory();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase(); // Convert search value to lowercase for case-insensitive search
    setSearchValue(value);

    if (value === '') {
      // Reset to the original `showMedicine` data
      setShowMedicine(originalShowMedicine); // Use the original data to reset
    } else {
      // Filter `showMedicine` based on `brandName` and `category`
      const filteredDrugs = originalShowMedicine.filter(
        (v) =>
          v.brandName?.toLowerCase().includes(value) || // Check if `brandName` matches the search value
          v.genericName?.toLowerCase().includes(value) // Check if `category` matches the search value
      );
      console.log('filteredDrugs', filteredDrugs);

      setShowMedicine(filteredDrugs);
    }
  };
  const closeForm = () => {
    setOpenMedicalPro(false);
    setError('');
    setOpenAddMedicalPro(false);
    setOpenData({});
    setOpenDeleteHandler(false);
    setOpenEditDataDetail(false);
    setOpenEditHandler(false);
  };

  const handleSubmitDrugHistory = async () => {
    if (openData.problem === '') {
      setError('Enter the Drug History');
    } else {
      //call api to store Drug History
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/drug-history`,
          {
            problem: openData.problem,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getDrugHistory();
          let sM = [response.data.data, ...drugHistory];
          sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
          setDrugHistory(sM);
          closeForm();
          toast.success('Drug History Created Successfully!!');
        })
        .catch((error) => {
          toast({
            title: 'Something went wrong, Please try later!!',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        });
    }
  };

  const handleUpdateSubmitDrugHistory = async () => {
    if (openData.problem === '') {
      setError('Enter the Drug History');
    } else {
      //call api to store Drug History
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/drug-history/${openData._id}`,
          {
            problem: openData.problem,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getDrugHistory();

          closeForm();
          toast({
            title: 'Drug History Updated Successfully!!',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        })
        .catch((error) => {
          toast({
            title: 'Something went wrong, Please try later!!',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        });
    }
  };

  const handleSaveDeleteDrugHistory = () => {
    let data = {
      ids: deleteIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/drug-history`, {
        headers,
        data
      })
      .then(async (response) => {
        await getAllMasterData();
        getDrugHistory();
        setDeletedIds([]);
        setOpenDeleteHandler(false);
        toast({
          title: 'Drug History Deleted Successfully!!',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      })
      .catch((error) => {
        toast({
          title: 'Something went wrong, Please try later!!',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      });
  };

  // useEffect(() => {
  //   (async () => {
  //     await axios
  //       .get(`${REACT_APP_BASE_URL}medicines/most-used`, {
  //         headers: { Authorization: 'Bearer ' + token }
  //       })
  //       .then((response) => {
  //         setMostUsedMedicine(response.data.data);
  //         setShowMedicine(response.data.data);
  //         setLoader(false);
  //       })
  //       .catch((error) => { });
  //   })();
  // }, [token]);
  useEffect(() => {
    (async () => {
      const response = await axios.get(`${REACT_APP_BASE_URL}medicines`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      console.log('MEDICINE', response);
      setOriginalShowMedicine(response?.data?.allMedicines ?? []); // Store the original data
      setShowMedicine(response?.data?.allMedicines ?? []); // Set the data for display
      setLoader(false);
    })();
  }, [token]);
  useEffect(() => {
    (async () => {
      const res = await get('dose-master');
      setDose(res?.data ?? []);
    })();
  }, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <Grid container spacing={2} width="40vw" height="100%">
          <Grid item xs={8} height="inherit">
            <h2 className="heading">
              {(!isFemale && !isPed
                ? activeStep > 4
                  ? activeStep - 3
                  : activeStep
                : !isFemale && isPed
                  ? activeStep > 5
                    ? activeStep - 2
                    : activeStep
                  : isFemale && !isPed
                    ? activeStep > 6
                      ? activeStep - 1
                      : activeStep
                    : activeStep) + 1}
              . {medicalCategory[activeStep].category}
            </h2>
            <Input
              className="search_patient_data"
              type="search"
              placeholder="Search..."
              endAdornment={
                <InputAdornment position="end">
                  <Search className="search_patient_data_icon" />
                </InputAdornment>
              }
              onChange={handleSearch}
              value={searchValue}
            />

            <Button
              style={{ marginLeft: '2px', display: 'inline-block' }}
              className="button-87"
              onClick={() => {
                setOpenData({ problem: '' });
                setOpenMedicalPro(false);
                setOpenAddMedicalPro(true);
                setOpenEditDataDetail(false);
                setOpenEditHandler(false);
                setOpenDeleteHandler(false);
              }}
            >
              Add
            </Button>

            {allDrugHistory.length > 0 && (
              <IconButton
                style={{ marginLeft: '2px' }}
                title="Edit Drug History"
                onClick={() => {
                  setOpenData({ problem: '' });
                  setOpenMedicalPro(false);
                  setOpenAddMedicalPro(false);
                  setOpenEditDataDetail(false);
                  setOpenEditHandler(true);
                  setOpenDeleteHandler(false);
                }}
              >
                <Edit fontSize="small" style={{ color: 'blue' }} />
              </IconButton>
            )}

            {allDrugHistory.length > 0 && (
              <IconButton
                style={{ marginLeft: '2px' }}
                title="Delete Drug History"
                onClick={() => {
                  setOpenData({ problem: '' });
                  setOpenMedicalPro(false);
                  setOpenAddMedicalPro(false);
                  setOpenEditDataDetail(false);
                  setOpenEditHandler(false);
                  setOpenDeleteHandler(true);
                }}
              >
                <Delete fontSize="small" style={{ color: 'red' }} />
              </IconButton>
            )}

            {allDrugHistory.length === 0 ? (
              <h4 className="noFoundOPd">Drug History Not Available, Please Add...</h4>
            ) : (
              <>
                {drugHistory.length > 0 ? (
                  <Box className="selectedCategory">
                    {drugHistory.map((val, ind) => {
                      let pre = false;
                      const ids = new Set(patientHistory?.drugHistory?.map((d) => d._id));
                      if (ids?.has(val?._id) || openData?._id === val?._id) {
                        pre = true;
                      }
                      return (
                        <Chip
                          key={ind}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: pre ? 'primary.main' : 'secondary.main',
                            borderStyle: 'solid',
                            ml: 1,
                            my: 1
                          }}
                          variant={pre ? 'default' : 'outlined'}
                          color={pre ? 'primary' : 'default'}
                          label={val.problem}
                          onClick={() => {
                            let med = {
                              _id: val._id,
                              problem: val.problem,
                              since: ''
                            };
                            patientHistory.drugHistory !== undefined &&
                              patientHistory.drugHistory.forEach((v) => {
                                if (v.problem === val.problem && v._id === val._id) {
                                  med = v;
                                }
                              });
                            setOpenAddMedicalPro(false);
                            setOpenMedicalPro(true);
                            setOpenData(med);
                            setOpenDeleteHandler(false);
                            setOpenEditDataDetail(false);
                            setOpenEditHandler(false);
                          }}
                          onDelete={
                            pre
                              ? () => {
                                  let medPro = [];
                                  patientHistory.drugHistory.forEach((vM) => {
                                    if (vM._id !== val._id) {
                                      medPro.push(vM);
                                    }
                                  });
                                  setPatientHistory((prev) => {
                                    return {
                                      ...prev,
                                      drugHistory: medPro
                                    };
                                  });
                                  setOpenDeleteHandler(false);
                                  setOpenEditDataDetail(false);
                                  setOpenEditHandler(false);
                                }
                              : undefined
                          }
                          deleteIcon={pre ? <Close sx={{ color: pre ? '#fff !important' : '#333' }} /> : undefined}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <h4 className="noFoundOPd">Not Found</h4>
                )}
              </>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {loader ? (
                <CircularProgress />
              ) : (
                (showMedicine || [])?.slice(0, 15)?.map((val, ind) => {
                  let pre = false;
                  const ids = new Set(patientHistory?.drugHistory?.map((d) => d._id));
                  if (ids?.has(val?._id) || openData?._id === val?._id) {
                    pre = true;
                  }

                  return (
                    <Chip
                      key={ind}
                      sx={{
                        borderWidth: 2, // Increase border thickness
                        borderColor: pre ? 'primary.main' : 'secondary.main',
                        borderStyle: 'solid',
                        ml: 1,
                        my: 1
                      }}
                      variant={pre ? 'default' : 'outlined'}
                      color={pre ? 'primary' : 'default'}
                      avatar={<Avatar sx={{ bgcolor: '#BBDEFB', color: '#000' }}>{val.type.toString().substring(0, 3)}</Avatar>}
                      label={` ${val.brandName} (${val.genericName})`}
                      title={`Available: ${val.flag ? '*' : ''} ${val.brandName} (${val.dose})`}
                      onClick={() => {
                        setMedicineSelected(true);
                        let med = {
                          _id: val._id,
                          problem: `${val.brandName} (${val.genericName})`,
                          since: ''
                        };
                        patientHistory.drugHistory !== undefined &&
                          patientHistory.drugHistory.forEach((v) => {
                            if (v.problem === `${val.brandName} (${val.genericName})` && v._id === val._id) {
                              med = v;
                            }
                          });
                        setOpenAddMedicalPro(false);
                        setOpenMedicalPro(true);
                        setOpenData(med);
                        setOpenDeleteHandler(false);
                        setOpenEditDataDetail(false);
                        setOpenEditHandler(false);
                      }}
                      onDelete={
                        pre
                          ? () => {
                              let medPro = [];
                              patientHistory.drugHistory.forEach((vM) => {
                                console.log('VMMMMM', vM);
                                if (vM?._id !== val?._id) {
                                  medPro.push(vM);
                                }
                              });
                              setPatientHistory((prev) => {
                                return {
                                  ...prev,
                                  drugHistory: medPro
                                };
                              });
                              setOpenDeleteHandler(false);
                              setOpenEditDataDetail(false);
                              setOpenEditHandler(false);
                            }
                          : undefined
                      }
                      deleteIcon={pre ? <Close sx={{ color: pre ? '#fff !important' : '#333' }} /> : undefined}
                    />
                  );
                })
              )}
            </Box>
          </Grid>

          <Dialog
            open={openAddMedicalPro}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* content */}
            <DialogContent>
              {openAddMedicalPro && (
                <Box className="selectedPtCategory">
                  <h4>Add Drug History</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="problem"
                    value={openData.problem}
                    onChange={(e) => {
                      setOpenData((prev) => {
                        return { ...prev, problem: e.target.value };
                      });
                      setError('');
                    }}
                    error={error !== '' ? true : false}
                    helperText={error}
                    style={{ marginBottom: '10px' }}
                  />
                  <Button className="addBtn" onClick={handleSubmitDrugHistory} variant="contained">
                    Save
                  </Button>
                  <Button className="addBtn" sx={{ ml: 1 }} onClick={() => setOpenAddMedicalPro(false)} variant="contained">
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openEditHandler}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* content */}
            <DialogContent>
              {openEditHandler && (
                <Box className="selectedPtCategory">
                  <h4>Edit Drug History</h4>
                  <Box className="selectedCategory">
                    {allDrugHistory.map((val, ind) => {
                      return (
                        <Chip
                          key={ind}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: 'secondary.main',
                            borderStyle: 'solid',
                            ml: 1,
                            my: 1
                          }}
                          variant={'outlined'}
                          color={'default'}
                          className="selectProblem"
                          label={val.problem}
                          onClick={() => {
                            setOpenEditHandler(false);
                            setOpenEditDataDetail(true);
                            setOpenAddMedicalPro(false);
                            setOpenMedicalPro(false);
                            setOpenData(val);
                            setOpenDeleteHandler(false);
                          }}
                        />
                      );
                    })}
                  </Box>
                  <Button className="addBtn" sx={{ ml: 1 }} onClick={() => setOpenEditHandler(false)} variant="contained">
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openEditDataDetail}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* content */}
            <DialogContent>
              {openEditDataDetail && (
                <Box className="selectedPtCategory">
                  <h4>Update Drug History</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="problem"
                    value={openData.problem}
                    onChange={(e) => {
                      setOpenData((prev) => {
                        return { ...prev, problem: e.target.value };
                      });
                      setError('');
                    }}
                    error={error !== '' ? true : false}
                    helperText={error}
                    style={{ marginBottom: '10px' }}
                  />
                  <Button className="addBtn" onClick={handleUpdateSubmitDrugHistory} variant="contained">
                    Save
                  </Button>
                  <Button
                    className="addBtn"
                    onClick={() => {
                      setOpenEditDataDetail(false);
                      setOpenEditHandler(true);
                    }}
                    sx={{ ml: 1 }}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDeleteHandler}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* content */}
            <DialogContent>
              {openDeleteHandler && (
                <Box className="selectedPtCategory">
                  <h4>Delete Drug History</h4>
                  <Box className="selectedCategory">
                    {allDrugHistory.map((val, ind) => {
                      let exist = false;
                      deleteIds.forEach((v) => {
                        if (val._id === v) {
                          exist = true;
                        }
                      });
                      return (
                        <Chip
                          key={ind}
                          className={exist ? 'selectProblemDelete' : 'selectProblem'}
                          label={val.problem}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: exist ? 'primary.main' : 'secondary.main',
                            borderStyle: 'solid',
                            ml: 1,
                            my: 1
                          }}
                          variant={exist ? 'default' : 'outlined'}
                          color={exist ? 'primary' : 'default'}
                          onClick={() => {
                            let a = deleteIds;
                            if (val._id !== undefined) {
                              a.push(val._id);
                            }

                            let unique = [];
                            a.forEach((element) => {
                              if (!unique.includes(element)) {
                                unique.push(element);
                              }
                            });

                            setDeletedIds(unique);
                          }}
                          onDelete={
                            exist
                              ? () => {
                                  let aa = [];
                                  deleteIds.forEach((vM) => {
                                    if (vM !== val._id) {
                                      aa.push(vM);
                                    }
                                  });
                                  setDeletedIds(aa);
                                }
                              : undefined
                          }
                          deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                        />
                      );
                    })}
                  </Box>

                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeleteDrugHistory}>
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    className="addBtn"
                    style={{ marginTop: '10px' }}
                    onClick={() => {
                      setOpenDeleteHandler(false);
                    }}
                    sx={{ ml: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={medicineSelected || openMedicalPro}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* content */}
            <DialogContent>
              <Grid item xs={4}>
                {medicineSelected && (
                  <Box className="selectedPtCategory">
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="dose-select-label">Dose</InputLabel>
                      <Select
                        labelId="dose-select-label"
                        value={openData?.dose}
                        onChange={(e) => {
                          setOpenData((prev) => ({ ...prev, dose: e.target.value }));
                        }}
                        label="Dose"
                      >
                        {dose.map((doseOption) => (
                          <MenuItem key={doseOption._id} value={doseOption.dose}>
                            {doseOption.dose}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}

                {openMedicalPro && (
                  <Box className="selectedPtCategory" sx={{ width: 400 }}>
                    <h4>Since ?</h4>
                    {/* <h4>How long has the patient had {openData.problem}?</h4> */}
                    <Box className="sinceFormat" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: 2 }}>
                      {since.map((v, inx) => {
                        let sinceData = v.since;
                        if (v.since.includes('Month')) {
                          sinceData = sinceData.replace(' Month', 'M');
                        }
                        if (v.since.includes('Year')) {
                          sinceData = sinceData.replace(' Year', 'Y');
                        }
                        if (v.since.includes('Week')) {
                          sinceData = sinceData.replace(' Week', 'W');
                        }

                        const isSelected = v === openData.since;

                        return (
                          <Chip
                            key={inx}
                            className={isSelected ? 'selectProblemWithActive' : 'selectProblemWith'}
                            label={sinceData}
                            sx={{
                              borderWidth: 2, // Increase border thickness
                              borderColor: isSelected ? 'primary.main' : 'secondary.main',
                              borderStyle: 'solid',
                              ml: 1,
                              my: 1
                            }}
                            variant={isSelected ? 'default' : 'outlined'}
                            color={isSelected ? 'primary' : 'default'}
                            onDelete={() => deleteSince(v._id)}
                            deleteIcon={<Close style={{ color: isSelected ? 'white' : 'inherit', fontSize: '14px' }} />}
                            onClick={() => {
                              setOpenData((prev) => ({
                                ...prev,
                                since: v,
                                option: 'Yes'
                              }));
                            }}
                          />
                        );
                      })}
                      <Button className="button-87" onClick={handleSince} variant="contained">
                        Add
                      </Button>
                    </Box>
                    <Button
                      variant="contained"
                      className="addBtn"
                      style={{ marginTop: '10px' }}
                      onClick={() => {
                        if (openData.since !== '') {
                          let sM =
                            patientHistory.drugHistory !== undefined
                              ? [...patientHistory.drugHistory, { ...openData, since: openData.since }]
                              : [{ ...openData, since: openData.since }];

                          sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
                          setPatientHistory((prev) => ({
                            ...prev,
                            drugHistory: sM
                          }));
                        }
                        setOpenData({});
                        setOpenMedicalPro(false);
                        setMedicineSelected(false);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setMedicineSelected(false);
                        setOpenMedicalPro(false);
                      }}
                      sx={{ ml: 2, mt: 1.3 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Grid>
            </DialogContent>
          </Dialog>

          <Dialog
            open={sinceOpen}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* content */}
            <DialogContent>
              {sinceOpen && (
                <Box sx={{ width: '300px' }}>
                  <h3>Add Since</h3>
                  <TextField
                    fullWidth
                    label="Since"
                    variant="outlined"
                    name="since"
                    value={sinceValue}
                    onChange={(e) => {
                      setSinceValue(e.target.value);
                    }}
                    sx={{ marginBottom: '10px', mt: 2 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSinceSubmit}>
                      Save
                    </Button>
                    <Button onClick={handleSinceClose} sx={{ ml: 2, mt: 1.3 }} variant="contained">
                      Cancel
                    </Button>
                  </div>
                </Box>
              )}
            </DialogContent>
          </Dialog>
        </Grid>
      )}

      {/* <ToastContainer /> */}
    </>
  );
};

export default DrugHistory;

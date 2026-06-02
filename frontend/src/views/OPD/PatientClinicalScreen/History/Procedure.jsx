import { Add, Close, Delete, Edit, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  TextField
} from '@mui/material';
import REACT_APP_BASE_URL, { post, remove, retrieveToken } from 'api/api';
import axios from 'axios';
import { color } from 'framer-motion';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const Procedure = ({
  departmentId,
  medicalCategory,
  activeStep,
  patientHistory,
  setPatientHistory,
  allProcedure,
  setAllProcedure,
  since,
  getAllMasterData,
  sinceFunction
}) => {
  const [openSelectProcedure, setOpenSelectProcedure] = useState(false);
  const [mostUsedProcedure, setMostUsedProcedure] = useState([]);
  const [procedure, setProcedure] = useState([]);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [duration, setDuration] = useState({ surgery: '', when: '' });
  const [openDuration, setOpenDuration] = useState(false);
  const [addProcedure, setAddProcedure] = useState({ surgery: '' });
  const [openAddProcedure, setOpenAddProcedure] = useState(false);
  const [loader, setLoader] = useState(true);

  const [openEditHandler, setOpenEditHandler] = useState(false);
  const [openDeleteHandler, setOpenDeleteHandler] = useState(false);
  const [openEditDataDetail, setOpenEditDataDetail] = useState(false);
  const [deleteIds, setDeletedIds] = useState([]);
  const [sinceOpen, setSinceOpen] = useState(false);
  const [sinceValue, setSinceValue] = useState('');
  const [procedureId, setProcedureId] = useState(null);

  const token = retrieveToken();

  const handleSince = () => {
    setSinceOpen(true);
    setOpenDuration(false);
  };

  const handleSinceClose = () => {
    setSinceOpen(false);
    setOpenDuration(true);
  };

  const handleSinceSubmit = async () => {
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

  const getProcedure = async () => {
    setLoader(true);

    await axios
      .get(`${REACT_APP_BASE_URL}opd/procedure/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setMostUsedProcedure(res);
        setProcedure(res);
        setLoader(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getProcedure();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (patientHistory.procedure.having === 'Yes') {
      setOpenSelectProcedure(true);
      setOpenDeleteHandler(false);
      setOpenAddProcedure(false);
      setOpenEditDataDetail(false);
      setOpenEditHandler(false);
    } else {
      setOpenSelectProcedure(false);
      setOpenDeleteHandler(false);
      setOpenAddProcedure(false);
      setOpenEditDataDetail(false);
      setOpenEditHandler(false);
    }
    // eslint-disable-next-line
  }, [patientHistory.procedure]);

  const closeProcedureForm = () => {
    setOpenAddProcedure(false);
    setAddProcedure({ surgery: '' });
    setOpenDuration(false);
    setOpenEditHandler(false);
    setOpenDeleteHandler(false);
    setOpenEditDataDetail(false);
    setDeletedIds([]);
  };

  const handleButtonClick = (btn) => {
    if (btn === 'Yes') {
      setOpenSelectProcedure(true);
      setOpenDuration(false);
      setPatientHistory((prev) => {
        return {
          ...prev,
          procedure: {
            having: btn,
            which: patientHistory.procedure.which === undefined ? [] : patientHistory.procedure.which
          }
        };
      });
    } else {
      setOpenSelectProcedure(false);
      setOpenDuration(false);
      setOpenAddProcedure(false);
      setPatientHistory((prev) => {
        return {
          ...prev,
          procedure: {
            having: btn,
            which: []
          }
        };
      });
    }
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setOpenDuration(false);
    if (e.target.value === '') {
      let medP = mostUsedProcedure.slice();

      patientHistory.procedure.which !== undefined &&
        patientHistory.procedure.which.forEach((vv) => {
          if (!medP.some((v) => v.surgery === vv.surgery)) {
            medP.unshift(vv);
          }
        });
      setProcedure(medP);
    } else {
      let med = [];
      allProcedure.forEach((v) => {
        if (v.surgery.toLowerCase().includes(e.target.value.toLowerCase())) {
          med.push(v);
        }
      });
      setProcedure(med);
    }
  };

  const handleSubmitProcedure = async () => {
    if (addProcedure.surgery === '') {
      setError(`Enter the Procedure Name`);
    } else {
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/procedure`,
          {
            surgery: addProcedure.surgery,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getProcedure();
          let sM = [response.data.data, ...procedure];
          sM = [...new Map(sM.map((item) => [item['surgery'], item])).values()];
          setProcedure(sM);
          closeProcedureForm();
          setOpenSelectProcedure(true);
          toast.success({
            title: 'Procedure Created Successfully!!',
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

  const handleUpdateSubmitProcedure = async () => {
    if (addProcedure.surgery === '') {
      setError(`Enter the Procedure Name`);
    } else {
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/procedure/${addProcedure._id}`,
          {
            surgery: addProcedure.surgery,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getProcedure();

          closeProcedureForm();
          setOpenSelectProcedure(true);
          toast({
            title: 'Procedure Updated Successfully!!',
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

  const handleSaveDeleteProcedure = () => {
    let data = {
      ids: deleteIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/procedure`, {
        headers,
        data
      })
      .then(async (response) => {
        await getAllMasterData();
        getProcedure();
        setDeletedIds([]);
        closeProcedureForm();
        setOpenSelectProcedure(true);
        toast({
          title: 'Procedure Deleted Successfully!!',
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

  return (
    <>
      <Grid container spacing={2} width="40vw" height="100%">
        <Grid item xs={5.8} sm={5.8} md={4.5} lg={3.5} height="inherit">
          <h2 className="heading">
            {activeStep + 1}. {medicalCategory[activeStep].category}
          </h2>

          <p className="catQue">Have you undergone any procedure?</p>
          <ButtonGroup variant="outlined" sx={{ marginTop: '10px', display: 'block', width: 400 }}>
            <Button
              className={`${patientHistory.procedure.having === 'Yes' && 'selectOptionActive'}`}
              onClick={() => handleButtonClick('Yes')}
              sx={{
                backgroundColor: `${patientHistory.procedure.having === 'Yes' ? '#126078' : 'white'}`,
                color: `${patientHistory.procedure.having === 'Yes' ? 'white' : '#126078'}`,
                '&:hover': {
                  color: '#126078'
                }
              }}
            >
              Yes
            </Button>
            <Button
              className={`${patientHistory.procedure.having === 'No' && 'selectOptionActive'}`}
              onClick={() => handleButtonClick('No')}
              sx={{
                backgroundColor: `${patientHistory.procedure.having === 'No' ? '#126078' : 'white'}`,
                color: `${patientHistory.procedure.having === 'No' ? 'white' : '#126078'}`,
                '&:hover': {
                  color: '#126078'
                }
              }}
            >
              No
            </Button>
            <Button
              className={`${patientHistory.procedure.having === "Don't Know" && 'selectOptionActive'}`}
              onClick={() => handleButtonClick("Don't Know")}
              sx={{
                backgroundColor: `${patientHistory.procedure.having === "Don't Know" ? '#126078' : 'white'}`,
                color: `${patientHistory.procedure.having ===  "Don't Know" ? 'white' : '#126078'}`,
                '&:hover': {
                  color: '#126078'
                }
              }}
            >
              Don't Know
            </Button>
          </ButtonGroup>
        </Grid>

        <Dialog
          open={openSelectProcedure}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* which procedure have you undergone */}
          <DialogContent>
            {openSelectProcedure && (
              <Box>
                <h4 style={{ margin: '0 0 10px 0' }}>Which procedures have you undergone?</h4>
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
                    setOpenSelectProcedure(false);
                    setOpenAddProcedure(true);
                    setAddProcedure({ surgery: '' });
                    setOpenEditDataDetail(false);
                    setOpenEditHandler(false);
                    setOpenDeleteHandler(false);
                  }}
                >
                  Add
                </Button>
                {allProcedure.length > 0 && (
                  <IconButton
                    style={{ marginLeft: '2px' }}
                    title="Edit Procedure"
                    onClick={() => {
                      setOpenSelectProcedure(false);
                      setOpenAddProcedure(false);
                      setAddProcedure({ surgery: '' });
                      setOpenEditDataDetail(false);
                      setOpenEditHandler(true);
                      setOpenDeleteHandler(false);
                    }}
                  >
                    <Edit fontSize="small" style={{ color: 'blue' }} />
                  </IconButton>
                )}

                {allProcedure.length > 0 && (
                  <IconButton
                    style={{ marginLeft: '2px' }}
                    title="Delete Procedure"
                    onClick={() => {
                      setOpenSelectProcedure(false);
                      setOpenAddProcedure(false);
                      setAddProcedure({ surgery: '' });
                      setOpenEditDataDetail(false);
                      setOpenEditHandler(false);
                      setOpenDeleteHandler(true);
                    }}
                  >
                    <Delete fontSize="small" style={{ color: 'red' }} />
                  </IconButton>
                )}
                {loader ? (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </div>
                ) : (
                  <>
                    {allProcedure.length === 0 ? (
                      <>
                        <h4 className="noFoundOPd" style={{ marginBottom: '10px' }}>
                          Procedure Not Available, Please Add...
                        </h4>
                      </>
                    ) : (
                      <>
                        {procedure.length > 0 ? (
                          <Box style={{ paddingTop: '10px' }}>
                            {procedure.map((val, ind) => {
                              let pre = false;
                              let selectedProcedure = {
                                surgery: val.surgery,
                                when: '',
                                _id: val._id
                              };

                              patientHistory.procedure.which.forEach((v) => {
                                if (val.surgery === v.surgery && v.when !== '' && val._id === v._id) {
                                  selectedProcedure = {
                                    surgery: v.surgery,
                                    when: v.when,
                                    _id: v._id
                                  };
                                }
                              });

                              const ids = new Set(patientHistory?.procedure?.which?.map((d) => d._id));
                              if (ids?.has(val?._id) || procedureId === val?._id) {
                                pre = true;
                              }

                              return (
                                <Chip
                                  key={ind}
                                  sx={{
                                    borderWidth: 2, // Increase border thickness
                                    borderColor: pre ? 'primary.main' : 'secondary.main',
                                    borderStyle: 'solid',
                                    mr: 1,
                                    my: 1
                                  }}
                                  variant={pre ? 'default' : 'outlined'}
                                  color={pre ? 'primary' : 'default'}
                                  label={val.surgery}
                                  onClick={() => {
                                    setProcedureId(val?._id);
                                    setError('');
                                    setOpenAddProcedure(false);
                                    setOpenDuration(true);
                                    setDuration(selectedProcedure);
                                    setOpenSelectProcedure(false);
                                    setOpenEditDataDetail(false);
                                    setOpenEditHandler(false);
                                    setOpenDeleteHandler(false);
                                  }}
                                  onDelete={
                                    pre
                                      ? () => {
                                          let updatedProcedures = patientHistory.procedure.which.filter((vM) => vM.surgery !== val.surgery);

                                          setPatientHistory((prev) => ({
                                            ...prev,
                                            procedure: {
                                              having: patientHistory.procedure.having,
                                              which: updatedProcedures
                                            }
                                          }));

                                          setOpenEditDataDetail(false);
                                          setOpenEditHandler(false);
                                          setOpenDeleteHandler(false);
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
                  </>
                )}
                <Button
                  sx={{ my: 1 }}
                  onClick={() => {
                    setOpenSelectProcedure(false);
                  }}
                  variant="contained"
                >
                  Cancel
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDuration}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* after clicking on procedure clip  */}
          <DialogContent>
            {openDuration && (
              <Box className="selectedPtCategory" sx={{ width: 400 }}>
                <h4>When was the {duration.surgery} done?</h4>
                <Box className="sinceFormat">
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
                    return (
                      <Chip
                        key={inx}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: v === duration.when ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        variant={v === duration.when ? 'default' : 'outlined'}
                        color={v === duration.when ? 'primary' : 'default'}
                        className={`${v === duration.when ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                        label={sinceData}
                        onClick={() => {
                          setDuration((prev) => {
                            return { ...prev, when: v };
                          });
                        }}
                      />
                    );
                  })}

                  <Button className="button-87" onClick={handleSince}>
                    Add
                  </Button>
                </Box>
                <Button
                  className="addBtn"
                  style={{ marginTop: '10px' }}
                  onClick={() => {
                    if (duration.when !== '') {
                      let sM = [
                        ...patientHistory.procedure.which,
                        {
                          surgery: duration.surgery,
                          _id: duration._id,
                          when: duration.when
                        }
                      ];
                      sM = [...new Map(sM.map((item) => [item['surgery'], item])).values()];

                      setPatientHistory((prev) => {
                        return {
                          ...prev,
                          procedure: {
                            having: patientHistory.procedure.having,
                            which: sM
                          }
                        };
                      });
                    }
                    setOpenDuration(false);
                    setOpenSelectProcedure(true);
                  }}
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setOpenDuration(false);
                    setOpenSelectProcedure(true);
                  }}
                  variant="contained"
                  sx={{ marginTop: '10px', marginLeft: '10px' }}
                >
                  cancel
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={sinceOpen}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* since */}
          <DialogContent>
            {sinceOpen && (
              <Box>
                <TextField
                  fullWidth
                  label="Since"
                  variant="outlined"
                  name="since"
                  value={sinceValue}
                  onChange={(e) => {
                    setSinceValue(e.target.value);
                  }}
                  style={{ marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSinceSubmit}>
                    Save
                  </Button>
                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSinceClose}>
                    Close
                  </Button>
                </div>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openAddProcedure}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* add procedure name  */}
          <DialogContent>
            {openAddProcedure && (
              <Box className="selectedPtCategory" style={{ width: '400px' }}>
                <h4>Add Procedure Name</h4>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="surgery"
                  value={addProcedure.surgery}
                  onChange={(e) => {
                    setAddProcedure({ surgery: e.target.value });
                    setError('');
                  }}
                  error={error !== '' ? true : false}
                  helperText={error}
                  style={{ margin: '10px 0' }}
                />
                <Button className="addBtn" onClick={handleSubmitProcedure} variant="contained">
                  Save
                </Button>
                <Button
                  className="addBtn"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    setOpenAddProcedure(false);
                    setOpenSelectProcedure(true);
                  }}
                  variant="contained"
                >
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
          {/* Edit procedure  */}
          <DialogContent>
            {openEditHandler && (
              <Box className="selectedPtCategory">
                <h4>Edit Procedure</h4>
                <Box className="selectedCategory">
                  {allProcedure.map((val, ind) => {
                    return (
                      <Chip
                        key={ind}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: 'secondary.main',
                          borderStyle: 'solid',
                          m: 1
                        }}
                        variant={'outlined'}
                        color={'primary'}
                        className="selectProblem"
                        label={val.surgery}
                        onClick={() => {
                          setOpenEditHandler(false);
                          setOpenEditDataDetail(true);
                          setOpenDeleteHandler(false);
                          setAddProcedure(val);
                        }}
                      />
                    );
                  })}
                </Box>
                <Button
                  className="addBtn"
                  sx={{ m: 1 }}
                  onClick={() => {
                    setOpenEditHandler(false);
                    setOpenSelectProcedure(true);
                  }}
                  variant="contained"
                >
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
          {/* update peocedure  */}
          <DialogContent>
            {openEditDataDetail && (
              <Box style={{ width: '400px' }} className="selectedPtCategory">
                <h4>Update Procedure</h4>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="surgery"
                  value={addProcedure.surgery}
                  onChange={(e) => {
                    setAddProcedure((prev) => {
                      return { ...prev, surgery: e.target.value };
                    });
                    setError('');
                  }}
                  error={error !== '' ? true : false}
                  helperText={error}
                  style={{ margin: '10px 0' }}
                />
                <Button className="addBtn" onClick={handleUpdateSubmitProcedure} variant="contained">
                  Save
                </Button>
                <Button
                  sx={{ m: 1 }}
                  onClick={() => {
                    setOpenEditDataDetail(false);
                    setOpenSelectProcedure(true);
                  }}
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
          {/* delete procedure */}
          <DialogContent>
            {openDeleteHandler && (
              <Box style={{ width: '400px' }} className="selectedPtCategory">
                <h4>Delete Procedure</h4>
                <Box className="selectedCategory">
                  {allProcedure.map((val, ind) => {
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
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: exist ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          ml: 1,
                          my: 1
                        }}
                        variant={exist ? 'default' : 'outlined'}
                        color={exist ? 'primary' : 'default'}
                        label={val.surgery}
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

                <Button variant="contained" className="addBtn" onClick={handleSaveDeleteProcedure}>
                  Save
                </Button>
                <Button
                  sx={{ ml: 1 }}
                  onClick={() => {
                    setOpenDeleteHandler(false);
                    setOpenSelectProcedure(true);
                  }}
                  variant="contained"
                >
                  Cancel
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Grid>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Procedure;

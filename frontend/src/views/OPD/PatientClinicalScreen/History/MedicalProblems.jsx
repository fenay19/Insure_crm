import { Add, Close, Delete, Edit, Search } from '@mui/icons-material';
import { Box, Button, Chip, Dialog, DialogContent, Grid, IconButton, Input, InputAdornment, TextField } from '@mui/material';
import REACT_APP_BASE_URL, { post, remove, retrieveToken } from 'api/api';
import axios from 'axios';
import Loader from 'component/Loader/Loader';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ButtonGroup, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

const MedicalProblems = ({
  departmentId,
  medicalCategory,
  activeStep,
  patientHistory,
  setPatientHistory,
  allMedicalProblems,
  since,
  sinceFunction,
  getAllMasterData
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [mostusedmedicalProblems, setmostusedMedicalProblems] = useState([]);
  const [medicalProblems, setMedicalProblems] = useState([]);

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
  const token = retrieveToken();

  const handleSince = () => {
    setSinceOpen(true);
    setOpenMedicalPro(false);
  };

  const handleSinceClose = () => {
    setSinceOpen(false);
    setOpenMedicalPro(true);
  };

  const handleSinceSubmit = async () => {
    if (sinceValue === '') {
      return alert('Enter the Since');
    }

    await post('since-master', { since: sinceValue }).then((response) => {
      if (response) {
        sinceFunction();
        setSinceOpen(false);
        setOpenMedicalPro(true);
        setSinceValue('');
      }
    });
  };

  const getMedicalProblem = async () => {
    setLoader(true);
    await axios
      .get(`${REACT_APP_BASE_URL}opd/medical-problem/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        setMedicalProblems(response.data.data);
        setmostusedMedicalProblems(response.data);
        setLoader(false);
      })
      .catch((error) => {});
  };


  const deleteSince = async (id) => {
    await remove(`since-master/delete/${id}`).then((response) => {
      if (response) {
        sinceFunction();
      }
    });
  };

  useEffect(() => {
    getMedicalProblem();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      let medP = mostusedmedicalProblems.slice();

      patientHistory.medicalProblems.forEach((vv) => {
        if (!medP.some((v) => v.problem === vv.problem)) {
          medP.unshift(vv);
        }
      });
      // if()
      setMedicalProblems(medP);
    } else {
      let med = [];
      allMedicalProblems.forEach((v) => {
        if (v.problem.toLowerCase().includes(e.target.value.toLowerCase())) {
          med.push(v);
        }
      });
      setMedicalProblems(med);
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

  const handleSubmitMedicalProblem = async () => {
    if (openData.problem === '') {
      setError('Enter the Past History');
    } else {
      //call api to store Past History
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/medical-problem`,
          {
            problem: openData.problem,
            departmentId
            // consultantId: JSON.parse(localStorage.getItem("patientConsult"))
            //   .consultantId,
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getMedicalProblem();
          let sM = [response.data.data, ...medicalProblems];
          sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
          setMedicalProblems(sM);
          closeForm();
          toast.success('Past History Created Successfully!!');
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

  const handleUpdateSubmitMedicalProblem = async () => {
    if (openData.problem === '') {
      setError('Enter the Past History');
    } else {
      //call api to store Past History
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/medical-problem/${openData._id}`,
          {
            problem: openData.problem,
            departmentId
            // consultantId: JSON.parse(localStorage.getItem("patientConsult"))
            //   .consultantId,
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getMedicalProblem();

          closeForm();
          toast({
            title: 'Past History Updated Successfully!!',
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

  const handleSaveDeletePastHistory = () => {
    let data = {
      ids: deleteIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/medical-problem`, {
        headers,
        data
      })
      .then(async (response) => {
        await getAllMasterData();
        getMedicalProblem();
        setDeletedIds([]);
        setOpenDeleteHandler(false);
        toast({
          title: 'Past History Deleted Successfully!!',
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

  const [openSelectSince, setOpenSelectSince] = useState(false);
  const [having, setHaving] = useState('');
  const handleButtonClick = (btn) => {
    setHaving(btn);
    setOpenSelectSince(false);

    if (btn === 'No') {
      let sM =
        patientHistory.medicalProblems !== undefined
          ? [...patientHistory.medicalProblems, { ...openData, having: btn }]
          : [{ ...openData, having: btn }];

      sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
      setPatientHistory((prev) => {
        return {
          ...prev,
          medicalProblems: sM
        };
      });

      setOpenMedicalPro(false);
      setOpenData({});
    } else {
      setOpenSelectSince(true);
    }
  };

  console.log('PATIENT HISTORY', patientHistory);
  return (
    <>
      <Grid container spacing={2} height="100%">
        <Grid item xs={8} height="inherit">
          <h2 className="heading">
            {activeStep + 1}. {medicalCategory[activeStep].category}
          </h2>
          {/* <Input
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
            /> */}

          <Button
            style={{ display: 'inline-block' }}
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

          {allMedicalProblems.length > 0 && (
            <IconButton
              style={{ marginLeft: '2px' }}
              title="Edit Past History"
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

          {allMedicalProblems.length > 0 && (
            <IconButton
              style={{ marginLeft: '2px' }}
              title="Delete Past History"
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

          {allMedicalProblems.length === 0 ? (
            <h4 className="noFoundOPd">Past History Not Available, Please Add...</h4>
          ) : (
            <>
              {medicalProblems.length > 0 ? (
                <Box style={{ width: '400px' }} className="selectedCategory">
                  {medicalProblems.map((val, ind) => {
                    let pre = false;
                    const filteredMedicalProblems = patientHistory?.medicalProblems?.filter((d) => d.having !== 'No');

                    // Create a Set of IDs from filtered data
                    const ids = new Set(filteredMedicalProblems?.map((d) => d._id));
                    if (ids?.has(val?._id) || openData?._id === val?._id) {
                      pre = true;
                    }
                    return (
                      <Chip
                        key={ind}
                        // style={{
                        //   margin: '5px',
                        //   backgroundColor: pre ? '#126078' : '', // Change background color if selected
                        //   color: pre ? '#fff' : ''
                        // }}
                        sx={{
                          borderWidth: 2,
                          borderColor: pre ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        color={pre ? 'primary' : 'default'}
                        variant={pre ? 'default' : 'outlined'}
                        // variant="filled"
                        label={val.problem}
                        onClick={() => {
                          let med = {
                            _id: val._id,
                            problem: val.problem,
                            since: ''
                          };
                          patientHistory.medicalProblems !== undefined &&
                            patientHistory.medicalProblems.forEach((v) => {
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
                                patientHistory.medicalProblems.forEach((vM) => {
                                  if (vM._id === val._id) {
                                    medPro.push({
                                      ...vM,
                                      having: 'No',
                                      since: ''
                                    });
                                  } else {
                                    medPro.push(vM);
                                  }
                                });
                                setPatientHistory((prev) => {
                                  return {
                                    ...prev,
                                    medicalProblems: medPro
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
        </Grid>

        <Dialog
          open={openAddMedicalPro}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* Add past history */}
          <DialogContent>
            {openAddMedicalPro && (
              <Grid item xs={4} className="ptData">
                <Box className="selectedPtCategory" sx={{ width: 400 }}>
                  <h4>Add Past History</h4>
                  <TextField
                    sx={{ mt: 2 }}
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
                  <Button variant="contained" onClick={handleSubmitMedicalProblem}>
                    Save
                  </Button>
                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    onClick={() => {
                      setOpenAddMedicalPro(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openEditHandler}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* Edit past history  */}
          <DialogContent>
            {openEditHandler && (
              <Grid item xs={4} className="ptData">
                <Box className="selectedPtCategory" sx={{ width: 400 }}>
                  <h4>Edit Past History</h4>
                  <Box className="selectedCategory" sx={{ mt: 2 }}>
                    {allMedicalProblems.map((val, ind) => {
                      return (
                        <Chip
                          key={ind}
                          // style={{ margin: '5px' }}
                          className="selectProblem"
                          label={val.problem}
                          color="secondary"
                          variant="outlined"
                          sx={{ borderWidth: 2, borderStyle: 'solid', borderColor: 'secondary.main', p: 1, mr: 1, mt: 1 }}
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
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenEditHandler(false);
                    }}
                    sx={{ mt: 2 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openEditDataDetail}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* update past history  */}
          <DialogContent>
            {openEditDataDetail && (
              <Grid item xs={4} className="ptData">
                <Box className="selectedPtCategory" sx={{ width: 400 }}>
                  <h4>Update Past History</h4>
                  <TextField
                    sx={{ mt: 2 }}
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
                  <Button variant="contained" onClick={handleUpdateSubmitMedicalProblem}>
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ ml: 2 }}
                    onClick={() => {
                      setOpenEditDataDetail(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={sinceOpen}
          
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/*  since after clicking add  */}
          <DialogContent>
            {sinceOpen && (
              <Grid item xs={4} className="ptData">
                <Box sx={{  width: '300px' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSinceSubmit}>
                      Save
                    </Button>
                    {/* <Close onClick={handleSinceClose} /> */}
                    <Button
                      variant="contained"
                      className="addBtn"
                      style={{ marginTop: '10px', marginLeft: '10px' }}
                      onClick={()=>{setSinceOpen(false)
                        setOpenMedicalPro(true)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDeleteHandler}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* delete past history */}
          <DialogContent>
            {openDeleteHandler && (
              <Grid item xs={4} className="ptData">
                <Box sx={{ width: 400 }} className="selectedPtCategory">
                  <h4>Delete Past History</h4>
                  <Box className="selectedCategory" sx={{ mt: 2 }}>
                    {allMedicalProblems.map((val, ind) => {
                      let exist = false;
                      deleteIds.forEach((v) => {
                        if (val._id === v) {
                          exist = true;
                        }
                      });
                      return (
                        <Chip
                          key={ind}
                          // style={{ margin: '5px' }}
                          sx={{
                            borderWidth: 2,
                            borderColor: exist ? 'primary.main' : 'secondary.main',
                            borderStyle: 'solid',
                            mr: 1,
                            my: 1
                          }}
                          color={exist ? 'primary' : 'default'}
                          variant={exist ? 'default' : 'outlined'}
                          className={exist ? 'selectProblemDelete' : 'selectProblem'}
                          label={val.problem}
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

                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeletePastHistory}>
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    className="addBtn"
                    sx={{ marginTop: '10px', ml: 2 }}
                    onClick={() => {
                      setOpenDeleteHandler(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openMedicalPro}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* after clicking patient history */}
          {openMedicalPro && (
            <Grid item xs={4} className="ptData">
              <Box sx={{ width: 400, padding: '1rem' }} className="selectedPtCategory">
                <ButtonGroup variant="outlined" aria-label="Basic button group" style={{ margin: '10px 0', display: 'block' }}>
                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: having === 'Yes' ? '#126078' : 'transparent',
                      color: having === 'Yes' ? 'white' : 'black',
                      '&:hover': { backgroundColor: '#0f4d5c', color: 'white' }
                    }}
                    onClick={() => handleButtonClick('Yes')}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: patientHistory?.medicalProblem?.having === 'No' ? '#126078' : 'transparent',
                      color: patientHistory?.medicalProblem?.having === 'No' ? 'white' : 'black',
                      '&:hover': { backgroundColor: '#0f4d5c', color: 'white' }
                    }}
                    onClick={() => handleButtonClick('No')}
                  >
                    No
                  </Button>
                </ButtonGroup>

                {openSelectSince && (
                  <>
                    <h4>How long have patient has {openData.problem}?</h4>
                    <Box sx={{ width: '100%', height: '100%', my: 2 }} className="sinceFormat">
                      {since.length > 0 ? (
                        since.map((v, inx) => {
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

                          let isSelected = v === openData.since; // Check if selected

                          return (
                            <Chip
                              key={inx}
                              sx={{
                                borderWidth: 2,
                                borderColor: isSelected ? 'primary.main' : 'secondary.main',
                                borderStyle: 'solid',
                                mr: 1,
                                my: 1
                              }}
                              color={isSelected ? 'primary' : 'default'}
                              variant={isSelected ? 'default' : 'outlined'}
                              className={`${isSelected ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                              label={sinceData}
                              onDelete={() => deleteSince(v._id)}
                              onClick={() => {
                                setOpenData((prev) => {
                                  return { ...prev, since: v, having: having };
                                });
                              }}
                              deleteIcon={<Close style={{ color: isSelected ? 'white' : 'inherit', fontSize: '14px' }} />}
                            />
                          );
                        })
                      ) : (
                        <p style={{ color: 'red', textAlign: 'center' }}>No data available</p>
                      )}
                      <Button onClick={handleSince} className="button-87">
                        Add
                      </Button>
                    </Box>
                  </>
                )}

                <Button
                  variant="contained"
                  className="addBtn"
                  style={{ marginTop: '10px' }}
                  onClick={() => {
                    if (openData.since !== '') {
                      let sM =
                        patientHistory.medicalProblems !== undefined
                          ? [...patientHistory.medicalProblems, { ...openData, since: openData.since }]
                          : [{ ...openData, since: openData.since }];

                      sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
                      setPatientHistory((prev) => {
                        return {
                          ...prev,
                          medicalProblems: sM
                        };
                      });
                    }
                    setOpenData({});
                    setOpenMedicalPro(false);
                  }}
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setOpenMedicalPro(false);
                  }}
                  variant="contained"
                  sx={{ marginTop: '10px', marginLeft: '10px' }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          )}
        </Dialog>
      </Grid>
      {/* <ToastContainer /> */}
    </>
  );
};

export default MedicalProblems;
